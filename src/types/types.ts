export type Generic = {}

export interface Topic {
  id: string
  name: string
  postIds: string[]
}

export interface Tweet {
  id: string
  text: string
  username: string
}

export interface InitialTweets {
  tweets: Tweet[]
}
