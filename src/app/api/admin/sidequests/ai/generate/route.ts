import { NextRequest, NextResponse } from "next/server";
import { getAdminRequestContext } from "@/lib/adminApiAuth";
import {
  SIDEQUEST_ARCHETYPES,
  SIDEQUEST_DOMAINS,
  type AiQuestGenerationRequest,
  type AiQuestSuggestion,
} from "@/lib/sideQuestAdmin";
const pickFallback = <T,>(value: T | undefined, fallback: T): T =>
  value ?? fallback;

export async function POST(request: NextRequest) {
  const authResult = await getAdminRequestContext(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  let payload: AiQuestGenerationRequest;
  try {
    payload = (await request.json()) as AiQuestGenerationRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const domain =
    payload.domain ?? SIDEQUEST_DOMAINS[Math.floor(Math.random() * SIDEQUEST_DOMAINS.length)];
  const archetype =
    payload.archetype ??
    SIDEQUEST_ARCHETYPES[
      Math.floor(Math.random() * SIDEQUEST_ARCHETYPES.length)
    ];
  const duration = pickFallback(payload.durationMinutes, 20);

  const scaffolds: AiQuestSuggestion[] = Array.from({ length: 5 }).map(
    (_, index) => ({
      title: `Generated Quest ${index + 1}`,
      shortDescription: `A quick ${domain} quest focusing on ${archetype} vibes.`,
      description: `Try this micro-quest inspired by ${payload.vibe ?? "playful reset"}:\n1. Take a breath.\n2. Follow the prompt.\n3. Reflect briefly.`,
      domain,
      archetype,
      estimatedDurationMinutes: Math.max(5, duration + index * 5),
      isChaos: Boolean(payload.vibe?.toLowerCase().includes("chaos")),
      xpAward: {
        emotion: 5 + index,
        clarity: 4,
        discipline: 3,
        momentum: 2,
      },
      tools: {
        journal: payload.requiredTools?.includes("journal") ?? true,
        survey: payload.requiredTools?.includes("survey") ?? false,
        photoProof: payload.requiredTools?.includes("photoProof") ?? false,
        locationTracking:
          payload.requiredTools?.includes("locationTracking") ?? false,
        customPrompts: payload.notes ? [payload.notes] : [],
      },
      tags: ["ai-suggested", domain, archetype],
    })
  );

  return NextResponse.json({
    suggestions: scaffolds,
    promptUsed: null,
  });
}


