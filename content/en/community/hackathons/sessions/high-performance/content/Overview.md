Welcome to the last session of the Unikraft Summer of Code!
In this session, we will introduce to you how to develop highly specialized and performance-optimized unikernels with Unikraft.
So far, we have focused on applications and POSIX compatibility;
where it is important to provide the same set of APIs and system calls that your application uses on its original environment (i.e., as a Linux user space application).
We achieve this by stacking multiple micro-libraries which then assemble together to form a combination of various necessary "higher-level" APIs .

In the context of network-based applications, we would typically develop network functionality based on [`sockets`](https://linux.die.net/man/7/socket).
This requires the following library stack being available within Unikraft for the `socket` (and friends) API to interface with the virtual Network Interface Card (vNIC):

```
 .-------------------------.
(     Socket application    )
 '-------------------------'
              |
              V
+---------------------------+
|         libvfscore        |
+---------------------------+
+---------------------------+
|          liblwip          |
+---------------------------+
+---------------------------+
|        libuknetdev        |
+---------------------------+
+---------------------------+
|        libkvmplat         |
+---------------------------+
              |
              V
 .-------------------------.
( Virtual Network Interface )
 '-------------------------'
```

Especially the Virtual File System (VFS) layer (provided by [`libvfscore`](https://github.com/unikraft/unikraft/tree/staging/lib/vfscore)) and the TCP/IP network stack (provided by [`liblwip`](github.com/unikraft/lib-lwip/)) are complex subsystems which are potentially introduce additional overheard.

For high-performance Network Functions (NFs), it is often more efficient to bypass any OS component and interact with the driver or hardware as directly; cutting out any indirection.
A known framework in the NFV arena is [Intel DPDK](https://www.dpdk.org/) which operates network card drivers in Linux user space.
It operates in user space in order to avoid interactions with the kernel which comes with performance penalties resulting from additional permission checks.
Despite this advantage in performance, you still need to maintain and operate a complete Linux environment in production deployments.
In the case with Unikraft, we can configure the libraries to be minimal and can, similar to Intel DPDK, directly develop our NF on top of network drivers.

In this scenario, our library stack does look like the following:

```
 .-------------------------.
(    High performance NF    )
 '-------------------------'
              |
              V
+---------------------------+
|        libuknetdev        |
+---------------------------+
+---------------------------+
|        libkvmplat         |
+---------------------------+
              |
              V
 .-------------------------.
( Virtual Network Interface )
 '-------------------------'
```

In the following tutorial, you will develop a simple, high performance network packet generator.
This tutorial will guide you through various options and possibilities which can help you during the development of more complex NFs with Unikraft.
