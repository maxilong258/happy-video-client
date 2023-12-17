export interface FetchRes<dataType> {
  success: boolean,
  message: string
  data: dataType
}