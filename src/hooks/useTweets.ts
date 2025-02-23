import { useQuery } from '@tanstack/react-query'
import { Topic, TweetThemeAnalysis, InitialTweets } from '../types/types'
import { useState } from 'react'
import axios from 'axios'
import tweetBase from '../data/TweetBase.json'
import sampleTweets from '../data/sample tweets.json'


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

const useTweets = () => {
  const request = useQuery<InitialTweets>({
    queryKey: ['trending'],
    queryFn: generateTweets,
    refetchInterval: Infinity,
    staleTime: Infinity,
  })

  return {
    ...request,
    data: request.data ?? { topics: [] },
  }
}

export default useTweets

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

const generateTweets = async () => {
  const messages: MistralChatMessage[] = [
    {
      role: 'system',
      content:
        'You are an expert at analyzing social media sentiment and identifying common themes in tweets. When grouping tweets by theme, ensure each tweet ID is only included in the most relevant theme. Be precise in matching tweet content to themes.',
    },
    {
      role: 'user',
      content: generateTweetsPrompt,
    },
  ]

  try {
    const response = await chat(messages, 'mistral-medium')
    try {
      const analysis = JSON.parse(response) as InitialTweets
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


const generateTweetsPrompt = ` 
                Search and analyze current online discussions about Apple Inc. and identify the top 5 most discussed themes. 
                First, provide a concise summary and title of the overall narrative and key insights from your findings.
                Then, for each theme:
                1. Only include sources that directly discuss that specific theme
                2. Each source should only be counted in one theme (the most relevant one)
                3. Focus on reliable and recent sources

                Return the response in this exact JSON format:
                {
                    tweets: {
                      id: string
                      text:string
                    }[]
                }
                Requirements:
                - Include exactly 5 themes
                - Sort by relevance and discussion volume
                - Focus on current discussions and developments
                - Ensure themes are distinct and well-supported
                - Verify information from multiple sources
`