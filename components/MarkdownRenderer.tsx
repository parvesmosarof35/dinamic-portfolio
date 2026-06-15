import React from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none 
      prose-headings:font-semibold prose-headings:text-foreground
      prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
      prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3
      prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2
      prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
      prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ul:text-muted-foreground
      prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-ol:text-muted-foreground
      prose-li:mb-1
      prose-a:text-primary prose-a:underline hover:prose-a:opacity-80
      prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
      prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:mb-6 prose-pre:border prose-pre:border-border"
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
