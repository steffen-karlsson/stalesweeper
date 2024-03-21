import { getOctokit } from '@actions/github'
import { GraphqlResponseError } from '@octokit/graphql'
import { WrappedQueryResponse } from '../interfaces/graphql-outputs'
import { DiscussionInputProps } from '../interfaces/discussion-inputs'

export abstract class GraphqlProcessor {
  readonly props: DiscussionInputProps
  readonly octokit: ReturnType<typeof getOctokit>
  readonly authedGraphQL

  constructor(props: DiscussionInputProps) {
    this.props = props
    this.octokit = getOctokit(props.repoToken)
    this.authedGraphQL = this.octokit.graphql.defaults({
      headers: {
        authorization: `token ${this.props.repoToken}`
      }
    })
  }

  async executeQuery<T>(query: string): Promise<WrappedQueryResponse<T>> {
    try {
      const response: T = await this.authedGraphQL(query)
      return {
        data: response
      }
    } catch (error) {
      let errorResponse: Error = {
        name: 'UnknownError',
        message: 'Unknown message'
      }

      if (error instanceof GraphqlResponseError) {
        errorResponse = {
          name: error.response.errors[0].type,
          message: error.response.errors[0].message
        }
      } else if (error instanceof Error) {
        errorResponse = {
          name: error.name,
          message: error.message
        }
      }

      return {
        data: null,
        error: errorResponse
      }
    }
  }
}
