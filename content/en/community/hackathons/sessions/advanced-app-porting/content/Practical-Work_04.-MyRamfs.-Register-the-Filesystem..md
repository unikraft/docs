In the following exercises, we will build step by step a simplified version of the ramfs library.
The first step is to register the filesystem into `vfscore`.

Navigate to the `04-05-06-myramfs` directory.
Copy `myramfs` directory to the `lib` directory in `unikraft` and the application in the `apps` directory.
Your working directory should look like this:

```
workdir
|_______apps
|       |_______ramfs-app
|_______libs
|_______unikraft
        |_______lib
                |_______myramfs
                |_______vfscore
                |_______Makefile.uk
```

Edit the `Makefile.uk` from the `lib` directory and add the following:

```
$(eval $(call _import_lib,$(CONFIG_UK_BASE)/lib/myramfs))
```

Now we need to make our library configurable from `vfscore`, for this we will need to edit the `Config.uk` file in the `vfscore` directory.

First we will add the configuration menu:

{{< highlight go "hl_lines=10-12">}}
...
if LIBVFSCORE_AUTOMOUNT_ROOTFS
        choice LIBVFSCORE_ROOTFS
        prompt "Default root filesystem"

                config LIBVFSCORE_ROOTFS_RAMFS
                bool "RamFS"
                select LIBRAMFS

                config LIBVFSCORE_ROOTFS_MYRAMFS
                bool "My-ramfs"
                select LIBMYRAMFS
...
{{< / highlight >}}

If we run now `make menuconfig` in the application `ramfs-app` we should see our library under the `vfscore configuration`:

![vfscore_config_myramfs](./images/vfscore_config_myramfs.png)

The second fundamental step is to add the following line to the same `Config.uk` file:
{{< highlight go "hl_lines=6">}}
 # Hidden configuration option that gets automatically filled
        # with the selected filesystem name
        config LIBVFSCORE_ROOTFS
        string
        default "ramfs" if LIBVFSCORE_ROOTFS_RAMFS
        default "myramfs" if LIBVFSCORE_ROOTFS_MYRAMFS
        default "9pfs" if LIBVFSCORE_ROOTFS_9PFS
        default "initrd" if LIBVFSCORE_ROOTFS_INITRD
        default LIBVFSCORE_ROOTFS_CUSTOM_ARG if LIBVFSCORE_ROOTFS_CUSTOM
{{< / highlight >}}

This will fill the `CONFIG_LIBVFSCORE_ROOTFS` with the string `myramfs`.

Now that we've done our setup, let's get started.
Follow TODOs 1-4 in myramfs_vnops.c and myramfs_vfsops.c.
Now, when you run `make menuconfig` in the app be sure you use the `myramfs`library and also check the debug library.
If everything is fine you should get a similar output:

![04_output](./images/04_output.png)

{{% alert title="Note" %}}
Try to rename the filesystem in the `vfscore_fs_type` structure. What happens? Look for the `fs_getfs` function.
{{% /alert %}}
