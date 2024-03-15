import * as core from '@actions/core'
import { DiscussionInputProcessor } from '../../src/processors/input-processor'
import { DiscussionPropsValidationError } from '../../src/errors/discussion-props-validation-error'

// Mock the GitHub Actions core library
let getInputMock: jest.SpiedFunction<typeof core.getInput>

describe('DiscussionInputProcessor', () => {
  let processor: DiscussionInputProcessor

  beforeEach(() => {
    jest.clearAllMocks()

    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    processor = new DiscussionInputProcessor()
  })

  it('should process valid inputs correctly', async () => {
    getInputMock.mockImplementation((inputName: string) => {
      switch (inputName) {
        case 'repo-token':
          return 'token'
        case 'message':
          return 'message'
        case 'days-before-close':
          return '7'
        case 'category':
          return 'category'
        case 'close-unanswered':
          return 'true'
        case 'close-reason':
          return 'DUPLICATE'
        case 'dry-run':
          return 'true'
        default:
          return ''
      }
    })

    const result = await processor.process()
    expect(result.success).toBe(true)
    expect(result.debug).toBe(true)
    expect(result.result).toBeDefined()
    expect(result.error).toBeUndefined()
  })

  it('should handle invalid daysBeforeClose input', async () => {
    getInputMock.mockImplementation((inputName: string) => {
      if (inputName === 'days-before-close') {
        return 'invalid'
      }
      return 'valid'
    })

    const result = await processor.process()
    expect(result.success).toBe(false)
    expect(result.error).toBeInstanceOf(DiscussionPropsValidationError)
  })

  it('should handle invalid closeReason input', async () => {
    getInputMock.mockImplementation((inputName: string) => {
      if (inputName === 'close-reason') {
        return 'INVALID'
      }
      return 'valid'
    })

    const result = await processor.process()
    expect(result.success).toBe(false)
    expect(result.error).toBeInstanceOf(DiscussionPropsValidationError)
  })
})
