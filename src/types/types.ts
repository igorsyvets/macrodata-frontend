export type Generic = {}

export interface Topic {
  id: string
  topic: string
  count: number
}

export interface TweetThemeAnalysis {
  themes: {
    name: string
    count: number
    id: number
  }[]
}

export type Tweet = {
  id: string
  text:string
}

export interface InitialTweets {
  tweets: Tweet[]
}


