import { Processor } from '../interfaces/processable'
import { DiscussionInputProps } from '../interfaces/discussion-inputs'
import { SimulationResult } from '../interfaces/simulation-result'
import * as core from '@actions/core'
import { DiscussionPropsValidationError } from '../errors/discussion-props-validation-error'
import { DiscussionCloseReason } from '../interfaces/graphql-outputs'

export class DiscussionInputProcessor
  implements Processor<undefined, DiscussionInputProps>
{
  async process(): Promise<SimulationResult<DiscussionInputProps>> {
    const repoToken = core.getInput('repo-token')
    const message = core.getInput('message')
    const daysBeforeClose = parseInt(core.getInput('days-before-close'))
    const closeReason = core.getInput('close-reason')
    const debug = core.getInput('debug') === 'true'

    const result: DiscussionInputProps = {
      repoToken,
      message,
      daysBeforeClose,
      closeReason: closeReason.toUpperCase() as DiscussionCloseReason,
      debug
    }

    return {
      result,
      error: this._validateProps(result),
      success: true,
      debug
    }
  }

  _validateProps(props: DiscussionInputProps): Error | undefined {
    if (isNaN(props.daysBeforeClose)) {
      return new DiscussionPropsValidationError(
        `Option "${props.daysBeforeClose}" did not parse to a valid number`
      )
    }
  }
}
