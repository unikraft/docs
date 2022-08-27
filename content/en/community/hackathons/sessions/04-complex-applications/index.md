---
title: "Session 04: Complex Applications"
linkTitle: "04. Complex Applications"
---

## Reminders

### Print system

This print system in implemented in `lib/ukdebug` and can be activated using `make menuconfig` (`Library Configuration -> ukdebug: Debugging and Tracing`).

We have two types of messages:

* **Kernel messages**
  * **Information**(`uk_pr_info`)
  * **Warnings**(`uk_pr_warn`)
  * **Errors**(`uk_pr_err`)
  * **Critical Messages**(`uk_pr_crit`)
* **Debug messages**(`uk_pr_debug`)

### Assertions

We can use assertions to check if the system is in a defined and stable state.
Can be compiled-in or compiled-out and it can be activated from `Library Configuration -> ukdebug: Debugging and Tracing -> Enable assertions`.

The macros used can be:

* `UK_ASSERT` (condition)
* `UK_BUGON` (negative condition)
* `UK_CTASSERT` (condition)(used for compile-time assertions)

### GDB

To use GDB we need the symbols from the `gdb` file generated at build time.
For this we need to set `Debug information level` to `Level 3` from `make menuconfig` (`Build Options -> Debug information level -> Level 3`).

#### Linux

For the Linux user space target (`linuxu`) simply point GDB to the resulting debug image:

```
$ gdb path_to_unikraft_gdb_image
```

#### KVM

For KVM we need to go through few steps:

1. Run guest in paused state

   Using **qemu**:

   ```
   $ qemu-guest -P -g 1234 -k path_to_unikraft_gdb_image
   ```

   Using **kraft**:

   ```
   $ kraft run -d -g 1234 -P
   ```
1. Attach debugger

   ```
   $ gdb --eval-command="target remote :1234" path_to_unikraft_gdb_image
   ```

3. Disconnect GDB

   ```
   disconnect
   ```

4. Set GDB's machine architecture to x86_64

   ```
   $ set arch i386:x86-64:intel
   ```

5. Re-connect

   ```
   tar remote localhost:1234
   ```

### Tracepoints

Tracepoints are provided by `lib/ukdebug`.
To enable Unikraft to collect trace data, enable the option `CONFIG_LIBUKDEBUG_TRACEPOINTS` in your configuration (via `make menuconfig` under `Library Configuration -> ukdebug -> Enable tracepoints`).

#### Instrumenting

Instrumenting your code with tracepoints is done by two steps:

* Define and register a tracepoint handler with the `UK_TRACEPOINT()` macro.
* Place calls to the generated handler at those places in your code where your want to trace an event.

#### Reading traces

Unikraft is storing trace data to an internal buffer that resides in the guest's main memory.
To access that data you need to configure the GDB and add `source /path/to/your/build/uk-gdb.py` to `~/.gdbinit`

Commands available in GDB:

| Commands               | Deion                    |
|------------------------|--------------------------|
| uk trace               | show tracepoints in GDB  |
| uk trace save `<file>` | save tracepoints to file |

Any saved trace file can be later processed with the  `trace.py`  .

```
$ support/s/uk_trace/trace.py list <file>
```


## Work Items

In this session, we are going to run some real-world applications on top of Unikraft.

### Support Files

Session support files are available [in the repository](https://github.com/unikraft/summer-of-code-2021).
If you already cloned the repository, update it and enter the session directory:

```
$ cd path/to/repository/clone

$ git pull --rebase

$ cd content/en/docs/sessions/04-complex-applications/

$ ls -F
images/  index.md  sol/  work/
```

If you haven't cloned the repository yet, clone it and enter the session directory:

```
$ git clone https://github.com/unikraft/summer-of-code-2021

$ cd summer-of-code-2021/content/en/docs/sessions/04-complex-applications/

$ ls -F
images/  index.md  sol/  work/
```

### 00. Qemu Wrapper

As we saw during the other sessions, [qemu-guest](https://github.com/unikraft/kraft/blob/staging/scripts/qemu-guest) is a wrapper script over the `qemu-system-x86_64` executable, to make the use of binary less painful.
In the following session, it will be very handy to use it.
To see the options for this wrapper you can use `qemu-guest -h`.

It is possible to run a lot of complex applications on Unikraft.
In this session we analyze 3 of them:

* Sqlite
* Redis
* Nginx

### 01. SQLite (Tutorial)

The goal of this tutorial is to get you to set up and run SQLite on top of Unikraft.
Find the support files in the `work/01-set-up-and-run-sqlite/` folder of the session directory.

[SQLite](https://www.sqlite.org/index.html) is a C library that implements an encapsulated SQL database engine that does not require any setting or administration.
It is one of the most popular in the world and is different from other SQL database engines because it is simple to administer, use, maintain, and test.
Thanks to these features, SQLite is a fast, secure, and most crucial simple application.

The SQLite application is formed by a ported external library that depends on two other libraries that are also ported for Unikraft: [pthread-embedded](https://github.com/unikraft/lib-pthread-embedded) and [newlib](https://github.com/unikraft/lib-newlib).
To successfully compile and run the SQLite application for the KVM platform and x86-64 architecture, we follow the steps below.

#### Setup

First, we make sure we have the directory structure to store the local clones of Unikraft, library and application repositories.
The structure should be:

```
workdir
|-- unikraft/
|-- libs/
`-- apps/
```

We clone the [lib-sqlite](https://github.com/unikraft/lib-sqlite) repository in the `libs/` folder.
The libraries on which `lib-sqlite` depends ([pthread-embedded](https://github.com/unikraft/lib-newlib) and [newlib](https://github.com/unikraft/lib-pthread-embedded)) are also to be cloned in the `libs/` folder.

We clone the [app-sqlite](https://github.com/unikraft/app-sqlite/) repository in the `apps/` folder.
In this directory, we need to create two files:

* `Makefile`: containing rules for building the application as well as specifying the libraries that the application needs
* `Makefile.uk`: used to define variables needed to compile the application or to add application-specific flags

Also, in the `Makefile`, the order in which the libraries are mentioned in the `LIBS` variable is important to avoid the occurrence of compilation errors.

```
UK_ROOT ?= $(PWD)/../../unikraft
UK_LIBS ?= $(PWD)/../../libs
LIBS := $(UK_LIBS)/lib-pthread-embedded:$(UK_LIBS)/lib-newlib:$(UK_LIBS)/lib-sqlite

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

We select the SQLite library from the configuration menu, `Library Configuration` section.
For starters, we select the option to generate the main source file used to run the application.

To import or export databases or CSV/SQL files, the SQLite application needs to configure a filesystem.
The filesystem we use is 9pfs.
Hence, in the `Library Configuration` section, we select the `9pfs` filesystem within the `vfscore` library options.

Make sure, that both options `Virtio PCI device support` and `Virtio 9P device` are selected.
Those can be found in: `Platform Configuration` -> `KVM guest` -> `Virtio`.

![9pfs options](/docs/sessions/04-complex-applications/images/9pfs_options.png)

#### Build

We build the application by running:

```
$ make
```

#### Test

For testing we can use the following SQLite script, which inserts ten values into a table:

```
CREATE TABLE tab (d1 int, d2 text);
INSERT INTO tab VALUES (random(), cast(random() as text)),
(random(), cast(random() as text)),
(random(), cast(random() as text)),
(random(), cast(random() as text)),
(random(), cast(random() as text)),
(random(), cast(random() as text)),
(random(), cast(random() as text)),
(random(), cast(random() as text)),
(random(), cast(random() as text)),
(random(), cast(random() as text));
```

Up next, create a folder in the application folder called `sqlite_files` and write the above script into a file.
When you run the application, you can specify the path of the newly created folder to the `qemu-guest` as following:

```
$ ./qemu-guest -k ./build/app-sqlite_kvm-x86_64 \
               -e ./sqlite_files \
               -m 500
```

The SQLite start command has several parameters:

* `k` indicates the executable resulting from the build of the entire system together with the `SQLite application`
* `e` indicates the path to the shared directory where the Unikraft filesystem will be mounted
* `m` indicates the memory allocated to the application

To load the SQLite script, we use the following command `.read <sqlite_script_name.sql>`.
And in the end, we run `select * from tab` to see the contents of the table.

If everything runs as expected, then we'll see the following output:

```
SeaBIOS (version 1.10.2-1ubuntu1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                   Tethys 0.5.0~825b115
SQLite version 3.30.1 2019-10-10 20:19:45
Enter ".help" for usage hints.
sqlite> .read script.sql
sqlite> select * from tab;
-4482895989777805454|-110319092326802521
1731384004930241734|4521105937488475129
394829130239418471|-5931220326625632549
4715172377251814631|3421393665393635031
2633802986882468389|174376437407985264
-1691186051150364618|3056262814461654943
-4054754806183404125|-2391909815601847844
-4437812378917371546|-6267837926735068846
8830824471222267926|7672933566995619644
4185269687730257244|-3477150175417807640
sqlite>
```

### 02. SQLite New Filesystem (Tutorial)

In the previous work item, we have chosen to use 9PFS as the filesystem.
For this work item, we want to change the filesystem to RamFS and load the SQLlite script as we have done in the previous work item.
Find the support files in the `work/02-change-filesystem-sqlite/` folder of the session directory.

First, we need to change the filesystem to InitRD.
We can obtain that by using the command `make menuconfig` and from the `vfscore: Configuration` option, we select the default root filesystem as `InitRD`.

![filesystems menu](/docs/sessions/04-complex-applications/images/filesystems.png)

The InitRD filesystem can load only [cpio archives](https://www.ibm.com/docs/en/zos/2.2.0?topic=formats-cpio-format-cpio-archives), so to load our SQLite script into RamFS filesystem, we need to create a cpio out of it.
This can be achieved the following way: Create a folder, move the SQLite script in it, and `cd `in it.
After that we run the following command:

```
$ find -type f | bsdcpio -o --format newc > ../archive.cpio
```

We'll obtain an cpio archive called `archive.cpio` in the parent directory.

Next we run the following qemu command to run the instance:

```
$ ./qemu-guest -k build/app-sqlite_kvm-x86_64 -m 100 -i archive.cpio
```

If everything runs as expected, then we'll see the following output:

```
SeaBIOS (version 1.10.2-1ubuntu1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                   Tethys 0.5.0~825b115
SQLite version 3.30.1 2019-10-10 20:19:45
Enter ".help" for usage hints.
sqlite> .read script.sql
sqlite> select * from tab;
-4482895989777805454|-110319092326802521
1731384004930241734|4521105937488475129
394829130239418471|-5931220326625632549
4715172377251814631|3421393665393635031
2633802986882468389|174376437407985264
-1691186051150364618|3056262814461654943
-4054754806183404125|-2391909815601847844
-4437812378917371546|-6267837926735068846
8830824471222267926|7672933566995619644
4185269687730257244|-3477150175417807640
sqlite>
```

### 03. Redis (Tutorial)

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

### 04. Redis Static IP Address

In tutorial above we have dynamically assigned an IP to the network interface used by Unikraft using the `dnsmasq` utility.
Find the support files in the `work/04-obtain-the-ip-statically/` folder of the session directory.

Modify the launching script and run the application with a static IP.
Beware that the assigned IP address must differ from the one assigned on the bridge.

You can use `redis-cli`, found in the suport folder to test your changes.
If everything runs as expected you should see the following output:

```
$ ./redis-cli -h 172.88.0.76 -p 6379
172.88.0.2:6379> PING
PONG
172.88.0.2:6379>
```

### 05. Redis Benchmarking (Tutorial)

We aim to do benchmarking for the Redis app running on top of Unikraft and for the Redis running on top of Linux.
Find the support files in the `work/05-benchmark-redis/` folder of the session directory.
There are three binaries: `redis-cli`, `redis-benchmark`, and `redis`.

First, we will start by benchmarking `redis app`, running on Unikraft.
Start the Redis on the top of Unikraft as we have already done at above and in another terminal run the following command:

```
$ ./redis-benchmark --csv -q -r 100 -n 10000 -c 1 -h 172.44.0.76 -p 6379 -P 8 -t set,get
```

The description of the used option can be seen here:

```
Usage: redis-benchmark [-h <host>] [-p <port>] [-c <clients>] [-n <requests>] [-k <boolean>]

 -h <hostname>      Server hostname (default 127.0.0.1)
 -p <port>          Server port (default 6379)
 -c <clients>       Number of parallel connections (default 50)
 -n <requests>      Total number of requests (default 100000)
 -P <numreq>        Pipeline <numreq> requests. Default 1 (no pipeline).
 -q                 Quiet. Just show query/sec values
 --csv              Output in CSV format
 -t <tests>         Only run the comma separated list of tests. The test
                    names are the same as the ones produced as output.
```

If everything runs as expected, you'll see the following output:

```
"SET","147058.81"
"GET","153846.16"
```

The printed values represent `requests/second` for the operation `set` and `get`.

Further, we will run the executable `redis-server` (`./redis-server`), which can be found in the support folder, and the following command (only the IP address of the redis server was changed):

```
$ ./redis-benchmark --csv -q -r 100 -n 10000 -c 1 -h 127.0.0.1 -p 6379 -P 8 -t set,get
```

After that you'll get something like this:

```
"SET","285714.28"
"GET","294117.62"
```

### 06. Nginx

The aim of this work item is to set up and run Nginx.
Find the support files in the `work/06-set-up-and-run-nginx/` folder of the session directory.

From the point of view of the library dependencies, the nginx app has the same dependencies as the Redis app.
It's your choice how you assign the IP to the VM.

In the support folder of this work item there is a subfolder called `nginx` with the following structure:

```
nginx_files
`-- nginx/
    |-- conf/
    |   |-- fastcgi.conf
    |   |-- fastcgi_params
    |   |-- koi-utf
    |   |-- koi-win
    |   |-- mime.types
    |   |-- nginx.conf
    |   |-- nginx.conf.default
    |   |-- scgi_params
    |   |-- uwsgi_params
    |   `-- win-utf
    |-- data/
    |   `-- images/
    |       `-- small-img100.png
    |-- html/
    |   |-- 50x.html
    |   `-- index.html
    `-- logs/
        |-- error.log
        `-- nginx.pid
```

The path to the `nginx_files` folder should be given as a parameter to the `-e option` of the `qemu-guest`.
The `html/` folder stores the files of the website you want to be run.

If everything works as expected, you should see the following web page in the browser.

![nginx output](/docs/sessions/04-complex-applications/images/nginx_output.png)

### 07. Nginx Benchmarking (Tutorial)

Benchmarking Nginx running on the top of Unikraft can be achieved with a utility called `iperf`.
The package can be easily installed using the command:

```
sudo apt-get install -y iperf
```

Next, we will start the nginx app as we have done at the previous work item and then we will open another two terminals.
We'll start an `iperf` server in the first terminal with the command:

```
$ iperf -s
```

In the second terminal we'll start an `iperf` client with the command:

```
$ iperf -c 172.44.0.76 -p 80
```

If everything runs as expected, then we will see the following output:

```
------------------------------------------------------------
Client connecting to 172.44.0.76, TCP port 80
TCP window size: 85.0 KByte (default)
------------------------------------------------------------
[  3] local 172.44.0.1 port 33262 connected with 172.44.0.76 port 80
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-10.0 sec  1.28 GBytes  1.10 Gbits/sec
```

### 08. Give Us Feedback

We want to know how to make the next sessions better. For this we need your [feedback](https://forms.gle/QyvxBx19cK4fUYRS7). Thank you!
