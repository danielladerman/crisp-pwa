import { Collapsible } from "@/components/Collapsible";

export const metadata = { title: "Playbook — Crisp" };

const sections = [
  {
    title: "The 5-Second Reset",
    content: [
      "Before answering a question, starting a video, or replying in a meeting:",
      "1. Stop. Feel the urge to speak. Don't.",
      "2. Exhale. One physiological sigh — double inhale through nose, long exhale through mouth.",
      "3. Find your point. \"What is the ONE thing I want them to walk away knowing?\"",
      "4. Say that one thing. Then stop.",
      "5. Wait. Let silence do the work.",
    ],
  },
  {
    title: "ACQ Framework",
    content: [
      "For answering questions without rambling — meetings, calls, client check-ins:",
      "A — Answer the question in one clear sentence",
      "C — Context — one supporting detail, only if needed",
      "Q — Question — redirect: \"Does that answer what you were looking for?\"",
      "",
      "Example: \"The MRR numbers are now accurate. I found two issues — annual plans weren't being counted and some churned users were showing active. Both fixed. Want me to walk through the dashboard?\"",
    ],
  },
  {
    title: "BLUF Method",
    content: [
      "Bottom Line Up Front — for every email, DM, video script, and status update:",
      "1. First sentence = the point (What do I need to know or do?)",
      "2. Second sentence = one piece of context (Why should I care?)",
      "3. Third sentence = next step (What happens now?)",
      "",
      "Example: \"I built an AI support agent that handles 80% of tickets for a drone SaaS company. Saw your team is hiring for support — this might save you the hire. Worth a 15-min call?\"",
    ],
  },
  {
    title: "80/20 Listening Rule",
    content: [
      "\"The most interesting person in the room is the most interested person in the room.\"",
      "Speak 20% of the time, listen 80%",
      "Your 20% should be questions and brief reflections — not opinions, not stories, not solutions",
      "After a call, write down: what did I learn that I would have missed if I'd talked more?",
    ],
  },
  {
    title: "Record & Review",
    content: [
      "Three-layer self-analysis after recording yourself:",
      "1. Auditory — Listen WITHOUT watching. Notice: fillers, pace, pitch variation, breathing.",
      "2. Visual — Watch on MUTE. Notice: hand gestures, eye contact, facial expressions, nervous tics.",
      "3. Verbal — Read the transcript. Notice: word choice, repetition, unnecessary qualifiers, whether the point lands in the first sentence.",
    ],
  },
  {
    title: "Pattern-Breaking Checklist",
    content: [
      "The 6 patterns to watch for and their fixes:",
      "",
      "Repeating the same idea 2-3 times → Say it once, then stop. Use a 2-second silent pause instead of rephrasing.",
      "",
      "Hedging (\"I would say,\" \"I feel like\") → BLUF it. State the point directly. Drop the qualifier.",
      "",
      "Tangent spirals → ACQ. Answer first, context second, redirect with a question.",
      "",
      "Safety checks (\"if that makes sense\") → Replace with silence. If you said it clearly, trust that they got it.",
      "",
      "Runaway lists → Pick ONE. \"The most important thing is X.\"",
      "",
      "Over-preparing instead of doing → Set a timer. Record. Post. The cost of imperfection is lower than the cost of delay.",
    ],
  },
];

export default function PlaybookPage() {
  return (
    <div className="mx-auto max-w-lg px-5 pt-8 pb-6">
      <h1 className="text-2xl font-semibold text-ink">Playbook</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Quick-reference frameworks for speaking, thinking, and connecting.
      </p>

      <div className="mt-6 space-y-1 divide-y divide-paper-deep">
        {sections.map((section) => (
          <Collapsible key={section.title} title={section.title} defaultOpen={false}>
            <div className="space-y-2 text-sm text-ink-muted leading-relaxed">
              {section.content.map((line, i) =>
                line === "" ? (
                  <div key={i} className="h-2" />
                ) : (
                  <p key={i}>{line}</p>
                )
              )}
            </div>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
