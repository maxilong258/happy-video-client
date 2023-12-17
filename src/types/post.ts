import { User } from "./user"

export interface Post {
  id: number
  type: 'video' | 'painting'
  title: string
  introduct: string
  coverPic: string
  linkUrl?: string
  source?: string
  likes: number
  views: number
  createTime: Date
  user: User
  isLiked: boolean
  isSaved: boolean
}