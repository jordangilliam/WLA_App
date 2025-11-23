export type PollinatorPlant = {
  commonName: string
  latinName: string
  bloomSeason: 'spring' | 'summer' | 'fall'
  sun: 'full' | 'partial' | 'shade'
  moisture: 'dry' | 'medium' | 'wet'
  height: string
  wildlifeValue: string
  notes: string
  image?: string
}

export const POLLINATOR_PLANTS: PollinatorPlant[] = [
  {
    commonName: 'Wild Bergamot',
    latinName: 'Monarda fistulosa',
    bloomSeason: 'summer',
    sun: 'full',
    moisture: 'medium',
    height: '2-4 ft',
    wildlifeValue: 'Bees, hummingbirds, swallowtail caterpillars',
    notes: 'Aromatic foliage resists deer. Excellent mid-summer nectar source for bees and hummingbirds.',
  },
  {
    commonName: 'Blue Vervain',
    latinName: 'Verbena hastata',
    bloomSeason: 'summer',
    sun: 'full',
    moisture: 'medium',
    height: '3-5 ft',
    wildlifeValue: 'Bee specialists, skipper butterflies',
    notes: 'Thrives in rain gardens or along wet meadows. Tall spires offer structure and late-season nectar.',
  },
  {
    commonName: 'Virginia Mountain Mint',
    latinName: 'Pycnanthemum virginianum',
    bloomSeason: 'summer',
    sun: 'full',
    moisture: 'medium',
    height: '2-3 ft',
    wildlifeValue: 'Over 100 native bee species plus beneficial wasps',
    notes: 'Compact clumps with silvery foliage. Incredible pollinator magnet with a long bloom window.',
  },
  {
    commonName: 'Purple Coneflower',
    latinName: 'Echinacea purpurea',
    bloomSeason: 'summer',
    sun: 'full',
    moisture: 'medium',
    height: '2-4 ft',
    wildlifeValue: 'Bees, fritillary butterflies, goldfinches eat seed heads',
    notes: 'Iconic meadow perennial adaptable to many soils. Leave seed heads standing for birds.',
  },
  {
    commonName: 'Swamp Milkweed',
    latinName: 'Asclepias incarnata',
    bloomSeason: 'summer',
    sun: 'full',
    moisture: 'wet',
    height: '3-4 ft',
    wildlifeValue: 'Monarch larval host, nectar for swallowtails and bees',
    notes: 'Perfect for wet gardens or container water features. Vanilla-scented blooms and monarch powerhouse.',
  },
  {
    commonName: 'Foxglove Beardtongue',
    latinName: 'Penstemon digitalis',
    bloomSeason: 'spring',
    sun: 'full',
    moisture: 'medium',
    height: '2-3 ft',
    wildlifeValue: 'Long-tongued native bees, hummingbirds',
    notes: 'Late-spring white spires support early pollinators. Sterile cultivars provide long bloom without reseeding.',
  },
  {
    commonName: 'Golden Alexanders',
    latinName: 'Zizia aurea',
    bloomSeason: 'spring',
    sun: 'partial',
    moisture: 'medium',
    height: '1-3 ft',
    wildlifeValue: 'Black swallowtail host plant, early solitary bees',
    notes: 'Umbel blooms pair well with woodland edges. Supports beneficial predatory insects.',
  },
  {
    commonName: 'New England Aster',
    latinName: 'Symphyotrichum novae-angliae',
    bloomSeason: 'fall',
    sun: 'full',
    moisture: 'medium',
    height: '3-5 ft',
    wildlifeValue: 'Late-season bumble bees, monarch migrants',
    notes: 'Crucial autumn nectar source. Pinch in early summer for bushier growth if space is limited.',
  },
  {
    commonName: 'Blue-stemmed Goldenrod',
    latinName: 'Solidago caesia',
    bloomSeason: 'fall',
    sun: 'partial',
    moisture: 'medium',
    height: '2-3 ft',
    wildlifeValue: 'Over 115 pollinator species, soldier beetles',
    notes: 'Shade-tolerant goldenrod with arching stems. Non-aggressive and perfect for woodland borders.',
  },
  {
    commonName: 'Little Bluestem',
    latinName: 'Schizachyrium scoparium',
    bloomSeason: 'summer',
    sun: 'full',
    moisture: 'dry',
    height: '2-3 ft',
    wildlifeValue: 'Grass skipper host plant, winter bird cover',
    notes: 'Warm-season grass that adds movement and winter interest. Anchors meadow plantings.',
  },
]




