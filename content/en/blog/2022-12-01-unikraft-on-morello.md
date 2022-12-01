+++
title = "Building the Future of Security and Isolation with Unikraft on Morello!"
date = "2022-12-01T10:28:29+00:00"
author = "Alistair Kressel, Pierre Olivier"
tags = ["unikernel", "research", "security"]
+++

{{< figure
    src="/assets/imgs/morello-unikraft-machine.jpg"
    title="Unikraft running bare metal on the Morello prototype board."
    position="center"
>}}

Despite being a prototype, ARM's implementation of the [CHERI ISA](https://www.cl.cam.ac.uk/research/security/ctsrd/cheri/), [Morello](https://www.arm.com/architecture/cpu/morello), is rapidly gaining traction in the research community due to the high potential for isolation and additional security it brings without sacrificing performance.
I have recently ported a proof-of-concept version of Unikraft to run bare metal on the Morello machine, and I am in the process of exploring the cool security properties that combining CHERI with a modern unikernel such as Unikraft can bring.

### But What **Is** Morello? And What's So Great About It Anyway?

[Morello](https://www.arm.com/architecture/cpu/morello) is ARM's implementation of CHERI.
[Capability Hardware Enhanced RISC Instructions (CHERI)](https://www.cl.cam.ac.uk/research/security/ctsrd/cheri/) extends traditional ISAs (_Instruction Set Architectures_) such as ARMv8 and RISC-V to enable fine-grained memory protection at the granularity of a byte, which enables memory safe version of languages like C and C++, as well as efficient compartmentalisation of both code and data.
This is achieved by introducing capabilities, which can be thought of as pointers, except that they also contain bounds information and permissions.
Such hardware-enforced capabilities can be used to help reduce the amount of memory-related security issues present in software by ensuring that execution and data accesses are checked against bounds and permissions, thus ensuring better memory safety.
This protection can be applied at the level of an application, placing an application or subsets of it in a compartment, all the way down to encompassing individual buffers and data structures.

Morello implements CHERI capabilities by extending existing registers and pointers (via capabilities)  to 128 bits, with key registers such as the PC and SP, for example, now having capability-counterparts, called PCC (_Program Counter Capability_) and CSP (_Stack Pointer Capability_).
The existing ARM instruction set has been modified to allow the use of these capability registers in place of 64-bit registers in operations such as capability-aware  loads and stores, in effect enforcing the bounds embedded in dereferenced capabilities.
Morello also introduces a _Default Data Capability_ (DDC) which can be used to specify bounds on every data access, which will be enforced against regular A64 load/store instructions which are capability unaware, enabling compartmentalisation of existing software.

### How Do We Run Software on Morello?

Since Morello is an extension to a regular ARMv8 CPU - in the case of the Morello machine, the SoC is based on an existing Neoverse design - there are 3 ways in which software can be run:

1. In vanilla A64 mode with the Morello extension disabled: here software behaves as it would on any other ARMv8 chip.
1. In "hybrid mode", which is A64 mode with the Morello extension enabled and capabilities used to protect a subset of the application's pointers (manually identified by the programmer).
   This makes it easier to run legacy software on the Morello platform while also being able to use capabilities to enforce bounds on sensitive areas.
1. In "pure capability" mode, where all pointers in the application are protected with capabilities and regular A64 execution is disabled.

I have ported Unikraft to Morello with the ability to run in hybrid mode.
Running in hybrid mode has the advantage that existing libraries can be more easily adapted to work with capabilities as needed while still retaining regular A64 functionality.

{{< figure
    src="/assets/imgs/morello-unikraft-fvp.png"
    title="Terminal windows showing Unikraft running bare metal on the Morello emulator! Top left: the command and resulting console output of the Morello board emulator (FVP). Top right: Emulated board details. Bottom left and middle: Serial output of the board initialization firmware. Bottom right: Application processor serial output."
    position="center"
>}}

### Porting Unikraft to Morello

Now that we've established that Morello is really cool :), let's take a look at what it takes to get a basic Unikraft system running on Morello hardware.
The Morello platform leverages the [work done for running Unikraft on the Raspberry Pi](https://github.com/unikraft/plat-raspi/tree/spagani-devel) as a starting point.
Other than different memory mappings needed to ensure proper operation (see [the programmer's model](https://developer.arm.com/documentation/102278/latest)), [my port](https://github.com/jkressel/uk-plat-morello) includes the following items:

**Capability Access:**

At the start of the boot process, code runs at Exception Level 3.
At this point a number of values must be set to enable access to Morello features.
These are controlled by the following bits:

```none
cptr_el3.EC (bit 9)
```

Bit EC controls whether access to Morello features from any exception level will cause the instruction to be trapped at EL3.
Setting this bit to `0b1` will ensure that Morello features are not trapped.

```none
cptr_el2.CEN (bits 18 and 19) and cptr_el2.TC (bit 9)
```

Bit patterns `0b11` and `0b0` are set to disable the trapping to EL2 of Morello instructions or instructions which access Morello system registers.

```none
cpacr_el1, CEN (bits 18 and 19)
```

Bit pattern `0b11` is set to disable the trapping of access to Morello instructions or instructions which access Morello system registers at EL0 or EL1.

**Exception Vectors:**

With Morello now enabled, the ARM VBAR registers are now 128-bit CVBAR registers for each exception level.
Therefore, to set the vector base address, we first derive a capability and then set CVBAR as normal to point to the exception vectors.

**Dropping to EL1:**

After setup at EL3 is complete, we perform an exception return to EL1.
With Morello enabled, the exception link register requires a capability to return to.
We, therefore, derive one and set CELR_EL3 to contain this capability.

**UART setup:**

The Morello machine uses a 50MHz reference clock for UART, therefore, the following calculations for BRD values are required for a baud rate of 115200:

```none
Calculation:
 UART_CLK = 50MHz
 Baud rate divisor = (50 x (10^6)) / (16 * 115200) = 27.12673611

 Therefore, IBRD is 27, for the fractional part, we do the
 following:
 ((0.12673611 * 64) + 0.5) = 9 (as integer)
 So FBRD is 9
```

{{< figure
    src="/assets/imgs/morello-unikraft-build-option.png"
    title="The new Morello option which can be enabled in the Unikraft platform configuration menu"
    position="center"
>}}

## What's Next?

This basic proof of concept unlocks several exciting research avenues.
As a first step we are porting our security-oriented library operating system, [FlexOS](https://project-flexos.github.io/) (also built atop Unikraft), to leverage CHERI capabilities on Morello as an efficient isolation mechanism.
We further plan to explore advanced use of capabilities in FlexOS and Unikraft by studying the possibility of protecting critical kernel data structures (e.g. page tables) with capabilities in hybrid mode.
We also plan  to investigate the incremental porting of Unikraft/FlexOS to pure capability to maximise the level of protection, hopefully without compromising on the high degree of performance brought by the unikernel OS model.

If you would like to know more, feel free to check out [the project's website](https://olivierpierre.github.io/project-flexcap/).
You can also get in touch by [email](https://sites.google.com/view/pierreolivier/contact-location).
