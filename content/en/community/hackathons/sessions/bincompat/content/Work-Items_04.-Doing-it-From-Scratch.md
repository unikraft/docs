Inside the `app-elfloder` folder, remove previous build and configuration files:

```console
$ make distclean
```

Now configure it from scratch by running:

```console
$ make menuconfig
```

Select the proper `ukdebug` configuration.

Select `9PFS` as the default filesystem and mount it at boot time.

Now you can build it:

```console
$ make
```

Test it using the `run_elfloader` script in the the `run-app-elfloader` repository.
