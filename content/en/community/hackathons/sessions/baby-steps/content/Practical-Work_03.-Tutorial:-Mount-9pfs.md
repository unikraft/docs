In this tutorial, we will see what we would need to do if we wanted to have a filesystem available.
To make it easy, we will use the `9pfs` filesystem, as well as the `newlib` library.
The latter is used so that we have available an API that would enable us to interact with this filesystem (functions such as `lseek`, `open`).

**Note**: the build will fail if `unikraft` and `newlib` repositories aren't both on the `staging` or the `stable` branches.
To avoid this situation, go to `~/.unikraft/unikraft` and checkout branch `staging`:
```
cd ~/.unikraft/unikraft
git checkout staging
```

We will need to download `newlib`:
```
git clone https://github.com/unikraft/lib-newlib.git ~/.unikraft/libs/newlib
```

Next, we include it in our `Makefile`:
```
LIBS := $(UK_LIBS)/lwip:$(UK_LIBS)/newlib
```

And now, for the final step, through `make menuconfig` make sure you have selected `libnewlib` as well as `9pfs: 9p filesystem` inside the `Library Configuration` menu.
We will also check these options inside `Library Configuration` -> `vfscore: Configuration`:

![fs selection menu](/docs/sessions/01-baby-steps/images/menuconfig_select_fs.png)

![fs2 selection menu](/docs/sessions/01-baby-steps/images/menuconfig_select_fs2.png)

![fs3 selection menu](/docs/sessions/01-baby-steps/images/menuconfig_select_fs3.png)

What is more, you should also have present in the current directory an additional directory called `fs0`:
```
mkdir fs0
```
And so, `fs0` will contain whatever files you create, read from or write to from within your unikernel.

For now, just make sure it successfully builds. If it does, move on to the next work item.
