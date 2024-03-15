export function buildFetchAllDiscussionsQuery(
  owner: string,
  repo: string,
  cursor: string | null
): string {
  return `
query {
  repository(owner: "${owner}", name: "${repo}") {
    discussions(first: 20, answered: true, states: OPEN, after: ${cursor}) {
      nodes {
        id
        number
        updatedAt
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

export function buildCloseDiscussionQuery(discussionId: string): string {
  return `
mutation {
  closeDiscussion(input:{discussionId: "${discussionId}"}) {
    discussion{id}
  }
}`
}
