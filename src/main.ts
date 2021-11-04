import * as core from '@actions/core'
import * as github from '@actions/github'
import * as exec from '@actions/exec'
import { userInfo } from 'os';

async function run(): Promise<void> {
  try {
    if (github.context.eventName === 'pull_request') {
      core.info(`This action is running on the 'pull_request' event!`)
      const payload = github.context.payload as any;


      const titleparts = payload.pull_request.title.split('to')
      const version_update = titleparts[titleparts.length - 1].trim()

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

      const path = d.split('\n')[0].split(' ')[2].substr(2);
      core.info(path)

      for(const line of d.split('\n')) {
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

            let output = '';
            let error = '';
            const options = {
              listeners: {
                stdout: (data: Buffer) => {
                  output += data.toString();
                },
                stderr: (data: Buffer) => {
                  error += data.toString();
                }
              },
              cwd: './'
            };            
            await exec.exec('cat ', [path], options);

            const sp = output.split(line.substring(1));
            const newline = line.substring(1).split('#')[0] + ' # ' + version_update + '\n';
            const newfile = sp[0] + newline + (sp[1] == undefined ? '' : sp[1]);
            
            core.info("Start File");
            // core.info(newfile)
            await exec.exec('sed', ['-i', 's/' + escape(line.substring(1)) + '/' + escape(newline) +'/g', path], options);
            await exec.exec('git ', ['config', '--global', 'user.name', 'GitHub Actions'], options); 
            await exec.exec('git ', ['config', '--global', 'user.email', 'github-actions[bot]@users.noreply.github.com'], options); 
            await exec.exec('git ', ['add', '.'], options);
            await exec.exec('git ', ['commit', '-m', '\"Add Version Comment\"'], options);
            await exec.exec('git ', ['push'], options);
          
            // core.info(output)
            // core.info(error)
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
