---
title: Session 02 - Baby Steps
linkTitle: Bulding Unikernels
weight: 2
summary: |
  We start presenting the modular architecture of Unikraft and how students can build their unikernels using the manual, `make`-based approach.
  Expected time: 100 minutes
---

{{< readfile file="/community/hackathons/sessions/setup/content/intro.md" markdown="true" >}}

## Reminder
In the previous [session](community/hackathons/usoc23/overview), we have experimented with building and running several unikernels using instructions from the `README.md` files of the applications.
Today, we will explore the modular architecture of Unikraft, and how we can leverage that in order to setup, configure, build and run our unikernels from scratch, without the use of scripts.

## Intro
{{< readfile file="/community/hackathons/sessions/baby-steps/content/intro.md" markdown="true" >}}
## Setting up Helloworld

{{< readfile file="/community/hackathons/sessions/baby-steps/content/Setup_Helloworld.md" markdown="true" >}}
## Preparing Nginx

{{< readfile file="/community/hackathons/sessions/baby-steps/content/Setup_Nginx.md" markdown="true" >}}

## Work items

Now that we have finished building and configuring a couple of applications from scratch, you can try your hand at a few more others (check [this guide](https://unikraft.org/docs/usage/make_build/#building-and-running-complex-applications-with-make) for the config options you need to choose):
* [`app-httpreply`](https://github.com/unikraft/app-httpreply)
* [`app-redis`](https://github.com/unikraft/app-redis)
* [`app-sqlite`](https://github.com/unikraft/app-sqlite)
* [`app-python3`](https://github.com/unikraft/app-python3)

A good idea is to just fiddle around `menuconfig` and try multiple options from the huge list of internal libraries available, see what happens.
Furthermore, we encourage you to also build and run your applications for the `ARM64` architecture, as well.
As a bonus task, try to modify the `kraft.yaml` files found inside the applications' directory to include `ukdebug` and `uktest` as additional internal libraries.
