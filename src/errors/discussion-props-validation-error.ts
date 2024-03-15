export class DiscussionPropsValidationError extends Error {
  constructor(msg: string) {
    super(msg)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DiscussionPropsValidationError.prototype)
  }
}
