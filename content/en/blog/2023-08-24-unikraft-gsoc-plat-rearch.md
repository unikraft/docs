+++
title = "re:Arch Unikraft"
date = "2023-08-24-3T20:00:00+03:00"
author = "Rares Miculescu"
tags = ["GSoC'23", "plat re-arch"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

This blog post will show the progress made in the past three weeks of GSoC'23.

## Current Progress

For the past three weeks, my focus was on proposing and implementing a new method that defines the data types, one that can be compiled on both GCC and Clang.
Besides data types, [the drivers subsystem](https://github.com/unikraft/unikraft/pull/1023) was introduced.
This PR helped me continue my work on migrating the drivers.
At the momment, [ukofw](https://github.com/unikraft/unikraft/pull/966) is merged and [ukintctlr](https://github.com/unikraft/unikraft/pull/971) is ready for review.
The other drivers are implemented, but not ready for review.
After `ukintctlr` is merged, I can make the final touches to the other drivers and get them ready for review.

## Next Steps

I will finish the implementation of the data types and, after making sure it runs, I will create a PR.
I will work on getting the other PRs, that migrate drivers, ready for review.
