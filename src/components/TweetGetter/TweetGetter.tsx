import React from 'react'
import { createTwitterApiService, TwitterApiService } from '../../services/twitterApi'

type Props = {}

const TweetGetter = (props: Props) => {
  const twitterApiService = createTwitterApiService()
  return <button>Get Tweets</button>
}

export default TweetGetter
