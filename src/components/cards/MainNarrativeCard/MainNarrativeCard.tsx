import React from 'react'
import css from './MainNarrativeCard.module.css'
import classNames from 'classnames/bind'
import Card from '../Card/Card'
import { DateTime } from 'luxon'

const cx = classNames.bind(css)

type Props = {
  title: string
  summary: string
}

const MainNarrativeCard = ({ title, summary }: Props) => {
  const todayDate = DateTime.now().toFormat('MMMM dd, yyyy')

  return (
    <Card title="Main Narrative" style={{ flex: 1 }}>
      <div className={cx('content')}>
        <div className={cx('section')}>
          <div className={cx('theme')}>{title}</div>
        </div>
        <div className={cx('stats')}>{todayDate}</div>
        <div className={cx('section')}>
          <div className={cx('section-content')}>{summary}</div>
        </div>
      </div>
    </Card>
  )
}

export default MainNarrativeCard
