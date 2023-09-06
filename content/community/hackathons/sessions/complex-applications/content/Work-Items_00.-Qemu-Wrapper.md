As we saw during the other sessions, [qemu-guest](https://github.com/unikraft/kraft/blob/staging/scripts/qemu-guest) is a wrapper script over the `qemu-system-x86_64` executable, to make the use of binary less painful.
In the following session, it will be very handy to use it.
To see the options for this wrapper you can use `qemu-guest -h`.

It is possible to run a lot of complex applications on Unikraft.
In this session we analyze 3 of them:

* SQLite
* Redis
* Nginx
