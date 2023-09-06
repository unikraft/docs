Let's see what happens behind the scenes.
Enter the `run-app-elfloader/` directory:

```console
.../scripts/make-based/app-elfloader$ cd ../../workdir/apps/run-app-elfloader/

.../workdir/apps/run-app-elfloader$ ls
app-elfloader_kvm-x86_64*             app-elfloader_kvm-x86_64_full-debug.dbg*  debug.sh*  out/       rootfs/      run.sh*
app-elfloader_kvm-x86_64_full-debug*  app-elfloader_kvm-x86_64_plain*           defaults   README.md  run_app.sh*  utils/
```

Follow the instructions in [the `README.md` file](https://github.com/unikraft/run-app-elfloader/blob/master/README.md) to run as many applications as possible directly.
That means through the use of the `run_app.sh` and `run.sh` scripts.

To use the `./run_app.sh` script, you just pass it the name of the already existing application you want to use.
You can get a list of all applications by running the script with no arguments.

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

$ ./run_app.sh helloworld_cpp
Running command:
        qemu-system-x86_64
        -m 2G
        -nographic
        -nodefaults
        -display none
        -serial stdio
        -device isa-debug-exit
        -fsdev local,security_model=passthrough,id=hvirtio0,path=../dynamic-apps/lang/c++/
        -device virtio-9p-pci,fsdev=hvirtio0,mount_tag=fs0
        -kernel /home/stefan/projects/unikraft/scripts/workdir/apps/run-app-elfloader/app-elfloader_qemu-x86_64
        -enable-kvm
        -cpu host
        -append " /helloworld"
SeaBIOS (version 1.13.0-1ubuntu1.1)
Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Atlas 0.13.1~d20aa7cb
brk(NULL) = va:0x400200000
uname(<out>utsname:{sysname="Unikraft", nodename="unikraft", ...}) = OK
access("/etc/ld.so.nohwcap", F_OK) = No such file or directory (-2)
access("/etc/ld.so.preload", R_OK) = No such file or directory (-2)

[...]

ioctl(0x1, 0x5401, ...) = 0x0
Hello World!
write(fd:1, "Hello World!\x0A", 13) = 13
```

You can also use the `./run.sh` script if you want to have more control over what you are running.
Similar to the `./run_app.sh` script, you can run it with no arguments in order to get the available options:

```console
$ ./run.sh
Start QEMU/KVM for ELF Loader app

./run.sh [-h] [-g] [-n] [-i] [-r path/to/9p/rootfs] [-k path/to/unikernel/image] path/to/exec/to/load [args]
    -h - show this help message
    -g - start in debug mode
    -n - add networking support
    -i - use initial ramdisk for loading executable
    -d - disable KVM
    -r - set path to 9pfs root filesystem
    -k - set path unikraft image
```

We can see that we have options to add a specific root filesystem to the `app-elfloader`, as well as what `app-elfloader` image we want to use and what precompiled application we want to run.
We will run `helloworld_cpp` using the `run.sh` script.
For this, we will need to pass the `helloworld_cpp` filesystem (which we can find in the [`dynamic-apps` repository](https://github.com/unikraft/dynamic-apps/tree/master/lang/c%2B%2B)) to the `elfloader` application.
We will do that by using the `-r ../dynamic-apps/lang/c++/` option.
We will then need to pass the path to the executable we want to run, relative to the root filesystem from earlier (`/helloworld` in our case).
We and up with the following command:

```console
$ ./run.sh -r ../dynamic-apps/lang/c++/ /helloworld

[...]

ioctl(0x1, 0x5401, ...) = 0x0
Hello World!
write(fd:1, "Hello World!\x0A", 13) = 13
```

We can see that the effect is identical to what the `./run_app.sh helloworld_cpp` script did.
We can also choose the `app-elfloader` image we want to run, so we can get rid of the extra debugging information by using the `app-elfloader_qemu-x86_64_plain` image (or an `elfloader` image we've built ourselves):

```console
$ ./run.sh -r ../dynamic-apps/lang/c++/ -k ./app-elfloader_qemu-x86_64_plain /helloworld
SeaBIOS (version 1.13.0-1ubuntu1.1)
Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Atlas 0.13.1~d20aa7cb
Hello World!
```
