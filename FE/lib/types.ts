export interface Marathon {
  _id: string
  name: string
  location: string
  date: string
  organizer: string
  description?: string
  link?: string
}

export interface MarathonInput {
  name: string
  location: string
  date: string
  organizer: string
  description?: string
  link?: string
}
