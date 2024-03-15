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
    if (this.props.debug) {
      core.debug(
        `Comparing discussion dates with ${this.props.threshold}, to determine stale state`
      )
    }

    const staleDiscussions = input.discussions.filter(discussion => {
      const discussionUpdatedAt = new Date(discussion.updatedAt)
      return isBefore(discussionUpdatedAt, this.props.threshold)
    })

    return {
      result: staleDiscussions,
      success: true,
      debug: this.props.debug
    }
  }
}
