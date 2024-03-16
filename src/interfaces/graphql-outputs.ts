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
  isAnswered: boolean | null
  category: DiscussionCategory
}

export interface DiscussionCategory {
  name: string
  isAnswerable: boolean
}

export interface WrappedQueryResponse<T> {
  data: T | null
  error?: Error
}

export type DiscussionCloseReason = 'DUPLICATE' | 'OUTDATED' | 'RESOLVED'
