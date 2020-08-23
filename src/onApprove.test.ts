// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as core from '@actions/core'
import * as github from '@actions/github'

import onApprove from './onApprove'

jest.mock('@actions/core')
jest.mock('@actions/github')

describe('onApprove action', () => {
  const createForIssue = jest.fn(
    ({ issue_number }) =>
      new Promise((resolve, reject) => {
        if (issue_number === -1) reject({ message: 'error' })
        return resolve()
      }),
  )
  const getOctokit = jest.spyOn(github, 'getOctokit')
  getOctokit.mockImplementation(() => ({
    reactions: {
      createForIssue,
    },
  }))

  const getInput = jest.spyOn(core, 'getInput')
  getInput.mockImplementation(() => 'token')
  const setFailed = jest.spyOn(core, 'setFailed')

  const defaultContext = {
    eventName: 'pull_request_review',
    payload: { pull_request: { number: 1 }, review: { state: 'APPROVED' } },
    repo: {},
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('calls createForIssue when a PR is approved', async () => {
    Object.defineProperty(github, 'context', {
      value: defaultContext,
    })
    await onApprove()

    expect(getInput).toBeCalledTimes(1)
    expect(getOctokit).toBeCalledTimes(1)
    expect(createForIssue).toBeCalledTimes(1)
    expect(setFailed).toBeCalledTimes(0)
  })

  it('returns early if event is not a PR review', async () => {
    Object.defineProperty(github, 'context', {
      value: {
        eventName: 'push',
        payload: {},
        repo: {},
      },
    })
    await onApprove()

    expect(getInput).toBeCalledTimes(1)
    expect(getOctokit).toBeCalledTimes(1)
    expect(createForIssue).toBeCalledTimes(0)
    expect(setFailed).toBeCalledTimes(0)
  })

  it('does not create the reaction if the PR is not approved', async () => {
    Object.defineProperty(github, 'context', {
      value: {
        eventName: 'pull_request_review',
        payload: {
          pull_request: { number: 1 },
          review: {},
        },
        repo: {},
      },
    })
    await onApprove()

    expect(getInput).toBeCalledTimes(1)
    expect(getOctokit).toBeCalledTimes(1)
    expect(createForIssue).toBeCalledTimes(0)
    expect(setFailed).toBeCalledTimes(0)
  })

  it('handles PR number undefined', async () => {
    Object.defineProperty(github, 'context', {
      value: {
        eventName: 'pull_request_review',
        payload: { review: { state: 'APPROVED' } },
        repo: {},
      },
    })
    await onApprove()

    expect(getInput).toBeCalledTimes(1)
    expect(getOctokit).toBeCalledTimes(1)
    expect(createForIssue).toBeCalledTimes(1)
    expect(setFailed).toBeCalledTimes(1)
  })
})
