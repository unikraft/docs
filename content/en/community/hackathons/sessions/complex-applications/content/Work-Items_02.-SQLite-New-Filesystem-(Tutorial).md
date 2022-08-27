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
