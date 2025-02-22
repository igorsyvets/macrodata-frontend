import React from 'react'
import { TwitterApiService } from '../../services/twitterApi'

type Props = {}

const TweetGetter = (props: Props) => {
  const twitterApiService = createTwitterApiService({
    bearer,
  })
  return <button>Get Tweets</button>
}

export default TweetGetter
