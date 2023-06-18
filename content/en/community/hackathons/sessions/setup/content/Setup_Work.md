Go through all the applications available in [the repository](https://github.com/unikraft-upb/scripts/tree/main/make-based), build and run them, using the same commands we used before.
For every application, we can follow the steps below:

```console
$ cd scripts/
$ cd make-based/app-name/
$ ./do.sh setup # <- Clone everything in `../../workdir/`
$ ./do.sh build # <- Build the application
$ ./do.sh run   # <- Run the application
```
