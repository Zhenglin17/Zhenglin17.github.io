import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navigation } from "../components/nav";
import { Reveal } from "../components/reveal";
import { items, ExperienceItem } from "./data";

// Desktop columns stay independent so cards of different heights sit staggered.
const COL1_SLUGS = ["plantops", "research-agent", "feature-matching", "solo"];
const COL2_SLUGS = ["asof", "normal-flow", "fruit-counting", "block-grabbing"];
const ALL_SLUGS   = ["plantops", "asof", "research-agent", "normal-flow", "feature-matching", "fruit-counting", "solo", "block-grabbing"];

const SKILLS = [
  "Python", "PyTorch", "NumPy", "pandas", "DuckDB", "TypeScript", "C", "Linux", "Git", "MATLAB",
  "Computer Vision", "Deep Learning", "Robotics", "Sensor Fusion", "3D Vision",
  "LLM Pipelines", "Data Pipelines", "Backtesting",
];

function Card({ item }: { item: ExperienceItem }) {
  // Datasets stay on the detail page; code and live demos are one click away from the card.
  const surfaceLinks = item.hasDetails
    ? item.links.filter((link) => link.label.startsWith("Code") || link.label === "Live Demo")
    : item.links;

  return (
    <div
      className={`relative flex flex-col rounded-lg p-4 ${
        item.hasDetails
          ? `group border border-stone-200 hover:border-accent/60 hover:bg-stone-50 hover:shadow-md
             transition-[translate,scale,box-shadow,border-color,background-color] duration-300
             ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[3px] active:translate-y-0 active:scale-[0.985]
             motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100`
          : "border border-stone-100 bg-stone-50/40"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        {item.hasDetails ? (
          <Link
            href={`/tldr/${item.slug}`}
            className="text-stone-800 group-hover:text-accent duration-200 font-medium text-sm leading-snug after:absolute after:inset-0"
          >
            {/* Shares its view-transition name with the detail page h1, so the title
                moves into place on navigation. Inline-block: a wrapped inline box
                would be fragmented, which makes the browser skip the transition. */}
            <span
              className="inline-block"
              style={{ viewTransitionName: `title-${item.slug}`, viewTransitionClass: "card-title" }}
            >
              {item.title}
            </span>
          </Link>
        ) : (
          <span className="text-stone-800 font-medium text-sm leading-snug">{item.title}</span>
        )}
        {item.hasDetails && (
          <ArrowUpRight
            size={15}
            className="shrink-0 mt-0.5 text-accent
                       group-hover:-translate-y-0.5 group-hover:translate-x-0.5
                       duration-200 transition-transform"
          />
        )}
      </div>
      {item.period && <p className="text-stone-500 text-xs mb-2">{item.period}</p>}
      <p className="text-stone-600 text-xs leading-relaxed">{item.summary}</p>
      <div className="flex flex-wrap gap-1 mt-3">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 bg-stone-100 group-hover:bg-stone-200
                       text-stone-600 rounded-full duration-200"
          >
            {tag}
          </span>
        ))}
      </div>
      {surfaceLinks.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {surfaceLinks.map((link) => (
            <a
              key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
              className="relative z-10 text-xs text-accent duration-200
                         underline underline-offset-2 decoration-accent/40 hover:decoration-accent"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TldrPage() {
  const bySlug = Object.fromEntries(items.map((i) => [i.slug, i]));
  const col1 = COL1_SLUGS.map((s) => bySlug[s]);
  const col2 = COL2_SLUGS.map((s) => bySlug[s]);
  const allOrdered = ALL_SLUGS.map((s) => bySlug[s]);

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-6 sm:px-8 pt-28 pb-16 max-w-6xl">
        <div className="lg:grid lg:grid-cols-[5fr_7fr] lg:gap-16 space-y-12 lg:space-y-0">

          {/* ── LEFT: Narrative + Skills ───────────────────── */}
          <div className="flex flex-col gap-10">

            <div>
              <h1 className="text-3xl font-display text-stone-800 mb-2">Zhenglin Zhang</h1>
              <div className="flex flex-col gap-1 text-sm">
                <a href="mailto:zhenglinzhang6@gmail.com"
                   className="text-stone-500 hover:text-accent duration-200 w-fit">
                  zhenglinzhang6@gmail.com
                </a>
                <a href="https://github.com/Zhenglin17" target="_blank"
                   className="text-stone-500 hover:text-accent duration-200 w-fit">
                  github.com/Zhenglin17
                </a>
              </div>
            </div>

            <section>
              <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-4">Narrative</h2>
              <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
                <p>
                  From elementary school, I was on the olympiad math circuit — eight or nine
                  competitions a year, first prize in seven of them. Looking back, I&rsquo;m not
                  sure what the point was beyond training logical thinking. I genuinely wish I
                  had spent more of that time building real interests. That absence set the tone
                  for the years ahead. Middle school was more of the same. In 8th grade, I won
                  first prize at the Math League — a 9th-grade competition. Then in high school,
                  I made the provincial team for the{" "}
                  <span className="text-stone-800 font-medium">National Physics Olympiad</span>.
                  More firsts, same pattern.
                </p>
                <p>
                  I studied Theoretical and Applied Mechanics at{" "}
                  <span className="text-stone-800 font-medium">Peking University</span> as an
                  Outstanding Graduate, then pursued a Master&rsquo;s in Robotics at{" "}
                  <span className="text-stone-800 font-medium">UPenn</span> — my first real
                  exposure to computer vision and 3D vision, which came comparatively late. Then
                  I began a PhD in Computer Science at{" "}
                  <span className="text-stone-800 font-medium">UMD</span>, which I stepped away
                  from after half a year. Maybe that outcome was set long before — back in
                  elementary school, the first time I optimized for a metric without asking why.
                </p>
                <p>
                  This past year, I&rsquo;ve been building things just to explore them. A few
                  friends and I assembled an{" "}
                  <span className="text-stone-800 font-medium">E36 M3 race car from a bare frame</span>
                  , then ran an endurance race at NJMP. I spent months deep in trading — my
                  account fell 60% in one month, then climbed back 50% in three weeks. I explored
                  some simple quantitative and automated methods — still aggressive, but I think
                  life is more about experience than optimization.
                </p>
                <p>
                  Maybe it was when I worked on the car until my back was about to give out, or
                  when I was so exhausted while driving that I nearly fell asleep, or when
                  trading led me to pay close attention to macroeconomics, technological shifts,
                  and the evolution of companies — this is when I truly realized that some things
                  are already reshaping the world quietly but fundamentally. Sometimes I look
                  around at people on the street — happy, relaxed — as if none of these changes
                  affect them. Yet the very skills they are most proud of today may be replaced
                  in the near future.
                </p>
                <p>
                  More recently I built{" "}
                  <span className="text-stone-800 font-medium">asof</span>, a market research rig
                  where data and language models can only use what was public at the time. I also
                  built a{" "}
                  <span className="text-stone-800 font-medium">research digest bot</span> that
                  turns journal feeds into a short brief on Telegram.
                </p>
                <p className="text-stone-700">
                  I&rsquo;m back now — with more clarity and motivation than I&rsquo;ve ever had.{" "}
                  <span className="font-medium">The search continues.</span>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <span key={skill}
                        className="text-xs px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT: Experience ──────────────────────────── */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-4">Experience</h2>

            {/* Mobile: single ordered column */}
            <div className="flex flex-col gap-3 sm:hidden">
              {allOrdered.map((item) => <Reveal key={item.slug}><Card item={item} /></Reveal>)}
            </div>

            {/* Desktop: two flex columns — no grid gaps */}
            <div className="hidden sm:flex gap-3 items-start">
              <div className="flex flex-col gap-3 flex-1">
                {col1.map((item, index) => <Reveal key={item.slug} index={index}><Card item={item} /></Reveal>)}
              </div>
              <div className="flex flex-col gap-3 flex-1">
                {col2.map((item, index) => <Reveal key={item.slug} index={index}><Card item={item} /></Reveal>)}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
