For the practical work we will need the following prerequisites:

* **gcc version >= 8** - installation guide [here](https://linuxize.com/post/how-to-install-gcc-compiler-on-ubuntu-18-04/).

* **the elfloader application** - this is the implementation of our loader which is build like a normal Unikraft application.
  You can clone the [ELF Loader repository](https://github.com/skuenzer/app-elfloader/), on the `usoc21` branch.
  This cloned repo should go into the `apps` folder in your Unikraft directory structure.

* **the configuration file** - you can find the `config` files in the `demo/01` and `demo/03` folder of this session.

* **lwip, zydis, libelf libs** - we have to clone all the repos corresponding to the previously mentioned libraries into the `libs` folder.
  All of them have to be on the `staging` branch.
    * [lwip](https://github.com/unikraft/lwip.git)
    * [zydis](https://github.com/unikraft/lib-zydis.git)
    * [libelf](https://github.com/unikraft/lib-libelf.git)

* **unikraft** - the [Unikraft repository](https://github.com/unikraft/unikraft) must also be cloned and checked out on the `usoc21` branch.

Set the repositories in a directory of your choosing.
We'll call this directory `<WORKDIR>`.
The final directory structure for this session should look like this:

```
workdir/
`-- apps/
|   `-- app-elfloader/ [usoc21]
`-- libs/
|   |-- lwip/ [staging]
|   |-- libelf/ [staging]
|   `-- zydis/ [staging]
`-- unikraft/ [usoc21]
```
