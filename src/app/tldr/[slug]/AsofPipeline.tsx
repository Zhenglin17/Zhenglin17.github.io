"use client";

import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUp } from "lucide-react";

const DEMO = "https://zhenglin17.github.io/asof/";
const CODE = "https://github.com/Zhenglin17/asof/tree/main/";

type Stage = {
  id: string;
  name: string;
  text: string;
  demo?: { anchor: string; label: string };
  code?: string;
  planned?: boolean;
};

// Facts follow the asof README and docs/commands.md.
const FLOW: Stage[] = [
  {
    id: "sources",
    name: "Sources",
    text: "Daily bars and corporate actions from Alpaca, filings and share counts from SEC EDGAR.",
    code: "src/asof/ingest",
  },
  {
    id: "store",
    name: "Store",
    text: "Daily bars for every listed US symbol since 2020, delisted ones included, and 11,522 filings in 703,614 citable chunks. Every row carries the instant it became knowable, and a security master maps each symbol-day to a permanent security across renames and ticker reuse.",
    demo: { anchor: "time", label: "Filing time machine" },
    code: "src/asof/store",
  },
  {
    id: "scan",
    name: "Scan",
    text: "Each evening, plain code lists candidates from data visible at 20:00 New York, such as post-earnings gaps or B-Xtrender entries among liquid stocks.",
    code: "src/asof/scan",
  },
  {
    id: "evidence",
    name: "Evidence",
    text: "Full-text search over the filings that were public at that instant, ranked with statistics of that instant only.",
    demo: { anchor: "decisions", label: "Every judgement, with its sources" },
    code: "src/asof/evidence",
  },
  {
    id: "judge",
    name: "Judge",
    text: "Rules, or an LLM that fills a fixed schema: take or pass, a conviction, and claims that each quote a filing. A citation validator rejects any claim that is not a word-for-word quote of a visible chunk of the right company.",
    demo: { anchor: "decisions", label: "Every judgement, with its sources" },
    code: "src/asof/judge",
  },
  {
    id: "execute",
    name: "Execute",
    text: "A simulated executor with ATR-based stops and one re-entry, priced with slippage on both sides.",
    demo: { anchor: "lab", label: "Replays under different position rules" },
    code: "src/asof/execute",
  },
  {
    id: "attribute",
    name: "Attribute",
    text: "Each decision's outcome is its trades summed, and stays hidden until it can no longer change.",
    code: "src/asof/attribute",
  },
  {
    id: "gate",
    name: "Gate",
    text: "Each replay is set against random entries from the same pool on the same dates, corrected for every variant tried, checked walk-forward, and shown beside SPY, QQQ and a top-10 basket.",
    demo: { anchor: "overview", label: "Every strategy tried, on one chart" },
    code: "src/asof/evolve",
  },
];

const SLOW_LOOP: Stage = {
  id: "propose",
  name: "Propose → Approve",
  text: "Next: a slow loop proposes rule changes. A change becomes a new strategy version only after a replay, the gate and human approval.",
  planned: true,
};

const LEAKAGE: Stage = {
  id: "leakage",
  name: "Leakage guards",
  text: "Across every stage: 17 guards against seeing the future, each held by tests, from filings read before they were public to settings tried until one works.",
  demo: { anchor: "leakage", label: "How it avoids seeing the future" },
  code: "docs/leakage.md",
};

const ALL = [...FLOW, SLOW_LOOP, LEAKAGE];
const FAST_LOOP_START = 2; // Scan
const FAST_LOOP_END = 6; // Attribute

function Details({ stage }: { stage: Stage }) {
  return (
    <motion.div
      key={stage.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="rounded-lg bg-stone-100/70 px-4 py-3"
    >
      <p className="text-stone-700 text-sm font-medium mb-1">
        {stage.name}
        {stage.planned && <span className="ml-2 text-xs font-normal text-stone-500">next</span>}
      </p>
      <p className="text-stone-600 text-sm leading-relaxed">{stage.text}</p>
      {(stage.demo || stage.code) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {stage.demo && (
            <a
              href={`${DEMO}#${stage.demo.anchor}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent underline underline-offset-2 decoration-accent/40 hover:decoration-accent"
            >
              Demo: {stage.demo.label} ↗
            </a>
          )}
          {stage.code && (
            <a
              href={`${CODE}${stage.code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent underline underline-offset-2 decoration-accent/40 hover:decoration-accent"
            >
              Code: {stage.code} ↗
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

function NodeButton({
  stage,
  selected,
  onSelect,
  className = "",
}: {
  stage: Stage;
  selected: boolean;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(stage.id)}
      onMouseEnter={() => onSelect(stage.id)}
      className={`rounded-md border px-2 py-1.5 text-xs leading-tight duration-200 ${
        stage.planned ? "border-dashed" : ""
      } ${
        selected
          ? "border-accent text-accent bg-white"
          : "border-stone-300 text-stone-600 bg-stone-50 hover:border-accent/60"
      } ${className}`}
    >
      {stage.name}
    </button>
  );
}

/** Tappable pipeline for the asof detail page: each stage links to its demo section and code. */
export function AsofPipeline() {
  const [selectedId, setSelectedId] = useState(FLOW[0].id);
  const selected = ALL.find((stage) => stage.id === selectedId) ?? FLOW[0];

  return (
    <section className="mb-10" aria-label="How asof works">
      <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-4">How it works</h2>

      {/* Desktop: one row, fast loop bracketed above, slow loop dashed below. */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-8 gap-x-4">
          <p className="col-start-3 col-end-8 row-start-1 text-center text-[11px] text-stone-500 mb-1">
            Fast loop · every evening · deterministic
          </p>
          <div
            className="col-start-3 col-end-8 row-start-2 border-t border-x border-stone-400 rounded-t-md h-2.5 mb-1"
            aria-hidden
          />
          {FLOW.map((stage, i) => (
            <div key={stage.id} className="relative row-start-3 flex" style={{ gridColumnStart: i + 1 }}>
              <NodeButton
                stage={stage}
                selected={stage.id === selectedId}
                onSelect={setSelectedId}
                className="w-full"
              />
              {i < FLOW.length - 1 && (
                <ArrowRight
                  size={12}
                  className="absolute -right-[14px] top-1/2 -translate-y-1/2 text-stone-400"
                  aria-hidden
                />
              )}
            </div>
          ))}
          <div className="relative col-start-3 col-end-9 row-start-4 mt-1 h-4 border-b border-x border-dashed border-stone-400 rounded-b-md" aria-hidden>
            <ArrowUp size={12} className="absolute -left-[6.5px] -top-1.5 text-stone-500" />
          </div>
          <div className="relative col-start-3 col-end-9 row-start-5 flex justify-center -mt-3">
            <NodeButton stage={SLOW_LOOP} selected={selectedId === SLOW_LOOP.id} onSelect={setSelectedId} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <NodeButton stage={LEAKAGE} selected={selectedId === LEAKAGE.id} onSelect={setSelectedId} />
          <span className="text-xs text-stone-500">apply to every stage</span>
        </div>
        <div className="mt-4 min-h-[8.5rem]">
          <AnimatePresence mode="wait">
            <Details stage={selected} />
          </AnimatePresence>
        </div>
      </div>

      {/* Phones: a vertical list; the selected stage opens in place. */}
      <ol className="sm:hidden">
        {[...FLOW, SLOW_LOOP, LEAKAGE].map((stage, i) => (
          <Fragment key={stage.id}>
            {i === FAST_LOOP_START && (
              <li className="text-[11px] text-stone-500 pt-1" aria-hidden>
                Fast loop · every evening
              </li>
            )}
            {i === FAST_LOOP_END + 1 && <li className="h-1" aria-hidden />}
            {stage === LEAKAGE && <li className="h-1" aria-hidden />}
            <li
              className={`pb-1.5 ${
                i >= FAST_LOOP_START && i <= FAST_LOOP_END ? "border-l border-stone-400 pl-3" : ""
              }`}
            >
              <NodeButton
                stage={stage}
                selected={stage.id === selectedId}
                onSelect={setSelectedId}
                className="w-full text-left"
              />
              {stage.id === selectedId && (
                <div className="mt-1.5">
                  <Details stage={stage} />
                </div>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </section>
  );
}
