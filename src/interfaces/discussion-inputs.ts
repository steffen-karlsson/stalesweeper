import { DiscussionCloseReason } from './graphql-outputs'

export interface DiscussionInputProps {
  repoToken: string
  message: string
  daysBeforeClose: number
  closeReason: DiscussionCloseReason
  debug: boolean
}
