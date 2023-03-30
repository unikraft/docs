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

For this hackathon, you require a native Linux environment and / or virtual machine.

You need to install required packages.
On a Debian/Ubuntu-based setup, use the commands below to install required packages:

```console
$ sudo apt -y update
$ sudo apt -y install sudo
$ sudo apt -y install vim
$ sudo apt -y install less
$ sudo apt -y install ca-certificates
$ sudo apt -y install --no-install-recommends \
            build-essential \
            libncurses-dev \
            libyaml-dev \
            flex \
            git \
            wget \
            socat \
            bison \
            unzip \
            uuid-runtime \
            python3 \
            qemu-kvm \
            qemu-system-x86 \
            sgabios
```

If a native Linux environment is not available, you can use [this virtual machine](https://drive.google.com/file/d/1u5DtN5kMPWxBU8UdBfnZ7DNRP2n6oiTy/view?usp=share_link).
It's in OVA format, import it in VirtualBox or VMware or any other OVA-supporting virtualization solution.

As a backup, we provide virtual machines where everything is setup.
They are available on [UPB Guacamole infrastructure](https://guacamole.grid.pub.ro/).
Please see the `hack-athens23` channel on Discord for instructions on accessing the virtual machine.
You will require a computing system with a browser and an SSH client and that should be it.

We also have a Docker setup prepared that you can use.
Make sure you have [Docker installed](https://docs.docker.com/engine/install/).
Grab the Docker container by running:

```console
$ docker pull index.unikraft.io/unikraft.org/hackathons/base:latest
```

You can then run an instance using:

```console
$ docker run --rm -it index.unikraft.io/unikraft.org/hackathons/base:latest /bin/bash
```

Inside the container you have all packages and setup required to setup and build Unikraft images.
Running (via QEMU) is still recommended to happen outside the Docker container.

### Setup Checks

First and foremost, access the virtual machine.

Secondly, list files.
You would get something like:

```console
unikraft@vm-49:~$ ls
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

To easly setup, build and run the Unikraft `helloworld` application we provided some scripts that do all the work for you.
Clone the [scripts repository](https://github.com/unikraft-upb/scripts.git) on your machine to get started.
Run the commands below to configure, build and run the Unikraft `helloworld` program.
We will get into what the scripts do behind the scenes in the next session.

```console
$ git clone https://github.com/unikraft-upb/scripts.git
$ cd scripts/
$ cd make-based/app-helloworld/
$ ./do.sh setup    # <- this will clone all the dependencies in the `../../workdir` directory
Cloning into '../../workdir/unikraft'...
remote: Enumerating objects: 17633, done.
remote: Counting objects: 100% (682/682), done.
[...]

$ ./do.sh build    # <- this will invoke the Unikraft build system
make[1]: Entering directory '/home/stefan/.unikraft/unikraft'
LN      Makefile
MKDIR   lxdialog
CP      config
MKDIR   lxdialog
LN      helloworld_kvm-x86_64.dbg.gdb.py
[...]

$ ./do.sh run      # <- this will run the application that was build on the previous step, using `qemu`
SeaBIOS (version 1.13.0-1ubuntu1.1)
Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Janus 0.11.0~422ceb47
Hello world!
Arguments:  "build/helloworld_kvm-x86_64"
```

### Run Unikraft httpreply

With the same set of scripts, we can build and run the [`httpreply` Unikraft application](https://github.com/unikraft/app-httpreply).

```console
$ cd ~
$ cd scripts/
$ cd make-based/app-httpreply/
$ ./do.sh setup    # <- this will clone all the dependencies in the `../../workdir` directory
Cloning into '../../workdir/unikraft'...
remote: Enumerating objects: 17633, done.
remote: Counting objects: 100% (682/682), done.
[...]

$ ./do.sh build    # <- this will invoke the Unikraft build system
make[1]: Entering directory '/home/stefan/.unikraft/unikraft'
LN      Makefile
MKDIR   lxdialog
CP      config
MKDIR   lxdialog
LN      httpreply_kvm-x86_64.dbg.gdb.py
[...]

$ ./do.sh run      # <- this will run the application that was build on the previous step, using `qemu`
Booting from ROM..1: Set IPv4 address 172.44.0.2 mask 255.255.255.0 gw 172.44.0.1
en1: Added
en1: Interface is up
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Janus 0.11.0~422ceb47
Listening on port 8123...
```

The setup step will create a virtual bridge to enable communication with the unikernel.
To test that the application works properly, we can run from another terminal:

```console
$ wget 172.44.0.2:8123
--2023-03-30 07:56:30--  http://172.44.0.2:8123/
Connecting to 172.44.0.2:8123... connected.
HTTP request sent, awaiting response... 200 OK
Length: unspecified [text/html]
Saving to: ‘index.html’

index.html              [ <=>                ]     159  --.-KB/s    in 0s

2023-03-30 07:56:30 (10,5 MB/s) - ‘index.html’ saved [159]
```
