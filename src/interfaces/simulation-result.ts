export interface SimulationResult<T> {
  result: T
  success: boolean
  error?: Error
  debug: boolean
}
