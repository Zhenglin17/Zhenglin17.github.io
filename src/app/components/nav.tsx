"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type NavProps = { backHref?: string };

// Path of the last page that rendered this nav. Kept in memory only, so a reload
// or a direct visit starts fresh and the back arrow falls back to its link.
let lastNavPath: string | null = null;

export const Navigation: React.FC<NavProps> = ({ backHref = "/" }) => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);
	const pathname = usePathname();
	const router = useRouter();
	const previousPath = useRef<string | null>(null);

	useEffect(() => {
		// Guarded so a repeated effect run (React Strict Mode) keeps the real previous page.
		if (lastNavPath === pathname) return;
		previousPath.current = lastNavPath;
		lastNavPath = pathname;
	}, [pathname]);

	// Coming straight from the back target: step back in history instead, so the
	// browser restores the scroll position (e.g. the card that was opened).
	const onBackClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		const plainClick = !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;		if (plainClick && previousPath.current === backHref) {
			event.preventDefault();
			router.back();
		}
	};

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header ref={ref}>
			<div
				className={`fixed inset-x-0 top-0 z-50 duration-200 ${
					isIntersecting
						? "bg-stone-50/0"
						: "bg-stone-50/40 backdrop-blur-md"
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between py-3 px-6 mx-auto">
					<div className="flex justify-between gap-8">
						<Link
							href="/tldr"
							className="duration-200 text-stone-500 hover:text-accent"
						>
							TL;DR
						</Link>
						<Link
							href="/story"
							className="duration-200 text-stone-500 hover:text-accent"
						>
							Full Story
						</Link>
					</div>

					<Link
						href={backHref}
						onClick={onBackClick}
						className="duration-200 text-stone-500 hover:text-accent"
					>
						<ArrowLeft className="w-6 h-6" />
					</Link>
				</div>
			</div>
		</header>
	);
};
