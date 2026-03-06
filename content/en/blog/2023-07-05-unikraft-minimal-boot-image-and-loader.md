---
title: "Minimal Boot Image and Loader Proof of Concept for Unikraft"
date: "2023-07-05T12:00:00+01:00"
author: "Petre Dragos"
tags: ["Unikraft", "build system", "loader"]
---

## Minimal Boot Image
The main idea behind creating the minimal boot image was to see how small and fast the Unikraft unikernel can get (the application used for testing is [app-helloworld](https://github.com/unikraft/app-helloworld)), and, in the end, offer the user more control over how he can configure the unikernel. Furthermore, the results can be used as references for future development, such as the platform rearchitecture that is in works.

Work for this is split into two main parts:
* Minimizing the boot library
* Minimizing the platform components

### Minimizing the Boot Library
Unikraft offers a boot library, called `ukboot`, that acts as the bridge between the kernel and the application. We started with it as our main focus. We decided to create a new boot library, called `ukminboot`, which is a very stripped down version of the previous one, keeping only the required functionalities in order for the unikernel to successfully boot and run the application.

Working on this we've discovered that not even the libraries that were forcefully included with the original boot library, such as `ukargparse`, could  end up not being required in some cases, meaning we could offer them separately and not force them onto the users. Moreover, there was no option to have the image build without including the debugging library `ukdebug`. All of the above add to both the memory footprint and the boot time.

### Minimizing the Platform Components
_This work was done only for `KVM x86_64`._

When configuring the unikernel, we have almost no control over the platform part. We cannot choose what modules to be included in it, much of it being predefined. So the first step was to analyse the symbols of a compiled image and decide what we belive is a must have or not.

To not touch the code, we decided to create stubs to be used instead of the original files. This way, if we either build the minimal image or not, we won't have to choose different configurations except for the boot library.

This work is also important as it can be used during the platform rearchitecture. We already indentified what functionalities could be left at the choice of the user, so now what is left is to better separate them from the code and introduce them in `menuconfig`.

What we measured was the size of the unikernel and the time it takes it to boot. By boot time, we mean the time from the start of the execution until the call of the `main()` function which marks the entry in the application part. In our case, we count the number of CPU cycles and after that we compute the time (we read the `TSC` register at two different points and save the difference between them).

Results for app-helloworld (both images where optimized for size and had the `Drop all unused functions` option activated):
```text
Standard boot library:
    - size: 141 KiB
    - boot time: 0.24 sec

Minimal boot library:
    - size: 51 KiB
    - boot time: 0.12 sec
```

These results show a 64% decrease in size and a 50% decrese in boot time, which is a great result as it shows that there is space for improvement, especially on the platform part.

## Loader Proof of Concept
The loader's main functionality is to apply `ASLR` (Address-Space Layout Randomization) on the unikernel, thus increasing its security. At this moment, Unikraft offers only page protections in terms of security, meaning that different memory pages have different permissions assigned to them (`R` - read, `W` - write, `X` - execute). This assures that an attacker cannot perform different operations than those enabled on that respactive page, such as writing or executing on a page marked only as `R`.

`ASLR` is a technique used to improve the security of an executable by randomizing the memory address at which the memory segments are loaded, making attacks such as `buffer overflow` a lot harder to achieve, as they are based on knowing the layout of the executable.

Another reason for which we decided to create a loader was to split the loading porcess in two, loading first the kernel, and after that the application. This will offer us more flexibility by having access at any of the two stages, and more than that, this will offer us the possibility to package the kernel.

For the loader, we created a proof of concept by using two unikraft images, the first one loading the second. This is just for the proof of concept, as in the future we intend to use only one image.

The random value used for ASLR is generated based on the Time-Stamp Counter (TSC):
```c
// rdtsc() reads the value of the TSC.
// TSC is on 64 bits, we extract the lower 32 bits.
// We can limit the random value, to keep it in a range
__u32 random_value;
random_value = (__u32)(rdtsc() & 0xffffffff) % limit;
// The value needs to be page aligned
random_value = ALIGN_UP(random_value, PAGE_SIZE);
```

After that, we allocate a memory region where to map the second image, will be the new base address of the second image:
```c
// We will allocate a memory region `count` times bigger
// than the image size to have enough space for ASLR
__vaddr_t new_baddr;
new_baddr = (__vaddr_t)ukplat_memregion_alloc(
							(__sz)(count * (image_size + random_value)),
							UKPLAT_MEMRT_KERNEL,
	    					UKPLAT_MEMRF_MAP);
```

The second image will be passed as an `initrd` argument to QEMU:
```bash
qemu-system-x86_64 -kernel first_image -initrd second_image -nographic
```
To acces it, we use `ukplat_memregion_find_initrd0()` and once we have it, we start parsing it and load it into memory at random addresses (ASLR):
```c
Elf32_Ehdr *ehdr;
Elf32_Phdr *current_phdr;

// Cast to an ELF header structure
ehdr = initrd->pbase;

// Iterate through the ELF Program Headers
int i = 0;
while (i < ehdr->e_phnum) {
    if (i == 0)
        current_phdr = (Elf32_Phdr *)((unsigned long)ehdr + ehdr->e_phoff);
    else
        current_phdr = (Elf32_Phdr *)((unsigned long)current_phdr + sizeof(Elf32_Phdr));

    // Load each segment into memory
    memcpy(addr, current_phdr->p_vaddr, current_phdr->p_memsz);
    addr += current_phdr->p_memsz + random_value;

    i++;
}
```
Once the second image is loaded, we have to pass the control to it to continue the execution. The function we jump to is `_ukplat_entry2`.
```c
// The function is at an offset X before, so after ASLR
// it will be at new_baddr + X + random_value
lcpu_arch_jump_to(bstack, (_ukplat_entry2 - old_baddr) + new_baddr + random_value);
```
Unfortunately, the last step is not working, so we do not pass the control to the newly loaded image.

As for ASLR, we successfully load the memory segments at different addresses each time we run:
```text
First run:
    [libkvmplat] ==============================
    [libkvmplat] 	Program Header 0x1
    [libkvmplat] ==============================
    [libkvmplat] current_phdr->p_vaddr = 0x100000
    [libkvmplat] current_phdr->p_memsz = 0x113d4
    [libkvmplat] mapped at address = 0x25d000

Second run:
    [libkvmplat] ==============================
    [libkvmplat] 	Program Header 0x1
    [libkvmplat] ==============================
    [libkvmplat] current_phdr->p_vaddr = 0x100000
    [libkvmplat] current_phdr->p_memsz = 0x113d4
    [libkvmplat] mapped at address = 0x1cf000
```

## What's next?
The first step in the future is to fix the jump and to correclty pass the control to the second image. After that, the main focus will be to scrap using two images and use only one instead.
