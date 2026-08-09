+++
title = "Unikraft EFI Stub"
date = "2023-07-05T13:00:00+01:00"
author = "Sergiu Moga"
tags = ["Unikraft", "UEFI", "bootloader", "x86_64", "Aarch64"]
+++

# Unikraft UEFI Stub
Unikraft in its current state is not able to fully boot and function on a modern, UEFI based, system. However, the recent introduction of [`uk_bootinfo`](https://unikraft.org/blog/2023-02-07-unikraft-releases-epimetheus/#boot-code-refactoring), authored by Marc Rittinghaus, opened the door to easier integration of other booting environments in a generic manner. Through this new mechanism, support for a new boot protocol would imply simply filling in this structure accordingly before passing control to a generic, common, Unikraft entry point. Furthermore, the extension of the interface with the [memory regions](https://unikraft.org/blog/2023-02-07-unikraft-releases-epimetheus/#memory-regions) and its integration into the early Multiboot1 code created a proper, generic, model for how this `.uk_bootinfo`'s most critical component, the list of memory region descriptors, is meant to be set up.

UEFI is a large, complex specification that is meant to abstract away the environment in which the application it loads operates through the help of a solid generic driver model and a set of well defined API's. At this moment in time, Unikraft only supports Multiboot1 on x86, which ends up drastically slowing down the boot process as the need for a Multiboot compliant bootloader is implied. Furthermore, Multiboot is not adapted to today's modern systems that rely on UEFI and ACPI interfaces as it does not give access to such structures directly.

This blog post presents what it took to implement Unikraft's UEFI stub to enable `Unikraft` to boot without a bootloader on `x86_64` and `Aarch64` `UEFI` systems.

## The journey
### Laying the foundation
UEFI is not to be toyed with and has the requirement that what it loads is relocatable. Therefore, even though a set of very well designed boot related structures has been recently integrated, there was one more important thing to solve to solidify the base towards a position independent boot infrastructure across all available architectures and platforms: PIE support. If the address at which the `UEFI` image wants to be loaded at is marked as reserved by `UEFI`, then the firmware will try to load it at the next available memory region big enough to fit the image. Therefore, we need to be able to operate in a position independent manner.

This was no easy task due to some inconveniences, as it was not enough to just build as PIE by adding some compilation/linking flags:
- On x86, Unikraft used many references to absolute symbols in its 16-bit and 32-bit early assembly code which would generate relocations incompatible with a 64-bit statically linked PIE
- Lack of a relocator
- Position dependent memory region setup on x86 and lack of its integration on AArch64


#### PIE Support
First things first, we had to ensure that we could at least build Unikraft as a statically linked PIE (`-fPIE` + `-static-pie`). This already worked on AArch64, however, as previously mentioned, this did not work for x86 because of the 16-bit and 32-bit absolute references to symbols that we needed and that would generate incompatible relocations. AArch64 did not have this issue because it would already boot in 64-bit mode and it already had available a set of position independent instructions such as `adr` or `adrp`. This also applies to x86, however in its 64-bit Long Mode only, as that would allow one to use `RIP` relative addressing, which is not available in Real Mode or Protected Mode. Therefore we needed to find a solution to get rid of these incompatible relocations, while still being able to keep that very early code working. One way we could have solved this would have been by simply embedding this code in its own section as a raw binary that would not generate relocations and would only be used for the Application Processors to boot at a fixed location. However, with this we would not be able to keep the ability of booting through Multiboot and it would not give us the flexiblity in the future that may allow us to create our own type of relocations to help us define per-boot-stage relocations as well as relocations that we want to be resolved against different base addresses.

This is how `libukreloc` was born. We defined a new custom, architecture independent, relocation related structure [`struct uk_reloc`](https://github.com/unikraft/unikraft/blob/staging/lib/ukreloc/include/uk/reloc.h#L136) that is meant to hold the offset in memory where the relocation is to be applied, the offset of the value from the original symbol value computed by the linker through the linker script’s base reference address, the size of the relocation and a flags field respectively (for now we only have the UKRELOC\_FLAGS\_PHYS\_REL flag meant to indicate whether the relocation is to be applied based on a physical address or a virtual address, which comes in handy in bootstrap code) which will help us achieve the previously mentioned flexiblity. This is very similar to what your regular `.rela.dyn` entry would look like.

We achieve this with the help of [`mkukreloc.py`](https://github.com/unikraft/unikraft/commit/e572ef1575d2927c18bf9e309c2c9946eb076b17#diff-1b6f1a9686178d25fb2b6e0f9ce8a803518660fed6a76c425c53a78df8e44acfR229), a script that builds a binary blob that is made of a signature (`UKRELOC_SIGNATURE`), `struct uk_reloc` entries appended to each other and ends with a zeroed out `struct uk_reloc` to act as a sentinel. This binary blob will be placed in the binary through the `.uk_reloc` ELF section, updated through `objcopy` and its C-code definition is [`struct uk_reloc_hdr`](https://github.com/unikraft/unikraft/commit/e572ef1575d2927c18bf9e309c2c9946eb076b17#diff-87e3fa07a530237b7c8acde4e00f34331d2bf6821e5c3b4afc1de3a207bca99aR117).

The binary blob is obtained by parsing all of the `.rela.dyn` entries, converting them into `struct uk_reloc` entries and by searching through the debug image's symbols for `_uk_reloc_` symbols created with the help of the helper assembly macros:
- [`ur_data`](https://github.com/unikraft/unikraft/commit/e572ef1575d2927c18bf9e309c2c9946eb076b17#diff-87e3fa07a530237b7c8acde4e00f34331d2bf6821e5c3b4afc1de3a207bca99aR81) replaces the references to absolute symbol values with position independent equivalents that, instead of referencing this very symbol, it places a placeholder value (`UKRELOC_PLACEHOLDER`) and generates a unique symbol to be parsed by the script to build a uk_reloc entry based on the GAS directive and relocation size passed as arguments
- [`ur_pte`](https://github.com/unikraft/unikraft/commit/7f6d22ba43f1921c44d5f2d405c4fc12a5cf1dbb) is a specialized `ur_data` meant for PTE's and therefore it makes use of the already existing `ur_data` macro to make the script create the usual `struct uk_reloc`. However a small modification to the script makes it do an additional lookup for corresponding `pte_attr` symbols that `ur_pte` creates, so that it knows to also add the page table entry attributes to the final value that the self relocator uses to properly resolve a relocation
- [`ur_mov`](https://github.com/unikraft/unikraft/commit/7ef7b5574618bbeb08c0a59ed6011cb72549c7fd#diff-a10b6b71c0a9e95390a8c19400cb711fcf31440f78ccec3c25f4fe6ff4448d58R37) used to cope with the references to absolute symbol values in the 16-bit and 32-bit bootstrap code and works the same as `ur_data` but for `mov` instructions. The new macro creates a new type of `_uk_reloc_` symbol, with an `imm` suffix, to show that it is placed right after a `mov` instruction whose immediate value must be relocated/patched
- [`ur_ldr`](https://github.com/unikraft/unikraft/commit/fdf9f831aeb2671efa17345a55611adea532d982#diff-d3ff67d8e3e272d3e186c82656b89185922c743e1d27498eb3aa404eaa26462cR20) replaces the `ldr` instruction in places where references to absolute symbol values are made. Luckily, this did not need any custom symbol generation, but instead makes use of ARM's `adrp` instruction

Consider the following example:

```
ur_data    quad, symbol, 8, _phys
```

This will result in the `nm` tool, whose output the script will parse, generating such entry:

```
0000000000100106 T symbol_uk_reloc_data8_phys
```

For `mkukreloc.py` this means, with a linker script reference address of `0x100000`:

```c
struct uk_reloc {
        /* Offset relative to runtime base address where to apply relocation */
        __u64 r_mem_off = 0x106;               // 0x100106 - 0x100000
        /* Relative address value of the relocation */
        __u64 r_addr;
        /* Size of the relocation */
        __u32 r_sz = 8;                        // symbol_uk_reloc_data[8]_phys
        /* Relocation flags to change relocator behavior for this entry */
        __u32 flags = UKRELOC_FLAGS_PHYS_REL;  // symbol_uk_reloc_data8[_phys]
} __packed;
```

In order for the actual value of `symbol` to be found, since its name is at the beginning of the generated symbol, the script will now look for such entry:

```
0000000000100078 T symbol  // from [symbol]_uk_reloc_data8_phys
```

and thus, `0x78` becomes the value of `r_addr` and the `struct uk_reloc` is completed and appended to the binary blob with the others.

At runtime, [`do_uk_reloc`](https://github.com/unikraft/unikraft/commit/2850403b9bf36d189bed4a03006b2cee670d632a#diff-2dc6e1274f6e251c7d315f9653d015c1453eb1dc78f84df0e1c8d6a028c8b17fR63), being the self relocator, will parse the `.uk_reloc` ELF section and apply all of the relocations to allow Unikraft to run regardless of the address where it was loaded. However, this is the C-written, 64-bit, relocator. In the case of Multiboot1, to still be able to relocate, [`do_uk_reloc32`](https://github.com/unikraft/unikraft/commit/831109d605f345a74c12b10a9be05d3b5672af33) has been written as the 32-bit, assembly, version of `do_uk_reloc`.

This feature is automatically enabled when selecting `CONFIG_OPTIMIZE_PIE`.


#### Memory region integration
To align all the other platforms and architectures with `x86_64`'s `KVM` `ukplat_memregion_*` API's and make them position independent as well as `UEFI` friendly from a memory region setup point of view, proper [integration](https://github.com/unikraft/unikraft/pull/848) of these API's as well as `ukbootinfo` was required. This would also allow for easier `ASLR` integration in the future. Although the changes are also brought to `Xen` as well as `linuxu`, `UEFI` support is only added for `KVM` because for `Xen` we prefer direct kernel boot and as far as `linuxu` (Linux Userspace) goes, it's obvious why it will never have `UEFI` integration. The main target of this large restructuring was aligning the current implementation of `AArch64` with that of `x86_64` to make `UEFI` integration on both architectures as uniform as possible. While at it, I noticed that it would be easy to also integrate `ukvmem` into `AArch64` so I provided a [Pull Request](https://github.com/unikraft/unikraft/pull/908) in that direction, to further help aligning the two architectures and create the smoothest possible landing surface for `UEFI`.

In summary:
- added a [`dtb`](https://github.com/unikraft/unikraft/commit/e20e7b6e1daafef85c5f26b99308c2985d7a4d57) field in `struct ukplat_bootinfo` and a corresponding related [`method`](https://github.com/unikraft/unikraft/commit/1afb42342524ffdce124bcc7b7051f107deb5c78) that would parse what is needed from the Devicetree to fill in the boot information structure, moved
- moved memory initialization to a platform agnostic [`location`](https://github.com/unikraft/unikraft/commit/9f5f450b2f9d4f032e4fa850b02e0d8b57de314b) that makes use of a newly added object, `bpt_unmap_mrd`, that is meant to be hardcoded for each existing platform's static boot page tables (where not necessary, a zeroed out version would suffice): [`KVM x86`](https://github.com/unikraft/unikraft/commit/2d0b784c7e6b3530c73d3a5fb70e28ffca6e7be8), [`KVM AArch64`](https://github.com/unikraft/unikraft/commit/f61e245b4003f73a95b5749ba09a9bac2a33d676), [`linuxu`](https://github.com/unikraft/unikraft/commit/de9989a3c71a770ea7800c047dba4c38c49b14c2) and [`Xen x86`](https://github.com/unikraft/unikraft/commit/90374ad414c6bc309f16663d18e3ead2527ee5d8)
- made `KVM AArch64` use the same [memory initialization](https://github.com/unikraft/unikraft/commit/439868bd0b8d6bb97a40323e9a9df548e080507a) model as its `x86_64` counterpart
- enabled `86_64` to not have to [hardcode mappings in the first `1 MiB`](https://github.com/unikraft/unikraft/commit/b46d9871725421a0ae854498d12e7c2e65769fa6) by introducing two very specific memory region inserting functions, that would only take care of only the very well known regions that this whole region of `1 MiB` is mapped for: the region for [legacy memory holes](https://github.com/unikraft/unikraft/commit/94f4b947752cc36143cd946dcf4fa75dc2d6d588) (e.g. `VGA Text-Mode` framebuffer) and the region for the [`SIPI Vector`](https://github.com/unikraft/unikraft/commit/6ba8ae5db78393913ce673ada111f846988eb592) that we would dynamically allocate out of available free memory regions with the help of the generalized [`ukplat_memregion_alloc`](https://github.com/unikraft/unikraft/commit/b84857187aa5209dc048fe954afd7540d1dbcedc) previously known as `bootmemory_palloc`.
- implemented a basic memory region coalescing [method](https://github.com/unikraft/unikraft/commit/dcb047ec858d5b20e8f4b88f226179fbff0ffb3f)
- besides ARM, properly integrated `memregion` and `bootinfo` API's into [`linuxu`](https://github.com/unikraft/unikraft/commit/f66e471d7e72ff3476f1d0006de593e1c0a00875) and [`Xen`](https://github.com/unikraft/unikraft/commit/f7b9ff80f1d17d75e1ba7449b80e96169c55a8d0) as well


### EFI stub
Now, we are fully set up and ready for a proper `UEFI` integration.

First things first, to make use of the rich family of API's that `UEFI` lends us, we needed to have access to a minimal subset of the specification's definitions. Therefore, a [header](https://github.com/unikraft/unikraft/commit/809d09cfa5305a14502a9c06fa32a9acec6d1717) with those has been provided.

Another minor inconvenience that we had to resolve was the fact that Unikraft is normally linked as an ELF file, while the UEFI specification requires PE32/PE32+. The approach that I chose to solve this problem was to write a short basic [`python3 script`](https://github.com/unikraft/unikraft/commit/28e0e371215baaacd984dfec50ae2f966b1c7a63) that would parse the ELF program headers of Unikraft and convert them to their equivalent PE sections. The script then appends to the beginning of the initial ELF the MS-DOS stub, the PE signature followed by the COFF file header, PE optional header and, finally, the table for the PE sections themselves (check out the official [documentation](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format)).


<figure>
    <img src="../../../static/assets/imgs/uk_efi_pe_2023-07-11-.png">
    <figcaption align="center"><b>Unikraft UEFI Stub Image Format</b></figcaption>
</figure>


Now that we are position independent, have the UEFI definitions, a consistent integration of the `memregion` API's across both `x86_64` and `AArch64` on `KVM` and now a way to fool UEFI firmware into thinking of Unikraft as a PE32/PE32+ image, the time has come to write the UEFI-related code itself.

It was decided that the UEFI stub would consist of three stages.

<figure>
    <img src="../../../static/assets/imgs/uk_efi_stages_2023-07-11-.png">
    <figcaption align="center"><b>Unikraft UEFI Stub Stages</b></figcaption>
</figure>


#### Architecture Specific Entry Stage
The first stage represents the place where UEFI firmware drops us off at to start execution of our own code. It has two variants: one for [`x86_64`](https://github.com/unikraft/unikraft/commit/1eefc342d29121bd1e8f97ce7f4f62c083ecc26f) and one for [`AArch64`](https://github.com/unikraft/unikraft/commit/184de7dd4b677619f64b8d7ed1a78ae8558f9acb). Both variants are written in assembly and simply invoke the self relocator through `du_uk_reloc` that was implemented along with the integration of `PIE` and end by jumping to a more generic stage written in C.


#### Architecture Agnostic Stage
This is the phase where the UEFI stub will try to set up everything that the Kernel was configured to ask for from the previous boot phase, with the help of Unikraft’s already existing generic boot protocol structure, `ukplat_bootinfo`. The [architecture agnostic stage`](https://github.com/unikraft/unikraft/commit/25bd8e84516f9b2500f541213194107213f0c267) of Unikraft's UEFI stub calls a firmware routine to fetch the UEFI Memory Map which it will convert to one that Unikraft understands, made of [`struct ukplat\_memregion\_desc](https://github.com/unikraft/unikraft/commit/c2430d42a2860d1b59b86b320deb4df3cf5a3755). It will also make a check for the `Memory Attribute Table`, whose memory region descriptors it will use instead of the ones fetched from the previous `GetMemoryMap()` in case of the memory regions related to `UEFI Runtime Services`. Next, it searches the `EFI System Partition` for a [`command-line`](https://github.com/unikraft/unikraft/commit/99e3389f3d6bc745f33b9018cbf6643669c8e4e5) file, an [`initrd`](https://github.com/unikraft/unikraft/commit/618a71d9668bc44ac5cc95e2c9001863f9dec070) and a [`Devicetree`](https://github.com/unikraft/unikraft/commit/7cfb71160fc46d85bdc369cb13b7948565037db6). Finally, it checks for a [`Reset Attack Mitigation`](https://github.com/unikraft/unikraft/commit/26313ec58d27a96c8f6427cf6e90a7b385ff9790) variable to set, if available and right afterwards it calls `ExitBootServices()` and jumps to the third and last stage.


#### Architecture Specific Post-UEFI Stub
This phase is of a very high importance and acts as a pre-kernel, as it ensures that the current post-UEFI environment is adjusted for Unikraft to properly execute. Again,
this comes in two flavors: [`x86_64`](https://github.com/unikraft/unikraft/commit/71c0b36fa885ef0f14f11f6773b2d03827746076) and [`AArch64`](https://github.com/unikraft/unikraft/commit/5aeaeed359d7853e00b8e8993024a8aa212345aa). The main focus of this stage is to set certain system registers to warm reset values, switch to Unikraft's stack and early static boot page tables as well as ensure that IRQ's are disabled before jumping to the actual Unikraft entry. There are other minor, architecture specific, things that are done during this stage, such as disabling the LAPIC Timer or ensuring that the legacy PCI shared IRQ's are level triggered.


## Next steps
Now that a somewhat UEFI foundation has been "installed", it is time to look
into integrating ACPI and align it with the way we use Devicetree. An upgrade
to the platform bus and to the way we enumerate peripherals may be required.
Stay tuned for more updates.
