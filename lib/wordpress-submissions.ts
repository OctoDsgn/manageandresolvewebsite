// Delivers form entries to the WordPress "Manage & Resolve — Website Submissions"
// plugin (wordpress/plugins/mr-submissions): POST /wp-json/mr/v1/submissions/{type}.
//
// Server-only. Authenticates with a WordPress Application Password belonging to a
// user with the "Website forms (API only)" role:
//   WORDPRESS_URL, WORDPRESS_FORMS_USER, WORDPRESS_FORMS_APP_PASSWORD
import {
  contactSubjectOptions,
  resolutionMethodOptions,
  trainingProgrammeOptions,
  trainingRequestOptions,
  type Option,
} from "./forms";

export type SubmissionType = "dispute" | "contact" | "training" | "newsletter";

// Dropdowns whose values are codes (e.g. "early-neutral-evaluation") are stored as
// their readable labels so entries make sense in WordPress admin.
const labelledFields: Partial<Record<SubmissionType, Record<string, Option[]>>> = {
  dispute: { method: resolutionMethodOptions },
  contact: { subject: contactSubjectOptions },
  training: { programme: trainingProgrammeOptions, request: trainingRequestOptions },
};

function withLabels(type: SubmissionType, data: Record<string, string>) {
  const fields = labelledFields[type] ?? {};
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      fields[key]?.find((option) => option.value === value)?.label ?? value,
    ]),
  );
}

/** True when the website can write to (and read private data from) WordPress. */
export function isWordPressFormsConfigured() {
  return Boolean(process.env.WORDPRESS_URL && process.env.WORDPRESS_FORMS_USER && process.env.WORDPRESS_FORMS_APP_PASSWORD);
}

/** Authenticated request to the mr/v1 WordPress API as the website's API-only user. */
export function wordpressApiFetch(path: string, init: RequestInit = {}) {
  const baseUrl = process.env.WORDPRESS_URL!.replace(/\/+$/, "");
  const credentials = `${process.env.WORDPRESS_FORMS_USER}:${process.env.WORDPRESS_FORMS_APP_PASSWORD}`;
  return fetch(`${baseUrl}/wp-json/mr/v1/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(credentials).toString("base64")}`,
      ...init.headers,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
}

export async function submitToWordPress(type: SubmissionType, data: Record<string, string>) {
  if (!isWordPressFormsConfigured()) {
    // Never silently drop a real enquiry: in production this surfaces the form's
    // "please email us directly" message instead of a false success.
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Form delivery is not configured: set WORDPRESS_URL, WORDPRESS_FORMS_USER and WORDPRESS_FORMS_APP_PASSWORD.",
      );
    }
    // Development only. Field names, not values — dispute details are confidential.
    console.info(`[forms] ${type} submission accepted but not stored (WordPress not configured).`, Object.keys(data));
    return;
  }

  const response = await wordpressApiFetch(`submissions/${type}`, {
    method: "POST",
    body: JSON.stringify(withLabels(type, data)),
  });

  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 300);
    throw new Error(`WordPress rejected the ${type} submission (${response.status}): ${detail}`);
  }
}
