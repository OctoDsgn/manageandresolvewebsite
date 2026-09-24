import { handleFormSubmission } from "@/lib/api";
import { validateTrainingEnquiry } from "@/lib/forms";

export async function POST(request: Request) {
  return handleFormSubmission(request, validateTrainingEnquiry, (submission) => {
    // TODO(delivery): forward to the Academy inbox / CRM (and send the brochure
    // automatically for "brochure" requests once the PDFs exist).
    console.log("[training] New training enquiry", { receivedAt: new Date().toISOString(), ...submission });
  });
}
