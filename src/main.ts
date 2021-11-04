import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    core.info(JSON.stringify(github.context))
    if (github.context.eventName === 'pull_request') {
      core.info(`This action is running on the 'pull_request' event!`)
      const payload = github.context.payload as any ;

      const token = core.getInput('GITHUB_TOKEN');
      const octokit = github.getOctokit(token)
      const { data: diff } = await octokit.rest.pulls.get({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          pull_number: payload.pull_request.number,
          mediaType: {
            format: 'diff'
          }
      });
      const d: string = diff.toString();
      d.split('\n').forEach(line => {
        if (line.startsWith('+')) {
          core.info(line)
        }
      });

    } else {
        core.info(`This action can only act on the 'pull_request' trigger.`)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run();
