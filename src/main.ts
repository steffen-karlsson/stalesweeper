import * as core from '@actions/core'
import { context } from '@actions/github'
import { DiscussionFetcher } from './processors/discussion-processor'
import { DiscussionInputProcessor } from './processors/input-processor'
import { StaleDiscussionsValidator } from './processors/stale-processor'
import { HandleStaleDiscussions } from './processors/handle-stale-processor'
import { GitHubRateLimitFetcher } from './processors/ratelimit-processor'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  const input = new DiscussionInputProcessor()
  const props = await input.process()

  if (props.error) {
    core.setFailed(props.error)
    return
  }
  if (props.debug) {
    core.debug(`Input props: ${JSON.stringify(props.result)}`)
  }

  const inputProps = props.result!
  const rateLimit = new GitHubRateLimitFetcher(inputProps)
  const beforeRateLimit = await rateLimit.process()
  if (beforeRateLimit.error) {
    core.setFailed(beforeRateLimit.error)
    return
  }
  if (inputProps.verbose) {
    core.debug(
      `Rate limit before execution: ${JSON.stringify(beforeRateLimit.result)}`
    )
  }

  const fetcher = new DiscussionFetcher(inputProps)
  const discussions = await fetcher.process({
    owner: context.repo.owner,
    repo: context.repo.repo
  })

  if (discussions.error) {
    core.setFailed(discussions.error)
    return
  }
  if (inputProps.verbose) {
    core.debug(`Fetched discussions: ${JSON.stringify(discussions.result)}`)
  }

  const staleValidator = new StaleDiscussionsValidator(inputProps)
  const staleDiscussions = await staleValidator.process(discussions.result)

  if (staleDiscussions.error) {
    core.setFailed(staleDiscussions.error)
    return
  }
  if (inputProps.verbose) {
    core.debug(`Stale discussions: ${JSON.stringify(staleDiscussions.result)}`)
  }

  const staleHandler = new HandleStaleDiscussions(inputProps)
  const handledStaleDiscussions = await staleHandler.process({
    discussions: staleDiscussions.result,
    owner: context.repo.owner,
    repo: context.repo.repo
  })

  if (handledStaleDiscussions.error) {
    core.setFailed(handledStaleDiscussions.error)
    return
  }
  if (inputProps.verbose) {
    core.debug(
      `Processed stale discussions: ${JSON.stringify(handledStaleDiscussions.result)}`
    )
  }

  const afterRateLimit = await rateLimit.process()
  if (afterRateLimit.error) {
    core.setFailed(afterRateLimit.error)
    return
  }
  if (inputProps.verbose) {
    core.debug(
      `Rate limit after execution: ${JSON.stringify(afterRateLimit.result)}`
    )
  }

  core.setOutput('stale-discussions', handledStaleDiscussions.result)
}
