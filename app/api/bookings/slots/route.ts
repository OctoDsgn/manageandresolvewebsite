import { getSlots } from "@/lib/bookings";

/** Open consultation slots (Lagos time), straight from WordPress — never cached. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const from = /^\d{4}-\d{2}-\d{2}$/.test(params.get("from") ?? "") ? params.get("from")! : undefined;
  const days = Math.min(92, Math.max(1, Number(params.get("days")) || 31));

  const slots = await getSlots(from, days);
  if (!slots) {
    return Response.json({ ok: false, message: "Availability could not be loaded." }, { status: 503 });
  }
  return Response.json({ ok: true, days: slots }, { headers: { "Cache-Control": "no-store" } });
}
