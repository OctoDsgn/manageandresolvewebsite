import { handleFormSubmission } from "@/lib/api";
import { validateDispute } from "@/lib/forms";

export async function POST(request: Request) {
  return handleFormSubmission(request, validateDispute, (submission) => {
    // TODO(delivery): route to a secure CRM or dedicated inbox (never a public
    // spreadsheet — see the copy doc). Once that is wired up, stop logging the
    // submission body: dispute details are confidential and should not sit in
    // platform logs.
    console.log("[dispute] New dispute enquiry", {
      receivedAt: new Date().toISOString(),
      ...submission,
    });
  });
}
