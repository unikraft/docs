Build the `app-elfloader` from an existing configuration.

Copy the `.config` file from `work/03/config` to the `app-elfloader` folder.
Now you can build it:

```console
$ make
```

In the `build/` folder you should have the `app-elfloader_kvm-x86_64` binary.

To run it, go to the `run-app-elfloader` folder and run the `run_elfloader` script by passing it the `-k` option with the correct path to the built binary.
