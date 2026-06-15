"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Calendar, Clock, User, Mail, FileText, ChevronLeft, ChevronRight, Check } from "lucide-react";
import confetti from "canvas-confetti";

const standardSlots = [
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function CalendarBooking() {
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");

  const formattedDateStr = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : "";

  // Query booked slots for the selected date
  const { data: bookedSlots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["booked-slots", formattedDateStr],
    queryFn: async () => {
      if (!formattedDateStr) return [];
      const res = await fetch(`/api/bookings?date=${formattedDateStr}`);
      if (!res.ok) throw new Error("Failed to fetch slots");
      return res.json();
    },
    enabled: !!formattedDateStr,
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      date: string;
      time: string;
      purpose: string;
    }) => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit booking request");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Booking request submitted successfully!");
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
      setName("");
      setEmail("");
      setPurpose("");
      setSelectedTime("");
      queryClient.invalidateQueries({ queryKey: ["booked-slots", formattedDateStr] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit booking request.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !name || !email || !purpose) {
      toast.error("Please fill in all booking fields.");
      return;
    }
    mutation.mutate({
      name,
      email,
      date: formattedDateStr,
      time: selectedTime,
      purpose,
    });
  };

  // Calendar Helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const getDaysInMonth = () => {
    const totalDays = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    return { totalDays, startDay };
  };

  const { totalDays, startDay } = getDaysInMonth();
  const daysArray = [];

  // Blank padding cells
  for (let i = 0; i < startDay; i++) {
    daysArray.push(null);
  }

  // Active dates
  for (let i = 1; i <= totalDays; i++) {
    daysArray.push(new Date(year, month, i));
  }

  const isPastDay = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day < today;
  };

  const isToday = (day: Date) => {
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <section id="booking" className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground">Book a Meeting</h2>
          <div className="h-1.5 w-20 bg-primary mx-auto rounded-full mt-4" />
          <p className="text-muted-foreground mt-4 text-base">
            Need to discuss a project, query, or job role? Pick an available date and time slot below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar Picker Card */}
          <div className="lg:col-span-7 glass p-6 rounded-3xl border border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {monthNames[month]} {year}
              </h3>
              <div className="flex space-x-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg hover:bg-muted border border-border cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg hover:bg-muted border border-border cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div>
              {/* Weekday headers */}
              <div className="grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground mb-4">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2">
                {daysArray.map((day, idx) => {
                  if (!day) return <div key={idx} />;

                  const past = isPastDay(day);
                  const selected =
                    selectedDate &&
                    day.getDate() === selectedDate.getDate() &&
                    day.getMonth() === selectedDate.getMonth() &&
                    day.getFullYear() === selectedDate.getFullYear();

                  return (
                    <button
                      key={idx}
                      disabled={past}
                      onClick={() => {
                        setSelectedDate(day);
                        setSelectedTime("");
                      }}
                      className={`aspect-square flex items-center justify-center text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                        past
                          ? "text-muted-foreground/30 line-through cursor-not-allowed"
                          : selected
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                          : isToday(day)
                          ? "border border-primary text-primary font-bold hover:bg-primary/10"
                          : "text-foreground hover:bg-muted border border-transparent"
                      }`}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time & Info details */}
          <div className="lg:col-span-5 space-y-6">
            {selectedDate ? (
              <div className="glass p-6 rounded-3xl border border-border shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span>Slots on {selectedDate.toDateString()}</span>
                </h3>

                {/* Slots Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {standardSlots.map((slot) => {
                    const isBooked = bookedSlots?.includes(slot);
                    const isSelected = selectedTime === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          isBooked
                            ? "bg-muted-foreground/10 border-border text-muted-foreground/45 line-through cursor-not-allowed"
                            : isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                            : "bg-background text-foreground border-border hover:border-primary/50"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>

                {/* Booking form */}
                {selectedTime && (
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-border animate-fade-in">
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                      <Clock size={16} className="text-primary" />
                      <span>Confirm {selectedTime} Session</span>
                    </h4>

                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <User size={12} />
                        <span>Name</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-xs"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Mail size={12} />
                        <span>Email</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-xs"
                      />
                    </div>

                    {/* Purpose */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <FileText size={12} />
                        <span>Purpose / Agenda</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="Discuss portfolio development..."
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-xs resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 text-xs disabled:opacity-50 cursor-pointer"
                    >
                      {mutation.isPending ? (
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check size={14} />
                          <span>Request Session</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="glass p-6 rounded-3xl border border-border shadow-sm text-center py-16 text-muted-foreground flex flex-col items-center gap-3">
                <Calendar size={40} className="text-muted-foreground/45" />
                <p className="text-sm">Please select a date on the calendar to view available time slots.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
