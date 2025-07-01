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
  createdBy?: string
  createdAt?: string
  status?: 'on-going' | 'cancelled'
}

export interface MarathonInput {
  name: string
  location: string
  date: string
  organizer: string
  description?: string
  link?: string
  createdBy?: string
  status?: 'on-going' | 'cancelled'
}

export interface User {
  _id: string
  name: string
  email: string
  role: 'runner' | 'enterprise'
  createdAt?: string
}

export interface UserInput {
  name: string
  email: string
  password: string
  role: 'runner' | 'enterprise'
}

export interface LoginInput {
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

export interface Application {
  _id: string
  raceId: string
  runnerId: string
  runnerName: string
  status: 'on-going' | 'cancelled'
  appliedAt: string
}

export interface ApplicationInput {
  runnerId: string
  runnerName: string
}

export interface ApplicationResponse {
  applications: Application[]
  count: number
}
