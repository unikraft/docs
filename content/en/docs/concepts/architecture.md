---
title: Architecture
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 202
---

## Unikraft Architecture

{{< img
  class="mx-auto"
  src="/assets/imgs/unikraft-architecture.svg"
  title="Overview of Unikraft's architecture"
  caption="All components are micro-libraries that have their own Makefile and Kconfig configuration files, and so can be added to the unikernel build independently of each other.  APIs are also micro-libraries that can be easily enabled or disabled via a Kconfig menu; unikernels can thus compose which APIs to choose to best cater to an application's need."
  position="center"
>}}