# UX Benchmark Notes (PBS, NatGeo, Smithsonian, Koala, iNaturalist, BirdWeather, BandLab)

Captured on Nov 23, 2025 to inform the WLA redesign for classroom, afterschool, and summer programs.

Refer to `docs/screenshots/*.png` for the visuals noted below.

---

## 1. Education & Youth Platforms

### PBS Kids (`pbs-kids.png`)
- **Navigation**: Fixed top row with three mega-buttons (“Games / Explore / Videos”). Icons + text stacked vertically; consistent padding creates immediate clarity for kids.
- **Hero**: Carousel tiles use bold illustration and a clear CTA (“Play Now”). Each tile has a single action, avoiding multi-button clutter.
- **Pattern to adopt**: Make our top nav a compact trio (Explore / Learn / Journal) with chunky pill buttons, leaving the rest of the hero for storytelling.

### National Geographic Kids (`natgeo-kids.png`)
- **Content grid**: Uses card rails grouped by topics (“Brain Boosters”, “Cool Stuff”). Each section has a heading + “See All” link.
- **Search prominence**: Global search + “Explore More” dropdown always visible.
- **Pattern to adopt**: For WLA home, create themed rails (Field Missions, PA Parks, RAD Events) with consistent card heights.

### Smithsonian Learning Lab (`smithsonian-learning-lab.png`)
- **Hero layout**: Two-column hero with search box + “Get Started” CTA on the left, imagery on the right.
- **Utility links**: Header includes “About / Get Started / Educator Programs” plus Login/Signup clusters.
- **Pattern to adopt**: Mirror the left-aligned hero with a single search/CTA area for teachers, reducing button scatter.

---

## 2. Maker / Music Apps

### Koala Sampler (`koala.png` – capture via browser)
- **Single hero CTA**: “Download on App Store / Google Play” placed directly beneath hero copy.
- **Feature list**: Icons + short blurbs in a tight grid, maintaining rhythm.
- **Pattern to adopt**: Apply a structured feature list for “Why WLA?” and consolidate platform CTAs into a single row.

### BandLab (`bandlab.png`)
- **FAB-style prompts**: Prominent “Get Started” button, with alternative social sign-ins grouped near the footer.
- **Scrolling storytelling**: Alternating sections (text left / image right) provide breathing room.
- **Pattern to adopt**: Use alternating sections on `/fishing` and `/learn` to narrate the journey without overcrowding.

---

## 3. Observation / Data Platforms

### iNaturalist (`inaturalist.png`)
- **Hero call to action**: Two buttons (“Sign Up”, “Explore”) plus a succinct “How it Works” section immediately after.
- **Progress explanation**: Step-by-step cards (Record → Share → Discuss) highlight the workflow.
- **Pattern to adopt**: Add a three-step “Collect / Analyze / Share” strip on WLA home to set expectations for students.

### BirdWeather (`birdweather.png`)
- **Map-first experience**: Full-screen map with filtered overlays + clear layer controls.
- **Recording mode toggles**: Switch pills (“Live”, “Recorded”, “BirdNET-Pi”) always visible.
- **Pattern to adopt**: For `/explore`, keep filters docked and use floating pills that mirror BirdWeather’s clarity.

---

## 4. Cross-App Takeaways

1. **Simplify Navigation**: Limit the primary header to 3-4 entries + a user capsule (PBS + NatGeo precedent). Move the emoji pill nav into a drawer or bottom nav only.
2. **Single Hero CTA**: Each benchmark uses one or two primary buttons max. We should adopt “Start Learning” + “Explore Map” as the default pair, centered or left-aligned.
3. **Section Rails**: Use themed sections (NatGeo/Smithsonian style) to highlight PA parks, RAD partners, missions, lessons.
4. **FAB Action**: BandLab/Koala show how a single floating button can trigger recording or creation; WLA should have one “Action” FAB for Check-In / Upload / Log Observation instead of scattered icons.
5. **Map UI**: BirdWeather proves that docked filters and clear layer toggles improve comprehension—replicate this for `/explore`.
6. **Workflow Storytelling**: iNaturalist’s “How it Works” ties onboarding together. WLA should add a similar stepper for educators and students.

These notes feed into the upcoming layout plan and component roadmap.***


