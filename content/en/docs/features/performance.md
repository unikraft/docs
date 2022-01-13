---
title: Performance
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 301
collapsible: false
# showTitle: true
---

## Unikraft Performance

Unikraft has been extensively evaluated in terms of performance.  Evaluations of
using off-the-shelf applications on Unikraft results in a 1.7x-2.7x performance
improvement compared to Linux guests.  In addition, Unikraft images for these
apps are around 1MB, require less than 10MB of RAM to run, and boot in around
1ms on top of the VMM time (total boot time 2ms-40ms).

### Memory Allocation Specialization

{{< img
  class="max-w-xl mx-auto"
  src="https://raw.githubusercontent.com/unikraft/eurosys21-artifacts/master/plots/fig_14_unikraft-nginx-alloc-boot.svg"
  title="Unikraft memory usage with different allocators"
  caption="Memory usage of a 'hello world' application running on Unikraft with different memory allocators.  Learn more about how this experiment was performed [here](https://github.com/unikraft/eurosys21-artifacts/tree/master/experiments/fig_08_unikraft-image-size)."
  alt="Memory usage of a 'hello world' application running on Unikraft with different memory allocators."
  position="center"
>}}

### Dead-Code Elimination (DCE)

### Link-Time Optimization (LTO)

...

{{< img
  class="max-w-xl mx-auto"
  src="https://raw.githubusercontent.com/unikraft/eurosys21-artifacts/master/plots/fig_08_unikraft-image-size.svg"
  title="Unikraft image sizes with DCE and LTO"
  caption="Image sizes of various applications on Unikraft with combinations of DCE and LTO enabled.  Learn more about how this experiment was performed [here](https://github.com/unikraft/eurosys21-artifacts/tree/master/experiments/fig_08_unikraft-image-size)."
  alt="Image sizes of various applications on Unikraft with combinations of DCE and LTO enabled."
  position="center"
>}}

...

### Virtual Machine Monitor (VMM) Specialization 

...

{{< img
  class="max-w-xl mx-auto"
  src="https://raw.githubusercontent.com/unikraft/eurosys21-artifacts/master/plots/fig_10_unikraft-boot.svg"
  title="Comparison of VMM boot times"
  caption="....  Learn more about how this experiment was performed [here](https://github.com/unikraft/eurosys21-artifacts/tree/master/experiments/fig_10_unikraft-boot)."
  alt="...."
  position="center"
>}}

...

### File-system Performance

<!-- https://raw.githubusercontent.com/unikraft/eurosys21-artifacts/master/plots/fig_22_compare-vfs.svg -->

## Running Performance Benchmarks

To ensure consistency between benchmarks, to prevent false-readings, and mis-,
running experiments with following recommendations ensures ...

## Related Research

Much of this page has been pulled from 