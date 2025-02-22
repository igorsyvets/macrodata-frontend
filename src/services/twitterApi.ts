import { config } from 'process'

interface TwitterApiConfig {
  bearerToken: string
  apiBaseUrl: string
}

interface Tweet {
  id: string
  text: string
  created_at: string
  author_id: string
}

interface TwitterApiResponse<T> {
  data: T
  meta: {
    result_count: number
    next_token?: string
  }
}

export class TwitterApiService {
  private config: TwitterApiConfig

  constructor(config: TwitterApiConfig) {
    this.config = config
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.config.apiBaseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.bearerToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.statusText}`)
    }

    return response.json()
  }

  async searchTweets(query: string, maxResults = 10): Promise<TwitterApiResponse<Tweet[]>> {
    return this.fetchWithAuth(
      `/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${maxResults}`
    )
  }

  async getTweet(id: string): Promise<TwitterApiResponse<Tweet>> {
    return this.fetchWithAuth(`/2/tweets/${id}`)
  }

  async getUserTweets(userId: string, maxResults = 10): Promise<TwitterApiResponse<Tweet[]>> {
    return this.fetchWithAuth(`/2/users/${userId}/tweets?max_results=${maxResults}`)
  }
}

export const createTwitterApiService = () => {
  const config: TwitterApiConfig = {
    bearerToken: process.env.REACT_APP_TWITTER_BEARER_TOKEN as string,
    apiBaseUrl: 'https://api.x.com/2/tweets/search/stream',
  }

  console.log('config', config)

  return new TwitterApiService(config)
}
