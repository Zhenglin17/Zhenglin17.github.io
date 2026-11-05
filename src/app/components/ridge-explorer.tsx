"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { EVENTS } from "../story/events";
import { REVEAL_MASK, REVEAL_VAR, VIEW_H, VIEW_W, ridgeYAt, xForAge, yForAltitude } from "./ridge-line";

// Prototype settings, still to be decided with the user.
// With ?lows=hide, events below this altitude keep their marker but get no label.
const LOW_ALTITUDE = 35;
// How far above the ridge band the mouse still counts as "on the ridge", in px.
const BAND_REACH_ABOVE = 40;
// Intro climb: once per tab, the dot climbs the ridge from the left and the
// ridge is drawn behind it; the dot stops on the newest event.
const INTRO_STORAGE_KEY = "ridgeIntroSeen";
const INTRO_DELAY_MS = 250;
const CLIMB_MS = 3500;
const LABEL_HOLD_MS = 2500;
const LABEL_EDGE_GAP_PX = 8;

const POINTS = EVENTS.map((event) => ({
	...event,
	leftPercent: (xForAge(event.age) / VIEW_W) * 100,
	topPercent: (yForAltitude(event.altitude) / VIEW_H) * 100,
}));
const NEWEST_INDEX = POINTS.length - 1;
const NEWEST_X = xForAge(EVENTS[NEWEST_INDEX].age);

const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Interactive layer over the homepage ridge. Faint markers show where events
 * sit; a terracotta dot snaps to the event nearest the mouse (desktop) or the
 * finger (touch, by dragging along the ridge) and shows its label.
 *
 * Mouse input is read from the window, so this layer never blocks the links
 * around it. On touch screens the layer takes the touches itself; the footer
 * links come later in the DOM and stay on top.
 */
export function RidgeExplorer({ className }: { className?: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const labelRef = useRef<HTMLDivElement>(null);
	const [index, setIndex] = useState(NEWEST_INDEX);
	const [dotVisible, setDotVisible] = useState(false);
	const [labelVisible, setLabelVisible] = useState(false);
	const [width, setWidth] = useState(0);
	const [climbing, setClimbing] = useState(false);
	const dotRef = useRef<HTMLSpanElement>(null);
	const stopClimb = useRef<(() => void) | null>(null);
	const timers = useRef<number[]>([]);
	const touching = useRef(false);

	const clearTimers = () => {
		timers.current.forEach((id) => window.clearTimeout(id));
		timers.current = [];
	};
	// Pending timers mean the layer is showing something on its own (intro or a
	// lingering touch label); fired timers drop out of the list.
	const later = (callback: () => void, ms: number) => {
		const id = window.setTimeout(() => {
			timers.current = timers.current.filter((pending) => pending !== id);
			callback();
		}, ms);
		timers.current.push(id);
	};

	const hide = () => {
		setDotVisible(false);
		setLabelVisible(false);
	};

	// Nearest event to a horizontal position, skipping unlabeled low points if hidden.
	const nearestIndex = useCallback((clientX: number) => {
		// Prototype toggle for comparing label sets: ?lows=hide.
		const hideLows = new URLSearchParams(window.location.search).get("lows") === "hide";
		const box = ref.current!.getBoundingClientRect();
		const pointerPercent = ((clientX - box.left) / box.width) * 100;
		let best = -1;
		POINTS.forEach((point, i) => {
			if (hideLows && point.altitude < LOW_ALTITUDE) return;
			if (best < 0 || Math.abs(point.leftPercent - pointerPercent) < Math.abs(POINTS[best].leftPercent - pointerPercent)) {
				best = i;
			}
		});
		return best;
	}, []);

	const showAt = useCallback(
		(clientX: number) => {
			// The visitor takes over: end the intro and show the whole ridge.
			stopClimb.current?.();
			clearTimers();
			setIndex(nearestIndex(clientX));
			setDotVisible(true);
			setLabelVisible(true);
		},
		[nearestIndex],
	);

	// Track width so the label can be kept inside the screen.
	useEffect(() => {
		const update = () => setWidth(ref.current?.clientWidth ?? 0);
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	// Intro climb, once per tab. The ridge (and the markers) are masked up to the
	// dot through a CSS variable on <html>, so the line is drawn as the dot climbs.
	useEffect(() => {
		let seen = false;
		try {
			seen = sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
		} catch {
			// Storage blocked: just play it.
		}
		if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const root = document.documentElement;
		root.style.setProperty(REVEAL_VAR, "0%");
		let frame = 0;

		const finish = () => {
			cancelAnimationFrame(frame);
			root.style.removeProperty(REVEAL_VAR);
			// Hand the dot back to React at the position its props describe (the
			// newest event), so a later index change animates from a known place.
			const dot = dotRef.current;
			if (dot) {
				dot.style.left = `${POINTS[NEWEST_INDEX].leftPercent}%`;
				dot.style.top = `${POINTS[NEWEST_INDEX].topPercent}%`;
			}
			stopClimb.current = null;
			setClimbing(false);
		};
		stopClimb.current = finish;

		const step = (now: number, start: number) => {
			const progress = easeInOut(Math.min((now - start) / CLIMB_MS, 1));
			root.style.setProperty(REVEAL_VAR, `${progress * 100}%`);
			// The dot stops at the newest event while the last stretch keeps drawing.
			const x = Math.min(progress * VIEW_W, NEWEST_X);
			const dot = dotRef.current;
			if (dot) {
				dot.style.left = `${(x / VIEW_W) * 100}%`;
				dot.style.top = `${(ridgeYAt(x) / VIEW_H) * 100}%`;
			}
			if (progress < 1) {
				frame = requestAnimationFrame((time) => step(time, start));
				return;
			}
			finish();
			try {
				// Marked only once it has played, so a repeated effect run still plays it.
				sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
			} catch {
				// Ignore.
			}
			setIndex(NEWEST_INDEX);
			setLabelVisible(true);
			later(hide, LABEL_HOLD_MS);
		};

		later(() => {
			setClimbing(true);
			setDotVisible(true);
			frame = requestAnimationFrame((time) => step(time, time));
		}, INTRO_DELAY_MS);

		return () => {
			clearTimers();
			cancelAnimationFrame(frame);
			root.style.removeProperty(REVEAL_VAR);
			stopClimb.current = null;
		};
	}, []);

	// Mouse: follow the pointer while it is over the ridge band.
	useEffect(() => {
		const onMove = (event: PointerEvent) => {
			const element = ref.current;
			if (!element || event.pointerType !== "mouse") return;
			const box = element.getBoundingClientRect();
			const inBand =
				event.clientY >= box.top - BAND_REACH_ABOVE &&
				event.clientY <= box.bottom &&
				event.clientX >= box.left &&
				event.clientX <= box.right;
			if (inBand) {
				showAt(event.clientX);
			} else if (timers.current.length === 0) {
				hide();
			}
		};
		const onLeave = () => {
			if (timers.current.length === 0) hide();
		};
		window.addEventListener("pointermove", onMove);
		document.documentElement.addEventListener("pointerleave", onLeave);
		return () => {
			window.removeEventListener("pointermove", onMove);
			document.documentElement.removeEventListener("pointerleave", onLeave);
		};
	}, [showAt]);

	// Touch: drag along the ridge; the label lingers after the finger lifts.
	const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		if (event.pointerType === "mouse") return;
		touching.current = true;
		try {
			// Keeps the drag on the ridge even if the finger wanders above it.
			event.currentTarget.setPointerCapture(event.pointerId);
		} catch {
			// The pointer is already gone; dragging still works without capture.
		}
		showAt(event.clientX);
	};
	const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		if (touching.current) showAt(event.clientX);
	};
	const onPointerEnd = () => {
		if (!touching.current) return;
		touching.current = false;
		later(hide, LABEL_HOLD_MS);
	};

	const point = POINTS[index];

	// Center the label over the dot, clamped to the screen edges. Written to the
	// DOM directly because it depends on the label's measured width.
	useLayoutEffect(() => {
		const label = labelRef.current;
		if (!label) return;
		const x = (point.leftPercent / 100) * width;
		const maxLeft = Math.max(LABEL_EDGE_GAP_PX, width - label.offsetWidth - LABEL_EDGE_GAP_PX);
		label.style.left = `${Math.min(Math.max(x - label.offsetWidth / 2, LABEL_EDGE_GAP_PX), maxLeft)}px`;
	}, [point, width]);

	return (
		<div
			ref={ref}
			aria-hidden="true"
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerEnd}
			onPointerCancel={onPointerEnd}
			className={`pointer-events-none pointer-coarse:pointer-events-auto touch-none select-none ${className ?? ""}`}
		>
			{/* Faint markers: always there, hinting that the ridge holds something.
			    Masked like the ridge, so they appear as the intro draws it. */}
			<div className="absolute inset-0" style={{ maskImage: REVEAL_MASK, WebkitMaskImage: REVEAL_MASK }}>
				{POINTS.map((marker) => (
					<span
						key={marker.age}
						className="absolute block size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full
						           bg-[#fdfaf3] border border-stone-600/60"
						style={{ left: `${marker.leftPercent}%`, top: `${marker.topPercent}%` }}
					/>
				))}
			</div>

			{/* While climbing, the dot is moved every frame, so only opacity transitions. */}
			<span
				ref={dotRef}
				className={`absolute block size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent
				            ring-4 ring-accent/15 duration-200 ease-out motion-reduce:transition-none
				            ${climbing ? "transition-opacity" : "transition-[left,top,opacity]"}
				            ${dotVisible ? "opacity-100" : "opacity-0"}`}
				style={{ left: `${point.leftPercent}%`, top: `${point.topPercent}%` }}
			/>

			<div
				ref={labelRef}
				className={`absolute w-max max-w-[calc(100vw-16px)] -translate-y-full text-xs leading-snug
				            transition-[left,top,opacity] duration-200 ease-out motion-reduce:transition-none
				            ${labelVisible ? "opacity-100" : "opacity-0"}`}
				style={{ top: `calc(${point.topPercent}% - 12px)` }}
			>
				<div className="text-stone-600">
					<span className="font-mono text-stone-500">Age {Math.floor(point.age)}</span>
					<span className="mx-1.5 text-stone-400">·</span>
					{point.label}
				</div>
				{point.deep && <div className="mt-0.5 text-[11px] text-accent">More in Full Story</div>}
			</div>
		</div>
	);
}
