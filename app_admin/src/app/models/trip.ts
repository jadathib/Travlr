export interface Trip {
  _id: string, // internal MongoDB primary key
  code: string,
  name: string,
  length: string,
  duration?: number,
  start: Date,
  resort: string,
  perPerson: string,
  image: string[],
  description: string
}
