Using `do.sh run` we ran the prebuilt images from [the `run-app-elfloader` repository](https://github.com/unikraft/run-app-elfloader).
Let's now also build `app-elfloader`.

Run the following commands:

```console
$ ./do.sh clean

$ ./do.sh setup

$ ./do.sh build

$ ./do.sh run_built ...
```

In the last command, replace `...` with the name of the application you need to run.

If you want to remove all the pesky debugging information, use `setup_plain`, such as the commands below:

```console
$ ./do.sh clean

$ ./do.sh setup_plain

$ ./do.sh build

$ ./do.sh run_built ...
```

If, on the other side, you want to have more debugging information, use `setup_debug`, such as the commands below:

```console
$ ./do.sh clean

$ ./do.sh setup_debug

$ ./do.sh build

$ ./do.sh run_built ...
```
