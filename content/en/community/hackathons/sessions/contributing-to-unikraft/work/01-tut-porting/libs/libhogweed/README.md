Libhogweed for Unikraft
=============================

This is the port of nettle's libhogweed for Unikraft as external library.

Libhogweed depends on newlib, so please make sure you add the following
line to the `LIBS` variable in your `Makefile`:
	`...:$(UK_LIBS)/newlib:$(UK_LIBS)/libhogweed:...`

Testing
-------

For running the tests: enable the `testsuite` option in the configuration menu
and select the desired tests. Make sure to include `testutils_glue.h` and call 
the `run_all_libhogweed_tests(v);` function in your main application. The parameter
`v` stands for verbose and you can either set it to `0`, non verbose mode, or `1`,
verbose mode.

Applications
------------

To run an application that requires a filesystem, you'll need to run them on
`kvm` and enable `9pfs`, selecting the following menu options, all of them under
`Library Configuration`:
- `libnewlib`
- `libhogweed`
- `vfscore: VFS Core Interface` ---> `vfscore: Configuration` ---> 
 `Automatically mount a root filesystem` ---> `Default root filesystem`
  ---> `9PFS`
- `uk9p: 9p client`
- `9pfs: 9p filesystem`
- `devfs: devfs file system ---> Mount /dev during boot`
- `ukswrand: Software random number generator ---> Register random and
 urandom device to devfs`

Mounting a file system
---------------------
In order to mount the file system you'll need to provide the following Qemu
parameters:
- `-fsdev local,id=myid,path=<some directory>,security_model=none`
- `-device virtio-9p-pci,fsdev=myid,mount_tag=rootfs,disable-modern=on,
  disable-legacy=off`

Note that if you use a different `mount_tag`, you'll need to add it in `Default
root device` in `vfscore configuration`. Also, to provide command line 
arguments to the kernel, you'll need to use `-append "param1 param2 ..."`.
	
Please refer to the `README.md` as well as the documentation in the `doc/`
subdirectory of the main unikraft repository.
