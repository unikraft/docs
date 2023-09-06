As we saw when we ran the dynamically linked `helloworld` application, the pre-built `app-elfloader` image had a lot of unwanted debugging messages enabled.
That is because the `./run_app.sh` will use by default the `app-elfloader_qemu-x86_64` `elfloader` image, will has `strace` output enabled.
There are multiple available `elfloader` images in the `run-app-elfloader` repository:

```console
ls -l app-elfloader_qemu-x86_64*
```

```text
-rwxr-xr-x 1 stefan stefan  1179088 iul  9 16:52 app-elfloader_qemu-x86_64
-rwxrwxr-x 1 stefan stefan   905588 iul  8 12:56 app-elfloader_qemu-x86_64_full-debug
-rwxrwxr-x 1 stefan stefan 11557712 iul  8 12:56 app-elfloader_qemu-x86_64_full-debug.dbg
-rwxrwxr-x 1 stefan stefan   831860 iul  8 12:56 app-elfloader_qemu-x86_64.old
-rwxrwxr-x 1 stefan stefan   827764 iul  8 12:56 app-elfloader_qemu-x86_64_plain
```

We can specify the one we want to use, by modifying the [`defaults` file](https://github.com/unikraft/run-app-elfloader/blob/master/defaults):

```sh
#!/bin/sh

rootfs_9p="$PWD/rootfs/"
kvm_image="$PWD/app-elfloader_qemu-x86_64"
bridge_iface="virbr0"
bridge_ip="172.44.0.1"
vm_ip="172.44.0.2"
netmask="255.255.255.0"
netmask_prefix="24"
net_args="netdev.ipv4_addr=$vm_ip netdev.ipv4_gw_addr=$bridge_ip netdev.ipv4_subnet_mask=$netmask"
net_up_script="$PWD/setup/up"
net_down_script="$PWD/setup/down"
```

We can change the `kvm_image` to `$PWD/app-elfloader_qemu-x86_64_plain`, which should get rid of the extra debugging messages:

```console
./run_app.sh helloworld
```

```text
SeaBIOS (version rel-1.16.2-0-gea1b7a073390-prebuilt.qemu.org)
Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Atlas 0.13.1~d20aa7cb
Hello, World!
```

Toy around with the different `app-elfloader` images from the `run-app-elfloader` repository, notice the differences and run applications with all of them.
