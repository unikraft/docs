To configure Unikraft for the ARM architecture, go to the configuration menu, like before, and select, from `Architecture Selection`, `Armv8 compatible`.
Save and exit the configuration.
As a new architecture is selected, you have to clean the previously compiled files:

```console
$ make clean
```

After cleaning, build the image:

```console
$ make
```

To run Unikraft, use the following command:

```console
$ sudo qemu-system-aarch64 -machine virt -cpu cortex-a57 -kernel ./build/app-helloworld_kvm-arm64 -nographic
```

Note that now we need to provide a machine and a CPU model to be emulated, as there are no defaults available.
If you want to find information about other machines, run

```console
$ sudo qemu-system-aarch64 -machine help
```
