+++
title = "Leveraging Intel SGX in Unikraft: Challenges and Recent progress"
date = "2022-07-20T00:20:00+08:00"
author = "Xiangyi Meng"
tags = ["Security", "Intel SGX"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2022-badge.svg" align="right" />

The previous [post](https://unikraft.org/blog/2022-07-05-unikraft-gsoc-intel-sgx/) briefly describes the concepts behind TEE, Intel SGX, and the ongoing work that implements Intel SGX support in Unikraft. 
In this post, we will take an in-depth investigation of how SGX supported is implemented in Linux, and what we need to implement in Unikraft to achieve the same object.

## The Linux way to support Intel SGX

Linux is the most widely used operating system in the world. 
And also, it has the most full-fledged SGX features. 
Briefly speaking, three parts are involved in the SGX support of Linux:

- linux-sgx-driver: 
SGX driver executed under ring-0, which is responsible for issuing the ring-0 SGX instructions, shown as follows. 
```c
enum sgx_commands {
         ECREATE = 0x0,
         EADD    = 0x1,
         EINIT   = 0x2,
         EREMOVE = 0x3,
         EDGBRD  = 0x4,
         EDGBWR  = 0x5,
         EEXTEND = 0x6,
         ELDU    = 0x8,
         EBLOCK  = 0x9,
         EPA     = 0xA,
         EWB     = 0xB,
         ETRACK  = 0xC,
         EAUG    = 0xD,
         EMODPR  = 0xE,
         EMODT   = 0xF,
}
 ```
The driver had been an individual kernel module, and it has been merged into the mainline kernel since Linux 5.11.

- SGX Platform Software (PSW): 
SGX Platform Software is a set of software tools that are used to manage the SGX enclave. 
It supplies the daemon service named `aesmd` (aka Architectural Enclave Service Manager) to handle lots of jobs, such as the launch of an enclave, key provisioning, and remote attestation.

- SGX SDK:
This SDK provides the ability for the user to develop, build, sign and debug SGX enclaves.

- Userspace SGX applications:
A common userspace SGX application includes two parts: the trusted part and the untrusted part. 
The trusted part is executed in the enclave, and the untrusted part behaves like a normal Linux program.

## What should be implemented in Unikraft to support Intel SGX
At first glance, it seems easy to achieve that: porting driver, PSW, and SDK to Unikraft as they are all open-sourced.
However, Unikraft is a highly specialized unikernel implementation, which misses lots of Linux-specific features.
Such a problem extremely enlarges the effort of porting them to Unikraft, as we need to adapt the code to Unikraft's architecture.
Below are three examples of such challenges:

1. Due to the missing of process feature, the `aesmd` daemon implementation is required to be refactored using threading or in synchronous mode.

2. Another example is the way of hooking MMU with enclave pages. 
In Linux, the SGX driver implements this feature by using the `mmap()` feature and an `sgx_encl_find()` function. 
But in Unikraft, `mmap()` is not available. Hence, extra works need be done to achieve the same functionality.

3. When allocating the memory to an enclave, the linux-sgx-driver uses lots of shared memory primitives to operate with the /dev/sgx file, which is also not available in Unikraft. 
As there isn't a concept of process in Unikraft, in my opinion, this part would be okay to be removed. 
But we need to allocate the same area for the same functionality in the implementation of Unikraft driver.

Besides the above challenges, I believe that there are much more challenges to be addressed in the future.
I will keep them updated in detail in the following blog posts.

The technical detail of SGX is quite complicated, so for readers who are interested in it, I recommend you to read the paper [Intel SGX Explained
](https://eprint.iacr.org/2016/086.pdf)

## Current Progress
I am working on porting the driver. 
Besides what I have mentioned in the first post, the following things have already been here:
- The option that enables SGX in the make menuconfig.
- The parameters that enable qemu with SGX supports in the `qemu-guest` script
- The linux-way `ioctl` handler of the driver is finished and it's okay to be compiled, with some unimplemented stubbed functions. 
- An experimental ring-3 support is implemented for the user-mode SGX instructions to be executed.
- The C wrappers for the SGX assembly instructions listed [here](#the-linux-way-to-support-intel-sgx).
It seems huge progress, but the remaining works are still massive and challenging.

## Future Work
Now, I am making efforts to implement the first important function: `sgx_encl_create()`. 
Just as its name suggests, it is used to create an enclave. 
It will initialize lots of important data structures and invoke the `ECREATE` instruction to create an enclave in the EPC area.
After finishing this function, I will update the drafted [PR](https://github.com/unikraft/unikraft/pull/474) to involve what I have done yet.