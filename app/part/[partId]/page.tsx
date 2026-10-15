import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPart, PART_ORDER } from '@/lib/parts';
import PartViewer from './PartViewer';

/** Pre-render semua part saat build. */
export function generateStaticParams() {
  return PART_ORDER.map((partId) => ({ partId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ partId: string }>;
}): Promise<Metadata> {
  const { partId } = await params;
  const part = getPart(partId);
  if (!part) return { title: 'Part tidak ditemukan' };
  return {
    title: `${part.number} — ${part.title} | Network Engineer Virtual Lab`,
    description: part.description,
  };
}

export default async function PartPage({
  params,
}: {
  params: Promise<{ partId: string }>;
}) {
  const { partId } = await params;
  if (!getPart(partId)) notFound();
  return <PartViewer partId={partId} />;
}
