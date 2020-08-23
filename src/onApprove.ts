import * as core from '@actions/core'
import * as github from '@actions/github'

const onApprove = async (): Promise<void> => {
  try {
    const githubToken = core.getInput('repo-token')
    const octokit = github.getOctokit(githubToken)
    const { context } = github
    const { eventName, payload, repo } = context

    if (eventName !== 'pull_request_review') return

    const isApproved = (payload.review.state || '').toLowerCase() === 'approved'

    if (isApproved) {
      await octokit.reactions.createForIssue({
        ...repo,
        content: '+1',
        issue_number: payload.pull_request?.number || -1,
      })
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

export default onApprove
