import { DiscussionCloseReason } from '../interfaces/graphql-outputs'

export function buildFetchAllDiscussionsQuery(
  owner: string,
  repo: string,
  cursor: string | null
): string {
  return `
query {
  repository(owner: "${owner}", name: "${repo}") {
    discussions(first: 20, states: OPEN, after: ${cursor}) {
      nodes {
        id
        number
        updatedAt
        isAnswered
        category {
          name
          isAnswerable
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`
}

export function buildDiscussionAddCommentQuery(
  discussionId: string,
  message: string
): string {
  return `
mutation {
  addDiscussionComment(input:{body: "${message}" , discussionId: "${discussionId}"}) {
    comment{id}
  }
}`
}

export function buildCloseDiscussionQuery(
  discussionId: string,
  reason: DiscussionCloseReason): string {
  return `
mutation {
  closeDiscussion(input:{discussionId: "${discussionId}", reason: "${reason as string}"}) {
    discussion{id}
  }
}`
}
