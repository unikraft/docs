We want to enable debugging for the `KVM` platform and the `x86_64` architecture.
We do this by enabling the `ukdebug` library in the configuration menu.
It is located in the `Library Configuration` menu.

We follow the steps.

**Clean the Environment**

```console
$ make distclean
```

**Configure the Application**

```console
$ make menuconfig
```

In the configuration screen, follow the steps:

1. From `Architecture Selection`, select `Architecture` -> `x86 compatible`.
1. From `Platform Configuration`, select `KVM guest`.
1. From `Library Configuration`, enter the `ukdebug` menu.
   1. Select the `Enable kernel messages (uk_printk)` entry.
   1. Change the option below it, `Kernel message level`, from `Show critical and error messages (default)` to `Show all types of messages`.
   1. To make things prettier, also enable the `Colored output` option.
1. Save and exit.

**Build the Application**

```console
$ make prepare
$ make -j $(nproc)
```

**Run the Unikraft Application**

```console
$ sudo qemu-system-x86_64 -kernel ./build/app-helloworld_kvm-x86_64 -nographic
```

We see what timer is used, the `i8254` one.
Also, we see that the PCI bus is used.
And other boot-related items.
