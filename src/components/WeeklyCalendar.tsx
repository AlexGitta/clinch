import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toMinutes } from "../data/demoData";
import type { WeekDay, WeeklyClass } from "../types/demo";
import ClassCard from "./ClassCard";

// Feb 16, 2026 is Monday – the base week used throughout the demo data
const BASE_MONDAY = new Date(2026, 1, 16);

function getDateForDay(weekOffset: number, dayIndex: number): Date {
  const d = new Date(BASE_MONDAY);
  d.setDate(BASE_MONDAY.getDate() + weekOffset * 7 + dayIndex);
  return d;
}

function formatDateLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function getDayLong(d: Date): string {
  return d.toLocaleDateString("en-GB", { weekday: "long" });
}

export default function WeeklyCalendar({
  weekDays,
  classesByDay,
  occupiedStartTimes,
  onClassClick,
  bookedIds,
  sessionIds,
}: {
  weekDays: WeekDay[];
  classesByDay: WeeklyClass[][];
  occupiedStartTimes: string[];
  onClassClick?: (cls: WeeklyClass) => void;
  bookedIds?: Set<string>;
  sessionIds?: Set<string>;
}) {
  // ── Infinite-scroll state ──────────────────────────────────────────
  const [pagesBefore, setPagesBefore] = useState(1);
  const [pagesAfter, setPagesAfter] = useState(2);

  const scrollRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const todayCardRef = useRef<HTMLElement | null>(null);

  // Used to preserve scroll position when prepending weeks
  const prevScrollHeight = useRef(0);
  const isPrepending = useRef(false);

  // Which absolute day offset (from BASE_MONDAY) is today?
  const todayAbsoluteOffset = (() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.round((now.getTime() - BASE_MONDAY.getTime()) / 86400000);
  })();

  // Scroll to today on first render
  useEffect(() => {
    if (todayCardRef.current) {
      todayCardRef.current.scrollIntoView({ block: "start" });
    }
  }, []);

  // Adjust scroll position after prepending to avoid visual jump
  useLayoutEffect(() => {
    if (!isPrepending.current || !scrollRef.current) return;
    scrollRef.current.scrollTop +=
      scrollRef.current.scrollHeight - prevScrollHeight.current;
    isPrepending.current = false;
  }, [pagesBefore]);

  // Intersection observer for top/bottom sentinels
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.target === topSentinelRef.current) {
            prevScrollHeight.current = root.scrollHeight;
            isPrepending.current = true;
            setPagesBefore((p) => p + 1);
          } else if (entry.target === bottomSentinelRef.current) {
            setPagesAfter((p) => p + 1);
          }
        }
      },
      { root, threshold: 0.1 },
    );

    if (topSentinelRef.current) obs.observe(topSentinelRef.current);
    if (bottomSentinelRef.current) obs.observe(bottomSentinelRef.current);
    return () => obs.disconnect();
  }, [pagesBefore, pagesAfter]);

  // Build the ordered list of (weekOffset, dayIndex) pairs to render
  const allDays: Array<{ weekOffset: number; dayIndex: number }> = [];
  for (let w = -pagesBefore; w <= pagesAfter; w++) {
    for (let d = 0; d < 7; d++) {
      allDays.push({ weekOffset: w, dayIndex: d });
    }
  }

  return (
    <>
      {/* ── Mobile: vertically scrollable infinite-scroll day cards ── */}
      <div
        ref={scrollRef}
        className="h-[62vh] overflow-y-auto space-y-2 md:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div ref={topSentinelRef} className="h-2" />

        {allDays.map(({ weekOffset, dayIndex }) => {
          const absoluteOffset = weekOffset * 7 + dayIndex;
          const isToday = absoluteOffset === todayAbsoluteOffset;
          const dayDate = getDateForDay(weekOffset, dayIndex);
          const dayLong = getDayLong(dayDate);
          const dateLabel = formatDateLabel(dayDate);
          const dayClasses = classesByDay[dayIndex] ?? [];

          // For past/future weeks the classes repeat (demo data only covers one week)
          const isCurrentWeek = weekOffset === 0;

          return (
            <article
              key={`${weekOffset}-${dayIndex}`}
              ref={isToday ? (el) => { todayCardRef.current = el; } : undefined}
              className={`rounded-lg border px-3 py-2 ${
                isToday
                  ? "border-[var(--accent)] bg-[var(--accent)]/5"
                  : "border-[var(--line)] bg-[var(--surface)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.08em] ${
                    isToday ? "text-[var(--accent)]" : "text-[var(--ink-muted)]"
                  }`}
                >
                  {dayLong}
                  {isToday && (
                    <span className="ml-1.5 rounded bg-[var(--accent)] px-1 py-0.5 text-[9px] font-bold text-white normal-case tracking-normal">
                      Today
                    </span>
                  )}
                </p>
                <p className="text-xs text-[var(--ink-muted)]">{dateLabel}</p>
              </div>

              {dayClasses.length === 0 ? (
                <p className="mt-2 text-xs text-[var(--ink-muted)]">No classes scheduled</p>
              ) : (
                <div className="mt-2 space-y-1.5">
                  {dayClasses.map((item) => {
                    const isBooked = isCurrentWeek && bookedIds?.has(item.id);
                    const canBook = isCurrentWeek && !!onClassClick && !isBooked;
                    return (
                      <ClassCard
                        key={`${weekOffset}-${item.id}`}
                        cls={item}
                        bookable={canBook}
                        booked={isBooked}
                        onBook={canBook ? () => onClassClick(item) : undefined}
                        compact
                        session={sessionIds?.has(item.id)}
                      />
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}

        <div ref={bottomSentinelRef} className="h-2" />
      </div>

      {/* ── Desktop: full table grid (unchanged) ─────────────────── */}
      <div className="demo-calendar-shell hidden md:block">
        <table className="demo-calendar-table">
          <thead>
            <tr>
              <th className="demo-calendar-head-time">Time</th>
              {weekDays.map((day) => (
                <th key={day.short} className="demo-calendar-head-day">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">{day.short}</p>
                  <p className="mt-1 text-xs font-semibold text-[var(--ink)]">Feb {day.date}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {occupiedStartTimes.sort((a, b) => toMinutes(a) - toMinutes(b)).map((time) => (
              <tr key={time}>
                <th className="demo-calendar-time-cell">{time}</th>
                {weekDays.map((day, dayIndex) => {
                  const entries = (classesByDay[dayIndex] ?? []).filter((item) => item.start === time);
                  return (
                    <td key={`${day.short}-${time}`} className="demo-calendar-slot-cell">
                      {entries.map((item) => {
                        const isBooked = bookedIds?.has(item.id);
                        return (
                          <article
                            key={item.id}
                            className={`demo-calendar-event ${onClassClick ? "cursor-pointer hover:brightness-95" : ""} ${isBooked ? "demo-calendar-event-booked" : ""}`}
                            onClick={onClassClick && !isBooked ? () => onClassClick(item) : undefined}
                            style={sessionIds?.has(item.id) ? { borderLeftWidth: 3, borderLeftColor: "var(--with-accent)" } : undefined}
                          >
                            <p className="demo-calendar-event-title">{item.title}</p>
                            <p className="demo-calendar-event-meta">{item.start}-{item.end}</p>
                            <p className="demo-calendar-event-status">
                              {isBooked ? "Booked" : item.coach}
                            </p>
                          </article>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
