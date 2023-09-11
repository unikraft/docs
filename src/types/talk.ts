export interface Presenter {
  avatar_url: string
  name: string
  url: string
  affiliation: string
  login: string
}

export interface Talk {
  title: string
  year: number
  presenters: Presenter[]
  slides: string
  video: string
  url: string
  thumbnail: string
  venue: string
}
