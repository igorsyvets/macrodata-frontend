import './App.css'
import Card from './components/cards/Card/Card'
import MainNarrativeCard from './components/cards/MainNarrativeCard/MainNarrativeCard'
import TrendingCard from './components/cards/TrendingCard/TrendingCard'
import MainNavigation from './components/navigation/MainNavigation/MainNavigation'
import SecondaryNavigation from './components/navigation/SecondaryNavigation/SecondaryNavigation'
import TweetGetter from './components/TweetGetter/TweetGetter'
import MistralButton from './components/MistralSummary/MistralButton'
import useTrending from './hooks/useTrending'
import sampleTweets from './data/sample tweets.json'
import useTweets from './hooks/useTweets'
import { useState } from 'react'

function App() {
  const [currentTopic, setCurrentTopic] = useState('Apple')

  const {
    data: tweets,
    isLoading: tweetsLoading,
    isFetching: tweetsFetching,
    refetch: tweetsRefetch,
    dataUpdatedAt,
  } = useTweets({ topic: currentTopic })

  const {
    data: trendingData,
    isLoading: trendsLoading,
    isFetching,
    refetch,
  } = useTrending({ posts: tweets, currentTopic })

  const refetchAll = () => {
    tweetsRefetch()
    refetch()
  }

  console.log('currentTopic', currentTopic)

  const isLoading = tweetsLoading || trendsLoading || tweetsFetching || isFetching

  return (
    <div className="App">
      <MainNavigation isLoading={isLoading} onRefresh={refetchAll} />
      <SecondaryNavigation
        currentTopic={currentTopic}
        onCurrentTopicChange={(topic) => setCurrentTopic(topic)}
        tweets={tweets}
      />
      <main>
        <MainNarrativeCard
          summary={trendingData.trending_narratives.summary}
          title={trendingData.trending_narratives.title}
          isLoading={isLoading}
        />
        <TrendingCard
          tweets={tweets}
          data={trendingData.trending_topics}
          refetch={refetch}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}

export default App
