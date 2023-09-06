Using `./run*.sh`, we used the pre-built `app-elfloader` images from [the `run-app-elfloader` repository](https://github.com/unikraft/run-app-elfloader).
Let's now also build `app-elfloader`.
Building our custom `app-elfloader` image will be useful in case we added some changes inside Unikraft, and we want to use an `elfloader` image with those changes applied.

In order to build our own `elfloader` image, follow the instructions in the [`app-elfloader` README file](https://github.com/unikraft/app-elfloader#readme), up to the building section.
The build will result in an `elfloader_qemu-x86_64` kernel image.
Ignore the running instructions, we will do that by using the [`run.sh`](https://github.com/unikraft/run-app-elfloader/blob/master/run.sh) helper script.
The `run.sh` script can use a custom `elfloader` image with the `-k` option.

We will run the dynamic versions of `c++/helloworld`, the one in [the `dynamic-apps` repository](https://github.com/unikraft/dynamic-apps).
We will use the `-r` option to pass the root filesystem to the `run.sh` script:

```console
cd run-app-elfloader/

./run.sh -k ../app-elfloader/build/elfloader_qemu-x86_64 -r ../dynamic-apps/lang/c++/ /helloworld
```

This will use our `app-elfloader` image to run the C++ `helloworld` application.

```text
SeaBIOS (version rel-1.16.2-0-gea1b7a073390-prebuilt.qemu.org)
Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Atlas 0.13.1~21ce1acf
Hello World!
```

Let's do the same for the `sqlite3` dynamically linked application:

```console
./run.sh -k ../app-elfloader/build/elfloader_qemu-x86_64 -r ../dynamic-apps/sqlite3/ "/usr/bin/sqlite3"
```

This will give us the `sqlite3` CLI prompt:

```text
SeaBIOS (version rel-1.16.2-0-gea1b7a073390-prebuilt.qemu.org)
Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Atlas 0.13.1~21ce1acf
-- warning: cannot find home directory; cannot read ~/.sqliterc
SQLite version 3.22.0 2018-01-22 18:45:57
Enter ".help" for usage hints.
Connected to a transient in-memory database.
Use ".open FILENAME" to reopen on a persistent database.
sqlite> .exit
```

Similar to what you did before, run as many applications from the `dynamic-apps` repository using the `elfloader` image you have built and the `run.sh` script.
