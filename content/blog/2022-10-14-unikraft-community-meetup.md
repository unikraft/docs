+++
title = "Unikraft Community Meet-up '22"
date = "2022-10-14T09:00:00+01:00"
author = "Andrei Mutu"
tags = ["community"]
+++

### The First of Many

We are excited to tell you about the first in-person Unikraft community meet-up, a long awaited event which was painfully postponed by the pandemic.
It took place in the shape of a three-day trip to Sinaia, Romania between the 14th and the 16th of October.

This was a great opportunity for most of the core members to finally meet in-person, get to know one another more and exchange Unikraft war stories, all the while being introduced to Romanian customs.

### A Hike, a Grill and a Presentation Walk into a Bar

What do all these have in common, you ask?
Well, one might be tempted to say nothing, but at a closer look this is what the main day of the trip looked like.

After a late arrival in Sinaia our participants had a somewhat early and uneventful end of the day.
Things took a more interesting turn when our participants went for a hike early in the morning (for those of you who, like me, can't believe it, we will have pictures at the end to prove it, so tag along).

Some went for a more traditional hike at [Vf. Piscul Câinelui](https://muntii-nostri.ro/ro/routeinfo/sinaia-vf-piscul-cainelui), while others went for a more conservative visit of the local places, like the [Peleș and Pelișor](https://peles.ro/) castle.

Sometime at midday both groups returned to the accommodations, where the main event was about to start, a community contributors presentation, which was composed of five topics.

The first one to break the ice was our community manager, [Răzvan Deaconescu](https://www.linkedin.com/in/razvandeaconescu/), who talked us through the general state of the community.
The highlight of the presentation was the ever increasing number of GitHub stars, recently breaking the thousand mark.
For more details, we have a blog post about it [here](blog/2022-10-14-unikraft-reaches-1k-github-stars/).

Coming immediately after, we had [Alexander Jung](https://www.linkedin.com/in/nderjung/), CPO at Unikraft, to give us a small talk about the current state of kraftkit, the future of the kraft companion for building unikernels, which we hope to deliver in the next release.
Tune in for more details because we will for sure have a blog post about it.

Afterward, we had [Simon Kuenzer](https://www.linkedin.com/in/simon-kuenzer-690a3145/), CTO and Co-Founder, give us a presentation about Musl support.
Our aim through Musl is to have a better binary compatibility, since Musl is the closest to libc and provides a Linux / POSIX compatible interface.
We aim to replace newlibc and pthread-embedded for more complex application which use threads.
While newlibc may still be of use in the future, it's not going to be a priority item in development and application support.

Continuing the trend, we had [Hugo Lefeuvre](https://www.linkedin.com/in/hugo-lefeuvre-at-debian/), core contributor to Unikraft, to give us a more detailed presentation about the way Unikraft handles security and how we want to ever increase it in our unikernels.
Here, a great deal of currently ongoing projects have been discussed.
We don't want to spoil it for you, but we can give a few names like `ASLR`,  `Shadow Stacks` and `W^X`.
As you might have already guessed, we will try to dedicate a future blog post to each.

Last but not least, we had [Michalis Pappas](https://www.linkedin.com/in/michalispappas/), core contributor, whose discussion approached the subject of platform architecture redesign redesigning and how it can improve Unikraft.

### Is There Such a Thing as a Meet-up Without a Grill?

While most of the participants were engaged in the previously mentioned presentations, some of our more battle hardened grill veterans started to `kraft` the grill (pun intended).
Unfortunately for our readers that didn't get to taste test it you will have to believe us when we tell you that our coding skills are great to say the least, but our grilling techniques are even better.

Such that, after ending the presentations and the internal discussions about Unikraft, our participants got to crack a cold one, enjoy the grill and socialize.

### To Many More to Come

We greatly enjoyed being finally able to meet face to face with most of the core contributors and we for sure cannot wait for the next one.
Here is a list of things to remember and hype the next meet-up:

- if you ever come to Romania do try some of our local drinks, you cannot go wrong with them, especially `pălincă`
- do try Răzvans's pancakes, they were so good that I hear it's become tradition to have them at every meet-up
- Unikraft could not have been possible without all of you guys so we want to thank you

And for those that still aren't convinced here is the proof:
The bravest of the brave that woke up early and challenged themselves to hike early in the morning.
{{< figure
    src="/assets/imgs/2022-10-15_team_A.JPG"
    title="Sinaia Community Meetup Hiking Team"
    position="center"
>}}
The definitely did not oversleep that chose to see the local attractions.
{{< figure
    src="/assets/imgs/2022-10-15_team_B.jpeg"
    title="Sinaia Community Meetup Visiting Team"
    position="center"
>}}
The main setup for the presentations
{{< figure
    src="/assets/imgs/2022-10-15_main_presentation.jpg"
    title="Sinaia Community Meetup Main Presentation"
    position="center"
>}}
