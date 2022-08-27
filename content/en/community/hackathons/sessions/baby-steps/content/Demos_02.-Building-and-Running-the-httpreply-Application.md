This is where we will take a look at how to build a basic HTTP Server both through `kraft` and manually.
The latter involves understanding how to integrate ported external libraries, such as `lwip`.

#### Using kraft

Just as before, let's create a directory that will host the application.
We enter the `demo/` directory of the current session and we create the `01-hello-world/` directory:
```bash
$ cd demo/
$ mkdir 02-httpreply
$ cd 02-httpreply/
```

Now, we go through the steps above.

##### Initialize

Retrieve the already existing template for `httpreply`:
```bash
$ kraft init -t httpreply
```

##### Configure

Configure the building of a KVM unikernel image for x86_64:
```bash
$ kraft configure -p kvm -m x86_64
```

##### Build

```bash
$ kraft build
```

##### Run

```bash
$ kraft run -p kvm -m x86_64
[...]
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                   Tethys Phoebe 0.10.0~3a997c1
Listening on port 8123...
```
Use `Ctrl+c` to stop the HTTP server running as a unikernel virtual machine.

##### Connecting to the HTTP Server

The server listens on port `8123` but we can't access it, as the virtual machine doesn't have a (virtual) network connection to the host system and it doesn't have an IP address.
So we have to create a connection and assign an IP address.

We use a virtual bridge to create a connection between the VM and the host system.
We assign address `172.44.0.1/24` to the bridge interface (pointing to the host) and we assign address `172.44.0.2/24` to the virtual machine, by passing boot arguments.

We run the commands below to create and assign the IP address to the bridge `virbr0`:
```bash
$ sudo brctl addbr virbr0
$ sudo ip a a  172.44.0.1/24 dev virbr0
$ sudo ip l set dev virbr0 up
```

We can check the proper configuration:
```bash
$ ip a s virbr0
420: virbr0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UNKNOWN group default qlen 1000
    link/ether 3a:3e:88:e6:a1:e4 brd ff:ff:ff:ff:ff:ff
    inet 172.44.0.1/24 scope global virbr0
       valid_lft forever preferred_lft forever
    inet6 fe80::383e:88ff:fee6:a1e4/64 scope link
       valid_lft forever preferred_lft forever
```

Now we start the virtual machine and pass it the proper arguments to assign the IP address `172.44.0.2/24`:
```bash
$ kraft run -b virbr0 "netdev.ipv4_addr=172.44.0.2 netdev.ipv4_gw_addr=172.44.0.1 netdev.ipv4_subnet_mask=255.255.255.0 --"
[...]
0: Set IPv4 address 172.44.0.2 mask 255.255.255.0 gw 172.44.0.1
en0: Added
en0: Interface is up
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                   Phoebe 0.10.0~3a997c1
Listening on port 8123...
```
The boot message confirms the assigning of the `172.44.0.2/24` IP address to the virtual machine.
It's listening on port 8123 for HTTP connections on that IP address.
We use `wget` to validate it's working properly and we are able to get the `index.html` file:
```bash
$ wget 172.44.0.2:8123
--2021-08-18 16:47:38--  http://172.44.0.2:8123/
Connecting to 172.44.0.2:8123... connected.
HTTP request sent, awaiting response... 200 OK
[...]
2021-08-18 16:47:38 (41.5 MB/s) - ‘index.html’ saved [160]
```

Cleaning up means closing the virtual machine (and the HTTP server) and disabling and deleting the bridge interface:
```bash
$ sudo ip l set dev virbr0 down
$ sudo brctl delbr virbr0
```

#### The Manual Way

##### Initialize

First, move into a new directory and clone the `httpreply` repo there.
```bash
$ cd .. && mkdir 02-httpreply-manual && cd 02-httpreply-manual
$ git clone https://github.com/unikraft/app-httpreply .
```

##### Adding a Makefile

Unlike before, you can notice that this time we are missing the regular `Makefile`.
Let's start by copying the `Makefile` from helloworld:
```bash
$ cp ../01-hello-world/Makefile .
```

This is how it looks like:
```bash
$ cat Makefile
UK_ROOT ?= $(PWD)/../../unikraft
UK_LIBS ?= $(PWD)/../../libs
LIBS :=

all:
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS)

$(MAKECMDGOALS):
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS) $(MAKECMDGOALS)
```

As you can see, the previously presented environment values make the same wrong assumption.
Previously, we fixed this by preceding the `make` command with the updated values for the environment variables, but we could have also simply modified them from within the `Makefile`, like so:
```
UK_ROOT ?= $(HOME)/.unikraft/unikraft
UK_LIBS ?= $(HOME)/.unikraft/libs
LIBS :=


	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS)

$(MAKECMDGOALS):
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS) $(MAKECMDGOALS)
```

For the HTTP server, however, we need the `lwip` library, and we have to add it to the `LIBS` variable in the Makefile.
We add it by first downloading it on our system in `$(UK_WORKDIR)/libs/`:
```bash
$ git clone https://github.com/unikraft/lib-lwip ~/.unikraft/libs/lwip
fatal: destination path '~/.unikraft/libs/lwip' already exists and is not an empty directory.
```
The library is already cloned. That is because `kraft` took care of it for us behind the scenes in our previous automatic build.

The next step is to add this library in the `Makefile`. The `httpreply` app is missing the `Makefile` file, so you need to create one:
```
UK_ROOT ?= $(HOME)/.unikraft/unikraft
UK_LIBS ?= $(HOME)/.unikraft/libs
LIBS := $(UK_LIBS)/lwip

all:
        @$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS)

$(MAKECMDGOALS):
        @$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS) $(MAKECMDGOALS)
```

##### Configure

Now, we configure it through `make menuconfig`.

![lwip selection menu](/community/hackathons/sessions/baby-steps/images/menuconfig_select_lwip.png)

![lwip2 selection menu](/community/hackathons/sessions/baby-steps/images/menuconfig_select_lwip2.png)

If you noticed, the menu also automatically selected some other internal components that would be required by `lwip`.
Now `Save` and `Exit` the configuration and run `make`.

Make sure to also select the `KVM Guest` target in the `Platform Configuration` menu.

##### Build

```bash
$ make
```

##### Running and connecting to the HTTP server

Similarly to kraft, in order to connect to the HTTP server, we use a virtual bridge to create a connection between the VM and the host system.
We assign address `172.44.0.1/24` to the bridge interface (pointing to the host) and we assign address `172.44.0.2/24` to the virtual machine, by passing boot arguments.

We run the commands below to create and assign the IP address to the bridge `virbr0`:
```bash
$ sudo brctl addbr virbr0
$ sudo ip a a  172.44.0.1/24 dev virbr0
$ sudo ip l set dev virbr0 up
```

Now we start the virtul machine and pass it the proper arguments to assing the IP address `172.44.0.2/24`:
```bash
$ sudo qemu-system-x86_64 -netdev bridge,id=en0,br=virbr0 -device virtio-net-pci,netdev=en0 -append "netdev.ipv4_addr=172.44.0.2 netdev.ipv4_gw_addr=172.44.0.1 netdev.ipv4_subnet_mask=255.255.255.0 --" -kernel build/02-httpreply-manual_kvm-x86_64 -nographic
0: Set IPv4 address 172.44.0.2 mask 255.255.255.0 gw 172.44.0.1
en0: Added
en0: Interface is up
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                   Phoebe 0.10.0~3a997c1
Listening on port 8123...
[...]
```
The boot message confirms the assigning of the `172.44.0.2/24` IP address to the virtual machine.
It's listening on port 8123 for HTTP connections on that IP address.
We use `wget` to validate it's working properly and we are able to get the `index.html` file:
```bash
$ wget 172.44.0.2:8123
--2021-08-18 16:47:38--  http://172.44.0.2:8123/
Connecting to 172.44.0.2:8123... connected.
HTTP request sent, awaiting response... 200 OK
[...]
2021-08-18 16:47:38 (41.5 MB/s) - ‘index.html’ saved [160]
```

Cleaning up means closing the virtual machine (and the HTTP server) and disabling and deleting the bridge interface:
```bash
$ sudo ip l set dev virbr0 down
$ sudo brctl delbr virbr0
```
