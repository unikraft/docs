---
title: Green & Efficient
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 301
collapsible: false
---

## Unikraft is Green & Efficient

As a proof of concept, we have ported Unikraft to the Raspberry Pi 3 B+ and the
Xilinx Ultra96-V2 devices. We compare Unikraft with off-the-shelf Alpine Linux
and Raspbian OS as well as a specialized, stripped down Raspbian (removing
non-essential build tools, system packages and docs).

We evaluate power consumption versus Linux when idle and when running a
CPU-intensive calculation of π (see figure below); as shown, Unikraft can
provide important power reduction in both scenarios in comparison to Linux
(running only on a single core and with networking modules disabled, for fair
comparison).

{{< img
  class="max-w-xl mx-auto"
  src="/assets/imgs/unikraft-energy-consumption.svg"
  title="Unikraft low energy consumption"
  caption="RPI Unikraft power use vs. Alpine and Raspbian when idle and when calculating π"
  position="center"
>}}

Note that while these tests were run on small ARM devices, the
efficiency gains would also translate to power reduction on larger
devices such as servers.

{{< alert theme="info" >}}
Read more about how Unikraft was evaluated in terms of energy consumption in the
[IEEE 2020 International Conference on Embedded Software (EMSOFT)
publication](https://ieeexplore.ieee.org/document/9244044).
{{</ alert >}}
