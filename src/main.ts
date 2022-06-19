import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'

import { Diff, DiffChange, DiffFile } from './types'

export async function run(): Promise<void> {
    const GH_TOKEN = core.getInput("GH_TOKEN")
    const repo = github.context.repo

    console.log(JSON.stringify(github.context, null, 4))

    // Validate context //
    if (github.context.eventName != 'pull_request' || github.context.payload.pull_request == undefined)
        throw 'This action can only be used with the `pull_request` trigger.'

    const pull_request = github.context.payload.pull_request

    if (pull_request.user.login != 'dependabot[bot]') {
        core.info("Not a Dependabot Pull Request.")
        return;
    }

    // Main Processing starts //
    core.info("Processing the Pull Request...")

    await clone(`${repo.owner}/${repo.repo}`, GH_TOKEN)

    const diff = await getDiff(await generateDiff(pull_request.head.ref, pull_request.base.ref, repo.repo))
    console.log(JSON.stringify(diff, null, 4))

    const version_new = await getNewVersion(pull_request.title)
   
    // Check all changed files //
    diff.files.forEach(file => {
        if (!(file.path.startsWith('.github/workflows') 
             && (file.path.endsWith('.yml') || file.path.endsWith('.yaml')))) {
            core.info("Not a GitHub Actions Dependabot Pull Request.");
            return;
        }

        file.changes.forEach(async (change) => {
            if(change.type == '+' && change.line.includes('@')){
                const version = change.line.split("@")[1].split('#')[0].trim();
                if (version.length == 40) {
                    const newline = `${change.line.substring(1).split('#')[0].trim()} # ${version_new}\n`;
                    // Save changes in file //
                    await runExec('sed -i "s/' + change.line.substring(1).trim().replace(new RegExp("/", 'g'), "\\/") + '/' + newline.trim().replace(new RegExp("/", 'g'), "\\/") + '/g" ' + file.path, repo.repo);
                }
            }
        });
    });

    // pushChanges({
    //     path: repo.repo,
    //     message: "Add Version Comment",
    //     user: "GitHub Actions",
    //     mail: "github-actions[bot]@users.noreply.github.com"
    // })

}

export async function getNewVersion(title: string) {
    const titleparts = title.split('to')
    const version = titleparts[titleparts.length - 1].trim();

    const dotsCount = version.split(".").length
    const fillerZeros = dotsCount < 3 ? '.0'.repeat(3 - dotsCount) : ''
    
    return `v${version}${fillerZeros}`
}

export async function clone(repo: string, token: string) {    
    await runExec(`git clone https://${token}@github.com/${repo}.git`, "./")
}

export async function generateDiff(head:string , base: string, path: string) {
    await runExec(`git checkout ${base}`, path)
    await runExec(`git checkout ${head}`, path)
    return await runExec(`git diff origin/${base} ${head}`, path)
}

export async function getDiff(rawDiff: string) {
    const diff: Diff = { files: [] }
    for (const fileDiff of rawDiff.split('diff --git a/')) {
        // Check if file is GitHub Actions file //
        const path = fileDiff.split('\n')[0].split(' ')[0];
        console.log(`Path: ${path}`)
        if (!(path.startsWith('.github/workflows') && (path.endsWith('.yml') || path.endsWith('.yaml')))) {
            core.info("Not a GitHub Actions Dependabot Pull Request.");
            continue;
        }

        const file: DiffFile = {
            path: path,
            changes: []
        }
        
        // Look through DIFF for version change //
        for (const line of fileDiff.split('\n')) {
            const firstChar = line.substring(0, 1)
            const change: DiffChange = {
                line: line.substring(1),
                type: ['+', '-'].includes(firstChar) ? firstChar : "o"
            }
            file.changes.push(change)
        }
        diff.files.push(file)
    }
    return diff;
}

export async function runExec(command: string, path: string) {
    let output = '', error = '';
    const options = {
        listeners: {
            stdout: (data: any) => { output += data.toString(); },
            stderr: (data: any) => { error += data.toString(); }
        },
        cwd: path
    };
    if(error) throw error
    await exec.exec(command, undefined, options);
    return output
}

export async function pushChanges({
    path = "./",
    message = "Add Version Comment",
    user = "GitHub Actions",
    mail = "github-actions[bot]@users.noreply.github.com"
}) {
    await runExec(`git config --global user.name ${user}`, path)
    await runExec(`git config --global user.email ${mail}`, path)
    await runExec(`git add .`, path)
    await runExec(`git commit -m "${message}"`, path)
    await runExec(`git push `, path)
}

