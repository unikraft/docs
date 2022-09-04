For the practical work we will need the following prerequisites:

* **gcc version >= 8** - installation guide [here](https://linuxize.com/post/how-to-install-gcc-compiler-on-ubuntu-18-04/)

* **the elfloader application** - this is the implementation of our loader which is build like a normal Unikraft application.
  You can clone the [ELF Loader repository](https://github.com/unikraft/app-elfloader/), on the `lyon-hackathon` branch.
  This cloned repo should go into the `apps` folder in your Unikraft directory structure.

* **lwip, zydis, libelf libs** - we have to clone all the repos coresponding to the previously mentioned libraries into the libs folder.
    * [forked lwip](https://github.com/razvand/lib-lwip), on the `lyon-hackathon` branch
    * [zydis](https://github.com/unikraft/lib-zydis)
    * [libelf](https://github.com/unikraft/lib-libelf)

* **unikraft** - the [forked Unikraft repository](https://github.com/razvand/unikraft-bincompat) must also be cloned and checked out on the `bin-compat` branch.

* **test scripts** - the [run-app-elfloader repository](https://github.com/unikraft/run-app-elfloader) with the scripts to run the resulting Unikraft image with binary applications
    * see the [README file](https://github.com/unikraft/run-app-elfloader/blob/master/README.md#run-app-elf-loader) for detailed information

* **test applications** - the [static-pie-apps repository](https://github.com/unikraft/static-pie-apps) stores pre-compiled `static-pie` ELF files

In the end you would have the following setup:

```
.
|-- apps/
|   |-- app-elfloader/     [lyon-hackathon]
|   |-- run-app-elfloader/
|   `-- static-pie-apps/
|-- libs/
|   |-- libelf/
|   |-- lwip/              [lyon-hackathon]
|   `-- zydis/
`-- unikraft/              [bincompat]
```
