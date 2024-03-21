import * as core from '@actions/core'
import { GraphqlProcessor } from './graphql-processor'
import { Processor } from '../interfaces/processable'
import {
  GitHubRateLimit,
  WrappedQueryResponse
} from '../interfaces/graphql-outputs'
import { buildFetchRateLimitQuery } from '../query/ratelimit-queries'
import { SimulationResult } from '../interfaces/simulation-result'

export class GitHubRateLimitFetcher
  extends GraphqlProcessor
  implements Processor<undefined, GitHubRateLimit>
{
  async process(): Promise<SimulationResult<GitHubRateLimit>> {
    if (this.props.verbose) {
      core.debug('Fetching rate limit')
    }

    if (this.props.debug) {
      return {
        result: { data: { rateLimit: { limit: -1, remaining: -1 } } },
        success: true,
        debug: true
      }
    }

    const response: WrappedQueryResponse<GitHubRateLimit> =
      await this.executeQuery(buildFetchRateLimitQuery())
    if (response.error) {
      return {
        result: { data: { rateLimit: { limit: -1, remaining: -1 } } },
        success: false,
        debug: this.props.debug,
        error: response.error
      }
    }

    return {
      result: response.data!,
      success: true,
      debug: this.props.debug
    }
  }
}
