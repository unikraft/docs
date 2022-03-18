+++
title = "Unikraft and more at ASPLOS’22"
date = "2022-02-17T00:00:00+01:00"
author = "Alexander Jung"
tags = ["announcement"]
+++

Unikraft will appear at the International Conference on Architectural Support for Programming Languages and Operating Systems (ASPLOS'22) with both a paper, _FlexOS: Towards Flexible OS Isolation_, focusing on new security aspects introduced at Unikraft as well as a general introductory workshop to Unikraft to be led by Razvan Deaconescu, Alexander Jung, Hugo Lefeuvre, Vlad Bădoiu, Cristian Vijelie and Pierre Olivier.

### FlexOS: Towards Flexible OS Isolation

Presented by Hugo Lefeuvre, FlexOS, a novel OS allowing users to easily specialize the safety and isolation strategy of an OS at compilation/deployment time instead of design time.
This modular LibOS is composed of fine-grained components that can be isolated via a range of hardware protection mechanisms with various data sharing strategies and additional software hardening.
The OS ships with an exploration technique helping the user navigate the vast safety/performance design space it unlocks.
We implement a prototype of the system and demonstrate, for several applications (Redis/NGINX/SQLite), FlexOS' vast configuration space as well as the efficiency of the exploration technique: we evaluate 80 FlexOS configurations for Redis and show how that space can be probabilistically subset to the 5 safest ones under a given performance budget.
We also show that, under equivalent configurations, FlexOS performs similarly or better than several baselines/competitors.

{{< alert theme="info" >}}
**Update**: Following the presentation at the conference, **FlexOS was awarded "Distinguised Artifacts" at [ASPLOS'22](https://asplos-conference.org/2022/).** 🏆
{{</ alert >}}

More details about FlexOS can be found at https://project-flexos.github.io 

### Unikraft Tutorial

With the advance of virtualization technology and the constant demand for specialization, security and performance, unikernels are no longer a fringe idea.
In this tutorial we present Unikraft, a unikernel SDK aiming for extreme specialization.

The event will be held in hybrid format, both in person and virtually.
For more information about the event and how to register, please visit https://asplos-conference.org.
All virtual attendees will be able to watch all talks, participate in all Q&As, as well as have online help via dedicated members from the open-source community.

For full details of the event and to follow along, please visit the dedicated tutorial website at: https://asplos22.unikraft.org 
