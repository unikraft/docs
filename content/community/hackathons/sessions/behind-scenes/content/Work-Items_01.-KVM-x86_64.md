We build the Unikraft `helloworld` image for the **kvm** platform, for the **x86_64** architecture.
We follow the steps below.

**Clean the Environment**

That means remove build files (the `build/` directory) and configuration files (the `.config` file).

```console
$ make distclean
```

While this may not always be required, it's the safest option to make sure that previous build / configuration artifacts are removed.
Previous build / configuration artifacts may give out configuration and build errors.

If you only wanted to remove the build files (and **not** the `.config` file), you would use:

```console
$ make properclean
```

In short, `make distclean` removes **everything**, `make properclean` keeps the `.config` file.

**Configure the Application**

To enter the configuration screen, run:

```console
$ make menuconfig
```

In the configuration screen, follow the steps:

1. From `Architecture Selection`, select `Architecture` -> `x86 compatible`.
1. From `Platform Configuration`, select `KVM guest`.
1. Save and exit.
1. You can now check that the `.config` file is created.

**Build the Application**

Build the application by running

```console
$ make prepare
$ make -j $(nproc)
```

**Run the Unikraft Application**

Run the resulting image with QEMU:

```console
$ sudo qemu-system-x86_64 -kernel ./build/app-helloworld_kvm-x86_64 -nographic
```

Besides `-nographic`, no other option is needed to run the `app-helloworld` application.
Other, more complex applications, will require more options given to the `qemu-system-x86_64` command.

We have run Unikraft in the emulation mode, with the command from above.
This is the compatible way of running Unikraft, that works on any Linux-based setup, including inside a virtual machine.

However, for actual performance, we want to run it in the virtualization mode, by adding the `-enable-kvm` option.
Note that this requires KVM support both in your Linux-based setup.

After adding the `-enable-kvm` option to the command above, you may receive a warning: `host doesn't support requested feature:`.
This is because KVM uses a generic CPU model.
You can instruct KVM to use your local CPU model, by adding `-cpu host` to the command.

The final command will look like this:

```console
$ sudo qemu-system-x86_64 -enable-kvm -cpu host -kernel ./build/app-helloworld_kvm-x86_64 -nographic
```

While we are here, we can check some differences between emulation and virtualization.
Record the time needed by each image to run, using `time`, like this:

```console
$ time sudo qemu-system-x86_64 -kernel ./build/app-helloworld_kvm-x86_64 -nographic
$ time sudo qemu-system-x86_64 -enable-kvm -cpu host -kernel ./build/app-helloworld_kvm-x86_64 -nographic
```

Because `helloworld` is a simple application, the **real** running time will be similar.
The differences are where each image runs most of its time: in user space, or in kernel space.
As a task for you, find an explanation for the differences.
