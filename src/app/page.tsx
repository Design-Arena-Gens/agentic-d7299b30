"use client";

import { FormEvent, useMemo, useState } from "react";
import type { GTMPlan } from "@/lib/planGenerator";

type StageOption = {
  label: string;
  value: "concept" | "beta" | "ga" | "scale";
};

type BudgetOption = {
  label: string;
  value: "lean" | "balanced" | "aggressive";
};

type TimelineOption = {
  label: string;
  value: "2-weeks" | "1-month" | "quarter" | "half-year";
};

const stageOptions: StageOption[] = [
  { label: "Concept / Pre-Beta", value: "concept" },
  { label: "Private Beta", value: "beta" },
  { label: "General Availability", value: "ga" },
  { label: "Scale / Growth Stage", value: "scale" }
];

const budgetOptions: BudgetOption[] = [
  { label: "Lean (scrappy, <$10k/month)", value: "lean" },
  { label: "Balanced (mix of organic + paid)", value: "balanced" },
  { label: "Aggressive (multi-channel, high spend)", value: "aggressive" }
];

const timelineOptions: TimelineOption[] = [
  { label: "Lightning (under 2 weeks)", value: "2-weeks" },
  { label: "Fast (1 month)", value: "1-month" },
  { label: "Quarterly Horizon", value: "quarter" },
  { label: "6 Month Horizon", value: "half-year" }
];

const focusAreaOptions = [
  { label: "Positioning & Narrative", value: "positioning" },
  { label: "Revenue Enablement", value: "enablement" },
  { label: "Lifecycle & Activation", value: "lifecycle" },
  { label: "Experimentation Velocity", value: "experimentation" }
];

type FormState = {
  productName: string;
  productDescription: string;
  targetAudience: string;
  stage: StageOption["value"];
  budgetLevel: BudgetOption["value"];
  launchTimeline: TimelineOption["value"];
  brandVoice: string;
  adoptionGoal: string;
  focusAreas: string[];
};

const defaultState: FormState = {
  productName: "Atlas IQ Copilot",
  productDescription:
    "orchestrates customer research, insight synthesis, and activation workflows with AI agents.",
  targetAudience:
    "Heads of Product Marketing at PLG SaaS companies scaling from Series A to Series C.",
  stage: "ga",
  budgetLevel: "balanced",
  launchTimeline: "quarter",
  brandVoice:
    "Modern, insight-led, customer-obsessed tone with punchy confidence and proof.",
  adoptionGoal: "Land 30 lighthouse customers and $1M ARR in 2 quarters.",
  focusAreas: ["positioning", "enablement", "experimentation"]
};

export default function Page() {
  const [form, setForm] = useState<FormState>(defaultState);
  const [plan, setPlan] = useState<GTMPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPlan = Boolean(plan);

  const focusAreaCopy = useMemo(() => {
    return focusAreaOptions.map((option) => ({
      ...option,
      active: form.focusAreas.includes(option.value)
    }));
  }, [form.focusAreas]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error || "Failed to generate plan");
      }

      const result = (await response.json()) as { plan: GTMPlan };
      setPlan(result.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  function toggleFocusArea(value: string) {
    setForm((prev) => {
      const exists = prev.focusAreas.includes(value);
      return {
        ...prev,
        focusAreas: exists
          ? prev.focusAreas.filter((item) => item !== value)
          : [...prev.focusAreas, value]
      };
    });
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Go-To-Market AI Agent</h1>
        <p>
          Configure the agent with your product context. It synthesizes a
          launch-ready GTM blueprint, spanning positioning, channel plays,
          growth loops, and enablement.
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="productName">Product Name</label>
            <input
              id="productName"
              value={form.productName}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  productName: event.target.value
                }))
              }
              placeholder="Name of your product or agent"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="productDescription">Product Superpower</label>
            <textarea
              id="productDescription"
              value={form.productDescription}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  productDescription: event.target.value
                }))
              }
              placeholder="What transformation does the product deliver?"
            />
          </div>

          <div className="input-group">
            <label htmlFor="targetAudience">Target Audience / ICP</label>
            <textarea
              id="targetAudience"
              value={form.targetAudience}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  targetAudience: event.target.value
                }))
              }
              placeholder="Describe the buyer, their job-to-be-done, and top pains"
            />
          </div>

          <div className="input-group">
            <label htmlFor="stage">Stage</label>
            <select
              id="stage"
              value={form.stage}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  stage: event.target.value as FormState["stage"]
                }))
              }
            >
              {stageOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="budgetLevel">Budget Posture</label>
            <select
              id="budgetLevel"
              value={form.budgetLevel}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  budgetLevel: event.target.value as FormState["budgetLevel"]
                }))
              }
            >
              {budgetOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="launchTimeline">Launch Timeline</label>
            <select
              id="launchTimeline"
              value={form.launchTimeline}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  launchTimeline: event.target.value as FormState["launchTimeline"]
                }))
              }
            >
              {timelineOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="brandVoice">Brand Voice / Vibe</label>
            <textarea
              id="brandVoice"
              value={form.brandVoice}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  brandVoice: event.target.value
                }))
              }
              placeholder="Tone, personality, proof style"
            />
          </div>

          <div className="input-group">
            <label htmlFor="adoptionGoal">North Star Adoption Goal</label>
            <input
              id="adoptionGoal"
              value={form.adoptionGoal}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  adoptionGoal: event.target.value
                }))
              }
              placeholder="e.g. 500 active teams within 90 days"
            />
          </div>

          <div className="input-group">
            <label>Focus Areas</label>
            <div className="grid-two">
              {focusAreaCopy.map((option) => (
                <label key={option.value} className="card" style={{ padding: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input
                      type="checkbox"
                      checked={option.active}
                      onChange={() => toggleFocusArea(option.value)}
                    />
                    <span style={{ fontWeight: 600 }}>{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "rgba(220, 38, 38, 0.1)",
                color: "#b91c1c",
                padding: "10px 14px",
                borderRadius: "10px",
                fontWeight: 600
              }}
            >
              {error}
            </div>
          )}

          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? "Synthesizing GTM Plan..." : "Generate GTM Blueprint"}
          </button>
        </form>
      </section>

      <section className="card" style={{ position: "relative" }}>
        {!hasPlan && (
          <div style={{ opacity: 0.65 }}>
            <h2>Your GTM blueprint will appear here</h2>
            <p>
              Fill in the product context and the agent will architect a
              full-funnel launch strategy with channel plays, content factory,
              growth experiments, and risk guardrails.
            </p>
          </div>
        )}

        {plan && (
          <article>
            <header className="plan-section">
              <div className="pill">Executive Summary</div>
              <h2 style={{ marginTop: "16px" }}>{form.productName} Launch Command</h2>
              <ul className="list">
                {plan.executiveSummary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </header>

            <section className="plan-section">
              <div className="pill">Objectives</div>
              <ul className="list">
                {plan.keyObjectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </section>

            <section className="plan-section">
              <div className="pill">Audience Intelligence</div>
              <ul className="list">
                {plan.audienceProfile.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="plan-section">
              <div className="pill">Messaging Pillars</div>
              <div className="grid-two">
                {plan.messagingPillars.map((pillar) => (
                  <div className="card" key={pillar.pillar} style={{ padding: "18px" }}>
                    <h3 style={{ marginBottom: "8px" }}>{pillar.pillar}</h3>
                    <ul className="list">
                      {pillar.proofPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="plan-section">
              <div className="pill">Channel Battleplan</div>
              <div className="grid-two">
                {plan.channelPlan.map((channel) => (
                  <div className="card" key={channel.name} style={{ padding: "18px" }}>
                    <div className="badge">{channel.cadence}</div>
                    <h3 style={{ margin: "12px 0 8px" }}>{channel.name}</h3>
                    <p style={{ marginBottom: "12px" }}>{channel.objective}</p>
                    <ul className="list">
                      {channel.plays.map((play) => (
                        <li key={play}>{play}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="plan-section">
              <div className="pill">Launch Timeline</div>
              <div className="grid-two">
                {plan.launchTimeline.map((phase) => (
                  <div className="card" key={phase.phase} style={{ padding: "18px" }}>
                    <div className="badge">{phase.duration}</div>
                    <h3 style={{ margin: "12px 0 8px" }}>{phase.phase}</h3>
                    <h4 style={{ margin: "8px 0" }}>Objectives</h4>
                    <ul className="list">
                      {phase.objectives.map((objective) => (
                        <li key={objective}>{objective}</li>
                      ))}
                    </ul>
                    <h4 style={{ margin: "8px 0" }}>Tactics</h4>
                    <ul className="list">
                      {phase.tactics.map((tactic) => (
                        <li key={tactic}>{tactic}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="plan-section">
              <div className="pill">Content Factory</div>
              <div className="grid-two">
                {plan.contentFactory.map((content) => (
                  <div className="card" key={content.theme} style={{ padding: "18px" }}>
                    <h3 style={{ marginBottom: "6px" }}>{content.theme}</h3>
                    <h4 style={{ margin: "8px 0" }}>Anchor Assets</h4>
                    <ul className="list">
                      {content.assets.map((asset) => (
                        <li key={asset}>{asset}</li>
                      ))}
                    </ul>
                    <h4 style={{ margin: "8px 0" }}>Distribution</h4>
                    <ul className="list">
                      {content.distribution.map((channel) => (
                        <li key={channel}>{channel}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="plan-section">
              <div className="pill">Growth Experiments</div>
              <div className="grid-two">
                {plan.growthExperiments.map((experiment) => (
                  <div className="card" key={experiment.name} style={{ padding: "18px" }}>
                    <h3 style={{ marginBottom: "8px" }}>{experiment.name}</h3>
                    <p>
                      <strong>Hypothesis:</strong> {experiment.hypothesis}
                    </p>
                    <p>
                      <strong>Metric:</strong> {experiment.metric}
                    </p>
                    <p>
                      <strong>Owner:</strong> {experiment.owner}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="plan-section">
              <div className="pill">Measurement Framework</div>
              <ul className="list">
                {plan.measurementFramework.map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>
            </section>

            <section className="plan-section">
              <div className="pill">Risk & Mitigation</div>
              <div className="grid-two">
                {plan.riskMitigation.map((entry) => (
                  <div className="card" key={entry.risk} style={{ padding: "18px" }}>
                    <h3 style={{ marginBottom: "8px" }}>{entry.risk}</h3>
                    <p>{entry.mitigation}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="plan-section">
              <div className="pill">Next Agentic Steps</div>
              <ul className="list">
                {plan.followUps.map((prompt) => (
                  <li key={prompt}>{prompt}</li>
                ))}
              </ul>
            </section>
          </article>
        )}
      </section>
    </main>
  );
}
