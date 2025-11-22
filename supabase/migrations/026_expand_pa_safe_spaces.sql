-- Migration: Expand Pennsylvania Safe Spaces (SSFE)
-- Replicates Pittsburgh model across major PA cities
-- Includes libraries, parks, museums, community centers, universities
-- Focus cities: Philadelphia, Harrisburg, State College, Erie, Scranton, Reading, Lancaster, Allentown

-- ============================================================================
-- PHILADELPHIA REGION - Safe Spaces
-- ============================================================================

-- Libraries
INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('Free Library of Philadelphia - Central',
 'Historic main library with extensive natural history collection. Beautiful architecture. Safe downtown location with outdoor spaces.',
 39.9526, -75.1652,
 ST_SetSRID(ST_MakePoint(-75.1652, 39.9526), 4326)::geography,
 'library',
 '1901 Vine St',
 'Philadelphia', 'PA', '19103',
 'Urban green space with native plantings. Gardens attract pollinators. Excellent for observing urban wildlife adaptation.',
 ARRAY['American Robin', 'House Sparrow', 'Monarch Butterfly', 'Ruby-throated Hummingbird', 'Eastern Gray Squirrel'],
 ARRAY['Urban/Gardens']),

('Free Library - Northeast Regional',
 'Modern library with community gardens. Safe, accessible location for all ages.',
 40.0306, -75.0817,
 ST_SetSRID(ST_MakePoint(-75.0817, 40.0306), 4326)::geography,
 'library',
 '2228 Cottman Ave',
 'Philadelphia', 'PA', '19149',
 'Community gardens support native plants and pollinators. Urban wildlife observation.',
 ARRAY['Common Eastern Bumble Bee', 'Painted Lady Butterfly', 'House Wren', 'European Starling'],
 ARRAY['Green Infrastructure']),

('Free Library - West Philadelphia Regional',
 'Community hub with outdoor spaces. Access to urban greenways.',
 39.9606, -75.2106,
 ST_SetSRID(ST_MakePoint(-75.2106, 39.9606), 4326)::geography,
 'library',
 '1906 Walnut St',
 'Philadelphia', 'PA', '19103',
 'Proximity to Schuylkill River provides aquatic habitat observations.',
 ARRAY['Belted Kingfisher', 'Green Heron', 'Red-winged Blackbird', 'Northern Water Snake'],
 ARRAY['Urban/Riverfront']),

-- Parks
('Fairmount Park - Wissahickon Valley',
 'One of nation largest urban parks. Wissahickon Creek supports diverse wildlife. Old-growth forest remnants.',
 40.0200, -75.2000,
 ST_SetSRID(ST_MakePoint(-75.2000, 40.0200), 4326)::geography,
 'park',
 'Wissahickon Valley',
 'Philadelphia', 'PA', '19119',
 'Old-growth forest with creek corridor. Excellent for stream ecology and forest studies.',
 ARRAY['Pileated Woodpecker', 'Louisiana Waterthrush', 'Wood Duck', 'Beaver', 'Red-backed Salamander', 'Brook Trout'],
 ARRAY['Urban Gorge/Creek/Forest']),

('John Heinz National Wildlife Refuge',
 '1,000-acre urban refuge - largest remaining freshwater tidal marsh in PA. Boardwalk trails. Free admission.',
 39.9000, -75.2500,
 ST_SetSRID(ST_MakePoint(-75.2500, 39.9000), 4326)::geography,
 'park',
 '8601 Lindbergh Blvd',
 'Philadelphia', 'PA', '19153',
 'Freshwater tidal marsh ecosystem. Exceptional bird diversity. Important migration stopover.',
 ARRAY['Great Blue Heron', 'Great Egret', 'Osprey', 'Bald Eagle', 'Northern Harrier', 'Muskrat', 'River Otter', 'Diamondback Terrapin'],
 ARRAY['Tidal Marsh']),

('Bartram Garden',
 '45-acre historic botanical garden on Schuylkill River. America oldest surviving botanic garden (1728).',
 39.9328, -75.2225,
 ST_SetSRID(ST_MakePoint(-75.2225, 39.9328), 4326)::geography,
 'park',
 '5400 Lindbergh Blvd',
 'Philadelphia', 'PA', '19143',
 'Historic garden with native and exotic plants. Tidal river edge. Wetland restoration areas.',
 ARRAY['Ruby-throated Hummingbird', 'Baltimore Oriole', 'Cedar Waxwing', 'Monarch Butterfly'],
 ARRAY['Historic Garden/Riverfront']),

-- Museums
('Academy of Natural Sciences',
 'Oldest natural science museum in Americas. Extensive PA wildlife exhibits. Perfect for curriculum tie-ins.',
 39.9556, -75.1717,
 ST_SetSRID(ST_MakePoint(-75.1717, 39.9556), 4326)::geography,
 'museum',
 '1900 Benjamin Franklin Pkwy',
 'Philadelphia', 'PA', '19103',
 'Indoor natural history museum with extensive PA wildlife exhibits. Dinosaur hall, butterfly garden.',
 ARRAY['Exhibits feature PA species including Black Bear', 'White-tailed Deer', 'Bald Eagle', 'River Otter'],
 ARRAY['Museum/Indoor Education']),

('Franklin Institute',
 'Science center with environmental exhibits and planetarium. Hands-on learning.',
 39.9581, -75.1725,
 ST_SetSRID(ST_MakePoint(-75.1725, 39.9581), 4326)::geography,
 'museum',
 '222 N 20th St',
 'Philadelphia', 'PA', '19103',
 'Interactive science exhibits include local ecosystems, water cycle, energy.',
 ARRAY['Educational exhibits and displays'],
 ARRAY['Science Center/Museum']),

-- ============================================================================
-- HARRISBURG REGION - Additional Safe Spaces
-- ============================================================================

-- Libraries (additional to existing)
('Dauphin County Library System - Northern Dauphin',
 'Community library with nature programming. Safe, accessible location.',
 40.3500, -76.8000,
 ST_SetSRID(ST_MakePoint(-76.8000, 40.3500), 4326)::geography,
 'library',
 '6818 Linglestown Rd',
 'Harrisburg', 'PA', '17112',
 'Suburban location with access to natural areas. Good for neighborhood wildlife observation.',
 ARRAY['American Robin', 'Northern Cardinal', 'Blue Jay', 'Downy Woodpecker'],
 ARRAY['Suburban']),

-- Parks (additional)
('Little Buffalo State Park',
 '923-acre park with lake, trails, and Blue Ball Tavern. Family-friendly.',
 40.4000, -77.2000,
 ST_SetSRID(ST_MakePoint(-77.2000, 40.4000), 4326)::geography,
 'state_park',
 '1579 State Park Rd',
 'Newport', 'PA', '17074',
 'Lake ecosystem with diverse habitats. Forest trails excellent for hiking.',
 ARRAY['Wood Duck', 'Great Blue Heron', 'Belted Kingfisher', 'Red-tailed Hawk'],
 ARRAY['Lake/Forest']),

-- ============================================================================
-- STATE COLLEGE REGION - Additional Safe Spaces
-- ============================================================================

-- Libraries (additional)
('Centre County Library - Bellefonte',
 'Historic library in Victorian town. Safe, accessible location.',
 40.9131, -77.7783,
 ST_SetSRID(ST_MakePoint(-77.7783, 40.9131), 4326)::geography,
 'library',
 '203 N Allegheny St',
 'Bellefonte', 'PA', '16823',
 'Small town location with access to Spring Creek corridor.',
 ARRAY['American Goldfinch', 'Downy Woodpecker', 'White-breasted Nuthatch'],
 ARRAY['Small Town']),

-- Parks (additional)
('Rothrock State Forest - Bear Meadows',
 'Unique bog ecosystem. Boardwalk trail. Dark sky preserve.',
 40.7000, -77.8000,
 ST_SetSRID(ST_MakePoint(-77.8000, 40.7000), 4326)::geography,
 'state_park',
 'Bear Meadows Natural Area',
 'State College', 'PA', '16801',
 'Mountain bog ecosystem. Insectivorous plants. Unique wildlife adapted to acidic conditions.',
 ARRAY['Hermit Thrush', 'Winter Wren', 'Dark-eyed Junco', 'Pitcher Plant', 'Sundew'],
 ARRAY['Mountain Bog']),

-- ============================================================================
-- ERIE REGION - Safe Spaces
-- ============================================================================

-- Libraries
('Erie County Public Library - Main',
 'Modern library with Great Lakes collection. Safe downtown location.',
 42.1294, -80.0851,
 ST_SetSRID(ST_MakePoint(-80.0851, 42.1294), 4326)::geography,
 'library',
 '160 E Front St',
 'Erie', 'PA', '16507',
 'Great Lakes location provides unique ecosystem observations.',
 ARRAY['Ring-billed Gull', 'Herring Gull', 'Double-crested Cormorant'],
 ARRAY['Urban/Great Lakes']),

('Erie County Public Library - Blasco',
 'Large library with outdoor spaces. Access to Presque Isle.',
 42.1200, -80.0900,
 ST_SetSRID(ST_MakePoint(-80.0900, 42.1200), 4326)::geography,
 'library',
 '160 E Front St',
 'Erie', 'PA', '16507',
 'Proximity to Lake Erie provides waterfowl observation opportunities.',
 ARRAY['Canada Goose', 'Mallard', 'Ring-necked Duck'],
 ARRAY['Urban/Great Lakes']),

-- Parks
('Presque Isle State Park',
 '3,200-acre peninsula on Lake Erie. Beaches, trails, and diverse habitats.',
 42.1275, -80.0851,
 ST_SetSRID(ST_MakePoint(-80.0851, 42.1275), 4326)::geography,
 'state_park',
 '301 Peninsula Dr',
 'Erie', 'PA', '16505',
 'Unique Great Lakes ecosystem. Important bird migration stopover. Rare dune and swale habitat.',
 ARRAY['Bald Eagle', 'Osprey', 'Piping Plover', 'Great Blue Heron', 'Ring-billed Gull'],
 ARRAY['Great Lakes/Dunes']),

-- Museums
('Erie Maritime Museum',
 'Museum featuring USS Niagara and Great Lakes history. Educational programs.',
 42.1350, -80.0900,
 ST_SetSRID(ST_MakePoint(-80.0900, 42.1350), 4326)::geography,
 'museum',
 '150 E Front St',
 'Erie', 'PA', '16507',
 'Maritime history with Great Lakes ecology connections.',
 ARRAY['Educational exhibits'],
 ARRAY['Museum']),

-- ============================================================================
-- SCRANTON/WILKES-BARRE REGION - Safe Spaces
-- ============================================================================

-- Libraries
('Lackawanna County Library System - Scranton',
 'Historic library with community programs. Safe downtown location.',
 41.4090, -75.6624,
 ST_SetSRID(ST_MakePoint(-75.6624, 41.4090), 4326)::geography,
 'library',
 '520 Vine St',
 'Scranton', 'PA', '18509',
 'Urban location with access to natural areas.',
 ARRAY['American Robin', 'House Sparrow', 'European Starling'],
 ARRAY['Urban']),

('Luzerne County Library System - Osterhout',
 'Community library with nature programming.',
 41.2450, -75.8900,
 ST_SetSRID(ST_MakePoint(-75.8900, 41.2450), 4326)::geography,
 'library',
 '71 S Franklin St',
 'Wilkes-Barre', 'PA', '18701',
 'Riverfront location provides waterfowl viewing opportunities.',
 ARRAY['Canada Goose', 'Mallard', 'Great Blue Heron'],
 ARRAY['Urban/Riverfront']),

-- Parks
('Nay Aug Park',
 '150-acre park with waterfalls, trails, and pool. Scranton largest park.',
 41.4200, -75.6500,
 ST_SetSRID(ST_MakePoint(-75.6500, 41.4200), 4326)::geography,
 'park',
 '500 Arthur Ave',
 'Scranton', 'PA', '18510',
 'Forest and stream habitats. Waterfalls provide unique ecosystem.',
 ARRAY['Wood Duck', 'Belted Kingfisher', 'Red-tailed Hawk', 'Painted Turtle'],
 ARRAY['Forest/Stream']),

-- Museums
('Everhart Museum',
 'Natural history and art museum. Educational programs.',
 41.4100, -75.6600,
 ST_SetSRID(ST_MakePoint(-75.6600, 41.4100), 4326)::geography,
 'museum',
 '1901 Mulberry St',
 'Scranton', 'PA', '18510',
 'Natural history exhibits with local focus.',
 ARRAY['Educational exhibits'],
 ARRAY['Museum']),

-- ============================================================================
-- READING REGION - Safe Spaces
-- ============================================================================

-- Libraries
('Reading Public Library - Main',
 'Historic library with community programs. Safe downtown location.',
 40.3356, -75.9269,
 ST_SetSRID(ST_MakePoint(-75.9269, 40.3356), 4326)::geography,
 'library',
 '100 S 5th St',
 'Reading', 'PA', '19602',
 'Urban location with access to Schuylkill River.',
 ARRAY['American Robin', 'House Sparrow', 'European Starling'],
 ARRAY['Urban']),

-- Parks
('Reading City Park',
 'Large urban park with trails and recreational facilities.',
 40.3400, -75.9200,
 ST_SetSRID(ST_MakePoint(-75.9200, 40.3400), 4326)::geography,
 'park',
 '11th & Hill Rds',
 'Reading', 'PA', '19602',
 'Urban green space with diverse habitats.',
 ARRAY['American Robin', 'Northern Cardinal', 'Blue Jay'],
 ARRAY['Urban Park']),

('Blue Marsh Lake Recreation Area',
 '6,000-acre area with lake, trails, and diverse habitats.',
 40.3758, -75.9244,
 ST_SetSRID(ST_MakePoint(-75.9244, 40.3758), 4326)::geography,
 'park',
 '1268 Palisades Dr',
 'Reading', 'PA', '19605',
 'Large reservoir ecosystem with diverse wildlife.',
 ARRAY['Bald Eagle', 'Osprey', 'Great Blue Heron', 'Wood Duck'],
 ARRAY['Reservoir/Forest']),

-- ============================================================================
-- LANCASTER REGION - Safe Spaces
-- ============================================================================

-- Libraries
('Lancaster Public Library',
 'Community library with nature programming. Safe downtown location.',
 40.0379, -76.3056,
 ST_SetSRID(ST_MakePoint(-76.3056, 40.0379), 4326)::geography,
 'library',
 '125 N Duke St',
 'Lancaster', 'PA', '17602',
 'Urban location with access to Conestoga River.',
 ARRAY['American Robin', 'House Sparrow', 'European Starling'],
 ARRAY['Urban']),

-- Parks
('Lancaster County Central Park',
 '544-acre park with trails, lake, and diverse habitats.',
 40.0447, -76.3050,
 ST_SetSRID(ST_MakePoint(-76.3050, 40.0447), 4326)::geography,
 'park',
 '1050 New Holland Ave',
 'Lancaster', 'PA', '17601',
 'Large park with lake and forest habitats.',
 ARRAY['Wood Duck', 'Great Blue Heron', 'Belted Kingfisher', 'Red-tailed Hawk'],
 ARRAY['Park/Lake']),

-- Museums
('North Museum of Nature and Science',
 'Natural history museum with local focus. Educational programs.',
 40.0400, -76.3100,
 ST_SetSRID(ST_MakePoint(-76.3100, 40.0400), 4326)::geography,
 'museum',
 '400 College Ave',
 'Lancaster', 'PA', '17603',
 'Natural history exhibits with PA wildlife focus.',
 ARRAY['Educational exhibits'],
 ARRAY['Museum']),

-- ============================================================================
-- ALLENTOWN/BETHLEHEM REGION - Safe Spaces
-- ============================================================================

-- Libraries
('Allentown Public Library',
 'Community library with nature programming. Safe downtown location.',
 40.6084, -75.4717,
 ST_SetSRID(ST_MakePoint(-75.4717, 40.6084), 4326)::geography,
 'library',
 '1210 Hamilton St',
 'Allentown', 'PA', '18102',
 'Urban location with access to Lehigh River.',
 ARRAY['American Robin', 'House Sparrow', 'European Starling'],
 ARRAY['Urban']),

('Bethlehem Area Public Library',
 'Community library with outdoor spaces.',
 40.6256, -75.3703,
 ST_SetSRID(ST_MakePoint(-75.3703, 40.6256), 4326)::geography,
 'library',
 '11 W Church St',
 'Bethlehem', 'PA', '18018',
 'Historic location with river access.',
 ARRAY['Canada Goose', 'Mallard', 'Great Blue Heron'],
 ARRAY['Urban/Riverfront']),

-- Parks
('Lehigh Parkway',
 'Large park along Lehigh River. Trails and recreational facilities.',
 40.6000, -75.4800,
 ST_SetSRID(ST_MakePoint(-75.4800, 40.6000), 4326)::geography,
 'park',
 'Lehigh Parkway',
 'Allentown', 'PA', '18103',
 'River corridor with diverse habitats.',
 ARRAY['Belted Kingfisher', 'Green Heron', 'Red-winged Blackbird'],
 ARRAY['River Corridor']),

('Sand Island Park',
 'Riverfront park in Bethlehem. Trails and recreational facilities.',
 40.6200, -75.3700,
 ST_SetSRID(ST_MakePoint(-75.3700, 40.6200), 4326)::geography,
 'park',
 'Sand Island',
 'Bethlehem', 'PA', '18018',
 'Riverfront location with diverse wildlife.',
 ARRAY['Canada Goose', 'Mallard', 'Great Blue Heron', 'Belted Kingfisher'],
 ARRAY['Riverfront']),

-- Museums
('Da Vinci Science Center',
 'Science center with environmental exhibits. Hands-on learning.',
 40.6100, -75.4800,
 ST_SetSRID(ST_MakePoint(-75.4800, 40.6100), 4326)::geography,
 'museum',
 '3145 Hamilton Blvd Bypass',
 'Allentown', 'PA', '18103',
 'Interactive science exhibits with local ecosystem focus.',
 ARRAY['Educational exhibits'],
 ARRAY['Science Center']);

-- Summary
DO $$
BEGIN
  RAISE NOTICE '✓ Expanded PA Safe Spaces (SSFE) Knowledge Base';
  RAISE NOTICE '  ✓ Philadelphia Region: Libraries, Parks, Museums';
  RAISE NOTICE '  ✓ Harrisburg Region: Additional Libraries, Parks';
  RAISE NOTICE '  ✓ State College Region: Additional Libraries, Parks';
  RAISE NOTICE '  ✓ Erie Region: Libraries, Parks, Museums';
  RAISE NOTICE '  ✓ Scranton/Wilkes-Barre Region: Libraries, Parks, Museums';
  RAISE NOTICE '  ✓ Reading Region: Libraries, Parks';
  RAISE NOTICE '  ✓ Lancaster Region: Libraries, Parks, Museums';
  RAISE NOTICE '  ✓ Allentown/Bethlehem Region: Libraries, Parks, Museums';
  RAISE NOTICE '  🏛️ Total: 30+ safe spaces across Pennsylvania';
END $$;


