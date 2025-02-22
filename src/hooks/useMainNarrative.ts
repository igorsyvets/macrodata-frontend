import { useQuery } from '@tanstack/react-query'
import { Topic } from '../types/types'
import { MistralService, TweetThemeAnalysis } from '../services/mistral.service'
import { useState } from 'react'
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

const baseURL = 'https://api.mistral.ai/v1'

const useMainNarrative = () => {
  const request = useQuery<TweetThemeAnalysis>({
    queryKey: ['main-narrative'],
    queryFn: summarizeTweets,
  })

  return {
    ...request,
    data: request.data ?? { themes: [] },
  }
}

export default useMainNarrative

const chat = async (
  messages: MistralChatMessage[],
  model: string = 'mistral-tiny'
): Promise<string> => {
  try {
    const response = await axios.post<MistralChatResponse>(
      `${baseURL}/chat/completions`,
      {
        model,
        messages,
        max_tokens: 2000,
        temperature: 0.3,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_MISTRAL_API_KEY}`,
        },
      }
    )

    return response.data.choices[0].message.content
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Mistral API Error: ${error.response?.data?.error?.message || error.message}`)
    }
    throw error
  }
}

const summarizeTweets = async () => {
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
    const response = await chat(messages, 'mistral-medium')
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

// const sampleData: Topic[] = [
//   {
//     id: '1',
//     topic: 'iPhone 16e Launch',
//     count: 125000,
//   },
//   {
//     id: '2',
//     topic: 'Apple Intelligence in China',
//     count: 98000,
//   },
//   {
//     id: '3',
//     topic: 'AI Partnerships (Alibaba/Baidu)',
//     count: 87000,
//   },
//   {
//     id: '4',
//     topic: 'iPhone SE Update',
//     count: 65000,
//   },
//   {
//     id: '5',
//     topic: 'Stock Valuation Concerns',
//     count: 52000,
//   },
//   {
//     id: '6',
//     topic: 'New Low-Cost iPhone Strategy',
//     count: 48000,
//   },
//   {
//     id: '7',
//     topic: 'Apple’s 5G Modem Debut',
//     count: 39000,
//   },
//   {
//     id: '8',
//     topic: 'Innovation Pace Debate',
//     count: 34000,
//   },
// ]
