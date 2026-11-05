import Link from "next/link";
import Particles from "./components/particles";
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
                               group-hover/tldr:text-stone-800">
                TL;DR
              </span>
              <span className="text-[11px] leading-tight text-stone-400 transition-colors duration-300
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
                               group-hover/story:text-stone-800">
                Full Story
              </span>
              <span className="text-[11px] leading-tight text-stone-400 transition-colors duration-300
                               group-hover/story:text-stone-600">
                Discover the whole journey.
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

      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-stone-800 cursor-default font-display sm:text-5xl md:text-7xl whitespace-nowrap">
        Zhenglin Zhang
      </h1>

      <p className="mt-3 px-6 max-w-xl text-center text-sm leading-relaxed text-stone-500 sm:text-base">
        Building agent systems and data infrastructure.
        <br />
        Trained in robotics and 3D vision.
      </p>

      <footer className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-3 text-xs text-stone-600">
        <a
          href="https://github.com/Zhenglin17"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-stone-900 duration-200"
        >
          GitHub
        </a>
        <span aria-hidden="true">·</span>
        <a href="mailto:zhenglinzhang6@gmail.com" className="hover:text-stone-900 duration-200">
          Email
        </a>
      </footer>
    </div>
  );
}
