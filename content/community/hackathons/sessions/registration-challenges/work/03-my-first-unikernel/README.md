# 03-my-first-unikernel

## Challenge Description

You are given a [unikernel image](https://unikraft.org/docs/concepts/).
Run it using [`qemu-system`](https://manpages.debian.org/jessie/qemu-system-x86/qemu-system-x86_64.1.en.html) and get the flag.

If everything goes well, the output of the image will look something like this:

```console
$ <your-run-command>
Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
      Epimetheus 0.12.0~be9ed790-custom
USoC{...}
```

**Note that you will need to disable the graphical output using `qemu-system`, find what you need in the manual.**
