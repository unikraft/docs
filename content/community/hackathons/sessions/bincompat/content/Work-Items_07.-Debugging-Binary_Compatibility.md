Try using the `extract.sh` script to run `/usr/bin/free` on top on Unikraft.
Follow the steps we did before, for `/usr/bin/ls` and try running the application using the `run.sh` script.
You will find that the application will give an error, similar to this:

```text
Error: /proc must be mounted
  To mount /proc at boot you need an /etc/fstab line like:
      proc   /proc   proc    defaults
  In the meantime, run "mount proc /proc -t proc"
```

Run `strace free` on your machine, see what files is the `free` command looking for, and add them in your filesystem.
