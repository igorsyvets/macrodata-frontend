import './App.css'
import Card from './components/cards/Card/Card'
import MainNarrativeCard from './components/cards/MainNarrativeCard/MainNarrativeCard'
import TrendingCard from './components/cards/TrendingCard/TrendingCard'
import MainNavigation from './components/navigation/MainNavigation/MainNavigation'
import TweetGetter from './components/TweetGetter/TweetGetter'

function App() {
  return (
    <div className="App">
      <MainNavigation />
      <main>
        <MainNarrativeCard />
        <TrendingCard />
      </main>
    </div>
  )
}

export default App
