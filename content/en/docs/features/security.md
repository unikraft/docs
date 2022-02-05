---
title: Security
date: 2020-01-11T14:09:21+09:00
draft: false
collapsible: false
weight: 301
---

## Unikraft Security
 
Unikernels traditionally have had serious security issues, but we argue
that those have been implementation artifacts rather than fundamental
problems. In fact, unikernels are used commercially in security-minded
domains such as automotive because their high level of specialization means
that they provide a small Trusted Computing Base. Having said that, past
unikernel projects have failed to provide standard security features
commonly found in standard OSes (e.g., stack and page pro- tection, ASLR,
etc.); Unikraft already supports several of these including CFI, UBSAN,
Stack protector, KASAN, as well as initial support for hardware
compartmentalization with Intel MPK and EPT as show by
[FlexOS](https://project-flexos.github.io/). It should therefore be
possible to achieve good security while retaining high performance with
Unikraft.

Unikraft supports memory safe programming languages such as Rust
for writing both internal and external libraries. To learn more about
this, check the `ukrust` internal library.

From a cryptographic perspective, Unikraft uses the ChaCha20 PRNG.
