---
title: Submitting Changes
date: 2022-02-04T14:09:21+09:00
draft: false
weight: 505
---

## Submitting Changes

New features, bug fixes, improvements, maintenance and everything in between as contributions are welcome!
The Unikraft project is an open source and encourages the fostering open collaboration.
If you are reading this guide on how to submit changes, then thank you in advance!

Unikraft's source code is primarily hosted on [Github](https://github.com).
This includes the Unikraft core repository, auxiliary external microlibraries, applications, platforms, architectures and additional tools like `kraft`.
Any of these repositories follow the same submission process for changes: the pull request.

Make sure one pull request covers only one topic.

### Submission Checklist

When you make a submission, please make sure you follow the steps below, also part of the pull request template:

 - [ ] Read the [contribution guidelines](docs/contributing/_index) regarding submitting new changes to the project;
 - [ ] Test your changes against relevant architectures and platforms;
 - [ ] Run the [`checkpatch.pl`](https://github.com/unikraft/unikraft/blob/staging/support/scripts/checkpatch.pl) on your commit series before opening this PR;
 - [ ] Update relevant documentation.

The pull request template will also request you to fill additional configuration information and a description of changes.

## Commits

Make sure each commit corresponds to one code / content change only.

Please create descriptive commit messages.
Consider using a prefix for the commit message.
Add a detailed description on the motivation for the commit and summary of changes.
Follow [this guide](https://cbea.ms/git-commit/) on writing good commit messages.

Each commit must be authored by adding a `Signed-off-by` message.
Use the `-s` / `--signoff` option of the `git` command when creating a commit.

## Addressing Multiple Authors

It is common that new code introduced into Unikraft comes from multiple authors.
Each author should have their name added as part of the respective commit.

Unikraft OSS project adopts a similar process seen with the Linux kernel, where a new merge request or PR can have multiple authors, multiple reviewers, testers, acknowledgements and more.

Authorship is created by adding `Signed-off-by` messages for each author.

## Rebasing and Squashing

While working on a pull request, the destination branch may change.
This will require [rebasing](https://docs.github.com/en/get-started/using-git/about-git-rebase) the source branch to keep it in sync.
There may be conflicts that need to be solved as part of the rebase.

As you want to create on commit for each content change, [squashing multiple commits](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/managing-commits/squashing-commits) into one may be required.
This may be either because of different small changes added to the pull request as new commits.
Or due to [incorporating suggested changes](docs/contributing/suggest-changes).
