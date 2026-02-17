import { toMinutes } from "../data/demoData";
import type { WeekDay, WeeklyClass } from "../types/demo";
import ClassCard from "./ClassCard";

export default function WeeklyCalendar({
  weekDays,
  classesByDay,
  occupiedStartTimes,
  onClassClick,
  bookedIds,
}: {
  weekDays: WeekDay[];
  classesByDay: WeeklyClass[][];
  occupiedStartTimes: string[];
  onClassClick?: (cls: WeeklyClass) => void;
  bookedIds?: Set<string>;
}) {
  return (
    <>
      {/* Mobile: collapsible day cards */}
      <div className="grid gap-2 md:hidden">
        {weekDays.map((day, dayIndex) => {
          const dayClasses = classesByDay[dayIndex] ?? [];
          if (dayClasses.length === 0) return null;
          return (
            <article key={`mobile-${day.short}`} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">{day.long}</p>
                <p className="text-xs text-[var(--ink-muted)]">Feb {day.date}</p>
              </div>
              <div className="mt-2 space-y-1.5">
                {dayClasses.map((item) => (
                  <ClassCard
                    key={`mobile-${item.id}`}
                    cls={item}
                    bookable={!!onClassClick}
                    booked={bookedIds?.has(item.id)}
                    onBook={onClassClick ? () => onClassClick(item) : undefined}
                    compact
                  />
                ))}
              </div>
            </article>
          );
        })}
      </div>

      {/* Desktop: full table grid */}
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
