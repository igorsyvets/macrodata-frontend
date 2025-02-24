import { useQuery } from '@tanstack/react-query'
import { Tweet } from '../types/types'
import makePerplexityRequest from '../services/perplexity'
import perplexityTweets from '../data/perplexityTweets.json'
import { generateUsername } from 'unique-username-generator'

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

const useTweets = ({ topic }: { topic: string }) => {
  const request = useQuery<Tweet[]>({
    queryKey: ['tweets', topic],
    queryFn: async () => {
      console.log('fetching tweets')
      const response = await makePerplexityRequest(getTweetsPropt({ topic, amount: 60 }))
      const parsedResponse = JSON.parse(response) as string[]
      const processedTweets = processTweets(parsedResponse)
      console.log('fetched tweets', processedTweets)
      return processedTweets as Tweet[]
    },
    //placeholderData: perplexityTweets,
    refetchInterval: Infinity,
    staleTime: Infinity,
    retry: false,
  })

  return {
    ...request,
    data: request.data ?? [],
  }
}

const processTweets = (tweets: string[]): Tweet[] => {
  // adding random usernames and ids
  return tweets.map((tweet, index) => {
    const randomNumber = Math.floor(Math.random() * 3)
    const username = generateUsername('', randomNumber)
    return { id: 'tweet_' + index.toString(), username: `@${username}`, text: tweet }
  })
}

export default useTweets

const getTweetsPropt = ({ topic, amount }: { topic: string; amount: number }) => {
  const prompt = ` 
Analyze the most breaking, recent and trending news about ${topic}.

1. Generate a series of casual, tweet-like messages reflecting the latest news and developments related to Apple.
2. Your tweets should vary in tone and sentiment, capturing excitement, skepticism, criticism, curiosity, and admiration.
3. The messages should reflect the most recent trending topics and news about ${topic}. 
4. It is crucial that he frequency of messages should reflect the frequency and trendiness of real news
5. Aim for a mix of ${amount} posts that showcase diverse perspectives while maintaining a conversational style. Avoid excessive hashtags and emojis to keep the tone relatable and engaging.
6. Respond with an array of strings in valid JSON format using the response format below:
<response-example>
[string, string, string, ...]
</response-example>

Remember, do not include anything in your response except valid JSON format.
`

  return prompt
}
