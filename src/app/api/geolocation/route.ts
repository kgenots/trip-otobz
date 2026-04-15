import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lng = req.nextUrl.searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ko`,
      {
        headers: {
          "User-Agent": "TripOTOBZ/1.0 (https://trip.otobz.com)",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Geocoding failed" }, { status: 502 });
    }

    const data = await res.json();
    const address = data.address || {};

    return NextResponse.json({
      city: address.city || address.town || address.county || address.state || "",
      country: address.country || "",
      countryCode: address.country_code?.toUpperCase() || "",
    });
  } catch {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
  }
}
