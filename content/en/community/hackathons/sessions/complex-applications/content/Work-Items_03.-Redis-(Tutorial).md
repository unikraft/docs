The goal of this tutorial is to get you to set up and run Redis on top of Unikraft.
Find the support files in the `work/03-set-up-and-run-redis/` folder of the session directory.

[Redis](https://redis.io/topics/introduction) is one of the most popular key-value databases, with a design that facilitates the fast writing and reading of data from memory, as well as the storage of data on disk in order to be able to reconstruct the state of data in memory in case of a system restart.
Unlike other data storage systems, Redis supports different types of data structures such as lists, maps, strings, sets, bitmaps, streams.

The Redis application is built using an external library, [lib-redis](https://github.com/unikraft/lib-redis), that depends on other ported libraries for Unikraft ([pthread-embedded](https://github.com/unikraft/lib-pthread-embedded), [newlib](https://github.com/unikraft/lib-newlib) and [lwip](https://github.com/unikraft/lib-lwip) library), all of which you should be familiar with by now.
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
We also clone the library repositories which [lib-redis](https://github.com/unikraft/lib-redis) depends on ([pthread-embedded](https://github.com/unikraft/lib-pthread-embedded), [newlib](https://github.com/unikraft/lib-newlib) and [lwip](https://github.com/unikraft/lib-lwip)) in the `libs/` folder.

We clone the [app-redis](https://github.com/unikraft/app-redis/) repository in the `apps/` folder.
In this directory, we need to create two files:

* `Makefile`: it contains rules for building the application, as well as specifying the external libraries that the application needs
* `Makefile.uk`: used to define variables needed to compile the application or to add application-specific flags

In the `Makefile`, the order in which the libraries are mentioned in the `LIBS` variable is important to avoid the occurrence of compilation errors.

```Makefile
UK_ROOT ?= $(PWD)/../../unikraft
UK_LIBS ?= $(PWD)/../../libs
LIBS := $(UK_LIBS)/lib-pthread-embedded:$(UK_LIBS)/lib-newlib:$(UK_LIBS)/lib-lwip:$(UK_LIBS)/lib-redis

all:
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS)

$(MAKECMDGOALS):
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS) $(MAKECMDGOALS)
```

For the moment, `Makefile.uk` should look like this:

```Makefile
$(eval $(call addlib,appredis))
```

#### Configure

We configure the application by running:

```bash
$ make menuconfig
```

We select  the Redis library from the configuration menu, `Library Configuration` section.
For starters, we select the option to generate the main source file used to run the application.

![redis selection menu](/community/hackathons/sessions/complex-applications/images/redis_menu.png)

To connect to the Redis server, the network features should be configured.
Hence, in the configuration menu in the `Library Configuration` section, within the `lwip library` the following options should be selected:

* `IPv4`
* `UDP support`
* `TCP support`
* `ICMP support`
* `DHCP client`
* `Socket API`

![lwip selection menu](/community/hackathons/sessions/complex-applications/images/lwip_redis_menu.png)

The Redis application needs a configuration file to start.
Thus, a filesystem should be selected in the configuration menu.
The filesystem we previously used was 9PFS.

As such, in the `Library Configuration` section of the configuration menu, the following selection chain should be made in the vfscore library: `VFSCore Interface` -> `vfscore Configuration` -> `Automatically mount a root filesystem` -> `Default root filesystem` -> `9PFS`.
Same as before, since we'll be using the `qemu-guest` script, we'll need to name the `Default root device` `fs0` (`Library Configuration` -> `vfscore` -> `Default root device`).

Nevertheless, don't forget to select the `posix-event` library: `Library Configuration` -> `posix-event`.

#### Build

We build the application by running:

```bash
$ make
```

#### Test

Following the steps above, the build of the entire system, together with the Redis application will be successful.
We can create a `redis_files` directory in which we can place our configuration file for Redis, `redis.conf`.
We used a script to run the application in which a bridge and a network interface (`kraft0`) are created.
The network interface has an IP associated with it used by clients to connect to the Redis server.
Also, the script takes care of starting the Redis server, but also of stopping it, deleting the settings created for the network.

```bash
sudo brctl addbr kraft0
sudo ifconfig kraft0 172.44.0.1
sudo ifconfig kraft0 up

sudo dnsmasq -d \
             -log-queries \
             --bind-dynamic \
             --interface=kraft0 \
             --listen-addr=172.44.0.1 \
             --dhcp-range=172.44.0.2,172.44.0.254,255.255.255.0,12h &> dnsmasq.logs &

./qemu-guest.sh -k ./build/app-redis_kvm-x86_64 \
                -a "/redis.conf" \
                -b kraft0 \
                -e ./redis_files \
                -m 100
```

The Redis server start command has several parameters:

* `k` indicates the executable resulting from the build of the entire system together with the `Redis` application
* `e` indicates the path to the shared directory where the Unikraft filesystem will be mounted
* `b` indicates the network interface used for external communication
* `m` indicates the memory allocated to the application
* `a` allows the addition of parameters specific to running the application

The following image is presenting an overview of our setup:

![lwip selection menu](/community/hackathons/sessions/complex-applications/images/redis_setup.png)

Consequently, after running the script, the Redis server will start and dnsmasq will act as a DHCP server and therefore it will dynamically assign to our Unikraft instance an IP address.
The IP can be seen in the output of qemu as bellow:

```bash
Booting from ROM...
en1: Added
en1: Interface is up
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Phoebe 0.10.0~9bf6e63
1:C 27 Aug 2022 12:37:07.023 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 27 Aug 2022 12:37:07.026 # Redis version=5.0.6, bits=64, commit=c5ee3442, modified=1, pid=1, just started
1:C 27 Aug 2022 12:37:07.031 # Configuration loaded
1:M 27 Aug 2022 12:37:07.049 * Increased maximum number of open files to 10032 (it was originally set to 1024).
                _._                                                  
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 5.0.6 (c5ee3442/1) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                   
 (    '      ,       .-`  | `,    )     Running in standalone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 1
  `-._    `-._  `-./  _.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           http://redis.io        
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                                               

1:M 27 Aug 2022 12:37:07.090 # Server initialized
1:M 27 Aug 2022 12:37:07.092 * Ready to accept connections
en1: Set IPv4 address 172.44.0.242 mask 255.255.255.0 gw 172.44.0.1
```

Another way of inspecting the received IP is through the `dnsmasq.logs` file:

```bash
$ cat dnsmasq.logs 
[...]
dnsmasq-dhcp: DHCPOFFER(kraft0) 172.44.0.242 52:54:00:20:37:c1 
dnsmasq-dhcp: DHCPDISCOVER(kraft0) 52:54:00:20:37:c1 
dnsmasq-dhcp: DHCPOFFER(kraft0) 172.44.0.242 52:54:00:20:37:c1 
dnsmasq-dhcp: DHCPREQUEST(kraft0) 172.44.0.242 52:54:00:20:37:c1 
dnsmasq-dhcp: DHCPACK(kraft0) 172.44.0.242 52:54:00:20:37:c1 
```

Using the received IP, it will be possible to connect clients to it using `redis-cli` (the binary `redis-cli` is the folder for this work item):

```bash
$ ./redis-cli -h 172.44.0.242 -p 6379
172.44.0.242:6379> PING
PONG
172.44.0.242:6379>
```

Nevertheless, after completing this task, you will need to check that the `dnsmasq` process is not running anymore, as it messes up your other connections.
You can also disable and delete the bridge interface by running the following commands:

```
$ sudo ip l set dev kraft0 down
$ sudo brctl delbr kraft0
```