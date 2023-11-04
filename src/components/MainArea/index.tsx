import { useState } from 'react'
import BookArea from './BookArea'
import FileArea from './FileArea'
import { observer } from 'mobx-react-lite'
import { getBookStore, getUserStore } from '@/store'
import NavBar from './NavBar'
import InfoRow from './InfoRow'

const MainArea = observer(() => {
  const { isBookRefLoad } = getBookStore()
  const [isNavBarOpen, setNavBarOpen] = useState(true)
  const handleNavBarOpen = (isOpen?: boolean) => {
    if (isOpen == undefined) {
      setNavBarOpen((prev) => !prev)
    } else {
      setNavBarOpen(isOpen)
    }
  }

  return (
    <>
      <NavBar isOpen={isNavBarOpen} handleOpen={handleNavBarOpen} />
      {isBookRefLoad ? <BookArea handleNavBarOpen={handleNavBarOpen} /> : <FileArea />}
      <InfoRow />
    </>
  )
})
export default MainArea
