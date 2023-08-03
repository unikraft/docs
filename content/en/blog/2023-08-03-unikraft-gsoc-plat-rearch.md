+++
title = "re:Arch Unikraft"
date = "2023-08--3T18:00:00+03:00"
author = "Rares Miculescu"
tags = ["GSoC'23", "plat re-arch"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

This blog post will show my work during the third quarter of GSoC'23.

## Current Progress

The main focus, of these past weeks, was to develop a `Driver Configuration` option in menuconfig.
During development, I encountered a problem and I was struggling with it for some time.
To be easier to implement, I moved the `gic` driver into `drivers/` and started writing the `Config.uk` file for it, but I couldn't figure out how to link the configuration to the `menuconfig`.
Fortunately, the mentors offered to help with an example, so the drivers migration will be more efficient.

In the meantime, we agreed that I will work on [defining data types that will replace the native gcc data types](https://github.com/orgs/unikraft/projects/36?pane=issue&itemId=19037961).

## Next Steps

I am currently doing research to see if these data types are appropriate and how we can implement them.
