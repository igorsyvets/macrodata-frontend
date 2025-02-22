import React from 'react'
import css from './MainNarrativeCard.module.css'
import classNames from 'classnames/bind'
import Card from '../Card/Card'

const cx = classNames.bind(css)

type Props = {}

const MainNarrativeCard = (props: Props) => {
  return (
    <Card title="Main Narrative" style={{ flex: 1 }}>
      <div className={cx('content')}>
        <div className={cx('section')}>
          <div className={cx('theme')}>AI Partnerships and Product Expansion</div>
        </div>
        <div className={cx('stats')}>2,034 posts</div>
        <div className={cx('section')}>
          <h3>Summary</h3>
          <div className={cx('section-content')}>
            Apple Inc. has been in the spotlight for accelerating its AI strategy in China through
            partnerships with Alibaba and Baidu, aiming to roll out Apple Intelligence features by
            May 2025. Alibaba will adapt and censor AI outputs to comply with Chinese regulations,
            while Baidu will power features like Visual Intelligence and possibly a localized Siri,
            addressing Apple’s need to regain market share lost to Huawei and Vivo. Alongside this,
            Apple unveiled the $599 iPhone 16e, a budget-friendly model with AI capabilities, and an
            updated iPhone SE, targeting mid-market consumers in China and beyond.
          </div>
        </div>
      </div>
    </Card>
  )
}

export default MainNarrativeCard
