export interface SampleText {
  id: string;
  title: string;
  description: string;
  content: string;
}

export const DEFAULT_SAMPLES: SampleText[] = [
  {
    id: 'ai-boilerplate-markdown',
    title: 'AI Response with Disclaimers & Markdown',
    description: 'Contains AI intros, disclaimers, headers, bold styling, emojis, and repeated sentences.',
    content: `As an AI language model, I would be happy to provide an analysis of modern web development trends! 🚀

### 1. Modern Frameworks

Modern web applications use frameworks like Next.js, React, and Vue. Modern web applications use frameworks like Next.js, React, and Vue.

* **High Performance**: Lightning fast render speeds.
* **Server Components**: Streaming HTML directly from the server.
* **Developer Experience**: Instant HMR and strong typing.

As of my last knowledge cutoff, these tools remain the industry standard for production software.

### 2. Best Practices

Ensure your applications are accessible (WCAG 2.1), responsive, and secure. Ensure your applications are accessible (WCAG 2.1), responsive, and secure.

Please note that I am an AI assistant and this information is provided for educational purposes.

I hope this helps! Let me know if you have any further questions or need anything else!`,
  },
  {
    id: 'email-signatures',
    title: 'Email & Meeting Transcript',
    description: 'Raw email chain with repetitive greeting disclaimers and extra blank lines.',
    content: `Hi Team,

Thank you for reaching out regarding the Q3 roadmap update.

I hope this email finds you well. I hope this email finds you well.

Below are the action items from our sync:

1. Finalize API specs for authentication module.
2. Review database migration scripts with devops.
3. Deploy staging build by Friday 5 PM.


Confidentiality Notice: The contents of this email message and any attachments are intended solely for the addressee(s).

Best regards,
Alex Mercer
Engineering Lead`,
  },
  {
    id: 'raw-scraped-markdown',
    title: 'Scraped Web Article',
    description: 'Raw markdown document with emojis, repetitive bullet points, and trailing spaces.',
    content: `# The Future of Artificial Intelligence 🤖

Artificial intelligence is evolving at an unprecedented pace.  

## Key Highlights 🌟

* **Efficiency**: Automating tedious data entry tasks. ✨
* **Accuracy**: Minimizing human error in analytical processing. 🎯
* **Scalability**: Processing millions of requests concurrently. ⚡

Artificial intelligence is evolving at an unprecedented pace.

### Summary

The technology will continue to transform industries across healthcare, finance, and logistics.

Thank you for reading.`,
  },
];
