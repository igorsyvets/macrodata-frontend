import React from 'react'
import css from './Card.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(css)

type Props = {
  children: React.ReactNode
  title: string
  style?: React.CSSProperties
  rightContent?: React.ReactNode
}

const Card = ({ children, title, style, rightContent }: Props) => {
  return (
    <div className={cx('card')} style={style}>
      <div className={cx('header')}>
        <div>{title}</div>
        <div>{rightContent}</div>
      </div>
      <div className={cx('content')}>{children}</div>
    </div>
  )
}

export default Card
