import { NextRequest, NextResponse } from 'next/server';
import {
  getPillarCatalog,
  getPillarById,
  getPillarRecommendations,
  getAssetsForPillar,
} from '@/lib/data/pillars';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pillarId = searchParams.get('pillarId');
  const tagsParam = searchParams.get('tags');
  const typesParam = searchParams.get('types');
  const limitParam = searchParams.get('limit');

  if (pillarId) {
    const pillar = getPillarById(pillarId);
    if (!pillar) {
      return NextResponse.json({ error: 'Pillar not found' }, { status: 404 });
    }

    const assets = getAssetsForPillar(pillarId);
    return NextResponse.json({ pillar, assets });
  }

  if (tagsParam || typesParam) {
    const tags = tagsParam ? tagsParam.split(',').map((tag) => tag.trim()) : [];
    const types = typesParam ? typesParam.split(',').map((type) => type.trim()) : [];
    const limit = limitParam ? Number(limitParam) : undefined;

    const recommendations = getPillarRecommendations({
      tags: tags.filter(Boolean),
      types: types.filter(Boolean),
      limit,
    });

    return NextResponse.json({ recommendations });
  }

  const catalog = getPillarCatalog();
  return NextResponse.json({
    generatedAt: catalog.generatedAt,
    pillars: catalog.pillars,
  });
}

