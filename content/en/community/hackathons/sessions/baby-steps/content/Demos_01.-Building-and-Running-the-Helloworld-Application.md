This is where the fun part begins - we get to build our first unikernel.

#### One Command to Rule Them All

kraft makes it easy to download, configure, build existing components into unikernel images and then run those images.
The `kraft up` command makes it easy to do that with one swoop.
Let's do that for the `helloworld` application (listed with `kraft list`):
```bash
$ kraft up -t helloworld hello
 100.00% :::::::::::::::::::::::::::::::::::::::: |       21 /       21 |:  app/helloworld@0.10.0
[INFO    ] Initialized new unikraft application: /home/unikraft/hello
make: Entering directory '/home/unikraft/.unikraft/unikraft'
[...]
#
# configuration written to /home/unikraft/hello/.config
#
[...]
CC      libkvmplat: trace.common.o
CC      libkvmplat: traps.isr.o
CC      libkvmplat: cpu_features.common.o
[...]
CC      libnolibc: errno.o
CC      libnolibc: stdio.o
CC      libnolibc: ctype.o
[...]
LD      hello_kvm-x86_64.ld.o
OBJCOPY hello_kvm-x86_64.o
LD      hello_kvm-x86_64.dbg
SCSTRIP hello_kvm-x86_64
GZ      hello_kvm-x86_64.gz
LN      hello_kvm-x86_64.dbg.gdb.py
[...]
Successfully built unikernels:

  => build/hello_kvm-x86_64
  => build/hello_kvm-x86_64.dbg (with symbols)

[...]
To instantiate, use: kraft run
[...]
Starting VM...
[...]
                   Phoebe 0.10.0~3a997c1
Hello world!
Arguments:  "/home/unikraft/hello/build/hello_kvm-x86_64" "console=ttyS0"
```

In the snippet above, we selected parts of the output showing what `kraft` does behind the scenes:

1. It downloads the `helloworld` application repository in the `hello/` directory.
1. It configures the repository, resulting in a `.config` file.
1. It builds the required components, resulting in the `build/hello_kvm-x86_64` unikernel image.
1. It runs the image, resulting in QEMU/KVM being run, with the "Hello world!" message getting printed.

All that magic is done using one command.

A closer inspection of the `hello/` folder reveals it is a clone of the [app-helloworld repository](https://github.com/unikraft/app-helloworld) and it stores the resulting configuration file (`.config`) and resulting build folder (and images) (`build/`):
```bash
$ ls -Fa hello/
./  ../  build/  CODING_STYLE.md  .config  Config.uk  CONTRIBUTING.md  COPYING.md  .git/  kraft.yaml  main.c  MAINTAINERS.md  Makefile  Makefile.uk  monkey.h  README.md
```

Once this is done, we can now run the resulting unikernel image any time we want by simply using `kraft run`:
```bash
$ cd hello/
$ kraft run
[...]
                   Phoebe 0.10.0~3a997c1
Hello world!
Arguments:  "/home/unikraft/hello/build/hello_kvm-x86_64" "console=ttyS0"
```

#### Doing it Step-by-Step Using kraft

The above `kraft up` command seems like magic and it's not very clear what's really happening.
Let's break that down into subcommands and really get a good grip of the configure, build and run process.

We will go through the same steps above, running a separate command for each step:

1. Download / Initialize the helloworld appplication.
1. Configure the application, resulting in a `.config` file.
1. Build the required components, resulting in the `build/hello_kvm-x86_64` unikernel image.
1. Run the image, with the "Hello world!" message getting printed.

##### Initialize

First, let's create a directory that will host the application.
We enter the `demo/` directory of the current session and we create the `01-hello-world/` directory:
```bash
$ cd demo/
$ mkdir 01-hello-world
$ cd 01-hello-world/
```

Now, we initialize the application by using the template for the helloworld app and see that it's populated with files belonging to the app:
```bash
$ kraft init -t helloworld
$ ls
CODING_STYLE.md  Config.uk  CONTRIBUTING.md  COPYING.md  kraft.yaml  main.c  MAINTAINERS.md  Makefile  Makefile.uk  monkey.h  README.md
```

The `kraft.yaml` file is the most important file when building an app using kraft.
It stores kraft-speficic configuration for the app and its dependencies on other libraries. It's used by kraft when configuring, building and running the application.
Other files are important as well, but they are used behind the scenes by kraft.
We will detail them later in the session and in session 02: Behind the Scenes.

##### Configure

A unikernel image may be targeted for multiple platforms and architectures.
The available platforms and applications are listed in the `kraft.yaml` file:
```bash
$ cat kraft.yaml
specification: '0.5'

unikraft: '0.10.0'

architectures:
  x86_64: true
  arm64: true

platforms:
  linuxu: true
  kvm: true
  xen: true
```
In our case, we can target the `x86_64` or `arm64` architectures.
And we can target `linuxu`, `kvm` or `xen` platforms.

The simplest way to select the platform and architecture is by running `kraft configure` and then interactively use arrow keys to select the desired option:
```bash
$ kraft configure
[?] Which target would you like to configure?: 01-hello-world_linuxu-x86_64
 > 01-hello-world_linuxu-x86_64
   01-hello-world_kvm-x86_64
   01-hello-world_xen-x86_64
   01-hello-world_linuxu-arm64
   01-hello-world_kvm-arm64
   01-hello-world_xen-arm64
```
We have 6 options (2 architectures x 3 platforms).
Once we select one, the configuration will be updated.

The alternate way (non-interactive) is to pass arguments to `kraft configure` to select the desired platform and architecture.
For example, if we want to use x86_64 and KVM, we use:
```bash
$ kraft configure -p kvm -m x86_64
```

##### Build

Everything is set up now, all we have left to do is tell the build system to do its magic:
```bash
$ kraft build
[...]
Successfully built unikernels:

  => build/01-hello-world_kvm-x86_64
  => build/01-hello-world_kvm-x86_64.dbg (with symbols)

To instantiate, use: kraft run
```

This results in the creation of two unikernel image files:
1. `build/01-hello-world_kvm-x86_64` - the main image file
2. `build/01-hello-world_kvm-x86_64.dbg` - the image file with debug information (useful for debugging, duh!)

And that's it! Our final unikernel binary is ready to be launched from the `build/` directory.

##### Run

To run an already-built unikernel image, we use `kraft run`:
```bash
$ kraft run
[...]

                   Phoebe 0.10.0~3a997c1
Hello world!
[...]
```

If we want to be more specific, we could use:
```bash
$ kraft run -p kvm -m x86_64
```

This command is useful in the case we have multiple images built (for differing platforms and architectures).
We can then select which one to run.

For example, we can use the commands below to configure, build and run a helloworld image for the `linuxu` platform.
```bash
$ kraft configure -p linuxu -m x86_64
$ kraft build
$ kraft run -p linuxu -m x86_64
```

You can now alter between running the `linuxu` and the `kvm` built images by using `kraft run` with the appropriate arguments.

#### More on kraft

Of course, this is the most basic way you can use `kraft`, but there are many other options.
To see every option `kraft` has to offer, you can simply type `kraft -h`.
If you want to know about a certain command, just follow it with the `-h` option.
For example, if one wants to know more about the configure command, they would type `kraft configure -h`.

#### Manually Building the helloworld Application

Let's now learn how to build the app manually, without `kraft`.
We won't go into too much detail, this will be handled more thoroughly in session 02: Behind the Scenes.

The manual approach is more complicated (albeit giving you potentially more control) than kraft.
For most of the use cases (development, testing, evaluating, using) of Unikraft, we recommend you to use kraft.
However, when you want to have more precise control over the configuration, building and running an unikernel, the manual approach can be very useful.

We will go through the same steps as above:

1. Download / Initialize the helloworld application.
1. Configure the application, resulting in a `.config` file.
1. Build the required components, resulting in the `build/hello_kvm-x86_64` unikernel image.
1. Run the image, with the "Hello world!" message getting printed.

##### Initialize

First, get out of the current build's directory and make a new one:
```bash
$ cd ../ && mkdir 01-hello-world-manual && cd 01-hello-world-manual
```

Now, clone the remote Git repository:
```bash
$ git clone https://github.com/unikraft/app-helloworld.git .
$ ls
CODING_STYLE.md  Config.uk  CONTRIBUTING.md  COPYING.md  kraft.yaml  main.c  MAINTAINERS.md  Makefile  Makefile.uk  monkey.h  README.md
```

##### Configure

To configure the build process (and the resulting unikernel image) we access a text-user interface menu by using:
```bash
$ make menuconfig
```

Looks like we are met with an error:
```bash
$ make menuconfig
Makefile:9: recipe for target 'menuconfig' failed
make: *** [menuconfig] Error 2
```

We look in the `Makefile`:
```bash
$ cat -n Makefile
     1  UK_ROOT ?= $(PWD)/../../unikraft
     2  UK_LIBS ?= $(PWD)/../../libs
     3  LIBS :=
     4
     5  all:
     6          @$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS)
     7
     8  $(MAKECMDGOALS):
     9          @$(MAKE) -C $(UK_ROOT) A=$(PWD) L=$(LIBS) $(MAKECMDGOALS)
```
The underlying build / configuration system expects the Unikernel (`UK_ROOT`) to be located at `../../unikraft` from the current directory, which is very likely not the case.
Recall that the build system makes use of some important environment variables, namely `UK_WORKDIR`, `UK_ROOT` and `UK_LIBS`.
So, in order to properly inform the build system of our current location, we will have to manually set these by prefixing whatever build command we send with the hardcoded values of where our `Unikraft` work directory is.
```bash
$ UK_WORKDIR=~/.unikraft UK_ROOT=~/.unikraft/unikraft UK_LIBS=~/.unikraft/libs make menuconfig
```
You can also export these environment variables for the current shell session:
```bash
$ export UK_WORKDIR=~/.unikraft UK_ROOT=~/.unikraft/unikraft UK_LIBS=~/.unikraft/libs
```
Then simply run:
```bash
$ make menuconfig
```

**Note**: This menu is also available through the `kraft menuconfig` command, which rids you of the hassle of manually setting the environment variables.

We are met with the following configuration menu. Let's pick the architecture:

![arch selection menu](/community/hackathons/sessions/baby-steps/images/menuconfig_select_arch.png)

![arch selection menu2](/community/hackathons/sessions/baby-steps/images/menuconfig_select_arch2.png)

![arch selection menu3](/community/hackathons/sessions/baby-steps/images/menuconfig_select_arch3.png)

Now, press `Exit` (or hit the `Esc` key twice) until you return to the initial menu.

We have now set our desired architecture, let's now proceed with the platform.
We will choose both `linuxu` and `kvm`:

![plat selection menu](/community/hackathons/sessions/baby-steps/images/menuconfig_select_plat.png)

![plat selection menu2](/community/hackathons/sessions/baby-steps/images/menuconfig_select_plat2.png)

`Save` and exit the configuration menu by repeatedly selecting `Exit`.

##### Build

Now let's build the final image (recall the environment variables - make sure that they are correctly set):
```bash
$ UK_WORKDIR=~/.unikraft UK_ROOT=~/.unikraft/unikraft UK_LIBS=~/.unikraft/libs  make
[...]
  LD      01-hello-world-manual_linuxu-x86_64.dbg
  SCSTRIP 01-hello-world-manual_kvm-x86_64
  GZ      01-hello-world-manual_kvm-x86_64.gz
  SCSTRIP 01-hello-world-manual_linuxu-x86_64
  LN      01-hello-world-manual_kvm-x86_64.dbg.gdb.py
  LN      01-hello-world-manual_linuxu-x86_64.dbg.gdb.py
```

Our final binaries are located inside the `build/` directory.

##### Run

Let's run the `linuxu` image by doing a Linux-like executable running. `linuxu` stands for Linux userspace; a `linuxu` image is just an executable that will be launched as a process on the host system:
```bash
$ ./build/01-hello-world-manual_linuxu-x86_64  # The linuxu image
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                   Phoebe 0.10.0~3a997c1
Hello world!
```

To run the KVM image, we use the `qemu-system-x86_64` command:
```bash
$ qemu-system-x86_64 -kernel build/01-hello-world-manual_kvm-x86_64 -nographic
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                   Phoebe 0.10.0~3a997c1
Hello world!
Arguments:  "build/hello_kvm-x86_64"
```
