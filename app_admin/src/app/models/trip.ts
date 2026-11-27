export interface Trip {
  _id: string, // internal MongoDB primary key
  code: string,
  name: string,
  length: string,
  duration?: number,
  start: Date,
  startDate?: Date,
  resort: string,
  destination?: string,
  perPerson: string,
  price?: number,
  image: string[],
  images?: string[],
  description: string
}
