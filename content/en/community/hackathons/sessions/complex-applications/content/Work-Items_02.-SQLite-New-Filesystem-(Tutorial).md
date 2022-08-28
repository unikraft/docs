In the previous work item, we have chosen to use 9PFS as the filesystem.
For this work item, we want to change the filesystem to InitRD and load the SQLlite script as we have done in the previous work item.
Find the support files in the `work/02-change-filesystem-sqlite/` folder of the session directory. Make sure to create the `Makefile` and `Makefile.uk` files in a similar manner as with the previous work item before proceeding in configuring the application.

First, we need to change the filesystem to InitRD.
We can obtain that by using the command `make menuconfig` and from the `vfscore: Configuration` option, we select the default root filesystem as `InitRD`.

![filesystems menu](/community/hackathons/sessions/complex-applications/images/filesystems.png)

The InitRD filesystem can load only [cpio archives](https://www.ibm.com/docs/en/zos/2.2.0?topic=formats-cpio-format-cpio-archives). In order to load our SQLite script into InitRD, we need to create a cpio out of it.
This can be achieved in the following way:

Create a folder, move the SQLite script in it, and `cd `in it.

After that we run the following command:

```bash
$ find -type f | bsdcpio -o --format newc > ../archive.cpio
```

We'll obtain a cpio archive called `archive.cpio` in the parent directory.

Next, we run the following `qemu-guest` command to run the instance:

```bash
$ ./qemu-guest -k build/app-sqlite_kvm-x86_64 -m 100 -i archive.cpio
```

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
-2854471077348014330|8890688652355553061
6848326607576863720|8057668357382476232
-4851485256049611772|1080284340194216118
3617801119133923790|-3742008368926465716
-8000990739986823138|603753214333179605
-1492560099439825568|-8062818652230049204
8818728981714743313|-1714591670076544373
-1304043959596685652|557566099797623154
-9196798118140052834|3433881783117867716
-4291436294037928857|6810153594571143752
sqlite> .exit
```
