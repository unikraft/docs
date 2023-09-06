To set up, build and run Linux ELFs with [`app-elfloader`](https://github.com/unikraft/app-elfloader), we recommend you use [the `run-app-elfloader` repository](https://github.com/unikraft/run-app-elfloader).
Along with the [`run-app-elfloader`](https://github.com/unikraft/run-app-elfloader) repository, we collected pre-built applications that you can use in binary compatibility mode.
Those are located in the [`static-pie-apps`](https://github.com/unikraft/static-pie-apps/) and [`dynamic-apps`](https://github.com/unikraft/dynamic-apps/) repositories.
These are pre-built applications, so no time must be spent on compiling them.
They need to be cloned and then used.

The following repositories need to be cloned:

```console
git clone https://github.com/unikraft/run-app-elfloader
git clone https://github.com/unikraft/static-pie-apps
git clone https://github.com/unikraft/dynamic-apps
```

In order to quickly run a `helloworld` application in binray compatibility mode, you can use the `run_app.sh` script:

```console
cd run-app-elfloader/
./run_app.sh helloworld
```

You will see the following output:

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
[...]
brk(NULL) = va:0x400200000
brk(va:0x400221000) = va:0x400221000
Hello, World!
write(fd:1, "Hello, World!\x0A", 14) = 14
qemu-system-x86_64: terminating on signal 2
```

**Note: If the command above fails with some error similar to `Assertion failure: ukarch_paddr_range_isvalid`, you will need to change the `cpu_model` line in the [`defaults` file](https://github.com/unikraft/run-app-elfloader/blob/master/defaults) to `Skylake-Server`.
We will through what that does in a bit, for now, if you get an error, just change [this line](https://github.com/unikraft/run-app-elfloader/blob/master/defaults#L13) to `cpu_model="Skylake-Server"`.

This will run a dynamically linked `helloworld` application.
You will see a lot of output because, by default, the `run_app.sh` script uses a prebuilt version of `app-elfloader`, which has `strace`-like output enabled, for debugging purposes.

You can see a list of all existing available application that you can run in binary compatibility mode by running `./run_app.sh` with no arguments.
**Note: If you are running an application that requires networking support, you will need to run it with `sudo`.**

```console
$ ./run_app.sh 
Usage: ./run_app.sh [-l] <app>
Possible apps:
bc bc_static bzip2 client client_go client_go_static client_static echo gzip 
gzip_static haproxy helloworld helloworld_cpp helloworld_cpp_static 
helloworld_go helloworld_go_static helloworld_rust helloworld_rust_static_gnu 
helloworld_rust_static_musl helloworld_static ls nginx nginx_static openssl 
python redis redis7 redis_static server server_go server_go_static 
server_static sqlite3 sqlite3_static 

    -l - use dynamic loader explicitly
```
