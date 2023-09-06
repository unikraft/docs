Running Unikraft depends on the platform used.
The default platform is **kvm** (better called **qemu**).
We use the `qemu-system-...` command to run QEMU, e.g. `qemu-system-x86_64` for the `x86_64` architecture.
The command gets the Unikraft image as argument.
The [Unikraft core repository](https://github.com/unikraft/unikraft/) has a wrapper script called [`qemu-guest`](https://github.com/unikraft/unikraft/blob/staging/support/scripts/qemu-guest) that can be used to simplify the running of `qemu-system-x86_64`.
