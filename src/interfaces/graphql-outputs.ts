export interface DiscussionsQueryResponse {
  repository: {
    discussions: {
      nodes: DiscussionNode[]
      pageInfo: {
        hasNextPage: boolean
        endCursor: string
      }
    }
  }
}

export interface DiscussionNode {
  id: string
  number: number
  updatedAt: string
}

export interface WrappedQueryResponse<T> {
  data: T | null
  error?: Error
}
