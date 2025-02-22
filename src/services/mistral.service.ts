import axios from 'axios'
import tweetBase from '../data/TweetBase.json'

interface MistralChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface MistralChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: MistralChatMessage
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface TweetThemeAnalysis {
  themes: {
    name: string
    count: number
    id: number
  }[]
}

export class MistralService {
  private readonly baseURL = 'https://api.mistral.ai/v1'
  private readonly apiKey: string

  constructor() {
    const apiKey = process.env.REACT_APP_MISTRAL_API_KEY
    if (!apiKey) {
      throw new Error('Mistral API key is not defined in environment variables')
    }
    this.apiKey = apiKey
  }

  async chat(messages: MistralChatMessage[], model: string = 'mistral-tiny'): Promise<string> {
    try {
      const response = await axios.post<MistralChatResponse>(
        `${this.baseURL}/chat/completions`,
        {
          model,
          messages,
          max_tokens: 2000,
          temperature: 0.3,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      )

      return response.data.choices[0].message.content
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Mistral API Error: ${error.response?.data?.error?.message || error.message}`
        )
      }
      throw error
    }
  }

  async streamChat(
    messages: MistralChatMessage[],
    onMessage: (content: string) => void,
    model: string = 'mistral-tiny'
  ): Promise<void> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model,
          messages,
          stream: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          responseType: 'stream',
        }
      )

      for await (const chunk of response.data) {
        const lines = chunk
          .toString()
          .split('\n')
          .filter((line: string) => line.trim() !== '')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            if (data.choices[0].delta?.content) {
              onMessage(data.choices[0].delta.content)
            }
          }
        }
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Mistral API Error: ${error.response?.data?.error?.message || error.message}`
        )
      }
      throw error
    }
  }

  async summarizeTweets(): Promise<TweetThemeAnalysis> {
    const messages: MistralChatMessage[] = [
      {
        role: 'system',
        content:
          'You are an expert at analyzing social media sentiment and identifying common themes in tweets. When grouping tweets by theme, ensure each tweet ID is only included in the most relevant theme. Be precise in matching tweet content to themes.',
      },
      {
        role: 'user',
        content: `Analyze these tweets about Apple products and initiatives and identify the top 5 most common themes.
                For each theme:
                1. Only include tweet IDs that directly discuss that specific theme
                2. Each tweet should only be counted in one theme (the most relevant one)
                3. Verify that the count matches the number of tweet IDs provided.

                Return the response in this exact JSON forma do not include explanatory text:
                {
                    "themes": [
                        {
                            "name": "Theme name here",
                            "count": number of tweets that exactly match this theme,
                            "id": [array of tweet IDs that specifically discuss this theme]
                        }
                    ]
                }
                Requirements:
            - Include exactly 5 themes
            - Sort by count in descending order
            - Each tweet ID should appear in only one theme
            - Ensure IDs match the actual content of the theme
            - Count should equal the number of IDs provided.
                Here are the chants to analyze: ${JSON.stringify(tweetBase.tweets)}`,
      },
    ]

    try {
      const response = await this.chat(messages, 'mistral-medium')
      try {
        const analysis = JSON.parse(response) as TweetThemeAnalysis
        return analysis
      } catch (error) {
        console.error('Failed to parse JSON response:', response)
        throw new Error('Failed to parse theme analysis response')
      }
    } catch (error) {
      console.error('Mistral API error:', error)
      throw error
    }
  }
}

//export const mistralService = new MistralService()
