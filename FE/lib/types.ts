export interface Marathon {
  _id: string
  name: string
  location: string
  date: string
  organizer: string
  description?: string
  link?: string
  rating?: {
    average: number
    count: number
  }
}

export interface MarathonInput {
  name: string
  location: string
  date: string
  organizer: string
  description?: string
  link?: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
}

export interface Rating {
  _id: string
  raceId: string
  userId: string
  rating: number
  createdAt: string
}

export interface RatingInput {
  userId: string
  rating: number
}

export interface Review {
  _id: string
  raceId: string
  userId: string
  userName: string
  comment: string
  createdAt: string
  updatedAt: string
}

export interface ReviewInput {
  userId: string
  userName: string
  comment: string
}

export interface ReviewResponse {
  reviews: Review[]
  count: number
}
