import './App.css'
import Card from './components/cards/Card/Card'
import MainNavigation from './components/navigation/MainNavigation/MainNavigation'
import TweetGetter from './components/TweetGetter/TweetGetter'

function App() {
  return (
    <div className="App">
      <MainNavigation />
      <main>
        <Card title="Trending Narratives">
          <TweetGetter />
        </Card>
      </main>
    </div>
  )
}

export default App
