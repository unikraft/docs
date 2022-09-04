A system call is the programmatic way in which a process requests a privileged service from the kernel of the operating system.

A system call is not a function, but specific assembly instructions that do the following:

* setup information to identify the system call and its parameters
* trigger a kernel mode switch
* retrieve the result of a system call

In Linux, system calls are identified by a system call ID (a number) and the parameters for system calls are machine word sized (32 or 64 bit).
There can be a maximum of 6 system call parameters.
Both the system call number and the parameters are stored in certain registers.

For example, on 32bit x86 architecture, the system call identifier is stored in the `EAX` register, while parameters in registers `EBX`, `ECX`, `EDX`, `ESI`, `EDI`, `EBP`.

Usually an application does not make a system call directly, but call functions in the system libraries (e.g. libc) that implement the actual system call.

Let's take an example that you can see in the below image:

1. Application program makes a system call by invoking a wrapper function in the C library.
1. Each system call has a unique call number which is used by kernel to identify which system call is invoked.
   The wrapper function again copies the system call number into specific CPU registers.
1. The wrapper function takes care of copying the arguments to the correct registers.
1. Now the wrapper function executes trap instruction (`int 0x80` or `syscall` or `sysenter`).
   This instruction causes the processor to switch from *user mode* to *kernel mode*.
1. We reach a trap handler, that will call the correct kernel function based on the id we passed.
1. The system call service routine is called.

![system_call_image](https://qph.fs.quoracdn.net/main-qimg-0cb5c3a6e1fd7642ac988badc7598c0c)

Now, let's take a quick look at unikernels.
As stated above, in Linux, we use system calls to talk to the operating system, but there is a slight problem.
The system calling process adds some overhead to our application, because we have to do all the extra operations to switch from *user space* to *kernel space*.
In unikernels, because we don't have a delimitation between *kernel space* and *user space* we do not need system calls so everything can be done as simple function calls.
This is both good and bad.
It is good because we do not get the overhead that Linux does when doing a system call.
At the same time it is bad because we need to find a way to support applications that are compiled on Linux, so application that do system calls, even though we don't need them.
