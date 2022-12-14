---
title: Xen
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 513
---

## Running Unikraft on Xen

Xen is an open-source hypervisor of type 1 that have two types of virtualizations available.
Unikraft supports this platform and has some ported applications to run on Xen.
All applications will run in a separate domain and can be controlled by the `xl` tool.

## Build and run Unikraft on Xen using kraft

In order to configure a Unikraft image to target the Xen platform, we simply select one of the Xen images at the configuration step, according to the target architecture (ARM64 or x86_64):

```console
$ kraft configure
```
```
[?] Which target would you like to configure?: helloworld_xen-x86_64
   helloworld_linuxu-x86_64
   helloworld_kvm-x86_64
 > helloworld_xen-x86_64
   helloworld_linuxu-arm64
   helloworld_kvm-arm64
   helloworld_linuxu-arm
```

After this step, `kraft build` and `kraft run` should work the same.

By default, what `kraft run` does behind the scenes is to check if the host machine architecture is the same as the target one.
If they are the same, hardware acceleration is used.
If not, it is automatically disabled.


## Build and run Unikraft on Xen using make and xl

You can also build and run Unikraft on Xen by using the `Makefile` method (basically, reproducing the internals of `kraft`).
This could be useful in the development stage.

In this section, we suppose you already have an application directory with a `Makefile` and `Makefile.uk`, as described in the [Advanced section](/docs/usage/advanced/).

For the **configuration** step, run `make menuconfig`, go to  *Architecture selection -> Architecture* and select one of the 3 alternatives.
Then, go to *Platform Configuration* and select *Xen guest*.

After creating the configuration, exit the configuration menu and **build** the image using `make`.

In order to run, you need to create a configuration file `helloworld.cfg`, that should look something like:

```console
name          = "helloworld"
vcpus         = "1"
memory        = "4"
kernel        = "./build/helloworld_xen-x86_64"
```

After this you can run the application using `xl`:
```console
xl create -c helloworld.cfg
```

Of course, more configurations can be made, for more details about these options you can see what are all the possible parameters in a [domain configuration file documentation](https://xenbits.xen.org/docs/unstable/man/xl.cfg.5.html).

## Using `xen-guest` to run Unikraft on Xen

[xen-guest](https://github.com/unikraft/kraft/blob/staging/scripts/xen-guest) is a useful script used by kraft to run its Xen images.
What `xen-guest` does it taking a simple list of arguments from the user and gemerate a more complex `xl` command.
Here is the `xen-guest` command for running `app-helloworld` on x86_64:

```console
$ xen-guest -k build/app-helloworld_xen-x86_64
```

If we add the `-D` option, we can see the generated `xl` command and the configuration file.

`xen-guest` offers all kind of options, just like `xl` does.
You can run `xen-guest -help` to find the option you need for a specific use case.
