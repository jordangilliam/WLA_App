
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
  'Yellow Breeches Creek',
  'Premier limestone spring creek. One of PA best trout streams with wild and stocked fish.',
  40.2342,
  -77.0264,
  ST_SetSRID(ST_MakePoint(-77.0264, 40.2342), 4326)::geography,
  'water_body',
  'Cumberland',
  'PA',
  'Hendrickson hatch in late April. Excellent spring fishing.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Big Spring Creek',
  'Small but productive limestone spring creek. Trophy trout section.',
  40.15,
  -77.2,
  ST_SetSRID(ST_MakePoint(-77.2, 40.15), 4326)::geography,
  'water_body',
  'Cumberland',
  'PA',
  'Early season Hendrickson hatch.',
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
  'Tulpehocken Creek',
  'Excellent trout stream with cold water releases from Blue Marsh Dam.',
  40.4,
  -76.05,
  ST_SetSRID(ST_MakePoint(-76.05, 40.4), 4326)::geography,
  'water_body',
  'Berks',
  'PA',
  'Year-round fishing due to cold water releases.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
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
  'Lake Erie - Presque Isle Bay',
  'World-class fishing for walleye and perch with protected bay habitat.',
  42.1275,
  -80.0851,
  ST_SetSRID(ST_MakePoint(-80.0851, 42.1275), 4326)::geography,
  'water_body',
  'Erie',
  'PA',
  'Walleye spawn in April. Excellent spring fishing.',
  ARRAY['Smallmouth Bass', 'Walleye', 'Yellow Perch', 'Northern Pike', 'Muskellunge', 'Channel Catfish', 'Steelhead'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lake Wallenpaupack',
  'Large reservoir with rocky shorelines, submerged timber, and deep basins.',
  41.35,
  -75.1833,
  ST_SetSRID(ST_MakePoint(-75.1833, 41.35), 4326)::geography,
  'water_body',
  'Pike/Wayne',
  'PA',
  'Bass spawn in May. Excellent spring fishing.',
  ARRAY['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Yellow Perch', 'Crappie', 'Bluegill', 'Channel Catfish'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Letort Spring Run',
  'Famous limestone spring creek. Challenging fishing for selective trout.',
  40.2,
  -77.2,
  ST_SetSRID(ST_MakePoint(-77.2, 40.2), 4326)::geography,
  'water_body',
  'Cumberland',
  'PA',
  'Excellent spring hatches. Very selective trout.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Falling Spring Branch',
  'Small but productive limestone spring creek.',
  40.15,
  -77.25,
  ST_SetSRID(ST_MakePoint(-77.25, 40.15), 4326)::geography,
  'water_body',
  'Cumberland',
  'PA',
  'Spring hatches excellent.',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Kettle Creek',
  'Remote wilderness stream with native and stocked trout.',
  41.35,
  -77.8,
  ST_SetSRID(ST_MakePoint(-77.8, 41.35), 4326)::geography,
  'water_body',
  'Clinton',
  'PA',
  'Brook trout in headwaters. Spring stocking.',
  ARRAY['Brook Trout', 'Brown Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Slate Run',
  'Wild brook trout stream in remote area.',
  41.4,
  -77.5,
  ST_SetSRID(ST_MakePoint(-77.5, 41.4), 4326)::geography,
  'water_body',
  'Lycoming',
  'PA',
  'Wild brook trout fishing.',
  ARRAY['Brook Trout'],
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
  'Delaware River',
  'Major river system with excellent trout and bass fishing.',
  41.3,
  -74.8,
  ST_SetSRID(ST_MakePoint(-74.8, 41.3), 4326)::geography,
  'water_body',
  'Pike',
  'PA',
  'Trout fishing in upper sections.',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass', 'Walleye'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Promised Land Lake',
  'Popular Pocono lake with excellent bass and trout fishing.',
  41.3,
  -75.2,
  ST_SetSRID(ST_MakePoint(-75.2, 41.3), 4326)::geography,
  'water_body',
  'Pike',
  'PA',
  'Trout fishing excellent in spring.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Rainbow Trout', 'Brown Trout', 'Yellow Perch'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Blue Marsh Lake',
  'Large federal reservoir with diverse fishing opportunities.',
  40.3758,
  -75.9244,
  ST_SetSRID(ST_MakePoint(-75.9244, 40.3758), 4326)::geography,
  'water_body',
  'Berks',
  'PA',
  'Excellent spring fishing.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Striped Bass', 'Muskellunge', 'Walleye', 'Crappie'],
  ARRAY['Lake']
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
  'Lake Nockamixon',
  'Large reservoir near Philadelphia with diverse fishing.',
  40.45,
  -75.2,
  ST_SetSRID(ST_MakePoint(-75.2, 40.45), 4326)::geography,
  'water_body',
  'Bucks',
  'PA',
  'Spring fishing excellent.',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Crappie', 'Channel Catfish'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'French Creek',
  'Excellent warm-water stream with smallmouth bass and trout.',
  40.1,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.1), 4326)::geography,
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
  'Bald Eagle Creek',
  'Excellent freestone stream with good trout fishing.',
  40.9,
  -77.8,
  ST_SetSRID(ST_MakePoint(-77.8, 40.9), 4326)::geography,
  'water_body',
  'Centre',
  'PA',
  '',
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
  '',
  ARRAY['Brown Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Clarion River',
  'Major river with excellent smallmouth bass fishing.',
  41.2,
  -79.2,
  ST_SetSRID(ST_MakePoint(-79.2, 41.2), 4326)::geography,
  'water_body',
  'Clarion',
  'PA',
  '',
  ARRAY['Smallmouth Bass', 'Walleye', 'Channel Catfish'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Youghiogheny River',
  'Scenic river with excellent fishing.',
  40.1,
  -79.5,
  ST_SetSRID(ST_MakePoint(-79.5, 40.1), 4326)::geography,
  'water_body',
  'Fayette',
  'PA',
  '',
  ARRAY['Smallmouth Bass', 'Walleye', 'Brown Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lehigh River',
  'Major river with trout and bass fishing.',
  40.6,
  -75.5,
  ST_SetSRID(ST_MakePoint(-75.5, 40.6), 4326)::geography,
  'water_body',
  'Lehigh',
  'PA',
  '',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Schuylkill River',
  'Major river system with diverse fishing.',
  40.3,
  -76,
  ST_SetSRID(ST_MakePoint(-76, 40.3), 4326)::geography,
  'water_body',
  'Schuylkill',
  'PA',
  '',
  ARRAY['Smallmouth Bass', 'Walleye', 'Brown Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Pymatuning Lake',
  'Massive reservoir on PA/OH border. Excellent fishing.',
  41.6,
  -80.5,
  ST_SetSRID(ST_MakePoint(-80.5, 41.6), 4326)::geography,
  'water_body',
  'Crawford',
  'PA',
  '',
  ARRAY['Walleye', 'Muskellunge', 'Largemouth Bass', 'Smallmouth Bass', 'Crappie'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Shenango River Lake',
  'Large reservoir with excellent fishing.',
  41.3,
  -80.4,
  ST_SetSRID(ST_MakePoint(-80.4, 41.3), 4326)::geography,
  'water_body',
  'Mercer',
  'PA',
  '',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Crappie'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Swatara Creek',
  'Excellent warm-water stream with bass and trout.',
  40.3,
  -76.4,
  ST_SetSRID(ST_MakePoint(-76.4, 40.3), 4326)::geography,
  'water_body',
  'Lebanon',
  'PA',
  '',
  ARRAY['Smallmouth Bass', 'Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Conodoguinet Creek',
  'Long creek with good trout and bass fishing.',
  40.2789,
  -77.2147,
  ST_SetSRID(ST_MakePoint(-77.2147, 40.2789), 4326)::geography,
  'water_body',
  'Cumberland',
  'PA',
  '',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
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
  '',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Pine Creek',
  'Scenic canyon stream with excellent fishing.',
  41.6,
  -77.4,
  ST_SetSRID(ST_MakePoint(-77.4, 41.6), 4326)::geography,
  'water_body',
  'Tioga',
  'PA',
  '',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Cowanesque Lake',
  'Northern PA reservoir with excellent fishing.',
  41.9,
  -77.2,
  ST_SetSRID(ST_MakePoint(-77.2, 41.9), 4326)::geography,
  'water_body',
  'Tioga',
  'PA',
  '',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Walleye', 'Crappie'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Raystown Lake',
  'Large reservoir with diverse fishing opportunities.',
  40.3,
  -78,
  ST_SetSRID(ST_MakePoint(-78, 40.3), 4326)::geography,
  'water_body',
  'Huntingdon',
  'PA',
  '',
  ARRAY['Largemouth Bass', 'Smallmouth Bass', 'Striped Bass', 'Walleye', 'Muskellunge'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Mahoning Creek',
  'Good freestone stream with trout and bass.',
  40.8,
  -79.2,
  ST_SetSRID(ST_MakePoint(-79.2, 40.8), 4326)::geography,
  'water_body',
  'Armstrong',
  'PA',
  '',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Crooked Creek',
  'Productive freestone stream.',
  40.7,
  -79.4,
  ST_SetSRID(ST_MakePoint(-79.4, 40.7), 4326)::geography,
  'water_body',
  'Armstrong',
  'PA',
  '',
  ARRAY['Brown Trout', 'Rainbow Trout'],
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
  '',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Manatawny Creek',
  'Good trout stream in Berks County.',
  40.3,
  -75.6,
  ST_SetSRID(ST_MakePoint(-75.6, 40.3), 4326)::geography,
  'water_body',
  'Berks',
  'PA',
  '',
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
  '',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
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
  '',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Saw Creek',
  'Small but productive Pocono stream.',
  41.3,
  -75,
  ST_SetSRID(ST_MakePoint(-75, 41.3), 4326)::geography,
  'water_body',
  'Pike',
  'PA',
  '',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Brook Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Wissahickon Creek',
  'Urban stream with trout and bass fishing.',
  40.05,
  -75.2,
  ST_SetSRID(ST_MakePoint(-75.2, 40.05), 4326)::geography,
  'water_body',
  'Philadelphia',
  'PA',
  '',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
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
  '',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Conestoga River',
  'Good warm-water river with bass fishing.',
  40.05,
  -76.3,
  ST_SetSRID(ST_MakePoint(-76.3, 40.05), 4326)::geography,
  'water_body',
  'Lancaster',
  'PA',
  '',
  ARRAY['Smallmouth Bass', 'Largemouth Bass', 'Brown Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Octoraro Creek',
  'Good trout stream in Lancaster County.',
  39.9,
  -76.2,
  ST_SetSRID(ST_MakePoint(-76.2, 39.9), 4326)::geography,
  'water_body',
  'Lancaster',
  'PA',
  '',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Codorus Creek',
  'Good trout stream with bass in lower sections.',
  39.95,
  -76.7,
  ST_SetSRID(ST_MakePoint(-76.7, 39.95), 4326)::geography,
  'water_body',
  'York',
  'PA',
  '',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Catawissa Creek',
  'Good freestone stream with trout.',
  40.9,
  -76.2,
  ST_SetSRID(ST_MakePoint(-76.2, 40.9), 4326)::geography,
  'water_body',
  'Schuylkill',
  'PA',
  '',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Tunkhannock Creek',
  'Good trout stream in northeast PA.',
  41.5,
  -75.9,
  ST_SetSRID(ST_MakePoint(-75.9, 41.5), 4326)::geography,
  'water_body',
  'Wyoming',
  'PA',
  '',
  ARRAY['Brown Trout', 'Rainbow Trout'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;

INSERT INTO field_sites (name, description, latitude, longitude, location, site_type, city, state, ecological_notes, species_commonly_found, habitat_types)
VALUES (
  'Lackawanna River',
  'Urban river with improving trout fishing.',
  41.4,
  -75.7,
  ST_SetSRID(ST_MakePoint(-75.7, 41.4), 4326)::geography,
  'water_body',
  'Lackawanna',
  'PA',
  '',
  ARRAY['Brown Trout', 'Rainbow Trout', 'Smallmouth Bass'],
  ARRAY['Stream']
)
ON CONFLICT DO NOTHING;