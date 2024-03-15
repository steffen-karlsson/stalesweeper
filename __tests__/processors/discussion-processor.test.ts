import { DiscussionFetcher } from '../../src/processors/discussion-processor'
import * as core from '@actions/core'

let debugMock: jest.SpiedFunction<typeof core.debug>

describe('DiscussionFetcher', () => {
  let fetcher: DiscussionFetcher

  beforeEach(() => {
    jest.clearAllMocks()

    fetcher = new DiscussionFetcher({
      repoToken: 'my-token',
      message: 'my-message',
      threshold: new Date(),
      category: undefined,
      closeUnanswered: false,
      closeReason: 'OUTDATED',
      debug: false
    })
  })

  it('should fetch discussions successfully', async () => {
    fetcher.executeQuery = jest.fn().mockResolvedValue({
      data: {
        repository: {
          discussions: {
            nodes: [{ id: '1' }, { id: '2' }],
            pageInfo: {
              hasNextPage: false,
              endCursor: 'cursor'
            }
          }
        }
      },
      error: null
    })

    const result = await fetcher.process({ owner: 'owner', repo: 'repo' })
    expect(result.success).toBe(true)
    expect(result.debug).toBe(false)
    expect(result.result).toHaveLength(2)
    expect(result.error).toBeUndefined()
  })

  it('should handle GraphQL errors', async () => {
    fetcher.executeQuery = jest.fn().mockResolvedValue({
      data: null,
      error: new Error('Error message')
    })

    const result = await fetcher.process({ owner: 'owner', repo: 'repo' })
    expect(result.success).toBe(false)
    expect(result.debug).toBe(false)
    expect(result.result).toHaveLength(0)
    expect(result.error).toBeInstanceOf(Error)
    expect(result.error!.message).toBe('Error message')
  })

  it('should handle pagination correctly', async () => {
    fetcher.executeQuery = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          repository: {
            discussions: {
              nodes: [{ id: '1' }],
              pageInfo: {
                hasNextPage: true,
                endCursor: 'cursor1'
              }
            }
          }
        },
        error: null
      })
      .mockResolvedValueOnce({
        data: {
          repository: {
            discussions: {
              nodes: [{ id: '2' }],
              pageInfo: {
                hasNextPage: false,
                endCursor: 'cursor2'
              }
            }
          }
        },
        error: null
      })

    const result = await fetcher.process({ owner: 'owner', repo: 'repo' })
    expect(result.success).toBe(true)
    expect(result.debug).toBe(false)
    expect(result.result).toHaveLength(2)
    expect(result.error).toBeUndefined()
  })
  it('should handle debug mode correctly', async () => {
    fetcher.props.debug = true

    debugMock = jest.spyOn(core, 'debug').mockImplementation()

    fetcher.executeQuery = jest.fn().mockResolvedValue({
      data: {
        repository: {
          discussions: {
            nodes: [{ id: '1' }, { id: '2' }],
            pageInfo: {
              hasNextPage: false,
              endCursor: 'cursor'
            }
          }
        }
      },
      error: null
    })

    const result = await fetcher.process({ owner: 'owner', repo: 'repo' })
    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    expect(result.success).toBe(true)
    expect(result.debug).toBe(true)
    expect(result.result).toHaveLength(0)
    expect(result.error).toBeUndefined()
    expect(debugMock).toHaveBeenCalledWith(
      'Fetching discussions page for owner/repo, with cursor null'
    )
  })
})
