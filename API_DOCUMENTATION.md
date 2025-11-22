# API Documentation

Complete API reference for WildPraxis Conservation Education Platform.

## Base URL

All API endpoints are prefixed with `/api`.

## Authentication

Most endpoints require authentication via NextAuth.js session cookies. Include session cookie in requests:

```
Cookie: next-auth.session-token=...
```

## Response Format

All endpoints return JSON with the following structure:

**Success Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 0,
  "message": "Optional message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Fly Fishing API Endpoints

### GET /api/waterways/hatches

Returns macroinvertebrate hatch data for waterways.

**Query Parameters:**
- `waterwayId` (optional) - Filter by waterway UUID
- `month` (optional) - Filter by peak month (e.g., "April", "May")
- `waterType` (optional) - Filter by water type: `limestone`, `freestone`, `spring-fed`, `tailwater`

**Example Request:**
```
GET /api/waterways/hatches?waterwayId=123&month=April
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "field_site_id": "uuid",
      "hatch_id": "uuid",
      "intensity": "heavy",
      "notes": "Primary hatch for this water",
      "hatch": {
        "id": "uuid",
        "species": "Ephemerella subvaria",
        "common_name": "Hendrickson",
        "hatch_start_month": "April",
        "hatch_end_month": "May",
        "peak_month": "April",
        "time_of_day": "afternoon",
        "water_temp_min_f": 48,
        "water_temp_optimal_f": 52,
        "water_temp_max_f": 56,
        "water_types": ["limestone", "spring-fed"],
        "hook_size": "#12-#14",
        "color_description": "Dark brown body, gray wings"
      },
      "waterway": {
        "id": "uuid",
        "name": "Spring Creek",
        "site_type": "water_body"
      }
    }
  ],
  "count": 1
}
```

---

### GET /api/experts/techniques

Returns expert fly fishing techniques.

**Query Parameters:**
- `expertId` (optional) - Filter by expert UUID
- `expertName` (optional) - Filter by expert name (e.g., "Joe Humphreys", "George Daniel")
- `difficulty` (optional) - Filter by difficulty: `beginner`, `intermediate`, `advanced`
- `waterType` (optional) - Filter by water type: `limestone`, `freestone`, `spring-fed`, `tailwater`
- `season` (optional) - Filter by season: `spring`, `summer`, `fall`, `winter`

**Example Request:**
```
GET /api/experts/techniques?expertName=Joe Humphreys&difficulty=intermediate
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "expert_id": "uuid",
      "name": "High-Stick Nymphing",
      "description": "Classic technique for fishing nymphs in pocket water and runs. Keep line off the water, use short drifts.",
      "water_types": ["freestone", "limestone"],
      "best_seasons": ["spring", "fall", "winter"],
      "difficulty": "intermediate",
      "video_url": null,
      "expert": {
        "id": "uuid",
        "name": "Joe Humphreys",
        "type": "expert",
        "location": "State College, PA"
      }
    }
  ],
  "count": 1
}
```

---

### GET /api/experts/patterns

Returns expert fly fishing patterns.

**Query Parameters:**
- `expertId` (optional) - Filter by expert UUID
- `expertName` (optional) - Filter by expert name (e.g., "Joe Humphreys", "George Daniel")
- `patternType` (optional) - Filter by pattern type: `dry-fly`, `nymph`, `streamer`, `wet-fly`, `terrestrial`
- `season` (optional) - Filter by season: `spring`, `summer`, `fall`, `winter`

**Example Request:**
```
GET /api/experts/patterns?expertName=George Daniel&patternType=nymph
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "expert_id": "uuid",
      "name": "Perdigon",
      "pattern_type": "nymph",
      "description": "Competition-style nymph pattern. Sinks fast, highly visible.",
      "target_species": ["Brown Trout", "Rainbow Trout"],
      "best_seasons": ["spring", "summer", "fall", "winter"],
      "hook_size": "#14-#18",
      "materials": ["Tungsten bead", "Epoxy", "Flash"],
      "expert": {
        "id": "uuid",
        "name": "George Daniel",
        "type": "expert",
        "location": "State College, PA"
      }
    }
  ],
  "count": 1
}
```

---

### GET /api/shops/nearby

Finds nearby fly fishing shops.

**Query Parameters:**
- `lat` (required) - Latitude
- `lng` (required) - Longitude
- `radius` (optional) - Search radius in kilometers (default: 50)
- `region` (optional) - Filter by region
- `hasGuides` (optional) - Filter shops with guides (`true`/`false`)
- `hasClasses` (optional) - Filter shops with classes (`true`/`false`)

**Example Request:**
```
GET /api/shops/nearby?lat=40.7981&lng=-77.8600&radius=25&hasGuides=true
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "TCO Fly Shop",
      "location": "State College, PA",
      "region": "Central",
      "address": "2101 E College Ave, State College, PA 16801",
      "phone": "(814) 234-4189",
      "website": "https://www.tcoflyfishing.com",
      "services": ["Fly Fishing Gear", "Guided Trips", "Classes", "Fly Tying", "Custom Rods"],
      "has_guides": true,
      "has_fly_tying": true,
      "has_classes": true,
      "latitude": 40.7981,
      "longitude": -77.8600,
      "distance": 0.5
    }
  ],
  "count": 1
}
```

---

### GET /api/shops/all

Returns all PA fly fishing shops.

**Query Parameters:**
- `region` (optional) - Filter by region
- `county` (optional) - Filter by county
- `hasGuides` (optional) - Filter shops with guides (`true`/`false`)
- `hasClasses` (optional) - Filter shops with classes (`true`/`false`)
- `hasFlyTying` (optional) - Filter shops with fly tying (`true`/`false`)

**Example Request:**
```
GET /api/shops/all?region=Central&hasGuides=true
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "TCO Fly Shop",
      "location": "State College, PA",
      "region": "Central",
      "county": "Centre",
      "address": "2101 E College Ave, State College, PA 16801",
      "phone": "(814) 234-4189",
      "website": "https://www.tcoflyfishing.com",
      "services": ["Fly Fishing Gear", "Guided Trips", "Classes", "Fly Tying", "Custom Rods"],
      "has_guides": true,
      "has_fly_tying": true,
      "has_classes": true,
      "latitude": 40.7981,
      "longitude": -77.8600
    }
  ],
  "count": 60
}
```

---

## PFBC Data API Endpoints

### GET /api/pfbc/mapping-layers

Returns PFBC mapping layer data (trout streams, bass waters, species designations).

**Query Parameters:**
- `layerType` (optional) - Filter by layer type:
  - `class-a` - Class A trout streams
  - `wild-trout` - Wild trout streams
  - `delayed-harvest` - Delayed harvest streams
  - `trophy-trout` - Trophy trout streams
  - `bass` - Best bass waters
  - `other-species` - Other species waters
- `region` (optional) - Filter by region
- `county` (optional) - Filter by county
- `species` (optional) - Filter by species name

**Example Request:**
```
GET /api/pfbc/mapping-layers?layerType=class-a&region=Central
```

**Example Response:**
```json
{
  "success": true,
  "layerType": "class-a",
  "data": [
    {
      "id": "uuid",
      "name": "Spring Creek",
      "classification": "Class A",
      "county": "Centre",
      "region": "Central",
      "latitude": 40.7981,
      "longitude": -77.8600,
      "section": "Fisherman's Paradise",
      "species": ["Brown Trout", "Rainbow Trout"],
      "notes": "Premier Class A wild trout stream"
    }
  ],
  "count": 1
}
```

---

### GET /api/pfbc/stocking

Returns PFBC stocking schedules.

**Query Parameters:**
- `waterwayId` (optional) - Filter by waterway UUID
- `waterwayName` (optional) - Filter by waterway name
- `county` (optional) - Filter by county
- `region` (optional) - Filter by region
- `species` (optional) - Filter by species
- `startDate` (optional) - Filter by start date (YYYY-MM-DD)
- `endDate` (optional) - Filter by end date (YYYY-MM-DD)

**Example Request:**
```
GET /api/pfbc/stocking?waterwayName=Spring Creek&species=Rainbow Trout
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "waterwayId": "uuid",
      "waterwayName": "Spring Creek",
      "county": "Centre",
      "region": "Central",
      "species": "Rainbow Trout",
      "stockingDate": "2025-03-15",
      "quantity": 2000,
      "sizeClass": "Adult",
      "averageLength": 10.5,
      "coordinates": {
        "latitude": 40.7981,
        "longitude": -77.8600
      },
      "notes": "Opening Day stocking"
    }
  ],
  "count": 1,
  "note": "This is sample data. In production, sync with PFBC API: https://apps.fishandboat.pa.gov/StockingSchedule/"
}
```

---

### GET /api/pfbc/access-points

Returns PFBC fishing access points.

**Query Parameters:**
- `waterwayName` (optional) - Filter by waterway name
- `county` (optional) - Filter by county
- `region` (optional) - Filter by region
- `type` (optional) - Filter by access type: `Boat Launch`, `Shore Access`, `Wade Access`, `Fly Fishing Only`, `Handicap Accessible`
- `wheelchairAccessible` (optional) - Filter wheelchair accessible points (`true`/`false`)

**Example Request:**
```
GET /api/pfbc/access-points?waterwayName=Spring Creek&type=Wade Access
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "waterwayName": "Spring Creek",
      "name": "Fisherman's Paradise",
      "type": "Fly Fishing Only",
      "county": "Centre",
      "region": "Central",
      "coordinates": {
        "latitude": 40.7981,
        "longitude": -77.8600
      },
      "amenities": ["Parking", "Restrooms", "Visitor Center", "Trails"],
      "parking": true,
      "wheelchairAccessible": true,
      "notes": "Premier fly fishing access"
    }
  ],
  "count": 1,
  "note": "This is sample data. In production, sync with PFBC API or PASDA GeoJSON."
}
```

---

### GET /api/pfbc/regulations

Returns PFBC fishing regulations.

**Query Parameters:**
- `waterwayId` (optional) - Filter by waterway UUID
- `waterwayName` (optional) - Filter by waterway name
- `regulationType` (optional) - Filter by regulation type: `Catch & Release`, `Delayed Harvest`, `Trophy Trout`, `Special Regulation`, `Size Limit`, `Creel Limit`
- `species` (optional) - Filter by species

**Example Request:**
```
GET /api/pfbc/regulations?waterwayName=Yellow Breeches Creek&regulationType=Delayed Harvest
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "waterwayId": "uuid",
      "waterwayName": "Yellow Breeches Creek",
      "regulationType": "Delayed Harvest",
      "description": "Catch and release only, artificial lures only, Oct 1 - Feb 28",
      "season": "October 1 - February 28",
      "species": ["Brown Trout", "Rainbow Trout"],
      "notes": "Delayed harvest section"
    }
  ],
  "count": 1,
  "note": "Always check current PFBC regulations before fishing. Regulations may change."
}
```

---

### GET /api/pfbc/habitat

Returns PFBC habitat installations.

**Query Parameters:**
- `waterwayName` (optional) - Filter by waterway name
- `county` (optional) - Filter by county
- `region` (optional) - Filter by region
- `installationType` (optional) - Filter by installation type: `Lunker Structure`, `Fish Attractor`, `Habitat Enhancement`, `Spawning Bed`, `Cover Structure`
- `targetSpecies` (optional) - Filter by target species

**Example Request:**
```
GET /api/pfbc/habitat?waterwayName=Raystown Lake&installationType=Lunker Structure
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "waterwayId": "uuid",
      "waterwayName": "Raystown Lake",
      "installationType": "Lunker Structure",
      "county": "Huntingdon",
      "region": "Central",
      "coordinates": {
        "latitude": 40.3000,
        "longitude": -78.0000
      },
      "installationDate": "2020-05-15",
      "targetSpecies": ["Largemouth Bass", "Smallmouth Bass", "Crappie"],
      "description": "Lunker structure for bass habitat"
    }
  ],
  "count": 1,
  "note": "PFBC habitat installations improve fishing opportunities"
}
```

---

## Legacy PFBC Data Endpoint

### GET /api/pfbc-data

Legacy endpoint for PFBC data. Use specific endpoints above instead.

**Query Parameters:**
- `type` (required) - Data type: `stocking`, `access-points`, `best-waters`, `all`
- `county` (optional) - Filter by county
- `startDate` (optional) - Filter by start date
- `endDate` (optional) - Filter by end date

**Note:** This endpoint redirects to specific endpoints. Use `/api/pfbc/stocking`, `/api/pfbc/access-points`, or `/api/pfbc/mapping-layers` instead.

---

## Error Codes

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid request parameters",
  "details": "Missing required parameter: waterwayId"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized",
  "details": "Authentication required"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found",
  "details": "Waterway with ID 'xxx' not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error",
  "details": "Database connection failed"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Data Sources

- **Fly Fishing Data**: Expert knowledge from Joe Humphreys, George Daniel, and comprehensive fly shop database
- **PFBC Data**: Pennsylvania Fish & Boat Commission data (stocking schedules, access points, regulations)
- **Hatch Data**: Macroinvertebrate hatch information for PA waterways
- **Mapping Layers**: PFBC trout stream classifications, bass waters, and species designations

**Note:** Some endpoints use sample data. In production, sync with official PFBC APIs:
- Stocking Schedule: https://apps.fishandboat.pa.gov/StockingSchedule/
- PASDA GeoJSON: https://www.pasda.psu.edu/

---

## Support

For API questions or issues, contact: stringtheorysolutionsllc@gmail.com

