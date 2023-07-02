For our final example, we will setup and run the Nginx web server as a Unikraft image.
`Nginx` can be considered a complex application, since, unlike `helloworld`, it relies on multiple external libraries in order to function properly (i.e. a full standard C library implementation and a networking stack).
The following repositories are required for our setup:

* The application repository: [`app-nginx`](https://github.com/unikraft/app-nginx)
* The Unikraft core repository: [`unikraft`](https://github.com/unikraft/unikraft)
* Library repositories:
  * The Nginx "library" repository: [`lib-nginx`](https://github.com/unikraft/lib-nginx)
  * The standard C library: [`lib-musl`](https://github.com/unikraft/lib-musl)
  * The networking stack library: [`lib-lwip`](https://github.com/unikraft/lib-lwip)

Follow the steps below for the setup (make sure that you are starting in the `workdir/` directory):

  1. First clone the [`app-nginx` repository](https://github.com/unikraft/app-nginx) in the `nginx/` directory:

     ```console
     $ git clone https://github.com/unikraft/app-nginx nginx
     ```

     Enter the `nginx/` directory:

     ```console
     $ cd nginx/

     $ ls -F
     config-qemu-aarch64  config-qemu-x86_64  fs0/  kraft.yaml  Makefile  Makefile.uk  README.md  run-qemu-aarch64.sh*  run-qemu-x86_64.sh*
     ```

  1. While inside the `nginx/` directory, create the `.unikraft/` directory:

     ```console
     $ mkdir .unikraft
     ```

     Enter the `.unikraft/` directory:

     ```console
     $ cd .unikraft/
     ```

  1. While inside the `.unikraft` directory, clone the [`unikraft` repository](https://github.com/unikraft/unikraft):

     ```console
     $ git clone https://github.com/unikraft/unikraft unikraft
     ```

  1. While inside the `.unikraft/` directory, create the `libs/` directory:

     ```console
     $ mkdir libs
     ```

  1. While inside the `.unikraft/` directory, clone the library repositories in the `libs/` directory:

     ```console
     $ git clone https://github.com/unikraft/lib-nginx libs/nginx

     $ git clone https://github.com/unikraft/lib-musl libs/musl

     $ git clone https://github.com/unikraft/lib-lwip libs/lwip
     ```

  1. Get back to the application directory:

     ```console
     $ cd ../
     ```

OK, we have now cloned everything we need.
We are ready to jump into `$make menuconfig` to configure our application by selecting all of the relevant libraries.
First, remember to go through the `Architecture` and `Platform` menus and select the relevant options, just as we did for the `helloworld` application!
After you have done that, you can scroll all the way down in the `Library Configuration` menu and select `libnginx` from the list (by pressing the `'Y'` key).
All of its dependencies should also be selected automatically after you do this.

![libnginx select](/community/hackathons/sessions/baby-steps/images/menuconfig_select_libnginx.png)

You will then need to further configure the `libnginx` library by hitting `Enter` on the entry, and then selecting the `Provide main function` option

![libnginx select main](/community/hackathons/sessions/baby-steps/images/menuconfig_select_libnginx_main.png)

As a final configuration part, we need to explicitly specify which filesystem we are going to use. We can do this by leveraging the `vfscore` internal library:

![select vfscore](/community/hackathons/sessions/baby-steps/images/menuconfig_select_vfscore.png)

Make sure to check automatic mounting and the `9PFS` filesystem:

![select vfscore fs](/community/hackathons/sessions/baby-steps/images/menuconfig_select_vfscore_fs.png)

Finally, we can now build the `Nginx` application by running the classic `make` command:

```console
$ make -j$(nproc)
```

The compilation process will take some time to finish since the application, together with its libraries, is much bigger than `helloworld`.
After the build is finished, we need to set up a network bridge for our virtual machine:

```console
$ sudo ip link set dev virbr0 down 2> /dev/null
$ sudo ip link del dev virbr0 2> /dev/null
$ sudo ip link add dev virbr0 type bridge
$ sudo ip address add 172.44.0.1/24 dev virbr0
$ sudo ip link set dev virbr0 up
```

Finally, we have to run this daunting command to launch our `Nginx` application correctly:

```console
sudo qemu-system-x86_64 \
    -fsdev local,id=myid,path=$(pwd)/fs0,security_model=none \
    -device virtio-9p-pci,fsdev=myid,mount_tag=fs0,disable-modern=on,disable-legacy=off \
    -netdev bridge,id=en0,br=virbr0 -device virtio-net-pci,netdev=en0 \
    -append "netdev.ipv4_addr=172.44.0.2 netdev.ipv4_gw_addr=172.44.0.1 netdev.ipv4_subnet_mask=255.255.255.0 --" \
    -kernel build/nginx_qemu-x86_64 \
    -nographic
```
Besides `-kernel` and `-nographic`, we have new parameters:
* `-fsdev` is used for specifying the root directory (`fs0`) of the automatically mounted filesystem
* `-device` for emulating PCI devices
* `-netdev` states which network bridge to use
* `-append` used for passing parameters to the kernel - in our case, we use it for static IP allocation


If everything went well, you should hopefully see an output like this one:

```console
SeaBIOS (version Arch Linux 1.16.2-1-1)


iPXE (http://ipxe.org) 00:04.0 C900 PCI2.10 PnP PMM+06FD3210+06F33210 C900



Booting from ROM..1: Set IPv4 address 172.44.0.2 mask 255.255.255.0 gw 172.44.0.1
en1: Added
en1: Interface is up
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Atlas 0.13.1~5eb820bd
```
