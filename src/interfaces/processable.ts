import { SimulationResult } from './simulation-result'

export interface Processor<Input, Output> {
  process(input: Input | undefined): Promise<SimulationResult<Output>>
}
