---
title: Introduction to Unikernels and Unikraft
date: 2023-03-28T05:30:08+10:00
weight: 1
summary: |
  We go over the basics of unikernels, their purpose and the motivation behind building unikernels with the library Operating System model.
  We present the setup we use for the hackathon and check everything is OK before proceeding to actual work items.
  Expected time: 15 minutes
---

## Introduction to Unikernels and Unikraft

[Unikraft](https://github.com/unikraft/) is a Unikernel Development Kit and consists of an extensive build system in addition to core and external library ecosystem which facilitate the underlying functionality of a unikernel.
It is built as an open-source project and does so in the context of a vibrant community consisting of highly skilled software engineers, researchers, teachers, students and hobbyists.
As a community, its outreach consists of over 50 active contributors, 12 peer-reviewed academic publications, in 10 institutes, in 6 countries.

To find out more about Unikraft, checkout the [documentation](https://unikraft.org/docs/) and join [Discord](https://bit.ly/UnikraftDiscord).
Please also star the [main Unikraft repository](https://github.com/unikraft/unikraft/).

### Prerequisites

You should have basic knowledge of the following items:

* Linux CLI: working with the filesystem, running commands, documentation
* C programming language
* Git: a very good tutorial on Git is [Git Immersion](https://gitimmersion.com/)
* GitHub
* Operating system concepts (processes, memory management, working with files, networking)
* virtualization

## Setup

We encourage you to form teams of 3-4 people and work together during the:

* tutorials: first day (Thursday, March 30, 2023)
* hackathon challenge: second day (Friday, March 31, 2023)

### Resources

For this hackathon, you require a Linux-based environment and / or virtual machine.
-- TODO: Add links to virtual machines, guacamole setp, docker container

As a backup, we provide virtual machines where everything is setup.
Please see the `hack-athens23` channel on Discord for instructions on accessing the virtual machine.
You will require a computing system with a browser and an SSH client and that should be it.

### Setup Checks

First and foremost, access the virtual machine.

Secondly, list files.
You would get something like:

-- TODO: Change this if necessarry
```
ubuntu@vm-49:~$ ls
hack-athens-2023/

ubuntu@vm-49:~$ tree -L 2 --charset=ascii
.
|-- apps/
|-- libs/
`-- unikraft/
```

A quick description of the contents:

* `hack-athens-2023/` is a Unikraft work folder already setup to run Unikraft applications
* `unikraft/` contains the [Unikraft core](https://github.com/unikraft/unikraft) repository
* `libs/` will contain all the necessarry [external libraries](https://github.com/orgs/unikraft/repositories?q=lib-&type=all&language=&sort=)
* `apps/` will contain all the [applications](https://github.com/orgs/unikraft/repositories?q=app-&type=all&language=&sort=) we want to use

Thirdly, do the steps below:

#### Run Unikraft helloworld

Run the commands below to configure, build and run the Unikraft helloworld program.
No need to have a good understanding of the commands below, we'll detail them soon.

-- TODO: Change this to actual vm setup
```
[...]
```

### Run Unikraft httpreply

-- TODO: Change this to actual vm setup
```
[...]
```

#### Run nginx server on Unikraft

-- TODO: Change this to actual vm setup
```
[...]
```
