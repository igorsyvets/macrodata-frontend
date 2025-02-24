import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'

interface UseElevenLabsProps {
  text: string
  enabled?: boolean
  backgroundTracks?: Array<{
    path: string
    volume?: number
    pauseBefore?: number // pause duration in milliseconds before this track
  }>
  voiceVolume?: number
  defaultPauseBefore?: number // default pause duration before each track
}

const fade = (
  audio: HTMLAudioElement,
  start: number,
  end: number,
  duration: number
): Promise<void> => {
  return new Promise((resolve) => {
    const interval = 50
    const steps = duration / interval
    const step = (end - start) / steps

    let current = start
    const fadeInterval = setInterval(() => {
      current = Math.min(end, current + step)
      audio.volume = current

      if (current >= end) {
        clearInterval(fadeInterval)
        resolve()
      }
    }, interval)
  })
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useElevenLabs = ({
  text,
  enabled = true,
  backgroundTracks = [],
  voiceVolume = 1,
  defaultPauseBefore = 0,
}: UseElevenLabsProps) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlaybackLoading, setIsPlaybackLoading] = useState(false)
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null)
  const backgroundAudioRefs = useRef<Array<{ audio: HTMLAudioElement; initialVolume: number }>>([])
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

  const voiceId = '1K9mkIsulZk3nI6VrAso'

  const { isLoading, error } = useQuery({
    queryKey: ['elevenlabs', text],
    queryFn: async () => {
      console.log('fetching audio')
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.REACT_APP_ELEVENLABS_API_KEY || '',
        },
        body: JSON.stringify({
          text,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate speech')
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
      setAudioBlob(audioBlob)
      console.log('fetched audio')
      return url
    },
    enabled: enabled && Boolean(text),
    retry: false,
  })

  // Add effect to initialize audio when URL becomes available
  useEffect(() => {
    if (audioUrl) {
      // Initialize voice audio
      voiceAudioRef.current = new Audio(audioUrl)
      voiceAudioRef.current.volume = voiceVolume

      // Initialize background tracks
      backgroundAudioRefs.current = backgroundTracks.map((track) => {
        const audio = new Audio(track.path)
        const initialVolume = track.volume ?? 0.3
        audio.volume = initialVolume
        audio.loop = true
        return { audio, initialVolume }
      })

      // Set up onended handler
      if (voiceAudioRef.current) {
        voiceAudioRef.current.onended = async () => {
          setIsPlaying(false)
          // Stop all background tracks with fade out
          await Promise.all(
            backgroundAudioRefs.current.map(async ({ audio }) => {
              try {
                await fade(audio, audio.volume, 0, 1000)
                audio.pause()
                audio.currentTime = 0
              } catch (error) {
                console.error('Error stopping background track:', error)
              }
            })
          )
        }
      }
    }
  }, [audioUrl, backgroundTracks, voiceVolume])

  const playAudio = async () => {
    if (isPlaying || isPlaybackLoading) {
      return stopAudio()
    }

    if (!audioUrl || !voiceAudioRef.current) return

    try {
      setIsPlaybackLoading(true)

      // Make sure all audio is stopped and rewound before starting
      await stopAudio()

      setIsPlaying(true)
      // Reset audio positions
      voiceAudioRef.current.currentTime = 0
      backgroundAudioRefs.current.forEach(({ audio }) => {
        audio.currentTime = 0
      })

      // Sequential playback with pauses
      for (let i = 0; i < backgroundAudioRefs.current.length; i++) {
        const { audio } = backgroundAudioRefs.current[i]
        const pauseDuration = backgroundTracks[i]?.pauseBefore ?? defaultPauseBefore

        if (pauseDuration > 0) {
          await delay(pauseDuration)
        }
        try {
          await audio.play()
        } catch (error) {
          console.error('Failed to play background track:', error)
          continue // Skip to next track if one fails
        }
      }

      // Add pause before voice if specified
      const voicePause = defaultPauseBefore
      if (voicePause > 0) {
        await delay(voicePause)
      }
      await voiceAudioRef.current.play()
    } catch (error) {
      console.error('Error playing audio:', error)
      await stopAudio() // Make sure everything is stopped if there's an error
    } finally {
      setIsPlaybackLoading(false)
    }
  }

  // Cleanup function
  useEffect(() => {
    return () => {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause()
        voiceAudioRef.current.currentTime = 0
      }
      backgroundAudioRefs.current.forEach(({ audio }) => {
        audio.pause()
        audio.currentTime = 0
      })
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const stopAudio = async () => {
    setIsPlaying(false)
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause()
      voiceAudioRef.current.currentTime = 0
    }

    // Wait for all tracks to fade out and stop
    await Promise.all(
      backgroundAudioRefs.current.map(async ({ audio }) => {
        await fade(audio, audio.volume, 0, 1000)
        audio.pause()
        audio.currentTime = 0
      })
    )
  }

  return {
    audioBlob,
    playAudio,
    audioUrl,
    isLoading,
    error,
    isPlaying,
    stopAudio,
  }
}

export default useElevenLabs
