Let's see what happens behind the scenes.
Enter the `run-app-elfloader/` directory:

```console
.../scripts/make-based/app-elfloader$ cd ../../workdir/apps/run-app-elfloader/

.../workdir/apps/run-app-elfloader$ ls
app-elfloader_kvm-x86_64*             app-elfloader_kvm-x86_64_full-debug.dbg*  debug.sh*  out/       rootfs/      run.sh*
app-elfloader_kvm-x86_64_full-debug*  app-elfloader_kvm-x86_64_plain*           defaults   README.md  run_app.sh*  utils/
```

Follow the instructions in [the `README.md` file](https://github.com/unikraft/run-app-elfloader/blob/master/README.md) to run as many applications as possible directly.
That means through the use of the `run_app.sh` and `run.sh` scripts.
