For Unikraft to achieve binary compatibility there are two main objectives that need to be met:

1. The ability to pass the binary to Unikraft.
1. The ability to load the binary into memory and jump to its entry point.

For the first point we decided to use the initial ramdisk in order to pass the binary to the unikernel.
With `qemu-guest`, in order to pass an initial ramdisk to a virtual machine you have to use the `-initrd` option.
As an example, if we have a `helloworld` binary, we can pass it to the unikernel with the following command:

```
sudo qemu-guest -kernel build/unikernel_image -initrd helloworld_binary
```

After the unikernel gets the binary the next step is to load it into memory.
The dominant format for executables is the *Executable and Linkable File* format (ELF), so, in order to run executables we need an ELF loader.
The job of the ELF Loader is to load the executable into the main memory.
It does so by reading the program headers located in the ELF formatted executable and acting accordingly.
For example, you can see the program headers of a program by running `readelf -l binary`:

```
$ readelf -l helloworld_binary

Elf file type is DYN (Shared object file)
Entry point 0x8940
There are 8 program headers, starting at offset 64

Program Headers:
  Type           Offset             VirtAddr           PhysAddr
                 FileSiz            MemSiz              Flags  Align
  LOAD           0x0000000000000000 0x0000000000000000 0x0000000000000000
                 0x00000000000c013e 0x00000000000c013e  R E    0x200000
  LOAD           0x00000000000c0e40 0x00000000002c0e40 0x00000000002c0e40
                 0x00000000000053b8 0x0000000000006aa0  RW     0x200000
  DYNAMIC        0x00000000000c3c18 0x00000000002c3c18 0x00000000002c3c18
                 0x00000000000001b0 0x00000000000001b0  RW     0x8
  NOTE           0x0000000000000200 0x0000000000000200 0x0000000000000200
                 0x0000000000000044 0x0000000000000044  R      0x4
  TLS            0x00000000000c0e40 0x00000000002c0e40 0x00000000002c0e40
                 0x0000000000000020 0x0000000000000060  R      0x8
  GNU_EH_FRAME   0x00000000000b3d00 0x00000000000b3d00 0x00000000000b3d00
                 0x0000000000001afc 0x0000000000001afc  R      0x4
  GNU_STACK      0x0000000000000000 0x0000000000000000 0x0000000000000000
                 0x0000000000000000 0x0000000000000000  RW     0x10
  GNU_RELRO      0x00000000000c0e40 0x00000000002c0e40 0x00000000002c0e40
                 0x00000000000031c0 0x00000000000031c0  R      0x1

 Section to Segment mapping:
  Segment Sections...
   00     .note.ABI-tag .note.gnu.build-id .gnu.hash .dynsym .dynstr .rela.dyn .rela.plt .init .plt .plt.got .text __libc_freeres_fn __libc_thread_freeres_fn .fini .rodata .stapsdt.base .eh_frame_hdr .eh_frame .gcc_except_table
   01     .tdata .init_array .fini_array .data.rel.ro .dynamic .got .data __libc_subfreeres __libc_IO_vtables __libc_atexit __libc_thread_subfreeres .bss __libc_freeres_ptrs
   02     .dynamic
   03     .note.ABI-tag .note.gnu.build-id
   04     .tdata .tbss
   05     .eh_frame_hdr
   06
   07     .tdata .init_array .fini_array .data.rel.ro .dynamic .got
```

As an overview of the whole process, when we want to run an application on Unikraft using binary compatibility, the first step is to pass the application to the unikernel as an initial ram disk.
Once the unikernel gets the application, the loader reads the executable segments and loads them accordingly.
After the program is loaded, the last step is to jump to its entry point and start executing.

The loader that we currently have implemented in Unikraft only supports executables that are static (so all the libraries are part of the executables) and also position-independent.
A position independent binary is a binary that can run correctly independent of the address at which it was loaded.
So we need executables that are built using the `-static-pie` compiler / linker option, available in GCC since version 8.
