"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { validateBooking, type FieldErrors } from "@/lib/forms";
import { site } from "@/lib/site";
import type { BookingConfig, Slot, SlotDay } from "@/lib/bookings";
import { Button } from "@/components/ui/Button";
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, LockIcon } from "@/components/icons";
import { FormStatus, Honeypot, TextAreaField, TextField } from "@/components/forms/fields";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const naira = (amount: number) => `₦${new Intl.NumberFormat("en-NG").format(amount)}`;

// The visitor's own time zone (server render assumes Lagos, so nothing mismatches on hydration).
const noopSubscribe = () => () => {};
const useVisitorTimeZone = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => "Africa/Lagos",
  );

/** Y-m-d strings are Lagos calendar dates; do the maths in UTC so the browser's zone never shifts a day. */
function parseDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatLongDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(
    parseDate(date),
  );
}

export function BookingFlow({ config, demo }: { config: BookingConfig; demo: boolean }) {
  const visitorZone = useVisitorTimeZone();
  // Only show the visitor's own clock when it actually differs from Lagos at that moment.
  const clock = (iso: string, timeZone: string) =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(new Date(iso));
  const showLocal = (iso: string) => visitorZone !== config.timezone && clock(iso, visitorZone) !== clock(iso, config.timezone);

  const [days, setDays] = useState<SlotDay[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [month, setMonth] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [step, setStep] = useState<"time" | "details">("time");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/bookings/slots?days=${config.windowDays + 1}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((body: { days: SlotDay[] }) => {
        if (cancelled) return;
        setDays(body.days);
        setLoadError(false);
      })
      .catch(() => !cancelled && setLoadError(true));
    return () => {
      cancelled = true;
    };
  }, [config.windowDays, reloadKey]);

  const openDays = useMemo(() => new Map((days ?? []).filter((d) => d.slots.length).map((d) => [d.date, d.slots])), [days]);
  const months = useMemo(() => [...new Set((days ?? []).map((d) => d.date.slice(0, 7)))], [days]);
  const firstOpenMonth = useMemo(() => [...openDays.keys()][0]?.slice(0, 7) ?? months[0] ?? null, [openDays, months]);
  const shownMonth = month && months.includes(month) ? month : firstOpenMonth;

  const localTime = (iso: string) =>
    new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", timeZone: visitorZone, timeZoneName: "short" }).format(
      new Date(iso),
    );

  function chooseDate(value: string) {
    setDate(value);
    setSlot(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!slot) return;
    const form = event.currentTarget;
    const values: Record<string, string> = { start: slot.start };
    new FormData(form).forEach((value, key) => {
      if (typeof value === "string") values[key] = value;
    });

    const result = validateBooking(values);
    if (!result.ok) {
      setErrors(result.errors);
      const first = Object.keys(result.errors)[0];
      const field = first ? form.elements.namedItem(first) : null;
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    setErrors({});
    setMessage(null);
    setStatus("submitting");
    try {
      const response = await fetch("/api/bookings/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await response.json().catch(() => null);
      if (response.ok && body?.authorizationUrl) {
        window.location.assign(body.authorizationUrl);
        return;
      }
      if (response.status === 409) {
        // Someone else took the slot — send them back to pick again with fresh times.
        setSlot(null);
        setStep("time");
        setDays(null);
        setReloadKey((key) => key + 1);
      }
      if (body?.errors) setErrors(body.errors);
      setMessage(body?.message ?? null);
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const summary = (
    <aside
      aria-label="Your booking"
      className="rounded-2xl bg-brand-maroon p-6 text-white shadow-xl ring-1 ring-white/10 sm:p-8 lg:sticky lg:top-28"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-grey-light">Your booking</p>
      <h2 className="mt-3 text-2xl font-bold leading-snug">{config.title}</h2>
      {config.description && <p className="mt-3 text-sm leading-relaxed text-brand-grey-light">{config.description}</p>}
      <dl className="mt-6 space-y-3 border-t border-white/15 pt-6 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-brand-grey-light">Length</dt>
          <dd className="font-semibold">{config.durationMinutes} minutes</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-brand-grey-light">Where</dt>
          <dd className="text-right font-semibold">Online — the team sends your meeting link</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-brand-grey-light">When</dt>
          <dd className="text-right font-semibold">
            {slot && date ? (
              <>
                {formatLongDate(date)}
                <br />
                {slot.label} Lagos time
                {showLocal(slot.start) && (
                  <span className="block font-normal text-brand-grey-light">{localTime(slot.start)} your time</span>
                )}
              </>
            ) : (
              <span className="font-normal text-brand-grey-light">Choose a time</span>
            )}
          </dd>
        </div>
      </dl>
      <div className="mt-6 flex items-baseline justify-between border-t border-white/15 pt-6">
        <span className="text-brand-grey-light">Total</span>
        <span className="font-serif text-3xl font-bold">{naira(config.price)}</span>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-brand-grey-light">
        <LockIcon className="h-4 w-4 shrink-0" />
        Secure payment by Paystack — card, bank transfer or USSD.
      </p>
    </aside>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
      <div className="min-w-0 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-brand-grey-light sm:p-8">
        {demo && (
          <p className="mb-6 rounded-lg border border-dashed border-brand-crimson/50 px-4 py-3 text-sm text-brand-black/80">
            <strong className="text-brand-crimson">Development preview:</strong> sample times, and payment is switched off
            until WordPress and Paystack are connected.
          </p>
        )}

        {/* Step indicator */}
        <ol className="mb-8 flex items-center gap-3 text-sm font-semibold" aria-label="Booking steps">
          {[
            ["time", "1", "Choose a time"],
            ["details", "2", "Your details"],
          ].map(([key, number, label], index) => (
            <li key={key} className="flex items-center gap-3">
              {index > 0 && <span aria-hidden="true" className="h-px w-8 bg-brand-grey-light" />}
              <span
                aria-current={step === key ? "step" : undefined}
                className={cn("flex items-center gap-2", step === key ? "text-brand-maroon" : "text-brand-grey-dark")}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs",
                    step === key ? "bg-brand-crimson text-white" : "bg-brand-grey-light/60 text-brand-grey-dark",
                  )}
                >
                  {number}
                </span>
                {label}
              </span>
            </li>
          ))}
        </ol>

        {status === "error" && message && step === "time" && (
          <div className="mb-6">
            <FormStatus kind="error">{message}</FormStatus>
          </div>
        )}

        {step === "time" && (
          <section aria-labelledby="choose-time-heading">
            <h2 id="choose-time-heading" className="sr-only">
              Choose a time
            </h2>

            {loadError ? (
              <FormStatus kind="error">
                Available times could not be loaded.{" "}
                <button type="button" className="font-semibold text-brand-crimson underline" onClick={() => setReloadKey((k) => k + 1)}>
                  Try again
                </button>{" "}
                or email{" "}
                <a className="font-semibold text-brand-crimson underline" href={`mailto:${site.email.general}`}>
                  {site.email.general}
                </a>
                .
              </FormStatus>
            ) : !days ? (
              <div className="flex min-h-72 items-center justify-center text-brand-grey-dark" role="status">
                <ClockIcon className="mr-2 h-5 w-5 animate-spin [animation-duration:2.5s]" /> Loading available times…
              </div>
            ) : openDays.size === 0 ? (
              <FormStatus kind="error">
                There are no open times in the next {config.windowDays} days. Please check back soon or{" "}
                <a className="font-semibold text-brand-crimson underline" href={`mailto:${site.email.general}`}>
                  email us
                </a>
                .
              </FormStatus>
            ) : (
              shownMonth && (
                <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_15rem]">
                  <MonthCalendar
                    month={shownMonth}
                    months={months}
                    openDays={openDays}
                    selected={date}
                    onMonthChange={setMonth}
                    onSelect={chooseDate}
                  />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-brand-maroon">
                      {date ? formatLongDate(date) : "Select a day"}
                    </h3>
                    <p className="mt-1 text-xs text-brand-grey-dark">
                      Times in Lagos (WAT)
                      {date && (openDays.get(date) ?? []).some((option) => showLocal(option.start)) ? " · your local time below each" : ""}
                    </p>
                    {date ? (
                      <ul className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-1" aria-label="Available times">
                        {(openDays.get(date) ?? []).map((option) => (
                          <li key={option.start}>
                            <button
                              type="button"
                              onClick={() => setSlot(option)}
                              aria-pressed={slot?.start === option.start}
                              className={cn(
                                "w-full rounded-lg px-3 py-2.5 text-center font-semibold ring-1 transition-all duration-200",
                                slot?.start === option.start
                                  ? "bg-brand-maroon text-white ring-brand-maroon"
                                  : "text-brand-maroon ring-brand-grey-light hover:-translate-y-0.5 hover:ring-brand-crimson",
                              )}
                            >
                              {option.label}
                              {showLocal(option.start) && (
                                <span
                                  className={cn(
                                    "block text-xs font-normal",
                                    slot?.start === option.start ? "text-brand-grey-light" : "text-brand-grey-dark",
                                  )}
                                >
                                  {localTime(option.start)}
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 text-sm text-brand-grey-dark">Days with open times are highlighted.</p>
                    )}
                  </div>
                </div>
              )
            )}

            <div className="mt-8 flex justify-end border-t border-brand-grey-light pt-6">
              <Button type="button" size="lg" disabled={!slot} onClick={() => setStep("details")}>
                Continue →
              </Button>
            </div>
          </section>
        )}

        {step === "details" && slot && date && (
          <form noValidate onSubmit={handleSubmit} aria-label="Your details" className="space-y-5">
            <Honeypot />
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-brand-grey-light/30 px-4 py-3">
              <p className="text-sm">
                <span className="font-semibold text-brand-maroon">{formatLongDate(date)}</span> · {slot.label} Lagos time
              </p>
              <button
                type="button"
                onClick={() => setStep("time")}
                className="text-sm font-semibold text-brand-crimson underline-offset-4 hover:underline"
              >
                Change time
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField name="name" label="Your Name" autoComplete="name" required error={errors.name} />
              <TextField
                name="email"
                type="email"
                label="Your Email Address"
                autoComplete="email"
                required
                error={errors.email}
                hint="Your confirmation and receipt go here."
              />
              <TextField
                name="phone"
                type="tel"
                label="Your Phone Number"
                autoComplete="tel"
                required
                error={errors.phone}
                hint="The team uses this to arrange your meeting link."
              />
              <TextField name="company" label="Company / Organisation" autoComplete="organization" error={errors.company} />
            </div>
            <TextAreaField
              name="topic"
              label="What would you like to discuss?"
              rows={4}
              error={errors.topic}
              hint="A sentence or two is enough — please keep confidential details for the consultation itself."
            />

            {status === "error" && (
              <FormStatus kind="error">
                {message ?? "Something went wrong."} If it keeps happening, email{" "}
                <a className="font-semibold text-brand-crimson underline" href={`mailto:${site.email.general}`}>
                  {site.email.general}
                </a>
                .
              </FormStatus>
            )}

            <div className="border-t border-brand-grey-light pt-6">
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === "submitting"}>
                {status === "submitting" ? "Taking you to secure payment…" : `Pay ${naira(config.price)} securely →`}
              </Button>
              <p className="mt-3 text-sm text-brand-grey-dark">
                You&apos;ll pay on Paystack&apos;s secure checkout. Your time is held for {config.holdMinutes} minutes while
                you pay.
              </p>
            </div>
          </form>
        )}
      </div>

      {summary}
    </div>
  );
}

function MonthCalendar({
  month,
  months,
  openDays,
  selected,
  onMonthChange,
  onSelect,
}: {
  month: string;
  months: string[];
  openDays: Map<string, Slot[]>;
  selected: string | null;
  onMonthChange: (month: string) => void;
  onSelect: (date: string) => void;
}) {
  const first = parseDate(`${month}-01`);
  const index = months.indexOf(month);
  const leading = (first.getUTCDay() + 6) % 7; // Monday-first grid
  const daysInMonth = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`),
  ];
  const label = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(first);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-bold text-brand-maroon" aria-live="polite">
          {label}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onMonthChange(months[index - 1])}
            disabled={index <= 0}
            aria-label="Previous month"
            className="rounded-full p-2 text-brand-maroon ring-1 ring-brand-grey-light transition hover:ring-brand-crimson disabled:opacity-30"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(months[index + 1])}
            disabled={index < 0 || index >= months.length - 1}
            aria-label="Next month"
            className="rounded-full p-2 text-brand-maroon ring-1 ring-brand-grey-light transition hover:ring-brand-crimson disabled:opacity-30"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-5">
        <div aria-hidden="true" className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((day) => (
            <div key={day} className="pb-2 text-center text-xs font-semibold uppercase tracking-wider text-brand-grey-dark">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((cell, i) => {
            if (!cell) return <div key={`blank-${i}`} />;
            const open = openDays.has(cell);
            const isSelected = selected === cell;
            return (
              <div key={cell}>
                <button
                  type="button"
                  disabled={!open}
                  onClick={() => onSelect(cell)}
                  aria-pressed={isSelected}
                  aria-label={`${formatLongDate(cell)}${open ? `, ${openDays.get(cell)!.length} times available` : ", unavailable"}`}
                  className={cn(
                    "flex aspect-square w-full items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200",
                    isSelected
                      ? "bg-brand-maroon text-white shadow-md"
                      : open
                        ? "bg-brand-crimson/10 text-brand-maroon hover:-translate-y-0.5 hover:bg-brand-crimson hover:text-white"
                        : "cursor-not-allowed text-brand-grey-mid",
                  )}
                >
                  {Number(cell.slice(8))}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
