import type { ValidationResult } from "./forms";

/**
 * Shared POST handler for the form endpoints: parse JSON, validate server-side
 * with the same rules as the client, then hand valid data to `deliver`.
 */
export async function handleFormSubmission<T>(
  request: Request,
  validate: (input: unknown) => ValidationResult<T>,
  deliver: (data: T) => Promise<void> | void,
) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const result = validate(payload);
  if (!result.ok) {
    return Response.json({ ok: false, errors: result.errors }, { status: 422 });
  }

  try {
    await deliver(result.data);
  } catch (error) {
    console.error("Form delivery failed", error);
    return Response.json({ ok: false, message: "Delivery failed." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
