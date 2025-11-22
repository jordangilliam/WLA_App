# Global Soundscapes Hub (Concept Repo)

This folder describes the proposed standalone repository for Penn State Extension. Clone/copy to create a fresh repo when pitching the project.

## Vision
- Collect and catalog environmental soundscapes from Pennsylvania field sites.
- Provide educators with dashboards to explore acoustic diversity, trends, and student participation.
- Mirror data structures from `soundscape_recordings` in the main WLA app for easy syncing.

## Suggested Stack
- **Frontend:** Next.js 14 + App Router, Tailwind, shadcn/ui.
- **Backend:** Supabase (Postgres + storage) or Firebase (for a Google-centric workflow).
- **Storage:** Supabase Storage bucket `soundscapes` for WAV/WEBM uploads.
- **AI/Analysis:** Integrate with open-source acoustic libraries (e.g., `sss.sonic` or TensorFlow Lite bird/macro classifiers).

## Core Features
1. **Upload Console:** Drag/drop WAV or record via browser. Capture GPS + habitat metadata.
2. **Spectrogram Viewer:** Render quick spectrogram previews client-side for validation.
3. **Export Workbench:** Filter recordings and export CSV/GeoJSON for extension educators.
4. **Partner Integrations:** Webhook connectors for Purdue, local universities, or community science programs.

## Directory Outline
```
GlobalSoundscapesHub/
├── app/
│   ├── (dashboard)/
│   └── api/
├── lib/
│   ├── soundscapes/
│   └── analytics/
├── supabase/
│   └── migrations/
└── README.md
```

## Next Steps
- When ready, copy this folder into a new repo (`jordangilliam/GlobalSoundscapesHub`), scaffold Next.js app, and port over the `soundscape_recordings` schema + Purdue exporter.
- Link back to the main WLA app so educators can jump between experiences.

