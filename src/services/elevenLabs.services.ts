import * as elevenlabs from 'elevenlabs';

export class ElevenLabsService {
  private readonly apiKey: string;

  constructor() {
    const apiKey = process.env.REACT_APP_ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API key is not defined in environment variables');
    }
    this.apiKey = apiKey;
  }

  async textToSpeech(text: string, voiceId: string): Promise<ArrayBuffer> {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to convert text to speech');
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      throw error;
    }
  }

  async getVoices() {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }

      return await response.json();
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      throw error;
    }
  }
}

export const elevenLabsService = new ElevenLabsService();