import * as core from '@actions/core'
import { StaleDiscussionsValidator } from '../../src/processors/stale-processor'
import { DiscussionNode } from '../../src/interfaces/graphql-outputs'

let debugMock: jest.SpiedFunction<typeof core.debug>

describe('StaleDiscussionsValidator', () => {
  let validator: StaleDiscussionsValidator

  beforeEach(() => {
    jest.clearAllMocks()

    validator = new StaleDiscussionsValidator({
      repoToken: 'my-token',
      message: 'my-message',
      threshold: new Date('2023-01-01T00:00:00Z'),
      category: 'category',
      closeUnanswered: false,
      closeReason: 'OUTDATED',
      debug: false
    })
  })

  it('should filter stale discussions correctly', async () => {
    const discussions: DiscussionNode[] = [
      {
        id: '1',
        number: 1,
        updatedAt: '2022-01-01T00:00:00Z',
        isAnswered: true,
        category: {
          name: 'category',
          isAnswerable: true
        }
      },
      {
        id: '2',
        number: 2,
        updatedAt: '2022-01-01T00:00:00Z',
        isAnswered: false,
        category: {
          name: 'category',
          isAnswerable: true
        }
      },
      {
        id: '3',
        number: 3,
        updatedAt: '2022-01-01T00:00:00Z',
        isAnswered: null,
        category: {
          name: 'category',
          isAnswerable: false
        }
      },
      {
        id: '4',
        number: 4,
        updatedAt: '2022-01-01T00:00:00Z',
        isAnswered: true,
        category: {
          name: 'other',
          isAnswerable: true
        }
      },
      {
        id: '5',
        number: 5,
        updatedAt: '2023-01-02T00:00:00Z',
        isAnswered: true,
        category: {
          name: 'category',
          isAnswerable: true
        }
      }
    ]

    const result = await validator.process(discussions)
    expect(result.success).toBe(true)
    expect(result.debug).toBe(false)
    expect(result.result).toHaveLength(2)
    expect(result.result[0]).toEqual(discussions[0])
    expect(result.result[1]).toEqual(discussions[2])

    validator.props.category = undefined
    const resultWithoutCategory = await validator.process(discussions)
    expect(resultWithoutCategory.success).toBe(true)
    expect(resultWithoutCategory.debug).toBe(false)
    expect(resultWithoutCategory.result).toHaveLength(3)
    expect(resultWithoutCategory.result[0]).toEqual(discussions[0])
    expect(resultWithoutCategory.result[1]).toEqual(discussions[2])
    expect(resultWithoutCategory.result[2]).toEqual(discussions[3])
  })

  it('should handle closeUnanswered correctly', async () => {
    const discussions: DiscussionNode[] = [
      {
        id: '1',
        number: 1,
        updatedAt: '2022-01-01T00:00:00Z',
        isAnswered: true,
        category: {
          name: 'category',
          isAnswerable: true
        }
      },
      {
        id: '1',
        number: 1,
        updatedAt: '2022-01-01T00:00:00Z',
        isAnswered: false,
        category: {
          name: 'category',
          isAnswerable: true
        }
      }
    ]

    const resultWithoutUnclosed = await validator.process(discussions)
    expect(resultWithoutUnclosed.success).toBe(true)
    expect(resultWithoutUnclosed.debug).toBe(false)
    expect(resultWithoutUnclosed.result).toHaveLength(1)
    expect(resultWithoutUnclosed.result[0]).toEqual(discussions[0])

    validator.props.closeUnanswered = true
    const resultWithUnclosed = await validator.process(discussions)
    expect(resultWithUnclosed.success).toBe(true)
    expect(resultWithUnclosed.debug).toBe(false)
    expect(resultWithUnclosed.result).toHaveLength(2)
  })
  it('should handle debug mode correctly', async () => {
    validator.props.debug = true
    debugMock = jest.spyOn(core, 'debug').mockImplementation()

    const result = await validator.process([])
    expect(result.success).toBe(true)
    expect(result.debug).toBe(true)
    expect(result.result).toHaveLength(0)
    expect(result.error).toBeUndefined()
    expect(debugMock).toHaveBeenCalledTimes(1)
    expect(debugMock).toHaveBeenCalledWith(
      'Comparing discussion dates with Sun, 01 Jan 2023 00:00:00 GMT, to determine stale state'
    )
  })
})
