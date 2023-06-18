Create your own application or get an existing application, build it and run it in binary compatibility mode.
You can use a simple existing application that you usually use as a bash command (e.g. `/usr/bin/ls`, `/usr/bin/tree`, `/usr/bin/zip`).
We recommend for now using only applications that have to do with a filesystem, **not** with users or processes.
We will get to those at the end of the session.

See the existing examples in [the `dynamic-apps` repository](https://github.com/unikraft/dynamic-apps) or [the `static-pie-apps` repository](https://github.com/unikraft/static-pie-apps).

In order to simplify the creation of the filesystem structure, we recommend you use the [`extract.sh` script in the `dynamic-apps` repository](https://github.com/unikraft/dynamic-apps/blob/master/extract.sh):

```console
./extract.sh
```

```text
Binary to extract not provided.

Usage: ./extract.sh <binary> [<extract_path>]

  Default extract path is current directory
```

The `extract.sh` script will take an `ELF` file as the argument, and create the necesarry directory that will be passed to the `run.sh` script.

```console
mkdir my-ls/
cd my-ls/
../extract.sh /usr/bin/ls
cp /usr/bin/ls .
tree .
```

```text
.
|-- lib
|   `-- x86_64-linux-gnu
|       |-- libc.so.6
|       |-- libdl.so.2
|       |-- libpcre2-8.so.0
|       |-- libpthread.so.0
|       `-- libselinux.so.1
|-- lib64
|   `-- ld-linux-x86-64.so.2
`-- ls

3 directories, 7 files
```

After all this is done, we can go back to the `run-app-elfloader` repository and use the `run.sh` script to run the application we just prepared:

```console
./run.sh -r ../dynamic-apps/ls/ /ls
```

Depending upon your `defaults` file, it will print the output of `ls`, along with debugging messages if it is the case:

```text
SeaBIOS (version rel-1.16.2-0-gea1b7a073390-prebuilt.qemu.org)
Booting from ROM..TEST nofollow
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Atlas 0.13.1~d20aa7cb
dev  lib  lib64  ls
```
