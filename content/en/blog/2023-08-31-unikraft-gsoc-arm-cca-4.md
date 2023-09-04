+++
title = "GSoC'23: Arm CCA Support for Unikraft (Part 4)"
date = "2023-08-31T00:00:00+01:00"
author = "Xingjian Zhang"
tags = ["GSoC'23", "Security", "Arm CCA"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

As my [GSoC project](https://summerofcode.withgoogle.com/programs/2023/projects/5oKH0o5n) journey is coming to an end, I'm excited to share the final update on my work, which brings Arm CCA support to Unikraft.
In [the previous period](./2023-08-04-unikraft-gsoc-arm-cca-3.md), I have already implemented all the RSI commands.
In the final weeks of GSoC, I have been working on improving the current implementations, finalizing pending PRs, and bringing more applications to the realm world.
This blog describes my work in this period.

## Current Progress

In the [v0.14.0 (Prometheus) release](https://github.com/unikraft/unikraft/releases/tag/RELEASE-0.14.0), three of my PRs were merged:

* [PR #970](https://github.com/unikraft/unikraft/pull/970) fixes an issue relating to unaligned read and write operations in `virtio_mmio`.
* [PR #985](https://github.com/unikraft/unikraft/pull/985) adds two configurations to `ns16550`, making it more versatile.
* [PR #1059](https://github.com/unikraft/unikraft/pull/1059) swaps the last two arguments of `virtio_9p_feature_negotiate`'s first call to `virtio_config_get`.

Besides these PRs, the v0.14.0 release also includes several features that enable the use of Unikraft in the realm.
Therefore, one part of my efforts in this period is to migrate the existing features for Arm CCA support, i.e. `librsi` and other modifications.
Upon this, I add some new features to `librsi`:

* `uk_rsi_setup_device` function to mark the device region as unprotected during the initialization phase.
* `set_memory_protected` and `set_memory_shared` functions that can dynamically mark a memory region as protected and shared.
* New tests on `set_memory_protected` and `set_memory_shared` as well as `uk_rsi_ipa_state_get` and `uk_rsi_ipa_state_set`.

Another part of my efforts is to bring more applications to the realm world.
The first step to do so is to make applications work with kvmtool.
After thorough debugging and testing, `app-helloworld`, `app-sqlite`, `app-httpreply`, and `app-redis` can work with kvmtool.
These applications use different devices, including the serial console, the `initrd` filesystem, and the networking device.

## Next Steps

This blog is the final one in the series of blogs describing my GSoC project.
For more information about the project, please check my [work product](https://github.com/unikraft/gsoc/pull/14) for this project.

As Arm CCA is still evolving, I will continue to work on this.

## Acknowledgement

Thanks to all my mentors and the Unikraft community for their guidance and support.
