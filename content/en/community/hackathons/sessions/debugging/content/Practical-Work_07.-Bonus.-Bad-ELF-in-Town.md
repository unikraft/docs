We managed to build an ELF file that is valid when doing static analysis, but that can't be executed.
The file is `bad_elf`, located in the `work/07-bad-elf/` folder.

Running it triggers a segmentation fault message.
Running it using `strace` shows an error with `execve()`.

```bash
~/Doc/U/summer-of-code-2021/c/e/d/s/0/w/05-bad-elf > ./bad_elf
[1]    125458 segmentation fault  ./bad_elf
~/Doc/U/summer-of-code-2021/c/e/d/s/0/w/05-bad-elf > strace ./bad_elf
execve("./bad_elf", ["./bad_elf"], 0x7ffc9ca2e960 /* 66 vars */) = -1 EINVAL (Invalid argument)
+++ killed by SIGSEGV +++
[1]    125468 segmentation fault (core dumped)  strace ./bad_elf

```

The ELF file itself is valid.
You can check using `readelf`:

```bash
$ readelf -a ./bad_elf
```

The issue is to be detected in the kernel.
Use either [`perf`](https://www.brendangregg.com/perf.html) or, better yet, [`ftrace`](https://jvns.ca/blog/2017/03/19/getting-started-with-ftrace/), to inspect the kernel function calls done by the program.
Identify the function call that sends out the `SIGSEGV` signal.
Identify the cause of the issue.
Find that cause in the [manual page `elf(5)`](https://linux.die.net/man/5/elf).
