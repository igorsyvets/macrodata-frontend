import React from 'react'
import css from './Card.module.css'
import classNames from 'classnames/bind'
import { RingLoader } from 'react-spinners'

const cx = classNames.bind(css)

type Props = {
  children: React.ReactNode
  title: string
  style?: React.CSSProperties
  rightContent?: React.ReactNode
  isLoading?: boolean
}

const Card = ({ children, title, style, rightContent, isLoading }: Props) => {
  return (
    <div className={cx('card')} style={style}>
      <div className={cx('header')}>
        <div>{title}</div>
        <div>{rightContent}</div>
      </div>
      <div className={cx('content')}>
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px',
            }}
          >
            <RingLoader color={'var(--color-main)'} size={80} />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default Card
