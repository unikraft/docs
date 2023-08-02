+++
title = "GSoC'23: Arm CCA Support for Unikraft (Part 2)"
date = "2023-07-14T00:00:00+01:00"
author = "Xingjian Zhang"
tags = ["GSoC'23", "Security", "Arm CCA"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

[My previous post](https://unikraft.org/blog/2023-06-23-unikraft-gsoc-arm-cca-1/) provided an overview of the project on bringing Arm CCA support to Unikraft and the progress during the first three weeks of GSoC.
This blog describes my journey during the second three-week period of GSoC and discusses future steps.

## Current Progress

One milestone of this project is to run `app-helloworld` in the CCA platform.
By the midterm of GSoC, this project has successfully achieved this goal.
This [draft PR](https://github.com/unikraft/unikraft/pull/964) describes the required changes, which include the following:

* A new config `CONFIG_ARM64_FEAT_RME`.
  This config enables features required to run an application in the CCA platform.
* RSI commands required during the boot process.
  Dedicated functions use `smccc_invoke` to invoke `RSI_VERSION`, `RSI_REALM_CONFIG`, and `RSI_IPA_STATE_SET` commands.
* A `ukplat_rsi_init` function to initialize relevant features of the CCA platform.
  This function calls `ukplat_rsi_version` to get the RSI version, and then calls `ukplat_rsi_realm_config` to get `ipa_width`.
* A `ukplat_rsi_setup_memory` function at the end of `_init_dtb_mem`.
  This function uses `ukplat_rsi_ipa_state_set` to mark the memory area as `RSI_RAM`.
* Marking the device region in page table entries as `PROT_NS_SHARED`.

Noted that these changes are in a work-in-progress status.
This project will improve these changes later and add more features to support the CCA platform.

After making `app-helloworld` work, this project brings some attention to making `app-httpreply` work in the realm.
As part of an ongoing effort, this project has found an issue relating to this application.
The `app-httpreply` application utilizes `virtio` devices that communicate with the host using mmio.
However, certain unaligned read and write operations would cause a shutdown of the kernel.
After communicating with the Unikraft community, this project proposed a [PR](https://github.com/unikraft/unikraft/pull/970) to address this issue.
The PR introduces support for unaligned read and write operations in `virtio_mmio` by converting an n-byte read/write operation into n 1-byte read/write operations.

## Next Steps

After finishing the first milestone on bringing `app-helloworld` to the realm world, the next step is to add other features of the CCA platform and bring more applications to the realm world.
What to do in the next three weeks includes implementing all the remaining RSI commands and adding tests on these interfaces.

## Acknowledgement

Thanks to all my mentors and the Unikraft community for their guidance and support.
