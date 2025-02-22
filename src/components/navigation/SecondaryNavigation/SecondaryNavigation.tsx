import React from 'react'
import css from './SecondaryNavigation.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(css)

type Props = {}

const SecondaryNavigation = (props: Props) => {
  return <div className={cx('header')}>Apple Inc</div>
}

export default SecondaryNavigation
