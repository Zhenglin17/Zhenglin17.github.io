"use client";
import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useEffect, useRef, useState } from "react";

type RevealProps = {
	children: ReactNode;
	/** Position in its column; adds a small capped delay so items enter in sequence. */
	index?: number;
};

const STEP_SECONDS = 0.04;
const MAX_DELAY_SECONDS = 0.12;
const RECHECK_MS = 500;

/**
 * Fades and rises its children once, the first time they scroll into view.
 *
 * Does not use `whileInView`: after a client navigation with a view transition,
 * items already on screen never got an intersecting callback and stayed hidden.
 * Position is therefore also checked directly on mount and once more shortly after.
 */
export const Reveal = ({ children, index = 0 }: RevealProps) => {
	const reduceMotion = useReducedMotion();
	const ref = useRef<HTMLDivElement>(null);
	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const show = () => setRevealed(true);
		const checkPosition = () => {
			const { top, bottom } = element.getBoundingClientRect();
			if (top < window.innerHeight && bottom > 0) show();
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) show();
			},
			{ rootMargin: "0px 0px -40px 0px" },
		);
		observer.observe(element);
		checkPosition();
		const recheck = window.setTimeout(checkPosition, RECHECK_MS);

		return () => {
			observer.disconnect();
			window.clearTimeout(recheck);
		};
	}, []);

	if (reduceMotion) return <div>{children}</div>;

	return (
		<motion.div
			ref={ref}
			// Phones (below sm) show items right away; the important flags beat
			// Framer Motion's inline opacity and transform.
			className="max-sm:opacity-100! max-sm:transform-none!"
			initial={{ opacity: 0, y: 12 }}
			animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
			transition={{
				duration: 0.3,
				ease: "easeOut",
				delay: Math.min(index * STEP_SECONDS, MAX_DELAY_SECONDS),
			}}
		>
			{children}
		</motion.div>
	);
};
