Create a new source file for your application and implement a function that sorts a given integer array, by calling `qsort()`, in turn, from different libc variants, and then prints that array.
For each library, check the size of the Unikraft image.
Enable **nolibc** and then, as a separate config / build, **newlibc**, both by using **make menuconfig** and modifying **kraft.yaml**.
You will have four different configurations and builds:

* nolibc + kraft
* nolibc + make
* newlibc + kraft
* newlibc + make
