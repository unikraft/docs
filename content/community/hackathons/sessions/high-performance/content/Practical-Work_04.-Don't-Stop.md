Now let us send as much as we can with the current implementation.
You can simply loop forever over packet generation and sending.
You may notice that we get too many messages on the console that slow us down.
Try disabling debug messages and all kernel messages except the critical ones.

**Note**: You should be able to terminate your unikernel with `CTRL`+`C` when you launched it with `kraft` or `qemu-guest`.
