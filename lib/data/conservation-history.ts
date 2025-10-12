/**
 * Conservation History Data
 * Comprehensive historical context for each wildlife/habitat topic
 * Includes Indigenous practices, colonial era, conservation movement, regulations, and current issues
 */

export interface ConservationHistorySection {
  era: string;
  period: string;
  icon: string;
  keyPoints: string[];
  paExample?: string;
  significance: string;
}

export interface ConservationHistory {
  topic: string;
  overview: string;
  sections: ConservationHistorySection[];
  currentIssues: string[];
  keyFigures?: Array<{
    name: string;
    role: string;
    contribution: string;
    era: string;
  }>;
  callToAction: string;
}

// ============================================================================
// FISHING CONSERVATION HISTORY
// ============================================================================

export const FISHING_CONSERVATION_HISTORY: ConservationHistory = {
  topic: "Fishing & Aquatic Conservation",
  overview: "The story of fishing conservation is one of loss, learning, and restoration. From Indigenous sustainable practices to overharvest and pollution, to modern science-based management, Pennsylvania&apos;s fisheries reflect our evolving relationship with nature.",
  sections: [
    {
      era: "Indigenous Stewardship",
      period: "Pre-1600s",
      icon: "🪶",
      keyPoints: [
        "Lenape (Delaware) and Susquehannock peoples practiced seasonal fishing",
        "Used weirs, nets, spears, and hooks made from bone and shell",
        "Harvested only what was needed; observed spawning seasons",
        "Fish were integral to spiritual practices and trade networks",
        "Maintained healthy fish populations for thousands of years",
        "Knowledge of fish behavior, habitats, and seasonal patterns passed through oral traditions"
      ],
      paExample: "The Susquehanna River, named after the Susquehannock people, was abundant with American Shad, Atlantic Sturgeon, and American Eel. Indigenous peoples developed sophisticated fish traps at Conowingo Falls and managed fisheries sustainably.",
      significance: "Indigenous fishing practices demonstrated that humans can coexist with and rely on fisheries without depleting them, through respect, knowledge, and restraint."
    },
    {
      era: "Colonial Exploitation",
      period: "1600s-1800s",
      icon: "⚓",
      keyPoints: [
        "European settlers viewed fish as unlimited resource",
        "Commercial fishing operations expanded rapidly",
        "Dams built for mills blocked fish migrations (shad, salmon, eel)",
        "Water pollution from tanneries, mills, and mining began",
        "By 1800s, many PA streams were severely degraded",
        "No concept of seasons, limits, or conservation"
      ],
      paExample: "Pennsylvania&apos;s native Atlantic Salmon were extinct by 1800s due to dam construction on the Susquehanna River. The Conowingo Dam (1928) eliminated the last major spawning run of American Shad, dropping populations from millions to near zero.",
      significance: "This era demonstrates the tragedy of the commons - when resources are treated as unlimited and unmanaged, they collapse. Pennsylvania lost entire species and fisheries."
    },
    {
      era: "Conservation Awakening",
      period: "1870s-1940s",
      icon: "📜",
      keyPoints: [
        "1873: Pennsylvania Fish Commission created (first in the nation)",
        "Fish hatcheries established to restore populations",
        "Stocking programs began with trout, bass, and shad",
        "Fishing licenses required (1885) to fund conservation",
        "Game laws passed to protect spawning seasons",
        "Pollution began to be recognized as threat to fisheries"
      ],
      paExample: "The PA Fish Commission built the Bellefonte Hatchery (1876), one of the first in America. By 1900, PA was stocking millions of trout annually. However, habitat degradation continued to worsen through coal mining, logging, and industry.",
      significance: "This era recognized that government intervention was necessary to prevent extinction. Hatcheries were seen as the solution, though habitat protection was still inadequate."
    },
    {
      era: "Environmental Movement",
      period: "1960s-1970s",
      icon: "🌍",
      keyPoints: [
        "1970: Clean Water Act passed - revolutionary for fisheries",
        "1972: DDT banned after devastating fish-eating birds (eagles, ospreys)",
        "Acid rain recognized as threat to PA trout streams",
        "Wild trout management began; hatchery reliance questioned",
        "Catch-and-release ethic emerged among anglers",
        "Stream restoration and riparian buffer protection started"
      ],
      paExample: "Pennsylvania&apos;s Class A Wild Trout streams program (1970s) identified and protected streams with naturally reproducing trout populations. The Schuylkill River, once one of America&apos;s most polluted rivers, began recovery after Clean Water Act enforcement.",
      significance: "This era shifted from &apos;fish as crops to harvest&apos; to &apos;fish as indicators of ecosystem health.&apos; Habitat protection became as important as stocking."
    },
    {
      era: "Modern Science-Based Management",
      period: "1980s-Present",
      icon: "🔬",
      keyPoints: [
        "Genetic studies show wild trout are healthier than hatchery fish",
        "Special regulation areas protect trophy fish and spawning",
        "Invasive species management (snakeheads, flathead catfish, didymo)",
        "Stream habitat improvement projects (log jams, riparian planting)",
        "Keystone 10 Program (1994) - partnership to restore 10 watersheds",
        "Citizen science and volunteer monitoring programs expanded"
      ],
      paExample: "PA&apos;s Unassessed Waters Initiative (2006-present) surveyed thousands of streams to identify wild trout populations. Discovery of self-sustaining brook trout in previously unknown streams led to protection designations.",
      significance: "Modern management balances stocking for recreation with protecting wild fish and habitats. Data-driven decisions replace assumptions."
    },
    {
      era: "Philanthropy & Land Conservation",
      period: "1890s-Present",
      icon: "🤝",
      keyPoints: [
        "Trout Unlimited founded (1959) - now 150+ PA chapters",
        "The Nature Conservancy protects critical watersheds",
        "Private landowners donate conservation easements",
        "Duck Stamps (1934) and fishing licenses fund habitat acquisition",
        "PA State Parks system (1893) protects lakes and rivers",
        "Local watershed associations form to protect streams"
      ],
      paExample: "Western Pennsylvania Conservancy has protected over 250,000 acres, including critical headwater streams. The Allegheny Land Trust protects urban watersheds near Pittsburgh. Trout Unlimited chapters restore hundreds of miles of PA streams annually.",
      significance: "Conservation requires more than government action. Private citizens, nonprofits, and philanthropists have protected millions of acres of fisheries habitat."
    },
    {
      era: "Federal Role in Fisheries",
      period: "1871-Present",
      icon: "🏛️",
      keyPoints: [
        "1871: U.S. Fish Commission created (now NOAA Fisheries)",
        "1950: Dingell-Johnson Act - excise tax on fishing gear funds state programs",
        "Clean Water Act (1972) requires permits for pollution discharge",
        "Endangered Species Act (1973) protects threatened fish",
        "Federal hatcheries supplement state programs",
        "USGS monitors water quality and fish populations nationwide"
      ],
      paExample: "The Dingell-Johnson Act provides PA Fish & Boat Commission $10+ million annually for hatcheries, boat launches, and habitat work. Federal endangered species protections helped recover Lake Sturgeon in PA waters.",
      significance: "Federal funding and regulations provide backbone for state conservation efforts. National standards ensure baseline protections everywhere."
    }
  ],
  currentIssues: [
    "**Climate Change**: Warming waters threaten cold-water species (trout). Some PA streams may become too warm for brook trout by 2050.",
    "**Invasive Species**: Snakeheads, Asian carp, zebra mussels, and didymo algae alter ecosystems and compete with natives.",
    "**Agricultural Runoff**: Nutrients and sediment from farms degrade water quality. Chesapeake Bay restoration requires PA stream improvements.",
    "**Urban Stormwater**: Parking lots and development send polluted runoff into streams. Green infrastructure solutions are expanding.",
    "**Abandoned Mine Drainage**: 5,500+ miles of PA streams impaired by acidic coal mine drainage. Ongoing treatment and restoration needed.",
    "**Microplastics**: Tiny plastic particles found in PA rivers and in fish tissues. Long-term health impacts unknown.",
    "**Dam Removal vs. Recreation**: Balancing dam removal for fish passage with concerns about lake recreation and property values.",
    "**Declining Anglers**: Fewer young people fishing means less political support and funding for conservation."
  ],
  keyFigures: [
    {
      name: "Thaddeus Norris",
      role: "Father of American Fly Fishing",
      contribution: "Wrote &apos;The American Angler&apos;s Book&apos; (1864), pioneered catch-and-release, and advocated for stream conservation in PA.",
      era: "1800s"
    },
    {
      name: "George Perkins Marsh",
      role: "Early Conservationist",
      contribution: "Wrote &apos;Man and Nature&apos; (1864), documenting how deforestation and agriculture damage fisheries. Influenced PA conservation policy.",
      era: "1800s"
    },
    {
      name: "Robert Bachman",
      role: "Wild Trout Advocate",
      contribution: "PA Fish Commission biologist who championed wild trout management over hatchery reliance in the 1970s-80s.",
      era: "1900s"
    },
    {
      name: "Rachel Carson",
      role: "Environmental Icon",
      contribution: "PA native whose book &apos;Silent Spring&apos; (1962) exposed pesticide impacts on aquatic ecosystems, leading to DDT ban.",
      era: "1900s"
    }
  ],
  callToAction: "Today&apos;s anglers are stewards, not just harvesters. By practicing catch-and-release, protecting habitats, and supporting conservation organizations, you&apos;re part of the solution. The fisheries you enjoy are gifts from past conservationists - pass them on improved."
};

// ============================================================================
// BIRD CONSERVATION HISTORY
// ============================================================================

export const BIRD_CONSERVATION_HISTORY: ConservationHistory = {
  topic: "Bird Conservation",
  overview: "Pennsylvania&apos;s bird populations tell a story of extinction, recovery, and ongoing challenges. From passenger pigeons darkening the sky to bald eagles nearly vanishing, our relationship with birds has transformed from exploitation to protection.",
  sections: [
    {
      era: "Indigenous Relationship",
      period: "Pre-1600s",
      icon: "🪶",
      keyPoints: [
        "Birds held spiritual significance in Lenape and Iroquois cultures",
        "Feathers used for ceremonies, clothing, and trade",
        "Sustainable hunting for food - only what was needed",
        "Eagles, owls, and hawks protected as sacred",
        "Bird behavior used to predict weather and seasons",
        "Migration patterns understood and respected"
      ],
      paExample: "The Lenape called the Great Blue Heron &apos;Pülthukquehëllan&apos; and observed its fishing techniques. Turkey tail feathers were prized for fletching arrows. The crow was a trickster figure in stories.",
      significance: "Indigenous peoples coexisted with abundant bird populations for millennia, taking only what they needed and respecting birds&apos; roles in nature."
    },
    {
      era: "Market Hunting Catastrophe",
      period: "1600s-1910s",
      icon: "🎯",
      keyPoints: [
        "Passenger Pigeon: most abundant bird in North America - extinct by 1914",
        "Commercial hunters shipped millions of birds to city markets",
        "Egret and heron plumes for women&apos;s hats led to near-extinction",
        "No hunting limits, no closed seasons, no bag limits",
        "Pennsylvania lost Passenger Pigeon, Carolina Parakeet, Heath Hen",
        "By 1900, songbirds sold in markets, raptors shot as &apos;vermin&apos;"
      ],
      paExample: "Passenger Pigeons nested in Pennsylvania by the billions. The last large nesting in PA was 1886 near Kane. Market hunters shipped barrel after barrel to cities. The last wild pigeon died in 1914 in Cincinnati Zoo.",
      significance: "Unlimited exploitation drove entire species extinct. No one believed the passenger pigeon could vanish - but it did, demonstrating that abundance doesn&apos;t mean invulnerability."
    },
    {
      era: "Early Conservation Laws",
      period: "1900s-1930s",
      icon: "📜",
      keyPoints: [
        "1900: Lacey Act - first federal wildlife protection law",
        "1913: Migratory Bird Treaty Act - protected most bird species",
        "1918: Migratory Bird Treaty (US-Canada) - coordinated conservation",
        "Audubon Society formed to fight plume trade",
        "State game commissions created, hunting seasons established",
        "First wildlife refuges designated"
      ],
      paExample: "Pennsylvania Game Commission created (1895) began setting hunting seasons and bag limits. Hawk Mountain Sanctuary (1934) became world&apos;s first raptor sanctuary after local tradition of shooting migrating hawks.",
      significance: "Government regulation saved birds from extinction. The Migratory Bird Treaty Act remains one of America&apos;s most important conservation laws."
    },
    {
      era: "DDT Crisis & Recovery",
      period: "1940s-1970s",
      icon: "🦅",
      keyPoints: [
        "1940s: DDT pesticide widely used in agriculture",
        "DDT accumulated in food chain, thinned bird eggshells",
        "Bald Eagles, Ospreys, Peregrine Falcons nearly extinct",
        "Rachel Carson&apos;s &apos;Silent Spring&apos; (1962) exposed the crisis",
        "1972: DDT banned in United States",
        "Captive breeding programs began for endangered raptors"
      ],
      paExample: "Pennsylvania had ZERO nesting Bald Eagles in 1980 (down from thousands historically). After DDT ban, eagles recovered. Now 300+ nesting pairs in PA. Peregrine Falcons reintroduced from captive breeding programs.",
      significance: "Human chemicals nearly destroyed top predators. This taught us that what we put in environment affects entire food chains. Recovery shows conservation can work."
    },
    {
      era: "Endangered Species Act Era",
      period: "1973-Present",
      icon: "📋",
      keyPoints: [
        "1973: Endangered Species Act - strongest wildlife law in world",
        "Protected species cannot be killed, harmed, or have habitat destroyed",
        "Recovery plans required for all endangered species",
        "Critical habitat designated and protected",
        "Success stories: Bald Eagle, Peregrine Falcon, Osprey all recovered",
        "Ongoing challenges: habitat loss, climate change"
      ],
      paExample: "Pennsylvania endangered species: Piping Plover (shorebird), Red Knot (shorebird), Upland Sandpiper (grassland bird), Short-eared Owl (marsh bird). All protected by federal and state laws.",
      significance: "The ESA prevents extinction and requires active recovery efforts. It&apos;s controversial but effective - no species protected by ESA has gone extinct."
    },
    {
      era: "Habitat Conservation Movement",
      period: "1980s-Present",
      icon: "🌳",
      keyPoints: [
        "Realized protecting species requires protecting habitats",
        "Grassland birds declining - 50% loss since 1970",
        "Forest fragmentation affects warblers, thrushes",
        "Wetland protection critical for waterfowl, shorebirds",
        "Important Bird Areas (IBA) program identifies key sites",
        "Partners in Flight coordinates conservation across Americas"
      ],
      paExample: "Pennsylvania has 73 Important Bird Areas, including Hawk Mountain (raptor migration), Presque Isle (waterfowl), and Cherry Valley (grassland birds). State Game Lands 176 protects endangered Upland Sandpiper habitat.",
      significance: "Modern conservation focuses on landscapes, not just individual species. Protecting habitat benefits entire bird communities."
    },
    {
      era: "Philanthropy & Private Lands",
      period: "1905-Present",
      icon: "🤝",
      keyPoints: [
        "National Audubon Society (1905) - now 40+ PA chapters",
        "Duck Stamp (1934) - hunters fund wetland protection",
        "The Nature Conservancy protects critical bird habitats",
        "Private landowners enroll in conservation programs",
        "Backyard bird feeding supports $6 billion industry",
        "Citizen science (eBird, Christmas Bird Count) tracks populations"
      ],
      paExample: "Audubon Pennsylvania protects 8,500+ acres of bird habitat. The PA Game Commission manages 1.5 million acres for wildlife, funded by hunting licenses. Western PA Conservancy has protected critical stopover habitat for migrating warblers.",
      significance: "Bird conservation relies heavily on private support. Birdwatchers, hunters, and landowners fund and implement most conservation work."
    }
  ],
  currentIssues: [
    "**Habitat Loss**: Pennsylvania loses 16,000 acres of forest annually to development. Grassland birds lost 98% of habitat in PA since 1900.",
    "**Climate Change**: Bird ranges shifting north. PA may lose boreal species (snowbirds) and gain southern species. Migration timing disrupted.",
    "**Window Collisions**: Up to 1 billion birds killed annually in US by building strikes. Cities installing bird-safe glass.",
    "**Cat Predation**: Outdoor cats kill 1-4 billion birds annually in US. Indoor cats are safer for birds and cats.",
    "**Light Pollution**: Artificial light disorients migrating birds, causing collisions and exhaustion.",
    "**Pesticides**: Neonicotinoid insecticides harmful to insect-eating birds. Rodenticides poison owls and hawks.",
    "**Invasive Plants**: Non-native plants don&apos;t support native insects that birds need for food.",
    "**Declining Insects**: Birds need insects to feed babies. Insect populations down 45% in PA since 2000."
  ],
  keyFigures: [
    {
      name: "Rachel Carson",
      role: "Mother of Modern Conservation",
      contribution: "Born in Springdale, PA. &apos;Silent Spring&apos; (1962) exposed pesticide impacts on birds, launching environmental movement.",
      era: "1900s"
    },
    {
      name: "Rosalie Edge",
      role: "Hawk Mountain Founder",
      contribution: "New York conservationist who created world&apos;s first raptor sanctuary at Hawk Mountain, PA (1934).",
      era: "1900s"
    },
    {
      name: "Roger Tory Peterson",
      role: "Field Guide Pioneer",
      contribution: "Created first modern field guide (1934), making bird identification accessible to everyone. Revolutionized citizen science.",
      era: "1900s"
    }
  ],
  callToAction: "Birds need our help now more than ever. Keep your cat indoors, plant native plants, turn off lights during migration (March-May, August-October), and make windows bird-safe. Support conservation organizations. Birds connect us to nature every day - let&apos;s ensure future generations can enjoy them too."
};

// ============================================================================
// TERRESTRIAL MAMMAL CONSERVATION HISTORY
// ============================================================================

export const TERRESTRIAL_CONSERVATION_HISTORY: ConservationHistory = {
  topic: "Terrestrial Mammal Conservation",
  overview: "Pennsylvania&apos;s land mammals have experienced dramatic changes - from wolves and mountain lions to white-tailed deer overabundance. The story includes extinctions, reintroductions, and ongoing management challenges.",
  sections: [
    {
      era: "Indigenous Coexistence",
      period: "Pre-1600s",
      icon: "🪶",
      keyPoints: [
        "Lenape and Susquehannock lived alongside wolves, bears, mountain lions",
        "Sustainable hunting practices - took only what was needed",
        "Spiritual respect for animals, especially bear and wolf",
        "Controlled burns created diverse habitats benefiting deer and elk",
        "Animal populations remained stable for thousands of years",
        "Deep ecological knowledge passed through oral traditions"
      ],
      paExample: "The Lenape had complex ceremonies surrounding bear hunting, including asking permission and thanking the bear&apos;s spirit. Wolves were both respected and feared. The word &apos;Pennsylvania&apos; itself comes from William Penn, but the land was Lenapehoking.",
      significance: "Indigenous peoples demonstrated that humans and large predators can coexist. Their land management practices created diverse habitats that supported abundant wildlife."
    },
    {
      era: "Colonial Extermination",
      period: "1600s-1800s",
      icon: "🔫",
      keyPoints: [
        "European settlers cleared 90% of Pennsylvania&apos;s forests",
        "Bounties paid for predator killing: wolves, mountain lions, bears",
        "Last wolf killed in PA: 1892, last mountain lion: 1891",
        "Elk nearly extinct by 1850s, extirpated by 1867",
        "Beaver nearly extinct from fur trapping",
        "Deer populations crashed from overhunting (< 500 by 1900)"
      ],
      paExample: "Pennsylvania paid bounties on 2,500+ wolves between 1683-1820. The last wild elk was killed in Elk County (ironically) in 1867. By 1900, white-tailed deer were so rare that PA closed deer hunting entirely for years.",
      significance: "This era shows the cost of viewing wildlife as threats or commodities. Pennsylvania lost apex predators and nearly lost deer - complete ecological disruption."
    },
    {
      era: "Game Management Era",
      period: "1895-1940s",
      icon: "📜",
      keyPoints: [
        "1895: Pennsylvania Game Commission created",
        "Hunting seasons and bag limits established",
        "Deer restocking programs - brought deer from other states",
        "Elk reintroduced (1913-1926) from Yellowstone stock",
        "Beaver reintroduced (1917-1921) - now abundant again",
        "State Game Lands system created - protected habitat"
      ],
      paExample: "PA Game Commission reintroduced 177 elk from Yellowstone to north-central PA (1913-1926). Today, PA&apos;s elk herd numbers 1,000+. Deer populations recovered dramatically - possibly too well, leading to overabundance.",
      significance: "Government intervention saved species from extinction. Reintroductions proved successful. But removing predators while protecting deer created new problems - overabundance."
    },
    {
      era: "Ecological Understanding",
      period: "1950s-1970s",
      icon: "🔬",
      keyPoints: [
        "Aldo Leopold&apos;s &apos;Land Ethic&apos; influenced management philosophy",
        "Recognition that predators play essential ecological role",
        "Deer overpopulation damage documented: forest regeneration failure",
        "Chronic Wasting Disease (CWD) detected in captive deer",
        "Rabies eradication programs for raccoons and skunks",
        "Wildlife corridors and habitat connectivity concepts developed"
      ],
      paExample: "Pennsylvania&apos;s deer herd peaked at 1.7 million in the 1990s. Overbrowsing prevented forest regeneration, eliminated wildflowers, and damaged crops. PA began aggressive deer population reduction in early 2000s.",
      significance: "Realized that more wildlife isn&apos;t always better. Ecological balance requires predators, and overabundant deer cause ecosystem damage."
    },
    {
      era: "Modern Wildlife Management",
      period: "1980s-Present",
      icon: "📊",
      keyPoints: [
        "Science-based population goals for deer, bear, turkey",
        "Deer management assistance program for landowners",
        "Black bear populations carefully managed - now 20,000+",
        "Wild turkey restoration success - now 200,000+",
        "Bobcat population recovering after historical decline",
        "Chronic Wasting Disease monitoring and management"
      ],
      paExample: "Pennsylvania&apos;s bear harvest is carefully managed using zone-specific seasons. Hunters report every bear taken, providing population data. Turkey restoration is considered one of conservation&apos;s greatest successes - reintroduced statewide in 20th century.",
      significance: "Modern management balances wildlife populations with habitat capacity and human tolerance. Data drives decisions, not emotions or traditions."
    },
    {
      era: "Conservation Funding",
      period: "1937-Present",
      icon: "💰",
      keyPoints: [
        "Pittman-Robertson Act (1937): excise tax on firearms funds state wildlife agencies",
        "Hunting license sales fund 75% of PA Game Commission budget",
        "PA Game Lands system: 1.5 million acres open to public",
        "Private landowners manage millions more acres for wildlife",
        "Deer Management Assistance Program helps landowners",
        "No general tax dollars fund game commission - user-funded model"
      ],
      paExample: "Pennsylvania receives $30+ million annually from Pittman-Robertson funds, used for habitat work, research, and public access. The PA Game Commission is almost entirely self-funded through hunters and trappers.",
      significance: "Hunters and trappers fund most wildlife conservation through licenses and equipment taxes. This &apos;user pays&apos; model has worked for 80+ years but faces challenges as hunter numbers decline."
    },
    {
      era: "Predator Controversy",
      period: "1990s-Present",
      icon: "🐺",
      keyPoints: [
        "Coyotes colonized PA naturally in 1930s-1940s, now widespread",
        "Black bears expanding range, occasional urban conflicts",
        "Mountain lion sightings regularly reported - all proven false or released pets",
        "Debate over reintroducing wolves or allowing mountain lion return",
        "Predator-livestock conflicts require compensation programs",
        "Coexistence strategies being developed"
      ],
      paExample: "Pennsylvania has no confirmed wild mountain lions since 1891, despite hundreds of sightings annually. Coyotes now occupy the ecological niche wolves once filled. Black bears are increasingly common in suburbs as populations grow.",
      significance: "Humans struggle to accept predators, even as we recognize their ecological importance. Fear and livestock losses create resistance to predator recovery."
    }
  ],
  currentIssues: [
    "**Chronic Wasting Disease (CWD)**: Fatal disease in deer spreading in PA. No cure, threatens herd health.",
    "**Human-Wildlife Conflict**: Bears in trash, deer-vehicle collisions (120,000+ annually in PA), coyotes near suburbs.",
    "**Habitat Fragmentation**: Roads and development split wildlife populations, reducing genetic diversity.",
    "**Climate Change**: Warming favors southern species (armadillos moving north) but threatens cold-adapted species.",
    "**Invasive Species**: Feral hogs not yet in PA but threaten from surrounding states. Would devastate ecosystems.",
    "**Declining Hunters**: Fewer hunters means less funding for conservation and less population control for deer.",
    "**Tick-Borne Diseases**: Lyme, anaplasmosis, babesiosis spreading. Linked to deer abundance and climate warming.",
    "**Forest Health**: Deer overbrowsing, invasive insects, and disease threaten forests that wildlife depend on."
  ],
  keyFigures: [
    {
      name: "Aldo Leopold",
      role: "Father of Wildlife Management",
      contribution: "Wrote &apos;A Sand County Almanac&apos; (1949), developed concept of Land Ethic. Influenced PA wildlife philosophy.",
      era: "1900s"
    },
    {
      name: "Seth Gordon",
      role: "PA Game Commission Pioneer",
      contribution: "PA Game Commission Executive Director (1920-1955), led elk and turkey restoration, expanded State Game Lands.",
      era: "1900s"
    },
    {
      name: "Gifford Pinchot",
      role: "Conservation Governor",
      contribution: "PA Governor and first US Forest Service Chief. Championed scientific forest and wildlife management.",
      era: "1900s"
    }
  ],
  callToAction: "Terrestrial mammals need connected habitats to thrive. Support land conservation, drive carefully in deer country, secure your trash from bears, and appreciate the wildlife we&apos;ve successfully brought back from the brink. Consider hunting or supporting hunters - they fund most mammal conservation."
};

// Export all conservation histories
export const CONSERVATION_HISTORIES = {
  fishing: FISHING_CONSERVATION_HISTORY,
  birds: BIRD_CONSERVATION_HISTORY,
  terrestrials: TERRESTRIAL_CONSERVATION_HISTORY,
  // Add more as needed for other topics
};

