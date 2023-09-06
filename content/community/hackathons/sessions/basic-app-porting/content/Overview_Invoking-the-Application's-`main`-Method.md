Traditionally, and by explicit design, Linux user space code invokes a `main` method (or symbol) for the start-of-execution of application logic.
Unikraft is similar and invokes a [`weak`-ly attributed symbol](https://gcc.gnu.org/onlinedocs/gcc-4.3.5/gcc/Function-Attributes.html) for `main` in [its main thread](https://github.com/unikraft/unikraft/blob/staging/lib/ukboot/boot.c#L75).
This is done so that it can be easily overwritten so as to invoke true application-level functionality.
Without any `main` method, the unikernel will simply boot and exit.

All applications must implement the following standard prototype for `main`:

```c
/* Definition 1 */
int main(__((attribute unused))__ int argc, __((attribute unused))__ char *argv[]);
/* Definition 2 */
int main(int argc, char *argv[]);
/* Definition 3 */
int main(void);
```

1. The first definition simply indicates that the parameters may be unused within the function body, i.e. no command-line arguments _may_ be passed as the application makes no use of them
1. The second is probably more familiar, with explicit use of command-line arguments
1. Lastly, the third definition explicitly forgoes the use command-line arguments

There are two ways to invoke the functionality of the application being ported to Unikraft.

#### Do nothing and let `main` be invoked automatically

If the application has a relatively simple `main` method with one of the prototypes defined above, we could simply leave it and it will be automatically invoked since it represents the only symbol named `main` in the final binary.
This requires the file to be recognized and compiled, however, which is done by simply adding the file with the `main` method to the Unikraft port of the library's `Makefile.uk` as a new `_SRC-y` entry.

For `iperf3`, this is done by compiling in `main.c` which contains the `main` method:

```Makefile
LIBIPERF3_SRCS-y += $(LIBIPERF3_SRC)/main.c
```


#### Manually Invoking `main` with Glue Code

To increase extensibility or adapt the application to the context of a unikernel, we can perform a small trick to conditionally invoke the `main` method of the application as a compile-time option.
This is useful in different cases, for instance:

* In some cases where the `main` method for the application may be relatively complex and includes boilerplate code which is not applicable to the use case of a unikernel, it is possible to invoke the relevant application-level functionality by calling another method within the application's source code (this is true in the case of, for example, the [Unikraft port of Python3](https://github.com/unikraft/lib-python3/blob/staging/main.c)).

* In other cases, we may wish to perform additional initialization before the invocation of the application's `main` method (this is true in the case of, for example, the [Unikraft port of Redis](https://github.com/unikraft/lib-redis/blob/staging/main.c)).

* We wish to use the application as a library in the future for another application and call APIs which it may expose.
  In this case, we do not wish to invoke the `main` method as it will conflict with the other application's `main` method.

In any case, we can rename the default `main` symbol in the application by using the `gcc` flag [`-D`](https://www.rapidtables.com/code/linux/gcc/gcc-d.html) during the pre-processing of the file which contains the method.  This flag allows us to define macros in-line, and we can simply introduce a macro which renames the `main` method to something else.

With `iperf3`, for example, we can rename the `main` method to `iperf3_main` by adding a new library-specific `_FLAGS-y` entry in `Makefile.uk`:

```Makefile
LIBIPERF3_IPERF3_FLAGS-y += -Dmain=iperf3_main
```

The resulting object file for `main.c` will no longer include a symbol named `main`.
At this point, when the final unikernel binary is linked, it will simply quit.  We must now provide another `main` method.

To conditionally invoke the application's now renamed `main` method, it is common to provide a new `KConfig` in the Unikraft library representing the port of the application's `Config.uk` file, asking whether to `provide the main method`.
For example, with `iperf3`:

```KConfig
if LIBIPERF3
config LIBIPERF3_MAIN_FUNCTION
	bool "Provide main function"
	default n
endif
```

When this option is enabled, we can either:


1. Disable the use of the `-D` flag as indicated above, conditionally in the `Makefile.uk`:

   ```Makefile
   ifneq($(CONFIG_LIBIPERF3_MAIN_FUNCTION),y)
   LIBIPERF3_IPERF3_FLAGS-y += -Dmain=iperf3_main
   endif
   ```

1. Or more commonly, introduce a conditional file which provides `main` and invokes the renamed `main` (now `iperf3_main`) method from the library, for example:

   ```Makefile
   LIBIPERF3_SRCS-$(CONFIG_LIBIPERF3_MAIN_FUNCTION) += $(LIBIPERF3_BASE)/main.c|unikraft
   ```

   Notice how the filename includes the suffix `|unikraft`.
   This is used to simply rename the resulting object file, which will become `main.unikraft.io`.

   The new `main.c` file as part of the library simply calls the renamed method:

   ```c
   int main(int argc, char *argv[])
   {
      return iperf3_main(argc, argv);
   }
   ```
