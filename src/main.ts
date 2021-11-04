import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    if (github.context.eventName === 'pull_request') {
      core.info(`This action is running on the 'pull_request' event!`)
      const payload = github.context.payload as any ;

      const token = core.getInput('GITHUB_TOKEN');
      const octokit = github.getOctokit(token)
      const { data: pullRequest } = await octokit.rest.pulls.get({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          pull_number: payload.pull_request.number,
          mediaType: {
            format: 'diff'
          }
      });

      core.info(pullRequest.toString());

      // } else {
      //   core.info(`The dependabot change was not for a GitHub Actions workflow.`)
      // }
    } else {
        core.info(`This action can only act on the 'pull_request' trigger.`)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run();



// const message = core.getInput('message');
// const github_token = core.getInput('GITHUB_TOKEN');

// const context = github.context;
// if (context.payload.issue == null) {
//     core.setFailed('No issue found.');
//     return;
// }
// const issue_number = context.payload.issue.number;

// const octokit = new github.GitHub(github_token);
// const new_comment = octokit.issues.createComment({
//     ...context.repo,
//     issue_number: issue_number,
//     body: message
//     });