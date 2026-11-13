import Link from "next/link";
import Particles from "./components/particles";
import { RidgeExplorer } from "./components/ridge-explorer";
import { RidgeLine } from "./components/ridge-line";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden pb-[22vh]">
      <nav className="mb-12">
        <ul className="flex items-start justify-center gap-12">

          {/* TL;DR */}
          <li>
            <Link
              href="/tldr"
              className="group/tldr flex flex-col items-center gap-1
                         transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="text-sm text-stone-500 transition-colors duration-300
                               group-hover/tldr:text-accent">
                TL;DR
              </span>
              <span className="text-[11px] leading-tight text-stone-500 transition-colors duration-300
                               group-hover/tldr:text-stone-600">
                Short on time? Quick version.
              </span>
            </Link>
          </li>

          {/* Full Story */}
          <li>
            <Link
              href="/story"
              className="group/story flex flex-col items-center gap-1
                         transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="text-sm text-stone-500 transition-colors duration-300
                               group-hover/story:text-accent">
                Full Story
              </span>
              <span className="text-[11px] leading-tight text-stone-500 transition-colors duration-300
                               group-hover/story:text-stone-600">
                The longer, more personal version.
              </span>
            </Link>
          </li>

        </ul>
      </nav>

      <Particles
        className="absolute inset-0 -z-10 animate-fade-in"
        quantity={100}
      />

      <RidgeLine className="absolute inset-x-0 bottom-0 -z-10 w-full h-[24vh] sm:h-[34vh] animate-fade-in-fast" />
      <RidgeExplorer className="absolute inset-x-0 bottom-0 h-[24vh] sm:h-[34vh] animate-fade-in-fast" />

      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-stone-800 cursor-default font-display sm:text-5xl md:text-7xl whitespace-nowrap">
        Zhenglin <span className="text-[0.45em] text-stone-400/70 align-middle">(Greyson)</span> Zhang
      </h1>

      {/* Keeps the name where it was; the tagline itself sits just above the ridge it describes. */}
      <div aria-hidden className="mt-3 h-[2.85rem] sm:h-[3.25rem]" />
      <p className="absolute inset-x-0 mx-auto bottom-[calc(24vh+5rem)] sm:bottom-[calc(34vh+5.5rem)] px-6 max-w-xl text-center text-sm leading-relaxed text-stone-500 sm:text-base">
        Up some days, down others.
        <br />
        Still climbing, pack and all.
      </p>

      <footer className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-3 text-xs text-stone-600">
        <a
          href="https://github.com/Zhenglin17"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent duration-200"
        >
          GitHub
        </a>
        <span aria-hidden="true">·</span>
        <a href="mailto:zhenglinzhang6@gmail.com" className="hover:text-accent duration-200">
          Email
        </a>
      </footer>
    </div>
  );
}
