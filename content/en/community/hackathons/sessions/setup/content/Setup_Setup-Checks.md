#### Run Unikraft helloworld

To easly setup, build and run the Unikraft `helloworld` application we provided some scripts that do all the work for you.
Clone the [`scripts` repository](https://github.com/unikraft-upb/scripts) on your machine to get started.
Run the commands below to configure, build and run the Unikraft `helloworld` program.
We will get into what the scripts do behind the scenes in the next session.

```console
$ git clone https://github.com/unikraft-upb/scripts
$ cd scripts/
$ cd make-based/app-helloworld/
$ ./do.sh setup    # <- this will clone all the dependencies in the `../../workdir` directory
Cloning into '../../workdir/unikraft'...
remote: Enumerating objects: 17633, done.
remote: Counting objects: 100% (682/682), done.
[...]

$ ./do.sh build    # <- this will invoke the Unikraft build system
make[1]: Entering directory '/home/stefan/.unikraft/unikraft'
LN      Makefile
MKDIR   lxdialog
CP      config
MKDIR   lxdialog
LN      helloworld_kvm-x86_64.dbg.gdb.py
[...]

$ ./do.sh run      # <- this will run the application that was build on the previous step, using `qemu`
SeaBIOS (version 1.13.0-1ubuntu1.1)
Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Janus 0.11.0~422ceb47
Hello world!
Arguments:  "build/helloworld_kvm-x86_64"
```

#### Run Unikraft httpreply

With the same set of scripts, we can build and run the [`httpreply` Unikraft application](https://github.com/unikraft/app-httpreply).

```console
$ cd scripts/
$ cd make-based/app-httpreply/
$ ./do.sh setup    # <- this will clone all the dependencies in the `../../workdir` directory
Cloning into '../../workdir/unikraft'...
remote: Enumerating objects: 17633, done.
remote: Counting objects: 100% (682/682), done.
[...]

$ ./do.sh build    # <- this will invoke the Unikraft build system
make[1]: Entering directory '/home/stefan/.unikraft/unikraft'
LN      Makefile
MKDIR   lxdialog
CP      config
MKDIR   lxdialog
LN      httpreply_kvm-x86_64.dbg.gdb.py
[...]

$ ./do.sh run      # <- this will run the application that was build on the previous step, using `qemu`
Booting from ROM..1: Set IPv4 address 172.44.0.2 mask 255.255.255.0 gw 172.44.0.1
en1: Added
en1: Interface is up
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Janus 0.11.0~422ceb47
Listening on port 8123...
```

The setup step will create a virtual bridge to enable communication with the unikernel.
To test that the application works properly, we can run from another terminal:

```console
$ wget 172.44.0.2:8123
--2023-03-30 07:56:30--  http://172.44.0.2:8123/
Connecting to 172.44.0.2:8123... connected.
HTTP request sent, awaiting response... 200 OK
Length: unspecified [text/html]
Saving to: ‘index.html’

index.html              [ <=>                ]     159  --.-KB/s    in 0s

2023-03-30 07:56:30 (10,5 MB/s) - ‘index.html’ saved [159]
```
