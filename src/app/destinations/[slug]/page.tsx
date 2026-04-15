import { permanentRedirect } from "next/navigation";
import { destinations } from "@/data/destinations";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/city/${slug}`);
}
