import React from 'react'
import css from './MainNarrativeCard.module.css'
import classNames from 'classnames/bind'
import Card from '../Card/Card'
import { Topic, TweetThemeAnalysis } from '../../../types/types'
import useMainNarrative from '../../../hooks/useMainNarrative'

const cx = classNames.bind(css)

type Props = {
  trendingTweets: TweetThemeAnalysis
}

const MainNarrativeCard = ({ trendingTweets }: Props) => {
  const { data, isLoading, error } = useMainNarrative()

  if (isLoading || !data || !data.themes) {
    return (
      <Card title="Main Narrative" style={{ flex: 1 }}>
        <div className={cx('content')}>Loading...</div>
      </Card>
    )
  }

  const { summary, themes } = data

  const { summaryTitle } = data
  const totalPosts = trendingTweets.themes.reduce((sum, theme) => sum + theme.count, 0)

  return (
    <Card title="Main Narrative" style={{ flex: 1 }}>
      <div className={cx('content')}>
        <div className={cx('section')}>
          <div className={cx('theme')}>{summaryTitle}</div>
        </div>
        <div className={cx('stats')}>{totalPosts} posts</div>
        <div className={cx('section')}>
          <div className={cx('section-content')}>{summary}</div>
        </div>
      </div>
    </Card>
  )
}

export default MainNarrativeCard
