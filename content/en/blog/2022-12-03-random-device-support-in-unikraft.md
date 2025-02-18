+++
title = "Random Device Support in Unikraft"
date = "2022-12-03T09:00:00+01:00"
author = "Sebastian Samoilescu, Andrei Mutu"
tags = ["blog"]
+++

### Unikraft & Security

Unikernels could be a double-edged sword when it comes to security.
Unikraft managed to implement security mechanisms such as Control Flow integrity, Address Sanitizing and Stack Canary, increasing the degree of security within the unikernel.
However, the project still somewhat suffers in other security areas such as ASLR or Page Protection.
In this post we aim to discuss about the necessary primitives to improve and develop the unikernel security system were delivered.

### Randomness & Entropy

Randomness represents the apparent or actual lack of a pattern.
In theory, that denotes that a random series of events can not predict the following events by any meaning.
Entropy is a scientific concept that measures the degree of uncertainty and disorder in a variable or a system.
A computer is a deterministic machine.
Thus, the result will be the same whenever a program runs on top of it.
That means that a computer cannot produce pure random numbers through software.

### Random Number Generators

Even so, a way to produce randomness is thought pure-random number generators algorithms or PRNG.
The primary advantage of PRNG is their efficiency, meaning that they can generate a large amount of information in a short time.
The efficiency property makes PRNG good enough to rely on them in most cases.
However, applications that require unpredictable information cannot use these algorithms as a base source.

Besides PRNG, some algorithms extract entropy from asynchronous physical events.
These algorithms are True Random Number Generators or TRNG.
They analyze physical phenomena like mouse movement, the time between keystrokes, disk operations, or network communication.
Additional to these sources, Intel has released a CPU feature that provides support for generating pure random numbers.
`RDRAND` is the instruction for returning this information from Intel's chip.

The random number generation component is one of the leading security modules in an operating system.
Randomization is critical in many areas, such as Address Space Layout Randomization, secret key generation, password salting, and TCP sequence numbers.
As the previous paragraph pointed out, the random number generation component is necessary for the operating system's proper functioning and offering API to higher security layers.

### Goals

Before this project, Unikraft provided support just for generating pseudo-random numbers, and there were no devices to provide this information (e.g. urandom and random).
Therefore, there were some limitations regarding the security of the unikernel or running cryptography applications in Unikraft.
For this reason, the target of this project was to provide an enhanced random number generator component.

#### Improving The Current State

The first goal of the project was to improve what already exists.
For example, the `ukswrand` (the software random number generator) library contains various algorithms that generate random information based on a seed, which is critical to the security of this library.
The project increased the entropy of the seed gathering information using the processor random number generator and unpredictable events within the unikernel.

The first step to increase the security and functionality of Unikraft was to use the module delivered by the biggest processor makers.
Hence, the Unikraft RNG can produce high-entropy random numbers by calling CPU instructions such as read-seed or read-random.

#### The Entropy Service Provider

The next major outcome that this project managed to deliver was an entropy service provider based on the Linux RNG.
This service is responsible for gathering noise from random events, storing this information in a secure environment, and finally delivering the random numbers at a higher rate and in a secure manner.
At this moment, the RNG tracks just the network and IRQ events in order to gather random noise.

#### Linux-like Devices

And last but not least, the new random number generator provides two devices, `/dev/urandom` and `/dev/random` which are backed up by pure random number generators and a combination of true and pure random number generators in the case of the random device.

NOTE: Currently, the new random number generator provides functionality just for x86 architecture.

### Configuring The RNG

Unikraft allows the user to configure the random number generator source through the menu-config interface within unikernel image compiling.
Here, the user can select which hardware events to be used as an entropy source or what source to be used as the seed for software algorithms.
Also, this menu offers the possibility to mount the random char devices, urandom and random.

### Results

During the testing, I focused my attention on metrics such as the latency and the distribution of the generated random numbers.

Unsurprisingly, the hardware-based module is slower than the software one.
More precisely, the software module is about 3x faster for generating under 10.000 bytes, but when it comes to large throughput, the difference is even higher, about ten times.

Besides the speed performance, it is also crucial that generation probabilities among the numbers be similar for a better level of entropy.
From my experiments, the distribution for hardware generated numbers is closer to the ideal one.

### Future Of Randomness In Unikraft

The most important thing to have in sight is to adapt the current random number generator to the ARM architecture, covering more Unikraft applications.
Nevertheless, increasing the security of the RNG library has equal importance.
One of the ways to accomplish this goal is to find more hardware randomness sources to boost the speed of collecting the entropy.
Still, there are other talks in this direction, including reseeding the PRNGs or introducing an entropy file.

### Notes

If this article caught your eye, some more technical details about the `x86` implementation can be found [here](https://github.com/unikraft/unikraft/pull/420).
In case `arm64` is of greater interest to you then we got you covered with an implementation for arm64 which can be seen [here](https://github.com/unikraft/unikraft/pull/434).
