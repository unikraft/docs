+++
title = "GSoC'23: Arm CCA Support for Unikraft (Part 1)"
date = "2023-06-23T00:00:00+01:00"
author = "Xingjian Zhang"
tags = ["GSoC'23", "Security", "Arm CCA"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

[This project](https://summerofcode.withgoogle.com/programs/2023/projects/5oKH0o5n) aims to bring [Arm Confidential Computing Architecture (CCA)](https://www.arm.com/architecture/security-features/arm-confidential-compute-architecture) feature to Unikraft.
It has been accepted as a [Google Summer of Code (GSoC)](https://summerofcode.withgoogle.com/) project.
Arm CCA is a new confidential computing technology in [Armv9 architecture](https://www.arm.com/company/news/2021/03/arms-answer-to-the-future-of-ai-armv9-architecture) that enables OS to run as a confidential VM without trusting the underlying hypervisor.
This blog gives an overview of the project, the progress made in the first three weeks of GSoC, and future steps.

## About Me

My name is Xingjian Zhang.
I am a second-year graduate student studying at [Zhejiang University](https://www.zju.edu.cn/english/).
You can find me on [GitHub](https://github.com/zhxj9823).
I am really happy to work on this project.

## Project Overview

### Arm CCA

[Arm CCA](https://www.arm.com/architecture/security-features/arm-confidential-compute-architecture) introduces Realm Management Extension (RME), which extends [Arm TrustZone technology](https://www.arm.com/technologies/trustzone-for-cortex-a) with two new security states: the `realm` state and the `root` state.
The following figure shows the system architecture of the CCA.
Instead of running a VM in the normal world, the CCA can run a VM in the realm state.
The realm state constructs protected execution environments called realms, which protect the data in the realms from other components.
This architecture allows the hypervisor to control the VM but removes the right for access to that VM.
The CCA achieves this separation through a combination of architectural hardware extensions (RME) and firmware (Realm Manager in EL2 and Monitor in EL3).

![Arm CCA architecture](https://www.arm.com/-/media/global/Why%20Arm/architecture/security/cca/arm-cca-realms-diagram.png?revision=ea88f294-2e89-49ca-9ecc-9400f7177692&h=650&w=1093&rev=ea88f2942e8949ca9ecc9400f7177692&hash=BE1FD0370318E58F091A56CD689A07B8970F8F9D")

The Realm Management Monitor (RMM) is the realm world firmware that is used to manage the execution of the realm VMs and their interaction with the hypervisor in the normal world.
The RMM operates in Exception level 2 in the realm world.
The RMM provides services to the realms, using Realm Service Interface (RSI).
Therefore, to use a unikernel as an application in a realm, Unikraft needs to support the use of RSI.
Besides, Unikraft also needs to support memory management and attestation in Arm CCA.
As a reference, Arm has provided an [integration stack](https://gitlab.arm.com/arm-reference-solutions/arm-reference-solutions-docs/-/blob/master/docs/aemfvp-a-rme/user-guide.rst) for Arm's reference CCA software architecture and implementation.
The main components in the reference integration are [Linux-CCA](https://gitlab.arm.com/linux-arm/linux-cca), [Kvmtool-CCA](https://gitlab.arm.com/linux-arm/kvmtool-cca), [Trusted-Firmware-A](https://trustedfirmware-a.readthedocs.io/en/latest/), [Hafnium](https://review.trustedfirmware.org/plugins/gitiles/hafnium/hafnium/+/HEAD/README.md), [TF-RMM](https://tf-rmm.readthedocs.io/en/latest/).

### Objectives

To make Unikraft run on the CCA, we need to achieve the following objectives:

* Add support for kvmtool to run [`app-helloworld`](https://github.com/unikraft/app-helloworld) in the normal world.
* Add options for CCA and basic support like RSI commands to run `app-helloworld` in a realm.
* Prepare the FVP environment and add support for it.
* Add support for more advanced features like attestation and memory encryption
* Add testing applications and evaluate the overall project.

## Current Progress

All the progress made and the relevant knowledge of this project is maintained on this [GitHub Project](https://github.com/orgs/unikraft/projects/39/views/1) page.
My progress in the first three weeks of GSoC can be divided into information gathering and code implementation.

On the information-gathering side, I have gathered the necessary details on the following questions:

* How does Unikraft currently boot?
* How Linux is booted in kvmtool?
* What devices are supported in kvmtool?
* What are the changes by Arm to kvmtool for CCA?
* What are the changes in the realm Linux?

On the code-implementation side, the differences between kvmtool and QEMU `virt` platforms lead to several changes:

* The page table in `unikraft/plat/kvm/arm/bpt64.S` maps memory regions according to the memory layout of kvmtool.
* Kvmtool supports the `ns16550` serial console, so it replaces the default `pl011` in Unikraft.
  Besides, the `ns16550` serial console in kvmtool uses byte-width registers.
* Kvmtool puts the device tree at the end of the memory region and passes its address in the `x0` register.
  So `_init_dtb_mem` excludes the dtb regions from the stack and heap area.

## Next steps

As Unikraft's `app-helloworld` can be run in kvmtool and the relevant knowledge of CCA is gathered, this project moves toward adding support for CCA and running `app-helloworld` in a realm.
This includes adding options for CCA and basic support like RSI commands.
The goal of this project, by the midterm of GSoC, is to bring basic features for CCA to Unikraft.

## Acknowledgement

Thanks to all my mentors and the Unikraft community for their guidance and support.
