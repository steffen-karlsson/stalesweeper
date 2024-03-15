import { DiscussionCloseReason } from './graphql-outputs'

export interface DiscussionInputProps {
  repoToken: string
  message: string
  threshold: Date
  closeReason: DiscussionCloseReason
  debug: boolean
}
