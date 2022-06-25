---
title: Introduction and setup
date: 2022-05-13T19:30:08+10:00
weight: 1
summary: |
  We go over the basics of unikernels, their purpose and the motivation behind building unikernels with the library Operating System model.
  We present the setup we use for the hackathon and check everything is OK before proceeding to actual work items.
  Expected time: 30 minutes
---

## Introduction and Setup

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
* operating system concepts (processes, memory management, working with files, networking)
* virtualization

### Resources

For this hackathon, each of you will have access to a virtual machine where everything is setup.
Please see the `hack-aachen22` channel on Discord for instructions on accessing the virtual machine.

You will require a computing system with a browser and an SSH client at that should be it.

### Setup Checks

First and foremost, access the virtual machine.

Second, list files.
You would get something like:

```Bash
ubuntu@vm-49:~$ ls
docs  kraft  packages  workdir

ubuntu@vm-49:~$ tree -L 2 --charset=ascii
.
|-- docs
|   |-- Dockerfile
|   |-- LICENSE
|   |-- Makefile
|   |-- archetypes
|   |-- assets
|   |-- config
|   |-- content
|   |-- data
|   |-- go.mod
|   |-- i18n
|   |-- images
|   |-- layouts
|   |-- package.json
|   |-- postcss.config.js
|   |-- public
|   |-- resources
|   |-- scripts
|   |-- static
|   `-- tailwind.config.js
|-- kraft
|   |-- CONTRIBUTING.md
|   |-- COPYING.md
|   |-- MAINTAINERS.md
|   |-- MANIFEST.in
|   |-- Makefile
|   |-- README.md
|   |-- kraft
|   |-- kraft.egg-info
|   |-- package
|   |-- requirements-dev.txt
|   |-- requirements-pkg-deb.txt
|   |-- requirements.txt
|   |-- scripts
|   |-- setup.py
|   |-- tests
|   `-- tox.ini
|-- packages
|   `-- socat_1.7.4.1-3ubuntu1_amd64.deb
`-- workdir
    |-- apps
    |-- archs
    |-- libs
    |-- plats
    `-- unikraft

26 directories, 19 files
```

A quick description of the contents:

* `docs/` is the [documentation repository](https://github.com/unikraft/docs), where hackathon support files are stored
* `kraft/` is the [kraft companion tool](https://github.com/unikraft/kraft), that we will use to configure, build and run Unikraft;
   it's already installed on the virtual machine
* `workdir/` is a Unikraft work folder already setup to run Unikraft applications
* `packages/` is here because of [an issue with `socat` for qemu](https://github.com/unikraft/kraft/issues/29)

Thirdly, do the steps below.

#### Kraft Check

See if kraft is properly installed by finding out its version:

```Bash
ubuntu@vm-49:~$ kraft --version
kraft, version 0.5.0.dev491
```

#### Run Unikraft helloworld

Run the commands below to configure, build and run the Unikraft helloworld program.
No need to have a good understanding of the commands below, we'll detail them soon.

```Bash
ubuntu@vm-49:~$ cd workdir/apps/app-helloworld/

ubuntu@vm-49:~/workdir/apps/app-helloworld$ ls
CODING_STYLE.md  CONTRIBUTING.md  COPYING.md  Config.uk  MAINTAINERS.md  Makefile  Makefile.uk  README.md  kraft.yaml  main.c  monkey.h

ubuntu@vm-49:~/workdir/apps/app-helloworld$ export UK_WORKDIR=$(pwd)/../../

ubuntu@vm-49:~/workdir/apps/app-helloworld$ kraft configure -m x86_64 -p kvm
make: Entering directory '/home/ubuntu/workdir/unikraft'
LN      Makefile
MKDIR   lxdialog
MAKE    kconfig
/usr/bin/gcc -ldl -I. -I/home/ubuntu/workdir/apps/app-helloworld/build/kconfig -DCONFIG_=\"\"   -c fixdep.c -o /home/ubuntu/workdir/apps/app-helloworld/build/kconfig/fixdep.o
/usr/bin/gcc -ldl -I. -I/home/ubuntu/workdir/apps/app-helloworld/build/kconfig -DCONFIG_=\"\"   /home/ubuntu/workdir/apps/app-helloworld/build/kconfig/fixdep.o -o /home/ubuntu/workdir/apps/app-helloworld/build/kconfig/fixdep
#
# configuration written to /home/ubuntu/workdir/apps/app-helloworld/.config
#
make: Leaving directory '/home/ubuntu/workdir/unikraft'

ubuntu@vm-49:~/workdir/apps/app-helloworld$ kraft build
make: Entering directory '/home/ubuntu/workdir/unikraft'
make[2]: Nothing to be done for 'fetch'.
make: Leaving directory '/home/ubuntu/workdir/unikraft'
make: Entering directory '/home/ubuntu/workdir/unikraft'
CP      config
make: Leaving directory '/home/ubuntu/workdir/unikraft'
CC      libkvmplat: trace.common.o
[...]
Successfully built unikernels:

  => build/helloworld_kvm-x86_64
  => build/helloworld_kvm-x86_64.dbg (with symbols)

To instantiate, use: kraft run

ubuntu@vm-49:~/workdir/apps/app-helloworld$ kraft run
Trying to get root privileges...
**************************************************************************
 QEMU:
   Name:                  276db2ce-c6bd-47cd-b400-c7fe52c5cf6c
[...]
SeaBIOS (version 1.13.0-1ubuntu1.1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                 Hyperion 0.9.0~7f62c36
Hello world!
Arguments:  "/home/ubuntu/workdir/apps/app-helloworld/build/helloworld_kvm-x86_64" "console=ttyS0"
Console terminated, terminating guest (PID: 30118)...

ubuntu@vm-49:~/workdir/apps/app-helloworld$ kraft clean -d
RM      build/
RM      config
```

### Run Unikraft httpreply

```Bash
ubuntu@vm-49:~$ ls
docs  kraft  packages  workdir

ubuntu@vm-49:~$ cd workdir/apps/app-httpreply/

ubuntu@vm-49:~/workdir/apps/app-httpreply$ ls
CODING_STYLE.md  CONTRIBUTING.md  COPYING.md  MAINTAINERS.md  Makefile.uk  README.md  kraft.yaml  main.c

ubuntu@vm-49:~/workdir/apps/app-httpreply$ export UK_WORKDIR=$(pwd)/../../

ubuntu@vm-49:~/workdir/apps/app-httpreply$ kraft configure -m x86_64 -p kvm
make: Entering directory '/home/ubuntu/workdir/unikraft'
LN      Makefile
MKDIR   lxdialog
MAKE    kconfig
/usr/bin/gcc -ldl -I. -I/home/ubuntu/workdir/apps/app-httpreply/build/kconfig -DCONFIG_=\"\"   -c fixdep.c -o /home/ubuntu/workdir/apps/app-httpreply/build/kconfig/fixdep.o
/usr/bin/gcc -ldl -I. -I/home/ubuntu/workdir/apps/app-httpreply/build/kconfig -DCONFIG_=\"\"   /home/ubuntu/workdir/apps/app-httpreply/build/kconfig/fixdep.o -o /home/ubuntu/workdir/apps/app-httpreply/build/kconfig/fixdep
#
# configuration written to /home/ubuntu/workdir/apps/app-httpreply/.config
#
make: Leaving directory '/home/ubuntu/workdir/unikraft'

ubuntu@vm-49:~/workdir/apps/app-httpreply$ kraft build
[...]
Successfully built unikernels:

  => build/httpreply_kvm-x86_64
  => build/httpreply_kvm-x86_64.dbg (with symbols)

To instantiate, use: kraft run

ubuntu@vm-49:~/workdir/apps/app-httpreply$ sudo brctl addbr virbr0

ubuntu@vm-49:~/workdir/apps/app-httpreply$ sudo ip a a  172.44.0.1/24 dev virbr0

ubuntu@vm-49:~/workdir/apps/app-httpreply$ sudo ip l set dev virbr0 up

ubuntu@vm-49:~/workdir/apps/app-httpreply$ kraft run -b virbr0 "netdev.ipv4_addr=172.44.0.2 netdev.ipv4_gw_addr=172.44.0.1 netdev.ipv4_subnet_mask=255.255.255.0 --"
[INFO    ] Using networking bridge 'virbr0'
Trying to get root privileges...
**************************************************************************
 QEMU:
Starting VM...
[...]
Booting from ROM...
1: Set IPv4 address 172.44.0.2 mask 255.255.255.0 gw 172.44.0.1
en1: Added
en1: Interface is up
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                 Hyperion 0.9.0~7f62c36
Listening on port 8123...
Sent a reply
[...]

ubuntu@vm-49:~/workdir/apps/app-httpreply$ kraft clean -d
RM      build/
RM      config
```

This will start a simple HTTP server on the IP address `172.44.0.2` on port `8123`.
From another console in the VM, ask for the index page:

```Bash
ubuntu@vm-49:~$ wget 172.44.0.2:8123
--2022-06-25 07:50:47--  http://172.44.0.2:8123/
Connecting to 172.44.0.2:8123... connected.
HTTP request sent, awaiting response... 200 OK
Length: unspecified [text/html]
Saving to: ‘index.html’

index.html                                 [ <=>                                                                      ]     160  --.-KB/s    in 0s

2022-06-25 07:50:47 (22.2 MB/s) - ‘index.html’ saved [160]
```

#### Run nginx server on Unikraft

```Bash
ubuntu@vm-49:~$ ls
docs  kraft  packages  workdir

ubuntu@vm-49:~$ cd workdir/apps/app-nginx/

ubuntu@vm-49:~/workdir/apps/app-nginx$ ls
Makefile.uk  README.md  fs0  kraft.yaml

ubuntu@vm-49:~/workdir/apps/app-nginx$ export UK_WORKDIR=$(pwd)/../../

ubuntu@vm-49:~/workdir/apps/app-nginx$ kraft configure -m x86_64 -p kvm
make: Entering directory '/home/ubuntu/workdir/unikraft'
LN      Makefile
MKDIR   lxdialog
MAKE    kconfig
/usr/bin/gcc -ldl -I. -I/home/ubuntu/workdir/apps/app-nginx/build/kconfig -DCONFIG_=\"\"   -c fixdep.c -o /home/ubuntu/workdir/apps/app-nginx/build/kconfig/fixdep.o
/usr/bin/gcc -ldl -I. -I/home/ubuntu/workdir/apps/app-nginx/build/kconfig -DCONFIG_=\"\"   /home/ubuntu/workdir/apps/app-nginx/build/kconfig/fixdep.o -o /home/ubuntu/workdir/apps/app-nginx/build/kconfig/fixdep
#
# configuration written to /home/ubuntu/workdir/apps/app-nginx/.config
#
make: Leaving directory '/home/ubuntu/workdir/unikraft'

ubuntu@vm-49:~/workdir/apps/app-nginx$ kraft build
[...]
OBJCOPY libnginx.o
CC      libx86_64arch: tls.o
LD      libx86_64arch.ld.o
OBJCOPY libx86_64arch.o
LD      nginx_kvm-x86_64.ld.o
OBJCOPY nginx_kvm-x86_64.o
LD      nginx_kvm-x86_64.dbg
SCSTRIP nginx_kvm-x86_64
GZ      nginx_kvm-x86_64.gz
LN      nginx_kvm-x86_64.dbg.gdb.py
GEN     uk-gdb.py

Successfully built unikernels:

  => build/nginx_kvm-x86_64
  => build/nginx_kvm-x86_64.dbg (with symbols)

To instantiate, use: kraft run
[...]

ubuntu@vm-49:~/workdir/apps/app-nginx$ kraft run -b virbr0 "netdev.ipv4_addr=172.44.0.2 netdev.ipv4_gw_addr=172.44.0.1 netdev.ipv4_subnet_mask=255.255.255.0 --"
[INFO    ] Using networking bridge 'virbr0'
Trying to get root privileges...
**************************************************************************
 QEMU:
[...]
Booting from ROM...
1: Set IPv4 address 172.44.0.2 mask 255.255.255.0 gw 172.44.0.1
en1: Added
en1: Interface is up
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                 Hyperion 0.9.0~7f62c36

```

This will start an Nginx web server listening for connection on `172.44.0.2` (the default port is `80`).
From another console in the VM, ask for the index page:

```Bash
ubuntu@vm-49:~$ wget 172.44.0.2
--2022-06-25 08:01:09--  http://172.44.0.2/
Connecting to 172.44.0.2:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 180 [text/html]
Saving to: ‘index.html’

index.html                             100%[=========================================================================>]     180  --.-KB/s    in 0s

2022-06-25 08:01:09 (26.9 MB/s) - ‘index.html’ saved [180/180]
```
