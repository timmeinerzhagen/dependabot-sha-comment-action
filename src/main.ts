import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
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
      for(const line of d.split('\n') {
        if (line.startsWith('+') && line.includes('@')) {
          core.info(line)
          const parts = line.split("@")
          const action = parts[0].split('uses:')[1].trim();

          const owner = action.split('/')[0]
          const repo = action.split('/')[1]
          const version = parts[1].trim();
          
          core.info(owner)
          core.info(repo)
          core.info(version)

          if(version.length == 40) {
            const { data: info } = await octokit.rest.git.getTag({
              owner: owner,
              repo: repo,
              tag_sha: version,
            });
            core.info(JSON.stringify(info));
          } else {
            core.info("Action not pinned to a hash");
          }
        };
      };
    } else {
        core.info(`This action can only act on the 'pull_request' trigger.`)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run();
