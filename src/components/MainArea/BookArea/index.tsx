import { useEffect, useMemo, useRef } from 'react'
import Epub, { Book, Rendition } from 'epubjs'
import { observer } from 'mobx-react-lite'
import { getBookStore, getUIStore } from '@/store'
import type Navigation from 'epubjs/types/navigation'

import styles from './styles.module.css'

interface BookAreaProps {
  handleNavBarOpen: (isOpen: boolean) => void
}

const BookArea = observer(({ handleNavBarOpen }: BookAreaProps) => {
  const { bookRef, setToc, curCfi, setCfi, setChapterInfo } = getBookStore()
  const { isCopyAllow, theme, isAnyInputActive } = getUIStore()

  const renditionReactRef = useRef<Rendition>()
  const bookReactRef = useRef<Book>()
  const bookAreaElRef = useRef<HTMLDivElement>(null)
  const isCopyAllowRef = useRef<boolean>(isCopyAllow)

  useMemo(() => {
    isCopyAllowRef.current = isCopyAllow
  }, [isCopyAllow])

  //создание и отображение книги и rendition
  useEffect(() => {
    if (bookAreaElRef.current?.innerHTML) bookAreaElRef.current.innerHTML = ''
    if (!bookRef || !bookAreaElRef.current) return

    const book = Epub(bookRef)
    bookReactRef.current = book

    renditionReactRef.current = book.renderTo(bookAreaElRef.current.id, {
      flow: 'paginated'
    })
    renditionReactRef.current.display(curCfi || undefined)

    book.loaded.navigation.then((nav: Navigation) => {
      console.log(nav)
      setToc(
        nav.toc.map((toc) => ({
          title: toc.label,
          href: toc.href
        }))
      )
    })
    book.ready.then(() => {
      // book.locations.generate(3506391).then(console.log)
      // if (renditionReactRef.current?.currentLocation) console.log(renditionReactRef.current?.currentLocation)
    })
    console.log(book, renditionReactRef.current)
  }, [bookRef])

  // настройка rendition
  useEffect(() => {
    const rendition = renditionReactRef.current
    if (!rendition) return

    const changePage = async (type: 'prev' | 'next') => {
      await rendition[type]()
      await rendition.reportLocation()
      const startCfi = (rendition.currentLocation() as any).start.cfi
      setCfi(startCfi)
    }

    const handleClickByHalf = async (screenX: number) => {
      const maxScreenX = (rendition.getContents() as any)[0].width()
      if (screenX < (maxScreenX * 1) / 3) await changePage('prev') // влево при нажатии на первую треть экрана
      if (screenX > (maxScreenX * 2) / 3) await changePage('next') // вправо при нажатии на тертью треть экрана
    }

    const handleDocumentKey = (event: KeyboardEvent) => {
      if (isAnyInputActive()) return
      if (event.code == 'ArrowLeft') changePage('prev')
      if (event.code == 'ArrowRight') changePage('next')
    }
    window.addEventListener('keydown', handleDocumentKey)

    const iframeCLickListener = (cfiRange: any, contents: any) => {
      if (isCopyAllowRef.current) return

      handleNavBarOpen(false)
      handleClickByHalf(cfiRange.screenX)
    }

    rendition.on('rendered', (e: any, i: any) => {
      i.document.addEventListener('keydown', handleDocumentKey)
      i.document.documentElement.addEventListener('click', iframeCLickListener)
    })

    rendition.themes.default({
      body: {
        margin: '20px',
        padding: '20px'
      }
    })

    rendition.themes.register('dark', {
      body: { color: '#bababa !important' },
      h1: {
        'background-color': '#333333 !important'
      },
      h5: {
        'background-color': '#333333 !important'
      }
    })

    rendition.themes.register('light', {
      body: { color: '#000000 !important' },
      h1: {
        'background-color': '#ffffff !important'
      },
      h5: {
        'background-color': '#ffffff !important'
      }
    })

    return () => {
      document.removeEventListener('keydown', handleDocumentKey)
    }
  }, [bookRef])

  useEffect(() => {
    const rendition = renditionReactRef.current
    const book = bookReactRef.current
    if (!rendition || !book) return
    theme == 'dark' ? rendition.themes.select('dark') : rendition.themes.select('light')
  }, [theme])

  //установление страниц текущей главы
  const handleChapterInfo = () => {
    const rendition = renditionReactRef.current
    if (!rendition) return
    rendition.reportLocation().then(() => {
      const currentLocation = rendition.currentLocation() as any
      setChapterInfo(
        currentLocation.start.displayed.page,
        currentLocation.end.displayed.page,
        currentLocation.start.displayed.total
      )

      const isCfiDisplayedAlready =
        (rendition.currentLocation() as any).start.cfi == curCfi ||
        (rendition.currentLocation() as any).end.cfi == curCfi

      if (!isCfiDisplayedAlready && curCfi) rendition.display(curCfi)
    })
  }

  useEffect(handleChapterInfo, [bookRef, curCfi])
  useEffect(() => {
    window.addEventListener('resize', () => {
      setTimeout(handleChapterInfo, 3000)
    })
  }, [])

  return <div id='book-area' ref={bookAreaElRef}></div>
})
export default BookArea
