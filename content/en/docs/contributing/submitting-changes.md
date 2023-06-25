---
title: Submitting Changes
date: 2022-02-04T14:09:21+09:00
draft: false
weight: 505
---

## Submitting Changes

New features, bugfixes, improvements, maintenance and everything in between as contributions are welcome!
The Unikraft project is an open source and encourages the fostering open collaboration.
If you are reading this guide on how to submit changes, then thank you in advance!

Unikraft's source code is primarily hosted on [GitHub](https://github.com).
This includes the Unikraft core repository, auxiliary external microlibraries, applications, platforms, architectures and additional tools like `kraft`.
Any of these repositories follow the same submission process for changes: the pull request.

Make sure one pull request covers only one topic.

### Submission Checklist

When you make a submission, please make sure you follow the steps below, also part of the pull request template:

- [ ] Read the contribution guidelines in this page regarding submitting new changes to the project;
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

### Commit Message Format

In order to simplify reading and searching the patch history, please use the following format for the short commit message:

```txt
[selector]/[component name]: [Your short message]
```

Where `[selector]` can be one of the following:

| Selector    | Description                                                                                                                                                           |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `arch`      | Patch for the architecture code in `arch/`,  `[component]` is the architecture (e.g, `x86`) applies also for corresponding headers in `include/uk/arch/`.             |
| `plat`      | Patch for one of the platform libraries in `plat/`, `[component]` is the platform (e.g, `linuxu`).  This applies also for corresponding headers in `include/uk/plat/` |
| `include`   | Changes to general Unikraft headers (e.g. `include/`, `include/uk`).                                                                                                   |
| `lib`       | Patch for one of the Unikraft base libraries (not external) in `lib/`, `[component]` is the library name without lib prefix (e.g, `fdt`).                             |
| `build`     | Changes to build tool or generic configurations, `[component]` is optional.                                                                                         |

{{< alert icon="💡" text="Commit messages, along with all source files follow a 80-character rule." />}}

If no `[selector]` applies, define your own and cross your fingers that the `reviewer(s)` do(es) not complain. :-)

Sometimes a single change required multiple commit identifiers.
In general this should be avoided by splitting a commits into multiple ones.
But for the rare case use a comma separated list of identifiers and/or use an asterisk for `[component]` (according to the sense).
For example:

```txt
lib/nolibc, plat/xen: Add support for foobar
arch/*: Add spinlocks
```

The short message part should start with a capital and be formulated in simple present.

The long message part is pretty free form but should be used to explain the reasons for the commit, what has been changed and why.
It is important to provide enough information to allow `reviewers` and other developers to understand the commit's purpose.

### Developer's Certificate of Origin

Please note that all commits **must be signed off**.
This is required so that you certify that you submitted the patch under the [Developer's Certificate of Origin](https://www.kernel.org/doc/html/latest/process/submitting-patches.html#developer-s-certificate-of-origin-1-1).

```txt
Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:
(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

Signing off is done by adding the following line after the long commit message:

```txt
Signed-off-by: $FULL_NAME <$EMAIL>
```

You can also use the `--signoff` or `-s` parameter of `git commit` when writing commit messages.

### Example Commit Message

```txt
lib/ukdebug: Add new trondle calls

Add some new trondle calls to the foobar interface to support the new
zot feature.

Signed-off-by: John Smith <j.smith@unikraft.org>
```

## Addressing Multiple Authors

It is common that new code introduced into Unikraft comes from multiple authors.
Each author should have their name added as part of the respective commit.

Unikraft OSS project adopts a similar process seen with the Linux kernel, where a new merge request or PR can have multiple authors, multiple reviewers, testers, acknowledgements and more.

Each author **must** add a `Signed-off-by` message, in order to certify that the submission is published under the [`DCO`](docs/contributing/submitting-changes/#developers-certificate-of-origin).
The co-authors should also add a `Co-authored-by` line to the commit message.
This should be done for every author except the one that actually created the commit, so the output of `git log` will look something like this:

```console
Author: Author Name <author-email>
Date: [...]

    [...]

    Co-authored-by: Co-Author 1 Name <co-author-1-email>
    Co-authored-by: Co-Author 2 Name <co-author-2-email>
    Signed-off-by: Author Name <author-email>
    Signed-off-by: Co-Author 1 Name <co-author-1-email>
    Signed-off-by: Co-Author 2 Name <co-author-2-email>
```

## Rebasing and Squashing

While working on a pull request, the destination branch may change.
This will require [rebasing](https://docs.github.com/en/get-started/using-git/about-git-rebase) the source branch to keep it in sync.
There may be conflicts that need to be solved as part of the rebase.

As you want to create on commit for each content change, [squashing multiple commits](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/managing-commits/squashing-commits) into one may be required.
This may be either because of different small changes added to the pull request as new commits.
Or due to [incorporating suggested changes](docs/contributing/suggest-changes).
