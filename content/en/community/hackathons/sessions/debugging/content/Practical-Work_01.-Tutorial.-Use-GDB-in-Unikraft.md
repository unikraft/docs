For this tutorial, we will just start the `app-helloworld` application and inspect it with the help of GDB.

First make sure you have the following file structure in your working directory:

```
workdir
|_______apps
|	|_______helloworld
|_______libs
|_______unikraft
```

#### Linuxu

For the image for the **linuxu** platform we can use GDB directly with the binary already created.

```
$ gdb build/app-helloworld_linuxu-x86_64.dbg
```

#### KVM

To avoid using a command with a lot of parameters that you noticed above in the **KVM** section, we can use `qemu-guest`.


```
$ qemu-guest -P -g 1234 -k build/app-helloworld_kvm-x86_64.dbg
```

Open another terminal to connect to GDB by using the debug image with:

```
$ gdb --eval-command="target remote :1234" build/app-helloworld_kvm-x86_64.dbg
```

First you can set the right CPU architecture and then reconnect:

```
disconnect
set arch i386:x86-64:intel
tar remote localhost:1234
```

Then you can put a hardware break point at main function and run `continue`:
```
hbreak main
continue
```

All steps described above can be done using the script `kvm_gdb_debug` located in the `work/01-tutorial-gdb/` folder.
All you need to do is to provide the path to kernel image.

```
kvm_gdb_debug build/app-helloworld_kvm-x86_64.dbg
```
