In this task we will add a new section in the elf and we will define a series of macros.

Navigate to the `01-extrald` directory.
Copy `mycorelibrary` to the `lib` directory in `unikraft` and the two applications in the `apps` directory.
Your working directory should look like this:

```
workdir
|_______apps
|       |_______01-app
|       |_______02-app
|_______libs
|_______unikraft
        |_______lib
                |_______mycorelib
                |_______Makefile.uk
```

Edit the `Makefile.uk` from the `lib` directory and add the following:

```
$(eval $(call _import_lib,$(CONFIG_UK_BASE)/lib/mycorelib))
```

Follow the TODOs from the sources and headers.
After solving all the TODOs compile both applications and run them.
Don't forget to `make menuconfig` to select `mycorelib` and the KVM platform.
