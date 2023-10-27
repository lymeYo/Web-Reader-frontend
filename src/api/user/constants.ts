export const getErrorMessage = (status: number) => {
  if (status == 401) return 'Неверные данные для входа!'
  if (status == 403) return 'Сессия устарела!'
  if (status == 409) return 'Имя занято!'
  return 'Сервер недосутпен'
}

export type TuserData = {
  bookRef: string | null
  epubCfi: string | null
  id: number
  password: string
  username: string
}

export type TuserErrorData = {
  errMessage: ReturnType<typeof getErrorMessage>
}

export type TtokenData = string
export type TtokenErrorData = {
  errStatus: number
}
export const isTokenResError = (token: any): token is TtokenErrorData => token.errStatus

export const isUserResError = (user: any): user is TuserErrorData => user.errMessage
