import { useEffect, useMemo, useRef, useState } from 'react'
import ArrowImg from '@/assets/images/arrow-left.png'
import Battery20Img from '@/assets/images/battery/battery-20.png'
import Battery40Img from '@/assets/images/battery/battery-40.png'
import Battery60Img from '@/assets/images/battery/battery-60.png'
import Battery80Img from '@/assets/images/battery/battery-80.png'
import Battery100Img from '@/assets/images/battery/battery-100.png'

import styles from './styles.module.css'
import { getBookStore } from '@/store'
import { observer } from 'mobx-react-lite'

const InfoRow = observer(() => {
  const [batteryLvl, setBatteryLvl] = useState<number | null>(null)
  const bookNameElRef = useRef<HTMLSpanElement>(null)
  const { toc, handleCfiGoBack, isPageJumped } = getBookStore()
  const bookTitle = toc ? toc[0].title : ''

  useEffect(() => {
    (navigator as any).getBattery()?.then((battery: any) => {
      setBatteryLvl(battery.level ?? null)
      battery.onlevelchange = (e: any) => {
        setBatteryLvl(e.currentTarget.level ?? null)
      }
    })
  }, [])

  const batteryImageSrc = useMemo(() => {
    if (!batteryLvl) return ''
    if (batteryLvl >= 0.8) return Battery100Img.src
    if (batteryLvl >= 0.6) return Battery80Img.src
    if (batteryLvl >= 0.4) return Battery60Img.src
    if (batteryLvl >= 0.2) return Battery40Img.src
    return Battery20Img.src
  }, [batteryLvl])

  const handleGoBack = () => {
    handleCfiGoBack()
  }

  return (
    <div className={styles.row}>
      {/* TODO */}
      <div className={styles['book-info']}>
        <div
          onClick={handleGoBack}
          className={`${styles['go-back']} ${isPageJumped ? '' : styles.none}`}
        >
          <img className={styles['back-img']} src={ArrowImg.src} alt='arrow' />
          <span>назад</span>
        </div>
        <span className={styles['book-name']} ref={bookNameElRef}>
          {bookTitle}
        </span>
      </div>
      <img src={batteryImageSrc} alt='' className={styles['battery-image']} />
    </div>
  )
})
export default InfoRow
