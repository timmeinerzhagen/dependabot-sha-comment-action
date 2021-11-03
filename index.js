const core = require('@actions/core');
const github = require('@actions/github');

if (github.context.eventName === 'pull_request') {
    const payload = github.context.payload;

    const diff = await github.rest.pulls.get({
        owner: "octokit",
        repo: "rest.js",
        pull_number: payload.pull_request.number,
        mediaType: {
            format: "diff",
        },
    });




    // const commit = payload.pull_request.commits[0];
    // if(commit.modified[0].endsWith('.yml')) {
    //     const yaml = require('js-yaml');
    //     const fs = require('fs');
    //     const path = require('path');

    //     const filePath = path.join(process.env.GITHUB_WORKSPACE, commit.modified[0]);
    //     const fileContent = fs.readFileSync(filePath, 'utf8');
    //     const config = yaml.safeLoad(fileContent);

    //     if(config.hasOwnProperty('test')) {
    //         const test = config.test;
    //         if(test.hasOwnProperty('script')) {
    //             const script = test.script;
    //             if(script.hasOwnProperty('command')) {
    //                 const command = script.command;
    //                 if(command.startsWith('mocha')) {
    //                     const mocha = require('mocha');
    //                     const mochaReporter = require('mocha-junit-reporter');
    //                     const mochaOptions = {
    //                         reporter: 'mocha-junit-reporter',
    //                         reporterOptions: {
    //                             mochaFile: './test-results.xml'
    //                         }
    //                     };
    //                     const mochaRunner = new mocha(mochaOptions);
    //                     const mochaReporterInstance = new mochaReporter(mochaRunner);
    //                     mochaRunner.reporter(mochaReporterInstance);
    //                     mochaRunner.addFile(command.replace('mocha', './node_modules/mocha/bin/mocha'));
    //                     mochaRunner.run(function (failures) {
    //                         if (failures) {
    //                             core.setFailed(`${failures} tests failed.`);
    //                         }
    //                     });
    //                 }
    //             }
    //         }
    //     }
        


    } else {
        core.info(`The dependabot change was not for a GitHub Actions workflow.`)
    }
} else {
    core.info(`This action can only act on the 'pull_request' trigger.`)
}

try {
    
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}