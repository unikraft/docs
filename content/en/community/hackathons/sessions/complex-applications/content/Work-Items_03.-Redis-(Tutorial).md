The goal of this tutorial is to get you to set up and run Redis on top of Unikraft.
Find the support files in the `work/03-set-up-and-run-redis/` folder of the session directory.

[Redis](https://redis.io/topics/introduction) is one of the most popular key-value databases, with a design that facilitates the fast  writing  and  reading  of  data  from  memory  as  well  as  the  storage  of  data  on  disk  to  be able to reconstruct the state of data in memory in case of a system restart.
Unlike other data storage systems, Redis supports different types of data structures such as lists, maps, strings, sets, bitmaps, streams.

The Redis application is formed by a ported external library that depends on other ported libraries for Unikraft ([pthread-embedded](https://github.com/unikraft/lib-pthread-embedded), [newlib](https://github.com/unikraft/lib-newlib), [lwip-network](https://github.com/unikraft/lib-lwip) library).
To successfully compile and run the Redis application for the KVM platform and x86-64 architecture, we follow the steps below.

#### Setup

As above, we make sure we have the directory structure to store the local clones of Unikraft, library and application repositories.
The structure should be:

```
workdir
|-- unikraft/
|-- libs/
`-- apps/
```

We clone the [lib-redis](https://github.com/unikraft/lib-redis) repository in the `libs/` folder.
We alsoe clonethe library repositories which [lib-redis](https://github.com/unikraft/lib-redis) depends on ([pthread-embedded]([pthread-embedded](https://github.com/unikraft/lib-pthread-embedded), [newlib](https://github.com/unikraft/lib-newlib) and [lwip](https://github.com/unikraft/lib-lwip)) in the `libs/` folder.

We clone the [app-redis](https://github.com/unikraft/app-redis/) repository in the `apps/` folder.
In this directory, we need to create two files:

* `Makefile`: it contains rules for building the application as well as specifying the libraries that the application needs
* `Makefile.uk`: used to define variables needed to compile the application or to add application-specific flags

Also, in the `Makefile`, the order in which the libraries are mentioned in the `LIBS` variable is important to avoid the occurrence of compilation errors.

```
UK_ROOT ?= $(PWD)/../../unikraft
UK_LIBS ?= $(PWD)/../../libs
LIBS := $(UK_LIBS)/lib-pthread-embedded:$(UK_LIBS)/lib-newlib:$(UK_LIBS)/lib-lwip:$(UK_LIBS)/lib-redis

all:
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS)

$(MAKECMDGOALS):
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS) $(MAKECMDGOALS)
```

#### Configure

We configure the application by running:

```
$ make menuconfig
```

We select  the Redis library from the configuration menu, `Library Configuration` section.
For starters, we select the option to generate the main source file used to run the application.

![redis selection menu](/docs/sessions/04-complex-applications/images/redis_menu.png)

#### Build

We build the application by running:

```
$ make
```

#### Test

To connect to the Redis server, the network features should be configured.
Hence, in the configuration menu in the `Library Configuration` section, within the `lwip library` the following options should be selected:

* `IPv4`
* `UDP support`
* `TCP support`
* `ICMP support`
* `DHCP support`
* `Socket API`

![lwip selection menu](/docs/sessions/04-complex-applications/images/lwip_redis_menu.png)

The Redis application needs a configuration file to start.
Thus, a filesystem should be selected in Unikraft.
The filesystem we used was 9PFS.
So, in the `Library Configuration` section of the configuration menu, the following selection chain should be made in the vfscore library: `VFSCore Interface` -> `vfscore Configuration` -> `Automatically mount a root filesystem` -> `Default root filesystem` -> `9PFS`.

Therefore, following the steps above, the build of the entire system, together with the Redis application will be successful.
We used a script to run the application in which a bridge and a network interface (`kraft0`) are created.
The network interface has an IP associated with it used by clients to connect to the Redis server.
Also, the script takes care of starting the Redis server, but also of stopping it, deleting the settings created for the network.

```
brctl addbr kraft0
ifconfig kraft0 172.44.0.1
ifconfig kraft0 up

dnsmasq -d \
        --log-queries \
        --bind-dynamic \
        --interface=kraft0 \
        --listen-addr=172.44.0.1 \
        --dhcp-range=172.44.0.2,172.44.0.254,255.255.255.0,12h &> $WORKDIR/dnsmasq.log &

./qemu-guest.sh -k ./build/redis_kvm-x86_64 \
                -a "/redis.conf" \
                -b kraft0 \
                -e ./redis_files
                -m 100
```

The Redis server start command has several parameters:

* `k` indicates the executable resulting from the build of the entire system together with the `Redis` application
* `e` indicates the path to the shared directory where the Unikraft filesystem will be mounted
* `b` indicates the network interface used for external communication
* `m` indicates the memory allocated to the application
* `a` allows the addition of parameters specific to running the application

The following image is presenting an overview of our setup:

![lwip selection menu](/docs/sessions/04-complex-applications/images/redis_setup.png)

Consequently, after running the script the Redis server will start and dnsmasq will dynamically assign an IP address.
The IP can be seen in the output of qemu as bellow:

![redis ip](/docs/sessions/04-complex-applications/images/redis_ip.png)

Using the received IP, it will be possible to connect clients to it using `redis-cli` (the binary `redis-cli` is the folder for this work item):

```
$ ./redis-cli -h 172.88.0.76 -p 6379
172.88.0.2:6379> PING
PONG
172.88.0.2:6379>
```
