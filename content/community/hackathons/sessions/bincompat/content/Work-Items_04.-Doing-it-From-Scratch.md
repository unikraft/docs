Inside the `app-elfloder` folder, remove previous build and configuration files:

```console
$ make distclean
```

Now configure it from scratch by running:

```console
$ WITH_ZYDIS=y make menuconfig
```

In the configuration menu, do the following changes:

1. Select `KVM guest` from the `Platform Configuration` screen.
1. Under the `Platform Configuration -> Platform Interface Options` select `Virtual Memory API`.
1. Under the `Library Configuration` screen, unselect `ukmmap` and select `ukvmem` and `posix-mmap`.
1. Under the `Library Configuration -> ukvmem` screen, select all the `Use dedicated *` options.
1. If you want to use a filesystem with your application, under the `Library Configuration -> vfscore: Configuration`, select the `Automatically mount a root filesysytem` option and choose the default `root filesystem` to be `9PFS`.
1. Change the `Default root device` to `fs0` in the `vfscore: Configuration` screen above, to be able to use the `qemu-guest` script.
1. Select `lwip` under the `Library Configuration` screen if the applications that we will run require networking support.

Now you can build it:

```console
$ WITH_ZYDIS=y make
```

Test it using the `run_elfloader` script in the `run-app-elfloader` repository.
