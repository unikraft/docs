If you want more control over the application, you can use the `run.sh` script.
In order for the `elfloader` application to be able to run a precompiled `ELF` file, it will need:

* All the application dependencies (i.e. external libraries, shared objects)
* The [system loader](https://www.man7.org/linux/man-pages/man8/ld.so.8.html)
* The actual `ELF` file that will be executed

The `dynamic-apps` repository already has those prepared, as you can see below.
You can see the dependencies of an application by running [`ldd`](https://www.man7.org/linux/man-pages/man1/ldd.1.html):

```console
cd path/to/dynamic-apps-repo
ldd lang/c++/helloworld
```

```text
    linux-vdso.so.1 (0x00007ffd60841000)
    libstdc++.so.6 => /lib/x86_64-linux-gnu/libstdc++.so.6 (0x00007fe9f27d3000)
    libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007fe9f25e1000)
    libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007fe9f2492000)
    /lib64/ld-linux-x86-64.so.2 (0x00007fe9f2c1e000)
    libgcc_s.so.1 => /lib/x86_64-linux-gnu/libgcc_s.so.1 (0x00007fe9f2477000)
```

You can ignore the `linux-vdso.so.1` for now.
You can see that all the dependencies needed to run `apphelloworld` are located in the root `c++/` directory:

```console
tree lang/c++/
```

```text
lang/c++/
|-- helloworld
|-- helloworld.cpp
|-- lib
|   `-- x86_64
|       |-- libc.so.6
|       |-- libgcc_s.so.1
|       `-- libm.so.6
|-- lib64
|   `-- ld-linux-x86-64.so.2
|-- Makefile
`-- usr
    `-- lib
        `-- x86_64-linux-gnu
            `-- libstdc++.so.6

6 directories, 8 files
```

In order to run the C++ `helloworld` application using the Unikraft `elfloader`, we will pass the `c++/` directory we saw above to the application as a filesystem.
We will also add the `/helloworld` argument, which will represent the path to the `ELF` file.
We can do this by running `qemu-system-x86_64`, like we did in the previous sessions.
We can also use the `run.sh` helper script from the `run-app-elfloader` repository:

```console
$ ./run.sh -r ../dynamic-apps/lang/c++/ /helloworld
[...]
ioctl(0x1, 0x5401, ...) = 0x0
Hello World!
write(fd:1, "Hello World!\x0A", 13) = 13
qemu-system-x86_64: terminating on signal 2
```

You can see the output similar to the `./run_app.sh` script, a lot of debugging messages along with the application output.
