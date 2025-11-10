-- Migration: Statewide PA Field Sites Expansion
-- Adds educational locations across Pennsylvania for Wildlife Leadership Academy
-- Focus cities: State College, Harrisburg, Philadelphia, Coatesville, East Stroudsburg
-- Includes: Libraries, Museums, YMCAs, State Parks, Safe Community Spaces

-- ============================================================================
-- STATE COLLEGE AREA (Centre County)
-- ============================================================================

-- Libraries
INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('Schlow Centre Region Library - Main',
 'Modern community library with nature programming. Adjacent to trails and parks. Safe, accessible location for all ages.',
 ST_SetSRID(ST_MakePoint(-77.8597, 40.7934), 4326)::geography,
 'library',
 '211 S Allen St',
 'State College', 'PA', '16801',
 'Downtown location with access to Spring Creek corridor. Urban wildlife observation. Great for weather and seasonal studies.',
 ARRAY['American Robin', 'Black-capped Chickadee', 'Blue Jay', 'Eastern Gray Squirrel'],
 ARRAY['Urban/Downtown']),

('Penn State Pattee Library',
 'Major university library with extensive natural history resources. Campus setting with diverse habitats nearby. Very safe environment.',
 ST_SetSRID(ST_MakePoint(-77.8611, 40.7996), 4326)::geography,
 'university',
 'Curtin Rd',
 'University Park', 'PA', '16802',
 'Campus location provides urban ecology study opportunities. Access to arboretum and research forests.',
 ARRAY['Northern Cardinal', 'American Goldfinch', 'Red-bellied Woodpecker', 'White-breasted Nuthatch'],
 ARRAY['University Campus']);

-- Museums & Nature Centers
INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('Millbrook Marsh Nature Center',
 '52-acre nature preserve with boardwalk trails through wetland. Excellent educational facility. Safe, accessible trails. Free admission.',
 ST_SetSRID(ST_MakePoint(-77.8422, 40.8139), 4326)::geography,
 'park',
 '1031 Roberts Rd',
 'State College', 'PA', '16801',
 'Exceptional wetland habitat. Boardwalk provides safe wildlife viewing. Spring migration hotspot. Over 200 bird species recorded.',
 ARRAY['Great Blue Heron', 'Green Heron', 'Wood Duck', 'Red-winged Blackbird', 'Marsh Wren', 'Spring Peeper', 'Painted Turtle'],
 ARRAY['Wetland/Marsh/Boardwalk']),

('Penn State Arboretum',
 '370-acre living laboratory with gardens and natural areas. Educational signage throughout. Multiple themed gardens. Free, open daily.',
 ST_SetSRID(ST_MakePoint(-77.8656, 40.8089), 4326)::geography,
 'park',
 'Bigler Rd',
 'University Park', 'PA', '16802',
 'Diverse plantings attract pollinators and birds. Demonstration gardens show sustainable practices. Children''s garden with nature play.',
 ARRAY['Ruby-throated Hummingbird', 'Baltimore Oriole', 'Cedar Waxwing', 'Common Eastern Bumble Bee', 'Monarch Butterfly'],
 ARRAY['Arboretum/Gardens']);

-- State Parks
INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('Bald Eagle State Park',
 '5,900-acre park with 1,730-acre lake. Excellent boating, fishing, hiking. Nature center on-site. Very family-friendly.',
 ST_SetSRID(ST_MakePoint(-77.7881, 41.0481), 4326)::geography,
 'state_park',
 '149 Main Park Rd',
 'Howard', 'PA', '16841',
 'Large lake attracts waterfowl and Bald Eagles year-round. Nesting osprey. Diverse forest habitats. Excellent for aquatic studies.',
 ARRAY['Bald Eagle', 'Osprey', 'Common Loon', 'Wood Duck', 'Great Blue Heron', 'Largemouth Bass', 'Yellow Perch'],
 ARRAY['Large Lake/Forest']),

('Black Moshannon State Park',
 '3,480-acre park with unique bog ecosystem. Boardwalk through bog. Dark sky preserve. Exceptional natural area.',
 ST_SetSRID(ST_MakePoint(-78.0597, 40.9236), 4326)::geography,
 'state_park',
 '4216 Beaver Rd',
 'Philipsburg', 'PA', '16866',
 'Rare mountain bog ecosystem. Insectivorous plants. Unique wildlife adapted to acidic conditions. Important conservation area.',
 ARRAY['Hermit Thrush', 'Winter Wren', 'Dark-eyed Junco', 'Snowshoe Hare', 'Pitcher Plant', 'Sundew', 'Bog Turtle'],
 ARRAY['Mountain Bog/Boreal']);

-- YMCAs
INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('YMCA of Centre County',
 'Community center with outdoor spaces and programming. Safe, supervised environment. Year-round nature activities.',
 ST_SetSRID(ST_MakePoint(-77.8686, 40.7856), 4326)::geography,
 'sports',
 '677 W Whitehall Rd',
 'State College', 'PA', '16801',
 'Urban community center with outdoor program space. Connects to trail system. Youth programming includes outdoor education.',
 ARRAY['American Robin', 'Northern Cardinal', 'Mourning Dove', 'Eastern Gray Squirrel'],
 ARRAY['Community Center']);

-- ============================================================================
-- HARRISBURG AREA (Dauphin County)
-- ============================================================================

-- Libraries
INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('Dauphin County Library System - McCormick',
 'Modern riverside library with riverfront views. Access to Capital Area Greenbelt. Safe downtown location.',
 ST_SetSRID(ST_MakePoint(-76.8853, 40.2669), 4326)::geography,
 'library',
 '101 Walnut St',
 'Harrisburg', 'PA', '17101',
 'Susquehanna River location provides waterfowl observation. Urban riverfront ecosystem. River Island visible from windows.',
 ARRAY['Canada Goose', 'Mallard', 'Great Blue Heron', 'Ring-billed Gull', 'Herring Gull'],
 ARRAY['Urban/Riverfront']),

('East Shore Area Library',
 'Community library across river from Harrisburg. River access and trails. Family-friendly location.',
 ST_SetSRID(ST_MakePoint(-76.8522, 40.2564), 4326)::geography,
 'library',
 '4501 Ethel St',
 'Harrisburg', 'PA', '17109',
 'Residential area with mature trees. Access to riverfront trails. Good for neighborhood wildlife observation.',
 ARRAY['American Robin', 'Northern Cardinal', 'Blue Jay', 'Downy Woodpecker', 'Eastern Chipmunk'],
 ARRAY['Urban/Residential']);

-- Museums
INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('State Museum of Pennsylvania',
 'Comprehensive natural history exhibits including PA wildlife, geology, ecology. Indoor education perfect for any weather. Free admission.',
 ST_SetSRID(ST_MakePoint(-76.8875, 40.2644), 4326)::geography,
 'landmark',
 '300 North St',
 'Harrisburg', 'PA', '17120',
 'Indoor natural history museum with extensive PA wildlife exhibits. Planetarium, Native American exhibits. Perfect for curriculum tie-ins.',
 ARRAY['Exhibits feature PA species including Black Bear', 'White-tailed Deer', 'Bald Eagle', 'River Otter', 'Native fish species'],
 ARRAY['Museum/Indoor Education']),

('Whitaker Center for Science and Arts',
 'Science center with environmental exhibits and IMAX theater. Hands-on learning. Downtown location. Admission required.',
 ST_SetSRID(ST_MakePoint(-76.8836, 40.2619), 4326)::geography,
 'landmark',
 '222 Market St',
 'Harrisburg', 'PA', '17101',
 'Interactive science exhibits include local ecosystems, water cycle, energy. Excellent for supplementing field observations.',
 ARRAY['Educational exhibits and displays'],
 ARRAY['Science Center/Museum']);

-- State Parks
INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('Wildwood Park and Lake',
 '229-acre nature sanctuary in Harrisburg. Boardwalk loop around lake. Nature center. Free, accessible. Excellent urban wildlife refuge.',
 ST_SetSRID(ST_MakePoint(-76.8494, 40.2939), 4326)::geography,
 'park',
 '100 Wildwood Way',
 'Harrisburg', 'PA', '17110',
 'Premier urban wetland. 1-mile boardwalk provides excellent wildlife viewing. Over 200 bird species recorded. Important migration stopover.',
 ARRAY['Wood Duck', 'Green Heron', 'Belted Kingfisher', 'Red-tailed Hawk', 'Great Horned Owl', 'Beaver', 'Muskrat', 'Painted Turtle'],
 ARRAY['Urban Wetland/Boardwalk']),

('Riverfront Park - Harrisburg',
 'Mile-long riverfront park on City Island. Walking trails, river access. Very safe, popular area. Great river ecology site.',
 ST_SetSRID(ST_MakePoint(-76.8833, 40.2514), 4326)::geography,
 'park',
 'City Island',
 'Harrisburg', 'PA', '17101',
 'Susquehanna River island park. Excellent for river ecology studies. Waterfowl viewing, fishing access. Connects to trail system.',
 ARRAY['Bald Eagle', 'Osprey', 'Double-crested Cormorant', 'Common Merganser', 'Smallmouth Bass', 'Channel Catfish'],
 ARRAY['River Island/Urban Park']);

-- YMCAs
INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('YMCA of the Roses - Harrisburg Branch',
 'Full-service community center with outdoor programming. Safe, supervised activities. Youth programs include nature exploration.',
 ST_SetSRID(ST_MakePoint(-76.8528, 40.2775), 4326)::geography,
 'sports',
 '20 S 3rd St',
 'Harrisburg', 'PA', '17101',
 'Urban community center serving diverse population. Outdoor activities connect to nearby parks and trails.',
 ARRAY['Common urban bird species'],
 ARRAY['Community Center/Urban']);

-- ============================================================================
-- PHILADELPHIA AREA
-- ============================================================================

-- Libraries
INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('Free Library of Philadelphia - Parkway Central',
 'Major urban library with extensive resources. Next to Logan Square and Franklin Institute. Very accessible location.',
 ST_SetSRID(ST_MakePoint(-75.1719, 39.9584), 4326)::geography,
 'library',
 '1901 Vine St',
 'Philadelphia', 'PA', '19103',
 'Urban park setting with mature trees. Logan Square provides green space. Excellent for urban ecology and architecture studies.',
 ARRAY['Rock Pigeon', 'House Sparrow', 'European Starling', 'American Robin', 'Peregrine Falcon (nearby buildings)'],
 ARRAY['Urban/Park Square']),

('Independence Branch - Free Library',
 'Historic Old City library. Walkable to Independence Hall, Liberty Bell. Rich history and nature integration.',
 ST_SetSRID(ST_MakePoint(-75.1472, 39.9486), 4326)::geography,
 'library',
 '18 S 7th St',
 'Philadelphia', 'PA', '19106',
 'Historic district with urban green spaces. Near Delaware River waterfront. Excellent for combining history and ecology.',
 ARRAY['Ring-billed Gull', 'Rock Pigeon', 'European Starling', 'House Sparrow'],
 ARRAY['Historic Urban']);

-- Museums & Nature Centers
INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('Academy of Natural Sciences - Drexel University',
 'America''s oldest natural history museum. World-class dinosaur and wildlife exhibits. Live animal center. Admission required.',
 ST_SetSRID(ST_MakePoint(-75.1725, 39.9578), 4326)::geography,
 'landmark',
 '1900 Benjamin Franklin Pkwy',
 'Philadelphia', 'PA', '19103',
 'Premier natural history museum with extensive PA wildlife exhibits. Outside In exhibit shows local ecosystems. Butterfly garden.',
 ARRAY['Museum exhibits PA species', 'Live animal displays', 'Butterfly garden species'],
 ARRAY['Museum/Natural History']),

('Schuylkill Center for Environmental Education',
 '365-acre nature preserve with 7 miles of trails. Environmental education center. Wildlife rehabilitation. Truly special place.',
 ST_SetSRID(ST_MakePoint(-75.2278, 40.0522), 4326)::geography,
 'park',
 '8480 Hagy''s Mill Rd',
 'Philadelphia', 'PA', '19128',
 'Large forest preserve in Philadelphia. Old-growth characteristics. Exceptional bird diversity. Stream corridors. Educational programs.',
 ARRAY['Pileated Woodpecker', 'Barred Owl', 'Scarlet Tanager', 'Wood Thrush', 'Red-shouldered Hawk', 'White-tailed Deer', 'Red Fox'],
 ARRAY['Large Urban Forest/Preserve']),

('John Heinz National Wildlife Refuge at Tinicum',
 '1,000-acre urban refuge - largest remaining freshwater tidal marsh in PA. Boardwalk trails. Free admission. Exceptional location.',
 ST_SetSRID(ST_MakePoint(-75.2642, 39.8936), 4326)::geography,
 'park',
 '8601 Lindbergh Blvd',
 'Philadelphia', 'PA', '19153',
 'Critical urban wildlife habitat. Tidal marsh ecosystem. Over 300 bird species recorded. Important migration stopover. Educational programs available.',
 ARRAY['Great Blue Heron', 'Great Egret', 'Osprey', 'Bald Eagle', 'Northern Harrier', 'Muskrat', 'River Otter', 'Diamondback Terrapin'],
 ARRAY['Tidal Marsh/National Refuge']);

-- Major Parks
INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('Fairmount Park - Wissahickon Valley',
 '1,800-acre gorge with creek, trails, and mature forest. Extensive trail system. Historic and natural landmark. Very accessible.',
 ST_SetSRID(ST_MakePoint(-75.2064, 40.0367), 4326)::geography,
 'park',
 'Forbidden Dr',
 'Philadelphia', 'PA', '19128',
 'One of nation''s largest urban parks. Wissahickon Creek supports diverse wildlife. Old-growth forest remnants. Excellent trail system.',
 ARRAY['Pileated Woodpecker', 'Louisiana Waterthrush', 'Wood Duck', 'Beaver', 'Red-backed Salamander', 'Brook Trout'],
 ARRAY['Urban Gorge/Creek/Forest']),

('Bartram''s Garden',
 '50-acre historic botanical garden on Schuylkill River. America''s oldest surviving botanic garden (1728). Educational programs. Admission required.',
 ST_SetSRID(ST_MakePoint(-75.2208, 39.9267), 4326)::geography,
 'landmark',
 '5400 Lindbergh Blvd',
 'Philadelphia', 'PA', '19143',
 'Historic garden with native and exotic plants. Tidal Schuylkill River edge. Wetland restoration areas. Excellent plant diversity.',
 ARRAY['Ruby-throated Hummingbird', 'Baltimore Oriole', 'Warbling Vireo', 'Great Blue Heron', 'Monarch Butterfly'],
 ARRAY['Historic Garden/Riverfront']);

-- YMCAs
INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('Philadelphia Freedom Valley YMCA',
 'Large community center serving diverse neighborhoods. Youth programs include environmental education. Safe, supervised space.',
 ST_SetSRID(ST_MakePoint(-75.2303, 39.9969), 4326)::geography,
 'sports',
 '8200 Flourtown Ave',
 'Philadelphia', 'PA', '19118',
 'Community center with connections to nearby parks and trails. Urban outdoor programming.',
 ARRAY['Common urban species'],
 ARRAY['Community Center']);

-- ============================================================================
-- COATESVILLE AREA (Chester County)
-- ============================================================================

INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('Coatesville Area Public Library',
 'Community library serving Chester County. Safe, accessible location. Programming for all ages.',
 ST_SetSRID(ST_MakePoint(-75.8236, 39.9831), 4326)::geography,
 'library',
 '501 E Lincoln Hwy',
 'Coatesville', 'PA', '19320',
 'Small town library with community gardens nearby. Access to Brandywine Creek watershed.',
 ARRAY['American Robin', 'Northern Cardinal', 'Blue Jay', 'Eastern Gray Squirrel'],
 ARRAY['Small Town/Community']),

('Hibernia County Park',
 '800-acre park with lake, forest, and historic features. Excellent trails. Very family-friendly. Free admission.',
 ST_SetSRID(ST_MakePoint(-75.8528, 40.0483), 4326)::geography,
 'park',
 '1 Park Rd',
 'Coatesville', 'PA', '19320',
 'Large county park with diverse habitats. Lake provides waterfowl habitat. Forest trails excellent for hiking. Historic iron furnace.',
 ARRAY['Wood Duck', 'Great Blue Heron', 'Red-tailed Hawk', 'Eastern Bluebird', 'White-tailed Deer', 'Beaver'],
 ARRAY['County Park/Lake/Forest']),

('Brandywine Creek - Coatesville Section',
 'Scenic creek with fishing access. Part of famous Brandywine watershed. Beautiful riparian corridor.',
 ST_SetSRID(ST_MakePoint(-75.8194, 39.9794), 4326)::geography,
 'park',
 'Brandywine Rd',
 'Coatesville', 'PA', '19320',
 'Important watershed for Chesapeake Bay. Creek supports diverse aquatic life. Riparian forest protects water quality.',
 ARRAY['Belted Kingfisher', 'Green Heron', 'Northern Water Snake', 'Smallmouth Bass', 'Brook Trout (upstream)', 'Crayfish'],
 ARRAY['Creek/Riparian Forest']),

('YMCA of Coatesville',
 'Community wellness center with youth programs. Safe environment for activities. Outdoor programming available.',
 ST_SetSRID(ST_MakePoint(-75.8144, 39.9772), 4326)::geography,
 'sports',
 '100 Gateway Blvd',
 'Coatesville', 'PA', '19320',
 'Community center serving youth and families. Connection to outdoor spaces.',
 ARRAY['Common urban species'],
 ARRAY['Community Center']);

-- ============================================================================
-- EAST STROUDSBURG AREA (Monroe County - Pocono Mountains)
-- ============================================================================

INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('Eastern Monroe Public Library',
 'Regional library serving Pocono communities. Programs focused on local nature and history. Accessible location.',
 ST_SetSRID(ST_MakePoint(-75.1878, 41.0008), 4326)::geography,
 'library',
 '1002 N 9th St',
 'Stroudsburg', 'PA', '18360',
 'Mountain region library. Close to Delaware Water Gap and state parks. Gateway to Pocono outdoor education.',
 ARRAY['Black-capped Chickadee', 'White-breasted Nuthatch', 'Downy Woodpecker', 'Eastern Gray Squirrel'],
 ARRAY['Small Town/Mountain']),

('Delaware Water Gap National Recreation Area',
 '70,000-acre national park along Delaware River. Waterfalls, trails, river access. Exceptional natural area. Free admission.',
 ST_SetSRID(ST_MakePoint(-75.1397, 40.9697), 4326)::geography,
 'state_park',
 '1978 River Rd',
 'Bushkill', 'PA', '18324',
 'Premier natural area. Appalachian Mountains meet Delaware River. 100+ miles of trails. Waterfalls, gorges, wildlife viewing. Black bear habitat.',
 ARRAY['Black Bear', 'Wild Turkey', 'Ruffed Grouse', 'Pileated Woodpecker', 'Scarlet Tanager', 'Wood Thrush', 'Brook Trout', 'American Eel'],
 ARRAY['National Park/Mountains/River']),

('Pocono Environmental Education Center',
 '38-acre campus in Delaware Water Gap. Dormitories, dining, classrooms. Perfect for overnight field trips. Premier environmental ed facility.',
 ST_SetSRID(ST_MakePoint(-75.1367, 40.9789), 4326)::geography,
 'landmark',
 '538 Emery Rd',
 'Dingmans Ferry', 'PA', '18328',
 'Residential environmental education center. Hands-on outdoor learning. Forest, pond, stream habitats. Professional naturalist staff.',
 ARRAY['Black Bear', 'White-tailed Deer', 'Barred Owl', 'Pileated Woodpecker', 'Red-spotted Newt', 'Wood Frog', 'Eastern Box Turtle'],
 ARRAY['Education Center/Forest']),

('Big Pocono State Park',
 '1,306-acre mountain park. Drive to summit (2,131 ft elevation). Spectacular views. Unique mountain ecosystem.',
 ST_SetSRID(ST_MakePoint(-75.3503, 41.1192), 4326)::geography,
 'state_park',
 'Camelback Rd',
 'Tannersville', 'PA', '18372',
 'Mountain summit park. Stunning 360° views. Northern hardwood forest. Cool temps even in summer. Good for studying elevation effects.',
 ARRAY['Common Raven', 'Dark-eyed Junco', 'Hermit Thrush', 'Red-breasted Nuthatch', 'Snowshoe Hare (higher elevations)'],
 ARRAY['Mountain Summit/Northern Forest']),

('Shawnee River Adventures',
 'Delaware River outfitter. Canoeing, kayaking, tubing. Water-based ecology education. Seasonal operation, safe supervised activities.',
 ST_SetSRID(ST_MakePoint(-75.1361, 40.9522), 4326)::geography,
 'landmark',
 '1 River Rd',
 'Shawnee on Delaware', 'PA', '18356',
 'River-based environmental education. Learn river ecology from water. Excellent for studying aquatic ecosystems, water quality, river dynamics.',
 ARRAY['Bald Eagle', 'Osprey', 'Belted Kingfisher', 'River Otter', 'Smallmouth Bass', 'American Eel', 'Hellgrammite', 'Caddisfly'],
 ARRAY['River/Paddling/Aquatic Ed']),

('YMCA of the Pocono Mountains',
 'Community center serving Monroe County. Youth programs include outdoor education. Safe, supervised environment.',
 ST_SetSRID(ST_MakePoint(-75.1797, 41.0400), 4326)::geography,
 'sports',
 '809 Main St',
 'Stroudsburg', 'PA', '18360',
 'Mountain community center. Programs connect to abundant nearby natural areas.',
 ARRAY['Common species'],
 ARRAY['Community Center/Mountain']);

-- ============================================================================
-- ADDITIONAL MAJOR STATE PARKS (Statewide)
-- ============================================================================

INSERT INTO field_sites (name, description, location, site_type, address, city, state, zip_code, ecological_notes, species_commonly_found, habitat_types) VALUES

('Ricketts Glen State Park',
 '13,050-acre park famous for 22 named waterfalls. Falls Trail System is challenging but spectacular. Premier natural area.',
 ST_SetSRID(ST_MakePoint(-76.2828, 41.3358), 4326)::geography,
 'state_park',
 '695 State Route 487',
 'Benton', 'PA', '17814',
 'Old-growth hemlock forest. Glens Natural Area National Natural Landmark. Exceptional waterfall geology. Challenging but rewarding.',
 ARRAY['Black-throated Blue Warbler', 'Hermit Thrush', 'Winter Wren', 'Brook Trout', 'Northern Dusky Salamander', 'Timber Rattlesnake'],
 ARRAY['Old-growth Forest/Waterfalls']),

('Worlds End State Park',
 '780-acre park in Loyalsock State Forest. Deep gorge, high vistas. Excellent trails. Beautiful fall colors.',
 ST_SetSRID(ST_MakePoint(-76.5819, 41.4664), 4326)::geography,
 'state_park',
 '24 Cabin Rd',
 'Forksville', 'PA', '18616',
 'Dramatic S-curve gorge carved by Loyalsock Creek. Rugged terrain. Diverse forest types. Excellent for studying erosion and succession.',
 ARRAY['Ruffed Grouse', 'Pileated Woodpecker', 'Barred Owl', 'Black Bear', 'Fisher', 'Brook Trout'],
 ARRAY['Mountain Gorge/Creek']),

('Cherry Springs State Park',
 '82-acre park known as best stargazing in eastern US. Dark Sky Park. Night programs. Open field with mountain views.',
 ST_SetSRID(ST_MakePoint(-77.8206, 41.6628), 4326)::geography,
 'state_park',
 '4639 Cherry Springs Rd',
 'Coudersport', 'PA', '16915',
 'Highest-elevation park. Dark sky preserve - minimal light pollution. Excellent for astronomy AND nocturnal wildlife observation.',
 ARRAY['Northern Saw-whet Owl', 'Barred Owl', 'White-tailed Deer', 'Snowshoe Hare', 'Flying Squirrel', 'Big Brown Bat'],
 ARRAY['Mountain/Dark Sky/Nocturnal']),

('Presque Isle State Park',
 '3,200-acre sandy peninsula on Lake Erie. 13 beaches. Excellent birding - over 320 species. Very accessible, flat terrain.',
 ST_SetSRID(ST_MakePoint(-80.1208, 42.1547), 4326)::geography,
 'state_park',
 '1 Peninsula Dr',
 'Erie', 'PA', '16505',
 'Unique Great Lakes ecosystem. Important bird migration stopover. Rare dune and swale habitat. Excellent for beach ecology and waterfowl.',
 ARRAY['Bald Eagle', 'Osprey', 'Common Loon', 'Horned Grebe', 'Common Tern', 'Piping Plover (rare)', 'Lake Erie fish species'],
 'Great Lakes/Peninsula/Beach'),

('Pine Creek Gorge - Pennsylvania Grand Canyon',
 '47-mile gorge with spectacular views. Leonard Harrison and Colton Point State Parks provide overlooks. Truly impressive landscape.',
 ST_SetSRID(ST_MakePoint(-77.4461, 41.7103), 4326)::geography,
 'state_park',
 '4797 Route 660',
 'Wellsboro', 'PA', '16901',
 '800-foot deep gorge carved by Pine Creek. Old-growth forest on slopes. Pine Creek Trail follows creek bottom. Premier scenic and ecological site.',
 ARRAY['Turkey Vulture', 'Common Raven', 'Peregrine Falcon', 'Black Bear', 'Wild Turkey', 'Brook Trout', 'Timber Rattlesnake'],
 ARRAY['Gorge/Canyon/Scenic Vista']);

-- ============================================================================
-- COMPLETION MESSAGE & STATISTICS
-- ============================================================================

DO $$ 
DECLARE
  total_sites INTEGER;
  by_city TEXT;
BEGIN
  SELECT COUNT(*) INTO total_sites FROM field_sites;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'STATEWIDE PA EXPANSION COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total field sites now in database: %', total_sites;
  RAISE NOTICE '';
  RAISE NOTICE 'NEW LOCATIONS ADDED:';
  RAISE NOTICE '';
  RAISE NOTICE 'STATE COLLEGE AREA:';
  RAISE NOTICE '  ✓ 2 Libraries (Schlow, Penn State)';
  RAISE NOTICE '  ✓ 2 Nature Centers (Millbrook Marsh, Arboretum)';
  RAISE NOTICE '  ✓ 2 State Parks (Bald Eagle, Black Moshannon)';
  RAISE NOTICE '  ✓ 1 YMCA';
  RAISE NOTICE '';
  RAISE NOTICE 'HARRISBURG AREA:';
  RAISE NOTICE '  ✓ 2 Libraries (McCormick, East Shore)';
  RAISE NOTICE '  ✓ 2 Museums (State Museum, Whitaker Center)';
  RAISE NOTICE '  ✓ 2 Parks (Wildwood, Riverfront)';
  RAISE NOTICE '  ✓ 1 YMCA';
  RAISE NOTICE '';
  RAISE NOTICE 'PHILADELPHIA AREA:';
  RAISE NOTICE '  ✓ 2 Libraries (Parkway Central, Independence)';
  RAISE NOTICE '  ✓ 4 Major Sites (Academy, Schuylkill Center, Heinz Refuge, Bartram''s)';
  RAISE NOTICE '  ✓ 1 Historic Park (Wissahickon Valley)';
  RAISE NOTICE '  ✓ 1 YMCA';
  RAISE NOTICE '';
  RAISE NOTICE 'COATESVILLE AREA:';
  RAISE NOTICE '  ✓ 1 Library';
  RAISE NOTICE '  ✓ 1 County Park (Hibernia)';
  RAISE NOTICE '  ✓ 1 Creek Access (Brandywine)';
  RAISE NOTICE '  ✓ 1 YMCA';
  RAISE NOTICE '';
  RAISE NOTICE 'EAST STROUDSBURG/POCONOS:';
  RAISE NOTICE '  ✓ 1 Library';
  RAISE NOTICE '  ✓ 3 Major Parks (Delaware Water Gap, Big Pocono, PEEC)';
  RAISE NOTICE '  ✓ 1 River Access (Shawnee)';
  RAISE NOTICE '  ✓ 1 YMCA';
  RAISE NOTICE '';
  RAISE NOTICE 'PREMIER STATE PARKS ADDED:';
  RAISE NOTICE '  ✓ Ricketts Glen (22 waterfalls)';
  RAISE NOTICE '  ✓ Worlds End (dramatic gorge)';
  RAISE NOTICE '  ✓ Cherry Springs (dark sky)';
  RAISE NOTICE '  ✓ Presque Isle (Lake Erie)';
  RAISE NOTICE '  ✓ Pine Creek Gorge (PA Grand Canyon)';
  RAISE NOTICE '';
  RAISE NOTICE 'COVERAGE SUMMARY:';
  RAISE NOTICE '  📚 Libraries: Statewide network';
  RAISE NOTICE '  🏛️  Museums: Major natural history centers';
  RAISE NOTICE '  🏃 YMCAs: Community safe spaces in each city';
  RAISE NOTICE '  🏞️  State Parks: PA''s finest natural areas';
  RAISE NOTICE '  🌊 Rivers & Lakes: Diverse aquatic ecosystems';
  RAISE NOTICE '';
  RAISE NOTICE 'Students across Pennsylvania can now:';
  RAISE NOTICE '  - Find educational field sites near them';
  RAISE NOTICE '  - Check in at safe, accessible locations';
  RAISE NOTICE '  - Explore diverse PA ecosystems';
  RAISE NOTICE '  - Learn from world-class facilities';
  RAISE NOTICE '========================================';
END $$;

