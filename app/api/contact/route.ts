import { handleFormSubmission } from "@/lib/api";
import { validateContact } from "@/lib/forms";

export async function POST(request: Request) {
  return handleFormSubmission(request, validateContact, (submission) => {
    // TODO(delivery): forward to hello@manageandresolve.com (or the CRM).
    console.log("[contact] New enquiry", { receivedAt: new Date().toISOString(), ...submission });
  });
}
