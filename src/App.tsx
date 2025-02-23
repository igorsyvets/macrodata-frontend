import './App.css'
import Card from './components/cards/Card/Card'
import MainNarrativeCard from './components/cards/MainNarrativeCard/MainNarrativeCard'
import TrendingCard from './components/cards/TrendingCard/TrendingCard'
import MainNavigation from './components/navigation/MainNavigation/MainNavigation'
import SecondaryNavigation from './components/navigation/SecondaryNavigation/SecondaryNavigation'
import TweetGetter from './components/TweetGetter/TweetGetter'
import MistralButton from './components/MistralSummary/MistralButton'
import useTranding from './hooks/useTrending'

function App() {
  const { data, isLoading, isFetching, refetch } = useTranding()

  return (
    <div className="App">
      <MainNavigation />
      <SecondaryNavigation />
      <main>
        <MainNarrativeCard trendingTweets={data} />
        <TrendingCard data={data} isLoading={isLoading} isFetching={isFetching} refetch={refetch} />
      </main>
    </div>
  )
}

export default App
