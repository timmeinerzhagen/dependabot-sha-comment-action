# Dependabot SHA Comment Action

Used with Dependabot and GitHub Actions pinned via SHA. It adds and maintains a version comment next to the SHA hash on every dependabot update. 

This makes the actions much more readable than having a plain SHA.

Resulting versioning style:

```
- uses: actions/checkout@5a4ac9002d0be2fb38bd78e4b4dbde5606d7042f # 2.3.4
```

Scope:

* Comments are only added on new Dependabot PRs. 
* This action won't change normal tags e.g. `v1` to SHAs. It will only act if an action is already pinned to a SHA.
* Existing SHAs won't automatically get this comment, only when they are updated via Dependabot. 

To get frequent Dependabot updates add an [`.github/dependabot.yml`](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/configuration-options-for-dependency-updates) to your repository.

## Example usage

```
on: [pull_request_target]
jobs:
  sha-comment:
    runs-on: ubuntu-latest
    steps:
      - uses: timmeinerzhagen/dependabot-sha-comment-action@main # insert current version
        with:
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
```

## Security Disclaimer

This action uses the `pull_request_target` and an additional PAT. Why?

Only the trigger `pull_request_target` allows having write privileges in a Dependabot Pull Request, as those are treated as PRs from a Fork. See the concerns with the usage of this trigger in the GitHub Security Lab blogpost [Keeping your GitHub Actions and workflows secure Part 1: Preventing pwn requests](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/). As this action only looks at the PR DIFF and adjusts the updated file, arbitrary code execution is not an issue, as stated in the post. 

In order to run this action you also need to provide a PAT. This is needed because you can't give the included GitHub Actions token the permissions to change GitHub Actions workflow files. This is specifically not included in the list of possible permissions and as such requires use of a PAT with the `repo` and `workflows` permissions.

## Inputs

### GITHUB_TOKEN *required*

A GitHub Personal Access Token (PAT) is required. 

This PAT needs the access scopes `repo` and `workflows` to push changes to GitHub Actions workflows. See [Security Disclaimer](#Security-Disclaimer).

## Outputs

None

## License

MIT - feel free to reuse!