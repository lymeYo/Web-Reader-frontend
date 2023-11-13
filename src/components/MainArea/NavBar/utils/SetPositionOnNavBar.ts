import { navbarId } from '../constants'

const setPositionOnNavBar = (element: HTMLElement) => {
  const navbarEl = document.getElementById(navbarId)
  if (!navbarEl) return
  const navbarHeight = navbarEl.clientHeight
  const windowHeight = window.innerHeight
  if (windowHeight > navbarHeight) element.style.top = (windowHeight - navbarHeight) / 2 + 'px'
  else element.style.top = '0px'
}

export default setPositionOnNavBar