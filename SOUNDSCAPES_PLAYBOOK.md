# Global Soundscapes Playbook

## 1. Goals
- Capture field audio in the journal (web + mobile).
- Store raw samples for future research.
- Optionally export recordings to Purdue University’s Global Soundscapes program.
- Maintain a fallback repository plan for Penn State Extension proposals.

## 2. Architecture
- **Front-end:** `NatureSoundRecorder` (journal form) uses MediaRecorder/Web APIs to collect audio, then POSTs to `/api/soundscapes/recordings`.
- **API Route:** `app/api/soundscapes/recordings` validates the payload, stores metadata/audio in `soundscape_recordings`, and triggers the Purdue exporter when requested.
- **Supabase Schema:** Migration `017_soundscape_recordings.sql` adds the table + RLS.
- **Exporter:** `lib/soundscapes/purdue.ts` sends audio + metadata to Purdue when `PURDUE_SOUNDSCAPES_API_URL` & `_API_KEY` are present, recording response IDs for auditing.

## 3. Configuration
1. Populate env vars:
   ```
   PURDUE_SOUNDSCAPES_API_URL=https://example.purdue.edu/api/soundscapes
   PURDUE_SOUNDSCAPES_API_KEY=your-key
   ```
2. Run migrations `016` + `017`.
3. Deploy and test via:
   ```bash
   curl -X POST http://localhost:3000/api/soundscapes/recordings \
     -H "Content-Type: application/json" \
     -d '{"audioData":"data:audio/webm;base64,...","durationSeconds":32,"metadata":{"sendToPurdue":true}}'
   ```
4. Educators review recordings with `GET /api/soundscapes/recordings?scope=review`.

## 4. Fallback Repository (Penn State Extension)
- **Repo Name:** `global-soundscapes-hub`
- **Stack:** Next.js dashboard + Supabase (or Firebase) + storage bucket for WAV files + analytics views for call frequency.
- **Features:**
  - Upload audio, tag by macro/micro habitat.
  - Visualize spectrograms (WASM + `wavesurfer.js`).
  - Export CSV/GeoJSON for extension educators.
- **Pitch:** Provide Penn State with starter repo (see `GlobalSoundscapesHub/README.md`) + data schema mirrored from `soundscape_recordings`.

## 5. Future Enhancements
- Add waveform visualization in the journal after recording.
- Native FieldQuest recorder (Capacitor / Expo AV).
- Automated quality scoring (silence detection) before export.
- Notification loop when Purdue ingestion succeeds/fails.

