To use GDB we need the symbols from the `gdb` file generated at build time.
For this we need to set `Debug information level` to `Level 3` from `make menuconfig` (`Build Options -> Debug information level -> Level 3`).

#### Linux

For the Linux user space target (`linuxu`), simply point GDB to the resulting debug image:

```bash
$ gdb path_to_unikraft_gdb_image
```

#### KVM

For KVM we need to go through few steps:

1. Run guest in paused state

   Using **qemu**:

   ```bash
   $ qemu-guest -P -g 1234 -k path_to_unikraft_gdb_image
   ```

   Using **kraft**:

   ```bash
   $ kraft run -d -g 1234 -P
   ```
1. Attach debugger

   ```bash
   $ gdb --eval-command="target remote :1234" path_to_unikraft_gdb_image
   ```

3. Disconnect GDB

   ```bash
   disconnect
   ```

4. Set GDB's machine architecture to x86_64

   ```bash
   $ set arch i386:x86-64:intel
   ```

5. Re-connect

   ```bash
   tar remote localhost:1234
   ```
