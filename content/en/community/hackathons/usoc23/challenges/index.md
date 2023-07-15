---
title: Hackathon Challenges
date: 2023-03-31T05:27:37+10:00
weight: 7
summary: "Challenges to solve during the hackathon"
---

You've made it so far.
Now the time has come to show the Unikraft world what you are really made of.
A true Dragon Slayer!

See the items added in the [`Hackathons` project](https://github.com/orgs/unikraft/projects/29).

We will keep the scoreboard [here](https://docs.google.com/spreadsheets/d/1RubMl3VwXRIrlWZQlCahBVLeA1YKao6CnAAbrUsuBRQ/edit?usp=sharing).

Join the discussion on the [USoC'23 Hackathon thread on Discord](https://discord.com/channels/762976922531528725/1129344076194525214).

## Steps

Follow the steps below to solve challenges for the hackathon:

1. **Join the USoC'23 Hackathon thread on Discord.**

   On [this thread](https://discord.com/channels/762976922531528725/1129344076194525214) we discuss items during the hackathon.

1. **Create a team.**

   Be part of a team of 2-4 people, probably the team you were part of during sessions.
   Choose a team name.
   Announce the team name on [the Discord thread](https://discord.com/channels/762976922531528725/1129344076194525214).
   Join the corresponding voice channel if taking part online.

1. **Check out the challenges.**

   See the items added in the [`Hackathons` project](https://github.com/orgs/unikraft/projects/29).
   See a detailed description of them below in the [`Challenge Types` section](#challenge-types).
   Discuss challenges in your team.

1. **Select challenges as "In Progress".**

   Once you select 1-2 challenges to begin with, mark them as `In Progress` in the [scoreboard](https://docs.google.com/spreadsheets/d/1RubMl3VwXRIrlWZQlCahBVLeA1YKao6CnAAbrUsuBRQ/edit?usp=sharing), in column `E` (`State`) in the `Working Items` sheet.

1. **Work on challenges.**

   Work on challenges.
   Work as a team.
   Discuss with the USoC'23 support team on [the Discord thread](https://discord.com/channels/762976922531528725/1129344076194525214).

1. **Submit challenges as issues / PRs.**

   Once work is done, submit challenges as issues or pull requests.
   Before you do that, check the community guidelines on [submitting changes](/docs/contributing/submitting-changes) and [the review process](/docs/contributing/review-process).
   Mark challenges as `Submitted` in the [scoreboard](https://docs.google.com/spreadsheets/d/1RubMl3VwXRIrlWZQlCahBVLeA1YKao6CnAAbrUsuBRQ/edit?usp=sharing), in column `E` (`State`) in the `Working Items` sheet.
   Challenge will then be graded by the USoC'23 support team.

1. **Apply review feedback from support team.**

   Wait for review feedback from the USoC'23 support team on the pull request / issue you submitted.
   Apply changes to solve feedback requests.
   Aim to get the pull request upstream.

1. **Grab a beer / cookie / bar of chocolate when contribution is upstream.**

   Getting a challenge solution upstream gets your team **double points**.
   Once that is done, enjoy your success!
   Then move and grab another challenge.
   Show you're the past.

## Working on Challenges

You will get the number of points for submitting a solution that works.
Those points will be doubled if the PR is accepted upstream.
After solving one challenge, pick another one.
We recommend you start small then move up to more difficult challenges.

Please check the community guidelines on [submitting changes](/docs/contributing/submitting-changes) and [the review process](/docs/contributing/review-process).

## Challenge Types

Challenge types generally fall into the categories below.
You can go beyond the items marked in the [`Hackathons` project](https://github.com/orgs/unikraft/projects/29).

1. **Submitting issues**

   5 hackathon points are awarded for each submitted issue.

1. **Building and packing applications as dynamic PIE binaries** and adding them to the [`dynamic-apps` repository](https://github.com/unikraft/dynamic-apps)

   These applications aren't required to run on Unikraft.
   If something doesn't work submit an issue and get points for that.
   Follow the instructions in the [`Binary Compatibility` session](https://unikraft.org/community/hackathons/usoc23/bincompat/).

   Besides packing installed applications, you can also build the application from source.
   This is very helpful when debugging.
   The end result should be a script that will download the source code of the application, configure and build it.
   You can take a look at the examples in the [`static-pie-apps` repository](https://github.com/unikraft/static-pie-apps/) (e.g. the script for [`app-nginx`](https://github.com/unikraft/static-pie-apps/blob/master/nginx/build.sh)).

   **Note that you will not need to build the application as a `static-pie` executable, so the configuration should be easier.**

   20-50 hackathon points are awarded for each submitted application, depending on its complexity.

1. **Fixing build warning messages**

   5-10 hackathon points are awarded for each fix.

1. **Adding tests to internal and external libraries** using [the `uktest` framework](https://github.com/unikraft/unikraft/tree/staging/lib/uktest)

   Generally, 20 hackathon points are awarded for the initial test and configuration, with 3 points for each new test added.

1. **Updating library versions** (and making sure the new version builds and runs)

   20-30 hackathon points are usually awarded for the boost.

1. **Updating already ported application to use `Musl`**

   40-70 hackathon points are awarded for each updated application, depending on its complexity.

1. **Fixing issues**

   Hackathon points will be awarded according to the complexity of the fix.

1. **Adding testing scripts for the applications that run in binary compatibility mode**

   For the applications in the [`dynamic-apps` repository](https://github.com/unikraft/dynamic-apps), add scripts that will run the app on top of Unikraft and check that it works.

   20 points will be awarded for each script.

1. **Building and testing helloworld with Hyper-V**

   For this you need a Windows installation with Hyper-V support.
   Follow the instructions [here](https://github.com/unikraft/plat-hyperv/pull/1#issuecomment-1324421133) to build and test a helloworld application with Hyper-V.

   30 points for making it work, no PR submission required

1. **Building and testing helloworld with VMware**

   For this you need to install VMware support.
   Follow the instructions [here](https://docs.google.com/document/d/189y5zncps37ghng7QS86foFoYoFK_q63RE0vpn0kCg0/edit?usp=sharing) to build and test a helloworld application with VMware.

   30 points for making it work, no PR submission required
