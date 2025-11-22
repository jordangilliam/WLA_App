
INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Spring Creek',
  'Famous limestone spring creek running through State College. All-tackle trophy section. Year-round fishing.',
  40.7981,
  -77.86,
  ST_SetSRID(ST_MakePoint(-77.86, 40.7981), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Excellent Hendrickson and Sulphur hatches. Spring stocking in March-April.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Penns Creek',
  'Freestone stream with excellent insect hatches. One of PA premier wild trout streams.',
  40.867,
  -77.4167,
  ST_SetSRID(ST_MakePoint(-77.4167, 40.867), 4326)::geography,
  'water_body',
  'Centre/Snyder',
  'PA',
  'Grannom hatch in mid-April. March Brown in late March.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Loyalsock Creek',
  'Scenic mountain stream with quality trout and bass fishing.',
  41.25,
  -76.8,
  ST_SetSRID(ST_MakePoint(-76.8, 41.25), 4326)::geography,
  'water_body',
  'Lycoming',
  'PA',
  'Spring stocking and hatches.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Pine Creek',
  'Pennsylvania Grand Canyon stream with diverse fishing opportunities.',
  41.7,
  -77.4,
  ST_SetSRID(ST_MakePoint(-77.4, 41.7), 4326)::geography,
  'water_body',
  'Tioga',
  'PA',
  'Brook trout in headwaters. Spring stocking.',
  ARRAY['Brook Trout', 'Brown Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Raystown Lake',
  'PA largest lake with exceptional multi-species fishing. 30 miles long, 200 feet deep.',
  40.4167,
  -78.0833,
  ST_SetSRID(ST_MakePoint(-78.0833, 40.4167), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Excellent bass fishing. Walleye spawn in April.',
  ARRAY['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Muskellunge', 'Striped Bass', 'Channel Catfish'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Monongahela River',
  'Major river system with excellent smallmouth bass and walleye fishing.',
  40.4406,
  -79.9961,
  ST_SetSRID(ST_MakePoint(-79.9961, 40.4406), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Excellent spring fishing for bass and walleye.',
  ARRAY['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Channel Catfish', 'Muskellunge'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Allegheny River',
  'Major river with diverse fishing opportunities from Pittsburgh upstream.',
  40.4406,
  -79.9961,
  ST_SetSRID(ST_MakePoint(-79.9961, 40.4406), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Trout fishing in upper sections. Bass fishing throughout.',
  ARRAY['Smallmouth Bass', 'Walleye', 'Muskellunge', 'Channel Catfish', 'Brown Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Youghiogheny River',
  'Scenic river with excellent trout and bass fishing. Popular for fly fishing.',
  40.1,
  -79.5,
  ST_SetSRID(ST_MakePoint(-79.5, 40.1), 4326)::geography,
  'water_body',
  'Fayette',
  'PA',
  'Excellent trout fishing in upper sections.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass', 'Walleye'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Chartiers Creek',
  'Urban creek with improving trout fishing.',
  40.4,
  -80,
  ST_SetSRID(ST_MakePoint(-80, 40.4), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Spring stocking provides good fishing.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Peters Creek',
  'Good trout stream in Washington County.',
  40.3,
  -80.2,
  ST_SetSRID(ST_MakePoint(-80.2, 40.3), 4326)::geography,
  'water_body',
  'Washington',
  'PA',
  'Spring stocking provides good fishing.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Ten Mile Creek',
  'Productive trout stream in southwest PA.',
  40.2,
  -80.3,
  ST_SetSRID(ST_MakePoint(-80.3, 40.2), 4326)::geography,
  'water_body',
  'Washington',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Dunkard Creek',
  'Good trout stream in Greene County.',
  39.9,
  -80.2,
  ST_SetSRID(ST_MakePoint(-80.2, 39.9), 4326)::geography,
  'water_body',
  'Greene',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Carmichaels Creek',
  'Small but productive trout stream.',
  39.9,
  -80.1,
  ST_SetSRID(ST_MakePoint(-80.1, 39.9), 4326)::geography,
  'water_body',
  'Greene',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Indian Creek',
  'Good trout stream in Fayette County.',
  40,
  -79.5,
  ST_SetSRID(ST_MakePoint(-79.5, 40), 4326)::geography,
  'water_body',
  'Fayette',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Laurel Hill Creek',
  'Excellent trout stream in Somerset County.',
  40,
  -79.2,
  ST_SetSRID(ST_MakePoint(-79.2, 40), 4326)::geography,
  'water_body',
  'Somerset',
  'PA',
  'Spring stocking and wild trout.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Casselman River',
  'Good trout river in Somerset County.',
  39.9,
  -79.1,
  ST_SetSRID(ST_MakePoint(-79.1, 39.9), 4326)::geography,
  'water_body',
  'Somerset',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Stonycreek River',
  'Excellent trout and bass river.',
  40.2,
  -78.9,
  ST_SetSRID(ST_MakePoint(-78.9, 40.2), 4326)::geography,
  'water_body',
  'Somerset',
  'PA',
  'Trout fishing excellent.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Conemaugh River',
  'Good warm-water river with bass and some trout.',
  40.5,
  -79.2,
  ST_SetSRID(ST_MakePoint(-79.2, 40.5), 4326)::geography,
  'water_body',
  'Indiana',
  'PA',
  'Trout in upper sections.',
  ARRAY['Smallmouth Bass', 'Largemouth Bass', 'Brown Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Blacklick Creek',
  'Good trout stream in Indiana County.',
  40.6,
  -79.1,
  ST_SetSRID(ST_MakePoint(-79.1, 40.6), 4326)::geography,
  'water_body',
  'Indiana',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Crooked Creek Lake',
  'Small reservoir with good bass and trout fishing.',
  40.7,
  -79.5,
  ST_SetSRID(ST_MakePoint(-79.5, 40.7), 4326)::geography,
  'water_body',
  'Armstrong',
  'PA',
  'Trout fishing excellent.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Rainbow Trout', 'Brown Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Deer Creek',
  'Good trout stream in Allegheny County.',
  40.5,
  -79.8,
  ST_SetSRID(ST_MakePoint(-79.8, 40.5), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Pine Creek',
  'Good trout stream.',
  40.2,
  -80.1,
  ST_SetSRID(ST_MakePoint(-80.1, 40.2), 4326)::geography,
  'water_body',
  'Washington',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Muddy Creek',
  'Productive trout stream.',
  40,
  -79.6,
  ST_SetSRID(ST_MakePoint(-79.6, 40), 4326)::geography,
  'water_body',
  'Fayette',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Dunlap Creek',
  'Good trout stream.',
  39.9,
  -79.7,
  ST_SetSRID(ST_MakePoint(-79.7, 39.9), 4326)::geography,
  'water_body',
  'Fayette',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Redstone Creek',
  'Good trout stream.',
  40,
  -79.8,
  ST_SetSRID(ST_MakePoint(-79.8, 40), 4326)::geography,
  'water_body',
  'Fayette',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Jacobs Creek',
  'Good trout stream.',
  40.2,
  -79.6,
  ST_SetSRID(ST_MakePoint(-79.6, 40.2), 4326)::geography,
  'water_body',
  'Westmoreland',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Loyalhanna Creek',
  'Good trout stream.',
  40.3,
  -79.4,
  ST_SetSRID(ST_MakePoint(-79.4, 40.3), 4326)::geography,
  'water_body',
  'Westmoreland',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Fourmile Run',
  'Small but productive trout stream.',
  40.3,
  -79.5,
  ST_SetSRID(ST_MakePoint(-79.5, 40.3), 4326)::geography,
  'water_body',
  'Westmoreland',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Sewickley Creek',
  'Good trout stream.',
  40.4,
  -79.6,
  ST_SetSRID(ST_MakePoint(-79.6, 40.4), 4326)::geography,
  'water_body',
  'Westmoreland',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Kiskiminetas River',
  'Good warm-water river with bass fishing.',
  40.6,
  -79.6,
  ST_SetSRID(ST_MakePoint(-79.6, 40.6), 4326)::geography,
  'water_body',
  'Armstrong',
  'PA',
  'Bass fishing excellent.',
  ARRAY['Smallmouth Bass', 'Largemouth Bass', 'Channel Catfish'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Mahoning Creek',
  'Good trout stream.',
  40.8,
  -79.2,
  ST_SetSRID(ST_MakePoint(-79.2, 40.8), 4326)::geography,
  'water_body',
  'Armstrong',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Crooked Creek',
  'Productive trout stream.',
  40.7,
  -79.4,
  ST_SetSRID(ST_MakePoint(-79.4, 40.7), 4326)::geography,
  'water_body',
  'Armstrong',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Bald Eagle Creek',
  'Excellent freestone stream with good trout fishing.',
  40.9,
  -77.8,
  ST_SetSRID(ST_MakePoint(-77.8, 40.9), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking and hatches.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Moshannon Creek',
  'Large freestone stream with diverse fishing.',
  41,
  -78,
  ST_SetSRID(ST_MakePoint(-78, 41), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Beech Creek',
  'Good trout stream in Clinton County.',
  41.2,
  -77.6,
  ST_SetSRID(ST_MakePoint(-77.6, 41.2), 4326)::geography,
  'water_body',
  'Clinton',
  'PA',
  'Spring stocking and wild trout.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Young Woman''s Creek',
  'Wild brook trout stream.',
  41.3,
  -77.7,
  ST_SetSRID(ST_MakePoint(-77.7, 41.3), 4326)::geography,
  'water_body',
  'Clinton',
  'PA',
  'Wild brook trout fishing.',
  ARRAY['Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Cedar Run',
  'Wild brook trout stream.',
  41.5,
  -77.4,
  ST_SetSRID(ST_MakePoint(-77.4, 41.5), 4326)::geography,
  'water_body',
  'Lycoming',
  'PA',
  'Wild brook trout.',
  ARRAY['Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Pine Creek',
  'Scenic canyon stream with excellent fishing.',
  41.4,
  -77.3,
  ST_SetSRID(ST_MakePoint(-77.3, 41.4), 4326)::geography,
  'water_body',
  'Lycoming',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lycoming Creek',
  'Good trout stream in Lycoming County.',
  41.3,
  -77,
  ST_SetSRID(ST_MakePoint(-77, 41.3), 4326)::geography,
  'water_body',
  'Lycoming',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Loyalsock Creek',
  'Excellent freestone stream with wild trout.',
  41.4,
  -76.7,
  ST_SetSRID(ST_MakePoint(-76.7, 41.4), 4326)::geography,
  'water_body',
  'Sullivan',
  'PA',
  'Spring stocking and wild trout.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Muncy Creek',
  'Good trout stream.',
  41.2,
  -76.8,
  ST_SetSRID(ST_MakePoint(-76.8, 41.2), 4326)::geography,
  'water_body',
  'Lycoming',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'White Deer Creek',
  'Good trout stream in Union County.',
  41,
  -77,
  ST_SetSRID(ST_MakePoint(-77, 41), 4326)::geography,
  'water_body',
  'Union',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Buffalo Run',
  'Small but productive trout stream.',
  40.8,
  -77.9,
  ST_SetSRID(ST_MakePoint(-77.9, 40.8), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Spruce Creek',
  'Famous limestone spring creek. Private water with excellent fishing.',
  40.6,
  -78.1,
  ST_SetSRID(ST_MakePoint(-78.1, 40.6), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Excellent spring hatches.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Warrior''s Mark Run',
  'Good trout stream.',
  40.7,
  -78,
  ST_SetSRID(ST_MakePoint(-78, 40.7), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Tuscarora Creek',
  'Good trout stream in Juniata County.',
  40.5,
  -77.5,
  ST_SetSRID(ST_MakePoint(-77.5, 40.5), 4326)::geography,
  'water_body',
  'Juniata',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Juniata River',
  'Major river with excellent bass and trout fishing.',
  40.5,
  -77.8,
  ST_SetSRID(ST_MakePoint(-77.8, 40.5), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Trout in upper sections. Bass throughout.',
  ARRAY['Smallmouth Bass', 'Largemouth Bass', 'Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Little Juniata River',
  'Excellent freestone river with diverse fishing opportunities.',
  40.5,
  -78,
  ST_SetSRID(ST_MakePoint(-78, 40.5), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Spring stocking and hatches.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Raystown Branch',
  'Good trout stream.',
  40.4,
  -78,
  ST_SetSRID(ST_MakePoint(-78, 40.4), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Aughwick Creek',
  'Good trout stream.',
  40.3,
  -77.9,
  ST_SetSRID(ST_MakePoint(-77.9, 40.3), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Standing Stone Creek',
  'Good trout stream.',
  40.4,
  -77.9,
  ST_SetSRID(ST_MakePoint(-77.9, 40.4), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Kishacoquillas Creek',
  'Good trout stream.',
  40.6,
  -77.6,
  ST_SetSRID(ST_MakePoint(-77.6, 40.6), 4326)::geography,
  'water_body',
  'Mifflin',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Honey Creek',
  'Good trout stream.',
  40.9,
  -77.7,
  ST_SetSRID(ST_MakePoint(-77.7, 40.9), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Fishing Creek',
  'Excellent trout stream.',
  40.8,
  -77.6,
  ST_SetSRID(ST_MakePoint(-77.6, 40.8), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking and hatches.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Bald Eagle Creek (Lower)',
  'Lower section with bass and trout.',
  40.9,
  -77.8,
  ST_SetSRID(ST_MakePoint(-77.8, 40.9), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Trout in upper sections.',
  ARRAY['Smallmouth Bass', 'Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Sugar Creek',
  'Good trout stream.',
  40.8,
  -77.8,
  ST_SetSRID(ST_MakePoint(-77.8, 40.8), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Sinking Creek',
  'Good trout stream.',
  40.7,
  -77.7,
  ST_SetSRID(ST_MakePoint(-77.7, 40.7), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Spruce Creek Run',
  'Small limestone-influenced stream.',
  40.6,
  -78.1,
  ST_SetSRID(ST_MakePoint(-78.1, 40.6), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Spring hatches.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Warrior''s Mark Run',
  'Good trout stream.',
  40.7,
  -78,
  ST_SetSRID(ST_MakePoint(-78, 40.7), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Tuscarora Creek',
  'Good trout stream in Juniata County.',
  40.5,
  -77.5,
  ST_SetSRID(ST_MakePoint(-77.5, 40.5), 4326)::geography,
  'water_body',
  'Juniata',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lost Creek',
  'Good trout stream.',
  40.5,
  -77.4,
  ST_SetSRID(ST_MakePoint(-77.4, 40.5), 4326)::geography,
  'water_body',
  'Juniata',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Cocolamus Creek',
  'Good trout stream.',
  40.4,
  -77.3,
  ST_SetSRID(ST_MakePoint(-77.3, 40.4), 4326)::geography,
  'water_body',
  'Juniata',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lehigh River',
  'Major river with trout and bass fishing. Excellent fly fishing opportunities.',
  40.6,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.6), 4326)::geography,
  'water_body',
  'Lehigh',
  'PA',
  'Excellent trout fishing in upper sections.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass', 'Walleye'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Bushkill Creek',
  'Good trout stream in Lehigh Valley.',
  40.7,
  -75.2,
  ST_SetSRID(ST_MakePoint(-75.2, 40.7), 4326)::geography,
  'water_body',
  'Northampton',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Monocacy Creek',
  'Good trout stream.',
  40.65,
  -75.3,
  ST_SetSRID(ST_MakePoint(-75.3, 40.65), 4326)::geography,
  'water_body',
  'Northampton',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Hokendauqua Creek',
  'Good trout stream.',
  40.7,
  -75.4,
  ST_SetSRID(ST_MakePoint(-75.4, 40.7), 4326)::geography,
  'water_body',
  'Northampton',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Catasauqua Creek',
  'Good trout stream.',
  40.65,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.65), 4326)::geography,
  'water_body',
  'Lehigh',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Little Lehigh Creek',
  'Excellent limestone-influenced stream with good trout fishing.',
  40.6,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.6), 4326)::geography,
  'water_body',
  'Lehigh',
  'PA',
  'Spring stocking and hatches.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Jordan Creek',
  'Good trout stream.',
  40.6,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.6), 4326)::geography,
  'water_body',
  'Lehigh',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Saucon Creek',
  'Good trout stream.',
  40.6,
  -75.3,
  ST_SetSRID(ST_MakePoint(-75.3, 40.6), 4326)::geography,
  'water_body',
  'Northampton',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Tobyhanna Creek',
  'Pocono stream with good trout fishing.',
  41.2,
  -75.4,
  ST_SetSRID(ST_MakePoint(-75.4, 41.2), 4326)::geography,
  'water_body',
  'Monroe',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Beltzville Lake',
  'Popular lake with excellent bass and walleye fishing.',
  40.85,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.85), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring fishing excellent.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Crappie', 'Bluegill'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lehighton Creek',
  'Good trout stream.',
  40.8,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.8), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Mahoning Creek',
  'Good trout stream.',
  40.85,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.85), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Aquashicola Creek',
  'Good trout stream.',
  40.8,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.8), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Pohopoco Creek',
  'Good trout stream.',
  40.9,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.9), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Tunkhannock Creek',
  'Good trout stream.',
  41,
  -75.3,
  ST_SetSRID(ST_MakePoint(-75.3, 41), 4326)::geography,
  'water_body',
  'Monroe',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Brodhead Creek',
  'Popular Pocono stream with good trout fishing.',
  41,
  -75.2,
  ST_SetSRID(ST_MakePoint(-75.2, 41), 4326)::geography,
  'water_body',
  'Monroe',
  'PA',
  'Spring stocking and hatches.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'McMichaels Creek',
  'Good trout stream.',
  41.1,
  -75.3,
  ST_SetSRID(ST_MakePoint(-75.3, 41.1), 4326)::geography,
  'water_body',
  'Monroe',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Appenzell Creek',
  'Small but productive trout stream.',
  40.7,
  -75.3,
  ST_SetSRID(ST_MakePoint(-75.3, 40.7), 4326)::geography,
  'water_body',
  'Northampton',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'French Creek',
  'Excellent warm-water stream with smallmouth bass and trout. One of PA best bass streams.',
  40.1,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.1), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Trout in upper sections. Bass fishing excellent.',
  ARRAY['Smallmouth Bass', 'Largemouth Bass', 'Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Pickering Creek',
  'Good trout stream in Chester County.',
  40.05,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.05), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Valley Creek',
  'Good trout stream.',
  40.1,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.1), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Birch Run',
  'Small but productive trout stream.',
  40,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'East Branch Brandywine Creek',
  'Good trout stream.',
  40.05,
  -75.8,
  ST_SetSRID(ST_MakePoint(-75.8, 40.05), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'West Branch Brandywine Creek',
  'Good trout stream.',
  40,
  -75.9,
  ST_SetSRID(ST_MakePoint(-75.9, 40), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Brandywine Creek',
  'Good warm-water stream with bass and trout.',
  39.95,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 39.95), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Trout in upper sections.',
  ARRAY['Smallmouth Bass', 'Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Octoraro Creek',
  'Good trout stream in Chester County.',
  39.9,
  -76.2,
  ST_SetSRID(ST_MakePoint(-76.2, 39.9), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'White Clay Creek',
  'Good trout stream.',
  39.85,
  -75.8,
  ST_SetSRID(ST_MakePoint(-75.8, 39.85), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Red Clay Creek',
  'Good trout stream.',
  39.9,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 39.9), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Creek Road Pond',
  'Small pond with trout fishing.',
  40,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Rainbow Trout', 'Brown Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Marsh Creek Lake',
  'Popular reservoir with excellent bass and trout fishing.',
  40.1,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.1), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Trout fishing excellent.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Rainbow Trout', 'Brown Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Crabtree Creek',
  'Small but productive trout stream.',
  40.05,
  -75.65,
  ST_SetSRID(ST_MakePoint(-75.65, 40.05), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Tributary to Brandywine',
  'Small tributary with trout.',
  39.95,
  -75.65,
  ST_SetSRID(ST_MakePoint(-75.65, 39.95), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Valley Forge Creek',
  'Good trout stream near Valley Forge.',
  40.1,
  -75.45,
  ST_SetSRID(ST_MakePoint(-75.45, 40.1), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Pickering Creek',
  'Good trout stream in Chester County.',
  40.05,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.05), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Valley Creek',
  'Good trout stream.',
  40.1,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.1), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Birch Run',
  'Small but productive trout stream.',
  40,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'East Branch Brandywine Creek',
  'Good trout stream.',
  40.05,
  -75.8,
  ST_SetSRID(ST_MakePoint(-75.8, 40.05), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'West Branch Brandywine Creek',
  'Good trout stream.',
  40,
  -75.9,
  ST_SetSRID(ST_MakePoint(-75.9, 40), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Brandywine Creek',
  'Good warm-water stream with bass and trout.',
  39.95,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 39.95), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Trout in upper sections.',
  ARRAY['Smallmouth Bass', 'Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Beaver River',
  'Good warm-water river with bass fishing.',
  40.7,
  -80.3,
  ST_SetSRID(ST_MakePoint(-80.3, 40.7), 4326)::geography,
  'water_body',
  'Beaver',
  'PA',
  'Bass fishing excellent.',
  ARRAY['Smallmouth Bass', 'Largemouth Bass', 'Channel Catfish'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Slippery Rock Creek',
  'Excellent trout stream.',
  40.9,
  -80,
  ST_SetSRID(ST_MakePoint(-80, 40.9), 4326)::geography,
  'water_body',
  'Butler',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Connoquenessing Creek',
  'Good trout stream.',
  40.8,
  -80.1,
  ST_SetSRID(ST_MakePoint(-80.1, 40.8), 4326)::geography,
  'water_body',
  'Butler',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Buffalo Creek',
  'Good trout stream.',
  40.9,
  -79.9,
  ST_SetSRID(ST_MakePoint(-79.9, 40.9), 4326)::geography,
  'water_body',
  'Butler',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Glade Run',
  'Good trout stream.',
  40.8,
  -79.9,
  ST_SetSRID(ST_MakePoint(-79.9, 40.8), 4326)::geography,
  'water_body',
  'Butler',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Thorn Creek',
  'Good trout stream.',
  40.6,
  -79.2,
  ST_SetSRID(ST_MakePoint(-79.2, 40.6), 4326)::geography,
  'water_body',
  'Indiana',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Two Lick Creek',
  'Good trout stream.',
  40.6,
  -79,
  ST_SetSRID(ST_MakePoint(-79, 40.6), 4326)::geography,
  'water_body',
  'Indiana',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Yellow Creek',
  'Good trout stream.',
  40.5,
  -79.1,
  ST_SetSRID(ST_MakePoint(-79.1, 40.5), 4326)::geography,
  'water_body',
  'Indiana',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Cowanshannock Creek',
  'Good trout stream.',
  40.8,
  -79.3,
  ST_SetSRID(ST_MakePoint(-79.3, 40.8), 4326)::geography,
  'water_body',
  'Armstrong',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Redbank Creek',
  'Good trout stream.',
  40.7,
  -79.3,
  ST_SetSRID(ST_MakePoint(-79.3, 40.7), 4326)::geography,
  'water_body',
  'Armstrong',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Mahoning Creek',
  'Good trout stream.',
  40.3,
  -79.5,
  ST_SetSRID(ST_MakePoint(-79.5, 40.3), 4326)::geography,
  'water_body',
  'Westmoreland',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Packsaddle Run',
  'Small but productive trout stream.',
  40.4,
  -79.4,
  ST_SetSRID(ST_MakePoint(-79.4, 40.4), 4326)::geography,
  'water_body',
  'Westmoreland',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Fourmile Run',
  'Good trout stream.',
  40.3,
  -79.5,
  ST_SetSRID(ST_MakePoint(-79.5, 40.3), 4326)::geography,
  'water_body',
  'Westmoreland',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Loyalhanna Dam',
  'Small reservoir with good fishing.',
  40.3,
  -79.4,
  ST_SetSRID(ST_MakePoint(-79.4, 40.3), 4326)::geography,
  'water_body',
  'Westmoreland',
  'PA',
  'Trout fishing good.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Rainbow Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Donegal Lake',
  'Small lake with trout fishing.',
  40.2,
  -79.3,
  ST_SetSRID(ST_MakePoint(-79.3, 40.2), 4326)::geography,
  'water_body',
  'Westmoreland',
  'PA',
  'Spring stocking.',
  ARRAY['Rainbow Trout', 'Brown Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Keystone Lake',
  'Reservoir with good bass and trout fishing.',
  40.7,
  -79.5,
  ST_SetSRID(ST_MakePoint(-79.5, 40.7), 4326)::geography,
  'water_body',
  'Armstrong',
  'PA',
  'Trout fishing good.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Rainbow Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Mahaffey Camp Lake',
  'Small lake with trout fishing.',
  40.6,
  -79,
  ST_SetSRID(ST_MakePoint(-79, 40.6), 4326)::geography,
  'water_body',
  'Indiana',
  'PA',
  'Spring stocking.',
  ARRAY['Rainbow Trout', 'Brown Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Yellow Creek Lake',
  'Reservoir with good fishing.',
  40.5,
  -79.1,
  ST_SetSRID(ST_MakePoint(-79.1, 40.5), 4326)::geography,
  'water_body',
  'Indiana',
  'PA',
  'Trout fishing good.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Rainbow Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'West Branch Susquehanna River',
  'Major river system with excellent fishing.',
  41.2,
  -77.2,
  ST_SetSRID(ST_MakePoint(-77.2, 41.2), 4326)::geography,
  'water_body',
  'Clinton',
  'PA',
  'Trout in upper sections.',
  ARRAY['Smallmouth Bass', 'Walleye', 'Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Sinnemahoning Creek',
  'Excellent trout stream.',
  41.5,
  -78,
  ST_SetSRID(ST_MakePoint(-78, 41.5), 4326)::geography,
  'water_body',
  'Cameron',
  'PA',
  'Spring stocking and wild trout.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'First Fork Sinnemahoning Creek',
  'Wild brook trout stream.',
  41.6,
  -77.9,
  ST_SetSRID(ST_MakePoint(-77.9, 41.6), 4326)::geography,
  'water_body',
  'Potter',
  'PA',
  'Wild brook trout.',
  ARRAY['Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Driftwood Branch',
  'Good trout stream.',
  41.4,
  -78.1,
  ST_SetSRID(ST_MakePoint(-78.1, 41.4), 4326)::geography,
  'water_body',
  'Cameron',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Bennett Branch',
  'Good trout stream.',
  41.4,
  -78.5,
  ST_SetSRID(ST_MakePoint(-78.5, 41.4), 4326)::geography,
  'water_body',
  'Elk',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Clarion River',
  'Major river with excellent smallmouth bass fishing.',
  41.3,
  -78.8,
  ST_SetSRID(ST_MakePoint(-78.8, 41.3), 4326)::geography,
  'water_body',
  'Elk',
  'PA',
  'Bass fishing excellent.',
  ARRAY['Smallmouth Bass', 'Walleye', 'Channel Catfish'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Toby Creek',
  'Good trout stream.',
  41.2,
  -79.2,
  ST_SetSRID(ST_MakePoint(-79.2, 41.2), 4326)::geography,
  'water_body',
  'Clarion',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Redbank Creek',
  'Good trout stream.',
  41.1,
  -79,
  ST_SetSRID(ST_MakePoint(-79, 41.1), 4326)::geography,
  'water_body',
  'Jefferson',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Mahoning Creek',
  'Good trout stream.',
  40.8,
  -79.2,
  ST_SetSRID(ST_MakePoint(-79.2, 40.8), 4326)::geography,
  'water_body',
  'Armstrong',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Crooked Creek',
  'Productive trout stream.',
  40.7,
  -79.4,
  ST_SetSRID(ST_MakePoint(-79.4, 40.7), 4326)::geography,
  'water_body',
  'Armstrong',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Cowanshannock Creek',
  'Good trout stream.',
  40.8,
  -79.3,
  ST_SetSRID(ST_MakePoint(-79.3, 40.8), 4326)::geography,
  'water_body',
  'Armstrong',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Sandy Lick Creek',
  'Good trout stream.',
  41,
  -78.9,
  ST_SetSRID(ST_MakePoint(-78.9, 41), 4326)::geography,
  'water_body',
  'Jefferson',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Little Mahoning Creek',
  'Good trout stream.',
  40.7,
  -79,
  ST_SetSRID(ST_MakePoint(-79, 40.7), 4326)::geography,
  'water_body',
  'Indiana',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Blacklick Creek',
  'Good trout stream.',
  40.6,
  -79.1,
  ST_SetSRID(ST_MakePoint(-79.1, 40.6), 4326)::geography,
  'water_body',
  'Indiana',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Two Lick Creek',
  'Good trout stream.',
  40.6,
  -79,
  ST_SetSRID(ST_MakePoint(-79, 40.6), 4326)::geography,
  'water_body',
  'Indiana',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Yellow Creek',
  'Good trout stream.',
  40.5,
  -79.1,
  ST_SetSRID(ST_MakePoint(-79.1, 40.5), 4326)::geography,
  'water_body',
  'Indiana',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Conemaugh River',
  'Good warm-water river with bass and some trout.',
  40.5,
  -79.2,
  ST_SetSRID(ST_MakePoint(-79.2, 40.5), 4326)::geography,
  'water_body',
  'Indiana',
  'PA',
  'Trout in upper sections.',
  ARRAY['Smallmouth Bass', 'Largemouth Bass', 'Brown Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Stonycreek River',
  'Excellent trout and bass river.',
  40.2,
  -78.9,
  ST_SetSRID(ST_MakePoint(-78.9, 40.2), 4326)::geography,
  'water_body',
  'Somerset',
  'PA',
  'Trout fishing excellent.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Laurel Hill Creek',
  'Excellent trout stream.',
  40,
  -79.2,
  ST_SetSRID(ST_MakePoint(-79.2, 40), 4326)::geography,
  'water_body',
  'Somerset',
  'PA',
  'Spring stocking and wild trout.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Casselman River',
  'Good trout river.',
  39.9,
  -79.1,
  ST_SetSRID(ST_MakePoint(-79.1, 39.9), 4326)::geography,
  'water_body',
  'Somerset',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Somerset Lake',
  'Reservoir with good bass and trout fishing.',
  40,
  -79,
  ST_SetSRID(ST_MakePoint(-79, 40), 4326)::geography,
  'water_body',
  'Somerset',
  'PA',
  'Trout fishing good.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Rainbow Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Quemahoning Reservoir',
  'Large reservoir with excellent fishing.',
  40.1,
  -79,
  ST_SetSRID(ST_MakePoint(-79, 40.1), 4326)::geography,
  'water_body',
  'Somerset',
  'PA',
  'Trout fishing good.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Rainbow Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Schuylkill River',
  'Major river system with diverse fishing.',
  40.7,
  -76.2,
  ST_SetSRID(ST_MakePoint(-76.2, 40.7), 4326)::geography,
  'water_body',
  'Schuylkill',
  'PA',
  'Trout in upper sections.',
  ARRAY['Smallmouth Bass', 'Walleye', 'Brown Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Little Schuylkill River',
  'Good trout river.',
  40.8,
  -76,
  ST_SetSRID(ST_MakePoint(-76, 40.8), 4326)::geography,
  'water_body',
  'Schuylkill',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Mahoning Creek',
  'Good trout stream.',
  40.85,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.85), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Nesquehoning Creek',
  'Good trout stream.',
  40.9,
  -75.8,
  ST_SetSRID(ST_MakePoint(-75.8, 40.9), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lehigh Canal',
  'Historic canal with good fishing.',
  40.6,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.6), 4326)::geography,
  'water_body',
  'Lehigh',
  'PA',
  'Trout fishing good.',
  ARRAY['Smallmouth Bass', 'Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Ontelaunee Creek',
  'Good trout stream.',
  40.5,
  -75.9,
  ST_SetSRID(ST_MakePoint(-75.9, 40.5), 4326)::geography,
  'water_body',
  'Berks',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Maiden Creek',
  'Good trout stream.',
  40.5,
  -75.8,
  ST_SetSRID(ST_MakePoint(-75.8, 40.5), 4326)::geography,
  'water_body',
  'Berks',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Schuylkill River',
  'Major river with bass and trout fishing.',
  40.3,
  -75.9,
  ST_SetSRID(ST_MakePoint(-75.9, 40.3), 4326)::geography,
  'water_body',
  'Berks',
  'PA',
  'Trout in upper sections.',
  ARRAY['Smallmouth Bass', 'Walleye', 'Brown Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Tulpehocken Creek',
  'Limestone-influenced stream with good trout fishing.',
  40.4,
  -76.1,
  ST_SetSRID(ST_MakePoint(-76.1, 40.4), 4326)::geography,
  'water_body',
  'Berks',
  'PA',
  'Spring stocking and hatches.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Manatawny Creek',
  'Good trout stream.',
  40.3,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.3), 4326)::geography,
  'water_body',
  'Berks',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Perkiomen Creek',
  'Good warm-water stream with trout in upper sections.',
  40.2,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.2), 4326)::geography,
  'water_body',
  'Montgomery',
  'PA',
  'Trout in upper sections.',
  ARRAY['Smallmouth Bass', 'Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Unami Creek',
  'Good trout stream.',
  40.3,
  -75.4,
  ST_SetSRID(ST_MakePoint(-75.4, 40.3), 4326)::geography,
  'water_body',
  'Montgomery',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Swamp Creek',
  'Good trout stream.',
  40.3,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.3), 4326)::geography,
  'water_body',
  'Montgomery',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Green Lane Reservoir',
  'Large reservoir with excellent fishing.',
  40.3,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.3), 4326)::geography,
  'water_body',
  'Montgomery',
  'PA',
  'Trout fishing good.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Rainbow Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Schuylkill River',
  'Major river with bass and trout fishing.',
  40.1,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.1), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Trout in upper sections.',
  ARRAY['Smallmouth Bass', 'Walleye', 'Brown Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Pickering Creek',
  'Good trout stream.',
  40.05,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.05), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Valley Creek',
  'Good trout stream.',
  40.1,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.1), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Birch Run',
  'Small but productive trout stream.',
  40,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'East Branch Brandywine Creek',
  'Good trout stream.',
  40.05,
  -75.8,
  ST_SetSRID(ST_MakePoint(-75.8, 40.05), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'West Branch Brandywine Creek',
  'Good trout stream.',
  40,
  -75.9,
  ST_SetSRID(ST_MakePoint(-75.9, 40), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Brandywine Creek',
  'Good warm-water stream with bass and trout.',
  39.95,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 39.95), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Trout in upper sections.',
  ARRAY['Smallmouth Bass', 'Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Octoraro Creek',
  'Good trout stream.',
  39.9,
  -76.2,
  ST_SetSRID(ST_MakePoint(-76.2, 39.9), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'White Clay Creek',
  'Good trout stream.',
  39.85,
  -75.8,
  ST_SetSRID(ST_MakePoint(-75.8, 39.85), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Red Clay Creek',
  'Good trout stream.',
  39.9,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 39.9), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Creek Road Pond',
  'Small pond with trout fishing.',
  40,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Rainbow Trout', 'Brown Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Marsh Creek Lake',
  'Popular reservoir with excellent bass and trout fishing.',
  40.1,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.1), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Trout fishing excellent.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Rainbow Trout', 'Brown Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Strasburg Pond',
  'Small pond with trout fishing.',
  40,
  -75.8,
  ST_SetSRID(ST_MakePoint(-75.8, 40), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Rainbow Trout', 'Brown Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Hibernia Park Pond',
  'Park pond with trout fishing.',
  40.05,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.05), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Rainbow Trout', 'Brown Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Mill Creek',
  'Good trout stream.',
  40.5,
  -79.9,
  ST_SetSRID(ST_MakePoint(-79.9, 40.5), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Girty Run',
  'Small but productive trout stream.',
  40.4,
  -79.8,
  ST_SetSRID(ST_MakePoint(-79.8, 40.4), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Bull Creek',
  'Good trout stream.',
  40.6,
  -79.9,
  ST_SetSRID(ST_MakePoint(-79.9, 40.6), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Pine Creek',
  'Good trout stream.',
  40.5,
  -79.7,
  ST_SetSRID(ST_MakePoint(-79.7, 40.5), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Turtle Creek',
  'Good trout stream.',
  40.4,
  -79.8,
  ST_SetSRID(ST_MakePoint(-79.8, 40.4), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Thompson Run',
  'Small but productive trout stream.',
  40.3,
  -79.9,
  ST_SetSRID(ST_MakePoint(-79.9, 40.3), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Saw Mill Run',
  'Good trout stream.',
  40.4,
  -80,
  ST_SetSRID(ST_MakePoint(-80, 40.4), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Nine Mile Run',
  'Small urban creek with trout.',
  40.45,
  -79.95,
  ST_SetSRID(ST_MakePoint(-79.95, 40.45), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Squaw Run',
  'Good trout stream.',
  40.5,
  -79.95,
  ST_SetSRID(ST_MakePoint(-79.95, 40.5), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Pine Creek',
  'Good trout stream.',
  40.2,
  -80.1,
  ST_SetSRID(ST_MakePoint(-80.1, 40.2), 4326)::geography,
  'water_body',
  'Washington',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'McDonald Creek',
  'Good trout stream.',
  40.3,
  -80.2,
  ST_SetSRID(ST_MakePoint(-80.2, 40.3), 4326)::geography,
  'water_body',
  'Washington',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Cross Creek',
  'Good trout stream.',
  40.25,
  -80.3,
  ST_SetSRID(ST_MakePoint(-80.3, 40.25), 4326)::geography,
  'water_body',
  'Washington',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Wheeling Creek',
  'Good trout stream.',
  40.2,
  -80.4,
  ST_SetSRID(ST_MakePoint(-80.4, 40.2), 4326)::geography,
  'water_body',
  'Washington',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Buffalo Creek',
  'Good trout stream.',
  40.15,
  -80.2,
  ST_SetSRID(ST_MakePoint(-80.2, 40.15), 4326)::geography,
  'water_body',
  'Washington',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Little Chartiers Creek',
  'Good trout stream.',
  40.3,
  -80.1,
  ST_SetSRID(ST_MakePoint(-80.1, 40.3), 4326)::geography,
  'water_body',
  'Washington',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'North Park Lake',
  'Popular county park lake.',
  40.6,
  -80,
  ST_SetSRID(ST_MakePoint(-80, 40.6), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Trout fishing good.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Rainbow Trout', 'Brown Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Boyce Park Lake',
  'Small urban lake.',
  40.5,
  -79.7,
  ST_SetSRID(ST_MakePoint(-79.7, 40.5), 4326)::geography,
  'water_body',
  'Allegheny',
  'PA',
  'Spring stocking.',
  ARRAY['Rainbow Trout', 'Brown Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Raccoon Creek Lake',
  'Reservoir with good fishing.',
  40.6,
  -80.4,
  ST_SetSRID(ST_MakePoint(-80.4, 40.6), 4326)::geography,
  'water_body',
  'Beaver',
  'PA',
  'Trout fishing good.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Muskellunge', 'Rainbow Trout'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lake Arthur (Moraine State Park)',
  'Premier multi-species lake.',
  40.9,
  -80.1,
  ST_SetSRID(ST_MakePoint(-80.1, 40.9), 4326)::geography,
  'water_body',
  'Butler',
  'PA',
  'Excellent spring fishing.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Muskellunge', 'Crappie'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Young''s Run',
  'Good trout stream.',
  40.85,
  -77.85,
  ST_SetSRID(ST_MakePoint(-77.85, 40.85), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Logan Branch',
  'Good trout stream.',
  40.8,
  -77.75,
  ST_SetSRID(ST_MakePoint(-77.75, 40.8), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Bald Eagle Creek (Upper)',
  'Upper section with excellent trout fishing.',
  40.95,
  -77.85,
  ST_SetSRID(ST_MakePoint(-77.85, 40.95), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Moshannon Creek (Upper)',
  'Upper section with good trout fishing.',
  41.05,
  -78.1,
  ST_SetSRID(ST_MakePoint(-78.1, 41.05), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Black Moshannon Creek',
  'Good trout stream.',
  41,
  -78,
  ST_SetSRID(ST_MakePoint(-78, 41), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Mosquito Creek',
  'Good trout stream.',
  41.3,
  -77.8,
  ST_SetSRID(ST_MakePoint(-77.8, 41.3), 4326)::geography,
  'water_body',
  'Clinton',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Young Woman''s Creek',
  'Wild brook trout stream.',
  41.3,
  -77.7,
  ST_SetSRID(ST_MakePoint(-77.7, 41.3), 4326)::geography,
  'water_body',
  'Clinton',
  'PA',
  'Wild brook trout.',
  ARRAY['Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Cedar Run',
  'Wild brook trout stream.',
  41.5,
  -77.4,
  ST_SetSRID(ST_MakePoint(-77.4, 41.5), 4326)::geography,
  'water_body',
  'Lycoming',
  'PA',
  'Wild brook trout.',
  ARRAY['Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lycoming Creek (Upper)',
  'Upper section with good trout fishing.',
  41.4,
  -77.2,
  ST_SetSRID(ST_MakePoint(-77.2, 41.4), 4326)::geography,
  'water_body',
  'Lycoming',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Muncy Creek (Upper)',
  'Upper section with good trout fishing.',
  41.3,
  -76.9,
  ST_SetSRID(ST_MakePoint(-76.9, 41.3), 4326)::geography,
  'water_body',
  'Lycoming',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Loyalsock Creek (Upper)',
  'Upper section with wild trout.',
  41.5,
  -76.8,
  ST_SetSRID(ST_MakePoint(-76.8, 41.5), 4326)::geography,
  'water_body',
  'Sullivan',
  'PA',
  'Wild trout.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Muncy Creek (Lower)',
  'Lower section with good trout fishing.',
  41.2,
  -76.8,
  ST_SetSRID(ST_MakePoint(-76.8, 41.2), 4326)::geography,
  'water_body',
  'Lycoming',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'White Deer Creek (Upper)',
  'Upper section with good trout fishing.',
  41.1,
  -77.1,
  ST_SetSRID(ST_MakePoint(-77.1, 41.1), 4326)::geography,
  'water_body',
  'Union',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Buffalo Run (Upper)',
  'Upper section with good trout fishing.',
  40.85,
  -77.95,
  ST_SetSRID(ST_MakePoint(-77.95, 40.85), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Sugar Creek (Upper)',
  'Upper section with good trout fishing.',
  40.85,
  -77.85,
  ST_SetSRID(ST_MakePoint(-77.85, 40.85), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Sinking Creek (Upper)',
  'Upper section with good trout fishing.',
  40.75,
  -77.75,
  ST_SetSRID(ST_MakePoint(-77.75, 40.75), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Fishing Creek (Upper)',
  'Upper section with excellent trout fishing.',
  40.85,
  -77.65,
  ST_SetSRID(ST_MakePoint(-77.65, 40.85), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Raystown Branch (Upper)',
  'Upper section with good trout fishing.',
  40.5,
  -78.1,
  ST_SetSRID(ST_MakePoint(-78.1, 40.5), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Aughwick Creek (Upper)',
  'Upper section with good trout fishing.',
  40.4,
  -78,
  ST_SetSRID(ST_MakePoint(-78, 40.4), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Standing Stone Creek (Upper)',
  'Upper section with good trout fishing.',
  40.5,
  -78,
  ST_SetSRID(ST_MakePoint(-78, 40.5), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Kishacoquillas Creek (Upper)',
  'Upper section with good trout fishing.',
  40.7,
  -77.7,
  ST_SetSRID(ST_MakePoint(-77.7, 40.7), 4326)::geography,
  'water_body',
  'Mifflin',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Tuscarora Creek (Upper)',
  'Upper section with good trout fishing.',
  40.6,
  -77.6,
  ST_SetSRID(ST_MakePoint(-77.6, 40.6), 4326)::geography,
  'water_body',
  'Juniata',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lost Creek (Upper)',
  'Upper section with good trout fishing.',
  40.6,
  -77.5,
  ST_SetSRID(ST_MakePoint(-77.5, 40.6), 4326)::geography,
  'water_body',
  'Juniata',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Cocolamus Creek (Upper)',
  'Upper section with good trout fishing.',
  40.5,
  -77.4,
  ST_SetSRID(ST_MakePoint(-77.4, 40.5), 4326)::geography,
  'water_body',
  'Juniata',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Raystown Lake',
  'PA largest lake with diverse fishing.',
  40.3,
  -78,
  ST_SetSRID(ST_MakePoint(-78, 40.3), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  'Excellent spring fishing.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Striped Bass', 'Walleye', 'Muskellunge'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lehigh River (Upper)',
  'Upper section with excellent trout fishing.',
  40.9,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.9), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lehigh River (Middle)',
  'Middle section with trout and bass.',
  40.7,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.7), 4326)::geography,
  'water_body',
  'Lehigh',
  'PA',
  'Trout in upper sections.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Bushkill Creek (Upper)',
  'Upper section with good trout fishing.',
  40.8,
  -75.3,
  ST_SetSRID(ST_MakePoint(-75.3, 40.8), 4326)::geography,
  'water_body',
  'Northampton',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Monocacy Creek (Upper)',
  'Upper section with good trout fishing.',
  40.75,
  -75.4,
  ST_SetSRID(ST_MakePoint(-75.4, 40.75), 4326)::geography,
  'water_body',
  'Northampton',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Hokendauqua Creek (Upper)',
  'Upper section with good trout fishing.',
  40.75,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.75), 4326)::geography,
  'water_body',
  'Northampton',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Catasauqua Creek (Upper)',
  'Upper section with good trout fishing.',
  40.7,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.7), 4326)::geography,
  'water_body',
  'Lehigh',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Little Lehigh Creek (Upper)',
  'Upper section with excellent trout fishing.',
  40.65,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.65), 4326)::geography,
  'water_body',
  'Lehigh',
  'PA',
  'Spring stocking and hatches.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Jordan Creek (Upper)',
  'Upper section with good trout fishing.',
  40.65,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.65), 4326)::geography,
  'water_body',
  'Lehigh',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Saucon Creek (Upper)',
  'Upper section with good trout fishing.',
  40.65,
  -75.4,
  ST_SetSRID(ST_MakePoint(-75.4, 40.65), 4326)::geography,
  'water_body',
  'Northampton',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Tobyhanna Creek (Upper)',
  'Upper section with good trout fishing.',
  41.25,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 41.25), 4326)::geography,
  'water_body',
  'Monroe',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Brodhead Creek (Upper)',
  'Upper section with good trout fishing.',
  41.05,
  -75.3,
  ST_SetSRID(ST_MakePoint(-75.3, 41.05), 4326)::geography,
  'water_body',
  'Monroe',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lehighton Creek (Upper)',
  'Upper section with good trout fishing.',
  40.85,
  -75.8,
  ST_SetSRID(ST_MakePoint(-75.8, 40.85), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Mahoning Creek (Upper)',
  'Upper section with good trout fishing.',
  40.9,
  -75.8,
  ST_SetSRID(ST_MakePoint(-75.8, 40.9), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Aquashicola Creek (Upper)',
  'Upper section with good trout fishing.',
  40.85,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.85), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Pohopoco Creek (Upper)',
  'Upper section with good trout fishing.',
  40.95,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.95), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Tunkhannock Creek (Upper)',
  'Upper section with good trout fishing.',
  41.05,
  -75.4,
  ST_SetSRID(ST_MakePoint(-75.4, 41.05), 4326)::geography,
  'water_body',
  'Monroe',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'McMichaels Creek (Upper)',
  'Upper section with good trout fishing.',
  41.15,
  -75.4,
  ST_SetSRID(ST_MakePoint(-75.4, 41.15), 4326)::geography,
  'water_body',
  'Monroe',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Appenzell Creek (Upper)',
  'Upper section with good trout fishing.',
  40.75,
  -75.4,
  ST_SetSRID(ST_MakePoint(-75.4, 40.75), 4326)::geography,
  'water_body',
  'Northampton',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Nesquehoning Creek (Upper)',
  'Upper section with good trout fishing.',
  40.95,
  -75.9,
  ST_SetSRID(ST_MakePoint(-75.9, 40.95), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lehigh Canal (Upper)',
  'Upper section with good trout fishing.',
  40.9,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.9), 4326)::geography,
  'water_body',
  'Carbon',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Ontelaunee Creek (Upper)',
  'Upper section with good trout fishing.',
  40.55,
  -76,
  ST_SetSRID(ST_MakePoint(-76, 40.55), 4326)::geography,
  'water_body',
  'Berks',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Maiden Creek (Upper)',
  'Upper section with good trout fishing.',
  40.55,
  -75.9,
  ST_SetSRID(ST_MakePoint(-75.9, 40.55), 4326)::geography,
  'water_body',
  'Berks',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Tulpehocken Creek (Upper)',
  'Upper section with good trout fishing.',
  40.45,
  -76.2,
  ST_SetSRID(ST_MakePoint(-76.2, 40.45), 4326)::geography,
  'water_body',
  'Berks',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Manatawny Creek (Upper)',
  'Upper section with good trout fishing.',
  40.35,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.35), 4326)::geography,
  'water_body',
  'Berks',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Perkiomen Creek (Upper)',
  'Upper section with good trout fishing.',
  40.25,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.25), 4326)::geography,
  'water_body',
  'Montgomery',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Unami Creek (Upper)',
  'Upper section with good trout fishing.',
  40.35,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.35), 4326)::geography,
  'water_body',
  'Montgomery',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Swamp Creek (Upper)',
  'Upper section with good trout fishing.',
  40.35,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.35), 4326)::geography,
  'water_body',
  'Montgomery',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'French Creek (Upper)',
  'Upper section with excellent trout fishing.',
  40.15,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.15), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'French Creek (Middle)',
  'Middle section with trout and bass.',
  40.1,
  -75.65,
  ST_SetSRID(ST_MakePoint(-75.65, 40.1), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Trout in upper sections.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Pickering Creek (Upper)',
  'Upper section with good trout fishing.',
  40.1,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.1), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Valley Creek (Upper)',
  'Upper section with good trout fishing.',
  40.15,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.15), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Birch Run (Upper)',
  'Upper section with good trout fishing.',
  40.05,
  -75.8,
  ST_SetSRID(ST_MakePoint(-75.8, 40.05), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'East Branch Brandywine Creek (Upper)',
  'Upper section with good trout fishing.',
  40.1,
  -75.9,
  ST_SetSRID(ST_MakePoint(-75.9, 40.1), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'West Branch Brandywine Creek (Upper)',
  'Upper section with good trout fishing.',
  40.05,
  -76,
  ST_SetSRID(ST_MakePoint(-76, 40.05), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Brandywine Creek (Upper)',
  'Upper section with good trout fishing.',
  40,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Octoraro Creek (Upper)',
  'Upper section with good trout fishing.',
  39.95,
  -76.3,
  ST_SetSRID(ST_MakePoint(-76.3, 39.95), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'White Clay Creek (Upper)',
  'Upper section with good trout fishing.',
  39.9,
  -75.9,
  ST_SetSRID(ST_MakePoint(-75.9, 39.9), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Red Clay Creek (Upper)',
  'Upper section with good trout fishing.',
  39.95,
  -75.8,
  ST_SetSRID(ST_MakePoint(-75.8, 39.95), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Valley Forge Creek (Upper)',
  'Upper section with good trout fishing.',
  40.15,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.15), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Crabtree Creek (Upper)',
  'Upper section with good trout fishing.',
  40.1,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 40.1), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Schuylkill River (Upper)',
  'Upper section with good trout fishing.',
  40.15,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.15), 4326)::geography,
  'water_body',
  'Chester',
  'PA',
  'Spring stocking.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;