We want to build the Helloworld application, using the Kconfig-based system, for the **linuxu** and **KVM** platforms, for the **ARM** and **x86** architectures, and then run them.

If you don't have the `unikraft` and `app-helloworld` repositories cloned already, do so, by running the following commands:

```
$ git clone https://github.com/unikraft/unikraft
$ cd apps
$ git clone https://github.com/unikraft/app-helloworld helloworld/
```

As you can see from the commands above, it is recommended to have the following file structure in your working directory:

```
workdir
|_______apps
|	|_______helloworld
|_______libs
|_______unikraft
```

Make sure that `UK_ROOT` and `UK_LIBS` are set correctly in the `Makefile` file, in the `helloworld` folder.
If you are not sure if they are set correctly, set them like this:

```
UK_ROOT ?= $(PWD)/../../unikraft
UK_LIBS ?= $(PWD)/../../libs
```

#### Linuxu, x86_64

First, we will the image for the **linuxu** platform.
As the resulting image will be an ELF, we can only run the **x86** Unikraft image.
We follow the steps:

1. While in the `helloworld` folder, run

   ```
   $ make menuconfig
   ```

1. From `Architecture Selection`, select `Architecture` -> `x86 compatible`.
1. From `Platform Configuration`, select `Linux user space`.
1. Save, exit and run

   ```
   $ make
   ```

1. The resulting image, `app-helloworld_linuxu-x86_64` will be present in the `build/` folder.
   Run it.

   ```
   $ ./build/app-helloworld_linuxu-x86_64
   ```

#### KVM, x86_64

Next, we will build the image for the **kvm** platform.
Before starting the process, make sure that you have the necessary tools, listed in the [Required Tools](/docs/sessions/02-behind-scenes/#required-tools) section.
We follow the steps:

1. Run

   ```
   $ make menuconfig
   ```

1. We will leave the architecture as is, for now.
1. From `Platform Configuration`, select `KVM guest`.
1. Save, exit and run

   ```
   $ make
   ```

1. Load the resulting image in QEMU by using

   ```
   $ sudo qemu-system-x86_64 -kernel ./build/app-helloworld_kvm-x86_64 -serial stdio
   ```

Besides `-serial stdio`, no other option is needed to run the Helloworld application.
Other, more complex applications, will require more options given to qemu.

We have run Unikraft in the emulation mode, with the command from above.
We can also run it in the virtualization mode, by adding the `-enable-kvm` option.
You may receive a warning, `host doesn't support requested feature:`.
This is because kvm uses a generic CPU model.
You can instruct kvm to use your local CPU model, by adding `-cpu host` to the command.

The final command will look like this:

```
$ sudo qemu-system-x86_64 -enable-kvm -cpu host -kernel ./build/app-helloworld_kvm-x86_64 -serial stdio
```

While we are here, we can check some differences between emulation and virtualization.
Record the time needed by each image to run, using `time`, like this:

```
$ time sudo qemu-system-x86_64 -kernel ./build/app-helloworld_kvm-x86_64 -serial stdio
$ time sudo qemu-system-x86_64 -enable-kvm -cpu host -kernel ./build/app-helloworld_kvm-x86_64 -serial stdio
```

Because `helloworld` is a simple application, the **real** running time will be similar.
The differences are where each image runs most of its time: in user space, or in kernel space.
Find an explanation to those differences.

#### KVM, ARM

To configure Unikraft for the ARM architecture, go to the configuration menu, like before, and select, from `Architecture Selection`, `Armv8 compatible`.
Save and exit the configuration.
As a new architecture is selected, you have to clean the previously compiled files:

```
$ make clean
```

After cleaning, build the image:

```
$ make
```

To run Unikraft, use the following command:

```
$ sudo qemu-system-aarch64 -machine virt -cpu cortex-a57 -kernel ./build/app-helloworld_kvm-arm64 -serial stdio
```

Note that now we need to provide a machine and a CPU model to be emulated, as there are no defaults available.
If you want to find information about other machines, run

```
$ sudo qemu-system-aarch64 -machine help
```
