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
import { useElevenLabs } from './hooks/useElevenLabs'

function App() {
  const [currentTopic, setCurrentTopic] = useState('')
  const [initialTopic, setInitialTopic] = useState('')

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

  const {
    playAudio,
    isPlaying,
    isLoading: audioIsLoading,
    audioBlob,
  } = useElevenLabs({
    text: trendingData.trending_narratives.report_summary,
    enabled: trendingData.trending_topics.length > 0,
    defaultPauseBefore: 0, // 300ms default pause before each track
    backgroundTracks: [
      { path: '/data/radio-crackle.mp3', volume: 0.1, pauseBefore: 0 }, // first track starts immediately
      { path: '/data/page-turning.mp3', volume: 0.4, pauseBefore: 1000 }, // 1 second pause before this track
    ],
  })

  const handleButtonClick = () => {
    playAudio()
  }

  const isLoading = tweetsLoading || trendsLoading || tweetsFetching || isFetching || audioIsLoading

  return (
    <div className="App">
      {!currentTopic ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            justifyContent: 'center',
            gap: '24px',
            margin: '0 auto',
            width: '720px',
          }}
        >
          <div
            className={'logo'}
            style={{
              marginBottom: '24px',
            }}
          >
            <div>macrodata</div>
            <div
              style={{
                fontSize: '0.5em',
                opacity: 0.5,
              }}
            >
              v.0.1
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (initialTopic) {
                setCurrentTopic(initialTopic)
              }
            }}
          >
            <input
              type="text"
              value={initialTopic}
              onChange={(e) => setInitialTopic(e.target.value)}
              style={{
                padding: '24px 0',
                border: 'none',
                background: 'transparent',
                fontSize: '40px',
                borderBottom: '4px solid var(--color-main-border)',
                width: '100%',
                outline: 'none', // Remove default focus outline
                color: 'white',
                fontFamily: 'IBM Plex Mono',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-main)')}
              onBlur={(e) => (e.target.style.borderColor = '')}
            />
          </form>
          <footer
            style={{
              fontSize: '12px',
            }}
          >
            Created by Igor Syvets
            <br />
            with support of Pavlo Bilashchuk
            <br />
            <br />
            NYC 2025
          </footer>
        </div>
      ) : (
        <>
          <MainNavigation isLoading={isLoading} onRefresh={refetchAll} />

          <SecondaryNavigation
            currentTopic={currentTopic}
            onCurrentTopicChange={(topic) => setCurrentTopic(topic)}
            tweets={tweets}
            onCTAClick={handleButtonClick}
            isLoading={isLoading}
            isPlaying={isPlaying}
            audioBlob={audioBlob}
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
          <footer
            style={{
              padding: '8px 8px 40px',
              fontSize: '12px',
            }}
          >
            Created by Igor Syvets with support of Pavlo Bilashchuk. NYC 2025
          </footer>
        </>
      )}
    </div>
  )
}

export default App
