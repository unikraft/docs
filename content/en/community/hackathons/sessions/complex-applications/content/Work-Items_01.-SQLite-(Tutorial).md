The goal of this tutorial is to get you to set up and run SQLite on top of Unikraft.
Find the support files in the `work/01-set-up-and-run-sqlite/` folder of the session directory.

[SQLite](https://www.sqlite.org/index.html) is a C library that implements an encapsulated SQL database engine that does not require any setting or administration.
It is one of the most popular in the world and it differs from other SQL database engines because it is simple to administer, use, maintain, and test.
Thanks to these features, SQLite is a fast, secure, and (most crucial) simple application.

The SQLite application is built using an external library, [lib-sqlite](https://github.com/unikraft/lib-sqlite), that depends on two other libraries that are ported for Unikraft: [pthread-embedded](https://github.com/unikraft/lib-pthread-embedded) (a lightweight implementation of POSIX Threads) and [newlib](https://github.com/unikraft/lib-newlib) (a standard C library).
To successfully compile and run the SQLite application for the KVM platform on the x86-64 architecture, we follow the steps below.

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

* `Makefile`: containing rules for building the application, as well as specifying the libraries that the application needs
* `Makefile.uk`: used to define variables needed to compile the application or to add application-specific flags

In the `Makefile`, the order in which the libraries are mentioned in the `LIBS` variable is important to avoid the occurrence of compilation errors.

```Makefile
UK_ROOT ?= $(PWD)/../../unikraft
UK_LIBS ?= $(PWD)/../../libs
LIBS := $(UK_LIBS)/lib-pthread-embedded:$(UK_LIBS)/lib-newlib:$(UK_LIBS)/lib-sqlite

all:
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS)

$(MAKECMDGOALS):
	@$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS) $(MAKECMDGOALS)
```

For the moment, `Makefile.uk` should look like this:

```Makefile
$(eval $(call addlib,appsqlite))
```

#### Configure

We configure the application by running:

```
$ make menuconfig
```

We select the `SQLite` library from the configuration menu, `Library Configuration` section.
For starters, we select the option to generate the main source file used to run the application.

To import or export databases or CSV/SQL files, the SQLite application needs to configure a filesystem.
The filesystem we use is `9pfs`.
Hence, in the `Library Configuration` section, we select the `9pfs` filesystem within the `vfscore` library options.

As we are going to use the qemu wrapper to launch the app, we'll need to name the `Default root device` `fs0` (`Library Configuration` -> `vfscore` -> `Default root device`). This is due to how the `qemu-guest` script automatically tags the FS devices attached to qemu.

![9pfs options](/community/hackathons/sessions/complex-applications/images/9pfs_options.png)

Make sure that both options `Virtio PCI device support` and `Virtio 9P device` are selected.
They can be found in `Platform Configuration` -> `KVM guest` -> `Virtio`.

![virtio options](/community/hackathons/sessions/complex-applications/images/virtio_options.png)

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
In the end, we run `select * from tab` to see the contents of the table.

If everything runs as expected, then we'll get the following output:

```bash
SeaBIOS (version 1.13.0-1ubuntu1.1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Phoebe 0.10.0~9bf6e63
SQLite version 3.30.1 2019-10-10 20:19:45
Enter ".help" for usage hints.
sqlite> .read script.sql
sqlite> select * from tab;
-1758847760864160102|2718837905630364326
-1339730570270182734|-413022835704168293
899003099627700560|-5446400296487656477
3986823405912376844|-3683968660549484071
5750141151993138490|-949527979363852620
2608659443316808689|3543024197312456352
-2195896775588749426|6838623081517951948
8293933456345343304|6460961935619776014
6827842764477913763|7025795551657688644
4026439721321663478|8364502757469924828
sqlite> .exit
```
