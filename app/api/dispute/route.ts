import { handleFormSubmission } from "@/lib/api";
import { validateDispute } from "@/lib/forms";
import { submitToWordPress } from "@/lib/wordpress-submissions";

export async function POST(request: Request) {
  return handleFormSubmission(request, validateDispute, (submission) => submitToWordPress("dispute", submission));
}
