import React, { useEffect, useState } from 'react'
import Card from '../Card/Card'
import TweetGetter from '../../TweetGetter/TweetGetter'
import { Topic, TweetThemeAnalysis } from '../../../types/types'
import classNames from 'classnames/bind'
import styles from './TrendingCard.module.css'
import useTranding from '../../../hooks/useTrending'
import { RefreshCcw } from 'react-feather'

const cx = classNames.bind(styles)

type Props = {
  data: TweetThemeAnalysis
  isLoading: boolean
  isFetching: boolean
  refetch: () => void
}

const TrendingCard = (props: Props) => {
  const [animationKey, setAnimationKey] = useState(0)

  // Trigger animation on data changes
  useEffect(() => {
    setAnimationKey((prev) => prev + 1)
  }, [data])

  const { themes } = data

  console.log('themes', themes)

  const sortedData = data ? themes.sort((a, b) => b.count - a.count) : []
  const maxCount = Math.max(...sortedData.map((d) => d.count))

  return (
    <Card
      title="Trending"
      style={{ flex: 2 }}
      rightContent={
        isLoading || isFetching ? (
          <div>Loading...</div>
        ) : (
          <div
            onClick={() => refetch()}
            style={{
              cursor: 'pointer',
              color: 'var(--primary-color)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <RefreshCcw size={16} />
            Refresh
          </div>
        )
      }
    >
      <div className={cx('chart')}>
        {sortedData.map((item, index) => (
          <div
            key={`${animationKey}-${item.id}`}
            className={cx('value-container')}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className={cx('label')}>{item.name}</span>
            <div className={cx('bar-container')}>
              <div
                className={cx('bar')}
                style={{
                  width: `${(item.count / maxCount) * 100}%`,
                  animationDelay: `${index * 50}ms`,
                }}
              />
              <span className={cx('count')}>{item.count.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default TrendingCard
