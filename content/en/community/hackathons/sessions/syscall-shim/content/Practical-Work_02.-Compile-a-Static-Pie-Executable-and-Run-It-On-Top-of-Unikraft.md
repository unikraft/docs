The next step is to get an executable with the correct format.
We require a static executable that is also PIE (*Position-Independent Executable*).

We go to the `apps/app-elfloader/example/helloworld` directory.
We can see that the directory has a `helloworld.c` (a simple helloworld program) and a `Makefile`.
The program will be compiled as a static PIE:

```Makefile
RM = rm -f
CC = gcc
CFLAGS += -O2 -g -fpie # fpie generates position independet code in the object file
LDFLAGS += -static-pie # static-pie makes the final linking generate a static and a pie executable
LDLIBS +=

all: helloworld

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

%: %.o
	$(CC) $(LDFLAGS) $^ $(LDLIBS) -o $@

helloworld: helloworld.o

clean:
	$(RM) *.o *~ core helloworld
```

We can now run `make` so we can get the `helloworld` executable:

```
.../<WORKDIR>/apps/app-elfloader/example/helloworld$ make
gcc -O2 -g -fpie -c helloworld.c -o helloworld.o
gcc -static-pie helloworld.o  -o helloworld

.../<WORKDIR>/apps/app-elfloader/example/helloworld$ ldd helloworld
	statically linked

.../<WORKDIR>/apps/app-elfloader/example/helloworld$ checksec helloworld
[*] '/home/daniel/Faculty/BachelorThesis/apps/app-elfloader/example/helloworld/helloworld'
    Arch:     amd64-64-little
    RELRO:    Full RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled
```

We can see above from the `ldd` and `checksec` output that the `helloworld` executable is a static PIE.

Now, the last part is to pass this executable to our unikernel.
We can use the `-i` option to pass the initial ramdisk to the virtual machine.

```
.../<WORKDIR>/apps/app-elfloader$ qemu-guest -k build/elfloader_kvm-x86_64 -i example/helloworld/helloworld

SeaBIOS (version 1.10.2-1ubuntu1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Tethys 0.5.0~825b1150
Hello world!
```

We can see that the binary is successfully loaded and executed.
