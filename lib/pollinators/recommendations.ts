import { POLLINATOR_PLANTS, PollinatorPlant } from '@/lib/data/pollinator-plants'

type PlannerInput = {
  locationType: string
  region: string
  sunExposure: 'full' | 'partial' | 'shade'
  soilMoisture: 'dry' | 'medium' | 'wet'
  availableArea: number
  maintenanceLevel: 'low' | 'medium' | 'high'
  bloomFocus: 'spring' | 'summer' | 'fall' | 'extended'
}

type Recommendation = {
  summary: string
  bloomCalendar: Array<{
    season: 'spring' | 'summer' | 'fall'
    highlights: string[]
  }>
  plantingTips: string[]
  plantPalette: PollinatorPlant[]
  stewardshipTasks: string[]
}

export function generatePollinatorPlan(input: PlannerInput): Recommendation {
  const palette = buildPlantPalette(input)
  const bloomCalendar = buildBloomCalendar(palette)

  return {
    summary: buildSummary(input, palette),
    bloomCalendar,
    plantingTips: buildPlantingTips(input),
    plantPalette: palette,
    stewardshipTasks: buildStewardshipTasks(input),
  }
}

function buildPlantPalette(input: PlannerInput): PollinatorPlant[] {
  let filtered = POLLINATOR_PLANTS.filter(
    (plant) =>
      (plant.sun === input.sunExposure ||
        input.sunExposure === 'partial' ||
        plant.sun === 'partial') &&
      (plant.moisture === input.soilMoisture ||
        input.soilMoisture === 'medium' ||
        plant.moisture === 'medium')
  )

  if (input.bloomFocus !== 'extended') {
    filtered = filtered.filter((plant) => plant.bloomSeason === input.bloomFocus)
  }

  if (filtered.length < 4) {
    filtered = POLLINATOR_PLANTS
  }

  const cap = input.availableArea < 150 ? 4 : input.availableArea < 400 ? 6 : 8
  return filtered.slice(0, cap)
}

function buildBloomCalendar(palette: PollinatorPlant[]) {
  const seasons: Array<'spring' | 'summer' | 'fall'> = ['spring', 'summer', 'fall']
  return seasons.map((season) => ({
    season,
    highlights: palette
      .filter((plant) => plant.bloomSeason === season)
      .map((plant) => plant.commonName),
  }))
}

function buildSummary(input: PlannerInput, palette: PollinatorPlant[]): string {
  const hostCount = palette.filter((plant) =>
    /milkweed|alexander|bluestem/i.test(plant.commonName)
  ).length

  return [
    `Design for ${input.locationType} in the ${input.region} with ${input.sunExposure} sun and ${input.soilMoisture} soils.`,
    `Includes ${palette.length} native species supporting bees, butterflies, and birds${
      hostCount ? `, including ${hostCount} larval host choices` : ''
    }.`,
    `Maintenance level: ${input.maintenanceLevel}.`,
  ].join(' ')
}

function buildPlantingTips(input: PlannerInput): string[] {
  const tips = [
    'Layer heights to mimic meadow structure (grasses, mid-height perennials, flowering spires).',
    'Group plants in drifts of 3-5 to help pollinators forage efficiently.',
    'Provide shallow water or damp bare soil for mason bees and butterflies.',
  ]

  if (input.soilMoisture === 'wet') {
    tips.push('Use a berm or overflow mulch basin to manage stormwater around plantings.')
  }

  if (input.sunExposure !== 'full') {
    tips.push('Leverage dappled light by mixing woodland-edge asters and goldenrods.')
  }

  if (input.availableArea < 75) {
    tips.push('Tuck planters or window boxes near the site to extend bloom time in small spaces.')
  }

  return tips
}

function buildStewardshipTasks(input: PlannerInput): string[] {
  return [
    'Leave plant stems standing through winter for native bee nesting.',
    'Cut back in early spring and scatter stems (~8" sections) in a quiet corner.',
    'Add a light top-dress of leaf compost each fall to feed soil life.',
    input.maintenanceLevel === 'low'
      ? 'Hand-pull seedlings once each season instead of frequent weeding.'
      : 'Schedule monthly check-ins for staking, deadheading, and weed patrol.',
  ]
}

export type { Recommendation as PollinatorRecommendation }



