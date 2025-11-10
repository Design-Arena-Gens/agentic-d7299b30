import { NextResponse } from "next/server";
import { generatePlan, type GTMInput } from "@/lib/planGenerator";

function normalizeString(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }
  return "";
}

function parseBody(data: unknown): GTMInput {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid payload");
  }

  const payload = data as Record<string, unknown>;

  const stage = (payload.stage as GTMInput["stage"]) ?? "beta";
  const budgetLevel =
    (payload.budgetLevel as GTMInput["budgetLevel"]) ?? "balanced";
  const launchTimeline =
    (payload.launchTimeline as GTMInput["launchTimeline"]) ?? "quarter";
  const focusAreas = Array.isArray(payload.focusAreas)
    ? (payload.focusAreas.filter((item): item is string => typeof item === "string") as string[])
    : [];

  return {
    productName: normalizeString(payload.productName) || "Your Product",
    productDescription:
      normalizeString(payload.productDescription) ||
      "delivers a step-change improvement for your customers",
    targetAudience:
      normalizeString(payload.targetAudience) ||
      "A clearly defined ICP segment with acute pain",
    stage,
    budgetLevel,
    launchTimeline,
    brandVoice:
      normalizeString(payload.brandVoice) ||
      "Confident, data-backed, customer-obsessed storytelling",
    adoptionGoal:
      normalizeString(payload.adoptionGoal) ||
      "Acquire 50 high-fit customers within the first 90 days",
    focusAreas
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = parseBody(body);
    const plan = generatePlan(input);
    return NextResponse.json({ plan });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}
