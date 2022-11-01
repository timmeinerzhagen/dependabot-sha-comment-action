> :warning: **Implemented by GitHub** </br>
> This Action is no longer needed, as [GitHub Dependabot added SHA Comment Version Updating](https://github.blog/changelog/2022-10-31-dependabot-now-updates-comments-in-github-actions-workflows-referencing-action-versions/) to its managed service. 

# Dependabot SHA Comment Action

Used with Dependabot and GitHub Actions pinned via SHA. It adds and maintains a version comment next to the SHA hash on every Dependabot update. 

This makes the actions much more readable than having a plain SHA.

Resulting versioning style:

```
- uses: actions/checkout@5a4ac9002d0be2fb38bd78e4b4dbde5606d7042f # v2.3.4
```

Scope:

* Comments are only added on new Dependabot PRs. 
* This action won't change normal tags e.g. `v1` to SHAs. It will only act if an action is already pinned to a SHA.
* Existing SHAs won't automatically get this comment, only when they are updated via Dependabot. 

To get frequent Dependabot updates add an [`.github/dependabot.yml`](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/configuration-options-for-dependency-updates) to your repository.

## Example usage

You need to add `GH_TOKEN` to the Dependabot Secrets of your repositories.

```
on: [pull_request]
jobs:
  sha-comment:
    runs-on: ubuntu-latest
    steps:
      - uses: timmeinerzhagen/dependabot-sha-comment-action@main # insert current version
        with:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
```

## Inputs

### GH_TOKEN *required*

A GitHub Personal Access Token (PAT) is required. You need to add this token to the Dependabot Secrets of your repository, so that workflows triggered by Dependabot Pull Requests can receive it.

This PAT needs the access scopes `repo` and `workflows` to push changes to GitHub Actions workflows. 
The `workflow` permission can't be given to the default repository token, which is why this token needs to be provided in addition.

## Outputs

None

## License

MIT - feel free to reuse!
