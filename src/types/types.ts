export type Generic = {}

export interface Topic {
  id: string
  name: string
  postIds: string[]
}

export interface TweetThemeAnalysis {
  themes: {
    name: string
    count: number
    id: string
    tweetIds: string[]
  }[]
}

export type Tweet = {
  id: string
  text: string
}

export interface InitialTweets {
  tweets: Tweet[]
}
