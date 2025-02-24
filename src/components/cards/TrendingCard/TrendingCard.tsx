import React, { act, useEffect, useState } from 'react'
import Card from '../Card/Card'
import TweetGetter from '../../TweetGetter/TweetGetter'
import { Topic, Tweet } from '../../../types/types'
import classNames from 'classnames/bind'
import styles from './TrendingCard.module.css'
import { RefreshCcw } from 'react-feather'
import useTweets from '../../../hooks/useTweets'

const cx = classNames.bind(styles)

type Props = {
  data: Topic[]
  tweets: Tweet[]
  isLoading?: boolean
  refetch: () => void
}

const TrendingCard = ({ data, tweets, isLoading, refetch }: Props) => {
  const [activeTheme, setActiveTheme] = useState<string | null>(null)
  // Trigger animation on data changes

  const [animationKey, setAnimationKey] = useState(0)
  useEffect(() => {
    setAnimationKey((prev) => prev + 1)
  }, [data])

  const themes = data || []

  const sortedData = data ? themes.sort((a, b) => b.postIds.length - a.postIds.length) : []
  const maxCount = Math.max(...sortedData.map((d) => d.postIds.length))

  const totalPosts = themes.reduce((sum, theme) => sum + theme.postIds.length, 0)

  const getTweetsByTheme = (themeId: string) => {
    const tweetIDs = themes.find((t) => t.id === themeId)?.postIds
    if (!tweetIDs) return []
    const filteredTweets = tweetIDs
      .map((tweetID) => {
        const tweet = tweets.find((t) => t.id === tweetID)
        if (!tweet) console.error('tweet not found! boo! bad ai!', tweetID)
        return tweet
      })
      .filter(Boolean) as Tweet[]

    return filteredTweets
  }

  return (
    <Card
      title={`Trending ${!!totalPosts && !isLoading ? `(${totalPosts} posts)` : ''}`}
      style={{ flex: 2 }}
      isLoading={isLoading}
    >
      {!activeTheme ? (
        <div className={cx('chart')}>
          {sortedData.map((item, index) => (
            <div
              key={`${animationKey}-${item.id}`}
              className={cx('value-container')}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setActiveTheme(item.id)}
            >
              <span className={cx('label')}>{item.name}</span>
              <div className={cx('bar-container')}>
                <div
                  className={cx('bar')}
                  style={{
                    width: `${(item.postIds.length / maxCount) * 100}%`,
                    animationDelay: `${index * 50}ms`,
                  }}
                />
                <span className={cx('count')}>{item.postIds.length}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              cursor: 'pointer',
              fontFamily: 'IBM Plex Mono',
            }}
          >
            <div
              onClick={() => setActiveTheme(null)}
              style={{
                padding: '10px 0',
              }}
            >
              &larr;
            </div>
            <span>
              {themes.find((t) => t.id === activeTheme)?.name} (
              {themes.find((t) => t.id === activeTheme)?.postIds.length})
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {getTweetsByTheme(activeTheme).map((tweet) => (
              <div
                style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  padding: '8px',
                  width: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
                key={tweet.id}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {tweet.username}
                </div>
                <div>{tweet.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default TrendingCard
