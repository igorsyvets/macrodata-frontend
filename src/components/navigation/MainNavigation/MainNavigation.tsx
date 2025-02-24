import classNames from 'classnames/bind'
import css from './MainNavigation.module.css'
import { useState, useEffect } from 'react'
import { RefreshCcw } from 'react-feather'

const cx = classNames.bind(css)

type Props = {
  isLoading?: boolean
  onRefresh: () => void
}

const MainNavigation = ({ isLoading, onRefresh }: Props) => {
  const [dots, setDots] = useState('')

  const [loadingTime, setLoadingTime] = useState(0)

  // Handle loading timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLoading) {
      setLoadingTime(0)
      interval = setInterval(() => {
        setLoadingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLoading])

  const formatLoadingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  useEffect(() => {
    if (!isLoading) {
      setDots('')
      return
    }

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 500)

    return () => clearInterval(interval)
  }, [isLoading])

  return (
    <div className={cx('header')}>
      <div className={cx('logo')}>
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
      <div className={cx('loading')}>
        {isLoading ? (
          `${dots}Refining (${formatLoadingTime(loadingTime)})`
        ) : (
          <div
            onClick={() => onRefresh()}
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
        )}
      </div>
    </div>
  )
}

export default MainNavigation
