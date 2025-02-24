import classNames from 'classnames/bind'
import css from './MainNavigation.module.css'
import { useState, useEffect } from 'react'

const cx = classNames.bind(css)

type Props = {
  isLoading?: boolean
}

const MainNavigation = ({ isLoading }: Props) => {
  const [dots, setDots] = useState('')

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
      <div className={cx('loading')}>{isLoading ? `${dots}Refining` : ''}</div>
    </div>
  )
}

export default MainNavigation
