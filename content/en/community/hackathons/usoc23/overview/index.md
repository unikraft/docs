---
title: Session 01 - Overview of Unikraft
linkTitle: Setting Up Unikraft
weight: 5
summary: |
  We present the initial steps in setting up the Unikraft development / usage environment.
  Students will use the basic Unikraft toolchain to set up, configure, build and run Unikraft images.
  Expected time: 60 minutes
---

## Set Up

We encourage you to split into teams of 5-6 people, we have the teams proposals [here](https://docs.google.com/spreadsheets/d/1O17J63nHGo9ZVPQvDKCJbk2jUUB44D-rtyB1CmJlXFg/edit?usp=sharing), you can use the `#hack-team-XX-voice` channels on the [Discord server](https://bit.ly/UnikraftDiscord).
You will need a Linux environment for this session.
You can use a virtual machine, but we strongly recommend a native Linux install.
We provide you with a [virtual machine](https://drive.google.com/file/d/16oBxfjFvu5mpf6DMb4-bsnyd5n2FqReo/view?usp=sharing) that has the minimum requirements already installed.
The credentials for the virtual machine are `unikraft:unikraft`.

You will need to install the following packages:

* `build-essential` / `base-devel` / `@development-tools` (the meta-package that includes `make`, `gcc` and other development-related packages)
* `gcc-aarch64-linux-gnu`
* `sudo`
* `flex`
* `bison`
* `git`
* `wget`
* `uuid-runtime`
* `qemu-system-x86`
* `qemu-system-arm`
* `qemu-kvm`
* `sgabios`

On Ubuntu, Debian, and other `apt`-based distributions, you can use the following command to install the requirements:

```console
sudo apt install -y --no-install-recommends \
        build-essential \
        sudo \
        gcc-aarch64-linux-gnu \
        libncurses-dev \
        libyaml-dev \
        flex \
        bison \
        git \
        wget \
        uuid-runtime \
        qemu-kvm \
        qemu-system-x86 \
        qemu-system-arm \
        sgabios
```

For running Unikraft with networking support, you will also need to configure QEMU to allow network bridge access:

```console
sudo mkdir /etc/qemu/
echo "allow all" | sudo tee /etc/qemu/bridge.conf
```

## `app-helloworld` on Unikraft

The Unikraft `helloworld` application is located in [this repository](https://github.com/unikraft/app-helloworld), along with instructions on how to configure, build and run the application.
We will go through them without focusing that much on the details, since we will see how everything works behind the scenes in the next sessions.
Go through the repository `README.md` file, starting with the [`Requirements` section](https://github.com/unikraft/app-helloworld/blob/staging/README.md#requirements).

## Work Items

Now that you've seen how to run Unikraft `helloworld`, you can go through the list below, follow the same steps and try more applications.
All the steps required for running the applications can be found in every app repository `README.md` file.

* [`app-httpreply`](https://github.com/unikraft/app-httpreply)
* [`app-nginx`](https://github.com/unikraft/app-nginx)
* [`app-redis`](https://github.com/unikraft/app-redis)
* [`app-sqlite`](https://github.com/unikraft/app-sqlite)
* [`app-python3`](https://github.com/unikraft/app-python3)
