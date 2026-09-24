import { handleFormSubmission } from "@/lib/api";
import { validateNewsletter } from "@/lib/forms";

export async function POST(request: Request) {
  return handleFormSubmission(request, validateNewsletter, (submission) => {
    // TODO(delivery): subscribe via Mailchimp / Substack / ConvertKit and trigger
    // the confirmation email described in the copy doc.
    console.log("[newsletter] New Dede Law subscriber", {
      receivedAt: new Date().toISOString(),
      ...submission,
    });
  });
}
