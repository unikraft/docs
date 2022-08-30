Through virtualization, multiple operating systems (OS) are able to run on the same hardware, independently, thinking that each one of them controls the entire system.
This can be done using a hypervisor, which is a low-level software that virtualizes the underlying hardware and manages access to the real hardware, either directly or through the host Operating System.
There are 2 main virtualized environments: virtual machines and containers, each with pros and cons regarding complexity, size, performance and security.
Unikernels come somewhere between those 2.

#### Virtual Machines

Virtual machines represent an abstraction of the hardware over which an operating system can run, thinking that it is alone on the system and that it controls the hardware below it.
Virtual machines rely on hypervisors to run properly.
Those hypervisors can be classified in 2 categories: Type 1 and Type 2.
We won't go in depth into them, but it is good to know how they are different:

* The **Type 1 hypervisor**, also known as **bare-metal hypervisor**, has direct access to the hardware and controls all the operating systems that are running on the system.
  KVM, despite the appearances, is a Type 1 hypervisor.
* The **Type 2 hypervisor**, also known as **hosted hypervisor**, has to go through the host operating system to reach the hardware.
  An example of Type 2 hypervisor is VirtualBox.

| ![type 1 hypervisor os](/community/hackathons/sessions/behind-scenes/images/vm1.svg) | ![type 2 hypervisor os](/community/hackathons/sessions/behind-scenes/images/vm2.svg) |
| :--:									  | :--:								    |
| Operating systems over type 1 hypervisor				  | Operating systems over type 2 hypervisor 				    |

#### Containers

Containers are environments designed to contain and run only one application and its dependencies.
This leads to very small sizes.
The containers are managed by a Container Management Engine, like Docker, and are dependent on the host OS, as they cannot run without it.

| ![containers](/community/hackathons/sessions/behind-scenes/images/container.svg)	|
| :--: 									|
| Containers								|

#### Unikraft

Unikraft has a size comparable with that of a container, while it retains the power of a virtual machine, meaning it can directly control the hardware components (virtualized, or not, if running bare-metal).
This gives it an advantage over classical Operating Systems.
Being a special type of operating system, Unikraft can run bare-metal or over a hypervisor.

| ![type 1 hypervisor uk](/community/hackathons/sessions/behind-scenes/images/unikraft1.svg) | ![type 2 hypervisor uk](/community/hackathons/sessions/behind-scenes/images/unikraft2.svg) |
| :--: | :--: |
| Unikraft over Type 1 hypervisor                                                  | Unikraft over Type 2 hypervisor                           		|

The following table makes a comparison between regular Virtual Machines (think of an Ubuntu VM), Containers and Unikernels, represented by Unikraft:
|                      | Virtual Machines              | Containers                        | Unikernels                  |
| :------------------: | :---------------------------: | :-------------------------------: | :-------------------------: |
| **Time performance** | Slowest of the 3              | Fast                              | Fast                        |
| **Memory footprint** | Heavy                         | Depends on the number of features | Light                       |
| **Security**         | Very secure                   | Least secure of the 3             | Very secure                 |
| **Features**         | Everything you would think of | Depends on the needs              | Only the absolute necessary |
