'use client'

import { useRef, useState } from 'react'

export default function NatureSoundRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number | null>(null)

  const [isRecording, setIsRecording] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [sendToPurdue, setSendToPurdue] = useState(false)

  const startRecording = async () => {
    setMessage(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      chunksRef.current = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = handleRecordingStop

      recorder.start()
      startTimeRef.current = Date.now()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
    } catch (error) {
      console.error(error)
      setMessage('Microphone permission denied or unavailable.')
      setStatus('error')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    mediaRecorderRef.current = null
    setIsRecording(false)
  }

  const handleRecordingStop = async () => {
    setStatus('saving')
    try {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const base64 = await blobToBase64(blob)
      const duration =
        startTimeRef.current !== null ? (Date.now() - startTimeRef.current) / 1000 : blob.size / 16000

      const response = await fetch('/api/soundscapes/recordings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioData: base64,
          durationSeconds: duration,
          metadata: {
            sendToPurdue,
          },
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Upload failed')
      }

      setStatus('success')
      setMessage(sendToPurdue ? 'Uploaded + sent to Purdue.' : 'Recording saved locally.')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      console.error(error)
      setStatus('error')
      setMessage('Unable to save recording.')
    }
  }

  return (
    <div className="bg-white border border-blue-100 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">🌎 Nature Sound Recorder</h3>
          <p className="text-sm text-gray-600">Capture ambient audio for Global Soundscapes.</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={sendToPurdue}
            onChange={(e) => setSendToPurdue(e.target.checked)}
          />
          Send to Purdue
        </label>
      </div>

      <div className="flex gap-3">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex-1 px-4 py-3 rounded-lg text-white font-semibold shadow ${
            isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button
          onClick={() => setSendToPurdue((prev) => !prev)}
          className="px-4 py-3 rounded-lg border border-gray-200 text-sm font-medium"
        >
          {sendToPurdue ? 'Purdue Export ON' : 'Purdue Export OFF'}
        </button>
      </div>

      <p className="text-xs text-gray-500">
        Tip: Record at least 30 seconds to capture the full soundscape. Stay quiet while recording.
      </p>

      {status !== 'idle' && (
        <div
          className={`text-sm rounded-lg p-2 ${
            status === 'success'
              ? 'bg-green-50 text-green-800 border border-green-100'
              : status === 'error'
              ? 'bg-red-50 text-red-700 border border-red-100'
              : 'bg-blue-50 text-blue-700 border border-blue-100'
          }`}
        >
          {status === 'saving' ? 'Saving recording…' : message}
        </div>
      )}
    </div>
  )
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

