# Navigation & Action Bar Audit (Nov 2025)

This snapshot documents the current navigation/button layout issues captured on `localhost:3001` (see `docs/screenshots/home.png`, `explore.png`, `fishing.png`, etc.). It will guide the next iteration of the design system.

---

## 1. Current Top-Left Cluster

Observed on `home.png` and `explore.png`:

- **Elements involved**: `PrimaryNav` (icon+label pills), “Back” button, points/bell/search buttons rendered ahead of the hero headline.
- **Behavior**: On wide screens, these elements stack unevenly and hug the left edge, creating a “floating icon soup.” The lack of containing grid causes:
  - Misaligned emoji icons.
  - Text wrapping inconsistently (e.g., “Learning” label dropping to two lines).
  - Overlap with hero copy when viewport is <1280px.
- **CSS origin**: `components/layout/PrimaryNav.tsx` + ad-hoc global styles in `styles/globals.css`.

## 2. Redundant Entry Points

- Top nav shows “Home/Explore/Learning/Journal/Achievements/Profile,” while `BottomNav` repeats Explore/Journal/Achievements/Profile plus a Check-In FAB.
- Header also includes separate quick links (“Start Learning,” “Explore Watersheds”) leading to similar routes.
- Result: users see up to three different ways to access the same screen, cluttering above-the-fold space.

## 3. Button Alignment Issues

- Action buttons (`Start Learning →`, `Explore Watersheds`) use inline-flex styling without consistent spacing tokens; they drift left relative to the hero stats.
- Secondary stats (Ambassadors Trained / Field Projects / PA Counties) use custom divs with manual margins, so the columns shift left while the hero copy stays centered.

## 4. Mobile vs Desktop Discrepancy

- `PrimaryNav` is always rendered, even though `BottomNav` is supposed to handle mobile navigation exclusively.
- On tablet widths, both navs appear simultaneously, doubling vertical chrome and obscuring the hero background.

## 5. Component Mapping

| Issue | Source |
|-------|--------|
| Emoji pills + labels | `components/layout/PrimaryNav.tsx` |
| Floating “Back” button | Page-level components (e.g., `app/explore/page.tsx`) reuse the same inline style |
| Gamified stats row | `components/layout/GamificationBar.tsx` |
| Floating check-in FAB | `components/layout/BottomNav.tsx` |

---

### Immediate Opportunities

1. **Consolidate header**: Replace the emoji pill strip with a simplified top bar (logo + 3 core links + user capsule). Defer full nav to BottomNav on mobile.
2. **Anchor hero CTAs**: Use a two-column layout so buttons and stats align beneath the hero title.
3. **Action hub**: Replace multiple scattered buttons with a single floating “Action” menu (mirroring Koala/BandLab) once the redesign is in place.

These findings feed directly into the upcoming layout plan.***


