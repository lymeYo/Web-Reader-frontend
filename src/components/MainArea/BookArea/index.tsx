import { useEffect, useMemo, useRef } from 'react'
import Epub, { Rendition } from 'epubjs'
import { observer } from 'mobx-react-lite'
import { getBookStore } from '@/store'
import type Navigation from 'epubjs/types/navigation'

import styles from './styles.module.css'

interface BookAreaProps {
  handleNavBarOpen: (isOpen: boolean) => void
}

const BookArea = observer(({ handleNavBarOpen }: BookAreaProps) => {
  const { bookRef, setToc, curCfi, isCopyAllow, setBookName, theme, setCfi } = getBookStore()

  const renditionReactRef = useRef<Rendition>()
  const isCopyAllowRef = useRef<boolean>(isCopyAllow)
  const lastCfiOperationRef = useRef<'jump' | 'step'>(null) // step - перелистывание страницы, jump - переход с оглавления

  useMemo(() => {
    isCopyAllowRef.current = isCopyAllow
  }, [isCopyAllow])

  //создание и отображение книги и rendition
  useEffect(() => {
    if (!bookRef) return

    const book = Epub(bookRef)
    renditionReactRef.current = book.renderTo('book-area', {
      flow: 'paginated'
    })
    renditionReactRef.current.display(curCfi || undefined)

    book.loaded.navigation.then((nav: Navigation) => {
      console.log(nav)
      const bookName = nav.toc[0].label
      setBookName(bookName)

      setToc(
        nav.toc.map((toc) => ({
          title: toc.label,
          href: toc.href
        }))
      )
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

    // rendition.on('selected', function (cfiRange: any, contents: any) {
    //   rendition.annotations.highlight(cfiRange, {}, (e: any) => {
    //     console.log('highlight clicked', e)
    //   })
    //   contents.window.getSelection().removeAllRanges()
    // })

    rendition.themes.default({
      body: {
        margin: '20px'
      },
      '::selection': {
        background: 'rgba(255,255,0, 0.3)'
      },
      '.epubjs-hl': {
        fill: 'yellow',
        'fill-opacity': '0.3',
        'mix-blend-mode': 'multiply'
      }
    })

    rendition.themes.register('dark', {
      body: { color: '#bababa', padding: '20px' },
      h1: {
        'background-color': '#333333 !important'
      }
    })

    rendition.themes.register('light', {
      body: { color: '#000000', padding: '20px' }
    })
    // setInterval(() => {
    // setTimeout(async () => {
    //   // rendition.display('epubcfi(/6/20!/4/14/1:0)')
    //   console.log((rendition.currentLocation() as any).start.cfi)
    //   await rendition.display('index_split_004.xhtml')
    //   // rendition.display(10)
    //   // rendition.next()
    //   await rendition.reportLocation()
    //   console.log((rendition.currentLocation() as any).start.cfi)
    // }, 3000)

    return () => {
      document.removeEventListener('keydown', handleDocumentKey)
    }
  }, [])

  useEffect(() => {
    const rendition = renditionReactRef.current
    if (!rendition) return

    theme == 'dark' ? rendition.themes.select('dark') : rendition.themes.select('light')
  }, [theme])

  useEffect(() => {
    const rendition = renditionReactRef.current
    if (!rendition) return

    const handleDisplay = async () => {
      await rendition.reportLocation()
      const isCfiDisplayedAlready =
        (rendition.currentLocation() as any).start.cfi == curCfi ||
        (rendition.currentLocation() as any).end.cfi == curCfi

      if (!isCfiDisplayedAlready && curCfi) rendition.display(curCfi)
    }
    handleDisplay()
  }, [curCfi])

  return <div id='book-area'></div>
})
export default BookArea
