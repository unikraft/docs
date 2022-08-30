We want to configure the `helloworld` app to receive command line arguments and then print them.

For this, the `helloworld` application already has a configuration option.
Configure the application by running

```
$ make menuconfig
```

In the configuration menu, go to `Application Options` and enable `Print arguments`.
If we build and run the image now, using `qemu-guest`, we will see that two arguments are passed to Unikraft: the kernel argument, and a console.
We want to pass it an additional argument, `"foo=bar"`.

Before this, make sure to reset your configuration, so Unikraft won't use 9pfs for this task:

```
$ make clean
```

#### Raw qemu-system command

To send an argument with qemu-system, we use the `-append` option, like this:

```
$ qemu-system-x86_64 -kernel build/app-helloworld_kvm-x86_64 -append "console=ttyS0 foo=bar" -serial stdio
```

#### qemu-guest script

To send an argument with the qemu-guest script, we use the `-a` option, like this:
```
$ ./qemu-guest -k build/app-helloworld_kvm-x86_64 -a "foo=bar"
```

#### Kraft

To send an argument while using kraft, run it like this:

```
$ kraft run "foo=bar"
```
