import React from 'react'
import css from './SecondaryNavigation.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(css)

type Props = {
  currentTopic: string
  onCurrentTopicChange: (topic: string) => void
}

const SecondaryNavigation = ({ currentTopic }: Props) => {
  return <div className={cx('header')}>{currentTopic}</div>
}

export default SecondaryNavigation
