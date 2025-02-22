import React from 'react'
import { createTwitterApiService, TwitterApiService } from '../../services/twitterApi'

type Props = {}

const TweetGetter = (props: Props) => {
  const twitterApiService = createTwitterApiService()

  const getStream = async () => {
    console.log('Getting stream')
    const streamRules = await twitterApiService.getFilteredStream()
    console.log(streamRules)
  }

  return <button onClick={getStream}>Get Tweets</button>
}

export default TweetGetter
