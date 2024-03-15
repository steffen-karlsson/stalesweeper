import {
  buildCloseDiscussionQuery,
  buildDiscussionAddCommentQuery,
  buildFetchAllDiscussionsQuery
} from '../../src/query/discussion-queries'

describe('queries', () => {
  it('generate fetch all discussions', async () => {
    const query = buildFetchAllDiscussionsQuery('my-owner', 'my-repo', null)
    expect(query).toEqual(`
query {
  repository(owner: "my-owner", name: "my-repo") {
    discussions(first: 20, states: OPEN, after: null) {
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
}`)
  })
  it('generate fetch all discussions with cursor', async () => {
    const query = buildFetchAllDiscussionsQuery(
      'my-owner',
      'my-repo',
      'my-cursor'
    )
    expect(query).toEqual(`
query {
  repository(owner: "my-owner", name: "my-repo") {
    discussions(first: 20, answered: true, states: OPEN, after: my-cursor) {
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
}`)
  })
  it('discussion add comment', async () => {
    const query = buildDiscussionAddCommentQuery(
      'my-discussion-id',
      'my-message'
    )
    expect(query).toEqual(`
mutation {
  addDiscussionComment(input:{body: "my-message" , discussionId: "my-discussion-id"}) {
    comment{id}
  }
}`)
  })
  it('close discussion', async () => {
    const query = buildCloseDiscussionQuery('my-discussion-id', 'OUTDATED')
    expect(query).toEqual(`
mutation {
  closeDiscussion(input:{discussionId: "my-discussion-id", reason: "OUTDATED"}) {
    discussion{id}
  }
}`)
  })
})
