import { Processor } from '../interfaces/processable'
import { DiscussionNode } from '../interfaces/graphql-outputs'
import { GraphqlProcessor } from './graphql-processor'
import { SimulationResult } from '../interfaces/simulation-result'
import { isBefore } from '../utils/time'
import * as core from '@actions/core'

export interface StaleDiscussionsValidatorProps {
  discussions: DiscussionNode[]
}

export class StaleDiscussionsValidator
  extends GraphqlProcessor
  implements Processor<StaleDiscussionsValidatorProps, DiscussionNode[]>
{
  async process(
    input: StaleDiscussionsValidatorProps
  ): Promise<SimulationResult<DiscussionNode[]>> {
    const daysBeforeClose = new Date()
    daysBeforeClose.setDate(
      daysBeforeClose.getDate() - this.props.daysBeforeClose
    )

    if (this.props.debug) {
      core.debug(
        `Comparing discussion dates with ${daysBeforeClose} days ago, to determine stale state`
      )
    }

    const staleDiscussions = input.discussions.filter(discussion => {
      const discussionUpdatedAt = new Date(discussion.updatedAt)
      return isBefore(discussionUpdatedAt, daysBeforeClose)
    })

    return {
      result: staleDiscussions,
      success: true,
      debug: this.props.debug
    }
  }
}
