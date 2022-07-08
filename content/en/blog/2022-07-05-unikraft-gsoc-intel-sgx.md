+++
title = "Improving security and isolation of Unikraft with Intel SGX "
date = "2022-06-13T00:00:00+01:00"
authors = [
  "Xiangyi Meng"
]
tags = ["Security", "Intel SGX"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2022-badge.svg" align="right" />

Trusted execution environment (TEE), especially Intel SGX, is a popular and powerful tool to provide hardware-based isolation for highly sensitive code and data. Today’s commercial clouds (Microsoft Azure DCsv2, DCsv3/DCdsv3 series, IBM Cloud Bare Metal z15 series, and Alibaba Cloud Bare Metal Instance) more or less have provided their support to Intel SGX. As a powerful and cloud-ready unikernel development kit, Unikraft should enable this feature to give users an option to protect their sensitive code and data. (For more details of Unikraft's interests in security, please check [here](https://github.com/unikraft/docs/blob/main/content/en/docs/features/security.md))

This blog briefly describes the concepts behind TEE, Intel SGX and the ongoing work that implements Intel SGX support in Unikraft.

## TEE and Intel SGX

Quoted from Wikipedia:
> A trusted execution environment (TEE) is a secure area of a main processor. It guarantees code and data loaded inside to be protected with respect to confidentiality and integrity, Data integrity — prevents unauthorized entities from altering data when any entity outside the TEE processes data, Code integrity — the code in the TEE cannot be replaced or modified by unauthorized entities, which may also be the computer owner itself as in certain DRM schemes described in SGX. This is done by implementing unique, immutable, and confidential architectural security such as Intel® Software Guard Extensions (Intel® SGX) which offers hardware-based memory encryption that isolates specific application code and data in memory. Intel® SGX allows user-level code to allocate private regions of memory, called enclaves, which are designed to be protected from processes running at higher privilege levels. A TEE as an isolated execution environment provides security features such as isolated execution, integrity of applications executing with the TEE, along with confidentiality of their assets. In general terms, the TEE offers an execution space that provides a higher level of security for trusted applications running on the device than a rich operating system (OS) and more functionality than a 'secure element' (SE).

Consider this from a practical application scenario, if the tenant does not trust the cloud service provider, then with the presence of TEE, the tenant can isolate the sensitive information and code they have from other data via TEE (Intel SGX), thus making it impossible for the cloud service provider to access the data that needs to be protected. 
Unikraft is committed to providing efficient and secure cloud services to its users, thus, TEE is a must for Unikraft.

## How to?

Thanks to the open-source community, we have lots of reference to learn from, such as [linux-sgx-driver](https://github.com/intel/linux-sgx-driver) and [freebsd-sgx](https://github.com/bukinr/freebsd-sgx). 
Enabling Intel SGX in Unikraft is a huge task, as we need to port both the driver and the SDK to the Unikraft platform. 
Although drivers and SDKs on different OSs are open-sourced, we still need to significantly modify them, which removes the OS-specific things and converts them to Unikraft-specific features and dependencies.

## Progress

Currently, we are working on porting the driver into Unikraft. As of now, the following functions are completed:

- The probing of SGX. 
That is to say, Unikraft can be aware of SGX if enabled in `make menuconfig`. 
And as inspired by `linux-sgx-driver`, the `uksgx` library registers a device `/dev/sgx` to `devfs`, and some stub `ioctl()` function is added to the library, in order to provide a unified and easy interaction channel between `uksgx` and applications. 
But please notice that `ioctl` is not the Unikraft-ish way to interact with devices / internal-libs. 
At this point, this is only for testing and for compatibility with the existing codes and SDKs; it will be refactored to more straightforward implementation.

- A simple ring-0/ring-3 switch utility is added to the library because SGX ENCLU instruction must be executed under ring-3. 
This part involves some modification of the GDT/TSS part in platform code. (This utility only switch the CPL, but does not change the code/data section, according to the design rationale Unikraft)

- The mapping from the physical address of Enclave Page Cache to a legal virtual address is added to the page map used by Unikraft. 
This is the foundation of the following work items, which highly rely on the virtual memory API.

## Next steps

Next, we are going to implement the creation of an enclave, which is mainly handled by the `sgx_ioc_enclave_create` function in `sgx_ioctl.c`. 
Such creation required lots of steps, such as validating the parameters, allocating EPC pages and perform a SGX instruction `ECREATE`. 
For detailed information check [the draft PR](https://github.com/unikraft/unikraft/pull/474).

Enhancing security is very interesting and challenging, so it deserves a lot of attention and hard work. 
We are hoping to provide a robust, secure and efficient cloud-solution for the future!