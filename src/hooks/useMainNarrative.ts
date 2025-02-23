import { useQuery } from '@tanstack/react-query'
import { Topic } from '../types/types'
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

interface TweetThemeAnalysis {
  summary: string
  summaryTitle: string
  themes: {
    name: string
    count: number
    id: number
  }[]
}

const baseURL = 'https://api.mistral.ai/v1'

const useMainNarrative = () => {
  const request = useQuery<TweetThemeAnalysis>({
    queryKey: ['main-narrative'],
    queryFn: summarizeTweets,
    refetchInterval: Infinity,
    staleTime: Infinity,
  })
  return {
    ...request,
    data: request.isLoading ? undefined : request.data,
  }
}
const placeholderData: TweetThemeAnalysis = {
  summary: 'Loading real-time data...',
  summaryTitle: 'Loading real-time data...',

  themes: [
    {
      name: 'n/a',
      count: 0,
      id: 1,
    },
  ],
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
        'You are an expert at analyzing current online discussions and news about Apple Inc. Search the internet for recent discussions and news about Apple Inc, and identify common themes from reliable sources.',
    },
    {
      role: 'user',
      content: `Search and analyze current online discussions about Apple Inc. and identify the top 5 most discussed themes.
                First, provide a concise summary and title of the overall narrative and key insights from your findings.
                Then, for each theme:
                1. Only include sources that directly discuss that specific theme
                2. Each source should only be counted in one theme (the most relevant one)
                3. Focus on reliable and recent sources
                4. Verify the accuracy of information

                Return the response in this exact JSON format:
                {
                    "summary": "A concise paragraph summarizing the overall narrative and key insights from current discussions",
                    "summaryTitle": "A concise title capturing the main narrative",
                    "themes": [
                        {
                            "name": "Theme name here",
                            "count": number of reliable sources discussing this theme,
                            "id": [array of source identifiers or URLs]
                        }
                    ]
                }
                Requirements:
                - Include exactly 5 themes
                - Sort by relevance and discussion volume
                - Focus on current discussions and developments
                - Ensure themes are distinct and well-supported
                - Verify information from multiple sources`,
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
//     topic: 'iPhone SE Launch',
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
