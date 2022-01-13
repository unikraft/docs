---
title: Review Process
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 506
---

## Review Process

**Pull Requests (PRs) submitted to the Unikraft core or to any official Unikraft
micro-library repositories on Github will go through a rigorous code review
process before they are accepted and merged.  This is done to ensure the
following goals are met:**

 * **Consistency**: Unikraft respects idomatic, consise, clear, and easy to read
   code.  This makes understanding code easier for new-commers at any expertise
   level and also makes debugging easier.  To achieve this, code in Unikraft is
   checked with a built-in linter program called `checkpatch.pl`.  This program
   was derived from the Linux kernel.
 * **Validity**: Changes to Unikraft must be valid in that they must solve a
   specific problem and the way in which it is solved is considered a good or
   best approach.
 * **Efficiency**: Unikraft aims to be highly performant, as a result, new code
   introduced into Unikraft must itself be efficient.  Often-times this means
   that 
 * **Safety & security**: 
 * **Integrity**: Authorship, a Developer's Certificate of Origin, and auditing
   are important to

This process can take some time but it ensures the stability and integrity of
Unikraft.  More often than not, PRs must either be rebased, updated or undergo
some change before they are merged.  This is normal and ensures fixes, new
features and anything else introduced into Unikraft ecosystem meet the goals
listed above.  This is more likely to occur with new features which will often
go through multiple rounds or versions with a maintainer.  If you are a
first-time contributor, please Do not be discouraged by this.  This is mentioned
now to prevent any suprises regarding the review-process.  Feedback is provided
in good spirit, and often-times allows for all parties to be properly informed
with the best solution to a given problem.

On this page, we detail how this process occurs for both those who wish to make
new contributions to the core, or any additional micro-library component, as
well as those who conduct the reviews themselves.

### Before you begin

Before you start a review, please:

 * Be polite, considerate, and helpful.
 * Comment on positive aspects of PRs as well as changes.
 * Be empathetic and mindful of how your review may be received.
 * Assume good intent and ask clarifying questions.
 * Experienced contributors, consider pairing with new contributors whose work
   requires extensive changes.

### Stages of the code review process

1. After [submitting a new PR](/docs/), the first thing to occur is an automatic
   trigger with [Unikraft CI/CD system](https://builds.unikraft.io) based on
   [Concourse](https://concourse-ci.org).  This process triggers a number of
   checks and new builds of the branch-to-be-merged.  The first operation to
   occur is the run of the `checkpatch` program against the PR's branch applied
   on top of the `staging` the repository in question to ensure each commit
   meets relevant style, consistency and validity requirements.

   {{< img
      class="w-auto mx-auto"
      src="/assets/imgs/unikraft-bot-checkpatch.png"
      title="Automated Checkpatch"
      caption="An example summary from the automatic checkpatch performed on a new PR."
      alt="...."
      position="center"
   >}}

   If the checkpatch has at all failed, the PR must be rebased with changes
   which meet the requirements of the checkpatch.  For new contributions, please
   run the `checkpatch` program before creating the PR to streamline the merge
   process.  A reviewer will typically trigger the request for the rebase if the
   checkpatch fails.

2. Along with the |checkpatch|_ program, a number of consistency builds are run
   in parallel for known architectures and platforms against the
   [helloworld](https://github.com/unikraft/app-helloworld) Unikraft application
   with the branch of the PR.  The [targets listed in the helloworld
   application](https://github.com/unikraft/app-helloworld/blob/staging/kraft.yaml)
   are the targets which are tested by the CI.  For any errors, please check the
   relevant build log.  These checks will appear

3. At this point it is up to the reviewer to comb through the requested change
   to the repository.  This can be, for example, accomplished by testing the
   changes locally with [`kraft`](/docs/usage/install) and by checking out the
   PR using the [Github CLI](https://github.com/cli/cli) in the relevant
   directory of a fresh clone of related Unikraft repositories at the `staging`
   branch:

   ```bash
   $ kraft init --dump -t helloworld@staging /tmp/unikraft-pr-$PR_ID
   ```

   If the PR is a change to the [Unikraft core
   repository](https://github.com/unikraft/unikraft), then you can simply update
   the branch of the local clone from the initialization step detailed above:

   ```bash
   $ cd /tmp/unikraft-pr-$PR_ID/.unikraft/unikraft
   $ gh pr checkout $PR_ID
   ```

   If the change is to a separate micro-library component, please clone the
   relevant library or initialize the relevant application.  It is possible to
   add a standalone library to the helloworld application like so:

   ```bash
   $ cd /tmp/unikraft-pr-$PR_ID/
   $ kraft lib add --dump $LIBNAME@staging
   $ cd .unikraft/libs/$LIBNAME
   $ gh pr checkout $PR_ID
   ```

   Once the PR's code has been applied on top of the `staging` branch of the
   relevant repository, proceed by configuring the unikernel with appropriate
   build options, compiling and then running.

4. Detailed comments, general feedback, request for changes or approvals of the
   PR are done via [Github's PR review
   manager](https://docs.github.com/en/github/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request>).
   If a change is requested, a [force
   push](https://stackoverflow.com/a/12610763) to the same Git repository branch
   will re-trigger the whole process (see 1, 2 and 3).


To get started writing a test, please follow the guide on [how to write a
test](/docs/develop/writing-tests).  During the review process, new tests will
be automatically enabled during any CI/CD pipeline process (Found by enable the
"Enable all tests" (`CONFIG_UKTEST_ENABLE_ALL`) option.

### Reviewer Checklist

 * [ ] Tested X
 * [ ] Tested Y

## Approval Process

The approval process of a PR is the final step before a PR is merged and is
performmed by a maintainer.  Maintainers can be derived for a PR 

### Before you begin

Please see the review process's [before you begin](#before-you-begin) section as
it applies to approvers of PRs.

s

```bash
$ gh pr review https://github.com/unikraft/app-nginx/pull/2 \
    --approve \
    --body "Reviewed-by: $NAME <$EMAIL>"
```
