export type CohortDate = {
  date: string;
  format: string;
  status: "Open" | "Closing Soon" | "Waitlist";
};

/**
 * "Upcoming cohort dates" block for a training programme.
 * TODO(cms): per the copy doc this is auto-populated from a CMS (next 2 intake
 * dates with enrolment status). Pass `dates` once that source exists.
 */
export function UpcomingDates({ title = "Upcoming dates", dates = [] }: { title?: string; dates?: CohortDate[] }) {
  return (
    <div className="mt-6 border-t border-brand-grey-mid/40 pt-5">
      <p className="font-semibold text-brand-maroon">{title}</p>
      {dates.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {dates.slice(0, 2).map((cohort) => (
            <li key={cohort.date} className="flex flex-wrap items-center justify-between gap-2">
              <span>
                {cohort.date} · {cohort.format}
              </span>
              <span className="rounded-full bg-brand-maroon px-3 py-0.5 text-xs font-semibold text-white">
                {cohort.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-brand-grey-dark">Dates to be announced.</p>
      )}
    </div>
  );
}
