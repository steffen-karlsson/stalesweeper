import { DiscussionCloseReason } from './graphql-outputs'

export interface DiscussionInputProps {
  repoToken: string
  message: string
  threshold: Date
  category: string | undefined
  closeUnanswered: boolean
  closeReason: DiscussionCloseReason
  debug: boolean
}
