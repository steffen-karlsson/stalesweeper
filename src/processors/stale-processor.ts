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
  implements Processor<DiscussionNode[], DiscussionNode[]>
{
  async process(
    discussions: DiscussionNode[]
  ): Promise<SimulationResult<DiscussionNode[]>> {
    if (this.props.debug) {
      core.debug(
        `Comparing discussion dates with ${this.props.threshold}, to determine stale state`
      )
    }

    const staleDiscussions = discussions.filter(discussion => {
      if (
        discussion.category.isAnswerable &&
        !this.props.closeUnanswered &&
        !discussion.isAnswered
      ) {
        return false
      }

      if (
        this.props.category &&
        discussion.category.name !== this.props.category
      ) {
        return false
      }

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
