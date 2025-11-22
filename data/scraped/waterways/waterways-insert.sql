
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
  'Excellent Hendrickson and Sulphur hatches. Spring stocking in March-April. Trico hatches in early morning. Water stays cool year-round.'.trim(),
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
  'Hendrickson hatch in late April. Excellent spring fishing. '.trim(),
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
  'Early season Hendrickson hatch. '.trim(),
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
  'Grannom hatch in mid-April. March Brown in late March. Isonychia hatch in June. Excellent dry fly fishing.'.trim(),
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
  'Spring stocking and hatches. Good bass fishing in lower sections.'.trim(),
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
  'Brook trout in headwaters. Spring stocking. Bass fishing in lower sections.'.trim(),
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
  'Year-round fishing due to cold water releases. Stays cool even in summer. Excellent fishing.'.trim(),
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
  'Excellent bass fishing. Walleye spawn in April. Deep water fishing for bass and walleye. Topwater action.'.trim(),
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
  'Walleye spawn in April. Excellent spring fishing. Perch fishing peaks. Smallmouth bass active.'.trim(),
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
  'Bass spawn in May. Excellent spring fishing. Deep water fishing. Topwater action early and late.'.trim(),
  ARRAY['Smallmouth Bass', 'Largemouth Bass', 'Walleye', 'Yellow Perch', 'Crappie', 'Bluegill', 'Channel Catfish'],
  ARRAY['Lake']
)
ON CONFLICT DO NOTHING;