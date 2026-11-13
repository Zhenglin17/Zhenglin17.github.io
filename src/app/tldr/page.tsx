import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navigation } from "../components/nav";
import { Reveal } from "../components/reveal";
import { items, ExperienceItem } from "./data";

// Desktop columns stay independent so cards of different heights sit staggered.
const COL1_SLUGS = ["plantops", "feature-matching", "fruit-counting", "solo"];
const COL2_SLUGS = ["asof", "research-agent", "normal-flow", "block-grabbing"];
const ALL_SLUGS   = ["plantops", "asof", "research-agent", "normal-flow", "feature-matching", "fruit-counting", "solo", "block-grabbing"];

// Project names in the Narrative link to their detail pages.
const PROJECT_LINK =
  "text-stone-800 font-medium underline underline-offset-2 decoration-stone-400 hover:text-accent hover:decoration-accent duration-200";

// Every tool or method used in the projects, in one list.
const SKILLS = [
  "Python", "SQL", "TypeScript", "C",
  "PyTorch", "Deep Learning", "Computer Vision", "3D Vision", "Optical Flow", "Object Detection",
  "Instance Segmentation", "Sensor Fusion", "Structure from Motion", "COLMAP", "OCR", "PyBullet",
  "LLM Pipelines", "LLM Evaluation",
  "pandas", "NumPy", "DuckDB", "Backtesting", "Statistical Testing",
  "Django", "PostgreSQL", "SQLite", "React", "Next.js",
  "Docker", "Playwright", "Git", "Linux",
];

function Card({ item, fill = false }: { item: ExperienceItem; fill?: boolean }) {
  // Datasets stay on the detail page; code and live demos are one click away from the card.
  const surfaceLinks = item.hasDetails
    ? item.links.filter((link) => link.label.startsWith("Code") || link.label === "Live Demo")
    : item.links;

  return (
    <div
      className={`relative flex flex-col rounded-lg p-4 ${fill ? "flex-1" : ""} ${
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
      {/* Cards with a detail page keep tags to one row (a tag that does not fit wraps to a
          hidden second row); the detail page lists them all. Other cards show every tag. */}
      <div
        className={`flex flex-wrap gap-x-1 mt-3 ${
          item.hasDetails ? "gap-y-2 h-5 overflow-hidden" : "gap-y-1"
        }`}
      >
        {(item.hasDetails ? item.tags.slice(0, 3) : item.tags).map((tag) => (
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
        <div className="lg:grid lg:grid-cols-[19fr_20fr] lg:gap-16 space-y-12 lg:space-y-0">

          {/* ── LEFT: Narrative ───────────────────── */}
          <div className="flex flex-col gap-10">

            <div>
              <h1 className="text-2xl sm:text-3xl font-display text-stone-800 mb-2">Zhenglin (Greyson) Zhang</h1>
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
                  I was the kid who was good at tests. Math olympiads from elementary school,
                  first prize at a 9th-grade Math League while I was in 8th grade, the
                  provincial team for the{" "}
                  <span className="text-stone-800 font-medium">National Physics Olympiad</span>{" "}
                  in high school, then Theoretical and Applied Mechanics at{" "}
                  <span className="text-stone-800 font-medium">Peking University</span>. I was
                  always in the most competitive schools I could get into, and that somehow
                  pushed me further than I would have gone on my own. What it never left much
                  room for was finding out what I was actually passionate about. I still wonder
                  sometimes how far I&rsquo;d have gone on a path I picked myself.
                </p>
                <p>
                  I carried the same pattern into a Master&rsquo;s in Robotics at{" "}
                  <span className="text-stone-800 font-medium">UPenn</span>, where I first met
                  computer vision, and then a CS PhD at{" "}
                  <span className="text-stone-800 font-medium">UMD</span>. By then, as an adult,
                  doing well was no longer about passing the next exam. It meant owning my part
                  and producing something that mattered to the people around me, ideally more
                  than what was asked. And the older I got, the harder it was to talk myself into
                  a path just because it was the expected one, the way many people around me were
                  doing. It was definitely a confusing stretch. Sometimes I envied people who had
                  known since sophomore year what they wanted and were well on their way by then.
                  Did they really know? Probably they never stopped to ask. I never doubted what I
                  was capable of, but leaving was the hard part. I hesitated, and part of me
                  wanted to stay and finish what I had started. Still, I left, looking for
                  somewhere with more room to grow what I&rsquo;m good at: explaining,
                  communicating and exploring. It was the first big decision I made purely for
                  myself, and I&rsquo;m proud of it.
                </p>
                <p>
                  After twenty fairly intense years, I took a few months off and traveled. Then I
                  explored something I&rsquo;d loved since landing in the US: cars. I spent a good
                  part of a year around a friend&rsquo;s dealership, at auctions, buying, selling,
                  fixing cars and talking with a lot of customers. I saw plenty that was funny,
                  absurd, or simply out of reach for most people, and solved problems that looked
                  impossible. It&rsquo;s also where I found those skills were real: I can explain
                  things in a way that gets people on board, and I liked it more than I expected.
                  On the track, I raced a Miata Cup car, and built an{" "}
                  <span className="text-stone-800 font-medium">E36 M3 from a bare frame</span>{" "}
                  with friends, then drove it in an endurance race at Road Atlanta. I also totaled
                  my own ND Miata on a downhill corner at Atlanta Motorsports Park, with traction
                  control off, which most of my friends never do. Once I start something, I want
                  to do it the most challenging way. Sadly, that day the corner won.
                </p>
                <p>
                  Then I got into trading. My strategy was aggressive and the account was choppy,
                  but my read was often right. I shorted the Korean market two days before it fell more than ten percent on June 5, which was the first day
                  of real panic and huge volatility since this bull run began. Discipline, though,
                  took far longer to learn, because it goes against human nature. Gradually I
                  found the most exciting part for me was never making more money, but working out
                  why the market moved the way it did and catching it before it happened. That
                  pushed me to test ideas with data and statistics instead of gut feeling, which
                  later became <Link href="/tldr/asof" className={PROJECT_LINK}>asof</Link>, and
                  it made me want to learn alongside people who know far more than I do, instead
                  of alone at home in front of a screen.
                </p>
                <p>
                  In 2025 a friend&rsquo;s small rare-plant company sponsored my H-1B, and I joined
                  as a data analyst in January 2026. With a team that small, I got to own a whole
                  system end to end:{" "}
                  <Link href="/tldr/plantops" className={PROJECT_LINK}>PlantOps</Link>, which now
                  runs their daily operations. Building it with coding agents showed me how fast
                  AI is changing what one person can ship.
                </p>
                <p className="text-stone-700">
                  Next I want a team that builds at real scale, where I can learn how good
                  engineering and good companies work. I&rsquo;m starting on the technical side,
                  and I&rsquo;m just as curious about product and the business: where the money
                  comes from, where it goes, and why.
                </p>
                <p>
                  The longer version is in the{" "}
                  <Link href="/story" className={PROJECT_LINK}>Full Story</Link>.
                </p>
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
            {/* The last card of each column stretches so both columns end on one line. */}
            <div className="hidden sm:flex gap-3 items-stretch">
              {[col1, col2].map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-3 flex-1">
                  {column.map((item, index) => {
                    const isLast = index === column.length - 1;
                    return (
                      <Reveal key={item.slug} index={index} className={isLast ? "flex-1 flex flex-col" : ""}>
                        <Card item={item} fill={isLast} />
                      </Reveal>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Skills span both columns so the two columns above end on one line. */}
        <section className="mt-12 lg:mt-16">
          <h2 className="text-xs uppercase tracking-widest text-stone-500 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span key={skill}
                    className="text-xs px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full">
                {skill}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-stone-500 mt-3">
            Some of these I have worked with through AI.
          </p>
        </section>
      </div>
    </div>
  );
}
