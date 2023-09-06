We want to configure the `helloworld` app to receive command line arguments and then print them.

For this, the `helloworld` application already has a configuration option.
Configure the application by running

```console
$ make menuconfig
```

In the configuration menu, go to `Application Options` and enable `Print arguments`.

Before this, make sure to reset your configuration, so Unikraft won't use 9pfs for this task:

```console
$ make clean
```

#### Running the application

To send an argument with qemu-system, we use the `-append` option, like this:

```console
$ qemu-system-x86_64 -kernel build/app-helloworld_qemu-x86_64 -append "console=ttyS0 foo=bar" -nographic
```
