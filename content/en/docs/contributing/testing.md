---
title: Testing Changes
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 504
---

## Testing changes before submitting a new PR

### Testing your changes

Make sure that you tested your changes on various setups before opening a new PR.
Try several different configuration options (in particular multiple architectures and platforms) and library combinations.

During development, disable `CONFIG_OPTIMIZE_DEADELIM` (Found in themenuconfig via "Build Options" -> "Drop unused functions and data", or via kraft with `kraft configure --no OPTIMIZE_DEADELIM`) so that all of your code is covered by the compiler and linker.

### Using `checkpatch.pl`

To support you in checking your coding style, we provide a tailored version of the Linux kernel's `checkpatch.pl` script in [`support/scripts/checkpatch.pl`](https://github.com/unikraft/unikraft/blob/staging/support/scripts/checkpatch.pl). 
You should run this from the root of the Unikraft repository because it contains a [`.checkpatch.conf`](https://github.com/unikraft/unikraft/blob/staging/.checkpatch.conf) file which disables some tests that we consider irrelevant for Unikraft.

Please run this script on all commit you are about to submit.
To do this, create a patch file for each commit on your working branch by running `git format-patch`.
For example, to create patch files for the last 5 commits:

```bash
$ git format-patch HEAD~5
$ ./support/scripts/checkpatch.pl ./000*
```

Please attempt fixes for all errors and warnings; if you decide to ignore some, be prepared to have a good reason for each warning and error during the [review process](/docs/contributing/review-process).
