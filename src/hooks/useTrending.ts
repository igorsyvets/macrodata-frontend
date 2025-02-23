import { useQuery } from '@tanstack/react-query'
import { Topic, TweetThemeAnalysis } from '../types/types'
import { useState } from 'react'
import axios from 'axios'
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

type Props = {
  posts: {
    id: string
    text: string
  }[]
}

const useTranding = ({ posts }: Props) => {
  const request = useQuery<Topic[]>({
    queryKey: ['trending'],
    queryFn: async () => {
      const response = await analyzeTopics({ posts, num_topics: 10, custom_stop_words: ['apple'] })
      return response
    },
    refetchInterval: Infinity,
    staleTime: Infinity,
  })

  let data

  return {
    ...request,
    data: request.data ?? [],
  }
}

export default useTranding

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
  console.log('summarizing tweets', sampleTweets.length)
  const messages: MistralChatMessage[] = [
    // {
    //   role: 'system',
    //   content:
    //     'You are an expert at analyzing social media sentiment and identifying common themes in tweets. When grouping tweets by theme, ensure each tweet ID is only included in the most relevant theme. Be precise in matching tweet content to themes.',
    // },
    {
      role: 'user',
      content: promptV3,
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

// const promptV1 = `Analyze these tweets about Apple products and initiatives and identify the top 5 most common themes.
//                 For each theme:
//                 1. Only include tweet IDs that directly discuss that specific theme
//                 2. Each tweet should only be counted in one theme (the most relevant one)
//                 3. Verify that the count matches the number of tweet IDs provided.

//                 Return the response in this exact JSON forma do not include explanatory text:
//                 {
//                     "themes": [
//                         {
//                             "name": "Theme name here",
//                             "count": number of tweets that exactly match this theme,
//                             "id": [array of tweet IDs that specifically discuss this theme]
//                         }
//                     ]
//                 }
//                 Requirements:
//             - Include exactly 5 themes
//             - Sort by count in descending order
//             - Each tweet ID should appear in only one theme
//             - Ensure IDs match the actual content of the theme
//             - Count should equal the number of IDs provided.
//                 Here are the chants to analyze: ${JSON.stringify(sampleTweets)}`

const promptV2 = `You are an expert at analyzing social media sentiment and identifying common themes in tweets. Your task is to process an array of tweets, group them by theme, and provide a summary of the themes in a specific JSON format.

                Here is the array of tweets you will be analyzing:
                
                <tweets>
                ${JSON.stringify(sampleTweets)}
                </tweets>
                
                Follow these steps to complete the task:
                
                1. Carefully read through all the tweets in the provided array.
                
                2. Identify common themes or topics that appear across multiple tweets. These themes should be broad enough to encompass several tweets but specific enough to be meaningful.
                
                3. Group the tweets by these identified themes. Ensure that each tweet is only included in the most relevant theme. If a tweet could fit into multiple themes, choose the one that best represents its main message or intent.
                
                4. For each theme, count the number of tweets that belong to it.
                
                5. Assign a unique ID number to each theme, starting from 1 and incrementing for each additional theme.
                
                6. Construct a JSON response with the following structure:
                  [{
                    id: string
                    name: string
                    postIds: string[]
                  }]
                
                7. Ensure that your theming is precise and accurately reflects the content of the tweets. Avoid creating overly broad or vague themes.
                
                8. Do not include any explanations, comments, or additional text in your response. Your output should be valid JSON and nothing else.
                
                Remember, the goal is to provide a clear and accurate representation of the main themes present in the tweet set. Be as objective as possible in your analysis and grouping.`

const promptV3 = `You are an expert at analyzing social media sentiment and identifying common themes in tweets. Your task is to process an array of tweets, group them by theme, and provide a summary of the themes in a specific JSON format.

                Here is the array of tweets you will be analyzing:
                
                <tweets>
                ${JSON.stringify(sampleTweets)}
                </tweets>
                
                Follow these steps to complete the task:
                
                1. Carefully read the first tweet in the array.
                2. Identify topic of this tweet. It should be specific. For example, "Google Pixel 6 Launch" instead of "Technology".
                3. Go to the next tweet. Identify if it belongs to the same topic as the first tweet.
                4. If it belongs to an existing topic with high probability, add it to the topic. 
                5. If it belongs to an existing topic with medium probability, add it to the topic and change the topic name to a more broad one.
                6. If it belongs to an existing topic with low probability, create a new topic.
                7. If the tweet could fit into multiple topics, choose the one that best represents its main message or intent.
                8. If you hit a limit of 10 topics, stop creating new topics and start broadening the existing ones.        
                9. Repeat steps 1-8 for all tweets in the array.
                10. For each topic, count the number of tweets that belong to it.
                11. All tweets should be assigned to a topic.
                12. Assign a unique ID number to each topic, starting from 1 and incrementing for each additional topic.                
                13. Construct a JSON response with the following structure:
                   {
                     "themes": [
                       {
                         "name": "Theme Name",
                         "count": number of tweets in this theme,
                         "id": unique theme ID number
                         "tweetIds": [array of tweet IDs that belong to this theme]
                       },
                       ...
                     ]
                   }
                
                14. Ensure that your theming is precise and accurately reflects the content of the tweets. Avoid creating overly broad or vague themes.                
                15. Do not include any explanations, comments, or additional text in your response. Your output should be valid JSON and nothing else.
                
                Remember, the goal is to provide a clear and accurate representation of the main themes present in the tweet set. Be as objective as possible in your analysis and grouping.
                ALL PROVIDED TWEETS SHOUD BE ASSIGNED TO A TOPIC!
                `

const promptV4 = `You are an expert at analyzing social media sentiment and identifying common themes in tweets. Your task is to process an array of tweets, group them by theme, and provide a summary of the themes in a specific JSON format.

                Here is the array of tweets you will be analyzing:
                
                <tweets>
                ${JSON.stringify(sampleTweets)}
                </tweets>
                
                Follow these steps to complete the task:
                
                1. Carefully read the first tweet in the array.
                2. Identify topic of this tweet. It should be specific. Use topic guidelines below.
                3. Go to the next tweet. Identify if it belongs to the same topic as the first tweet.
                4. If it belongs to an existing topic with high probability, add it to the topic. 
                5. If it belongs to an existing topic with medium probability, add it to the topic and change the topic name to a more broad one.
                6. If it belongs to an existing topic with low probability, create a new topic.
                5. If the tweet could fit into multiple topics, choose the one that best represents its main message or intent.
                6. Repeat steps 3-5 for all tweets in the array.
                7. For each topic, count the number of tweets that belong to it.
                8. Assign a unique ID number to each topic, starting from 1 and incrementing for each additional topic.                
                9. Construct a JSON response with the following structure:
                   {
                     "themes": [
                       {
                         "name": "Theme Name",
                         "count": number of tweets in this theme,
                         "id": unique theme ID number
                         "tweetsIDs": [array of tweet IDs that belong to this theme]
                       },
                       ...
                     ]
                   }
                
                10. Ensure that your theming is precise and accurately reflects the content of the tweets. Avoid creating overly broad or vague themes.                
                11. Do not include any explanations, comments, or additional text in your response. Your output should be valid JSON and nothing else.
                
                Topic guidelines:
                A topic should reflect key players related to the topic. 
                For example, if a tweet says "Reports suggest Apple is in talks with OpenAI to integrate ChatGPT into iOS 19. A major shift in AI strategy." 
                The topic will be "Open AI and Apple Partnership" not "Artificial Intelligence". 
                That's because Open AI and Apple are company names and they provide more context.
                
                Remember, the goal is to provide a clear and accurate representation of the main themes present in the tweet set. Be as objective as possible in your analysis and grouping.`

interface AnalyzeRequest {
  posts: {
    id: string
    text: string
  }[]
  num_topics?: number
  custom_stop_words?: string[]
}

const API_BASE_URL = 'http://localhost:8000'

export const analyzeTopics = async (data: AnalyzeRequest): Promise<Topic[]> => {
  try {
    const response = await axios.post<Topic[]>(`${API_BASE_URL}/analyze`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Analysis failed: ${error.response?.data?.detail || error.message}`)
    }
    throw error
  }
}
