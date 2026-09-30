import { handleFormSubmission } from "@/lib/api";
import { validateNewsletter } from "@/lib/forms";
import { submitToWordPress } from "@/lib/wordpress-submissions";

export async function POST(request: Request) {
  return handleFormSubmission(request, validateNewsletter, (submission) => submitToWordPress("newsletter", submission));
}
