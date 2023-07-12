+++
title = "re:Arch Unikraft"
date = "2023-07-12T15:00:00+03:00"
author = "Rares Miculescu"
tags = ["GSoC'23", "plat re-arch"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

[The previous blog](https://github.com/unikraft/docs/blob/main/content/en/blog/2023-06-22-unikraft-gsoc-plat-rearch.md) provides my progress and experience on `Unikraft's Platform Re-architecturing` project, during the first three weeks of GSoC'23.
This blog post will present the progress made since the first one, as well as my future plans.

## Current Progress

One task that was finished is [replacing the libc data types with Unikraft-specific data types](https://github.com/unikraft/unikraft/pull/954), as well as [moving compiler definitions from `essentials.h` into `compiler.h`](https://github.com/unikraft/unikraft/pull/960).
For these PRs, I need to make some final adjustments, before being ready for review.

The current project requires a good knowledge of the build system.
That being said, during the last week, I started to follow some courses that help me improve my skills regarding the build system and boot system (for future projects).

At the moment, we are working on moving the drivers from `plat/drivers` into `drivers/`.
I splitted this task in subtasks for each driver.
Progress is already made for `virtio`, `ofw` and `gic` drivers.

## Next Steps

During the last meeting, it was discussed to build a `Driver Configuration` option in menuconfig.
The next step, is to create a structure and a demo for this menu, as well as for the `drivers/` folder.
