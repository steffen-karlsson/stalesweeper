import {
  DiscussionNode,
  DiscussionsQueryResponse,
  WrappedQueryResponse
} from '../interfaces/graphql-outputs'
import { GraphqlProcessor } from './graphql-processor'
import { Processor } from '../interfaces/processable'
import { SimulationResult } from '../interfaces/simulation-result'
import {
  buildCloseDiscussionQuery,
  buildDiscussionAddCommentQuery
} from '../query/discussion-queries'
import * as core from '@actions/core'

export interface HandleStaleDiscussionsProps {
  discussions: DiscussionNode[]
  owner: string
  repo: string
}

export class HandleStaleDiscussions
  extends GraphqlProcessor
  implements Processor<HandleStaleDiscussionsProps, DiscussionNode[]>
{
  async process(
    input: HandleStaleDiscussionsProps
  ): Promise<SimulationResult<DiscussionNode[]>> {
    for (const discussion of input.discussions) {
      if (this.props.verbose) {
        core.debug(
          `Adding comment and closing discussion with id #${discussion.number}`
        )
      }

      if (this.props.debug) {
        continue
      }

      if (this.props.message && this.props.message !== '') {
        const commentResponse: WrappedQueryResponse<DiscussionsQueryResponse> =
          await this.executeQuery(
            buildDiscussionAddCommentQuery(discussion.id, this.props.message)
          )
        if (commentResponse.error) {
          return {
            result: [],
            success: false,
            debug: this.props.debug,
            error: commentResponse.error
          }
        }
      }

      const closeResponse: WrappedQueryResponse<DiscussionsQueryResponse> =
        await this.executeQuery(
          buildCloseDiscussionQuery(discussion.id, this.props.closeReason)
        )
      if (closeResponse.error) {
        return {
          result: [],
          success: false,
          debug: this.props.debug,
          error: closeResponse.error
        }
      }
    }

    return {
      result: input.discussions,
      success: true,
      debug: this.props.debug
    }
  }
}
