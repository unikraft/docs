---
title: Security
date: 2022-03-18T14:09:21+09:00
weight: 201
---

## Unikraft's Inherent Security Benefits

We are convinced that unikernels have the potential to provide high levels of security, in some cases even better than that of mainstream operating systems.
This page gives an overview of our vision, highlights present security properties of Unikraft, and the various ongoing efforts to fully achieve Unikraft's security potential.

### Minimal Attack Surface

Unikraft is characterized by extreme specialization: its images contain only the code that is strictly necessary for the application to run, resulting in a drastically reduced attack surface.
As an example, a Unikraft production image contains no shell, no unneeded system services, no unneeded system calls or OS features, and dead code within used components is significantly reduced by aggressive compile and link stage optimizations.
Even the kernel functionality, unlike other unikernel projects, is modular, allowing users to easily remove components (e.g., the network stack) if not needed. While this does not eliminate all attack vectors, it severely reduces them, especially compared to a general-purpose OS.

### Strong Cross-Application Isolation

In addition to its attack-surface benefits, Unikraft also provides strong cross-application isolation: since each Unikraft VM runs a single application, cross-application isolation is provided by the hypervisor, resulting in significantly more robust guarantees than processes or Docker containers.
This ultimately means that even in the event that one application has been compromised, escalating privileges to the rest of the stack/infrastructure will be much harder for the attacker.

### Safe Languages

Unikernels have historically claimed robustness due to their implementation in safe languages (e.g., MirageOS with OCaml).
Although Unikraft is mainly implemented in C for performance reasons, it natively supports the implementation of components in safe languages.
For example, we have members of the community exploring the implementation of a formally verified scheduler in Dafny, or a safe network stack in Rust.
Ultimately, we envision Unikraft-built unikernels that mix and match heterogeneous components to optimally trade off security and performance.

### Security Features and Testing: Matching Linux

Because of their intrinsic characteristics, unikernels projects have, in the past, claimed high security for cloud appliances.
However, their security properties have been [called into question](https://research.nccgroup.com/wp-content/uploads/2020/07/ncc_group-assessing_unikernel_security.pdf), as existing research prototypes failed to match mainstream OSes' security features, robustness, and testing.
This aspect has historically been overlooked by unikernel prototypes for many reasons, including the fact that many, if not most, unikernels projects have been research ones and adding such features would have had little research value.
In contrast, Unikraft has the explicit aim of targeting real-world deployments, and as such we have, and are putting, effort into providing such features; we describe these next.


## Unikraft Security Features

In Unikraft, most of the core security features have been merged or are pending merge (e.g., ASLR / PIE, stack protection, ARM pointer authentication, etc.). This effort is by nature a continuous, community-driven task, but we are expecting completion of most core security features by the end of 2022. An overview of the state of security feature support is shown in the following table:

| Security feature                                                                                       | Status           | Targets                        |
| ------------------------------------------------------------------------------------------------------ | ---------------- | ------------------------------ |
| [Stack Smashing Protection (SP)](https://github.com/unikraft/unikraft/tree/staging/lib/uksp)           | Upstream         | `ARCH_ARM_64 \|\| ARCH_X86_64` |
| [Undefined Behavior Sanitization (UBSAN)](https://github.com/unikraft/unikraft/tree/staging/lib/ubsan) | Upstream         | any                            |
| [Rust internal libraries in Unikraft](https://github.com/unikraft/unikraft/tree/staging/lib/ukrust)    | Upstream         | `ARCH_X86_64`                  |
| [ARM Pointer authentication (PAuth)](#)                                                                | Under review     | `ARCH_ARM_64 \|\| ARCH_ARM_32` |
| [ARM Branch Target Identification (BTI)](https://github.com/unikraft/unikraft/pull/421)                | Under review     | `ARCH_ARM_64`                  |
| [Kernel Address Sanitizer (KASAN)](https://github.com/unikraft/unikraft/pull/191)                      | Under review     | `PLAT_KVM && ARCH_X86_64`      |
| [Position Independent Executables (PIE)](https://github.com/unikraft/unikraft/pull/239)                | Under review     | `PLAT_KVM && ARCH_X86_64`      |
| [True Random Number Generator](#)                                                                      | Under review     | `ARCH_X86_64`                  |
| ARM Memory Tagging Extension (MTE)                                                                     | Work-in-progress | ARM                            |
| Intel Control-flow Enforcement Technology (CET)                                                        | Planned          | `ARCH_X86_64`                  |
| Shadow stack                                                                                           | Planned          | any                            |
| `FORTIFY_SOURCE`                                                                                       | Planned          | any                            |
| ARM Speculation Barrier (SB)                                                                           | Planned          | `ARCH_ARM_64`                  |
| Kernel Page Table Isolation (KPTI)                                                                     | N/A              | N/A                            |
| Supervisor Mode Access Prevention (SMAP)                                                               | N/A              | N/A                            |
| Privileged Access Never (PAN)                                                                          | N/A              | N/A                            |


Note that, as shown in the table, some security features of mainstream OSes do
not apply to Unikraft: this is the case, for example, with numerous software counter-measures against speculative execution vulnerabilities such as KPTI, unnecessary because of the presence of a single application in the virtual machine.

### Testing

In addition to matching mainstream OSes' security features, any unikernel with production pretensions must have a thorough testing process: this aspect too has been often overlooked by the unikernel community due to its limited research value. Unikraft aims to improve on this by adopting state-of-the-art practices with [a rigorous review of code changes](/docs/contributing/review-process/) and systematic integration/unit testing with our [public Concourse CI/CD pipeline](https://builds.unikraft.io).  In addition to this, there is an ongoing effort to systematically and continuously fuzz test Unikraft as is done on Linux; we aim to write a blog post on this soon.

## Advanced Unikraft Security: Fine-Grained Compartmentalization

Longer term, we are looking into evolving Unikraft into a framework that allows users to flexibly introduce isolation boundaries within the unikernel to further increase the security of the system. This is a research direction that we recently explored with [FlexOS](https://project-flexos.github.io).
We developed a prototype that allows users to easily and safely compartmentalize less trusted, riskier, or unsafe parts of the application and the kernel with limited impact on performance, and to easily try a wide range of different design choices in the security vs. performance trade-off space (see graph below: each column is one such point in the design space).

{{< img
  class="max-w-3xl"
  src="https://raw.githubusercontent.com/project-flexos/asplos22-ae/main/experiments/fig-06_nginx-redis-perm/fig-06_nginx-redis-perm-redis.svg"
  title="Redis performance with varying security"
  caption="Components are on the left. Software hardening can be enabled [●] or disabled [○] for each component. The white/blue/red color indicates the compartment the component is placed into. Isolation is achieved with MPK and DSS."
  position="center"
>}}

{{< img
  class="max-w-3xl"
  src="https://raw.githubusercontent.com/project-flexos/asplos22-ae/main/experiments/fig-06_nginx-redis-perm/fig-06_nginx-redis-perm-nginx.svg"
  title="NGINX performance with varying security"
  caption="Components are on the left. Software hardening can be enabled [●] or disabled [○] for each component. The white/blue/red color indicates the compartment the component is placed into. Isolation is achieved with MPK and DSS."
  position="center"
>}}

If you're interested in contributing to security features in Unikraft, or simply in following the discussion about ongoing security work, please feel free to join [our Discord security channel](https://bit.ly/UnikraftDiscordSecurity).
