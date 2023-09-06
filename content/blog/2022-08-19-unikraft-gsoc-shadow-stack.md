+++
title = "GSoC'22: Shadow Stack"
date = "2022-08-19T13:00:00+01:00"
author = "Maria Sfiraiala"
tags = ["GSoC'22"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2022-badge.svg" align="right" />

# GSoC'22: Shadow Stack

This third blog post presents the efforts that were made in the direction of testing and perfecting complex apps (such as `SQLite`, `redis` and `nginx`) on `AArch64` using `gcc`, `clang` and `gcc-12` as compilers.

Nevertheless, it brings into attention current work for Shadow Stack, which relies heavily on firstly providing a working environment for the complex apps mentioned earlier.

## Starting point

As mentioned in the previous blog post, the first step meant to be taken moving forward was completing a matrix with the current progress regarding different compilers and architectures on complex apps, which can be found [here](https://github.com/mariasfiraiala/scs-work/blob/master/unikraft-scs/unikraft-scs-for-complex-apps.md).

This step took way more time than expected, due to debugging work: some minor functionalities were buggy and investigating and pinpointing the issues became, for a short period of time, the main goal of my project.

Nonetheless, I feel like this stage was critical and working with the community towards improving already upstreamed technologies was exciting.

## Progress

For now, my biggest achievement was coming up with workarounds for compiling and running complex apps using both `clang` and `gcc-12`.

What was so challenging about building apps like `SQLite` with `clang` was fixing some assembly `gcc`-isms found in the `newlib` library; as a result, I plan on providing a series of patches that would address this issue.

When it comes to the Shadow Stack progress, my [draft PR](https://github.com/unikraft/unikraft/pull/505) is slowly growing; adding multithreading support for Shadow Stack is critical and represents the starting point of proving such a mechanism is possible and works on apps that deal with multithreading (on Unikraft, `SQLite`, `redis`, `nginx`).

## Problems

One major problem that needs to be addressed is the way I allocate the Shadow Stack for threads; current implementation reserves memory right after the traditional stack which increases chances of giving out its position and consequently inducing security breaches.

On the other hand, however, a series of issues opened during the last month will better illustrate the struggles I was met with when working with `SQLite`, `redis` and `nginx`:

1. for `newlib`: [#19](https://github.com/unikraft/lib-newlib/issues/19) and [#20](https://github.com/unikraft/lib-newlib/issues/20)
1. for `unikraft`: [#514](https://github.com/unikraft/unikraft/issues/514) and [#518](https://github.com/unikraft/unikraft/issues/518)

## Interesting findings

Documenting each and every step I took when testing the aforementioned apps proved to be a great way of keeping track of all the relevant findings.

For instance, with help from the community, I was able to pinpoint the exact reason as to why `redis`, on `AArch64` wasn't accepting requests.

But more on that, [here](https://github.com/mariasfiraiala/scs-work/blob/master/unikraft-scs/unikraft-scs-for-complex-apps.md).

## Next steps

As GSoC'22 is rapidly coming to an end, my project is also approaching its final state: testing the Shadow Stack for threads, its impact on performance and security are just a few more steps I need to go through.

Moreover, preparing an internal library (`ukshadow`), the configuration parameters used by the `make build system` and optimizations will also be achieved during this period.

You'll find a more detailed roadmap [here](https://github.com/mariasfiraiala/scs-work/blob/master/utils/roadmap-scs.md).