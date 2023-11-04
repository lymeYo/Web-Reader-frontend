export type TdisplayMode = 'toc' | 'books'

export type TshowConfirmPanel = (
  isPanelOpen?: boolean,
  callback?: () => void,
  message?: string
) => void
