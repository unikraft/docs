---
title: Review Process
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 506
description: |
  Learn how changes to the Unikraft core or to any official Unikraft
  micro-library repository are reviewed before they are merged.
---

## Unikraft Code Review Process

**Pull Requests (PRs) submitted to the Unikraft core or to any official Unikraft
micro-library repositories on Github will go through a rigorous code review
process before they are accepted and merged.  This is done to ensure the
following goals are met:**

 * **Consistency**: Unikraft respects idomatic, consise, clear, and easy to read
   code.  This makes understanding code easier for new-commers at any expertise
   level and also makes debugging easier.  To achieve this, code in Unikraft is
   checked with a built-in linter program called
   [`checkpatch.pl`](/docs/contributing/testing#using-checkpatchpl).  This
   program was derived from the Linux kernel.
 * **Validity**: Changes to Unikraft must be valid in that they must solve a
   specific problem and the way in which it is solved is considered a good or
   best approach.
 * **Efficiency**: Unikraft aims to be highly performant, as a result, new code
   introduced into Unikraft must itself be efficient.  Often-times this means
   that even if the new code is working, the reviewer could and should require
   changes if the same functionality can be achieved in a more efficient way
   (regarding both time and memory).
 * **Safety & security**: Unikraft's core code is kernel code and thus acts as a
   mission critical layer for the runtime of applications which are compiled
   against it.  To prevent disruption to the operation of application code and
   to continue on the [security themes which Unikraft
   addresses](/docs/features/security), all code is checked rigorously.
 * **Integrity**: Authorship, a Developer's Certificate of Origin, and auditing
   are important to attribution and copyright.  Many of Unikraft's subsystems
   and libraries are developed independently by third-party organisations such
   as NEC, ARM and OpenSynergy.  

This process can take some time but it ensures the stability and integrity of
Unikraft.  More often than not, PRs must either be rebased, updated or undergo
some change before they are merged.  This is normal and ensures fixes, new
features and anything else introduced into Unikraft ecosystem meet the goals
listed above.  This is more likely to occur with new features which will often
go through multiple rounds or versions with a maintainer or "sheppard".  If you
are a first-time contributor, please do not be discouraged by this lengthy
process or additional feedback.  This is mentioned now to prevent any suprises
regarding the review-process.  Feedback is provided in good spirit, and
often-times allows for all parties to be properly informed with the best
solution to a given problem.

On this page, we detail how the process of a review of a PR occurs for both
those who wish to make new contributions to the core, or any additional
micro-library component, as well as those who conduct the reviews themselves.

{{< alert theme="info" >}}
### Reviewers, before you start a review, please:

* Be polite, considerate, and helpful.
* Comment on positive aspects of PRs as well as changes.
* Be empathetic and mindful of how your review may be received.
* Assume good intent and ask clarifying questions.
* Experienced reviewers, consider pairing with new reviewers whose work requires
  extensive changes.
{{</ alert >}}


### Stages of the code review process
 
1. After [a new PR is submitted](/docs/contributing/submitting-changes/), the
   first thing to occur are a number of automatic checks and new builds of the
   branch-to-be-merged from [Unikraft's CI/CD
   system](https://builds.unikraft.io) based on
   [Concourse](https://concourse-ci.org).  One of the first operations to occur
   is autolabelling.  
   
2. The operation to occur is the auto-assignment of a reviewer and maintainer
   (or "sheppard") to the PR.
   
   * The job of the **reviewer** is to comb through the request for change. They
     will be providing feedback, checking the functionality locally, performing
     additional spellchecking, and generarlly advising the PR with regard to the
     goals mentioned above.
   * Theh job of the **maintainer** is to sheppard the PR into a mergable state,
     [see below](/docs/contributing/review-process#approval-process).
   
   {{< img
      class="w-auto mx-auto"
      src="/assets/imgs/unikraft-bot-assignments.png"
      title="Automated request for review and sheppard assignment"
      caption="A screenshot from a PR showing the [unikraft-bot](https://github.com/unikraft-bot) automatically assigning a reviewer and a maintainer to a PR."
      position="center"
   >}}

   {{< alert theme="info" >}}
   Both the reviewer and the assignee (a.k.a. maintainer) are derived
   automatically [based on their
   workload](https://github.com/unikraft/governance/blob/8442d5b8e36179e4df5fe34e25dbba7aa3fedf8d/cmd/sync_pr.go#L540-L556)
   (i.e. the number of other reviews they have to do) and their affiliation with
   a [Special Interest Group](/community/governance) which oversees the area of
   change the PR affects.
   {{</ alert >}}
   
3. The next automatic operation to occur is the running of the
   [`checkpatch.pl`](/docs/contributing/testing#using-checkpatchpl) program
   against the PR's branch applied on top of the `staging` the repository in
   question to ensure each commit meets relevant style, consistency and validity
   requirements.

   {{< img
      class="w-auto mx-auto"
      src="/assets/imgs/unikraft-bot-checkpatch.png"
      title="Automated checkpatch"
      caption="An screenshot of a summary from the automatic checkpatch performed on a new PR.  This particular checkpatch looks good!"
      position="center"
   >}}

   If the checkpatch has at all failed, the comment from
   [unikraft-bot](https://github.com/unikraft-bot) will provide a truncated
   summary.  In this case, the PR must be rebased with changes which meet the
   requirements of the checkpatch.  For new contributors, please run the
   `checkpatch.pl` program before creating the PR to streamline the review
   process.  A reviewer will typically request for a rebase with the
   recommendations from the checkpatch before continuing with their review.

4. Along with the `checkpatch.pl`, a number of consistency builds are run in
   parallel for known architectures and platforms against the
   [helloworld](https://github.com/unikraft/app-helloworld) Unikraft application
   with the branch of the PR.  The [targets listed in the helloworld
   application](https://github.com/unikraft/app-helloworld/blob/staging/kraft.yaml)
   are the targets which are tested by the CI.  For any errors, please check the
   relevant build log.  These checks will appear at the bottom of the PR, like
   so:

   {{< img
      class="w-auto mx-auto"
      src="/assets/imgs/unikraft-concourse-builds.png"
      title="Automated unikernel builds"
      caption="Every PR has all the targets of the helloworld application built aganst it ontop of the `staging` branch of the Unikraft core repository."
      position="center"
   >}}

5. At this point it is up to the reviewer to comb through the requested change
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
   $ kraft configure -u unikraft@staging # Ensure to use staging branch of core
   $ cd /tmp/unikraft-pr-$PR_ID/.unikraft/unikraft
   $ gh pr checkout $PR_ID
   ```

   If the change is to a separate micro-library component, please clone the
   relevant library or initialize the relevant application.  It is possible to
   add a standalone library to the helloworld application like so:

   ```bash
   $ cd /tmp/unikraft-pr-$PR_ID/
   $ kraft lib add --dump $LIBNAME@staging
   $ kraft configure -u unikraft@staging # Ensure to use staging branch of core
   $ cd .unikraft/libs/$LIBNAME
   $ gh pr checkout $PR_ID
   ```

   Once the PR's code has been applied on top of the `staging` branch of the
   relevant repository, proceed by configuring the unikernel with appropriate
   build options, compiling and then running.

6. Detailed comments, general feedback, request for changes or approvals of the
   PR are done via [Github's PR review
   manager](https://docs.github.com/en/github/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request>).
   Generally you can press the "Files changed" tab of a PR which reveals a diff
   where you can use to start your review.  On this page, you can leave in-line
   comments.


{{< alert theme="warning" >}}
### On receiving feedback and changes

When a PR has had changes requested to it, it is important that the changes are
made as part of a rebase and then [force
pushing](](https://stackoverflow.com/a/12610763)) to the original branch. Simply
applying the changes ontop of the previous commits is not sufficient. If a force
push or changes to the branch will re-trigger the review process (see 1, 2 and
3).
{{</ alert >}}


### Reviewer checklist

A reviewer of a PR should generally check the following items with regard to the
PR in question:

* [ ] Does the PR's checkpatch return all clear?  Some commits may have a
      warning instead of an error, can the warning be safely ignored?
* [ ] Do all the tests pass?
* [ ] Is the solution the most efficient and secure?
* [ ] Are there clear comments and [inline
      documentation](/docs/contributing/coding-style/#code-documentation)?
* [ ] Is the code copied or does it include [non-BSD
      code](/docs/contributing/licensing)?
* [ ] Does this work locally for you?

### Finishing a review

The review may go through a back-and-forth between the authors and the reviewer
before the reviewer marks the PR as approved.  As a reviewer, when you consider
the process complete you must add an equivilant ["sign
off"](/docs/contributing/submitting-changes/#commits) in the same way that the
author has.  This is done by writing adding a "Reviewed-by" Git trailer like so:

```
Reviewed-by: Your Name <your@email.com>
```

To do this, you can navigate to the "Files changed" tab of a PR which reveals a
diff and access the review box.  Then simply select one of the available
requests and add along with your comments the trailer:

{{< img
   class="w-auto mx-auto"
   src="/assets/imgs/github-reviewed-by.png"
   title="Approving a PR as a reviewer"
   caption="When a reviewer has provided a review to the PR, they must add a `Reviewed-by` trailer to their comments using GitHub's built-in the review tool."
   position="center"
>}}

Adding a `Reviewed-by` tag is important to the CI/CD system, as it signals that
a review has been completed which is the first lock of the merge process.

## Approval process

The approval process of a PR is the final step before a PR is merged and is
performed by a maintainer or sheppard.  Maintainers are also auto assigned by
[unikraft-bot](https://github.com/unikraft-bot) and will check both the PR and
the review to ensure consistency with the goals mentioned above as well as this
very review process.


### Before you begin

Please see the review process's [before you begin](#before-you-begin) section as
it applies to approvers of PRs.


### Approving a PR

Much like providing a review to a PR, an approval must be made when the PR is
absolutely ready to be merged.  An approval will unlock the CI/CD system and
will automatically merge the PR into the desired repository.

An approval must use Github's review tool and mark the PR as state "approved"
this can be done in the same way as the review in the figure above, or
alternatively it can be done with GitHub's CLI companion tool like so:

```bash
$ gh pr review https://github.com/unikraft/app-nginx/pull/2 \
    --approve \
    --body "Approved-by: Your Name <your@email.com>"
```

The only difference is the trailer, which should be `Approved-by`.
