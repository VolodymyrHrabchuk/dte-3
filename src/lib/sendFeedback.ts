// lib/sendFeedback.ts
export type SendFeedbackPayload = {
  overallRating?: number | null;
  helpfulRating?: number | null;
  engagingRating?: number | null;
  freeText?: string;
  lengthChoice?: "long" | "right" | "short" | null;
  daysPerWeek?: number | null;
  notes?: string;
  name?: string;
  meta?: Record<string, unknown>;
  sheet?: string;
};

export async function sendFeedback(payload: SendFeedbackPayload) {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `Submit failed (${res.status})`);
  }
  return res.json();
}