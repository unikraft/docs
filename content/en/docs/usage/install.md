---
title: Installing kraft
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 401
collapsible: false
---

## Installing `kraft`

To get started, please install the `kraft` command-line client which is used for
defining, configuring, building, and running Unikraft applications. Installation
can be performed in a number of different ways depending on your preferences or
system requirements.

### Debian/Ubuntu

#### Prerequisites

 * Debian Buster (10)
 * Debian Stretch (9)
 * Ubuntu Focal (20.04) LTS
 * Ubuntu Bionic (18.04) LTS
 * Ubuntu Xenial (16.04) LTS

#### Installation Instructions

The process for installing `kraft` on Debian or Ubuntu is straight forward and
we recommend using our hosted APT managed repository to access the latest
updates.

1. Update the APT package index and install packages to allow APT to use a
   repository over HTTPS:
   ```bash
   $ sudo apt install \
       apt-transport-https \
       ca-certificates \
       software-properties-common \
       curl \
       gnupg2
   ```

2. Add the Linux-distribution GPG key:

   ```bash
   $ curl -fsSL https://releases.unikraft.org/linux/gpg | sudo apt-key add -
   ```

3. Verify that you now have the key with the following fingerprint:
 
   ```bash
   $ apt-key fingerprint 8D14C246
  
   pub   rsa4096 2020-10-22 [SC] [expires: 2024-10-22]
       DCE2 072B 5FAE 29BF F78C  9AED 5989 A47D 8D14 C246
   uid           [ unknown] Unikraft <unikraft@unikraft.org>
   uid           [ unknown] Unikraft Monkey <monkey@unikraft.io>
   sub   rsa4096 2020-10-22 [E] [expires: 2024-10-22]
   ```


4. Add the remote repository by using the following command for **Debian**:

   ```bash
   $ sudo add-apt-repository \
       "deb [arch=amd64] http://releases.unikraft.org/linux/debian \
       $(lsb_release -cs) \
       stable"
   ```
   
   Or, for **Ubuntu**:

   ```bash
   $ sudo add-apt-repository \
       "deb [arch=amd64] http://releases.unikraft.org/linux/ubuntu \
       $(lsb_release -cs) \
       stable"
   ```

   {{< alert theme="info" >}}
   **Note:** To add the `staging` branch of the kraft repository, remove or
   append to the "`stable`" branch-name keyword.
   {{< /alert >}}

5. Update the APT package index on your machine and install `unikraft-tools`:

   ```bash
   $ sudo apt-get update
   $ sudo apt-get install unikraft-tools
   ```
  
   This will install `kraft` along with additional packages required to build
   a Unikraft unikernel, including `gcc`, `make`, etc.

### Docker

You can use the container environment for `kraft` if you do not wish to install
all the dependencies which are required for building Unikraft unikernels.
Typically, this includes `gcc`, `make` and friends in order to compile a
unikernel application as well as hypervisor toolchain, such as `qemu-system-x86`
in order to instantiate the unikernel itself.

To quickly get started with a known working environment, you can use the kraft
Docker environment, which can be a good starting ground and workspace.

#### Prerequisites

Ensure that Docker has been installed on your machine.

#### Installation Instructions

To simply get started, attach a workspace as a volume to the kraft container
image like so:

```bash
$ docker run -it --rm \
    -v $(pwd):/usr/src/unikraft \
    --entrypoint bash
    unikraft/kraft:staging
```
    
This will attach you to a new workspace environment where you can begin using
`kraft`.  There are two versions of the `kraft` Docker environment, with the
following tags:

 * `unikraft/kraft:staging` contains the latest staging version of `kraft`
   and is continiously updated with new commits to this branch; and,
 * `unikraft/kraft:latest` which contains the latest stable version of
   `kraft`.

It is possible to launch Unikraft unikernels via this container environment by
mounting the correct paths to your VMM sockets.  For example, with KVM and QEMU
you can launch the container environment like so:

```bash
$ docker run -it --rm \
    -v $(pwd):/usr/src/unikraft \
    --device /dev/kvm
    --entrypoint bash
    unikraft/kraft:staging
```

{{< alert theme="warning" >}}
**Containers and unikernels are not the same!**  Learn more about the differences
between these runtime systems in [virtualization](/docs/concepts/virtualization).
{{< /alert >}}


### With `pip`

To install `kraft` manually using the python toolchain, you can do this easily
too by specifying the install location of the repository from
[GitHub](https://github.com/unikraft/kraft.git):

```bash
pip3 install https://github.com/unikraft/kraft.git@stable
```

### Install to hack

If you have found a bug, issue or wish to extend the kraft codebase, then simply
clone the repository and install kraft in "edit mode":

```bash
git clone https://github.com/unikraft/kraft.git
pip3 install -e ./kraft
```

More information about `kraft`'s internal build system can be found by
running `make help` within the repository:

```txt
Usage: [FLAGS=...] make TARGET                                             
                                                                              
  kraft's build system is designed to help package, test and release the      
  unikraft-tools software suite.  To find out more information about a specfic
  target listed below, use:                                                   
                                                                              
    make help TARGET                                                          
                                                                              
  If you are trying to install kraft, please refer to our getting started     
  guide: https://unikraft.org/getting-started.  If you are a developer wishing
  to make changes to kraft, please refer to the CONTRIBUTING.md document      
  located in this repository.                                                 
                                                                              
General targets:                                                              
  install                  Install kraft and other unikraft tools.            
  clean                    Clean build artifacts excluding packages.          
  properclean              Clean everything.                                  
  get-version              Show the current version of the application.       
  help                     Show this help menu.                               
                                                                              
Developer targets:                                                            
  release-commit           Commit and tag a release to the repository.        
  changelog                Produce a changelog based on the git log.          
  bump                     Increment kraft's release version in the source    
                            repository.                                      
                                                                              
Docker container build targets:                                               
  docker-gcc               Build gcc and binutils in Docker container.        
  docker-qemu              Build qemu in a Docker container.                  
  docker-kraft             Build the kraft Docker container.                  
  docker-linuxk            Build the Linux kernel in a container.             
  docker-pkg-deb           Build a Debian-based packaging environment.        
  docker-pkg-deb-all       Build all Deban-based packaging environments.      
                                                                              
Packaging targets:                                                            
  sdist                    Produce a distributable tarball of the source tree.
  pkg-deb                  Produce a Debian-based package.                    
                                                                              
Test targets:                                                                 
  test                     Run all test targets.                              
  test-all                 Alias for 'make test'.                             
  test-lint                Perform a syntax check on kraft.                   
  test-pkg                 Test the installation of kraft packages.           
  test-unit                Run all defined unit tests.                        
  test-coverage            Generate a coverage report.                        
  test-docker-pkg-deb      Test the installation of a Debian-based package.   
  test-docker-pkg-deb-all  Test the installation of all Debian-based packages.
                                                                              
Docker proxy:                                                                 
  Some targets are automatically proxied via a Docker container so as to      
  ensure consistency between runtime environments.  To turn off proxying      
  targets via Docker, ensure that requirements-dev.txt has been satisfied then
  simply unset the DOCKER variable, for example:                              
                                                                              
    DOCKER= make test                                                         
                                                                              
Help:                                                                         
  For help using this tool, please open an issue on the Github repository:    
  https://github.com/unikraft/kraft or send an email to our maling list:                                
  <unikraft@listserv.neclab.eu>.            
```                                  

{{< alert theme="info" >}}
Additional dependencies include ``git``, ``make``, ncurses, ``flex``, ``wget``,
``unzip``, ``tar``, ``python3`` (including  ``setuptools``) and ``gcc``.
Details on how to configure how ``kraft`` interacts with gcc and the Unikraft
build system in addition on how to use ``kraft`` with Docker is covered in
:ref:`advanced_usage`.
{{< /alert >}}