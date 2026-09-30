import { handleFormSubmission } from "@/lib/api";
import { validateContact } from "@/lib/forms";
import { submitToWordPress } from "@/lib/wordpress-submissions";

export async function POST(request: Request) {
  return handleFormSubmission(request, validateContact, (submission) => submitToWordPress("contact", submission));
}
