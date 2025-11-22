/**
 * Enhanced Species Knowledge System
 * 
 * This module provides rich, culturally-aware educational content about Pennsylvania wildlife
 * with emphasis on:
 * - Indigenous peoples' land use and practices
 * - Cultural histories and early trade
 * - The impact of colonialism
 * - The creation of conservation movements
 * 
 * Designed with:
 * - ClassDojo-style progressive learning stacks
 * - Carmen Sandiego adventurous, mysterious tone
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface LearningLevel {
  level: number;
  title: string;
  unlockPoints: number;
  emoji: string;
}

export interface CulturalStory {
  era: string;
  period: string;
  title: string;
  narrative: string; // Carmen Sandiego style narrative
  indigenousPractice?: string;
  colonialImpact?: string;
  conservationBirth?: string;
  mystery?: string; // Detective element
  funFact: string;
  image?: string;
}

export interface SpeciesKnowledge {
  speciesId: string;
  commonName: string;
  scientificName: string;
  indigenousNames: {
    tribe: string;
    name: string;
    meaning: string;
  }[];
  culturalSignificance: {
    preDontact: string; // Before European arrival (renamed "pre-contact")
    earlyContact: string; // 1600s-1700s
    colonialPeriod: string; // 1700s-1800s
    industrialImpact: string; // 1800s-1900s
    conservationEra: string; // 1900s-present
  };
  learningStack: {
    level1: { title: string; content: string; mystery?: string };
    level2: { title: string; content: string; mystery?: string };
    level3: { title: string; content: string; mystery?: string };
    level4: { title: string; content: string; mystery?: string };
    level5: { title: string; content: string; mystery?: string };
  };
  culturalStories: CulturalStory[];
  tradeHistory?: {
    commodity: string;
    routes: string[];
    economicImpact: string;
    culturalExchange: string;
  };
}

// ============================================================================
// Learning Levels (ClassDojo Style)
// ============================================================================

export const LEARNING_LEVELS: LearningLevel[] = [
  { level: 1, title: "Field Scout", unlockPoints: 0, emoji: "🔍" },
  { level: 2, title: "Trail Detective", unlockPoints: 50, emoji: "🕵️" },
  { level: 3, title: "History Hunter", unlockPoints: 150, emoji: "🗺️" },
  { level: 4, title: "Culture Keeper", unlockPoints: 300, emoji: "📜" },
  { level: 5, title: "Master Naturalist", unlockPoints: 500, emoji: "🌟" },
];

// ============================================================================
// WHITE-TAILED DEER Knowledge
// ============================================================================

export const WHITE_TAILED_DEER_KNOWLEDGE: SpeciesKnowledge = {
  speciesId: "white-tailed-deer",
  commonName: "White-tailed Deer",
  scientificName: "Odocoileus virginianus",
  
  indigenousNames: [
    {
      tribe: "Lenape (Delaware)",
      name: "Achtu",
      meaning: "The one who bounds away"
    },
    {
      tribe: "Susquehannock",
      name: "Wapiti-skennen",
      meaning: "White tail messenger"
    },
    {
      tribe: "Seneca (Haudenosaunee)",
      name: "Ne-o-gwat-ha",
      meaning: "He who carries himself lightly"
    }
  ],
  
  culturalSignificance: {
    preContact: `The white-tailed deer wasn't just an animal to the Indigenous peoples of Pennsylvania—it was family, teacher, and gift-giver all in one. 

    🏹 **The Lenape Way of Reciprocity**
    
    Before the first European boot touched Pennsylvania soil, the Lenape people (whom colonists would call the "Delaware") had cultivated a relationship with the deer that went back thousands of years. But here's the mystery: despite being master hunters who took hundreds of deer annually, the Lenape *never depleted the population*. How?
    
    The answer lies in what they called "walking in balance." Every hunt began with ceremony and apology. Hunters would smoke tobacco and speak to the deer's spirit: "Brother Deer, we need you. My children are cold. Please give yourself to us." This wasn't just poetry—it was a conservation philosophy that worked for millennia.
    
    🌿 **The Three Sisters & The Deer Garden**
    
    Here's what the history books often miss: Indigenous peoples didn't just "hunt" deer—they *managed* them. By practicing controlled burns and creating forest clearings for corn, beans, and squash (the Three Sisters), they inadvertently created ideal deer habitat. Edge environments where forest meets field? That's a deer's paradise, and Indigenous land managers knew it.
    
    The archaeological evidence is stunning: deer populations in pre-contact Pennsylvania were likely *higher* than during colonial times, despite intensive Indigenous hunting. They had cracked the code of sustainable harvest that Europeans would take 300 years to rediscover.`,
    
    earlyContact: `📜 **1682: When Two Worlds Met Under the Treaty Elm**
    
    Picture this: It's a warm autumn day in 1682. William Penn, fresh off the boat from England, sits beneath a massive elm tree in what's now Philadelphia. Across from him sit Tamanend and other Lenape leaders. Between them lies a pile of wool blankets, iron kettles, and strings of wampum. This is the "Great Treaty," and it's about to change everything—especially for the deer.
    
    But here's the twist that historians debated for centuries: Was this treaty real, or colonial myth-making? The mystery deepens because no written copy exists in Lenape hands, only European accounts. What we do know is what came next...
    
    🦌 **The Deerskin Trade Explosion**
    
    Within a decade, the economy of Pennsylvania transformed. Deer, which had been hunted sustainably for food and clothing, suddenly had a price tag in the global market. One deerskin = one British pound sterling. The term "buck" (as in dollar) literally comes from this trade.
    
    Lenape hunters found themselves in a moral crisis. European traders offered amazing new tools—iron knives that held an edge, warm wool blankets, copper kettles that didn't break. But the price? More deer than they'd ever taken before. Traditional hunting quotas began to buckle under economic pressure.
    
    *Detective's Note: Why did Europeans want so many deerskins? The answer is surprising—they were making bookbindings, fine gloves, and a new invention called "buckskin breeches" that became the height of fashion in London and Paris.*`,
    
    colonialPeriod: `⚔️ **1755-1764: The Walking Purchase Betrayal & The Vanishing Herds**
    
    *Setting: The Pennsylvania frontier. The stakes: Everything.*
    
    You need to know this story because it reveals how colonialism shattered both people and ecosystems. In 1737, Pennsylvania's colonial government claimed they had an "old deed" from William Penn (conveniently "lost" until now) that gave them all the land a man could walk in a day and a half.
    
    The Lenape agreed to honor it—after all, a man walks maybe 30-35 miles in that time. But here's the con: Pennsylvania hired the three fastest runners in the colony, cleared a path through the forest in advance, and had relay stations with fresh food waiting. They "walked" 70 miles, claiming an area of 1,200 square miles—nearly half of the remaining Lenape homeland.
    
    🌲 **The Forest Clearances Begin**
    
    Within 20 years, that 1,200 square miles transformed. European settlers:
    - Cut down old-growth forests (deer winter habitat)
    - Fenced off former hunting grounds
    - Shot deer year-round, including pregnant does
    - Eliminated wolves and mountain lions (natural deer population controls)
    
    **The Great Deer Crash of 1790-1820**
    
    By 1800, white-tailed deer had virtually disappeared from eastern Pennsylvania. Hunters reported going weeks without seeing one. Elderly Lenape people who remembered the old days spoke of it as if the deer had "gone home to the sky."
    
    But the colonists noticed something troubling: without deer to browse the forest understory, different plants took over. Without wolves to create "landscapes of fear" (yes, that's the actual ecological term), deer behavior changed. The forest itself was changing.
    
    *Mystery Challenge: If deer were nearly extinct in 1800, why are there more deer in Pennsylvania today than at any time in recorded history? The answer reveals one of conservation's strangest ironies...*`,
    
    industrialImpact: `🏭 **1850-1900: The Accidental Rewilding**
    
    Here's a plot twist worthy of Carmen Sandiego herself: The Industrial Revolution, which destroyed so many species, accidentally *saved* the white-tailed deer. But not for any noble reason.
    
    **The Great Pennsylvania Coal Boom**
    
    As coal mining exploded across Pennsylvania, something unexpected happened:
    1. Farmers abandoned rocky hillside farms to work in mines
    2. Abandoned fields started reverting to brush and young forest
    3. This "edge habitat" became deer paradise
    4. But there were almost no deer left to recolonize it
    
    **The Market Hunting Catastrophe**
    
    By 1890, you could count Pennsylvania's remaining deer on your fingers—maybe 500 animals in the entire state. Market hunters (commercial hunters selling meat in cities) had nearly finished them off. Philadelphia restaurants served venison, but it was shipped in from Canada.
    
    Then came what historians call "the conservation awakening."
    
    🎯 **Enter: The First Game Wardens**
    
    In 1895, Pennsylvania created the Game Commission with a radical idea: What if we stopped all deer hunting for a decade? What if we arrested market hunters? What if we—and here's the wild part—*imported* deer from other states?
    
    The backlash was fierce. Rural Pennsylvanians argued that hunting was a God-given right. Market hunters claimed they'd be driven into poverty. Restaurants protested. But something remarkable happened: the law held.
    
    **The Detroit Connection**
    
    Here's a mystery that few people know: Where did Pennsylvania get deer to restock the forests? 
    
    Answer: Michigan. Between 1906-1924, Pennsylvania imported over 1,200 white-tailed deer from the upper Midwest. But here's the twist—some of those deer carried chronic wasting disease. It wouldn't show up for 100 years, but the time bomb was ticking...`,
    
    conservationEra: `🌟 **1900-Present: From Nearly Extinct to Overpopulation Crisis**
    
    *Welcome to the final level, Master Naturalist. This is where past and present collide.*
    
    **The Great Success... and Its Consequences**
    
    By 1920, deer hunting reopened with strict limits. By 1940, deer were common again. By 1960, they were everywhere. By 2000, Pennsylvania had an estimated **1.5 million deer**—more than at any time in history, including the pre-colonial period.
    
    How did this happen? Three factors:
    
    1. **Suburban Sprawl = Deer Heaven**: Fragmented forests, ornamental plants, no natural predators
    2. **Forest Maturation**: Former farms became 50-70 year old forests (perfect deer habitat)
    3. **Hunting Restrictions**: Success protecting deer became *too* successful
    
    🔄 **The Lenape Wisdom Returns**
    
    Today, ecologists and game managers are rediscovering what the Lenape knew: deer populations need active management. The Pennsylvania Game Commission now encourages antlerless deer harvest to reduce populations in some areas. It's controversial, but it's based on the same principle the Lenape used: sustainable harvest maintains balance.
    
    **The Modern Mystery**
    
    Pennsylvania faces a deer paradox:
    - In suburbs: Too many deer (garden destruction, car collisions, Lyme disease)
    - In deep forests: Declining deer (overbrowsing has destroyed their own food supply)
    - In farmland: Perfect balance (but these habitats are disappearing)
    
    *The Detective's Final Question: Indigenous peoples maintained healthy deer populations for 10,000 years without science degrees, GPS collars, or population models. How? The answer lies in relationship, not management. What can we learn?*
    
    **Connecting Past to Present**
    
    Today, some Lenape people have returned to Pennsylvania (most were forcibly removed to Oklahoma in the 1860s). When they visit what their ancestors called "the endless mountain," they often remark on the absence of old-growth forest, the silence where wolves and elk once sang, and the overpopulation of deer without natural predators.
    
    But they also see hope: a growing movement to respect Indigenous knowledge, to practice controlled burns again, to see deer not as "resources to manage" but as relatives in a shared home.
    
    The white-tailed deer's story is Pennsylvania's story—of taking too much, losing it all, rebuilding imperfectly, and slowly learning that the old ways might have been the wise ways all along.`
  },
  
  learningStack: {
    level1: {
      title: "🔍 The Basics: Meet the Deer",
      content: "White-tailed deer are Pennsylvania's most iconic mammal. But here's your first mystery: Why do we call them 'white-tailed'? Look closely next time you see one run away—their tail flips up like a white flag. Scientists call this the 'flag display.' But is it a warning to other deer, a distraction to predators, or both? Your detective work begins...",
      mystery: "Indigenous peoples had 12 different names for deer depending on age, sex, and season. Why so many names for one animal?"
    },
    level2: {
      title: "🕵️ The Indigenous Connection",
      content: "The Lenape people called deer 'Achtu'—'the one who bounds away.' But they didn't just hunt deer; they *partnered* with them. By creating forest clearings and practicing controlled burns, they actually *increased* deer populations while hunting them sustainably. This seems impossible by modern logic. How did they do it? The answer changes everything we know about conservation.",
      mystery: "Archaeological sites show Lenape people took 60% male deer, 40% female. Modern hunters take 70% female, 30% male. Why the difference, and which approach is more sustainable?"
    },
    level3: {
      title: "🗺️ The Fur Trade Transformation",
      content: "In 1682, everything changed. European traders offered iron tools, wool blankets, and copper kettles in exchange for deerskins. Within 50 years, the deer population crashed. The term 'buck' (as in dollar) literally comes from this trade—one buckskin = one British pound. Follow the money, follow the mystery: Who benefited, who lost, and what did we learn?",
      mystery: "A single Lenape hunter went from taking 5-10 deer per year to 50-100 deer per year after European contact. What changed besides tools?"
    },
    level4: {
      title: "📜 The Conservation Revolution",
      content: "By 1900, only 500 deer survived in all of Pennsylvania. Then came an unprecedented experiment: stop all hunting for a decade. Import deer from Michigan. Arrest commercial hunters. By 1920, deer were recovering. By 2000, Pennsylvania had 1.5 million deer. Too successful? Learn how saving a species can create new problems.",
      mystery: "Pennsylvania imported 1,200 deer from Michigan in 1906-1924. Today, Pennsylvania has 1.5 million deer. That's a 1,250x increase in 100 years. Mathematically, how is this possible?"
    },
    level5: {
      title: "🌟 Master Level: The Full Circle",
      content: "Today, ecologists are rediscovering Indigenous management practices. Controlled burns. Selective harvest. Seeing animals as relatives, not resources. The Lenape maintained healthy deer populations for 10,000 years. We nearly drove them extinct in 100 years. But in the last 50 years, we've learned to ask: What did the old people know that we forgot? The answer reconnects past wisdom with future survival.",
      mystery: "Final Challenge: Design a deer management plan for Pennsylvania that honors both Indigenous wisdom and modern science. What would you keep? What would you change?"
    }
  },
  
  culturalStories: [
    {
      era: "Pre-Contact",
      period: "10,000 BCE - 1600 CE",
      title: "The Deer Ceremony",
      narrative: "*Location: Along the Susquehanna River, autumn 1450 CE*\n\nThe young hunter's arrow flies true. The deer falls. But the hunt isn't over—it's just beginning.\n\nBefore touching the deer, the hunter kneels. He takes tobacco from a pouch made from the previous year's hunt and sprinkles it on the ground. His words are soft:\n\n'Brother Deer, thank you for feeding my family. Your spirit will return in spring. We will see each other again.'\n\nThis isn't superstition—it's sustainability made sacred. By treating the hunt as a gift rather than a conquest, Indigenous peoples built respect into every harvest. The ceremony reminded hunters: take only what you need, waste nothing, and the deer will return.",
      indigenousPractice: "The Lenape practiced what they called 'asking permission.' Before a hunt, hunters would fast, pray, and smoke tobacco as an offering. This created a cultural brake on overhunting—hunting was serious, spiritual work, not casual resource extraction.",
      funFact: "Deer hides weren't just clothing—they were currency, art canvas, and housing material. A single deer hide could be turned into 50+ different items, from moccasins to carrying bags to drum heads."
    },
    {
      era: "Early Contact",
      period: "1682-1750",
      title: "The Treaty Elm and the Buck Trade",
      narrative: "*Location: Shackamaxon (now Philadelphia), 1682*\n\nWilliam Penn sits beneath an elm tree, negotiating with Lenape chief Tamanend. The English Quaker promises 'peace and friendship forever.' The Lenape leader agrees, under one condition: respect the land and its creatures.\n\nWithin 10 years, that promise is broken. British traders flood Pennsylvania, offering iron knives, guns, and cloth in exchange for deerskins. The price? One deerskin = one pound sterling. The Lenape call it 'the buck trade.'\n\nA Lenape elder watches young hunters bring in their tenth deer of the day. Once, they took five deer in a season. Now they take five in a week. The elder shakes his head: 'We are trading our grandchildren's food for today's knives.'",
      colonialImpact: "The deerskin trade fundamentally altered Indigenous hunting practices. Economic pressure replaced spiritual practice. Within 70 years, deer populations crashed, and with them, traditional foodways and cultural practices centered on deer.",
      funFact: "The word 'buckskin' (leather from deer) became shortened to 'buck' as slang for money. When you say 'that costs 50 bucks,' you're unknowingly referencing the colonial deer hide trade!"
    },
    {
      era: "Colonial Period",
      period: "1750-1850",
      title: "The Walking Purchase and Vanishing Herds",
      narrative: "*Location: Northeastern Pennsylvania, September 1737*\n\nThis is one of history's greatest swindles, and it doomed both a people and their deer.\n\nPennsylvania's colonial governor produces an 'old deed' claiming land 'as far as a man can walk in a day and a half.' The Lenape agree—after all, that's maybe 30 miles. Fair enough.\n\nBut the colonists have hired three professional runners, cleared a path in advance, and set up relay stations. They 'walk' 70 miles, claiming 1,200 square miles of prime hunting land.\n\nThe Lenape call it 'the trick that never ends.' Within 20 years:\n- Forests are cleared for farms\n- Deer hunting grounds become wheat fields  \n- Wolves are hunted to extinction\n- Deer populations collapse\n\nBy 1800, you could walk a week in eastern Pennsylvania and never see a deer. The 'endless forest' the Lenape knew becomes the 'conquered wilderness' Europeans celebrate.",
      colonialImpact: "The Walking Purchase exemplifies how colonial land theft destroyed ecosystems. By displacing Indigenous land managers and clear-cutting forests, Europeans inadvertently collapsed deer populations they depended on for food and trade.",
      funFact: "The Walking Purchase remained legally contested until 2004, when Lenape descendants filed a federal lawsuit. It was dismissed, but historians now widely acknowledge it as fraudulent."
    },
    {
      era: "Industrial",
      period: "1850-1920",
      title: "The Market Hunters and the Last Deer",
      narrative: "*Location: Pennsylvania Wilds, 1890*\n\nJake McCall is a market hunter. He shoots deer and sells the meat in Philadelphia. It's legal, profitable, and devastating.\n\nOn a cold November morning, Jake spots something rare: a doe with two fawns. In the old days, he might have let them go. But venison prices are high, and his family needs the money. Three shots. Three deer. Fifteen dollars.\n\nBy 1900, Pennsylvania's deer population has crashed to about 500 animals. Hunters report going entire seasons without seeing one. Restaurants stop serving venison—there's none to buy.\n\nThen something unprecedented happens: Pennsylvania bans all deer hunting. Market hunters are arrested. Game wardens patrol the forests. It's the birth of American conservation, born from the ashes of near-extinction.",
      conservationBirth: "The Pennsylvania Game Commission (founded 1895) pioneered American wildlife management. Their radical approach—stop all hunting, protect habitat, reintroduce animals—became the model for conservation nationwide.",
      funFact: "Market hunters weren't villains—they were poor farmers trying to survive. One hunter could make $200-300 per season selling venison (equivalent to $6,000-9,000 today). When hunting was banned, the state provided no compensation."
    },
    {
      era: "Conservation Era",
      period: "1920-Present",
      title: "The Return... and the Reckoning",
      narrative: "*Location: Suburban Pennsylvania, 2020*\n\nSarah looks out her kitchen window at eight deer munching her hostas. Her neighbor has hit three deer with his car this year. The local park has lost nearly all its wildflowers to deer browse. Pennsylvania has a deer overpopulation crisis.\n\nBut drive three hours north to the Pennsylvania Wilds, and you might not see a single deer. Why? They've eaten themselves out of house and home. Too many deer, not enough food.\n\nMeanwhile, Lenape descendants visit from Oklahoma, where their ancestors were forcibly relocated in the 1860s. They look at Pennsylvania's forests and see imbalance: too many deer in some places, too few predators everywhere, and a landscape missing the controlled burns and active management that maintained balance for millennia.\n\nThe question isn't 'How do we manage deer?' It's 'How do we restore relationship?' The answer might require remembering what we've forgotten.",
      indigenousPractice: "Modern ecologists are now studying traditional Indigenous burning practices. Controlled burns create the mix of forest and meadow that supports healthy deer populations without overpopulation. What was dismissed as 'primitive' 100 years ago is now recognized as sophisticated ecosystem management.",
      conservationBirth: "Organizations like the Pennsylvania Game Commission now work with Indigenous advisors. Some state forests have resumed controlled burns. It's a small but significant acknowledgment that Indigenous knowledge belongs in modern conservation.",
      funFact: "Pennsylvania deer cause 4,000-5,000 car collisions annually. The economic impact (vehicle damage, medical costs) exceeds $100 million per year. Yet in the 1900s, seeing a deer was cause for celebration."
    }
  ],
  
  tradeHistory: {
    commodity: "Deerskins (Buckskins)",
    routes: [
      "Philadelphia to London (primary)",
      "Pittsburgh to New Orleans (via Ohio and Mississippi Rivers)",
      "Susquehanna River corridor to Chesapeake Bay ports"
    ],
    economicImpact: "Between 1700-1800, Pennsylvania exported an estimated 5-8 million deerskins to Europe. At one pound sterling per skin, this represents $750 million to $1.2 billion in today's currency. The trade enriched colonial merchants while impoverishing both Indigenous peoples and deer populations.",
    culturalExchange: "The deerskin trade created a cultural feedback loop: Indigenous peoples gained access to European tools but lost traditional hunting practices. Europeans gained profitable commodities but destroyed the ecosystem that produced them. Both sides lost in the long run."
  }
};

// ============================================================================
// More species to be added...
// ============================================================================

// Export a registry of all enhanced species knowledge
export const SPECIES_KNOWLEDGE_REGISTRY: Record<string, SpeciesKnowledge> = {
  "white-tailed-deer": WHITE_TAILED_DEER_KNOWLEDGE,
  // More to come...
};

