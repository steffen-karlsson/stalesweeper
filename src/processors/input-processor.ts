import { Processor } from '../interfaces/processable'
import { DiscussionInputProps } from '../interfaces/discussion-inputs'
import { SimulationResult } from '../interfaces/simulation-result'
import * as core from '@actions/core'
import { DiscussionPropsValidationError } from '../errors/discussion-props-validation-error'
import { DiscussionCloseReason } from '../interfaces/graphql-outputs'

interface RawDiscussionInputProps {
  repoToken: string
  message: string
  daysBeforeClose: number
  category: string | undefined
  closeReason: string
}

export class DiscussionInputProcessor
  implements Processor<undefined, DiscussionInputProps | undefined>
{
  async process(): Promise<SimulationResult<DiscussionInputProps | undefined>> {
    const repoToken = core.getInput('repo-token')
    const message = core.getInput('message')
    const daysBeforeClose = parseInt(core.getInput('days-before-close'))
    const category = core.getInput('category')
    const closeUnanswered = core.getInput('close-unanswered') === 'true'
    const closeReason = core.getInput('close-reason')
    const verbose = core.getInput('verbose') === 'true'
    const debug = core.getInput('dry-run') === 'true'

    const raw: RawDiscussionInputProps = {
      repoToken,
      message,
      daysBeforeClose,
      category,
      closeReason: closeReason.toUpperCase()
    }

    const threshold = new Date()
    threshold.setDate(threshold.getDate() - daysBeforeClose)

    try {
      this._validateProps(raw)
    } catch (error) {
      return {
        result: undefined,
        error: error as Error,
        success: false,
        debug
      }
    }

    return {
      result: {
        repoToken,
        message,
        threshold,
        category: category === '' ? undefined : category,
        closeUnanswered,
        closeReason: raw.closeReason as DiscussionCloseReason,
        verbose,
        debug
      } as DiscussionInputProps,
      success: true,
      debug
    }
  }

  _validateProps(
    props: RawDiscussionInputProps
  ): DiscussionPropsValidationError | undefined {
    if (isNaN(props.daysBeforeClose)) {
      throw new DiscussionPropsValidationError(
        `Option "${props.daysBeforeClose}" did not parse to a valid number`
      )
    }

    switch (props.closeReason) {
      case 'DUPLICATE':
      case 'OUTDATED':
      case 'RESOLVED':
        return
      default:
        throw new DiscussionPropsValidationError(
          `Invalid DiscussionCloseReason: ${props.closeReason}`
        )
    }
  }
}
