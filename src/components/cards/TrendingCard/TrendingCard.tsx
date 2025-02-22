import React from 'react'
import Card from '../Card/Card'
import TweetGetter from '../../TweetGetter/TweetGetter'

type Props = {}

const TrendingCard = (props: Props) => {
  return (
    <Card
      title="Trending"
      style={{
        flex: 2,
      }}
      rightContent={<TweetGetter />}
    >
      <div>TrendingCard</div>
    </Card>
  )
}

export default TrendingCard
