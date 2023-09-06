+++
title = "GSoC'22: Shadow Stack"
date = "2022-07-05T13:00:00+01:00"
author = "Maria Sfiraiala"
tags = ["GSoC'22"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2022-badge.svg" align="right" />

# GSoC'22: Shadow Stack

## Objectives

While Unikraft provides great [security advantages](https://github.com/unikraft/docs/blob/main/content/en/docs/features/security.md) through strong cross-application isolation, traditional means of securing one's application shouldn't be overlooked.

Following this idea, we introduce the Shadow Stack, a project which aims to adapt LLVM's / clang's `Shadow Call Stack` to Unikraft's needs, focusing on the `AArch64` architecture.

Enabling protection of the return address from ROP attacks should be highly modularized, that's why we plan to provide multiple functionalities in a possible API:

1. `has_shadow_stack`
1. `init_shadow_stack`
1. `init_shadow_stack_fixed_x18` (when a platform doesn’t reserve the `x18` register used for storing the Shadow Stack; Android, Darwin, Fuchsia already reserve it)
1. `no_shadow_stack` (shadow stack is disabled for a certain function even though it’s enabled globally)
1. `no_shadow_stack_strong` (disables shadow stack globally)

## Starting point

First thing first, I had to get accustomed with Unikraft itself.

Compiling and running some basic applications using both `kraft` and the `make` build system was done during the first week of GSoC.

I spent the second week investigating the [Shadow Stack implementation for Android](https://android-review.googlesource.com/c/kernel/common/+/694163) and coming up with the aforementioned extern API.

I plan on including these functionalities in a library (`ukshadow`) similar to `ubsan` or `kasan`.

Following the same idea, investigating the implementation for `kasan` further pointed out the need of perfectly understanding the layout of `ukboot` as I will have to modify the library by adding some constructors that will make possible the initialization of the `x18` register.

At this point, compiling any program with the Shadow Call Stack support provided by the compiler (`clang`) is not possible, until providing a runtime, and this represents one important milestone.

## Progress

One significant step forward was finding a mean of compiling Unikraft AArch64 apps using `clang`, as a straightforward solution wasn't documented.

Taking advice from the community really facilitated the process. 

LLVM's `clang` takes a big role in my project as previous work and research regarding Shadow Stacks was and still is mainly covered by it.

What's more, future work revolves around firstly, porting the `clang's` Shadow Call Stack by coming up with a constructor that'll use inline asm to initialize the `x18` register and secondly, perfectly alligning the Shadow Stack implementation to Unikraft.

## Interesting findings

The solution to the cross-compilation issue provided by the community was really important to my investigation work.

For future integration of this quick fix, check [this gist](https://gist.github.com/mariasfiraiala/6e5d5ad67952c46b79cb12b9875a7241).

## Next steps

After providing a constructor for the Shadow Stack pointer in the `ukboot` library and testing the approach using an `inline asm` macro, I'll get to implementing the mechanisms needed by the Shadow Stack and include them in their own internal library (the aforementioned `ukshadow`).

I won't forget to make use of some functionalities provided by `ukdebug` as a mean of signaling the user about the overwriting of their **precious** return address.