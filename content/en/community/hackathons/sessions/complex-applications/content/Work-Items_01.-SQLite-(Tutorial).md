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
