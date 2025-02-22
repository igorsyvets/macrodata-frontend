import classNames from 'classnames/bind'
import css from './MainNavigation.module.css'

const cx = classNames.bind(css)

type Props = {}

const MainNavigation = (props: Props) => {
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
    </div>
  )
}

export default MainNavigation
