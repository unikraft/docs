The goal of this task is to make sure that our setup is correct.
The first step is to copy the correct `.config` file into our application.

```
$ cp demo/01/config <WORKDIR>/apps/app-elfloader/.config
```

To check that the config file is the correct one, go to the `app-elfloader/` directory and configure it:

1. Change the directory to `<WORKDIR>/apps/app-elfloader/`.
1. Run `make menuconfig`.
1. Select `library configuration`.
   It should look like the below picture.
   Take a moment and inspect all the sub-menus, especially the syscall-shim one.

   ![Libraries configuration](images/config-image)

If everything is correct, we can run `make` and the image for our unikernel should be compiled.
In the `build` folder you should have the `elfloader_kvm-x86_64` binary.
To also test if it runs correctly:

```
.../<WORKDIR>/apps/app-elfloader$ qemu-guest -k build/elfloader_kvm-x86_64

SeaBIOS (version 1.10.2-1ubuntu1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Tethys 0.5.0~825b1150
[    0.105192] ERR:  <0x3f20000> [appelfloader] No image found (initrd parameter missing?)
```

Because we did not pass an initial ramdisk, the loader does not have anything to load, so that's where the error comes from.
