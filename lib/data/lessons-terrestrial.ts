/**
 * Terrestrial Camp Lessons (Bucktails, Gobblers, Ursids)
 * Based on Penn State Extension frameworks
 */

import type { Lesson } from '../types/lesson.types';

export const terrestrialLessons: Lesson[] = [
  {
    id: 'bucktails-deer-browse-regeneration',
    slug: 'deer-browse-forest-regeneration',
    track: 'Bucktails',
    title: 'Deer Browse & Forest Regeneration',
    description: 'Understand how browsing pressure and soil conditions affect forest regeneration, and learn management strategies.',
    estimatedMinutes: 30,
    difficulty: 'intermediate',
    objectives: [
      'Diagnose browse impacts vs. light and competition limitations',
      'Recognize fern/laurel layers and their significance',
      'Understand exclosure logic and application',
      'Explain how soils and pH affect seedling establishment',
    ],
    content: `## The Regeneration Challenge

Forest regeneration is **constrained by three major factors**: deer browsing pressure, soil conditions (especially pH), and competition from other plants. Understanding these relationships is crucial for effective wildlife and forest management.

### Core Principle

**Regeneration is constrained by deer + soils + competition**

Browsing pressure and low pH often limit seedlings. However, **fencing and liming can change outcomes**. This is the foundation of science-based deer management.

## Diagnosing Browse Impacts

### Visual Indicators

**Browse Line**
- Distinct horizontal line where deer can reach
- Typically 4-6 feet high
- Creates "parkland" appearance

**Seedling Heights**
- Measure seedlings in and outside exclosures
- Height differences indicate browse pressure
- Track over multiple growing seasons

**Fern & Laurel Layers**
- Dense hay-scented fern or mountain laurel
- Often indicates **historic heavy browsing**
- Ferns thrive when tree seedlings are removed
- Can persist for decades

### Exclosure Logic

**What is an Exclosure?**
- Fenced area that excludes deer
- Allows comparison: browsed vs. unbrowsed
- Shows regeneration potential

**Reading Exclosures**
- Inside: What **could** grow without deer
- Outside: What **actually** grows with current deer density
- Difference = Browse impact

## Soil Factors

### pH and Calcium/Magnesium

**Why pH Matters**
- Most PA soils are naturally acidic (pH 4.0-5.5)
- Optimal for most tree species: pH 5.5-6.5
- Low pH limits nutrient availability
- Affects which plants can establish

**Calcium and Magnesium Roles**
- Essential nutrients for plant growth
- Leached from acid soils over time
- Liming adds both nutrients and raises pH
- Black cherry especially responsive

### Competition Effects

**Light Competition**
- Shade-tolerant species (maple, beech) can grow under canopy
- Shade-intolerant species (oak, cherry) need gaps
- Browse pressure + shade = regeneration failure

**Plant Competition**
- Ferns and laurel compete for resources
- Established vegetation resists seedlings
- May need mechanical treatment

## Management Strategies

### Deer Population Management

**Evidence-Based Approaches**
- Population models based on harvest data
- Doe harvest to reduce population
- Antler restrictions to improve age structure
- Monitoring through surveys and exclosures

### Soil Amendments

**When to Lime**
- Test soil first (pH, Ca, Mg levels)
- Apply agricultural lime to raise pH
- Typically 2-4 tons per acre
- Effects last 5-10 years

### Fencing Options

**Temporary Exclosures**
- Research and monitoring
- Small scale (1/4 acre)
- Shows regeneration potential

**Commercial Fencing**
- Large scale (acres to miles)
- Protects timber investment
- Expensive but effective

## Field Application

### Data Collection Protocol

1. **Establish Plots**
   - Mark permanent locations
   - Use GPS coordinates
   - Photo points for comparison

2. **Measure Seedlings**
   - Count by species
   - Record heights
   - Note browse damage

3. **Document Conditions**
   - Soil pH
   - Fern/laurel cover
   - Canopy closure
   - Browse line presence

4. **Quality Assurance**
   - Consistent methods
   - Multiple observers
   - Annual re-measurement
   - Data backup

### Safety Considerations

- **Tick Prevention**
  - Long sleeves/pants
  - Permethrin-treated clothing
  - Tick checks after fieldwork
  
- **Tool Safety**
  - Proper training for measuring equipment
  - First aid kit accessible
  - Buddy system in field

## Climate-Smart Forestry Connection

**Deer Management as Climate Adaptation**
- Diverse forest is more resilient
- Browse prevents diversity
- Managing deer promotes resilience
- Multiple species = multiple strategies

**Species Selection**
- Consider climate change projections
- Favor diverse age and species mix
- Some species more browse-tolerant
- Monitor and adapt over time

## Communication Challenge

**Translate to Stakeholders**
- Deer management is **forest health** issue
- Show data from exclosures
- Explain soil-deer-regeneration link
- Present evidence, not opinion

Practice explaining:
"Without adequate regeneration, our forests will fail to replace themselves as mature trees die. Exclosures show we have the seed source and site potential, but current deer densities prevent young trees from growing past browse height."`,
    quiz: [
      {
        id: 'q1',
        prompt: 'What are the three major factors constraining forest regeneration in PA?',
        choices: [
          'Temperature, rainfall, and sunlight',
          'Deer browsing, soil pH, and plant competition',
          'Insects, disease, and windstorms',
          'Logging, development, and recreation',
        ],
        correctIndex: 1,
        explanation: 'Penn State research shows that deer browsing pressure, soil conditions (especially low pH), and competition from plants like ferns and laurel are the primary constraints on regeneration in Pennsylvania forests.',
      },
      {
        id: 'q2',
        prompt: 'What does a dense layer of hay-scented fern indicate?',
        choices: [
          'Excellent growing conditions for trees',
          'Recent forest fire',
          'Historic heavy deer browsing',
          'High soil fertility',
        ],
        correctIndex: 2,
        explanation: 'Dense fern layers typically indicate historic heavy browsing pressure. When deer remove tree seedlings repeatedly, ferns (which deer avoid) can dominate the understory and persist for decades, even if deer pressure later decreases.',
      },
      {
        id: 'q3',
        prompt: 'What is the primary purpose of a forest exclosure?',
        choices: [
          'To grow timber commercially',
          'To demonstrate regeneration potential without deer browsing',
          'To protect rare plants only',
          'To prevent human access',
        ],
        correctIndex: 1,
        explanation: 'Exclosures allow us to compare what grows inside (without deer) versus outside (with deer). The difference shows the actual impact of browsing on forest regeneration. This provides objective data for management decisions.',
      },
      {
        id: 'q4',
        prompt: 'Why is soil pH important for forest regeneration?',
        choices: [
          'It determines water drainage only',
          'It affects nutrient availability and which species can establish',
          'It only matters for agricultural crops',
          'pH has no effect on forest growth',
        ],
        correctIndex: 1,
        explanation: 'Soil pH affects which nutrients are available to plants. Most PA soils are acidic (pH 4-5.5), but most trees grow best at pH 5.5-6.5. Low pH also means lower calcium and magnesium, essential nutrients that have been leached away over time. Liming can improve conditions.',
      },
      {
        id: 'q5',
        prompt: 'How does managing deer populations relate to climate adaptation?',
        choices: [
          'It has no connection to climate',
          'Diverse forests are more resilient, but browse prevents diversity',
          'Deer cause climate change',
          'Climate change eliminates the need for deer management',
        ],
        correctIndex: 1,
        explanation: 'Diverse forests with multiple species and ages are more resilient to climate change impacts. However, heavy deer browsing prevents this diversity by limiting regeneration. Managing deer to sustainable levels allows diverse forest development, which is a key climate adaptation strategy.',
      },
    ],
    resources: [
      {
        label: 'Penn State: Deer-Forest Regeneration Study',
        url: 'https://ecosystems.psu.edu/research/projects/deer',
        type: 'article',
      },
      {
        label: 'PSU Extension: Forest Regeneration Assessment',
        url: 'https://extension.psu.edu/forest-regeneration',
        type: 'article',
      },
      {
        label: 'Understanding Exclosures',
        url: 'https://extension.psu.edu/understanding-deer-exclosures',
        type: 'article',
      },
    ],
    standards: [
      'PDE Env & Ecology 4.3.12.A - Natural Resource Management',
      'PDE Env & Ecology 4.6.12.A - Ecosystems and Their Interactions',
      'NGSS HS-LS2-6 - Ecosystem Dynamics',
      'NGSS HS-LS2-7 - Ecosystem Services',
    ],
    tags: ['deer management', 'forest regeneration', 'soil science', 'wildlife ecology', 'climate adaptation'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  
  {
    id: 'terrestrial-invasive-species-management',
    slug: 'invasive-species-management',
    track: 'Bucktails',
    title: 'Invasive Species Management',
    description: 'Learn to identify invasive plants, understand their impacts, and apply integrated control methods safely and effectively.',
    estimatedMinutes: 30,
    difficulty: 'intermediate',
    objectives: [
      'Identify common PA invasive plants and their introduction pathways',
      'Understand why prevention beats removal',
      'Apply integrated control decision-making',
      'Know legal boundaries for herbicide education',
    ],
    content: `## Why Invasives Matter

**Core Principle**: Invasives reduce habitat function; **prevention beats removal**.

Invasive plants displace native species, reduce wildlife food and cover, and can cost thousands of dollars per acre to control. Early detection and rapid response are far more effective than dealing with established infestations.

### Understanding the Problem

**What Makes a Plant "Invasive"?**
- Non-native to the ecosystem
- Spreads aggressively
- Causes environmental or economic harm
- Lacks natural controls (predators, diseases)

**Impact on Wildlife Habitat**
- **Monocultures** replace diversity
- Reduced food sources (insects, seeds, berries)
- Poor cover quality
- Altered fire regimes
- Changed soil chemistry

## Common PA Invasives

### Tree & Shrub Invaders

**Tree of Heaven** (*Ailanthus altissima*)
- Rapidly spreading
- Allelopathic (poisons soil for other plants)
- Harbors spotted lanternfly
- Smooth bark with pale streaks

**Autumn Olive** (*Elaeagnus umbellata*)
- Forms dense thickets
- Silvery leaves
- Red berries spread by birds
- Fixes nitrogen, changing soil

**Multiflora Rose** (*Rosa multiflora*)
- Impenetrable thorny tangles
- White flower clusters in spring
- Small red rose hips
- Outcompetes native shrubs

### Herbaceous Invaders

**Garlic Mustard** (*Alliaria petiolata*)
- Biennial with garlic smell when crushed
- Invades forest understory
- Releases toxins that harm mycorrhizae
- Seeds viable 5+ years

**Japanese Stiltgrass** (*Microstegium vimineum*)
- Annual grass
- Forms dense mats in forests
- Pale midrib stripe
- Prevents tree regeneration

**Mile-a-Minute Weed** (*Persicaria perfoliata*)
- Vine with recurved thorns
- Triangular leaves
- Blue berries
- Can grow 6 inches per day

## Introduction Pathways

### How Invasives Arrive

**Intentional Introductions**
- Ornamental plantings (escaped from gardens)
- Erosion control (autumn olive, crown vetch)
- Wildlife food (multiflora rose "for birds")

**Accidental Pathways**
- Contaminated seed mixes
- Soil on equipment
- Contaminated hay or mulch
- Attached to vehicles
- Water currents

### Prevention Strategies

**Before Invasives Arrive**
1. **Use native plants** in all plantings
2. **Clean equipment** between sites
3. **Inspect incoming materials** (soil, mulch, plants)
4. **Monitor regularly** for new arrivals
5. **Educate contractors** and volunteers

**Early Detection**
- Regular surveys of property boundaries
- Check high-risk areas (trails, roads, streams)
- Document locations immediately
- Act fast when populations are small

## Integrated Control Methods

### The Decision Tree

**Step 1: Identify the Species**
- Correct ID is critical
- Use multiple sources to confirm
- Document with photos

**Step 2: Assess the Situation**
- How large is the infestation?
- What's the habitat value?
- What's nearby that we want to protect?
- Resources available?

**Step 3: Choose Method(s)**

### Mechanical Control

**Hand-Pulling**
- **Best for**: Small infestations, annuals, loose soil
- **When**: Before seed set
- **Technique**: Pull entire root system
- **Follow-up**: Required for perennials

**Cutting/Mowing**
- **Best for**: Woody species, large areas
- **Timing**: Just before flowering
- **Frequency**: Multiple times per season
- **Limitation**: Stimulates resprouting without follow-up

**Grubbing/Digging**
- **Best for**: Established woody plants
- **Tools**: Mattock, weed wrench
- **Technique**: Remove root crown
- **Disposal**: Do not compost seeds

### Cultural Control

**Restore Competition**
- Plant natives immediately after removal
- Dense native plantings resist invasion
- Match species to site conditions
- Maintain healthy native communities

**Alter Conditions**
- Increase shade (for sun-loving invasives)
- Improve drainage (for wetland invaders)
- Adjust pH if appropriate
- Promote native plant vigor

### Chemical Control (Education Only)

**IMPORTANT LEGAL BOUNDARY**
- Students learn about herbicides for career literacy
- **No application by students**
- Label-is-the-law for licensed applicators
- Discuss only in educational context

**Types of Herbicides** (knowledge only)
- **Selective**: Target specific plant types
- **Non-selective**: Kill all vegetation
- **Systemic**: Translocate to roots
- **Contact**: Kill only sprayed tissue

**Why Timing Matters**
- Systemic herbicides need active growth
- Fall application often most effective (plants moving sugars to roots)
- Avoid flowering (to not harm pollinators)
- Weather conditions critical

**Safety & Legal Requirements**
- Pesticide applicator license required
- PPE (Personal Protective Equipment) mandatory
- Notification requirements
- Environmental restrictions (near water)

## Field Protocols

### Survey & Mapping

**What to Record**
- Species and extent
- GPS coordinates or map location
- Density (scattered, patchy, dense)
- Associated vegetation
- Site conditions
- Photos (include scale object)

**Monitoring Schedule**
- Spring: Garlic mustard, stiltgrass emerging
- Summer: Active growth, pre-flowering surveys
- Fall: Late-season species, seed production
- Annual: Track changes over time

### Safety First

**Physical Hazards**
- **Thorns**: Rose, barberry, devil's walking stick
- **Poison ivy**: Often mixed with invasives
- **Ticks**: Prevalent in invaded areas
- **Terrain**: Slopes, uneven ground

**PPE Recommendations**
- Long sleeves and pants
- Leather gloves for thorny species
- Eye protection when cutting
- Sturdy boots

**Tool Safety**
- Proper training required
- Maintain sharp, clean tools
- Appropriate tool for task
- First aid kit accessible

### Disposal

**Do Not Spread!**
- Bag seeds and flowers
- Do not compost invasives
- Pile woody material for drying (in place)
- Burn only if permitted and safe
- Some plants require disposal at landfill

## Prevention is Cheaper

### Economic Reality

**Costs of Established Invasions**
- Professional removal: $500-3,000/acre
- Multiple treatments over years
- Lost ecological function
- Ongoing monitoring

**Costs of Prevention**
- Early detection surveys: minimal
- Hand-pulling small populations: $50/hour labor
- Native plantings (one-time): $200-500/acre
- Education: pennies per person

**Return on Investment**
- Every $1 spent on prevention saves $10-100 on control
- Native ecosystems provide free "weed control"
- Healthy forests resist invasion

## Career Connections

**Invasive Species Specialists**
- DCNR, county conservation districts
- Consulting firms
- Non-profit land trusts
- Research institutions

**Required Knowledge**
- Botany and plant ID
- Ecology and habitat assessment
- Pesticide application (if using chemicals)
- Project management
- Communication with landowners

**Skills Students Develop**
- Scientific observation
- Problem-solving with limited resources
- Physical fieldwork
- Data management
- Teamwork

## Communication Challenge

**Translate for Landowners**
- Invasives are not "just weeds"
- Show cost-benefit of early action
- Explain ecological impacts simply
- Offer to help or connect to resources

**Practice this pitch**:
"These plants are like a wildfire in slow motion. A small patch today becomes acres in five years. If we act now while it's manageable, we save thousands of dollars and protect the habitat for wildlife."`,
    quiz: [
      {
        id: 'q1',
        prompt: 'Why is prevention more effective than removal for invasive species?',
        choices: [
          'Prevention is easier but not actually more effective',
          'Small populations are much cheaper to control, and established invasions are expensive',
          'There is no difference between prevention and removal',
          'Removal is always more effective',
        ],
        correctIndex: 1,
        explanation: 'Prevention through early detection and rapid response is 10-100 times more cost-effective than controlling established invasions. Small populations can be hand-pulled for minimal cost, while established infestations may cost thousands of dollars per acre and require years of treatment.',
      },
      {
        id: 'q2',
        prompt: 'What is the most important first step in invasive species control?',
        choices: [
          'Apply herbicide immediately',
          'Correctly identify the species',
          'Remove all vegetation in the area',
          'Ignore it and hope it goes away',
        ],
        correctIndex: 1,
        explanation: 'Correct identification is critical. Different species require different control methods, and you need to be sure you are not removing a rare native species that looks similar. Always use multiple sources to confirm identification before taking action.',
      },
      {
        id: 'q3',
        prompt: 'What does "integrated control" mean for invasive species management?',
        choices: [
          'Using only one method repeatedly',
          'Combining multiple methods (mechanical, cultural, chemical) based on the situation',
          'Integrating invasives into the ecosystem',
          'Controlling only one species at a time',
        ],
        correctIndex: 1,
        explanation: 'Integrated control means using a combination of methods—mechanical (cutting, pulling), cultural (planting natives), and sometimes chemical—based on the specific situation. This approach is more effective and sustainable than relying on a single method.',
      },
      {
        id: 'q4',
        prompt: 'Can high school students apply herbicides during invasive species removal?',
        choices: [
          'Yes, with teacher supervision',
          'Yes, if they wear gloves',
          'No, herbicide application requires a pesticide applicator license',
          'Yes, for educational purposes only',
        ],
        correctIndex: 2,
        explanation: 'Herbicide application requires a pesticide applicator license in Pennsylvania. Students can learn about herbicides for career literacy and education, but cannot apply them. This is a legal boundary that protects both students and the environment.',
      },
      {
        id: 'q5',
        prompt: 'Why should you NOT compost invasive plants after removal?',
        choices: [
          'They will improve the compost',
          'Seeds may survive and spread when compost is used',
          'Composting is illegal',
          'Invasive plants cannot decompose',
        ],
        correctIndex: 1,
        explanation: 'Many invasive plant seeds can survive the composting process and remain viable for years. If you spread that compost, you are actually spreading the invasion. Seeds should be bagged and disposed of properly, and woody material should be dried in place or taken to approved disposal sites.',
      },
    ],
    resources: [
      {
        label: 'Penn State Extension: Invasive Plants',
        url: 'https://extension.psu.edu/invasive-plants',
        type: 'article',
      },
      {
        label: 'PA DCNR: Invasive Species Management',
        url: 'https://www.dcnr.pa.gov/Conservation/WildPlants/InvasivePlants/Pages/default.aspx',
        type: 'article',
      },
      {
        label: 'iMapInvasives: Reporting & Tracking',
        url: 'https://www.imapinvasives.org/',
        type: 'interactive',
      },
    ],
    standards: [
      'PDE Env & Ecology 4.3.12.C - Biological Diversity',
      'PDE Env & Ecology 4.6.12.B - Ecosystems and Human Influence',
      'NGSS HS-LS2-6 - Ecosystem Dynamics',
      'NGSS HS-LS2-7 - Ecosystem Services',
    ],
    tags: ['invasive species', 'plant ID', 'habitat management', 'integrated pest management', 'conservation'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

