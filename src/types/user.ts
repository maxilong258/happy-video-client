export interface User {
  id?: number
  username: string
  email: string
  password?: string
  settings?: {
    theme: string
  }
  userProfile: {
    avatar: string
    country: string
    address: string
    birthday: string
    background: string
    introduction: string
    subscribers: number
  }
  token?: string
}
