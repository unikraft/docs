For the practical work we will need the following prerequisites:

* **gcc version >= 8** - installation guide [here](https://linuxize.com/post/how-to-install-gcc-compiler-on-ubuntu-18-04/)

* **the elfloader application** - this is the implementation of our loader which is build like a normal Unikraft application.
  You can clone the [ELF Loader repository](https://github.com/unikraft/app-elfloader/).
  This cloned repo should go into the `apps` folder in your Unikraft directory structure.

* **lwip, zydis, libelf libs** - we have to clone all the repos coresponding to the previously mentioned libraries into the libs folder.
    * [lwip](https://github.com/unikraft/lib-lwip)
    * [zydis](https://github.com/unikraft/lib-zydis)
    * [libelf](https://github.com/unikraft/lib-libelf)

* **unikraft** - the [Unikraft core repository](https://github.com/unikraft/unikraft) must also be cloned.

* **test scripts** - the [run-app-elfloader repository](https://github.com/unikraft/run-app-elfloader) with the scripts to run the resulting Unikraft image with binary applications
    * see the [README file](https://github.com/unikraft/run-app-elfloader/blob/master/README.md#run-app-elf-loader) for detailed information

* **test applications** - the [static-pie-apps repository](https://github.com/unikraft/static-pie-apps) stores pre-compiled `static-pie` ELF files

In the end you would have the following setup:

```console
.
|-- apps/
|   |-- app-elfloader/
|   |-- run-app-elfloader/
|   `-- static-pie-apps/
|-- libs/
|   |-- libelf/
|   |-- lwip/
|   `-- zydis/
`-- unikraft/
```
