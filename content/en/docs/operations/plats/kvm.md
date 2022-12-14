---
title: KVM
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 511
---

## Running Unikraft on KVM

KVM is a hypervisor.  This means that, when Unikraft is run on KVM, it acts as
an operating system, having the responsibility to configure the hardware
components it needs.  In contrast, `linuxu` involves Unikraft behaving as a Linux
userspace application.  When run on KVM, Unikraft has direct and total control
over hardware components, allowing advanced functionalities.


### QEMU

A common way to run Unikraft on KVM is to use [QEMU](https://www.qemu.org/).
QEMU which is a Virtual Machine Monitor (VMM) and simply manages the lifecycle
of the VM.  QEMU can be used on its own to run Unikraft, but this involves
emulating all the hardware resources in software, making everything slower.
However, QEMU has the option to enable hardware acceleration -- aka
(para)virtualization -- using the underlying software platform, that is, KVM.

{{< alert theme="info" >}}
**Note:** Emulation is slower, but it allows using CPU architectures different from the
local one (you can run ARM code on a x86 machine). Using (para)virtualisation,
aka hardware acceleration, greater speed is achieved and more hardware
components are visible to Unikraft.
{{< /alert >}}

### Build and run Unikraft on KVM using kraft

In order to configure a Unikraft image to target the KVM platform, we simply
select one of the KVM images at the configuration step, according to the target
architecture (ARM64 or x86_64):

```console
$ kraft configure
```
```
[?] Which target would you like to configure?: helloworld_kvm-x86_64
   helloworld_linuxu-x86_64
 > helloworld_kvm-x86_64
   helloworld_xen-x86_64
   helloworld_linuxu-arm64
   helloworld_kvm-arm64
   helloworld_linuxu-arm
```

After this step, `kraft build` and `kraft run` should work the same.

By default, what `kraft run` does behind the scenes is to check if the host
machine architecture is the same as the target one.  If they are the same,
hardware acceleration is used.  If not, it is automatically disabled.


## Build and run Unikraft on KVM using make and qemu ##

You can also build and run Unikraft on KVM by using the `Makefile` method
(basically, reproducing the internals of `kraft`).  This could be useful in the
development stage.

In this section, we suppose you already have an application directory with a
`Makefile` and `Makefile.uk`, as described in the [Advanced
section](/docs/usage/advanced/).

For the **configuration** step, run `make menuconfig`, go to  *Architecture
selection -> Architecture* and select one of the 3 alternatives.  Then, go to
*Platform Configuration* and select *KVM guest*.

{{< alert theme="warning" >}}
**Note:** Right now, KVM is the only platform option available for ARM64
{{< /alert >}}

After creating the configuration, exit the configuration menu and **build** the
image using `make`.

In order to run, you need to load the resulting image in QEMU by using:

```console
$ qemu-system-x86_64 \
    --nographic \
    -kernel ./build/app-helloworld_kvm-x86_64
```

Besides `--nographic`, no other option is needed to run the `helloworld`
application.

More complex applications will require more options given to QEMU.

We have run Unikraft in the emulation mode, with the command from above. We can
also run it in the virtualization mode, by adding the `-enable-kvm` option. You
may receive a warning, `host doesn't support requested feature:`. This is
because kvm uses a generic CPU model. You can instruct kvm to use your local CPU
model, by adding `-cpu host` to the command. The final command will look like
this:

```console
$ qemu-system-x86_64 \
    --nographic \
    -kernel ./build/app-helloworld_kvm-x86_64 \
    -enable-kvm \
    -cpu host
```

In order to run an ARM64 image on a x86 host, you will need to provide `qemu`
some additional arguments: the machine and cpu type. Here is a full command that
runs an ARM64 image:

```console
$ qemu-system-aarch64 \
    --nographic \
    -machine virt \
    -cpu cortex-a57 \
    -kernel build/app-helloworld_kvm-arm64
```

If you want to see available machine types, you can use:

```console
$ qemu-system-aarch64 -machine help
```

If you want to see available cpu types for a specific machine, run:

```console
$ qemu-system-aarch64 -machine <machine type> -cpu help
```

Please note that not every machine-cpu combination will work with Unikraft.
Also, if you run an ARM64 image on a x86 host, you won't be able to use the `-enable-kvm` option.


## Using `qemu-guest` to run Unikraft on KVM

[`qemu-guest`](https://github.com/unikraft/kraft/blob/staging/scripts/qemu-guest)
is a useful script used by kraft to run its QEMU/KVM images. You can find it in
the [kraft Git repo](https://github.com/unikraft/kraft), in `scripts/`. What
`qemu-guest` does is taking a simple list of arguments from the user and
generate a more complex `qemu-system` command. Here is the `qemu-guest` command
for running `app-helloworld` on x86_64:

```console
$ ./qemu-guest -k build/app-helloworld_kvm-x86_64
```

If we add the `-D` option, we can see the generated `qemu-system` command.

`qemu-guest` offers all kind of options, just like `qemu-system` does. For
instance, you can mount a file system using the `-e` option. You can run
`./qemu-guest -help` to find the option you need for a specific use case.

By default, `qemu-guest` enables hardware acceleration.  To disable it, we can
use `-W`. Here is the `qemu-guest` command for running the ARM64 version of
`app-helloworld` on a x86_64 host:

```console
$ ./qemu-guest -t arm64v -W -k build/app-helloworld_kvm-arm64
```
