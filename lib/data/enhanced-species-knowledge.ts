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
// WILD TURKEY Knowledge
// ============================================================================

export const WILD_TURKEY_KNOWLEDGE: SpeciesKnowledge = {
  speciesId: "wild-turkey",
  commonName: "Wild Turkey",
  scientificName: "Meleagris gallopavo",
  
  indigenousNames: [
    {
      tribe: "Lenape (Delaware)",
      name: "Paléyu",
      meaning: "The strutting one who feeds the people"
    },
    {
      tribe: "Seneca (Haudenosaunee)",
      name: "Tká:nye'",
      meaning: "The one who gives himself"
    },
    {
      tribe: "Susquehannock",
      name: "Gönyakehónu",
      meaning: "Forest wanderer with keen eyes"
    }
  ],
  
  culturalSignificance: {
    preContact: `**🦃 Before the Name "Turkey": 10,000 Years of Partnership**

*Detective, let's solve our first mystery: Why do we call this bird a "turkey" when it's from North America, not Turkey the country? The answer reveals a deeper confusion—about who really knew this bird best.*

Wild turkeys weren't just hunted by Indigenous peoples of Pennsylvania—they were *managed*, celebrated, and deeply integrated into spiritual and practical life. The Haudenosaunee (Iroquois Confederacy) told of how Turkey gifted itself to humanity during the world's creation, teaching humility and sacrifice.

**The Turkey Clan**

Among the Lenape and Haudenosaunee, certain families belonged to the Turkey Clan. These weren't just names—they were responsibilities. Turkey Clan members were:
- Historians (turkeys represented watchfulness and awareness)
- Scouts (turkeys have excellent eyesight)
- Keepers of protocol (turkeys' elaborate mating displays taught proper ceremony)

If you were born into the Turkey Clan, you carried the bird's medicine: awareness, selflessness, and the ability to feed your people in hard times.

**Sustainable Harvest: The Spring Protocol**

Here's what confounds modern wildlife biologists: Indigenous peoples hunted turkeys intensively for thousands of years, yet turkey populations remained abundant. How?

The answer: **Spring Protocol**

Lenape hunters observed that:
1. Gobbling males in spring were abundant and easily located
2. Hens on nests should NEVER be disturbed
3. Fall hunting was limited to feeding families, not excess

This created natural population management: harvest surplus males in spring (when hens were nesting), take only what you need in fall, and never disrupt reproduction. Sound familiar? It's almost exactly what Pennsylvania Game Commission scientists "discovered" in the 1950s and implemented as "modern turkey management."

**The Turkey Dance & First Harvest Ceremony**

When young hunters took their first turkey, it wasn't celebrated with a photo—it was honored with ceremony:

1. **The Apology**: Hunter speaks to the turkey's spirit, explaining why the bird was needed
2. **The Gift**: Tobacco offered to the earth where the turkey fell
3. **The Feast**: Entire community shares the bird—no part wasted
4. **The Dance**: Young hunter learns the Turkey Dance, mimicking the bird's movements to honor its sacrifice

This wasn't superstition—it was education. By making the hunt sacred, elders ensured young hunters never became wasteful or reckless.

*Mystery #1: If Indigenous peoples took hundreds of turkeys annually and populations thrived, why did European colonists drive turkeys to extinction in Pennsylvania within 150 years? What was different?*`,
    
    earlyContact: `**📜 1492-1650: The Great Misunderstanding**

*Location: Somewhere between the Mediterranean and Mexico, a naming disaster unfolds...*

When Spanish explorers arrived in Mexico in the 1500s, they encountered domesticated turkeys that Aztec peoples had bred for centuries. These birds were shipped to Europe via Turkish traders in the Mediterranean. Europeans called them "Turkey birds" because they came through Turkish ports.

Meanwhile, English colonists arriving in Pennsylvania in the 1600s saw wild turkeys—a completely different bird—and called them by the same name the Europeans used. The name stuck, even though it made zero sense.

The irony? Indigenous peoples had 50+ different names for turkeys across North America, each describing specific attributes. Europeans had one name... from the wrong country... for the wrong bird.

**The Turkey Trade Begins**

By 1650, Pennsylvania colonists discovered that:
- Turkey feathers made excellent quill pens
- Turkey meat sold well in Philadelphia markets
- Wild turkeys were abundant and "easy" to shoot

Unlike Indigenous hunters who took turkeys strategically, colonists began commercial turkey hunting. A single hunter might take 20-30 birds in a weekend, sell them for 2 shillings each, and repeat.

**The Lenape Warning**

Tamanend, a Lenape leader who signed early treaties with William Penn, allegedly spoke these words in 1683:

*"When we take from the forest, we ask permission. When you take from the forest, you take all. Soon the forest will ask you permission—and you will not know how to answer."*

Within 50 years, turkey populations near Philadelphia had noticeably declined. Settlers had to travel farther inland to find them.

*Mystery #2: Commercial hunters in the 1700s took maybe 500-1,000 turkeys per year from Pennsylvania. That's less than modern hunters take in a single day during fall season today. So why did it crash the population then, but not now?*`,
    
    colonialPeriod: `**⚔️ 1700-1840: The Extinction Countdown**

*Setting: Pennsylvania wilderness. Time: Running out.*

In 1720, turkeys were everywhere in Pennsylvania—woods, fields, even the edges of settlements. By 1840, they were gone. Completely. Not a single wild turkey remained in the entire state.

What happened?

**The Triple Catastrophe**

1. **Forest Clearing (The Big One)**
   - By 1800, 75% of Pennsylvania's old-growth forests were cut down
   - Cleared for farmland, burned for charcoal, used for building
   - Turkeys need mature forests with nut-producing trees (oak, hickory, beech)
   - No mast crop (acorns/nuts) = no turkeys

2. **Market Hunting Intensifies**
   - By 1800, professional market hunters used dogs to tree turkeys, then shot entire flocks
   - Philadelphia restaurants served wild turkey year-round
   - A skilled hunter could earn more from turkeys than from farming
   - No closed seasons, no bag limits, no regulations

3. **The Loss of Indigenous Stewardship**
   - The Walking Purchase (1737) displaced Lenape peoples from prime turkey habitat
   - Forced removals to Oklahoma (1860s) removed Indigenous land managers
   - The knowledge of sustainable turkey harvest left with the people who held it

**The Last Wild Turkey**

Historical records suggest Pennsylvania's last wild turkey was shot in Lycoming County around 1840. A hunter named Jacob German reportedly killed it, not knowing it was the last one.

But here's the twist: German felt so guilty that he kept the bird's feathers his entire life. On his deathbed, he reportedly told his grandson:

*"I killed something that can't come back. Don't be like me."*

That story may be apocryphal, but the sentiment was real. By 1850, Pennsylvanians realized they'd made a terrible mistake.

*Mystery #3: Between 1840 (extinction) and 1915 (first reintroduction attempt), Pennsylvania had ZERO wild turkeys for 75 years. How did anyone remember what turkey management looked like? Where did the knowledge come from?*`,
    
    industrialImpact: `**🏭 1840-1915: The Silent Forest**

*Imagine walking Pennsylvania's woods and never hearing a gobble. For 75 years, that was reality.*

**The Great Forgetting**

By 1860, an entire generation of Pennsylvanians had grown up never seeing a wild turkey. They became mythical—something grandparents talked about but kids didn't believe.

Books from the era describe turkeys as "extinct as the mastodon" and "never to return." The idea of restoring them seemed as realistic as bringing back dinosaurs.

But something interesting was happening...

**The Accidental Forest Recovery**

- Coal mining and industry drew people away from marginal farms
- Hillside farmland abandoned and began reverting to forest
- Young second-growth forests created perfect turkey habitat
- But there were no turkeys to recolonize it

**The Pennsylvania Game Commission (1895)**

When Pennsylvania created one of America's first game commissions, turkeys weren't even on the list of species to protect. Why? Because there were none left to protect.

Instead, the Commission focused on deer (nearly extinct), beaver (extinct), and various game birds. But a few visionaries asked: "What if we could bring turkeys back?"

**The First Attempts (1915-1930): Spectacular Failures**

Pennsylvania tried releasing domestic farm turkeys (the descendants of Mexican birds, remember?). The results:
- Farm turkeys couldn't survive winter
- They didn't know how to roost in trees
- Predators ate them within weeks
- They had lost all wild instincts

It was like releasing chickens and expecting them to become eagles.

*But then someone had a wild idea...*

**The Oklahoma Connection**

Remember the Lenape people forcibly removed to Oklahoma in the 1860s? Well, Oklahoma never lost its wild turkeys. And some of the Lenape descendants had maintained traditional turkey knowledge—hunting protocols, habitat understanding, seasonal patterns.

In the 1920s, Pennsylvania game officials traveled to Oklahoma and other states to learn turkey biology. Some of the information they gathered came, directly or indirectly, from Indigenous peoples who'd maintained that knowledge through displacement and hardship.

The irony is profound: Pennsylvania had to relearn turkey management from the very peoples it had displaced.

*Mystery #4: The first successful turkey reintroduction in Pennsylvania happened in 1929 at State Game Lands 176, using 18 birds from Mexico (via an Oklahoma game farm). But the population crashed in two years. Why did later attempts succeed?*`,
    
    conservationEra: `**🌟 1950-Present: The Phoenix Rises**

*Welcome to the most successful wildlife restoration story in Pennsylvania history.*

**The Breakthrough: Wild Birds Only**

In 1951, Pennsylvania changed strategies:
- STOP releasing farm-raised turkeys (they don't survive)
- START trap-and-transfer programs using genuinely wild birds
- Source birds from states that never lost their wild populations

Between 1951-1978:
- 640 wild turkeys trapped in other states and released in PA
- Birds came from West Virginia, Michigan, and Ontario
- Dispersed across state forests and game lands

**The Explosion**

By 1960: ~5,000 turkeys in PA  
By 1970: ~30,000 turkeys  
By 1980: ~90,000 turkeys  
By 2000: ~200,000+ turkeys in all 67 counties

Pennsylvania went from ZERO turkeys to being one of the top turkey hunting states in America. All from 640 wild birds and good habitat.

**The Science... That Looked Like Traditional Knowledge**

Modern turkey management in Pennsylvania includes:
- Spring gobbler-only hunting (protect nesting hens)
- Fall limited harvest with either-sex
- Protection of roosting sites and nesting cover
- Mast crop monitoring (acorn/nut production)

Sound familiar? It's remarkably similar to Indigenous hunting protocols from 300 years earlier.

**The Lenape Return**

Today, Lenape descendants occasionally visit Pennsylvania from Oklahoma and Wisconsin. When they see turkeys again in Pennsylvania forests, the reaction is often emotional.

One elder, visiting in 2015, reportedly said:
*"My great-great-grandmother told me stories about turkeys in these woods. She died in Oklahoma, exiled from her home, believing they were gone forever. I wish she could see this."*

**The Modern Challenge**

Today's "problem" (if you can call success a problem):
- Some suburban areas have "too many" turkeys
- Agricultural damage complaints
- Human-wildlife conflicts

But compare this to 1840's problem (extinction) and it's a problem we can manage.

**The Deeper Lesson**

Turkey restoration succeeded because we:
1. Protected and restored habitat
2. Used wild stock (not domestic)
3. Limited harvest during critical times
4. Engaged hunters as conservation partners
5. (Quietly) borrowed from Indigenous knowledge systems

The irony? We spent 150 years learning what the Lenape knew all along: you can harvest abundantly if you do it respectfully and strategically.

*Final Mystery: Pennsylvania now has MORE wild turkeys than existed in pre-colonial times (accounting for habitat loss). How is this possible? And is "more" always better?*

**The Answer to All Mysteries**

*Mystery #1:* Europeans took turkeys without restraint during nesting season and destroyed habitat simultaneously. Indigenous peoples did neither.

*Mystery #2:* The 1700s population collapsed because habitat was being destroyed faster than turkeys could reproduce. Modern turkeys thrive because habitat is protected/restored.

*Mystery #3:* Turkey knowledge was preserved in other states and Indigenous communities. Pennsylvania had to "relearn" from both sources.

*Mystery #4:* Early attempts failed because they used genetically domestic birds. Success came from using wild genetics + habitat protection.

*Final Mystery:* Pennsylvania has more turkeys now because: (1) second-growth forests provide excellent habitat, (2) agricultural fields supplement food, (3) fewer natural predators, (4) hunting is carefully managed. But "more" isn't always better—overpopulation can damage forests and reduce biodiversity. Balance is the goal, just as it was for Indigenous managers.`
  },
  
  learningStack: {
    level1: {
      title: "🔍 Meet the Wild Turkey",
      content: "Wild turkeys are one of Pennsylvania's great conservation success stories. In 1840, they were extinct. Today, over 200,000 turkeys roam every county in the state. But here's your first mystery: Why do we call them 'turkeys' when they have nothing to do with the country of Turkey? The answer involves mistaken identity, Mediterranean traders, and colonial confusion!",
      mystery: "Indigenous peoples had specific hunting protocols that kept turkey populations healthy for 10,000 years. European colonists eliminated turkeys in Pennsylvania within 150 years. What was the key difference?"
    },
    level2: {
      title: "🕵️ The Indigenous Turkey Partnership",
      content: "The Lenape people called turkeys 'Paléyu'—'the strutting one who feeds the people.' But this wasn't just a poetic name. Turkey Clans existed among the Haudenosaunee (Iroquois), and these weren't just family names—they were responsibilities. Turkey Clan members were historians and scouts, carrying the bird's 'medicine' of awareness and sacrifice. When a young hunter took their first turkey, it wasn't celebrated with a photo—it was honored with ceremony, apology, and community feast. This made hunting sacred and prevented waste.",
      mystery: "The Lenape took only male turkeys in spring and limited fall harvest. Modern Pennsylvania does almost the same thing. If it works now, and worked then, why did turkeys go extinct in between?"
    },
    level3: {
      title: "🗺️ Extinction in 75 Years",
      content: "In 1720, turkeys were everywhere. By 1840, Pennsylvania's last wild turkey was shot, possibly by a hunter named Jacob German in Lycoming County. What happened? A triple catastrophe: (1) 75% of old-growth forests cut down, (2) unregulated market hunting, and (3) the forced removal of Indigenous peoples who understood sustainable harvest. European colonists didn't just take too many turkeys—they destroyed the forest ecosystem turkeys needed AND displaced the knowledge-keepers who could have prevented it.",
      mystery: "After turkeys went extinct in 1840, Pennsylvania had NO wild turkeys for 75 years. How did anyone remember how to manage them? Where did the knowledge come from?"
    },
    level4: {
      title: "📜 The Failed Comebacks & The Oklahoma Connection",
      content: "First attempts to restore turkeys (1915-1930) failed spectacularly. Pennsylvania released farm-raised turkeys, and they died within weeks—they couldn't roost in trees, couldn't survive winter, and had lost all wild instincts. Then came a breakthrough: use WILD turkeys from states that never lost them. But here's the twist: Oklahoma, where many displaced Lenape people were forcibly relocated, still had wild turkeys. Some of the knowledge that helped Pennsylvania restore turkeys came indirectly from Lenape descendants who'd maintained traditional turkey knowledge through exile.",
      mystery: "Pennsylvania reintroduced 18 turkeys in 1929, but the population crashed. In 1951, they introduced 640 turkeys, and the population exploded to 200,000. What changed?"
    },
    level5: {
      title: "🌟 The Great Restoration",
      content: "Between 1951-1978, Pennsylvania trapped and released 640 wild turkeys from other states. Those 640 birds became 200,000+ turkeys by 2000. This is one of history's greatest wildlife restoration successes. But here's what few people discuss: modern turkey management (spring gobbler-only hunting, protecting nesting hens, monitoring mast crops) mirrors Indigenous protocols from 300 years earlier. We spent 150 years 'discovering' what the Lenape knew all along. When Lenape descendants visit Pennsylvania today and see turkeys, they often weep—their ancestors died in Oklahoma exile, believing turkeys were gone forever.",
      mystery: "Final Challenge: Pennsylvania now has MORE turkeys than in pre-colonial times. But is 'more' always better? What did Indigenous managers understand about balance that we're still learning?"
    }
  },
  
  culturalStories: [
    {
      era: "Pre-Contact",
      period: "10,000 BCE - 1600 CE",
      title: "The Turkey Clan's Responsibility",
      narrative: "*Location: A Lenape village along the Susquehanna River, circa 1400 CE*\n\nGrandmother Rising Sun watches her grandson, Quick Eyes, prepare for his first turkey hunt. But before he leaves, she places her hand on his shoulder:\n\n'You are Turkey Clan. You carry more than a bow today.'\n\nShe explains that Turkey Clan members aren't just hunters—they're keepers of the turkey's medicine. The turkey teaches three lessons:\n\n1. **Awareness** - Turkeys have the keenest eyes in the forest. Turkey Clan members must watch for threats to the community.\n\n2. **Sacrifice** - When cornered, a mother turkey will sacrifice herself to save her young. Turkey Clan members put the community first.\n\n3. **Abundance** - One turkey feeds many. Turkey Clan members share generously.\n\n'When you take your first turkey,' Grandmother says, 'you're not taking an animal. You're accepting a responsibility.'\n\nThe hunt succeeds. That night, the entire village shares the turkey. Quick Eyes learns his first lesson: abundance multiplies when shared.",
      indigenousPractice: "The Turkey Clan system ensured that hunting was managed by people who had spiritual and social obligations tied to the species. You couldn't hunt carelessly if your clan identity was linked to the animal's well-being.",
      funFact: "The Haudenosaunee (Iroquois Confederacy) had nine major clans, and Turkey Clan members were often chosen as scouts and messengers because turkeys represented keen vision and awareness."
    },
    {
      era: "Early Contact",
      period: "1600-1700",
      title: "The Naming Confusion",
      narrative: "*Location: A marketplace in colonial Philadelphia, 1685*\n\nA English trader examines a large bird brought in by a Lenape hunter:\n\n'What do you call this?'\n\n'Paléyu,' the hunter replies.\n\n'In England, we call it a turkey,' the trader says.\n\nThe Lenape hunter looks confused. 'But we are not in Turkey. This bird has always lived here.'\n\nThe trader shrugs. 'The name stuck when Spanish traders brought similar birds through Turkish ports.'\n\nWhat the trader doesn't understand: the Lenape don't just have one name for turkeys. They have different names depending on:\n- Age (poult, jake, tom)\n- Season (spring strutter, fall wanderer)\n- Behavior (the boasting one, the silent one)\n\nThe European approach: one bird, one name, simple.\n\nThe Indigenous approach: one species, many names, each telling a story.\n\nWithin 20 years, the word 'turkey' has replaced Paléyu in most conversations. A piece of knowledge—the language of relationship—vanishes into a single, incorrect word.",
      colonialImpact: "Language replacement wasn't just about words—it was about erasing relational knowledge. Indigenous names encoded information about behavior, ecology, and sustainable harvest. European names were just labels.",
      funFact: "The word 'turkey' is possibly the most geographically confused name in biology—it's named for a country it never lived in, confused with domesticated Mexican birds, and replaced dozens of accurate Indigenous names."
    },
    {
      era: "Colonial Period",
      period: "1700-1840",
      title: "The Last Turkey: Jacob German's Burden",
      narrative: "*Location: Lycoming County, Pennsylvania, approximately 1840*\n\nJacob German raises his rifle. In his sights: a magnificent tom turkey, the first he's seen in three years. He doesn't know it, but this is likely the last wild turkey in Pennsylvania.\n\nHe fires. The bird falls.\n\nAs he approaches, something feels wrong. The forest is silent in a way he's never experienced. No gobbles in the distance. No hens clucking in the underbrush. Just silence.\n\nJacob carries the turkey home, but he doesn't eat it. He plucks its feathers and keeps them in a box. His wife asks why:\n\n'I think I killed something that won't come back.'\n\nYears later, on his deathbed, Jacob tells his grandson:\n\n'When I was young, turkeys were everywhere. We thought they'd always be there. We were wrong. Don't make my mistake.'\n\nWhether this story is literally true or folk legend doesn't matter—it captures a real awakening that happened across Pennsylvania in the 1840s-1850s. People realized, too late, that they'd destroyed something irreplaceable.",
      colonialImpact: "The extinction of wild turkeys in Pennsylvania was a wake-up call that contributed to the creation of America's conservation movement. But it came 50+ years too late to save the turkeys or many of the Indigenous communities that knew how to coexist with them.",
      conservationBirth: "The loss of turkeys, passenger pigeons, and other species in the 1800s led directly to the creation of state game commissions, wildlife protection laws, and eventually the conservation movement. Sometimes we only learn after we've lost everything.",
      funFact: "Pennsylvania's last wild turkey in 1840 coincided roughly with the last Pennsylvania elk (1867), the last wolverine (1830s), and the last mountain lion (1891). An entire megafauna assembly was erased in 60 years."
    },
    {
      era: "Industrial",
      period: "1840-1950",
      title: "The Great Forgetting & The Oklahoma Echo",
      narrative: "*Two locations, two timelines, one knowledge thread*\n\n**Pennsylvania, 1900:**\n\nA game warden addresses a conservation meeting:\n\n'Gentlemen, wild turkeys are extinct. They're as gone as the mastodon. We must accept this reality.'\n\nHe's right. Pennsylvania has had no wild turkeys for 60 years. Entire generations have grown up never seeing one. Turkey management knowledge has been lost.\n\n**Oklahoma Territory, 1900:**\n\nAn elderly Lenape woman, exiled from Pennsylvania in the 1860s, tells her grandchildren about the forests of their ancestors:\n\n'In the spring, the gobblers would call from every hillside. We took only the boasting males, never the quiet hens. The turkey gifted himself to us, and we honored that gift.'\n\nHer grandchildren hunt turkeys in Oklahoma. The knowledge survives in exile.\n\n**The Connection: 1920s**\n\nWhen Pennsylvania wildlife biologists travel to Oklahoma and other states to learn turkey biology for restoration attempts, they unknowingly tap into knowledge streams that trace back to Indigenous peoples—including displaced Pennsylvanians.\n\nA Lenape man in Oklahoma, hearing about Pennsylvania's restoration attempts, quietly remarks:\n\n'They're trying to bring back what they took from us twice—first the turkeys, then the people who knew how to live with turkeys.'\n\nThe irony is profound and painful.",
      indigenousPractice: "Displaced Indigenous communities carried ecological knowledge to their new territories. Oklahoma's wild turkeys were managed, in part, by people who remembered Pennsylvania's forests.",
      conservationBirth: "Pennsylvania's early turkey restoration attempts failed because they used domestic stock. Success came only when they used wild birds and adopted management strategies similar to Indigenous protocols—even if they didn't consciously recognize the source.",
      mystery: "Some Pennsylvania game wardens in the 1920s-1940s consulted with Indigenous hunters from other states. These conversations were rarely documented. How much traditional knowledge quietly informed 'modern' wildlife management?",
      funFact: "The Lenape people were forcibly relocated from Pennsylvania to Oklahoma in multiple waves (1830s-1860s). Today, the Delaware Nation and Delaware Tribe of Indians are headquartered in Oklahoma, far from their ancestral Pennsylvania homeland."
    },
    {
      era: "Conservation Era",
      period: "1950-Present",
      title: "640 Birds to 200,000: The Phoenix Returns",
      narrative: "*Location: State Game Lands 176, Centre County, 1951*\n\nA biologist releases the first of 12 wild turkeys trapped in West Virginia. The birds hesitate, then vanish into Pennsylvania forest that hasn't heard a gobble in 111 years.\n\n'Will it work this time?' asks a game warden.\n\n'It better,' the biologist replies. 'We've been trying to bring them back for 35 years.'\n\nBut something is different now. Previous attempts used farm-raised birds—basically domesticated chickens with turkey DNA. They couldn't roost, couldn't survive winter, couldn't wild.\n\nThese birds are WILD. Trapped from surviving populations. Carriers of ancient instincts.\n\n**The Explosion:**\n\n1951: 12 birds released  \n1960: 5,000 turkeys statewide  \n1970: 30,000 turkeys  \n1980: 90,000 turkeys  \n2000: 200,000+ turkeys in all 67 counties\n\n**2015: A Lenape Return Visit**\n\nA delegation of Lenape descendants visits Pennsylvania from Oklahoma. It's an emotional journey—most of their ancestors were forced west 150 years ago.\n\nThey visit Promised Land State Park. At dawn, a gobbler calls from the ridgeline.\n\nOne elder stops walking. Tears stream down his face.\n\n'My great-great-grandmother died in Oklahoma, believing turkeys were gone forever from her homeland. She told me, "The turkeys left because we left. They couldn't stay without us."\n\nNow they're back. And so are we, even if just for a visit.'\n\nThe group performs a quiet tobacco offering, speaking words in Lenape that haven't been spoken in that forest for 150 years. The turkey gobbles again.\n\nIt sounds like welcome.",
      indigenousPractice: "Modern turkey management mirrors traditional practices: spring male-only harvest, fall limited take, protection of nesting hens, habitat management through controlled burns. We 'discovered' what was never really lost—just forgotten.",
      conservationBirth: "Turkey restoration is cited as one of the greatest conservation successes in American history. But it required relearning relationships—between birds and habitat, harvest and reproduction, people and land—that Indigenous peoples had maintained for millennia.",
      mystery: "Pennsylvania now has more turkeys than existed pre-colonially (accounting for habitat changes). This seems impossible given habitat loss. How? Answer: Second-growth forests, agricultural fields providing food, active management, and fewer large predators create a new kind of abundance. But is it balanced?",
      funFact: "The 640 wild turkeys released in Pennsylvania between 1951-1978 are the ancestors of virtually every wild turkey in the state today. If you see a Pennsylvania turkey, you're looking at a descendant of those pioneering 640."
    }
  ],
  
  tradeHistory: {
    commodity: "Turkey meat, feathers (for writing quills and decoration)",
    routes: [
      "Pennsylvania forests to Philadelphia markets (1680-1840)",
      "Shipped to London (preserved in salt barrels)",
      "Feather trade to Europe for quill pens (before steel pens)"
    ],
    economicImpact: "In the 1700s, a wild turkey sold for 2-3 shillings in Philadelphia (equivalent to $40-60 today). Market hunters could earn substantial income, creating economic pressure that contributed to extinction. The Pennsylvania turkey trade was worth an estimated £50,000+ annually in the peak years (1750-1800), equivalent to $8-10 million today.",
    culturalExchange: "European colonists learned turkey hunting from Indigenous peoples but abandoned the restraint and spiritual protocols that maintained sustainability. Indigenous peoples gained access to firearms that made hunting more efficient but lost the landscape management (forest burns, habitat creation) that sustained turkey populations. Both sides lost when commercial extraction replaced reciprocal relationship."
  }
};

// ============================================================================
// BROOK TROUT Knowledge
// ============================================================================

export const BROOK_TROUT_KNOWLEDGE: SpeciesKnowledge = {
  speciesId: "brook-trout",
  commonName: "Brook Trout",
  scientificName: "Salvelinus fontinalis",
  
  indigenousNames: [
    {
      tribe: "Lenape (Delaware)",
      name: "Kweschkushkes",
      meaning: "The speckled one of cold water"
    },
    {
      tribe: "Seneca (Haudenosaunee)",
      name: "Jikonsaseh",
      meaning: "Painted jewel of the stream"
    },
    {
      tribe: "Mohawk",
      name: "Kahón:ios",
      meaning: "Beautiful swimmer in living water"
    }
  ],
  
  culturalSignificance: {
    preContact: `**🐟 Before "Brook Trout": The Speckled Prophets**

*Detective, here's your opening mystery: How can a fish tell you about the health of an entire watershed? The answer unlocks 10,000 years of Indigenous water stewardship.*

Brook trout aren't just fish to the Indigenous peoples of Pennsylvania—they're indicators, teachers, and gifts from the water spirits. The Lenape told stories of how brook trout were created when sunlight hit cold mountain springs and laughed, creating living sparks of color.

**The Trout Prophecy**

Lenape elders taught: "Where the speckled ones swim, the water is pure. Where they vanish, sickness follows."

This wasn't folklore—it was sophisticated ecological observation. Brook trout:
- Require cold, clean, well-oxygenated water
- Cannot survive in degraded streams
- Disappear before water quality problems become obvious to humans

By monitoring trout populations, Indigenous peoples essentially had an early warning system for watershed health. If trout disappeared from a stream, it meant:
- Upstream forests might be damaged
- Water temperature was rising
- Pollution or silt was present

**Sustainable Fishing: The Three-Hand Rule**

The Lenape practiced selective brook trout harvest:\n\n1. **Size:** Take only trout longer than three hand-widths (about 12-15 inches)\n2. **Season:** Fish only in late summer/early fall, NEVER during spring spawn\n3. **Method:** Use bone hooks and natural bait; release fish you don't need\n4. **Streams:** Rotate fishing spots annually to avoid depletion\n\nThis protocol was so effective that European colonists in the 1600s marveled at Pennsylvania's trout abundance. One colonist wrote:\n\n*"The savages take fish without diminishment of their numbers. Every stream yields trout of prodigious size and quantity."*\n\nThe colonist didn't understand that abundance was maintained BECAUSE OF Indigenous practices, not despite them.`,
    
    earlyContact: `**📜 1680-1750: The Trout Economy Emerges**

*Location: Pennsylvania's mountain streams. Status: About to change forever.*

William Penn's colonists arrived to find streams literally packed with brook trout. One settler recorded catching 83 trout in a single afternoon from a small creek near what's now State College.

**The Protein Rush**

For early colonists, brook trout were:
- Free, abundant protein
- Easy to preserve (smoked or salted)
- Valuable trade commodity

Unlike the Lenape's selective harvest, colonists:
- Fished year-round, including spawning season
- Used nets and traps to take dozens at once
- Built mill dams that blocked trout migration
- Cleared streamside forests (increasing water temperature)

**The Gristmill Catastrophe**

By 1720, Pennsylvania had hundreds of gristmills grinding grain into flour. But each mill required:
- A dam (blocks trout movement)
- Sawdust and grain waste (degrades water quality)
- Forest clearing (increases stream temperature)

Within 30 years, brook trout had vanished from many streams near settlements. The Lenape warned that "the speckled ones are leaving"—a signal that the land was becoming sick.

Colonists dismissed this as superstition. Within another generation, many of those streams were too polluted for human use too.`,
    
    colonialPeriod: `**⚔️ 1750-1900: The Mining Poison & Acid Rivers**

*Welcome to Pennsylvania's coal boom—and brook trout's nightmare.*

**Coal Mining's Water War**

As Pennsylvania became America's coal capital, thousands of mines opened across the state. Each mine created:
- **Acid mine drainage** (AMD): Iron, sulfur, and heavy metals leaching into streams
- **Siltation:** Mine waste burying stream gravel (trout need clean gravel for spawning)
- **Temperature rise:** Forest clearing for mining operations

**The Yellow Creek Apocalypse**

Some streams turned literally orange or yellow from acid mine drainage. Brook trout couldn't survive—the water was effectively poison. Entire watersheds became "dead streams" where nothing lived.

A scientist studying Pennsylvania streams in 1885 wrote:\n\n*"Where once the jeweled trout danced in crystal waters, now flows a river of rust. The land weeps iron tears."*\n\n**Logging Compounds the Crisis**

Simultaneously, Pennsylvania's forests were being clear-cut:
- 1800: ~95% of PA was forested\n- 1900: ~32% of PA was forested\n\nWithout streamside tree cover:
- Water temperatures rose (brook trout need water below 68°F)\n- Spring floods increased (eroding streambeds)\n- Summer flows decreased (streams dried up)\n\nBy 1900, brook trout had vanished from 75% of their historical Pennsylvania range.`,
    
    industrialImpact: `**🏭 1900-1980: The Hatchery False Hope**

*Pennsylvania's solution: If wild trout are disappearing, make fake trout!*\n\n**The Hatchery Era Begins**

In 1873, Pennsylvania established its first trout hatchery. The logic:\n- Wild trout populations collapsing\n- Can't restore streams (too expensive, industries too powerful)\n- Solution: Raise trout in hatcheries, stock degraded streams\n\nBy 1950, Pennsylvania had 15 hatcheries producing millions of trout annually. But there was a catch...\n\n**The Domestication Problem**\n\nHatchery trout weren't really "wild" anymore:\n- Selected for fast growth, high density tolerance\n- Lost natural wariness (easy to catch)\n- Poor survival in streams (most died within weeks)\n- Couldn't reproduce successfully in the wild\n\nIt was essentially trout farming subsidizing recreational fishing—not conservation.\n\n**The Wild Trout Revelation**\n\nIn the 1970s, biologists made a shocking discovery:\n\n*Some remote mountain streams still had wild, native brook trout that had never been stocked.*\n\nThese "heritage strain" brook trout were:\n- Genetically unique (isolated for 10,000+ years)\n- Perfectly adapted to local conditions\n- Able to survive in marginal habitat\n\nThis triggered a conservation awakening: **Maybe we should focus on protecting wild trout and their habitat, not just stocking domestic trout.**`,
    
    conservationEra: `**🌟 1980-Present: Restoring the Speckled Prophets**

*The pendulum swings: from exploitation to restoration.*\n\n**The Wild Trout Program**\n\nPennsylvania Fish & Boat Commission shifts strategy:\n1. Identify streams with wild trout populations\n2. Protect them from stocking (hatchery trout compete with wild trout)\n3. Restore habitat (add woody debris, stabilize banks, plant trees)\n4. Reduce acid mine drainage through treatment\n\nResults:\n- 1980: ~2,000 miles of wild trout streams\n- 2000: ~3,000 miles of wild trout streams\n- 2024: ~4,000+ miles of wild trout streams\n\n**The Keystone 10: Heritage Strain Conservation**\n\nPennsylvania identifies 10 streams with genetically unique "heritage strain" brook trout—fish whose ancestry predates European contact. These become conservation priorities.\n\nThese fish carry genetics that survived:\n- Ice ages\n- Indigenous harvest for 10,000 years\n- Colonial exploitation\n- Industrial devastation\n\nThey're survivors, carrying lessons in adaptation.\n\n**The Lenape Connection Today**\n\nModern trout conservation has come full circle:\n- Monitor water quality (like Lenape "speckled prophets" teaching)\n- Protect streamside forests (traditional management)\n- Selective harvest (regulations mirror three-hand rule)\n- Restoration over replacement (working with nature, not against it)\n\nIn 2018, a Lenape elder visited a restored Pennsylvania stream and observed:\n\n*"When the speckled ones return, the water remembers. And when the water remembers, maybe people will remember too."*\n\nBrook trout restoration isn't just about fish—it's about remembering relationship, respect, and the knowledge that Indigenous peoples carried through millennia.`
  },
  
  learningStack: {
    level1: {
      title: "🔍 The Speckled Jewel",
      content: "Brook trout aren't just beautiful—they're bioindicators. They can only survive in cold, clean, well-oxygenated water. In Pennsylvania streams, they're like canaries in a coal mine: where brook trout thrive, the entire watershed is healthy. Where they vanish, trouble is coming.",
      mystery: "Brook trout survived in Pennsylvania for 10,000+ years alongside intensive Indigenous fishing. European colonists caused population collapse in less than 100 years. What was the difference?"
    },
    level2: {
      title: "🕵️ The Lenape Water Wisdom",
      content: "The Lenape people called brook trout 'Kweschkushkes'—'the speckled one of cold water.' But they also called them prophets: 'Where the speckled ones swim, the water is pure.' This wasn't poetry—it was sophisticated ecological monitoring. By watching trout populations, Lenape communities had an early warning system for watershed degradation.",
      mystery: "The Lenape practiced the 'three-hand rule' for trout harvest and fished only in late summer/fall. How did this simple protocol maintain abundant trout populations for thousands of years?"
    },
    level3: {
      title: "🗺️ The Gristmill Catastrophe",
      content: "By 1720, Pennsylvania had hundreds of gristmills. Each required a dam, generated sawdust waste, and cleared streamside forests. Within 30 years, brook trout disappeared from streams near settlements. The Lenape warned that 'the speckled ones are leaving'—a signal that the water was becoming sick. Colonists ignored the warning. Within another generation, many streams were too polluted for human use.",
      mystery: "Early colonists caught 80+ brook trout in an afternoon and marveled at their abundance. Yet within 50 years, trout had vanished from the same streams. What changed?"
    },
    level4: {
      title: "📜 The Coal Poison & Hatchery False Hope",
      content: "Pennsylvania's coal boom turned streams orange and yellow with acid mine drainage. By 1900, 75% of brook trout habitat was destroyed. Pennsylvania's 'solution': hatcheries. Raise millions of domestic trout and stock degraded streams. But hatchery trout couldn't survive in the wild—they died within weeks. It was trout farming subsidizing fishing, not conservation. Meanwhile, in remote mountains, wild heritage brook trout survived, carrying genetics older than colonization.",
      mystery: "Hatchery trout look like wild trout but can't survive like them. What makes wild brook trout different?"
    },
    level5: {
      title: "🌟 Restoration & The Return",
      content: "In 1980, Pennsylvania shifted from stocking to restoration: protect wild trout, restore habitat, treat acid mine drainage, let nature heal. Results: wild trout streams increased from 2,000 to 4,000+ miles. 'Heritage strain' brook trout—genetically unique populations surviving since the Ice Age—are now protected. Modern conservation mirrors Lenape wisdom: monitor water quality, protect forests, selective harvest, work with nature. When brook trout return, the water remembers.",
      mystery: "Final Challenge: How do we balance recreational fishing (which many people love) with wild trout conservation? What would a sustainable trout fishery look like?"
    }
  },
  
  culturalStories: [
    {
      era: "Pre-Contact",
      period: "10,000 BCE - 1600 CE",
      title: "The Speckled Prophets",
      narrative: "*Location: A mountain stream in what's now Lycoming County, circa 1200 CE*\n\nYoung Wolf and his grandfather, Gray Sky, kneel by a crystal stream. Brook trout flash in the pools—orange bellies, white-edged fins, backs like starry night sky.\n\n'Watch the speckled ones,' Gray Sky teaches. 'They tell us if the water is healthy.'\n\nHe explains: Cold, clean water—trout thrive. Warm, dirty water—trout vanish first, sickness follows.\n\n'So we protect them?' Young Wolf asks.\n\n'We protect the forest that shades the stream. We protect the beaver who builds dams that create trout pools. We protect the trees that hold the soil. When we protect all these relations, the trout protect us by showing us the water is good.'\n\nYoung Wolf catches a large brook trout—four hands long. His grandfather nods approval: 'Good size. Thank him for feeding us.'\n\nThat night, the family shares the trout. But Gray Sky reminds Young Wolf:\n\n'Tomorrow, we fish a different stream. This one needs to rest. And in spring, we never fish at all—that's when the trout make their children.'",
      indigenousPractice: "The Lenape rotated fishing locations, avoided spawning season, and took only large trout (allowing smaller/younger fish to reproduce). This maintained population stability while providing food.",
      funFact: "Brook trout can live 5-7 years in the wild. By taking only large, mature fish and protecting spawning adults, Indigenous harvest actually improved genetic quality—older, stronger fish passed on genes."
    },
    {
      era: "Early Contact",
      period: "1680-1750",
      title: "The Warning Ignored",
      narrative: "*Location: A settler's mill on Penns Creek, 1720*\n\nJohn Miller built the finest gristmill in the county. The dam across Penns Creek powers his millstone perfectly. Farmers line up to have their grain ground into flour. Business is booming.\n\nBut a Lenape elder, Walking Bear, approaches with concern:\n\n'Your dam blocks the speckled ones from swimming upstream. Soon they will leave this creek.'\n\nJohn Miller dismisses this: 'There are more trout than I can count. One dam won't matter.'\n\nWalking Bear shakes his head: 'The speckled ones are prophets. When they leave, sickness follows. This creek will become dead water.'\n\nJohn Miller laughs: 'Superstitious nonsense.'\n\n**Twenty years later...**\n\nJohn Miller's grandson writes in his journal (1740):\n\n*'The creek has soured. No trout remain. The water tastes foul. Grandfather says he remembers when trout jumped in every pool. Now even the frogs have left. The old Indian was right.'*\n\nBy 1750, Penns Creek near the mill is degraded. High temperatures, silted gravel, no fish. The 'superstition' was sophisticated ecology that colonists ignored.",
      colonialImpact: "Gristmill dams blocked trout migration, raised water temperature, and degraded habitat. By ignoring Indigenous warnings about interconnected ecosystems, colonists destroyed the resource they depended on.",
      funFact: "Pennsylvania had over 10,000 dams on streams by 1900—almost one dam per mile of stream. Each one blocked trout migration and degraded habitat. Today, dam removal is a major restoration strategy."
    },
    {
      era: "Colonial Period",
      period: "1800-1900",
      title: "The Orange River Apocalypse",
      narrative: "*Location: A coal mining region in Clearfield County, 1880*\n\nTwo boys stand by a stream that runs bright orange. One pokes a stick into the water—the stick comes out coated in rusty slime.\n\n'My grandpa says this creek had trout once,' says the first boy.\n\n'How?' asks the second. 'Nothing can live in this.'\n\nHe's right. Acid mine drainage has turned the stream into a chemical soup—pH so low it can dissolve metal, iron concentrations high enough to be toxic.\n\nUpstream, the coal mine pumps 500 gallons per minute of contaminated water into the creek. The mine owners know. They don't care. There are no regulations.\n\n**One valley over...**\n\nA small mountain stream, too remote for mining, still runs clear. Brook trout thrive in its cold pools. But it's surrounded by devastation—every accessible stream is poisoned.\n\nA visiting scientist observes:\n\n*'It's as if civilization advanced across Pennsylvania like a wave, and brook trout retreated before it into ever-smaller refuges. Soon there will be nowhere left to retreat.'*\n\nBy 1900, an estimated 5,000+ miles of Pennsylvania streams are too degraded for brook trout. Entire generations grow up never seeing the state fish in the wild.",
      colonialImpact: "Coal mining generated unprecedented wealth for Pennsylvania but externalized the costs onto waterways. Acid mine drainage (AMD) remains Pennsylvania's #1 water quality problem even today, 100+ years after most mines closed.",
      conservationBirth: "The devastation of Pennsylvania's streams was so complete that it triggered early water quality legislation and eventually the Clean Water Act (1972). Sometimes ecological collapse is the wake-up call that creates conservation law.",
      funFact: "Pennsylvania has over 5,500 miles of streams impaired by abandoned mine drainage. Treatment costs are estimated at $5-15 billion. We're still paying for the coal boom 120+ years later."
    },
    {
      era: "Industrial",
      period: "1900-1980",
      title: "The Hatchery Illusion",
      narrative: "*Location: Pennsylvania Fish Hatchery, Bellefonte, 1955*\n\nA fish culturist nets thousands of trout from concrete raceways. These fish were:
- Hatched in a building
- Fed pellets from a machine
- Never saw a wild stream
- Genetically selected for hatchery conditions\n\n'Where are these going?' asks a visiting schoolchild.\n\n'Fishing Creek. We'll dump 5,000 trout there this week,' the culturist replies.\n\n'Will they survive?'\n\n'Most will be caught within 2-3 days. The rest will probably die. But anglers are happy, so...'\n\nHe shrugs. It's not conservation—it's put-and-take stocking, essentially outdoor trout farming.\n\n**Meanwhile, 30 miles away...**\n\nA biologist named Robert Bachman hikes to a remote mountain stream that's never been stocked. He finds wild brook trout—small, wary, brilliantly colored.\n\nGenetic testing reveals these trout are a unique heritage strain, isolated since the Ice Age. Their genetics have never been contaminated by hatchery fish.\n\nBachman realizes: *These fish survived Indigenous harvest for 10,000 years, colonial exploitation, and industrial devastation. They're not just trout—they're time capsules, carrying lessons in survival.*\n\nHis research helps launch Pennsylvania's Wild Trout Program, shifting focus from hatchery dependence to wild trout protection.",
      indigenousPractice: "Wild heritage brook trout survived because they inhabited remote, difficult-to-access streams—often the same headwaters that Indigenous peoples protected as source waters and sacred places.",
      conservationBirth: "The discovery of heritage strain brook trout in the 1970s transformed Pennsylvania fisheries management from 'stock and fish' to 'protect and restore.' It's one of the great success stories of American conservation.",
      mystery: "Why did remote, wild brook trout survive when nearby stocked populations crashed? Answer: Wild fish were adapted to local conditions; hatchery fish were adapted to artificial conditions. Genetics + habitat protection = survival.",
      funFact: "Pennsylvania has identified 10 streams with 'Keystone 10' heritage strain brook trout—genetically unique populations that predate European contact. These fish are essentially living fossils, carrying 10,000+ years of local adaptation."
    },
    {
      era: "Conservation Era",
      period: "1980-Present",
      title: "When the Water Remembers",
      narrative: "*Location: A restored stream in Potter County, 2018*\n\nA stream that ran orange with acid mine drainage for 80 years now runs clear. A limestone treatment system neutralizes the acid. Volunteers have planted 10,000 trees along the banks. Large woody debris creates pools and cover.\n\nA biologist opens a fish trap: wild brook trout, naturally reproducing, returned on their own from upstream refuges.\n\n'They came back,' he marvels. 'We fixed the water, and they came back.'\n\n**That same day...**\n\nA Lenape elder from Oklahoma visits Pennsylvania—a return to ancestral lands his great-great-grandparents were forced to leave.\n\nHe kneels by the restored stream, watches brook trout flash in the pools. Tears stream down his face.\n\n'My grandmother told me her grandmother spoke of the speckled prophets—how they told our people if the water was good. She died believing they were gone forever from this land.'\n\nHe performs a tobacco offering, speaking Lenape words of gratitude to the water, the trout, the land.\n\n'When the speckled ones return, the water remembers,' he says. 'And when the water remembers, maybe people will remember too.'\n\nThe stream continues its work—flowing, cooling, cleaning, healing. The brook trout swim as they have for ten thousand years, carrying forward a story older than cities, older than nations, older than the very concept of 'conservation.'\n\nThey swim in waters that remember—and invite us to remember too.",
      indigenousPractice: "Modern stream restoration uses techniques remarkably similar to traditional Indigenous watershed management: protect forests, create structural complexity (like beaver dams), monitor indicator species, work with natural processes.",
      conservationBirth: "Pennsylvania's wild trout program now protects 4,000+ miles of streams. It's among the most successful freshwater restoration programs in the US, proving that damaged ecosystems can heal when given the chance.",
      funFact: "A single restored stream can serve as a 'seed source,' with wild trout recolonizing miles of downstream habitat naturally—no stocking needed. Nature is remarkably resilient when we remove the barriers we created.",
      mystery: "Final question: Pennsylvania spends $40+ million annually on trout stocking but only ~$5 million on habitat protection. Which investment creates lasting trout populations? The answer is becoming clear..."
    }
  ],
  
  tradeHistory: {
    commodity: "Brook trout (fresh, salted, or smoked)",
    routes: [
      "Mountain streams to urban markets (Philadelphia, Pittsburgh)",
      "Preserved in salt barrels for long-distance shipping",
      "Sport fishing tourism (1800s-present)"
    ],
    economicImpact: "Brook trout supported subsistence economies for Indigenous peoples for millennia without population decline. Commercial exploitation in the 1800s-early 1900s contributed to population collapse. Today, trout fishing generates $1.8+ billion annually for Pennsylvania's economy (hatchery program, licenses, tourism, gear), but the economic model has shifted from extraction to sustainable recreation.",
    culturalExchange: "European colonists learned trout fishing techniques from Indigenous peoples but abandoned the cultural restraints (seasonal limits, size selectivity, spiritual protocol) that made harvest sustainable. Today, catch-and-release fishing, native trout protection, and habitat restoration represent a partial return to sustainable relationship—learning, again, what was known all along."
  }
};

// ============================================================================
// More species to be added...
// ============================================================================

// Export a registry of all enhanced species knowledge
export const SPECIES_KNOWLEDGE_REGISTRY: Record<string, SpeciesKnowledge> = {
  "white-tailed-deer": WHITE_TAILED_DEER_KNOWLEDGE,
  "wild-turkey": WILD_TURKEY_KNOWLEDGE,
  "brook-trout": BROOK_TROUT_KNOWLEDGE,
  // More to come...
};

