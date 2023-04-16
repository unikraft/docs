---
title: Challenges
date: 2023-04-15T05:27:37+10:00
weight: 7
summary: "Challenges to solve during the hackathon"
---

## Challenges

You've made it so far.
Now the time has come to show the Unikraft world what you are really made of.
A true Dragon Slayer!

See the items added in the [`Hackathons` project](https://github.com/orgs/unikraft/projects/29) and in the [`Unikraft-UPB Hackathons` project](https://github.com/orgs/unikraft-upb/projects/1).

You will get the number of points for submitting a solution that works.
Those points will be doubled if the PR is accepted upstream.
After solving one challenge, pick another one.
We recommend you start small then move up to more difficult challenges.

We will keep the scoreboard [here](https://docs.google.com/spreadsheets/d/1XyoDp7diJvuIjViAEiSHT-gqy5UwbYAULAOe7v3eYOc/edit?usp=sharing).

Please check the community guidelines on [submitting changes](/docs/contributing/submitting-changes) and [the review process](/docs/contributing/review-process).

### Challenge Types

Challenge types generally fall into the categories below.
You can go beyond the items marked in the [`Hackathons` project](https://github.com/orgs/unikraft/projects/29).

1. **Submitting issues** to the Unikraft core repository, or application or library repositories

   5 hackathon points are awarded for each submitted issue.

1. **Adding dynamic applications** to the [`dynamic-apps` repository](https://github.com/unikraft/dynamic-apps)

   You submit the directory with the application, libraries and required filesystem files to run it.
   A submitted application will either work under binary compatibility (using [`app-elfloader`](https://github.com/unikraft/dynamic-apps)) or it would crash / stop because of a Unikraft core issue.
   If something is missing or wrong related to the application, its libraries or filesystem, fix that.
   If something is missing or wrong related to the Unikraft core, submit the application.
   Also submit an issue (if not already submitted) and get points for that.

   30-50 hackathon points are awarded for each submitted application, depending on its complexity.

1. **Fixing build warning messages**

   5-10 hackathon points are awarded for each fix.

1. **Adding tests to internal and external libraries** using [the `uktest` framework](https://github.com/unikraft/unikraft/tree/staging/lib/uktest)

   Generally, 20 hackathon points are awarded for the initial test and configuration, with 3 points for each new test added.

1. **Updating library versions** (and making sure the new version builds and runs)

   20-30 hackathon points are usually awarded for the boost.

1. **Updating already ported application to use `Musl`**

   40-70 hackathon points are awarded for each updated application, depending on its complexity.

1. **Fixing issues**

   50-80 hackathon points are awarded for each fix, depending on its complexity.

1. **Adding scripts like the ones used in the first session for more applications**

   You can find a list of issues on adding new scripts [here](https://github.com/orgs/unikraft-upb/projects/1).
   20-50 points are awarded for each script.

1. **Properly fixing issue #776**

   [Issue `#776`](https://github.com/unikraft/unikraft/issues/766) has an attempted fix in [PR `#797`](https://github.com/unikraft/unikraft/pull/797).
   The PR author is not responding.
   We want a final fix for that.

   40 hackathon points are awarded.

1. **Creating a test script for all binary-compat applications**

   Create a script that walks through all applications in [the `static-pie-apps` repository](https://github.com/unikraft/static-pie-apps) and [the `dynamic-apps` repository](https://github.com/unikraft/dynamic-apps) and uses them as tests for Unikraft using [the `app-elfloader`](https://github.com/unikraft/app-elfloader).
   It summarizes which applications work, which applications don't work, and their issues.

   100 hackathon points are awarded.

1. **Improving automation scripts**

   Do general improvements to scripts in [the `scripts` repository](https://github.com/unikraft-upb/scripts).

   20-30 hackathon points are awarded.

1. **Using Python for automation scripts**

   Replace shell scripting with Python for scripts (`do.sh`, `.../include/...`) in [the `scripts` repository](https://github.com/unikraft-upb/scripts).

   200 hackathon points are awarded.

1. **Adding Makefile / Makefile.uk / Config.uk for applications**

   Add `Makefile`, `Makefile.uk`, `Config.uk` for repositories of [Unikraft applications](https://github.com/search?q=topic%3Aunikraft-application+org%3Aunikraft+fork%3Atrue&type=repositories).
   This will make it seamless to configure, build and run Unikraft applications.
