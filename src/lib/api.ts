const API_BASE = "https://partner-ext-api.myrealtrip.com";

async function apiRequest<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const apiKey = process.env.MYREALTRIP_API_KEY;
  if (!apiKey) throw new Error("MYREALTRIP_API_KEY not set");

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.result?.status !== 200) {
    throw new Error(`API error: ${json.result?.message || "Unknown"}`);
  }
  return json.data;
}

// 항공권
export interface FlightPrice {
  fromCity: string;
  toCity: string;
  period: number | null;
  departureDate: string;
  returnDate: string | null;
  totalPrice: number;
  airline: string | null;
  transfer: number | null;
  averagePrice: number | null;
}

export async function getFlightBulkLowest(depCityCd: string, period: number): Promise<FlightPrice[]> {
  return apiRequest("/v1/products/flight/calendar/bulk-lowest", { depCityCd, period });
}

// 숙소
export interface Accommodation {
  itemId: number;
  itemName: string;
  salePrice: number;
  originalPrice: number;
  starRating: number;
  reviewScore: string;
  reviewCount: number;
}

export interface AccommodationResult {
  items: Accommodation[];
  totalCount: number;
  page: number;
  size: number;
}

export async function searchAccommodation(params: {
  keyword: string;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount?: number;
  isDomestic?: boolean;
  minPrice?: number;
  maxPrice?: number;
  order?: string;
  page?: number;
  size?: number;
  starRating?: string;
}): Promise<AccommodationResult> {
  return apiRequest("/v1/products/accommodation/search", params as Record<string, unknown>);
}

// 투어티켓
export interface TnaCategory {
  name: string;
  value: string;
}

export async function getTnaCategories(city: string): Promise<{ categories: TnaCategory[]; totalCount: number }> {
  return apiRequest("/v1/products/tna/categories", { city });
}

export interface TnaItem {
  gid: string;
  itemName: string;
  description: string;
  salePrice: number;
  priceDisplay: string;
  category: string;
  reviewScore: number;
  reviewCount: number;
  imageUrl: string;
  productUrl: string;
  deepLink: string;
  tags: string[];
}

export interface TnaSearchResult {
  items: TnaItem[];
  totalCount: number;
  page: number;
  perPage: number;
  hasNextPage: boolean;
}

export async function searchTna(params: {
  keyword: string;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  perPage?: number;
}): Promise<TnaSearchResult> {
  return apiRequest("/v1/products/tna/search", params as Record<string, unknown>);
}

