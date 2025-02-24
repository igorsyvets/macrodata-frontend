import React, { useState, useRef, useEffect, MutableRefObject } from 'react'
import css from './SecondaryNavigation.module.css'
import classNames from 'classnames/bind'
import { Tweet } from '../../../types/types'
import { AlignJustify } from 'react-feather'
import { AudioVisualizer } from 'react-audio-visualize'

const cx = classNames.bind(css)

type Props = {
  currentTopic: string
  onCurrentTopicChange: (topic: string) => void
  onCTAClick: () => void
  tweets: Tweet[]
  isLoading?: boolean
  isPlaying?: boolean
  audioBlob: Blob | null
}

const SecondaryNavigation = ({
  currentTopic,
  onCurrentTopicChange,
  onCTAClick,
  tweets,
  isLoading,
  isPlaying,
  audioBlob,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newTopic, setNewTopic] = useState(currentTopic)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)
  const baseSpeed = 50 // pixels per second

  const handleEditClick = () => setIsEditing(true)
  const handleSaveClick = () => {
    onCurrentTopicChange(newTopic)
    setIsEditing(false)
  }
  const handleCancelClick = () => {
    setNewTopic(currentTopic)
    setIsEditing(false)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewTopic(e.target.value)

  useEffect(() => {
    if (!contentRef.current) return

    const updateWidth = () => {
      if (!contentRef.current) return
      const width = contentRef.current.scrollWidth / 2 // Divide by 2 because we duplicate content
      setContentWidth(width)

      // Calculate duration based on content width and desired speed
      const duration = width / baseSpeed
      contentRef.current.style.setProperty('--translate', `-${width}px`)
      contentRef.current.style.setProperty('--duration', `${duration}s`)
    }

    // Initial measurement
    updateWidth()

    // Setup resize observer
    const observer = new ResizeObserver(updateWidth)
    observer.observe(contentRef.current)

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current)
      }
    }
  }, [tweets])

  const tickerContent = tweets.map((tweet, index) => (
    <React.Fragment key={index}>
      <div className={cx('ticker-item')}>
        <div className={cx('username')}>@{tweet.username}</div>
        <div>{tweet.text}</div>
      </div>
      <div className={cx('dot')} />
    </React.Fragment>
  ))

  console.log('isPlaying', isPlaying)

  return (
    <div
      style={{
        display: 'flex',
        padding: '0 8px',
        height: '56px',
        margin: '40px 0 4px',
        gap: '16px',
      }}
    >
      <div className={cx('header')}>
        {isEditing ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <input type="text" value={newTopic} onChange={handleInputChange} />
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </div>
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>{currentTopic}</div>
            <button onClick={handleEditClick}>Edit</button>
          </div>
        )}
      </div>
      <div className={cx('ticker-wrapper')}>
        <div className={cx('ticker')}>
          <div
            ref={contentRef}
            className={cx('ticker-content')}
            style={{
              opacity: isLoading ? 0 : 1,
            }}
          >
            {tickerContent}
            {tickerContent} {/* Duplicate for seamless loop */}
          </div>
        </div>
      </div>

      <div
        className={cx('call-to-action-wrapper')}
        style={{
          opacity: isLoading ? 0.5 : 1,
        }}
      >
        <div
          className={cx('call-to-action')}
          onClick={() => {
            if (!isLoading) onCTAClick()
          }}
        >
          <span>Board Report</span>
        </div>
      </div>
    </div>
  )
}

export default SecondaryNavigation
