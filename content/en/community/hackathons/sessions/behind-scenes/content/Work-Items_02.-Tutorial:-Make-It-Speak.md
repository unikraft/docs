The goal of this exercise is to enable the internal debugging library for Unikraft (`ukdebug`) and make it display messages up to the *info* level.
We also want to identify which hardware components are initialized for both x86 and ARM, and where.

#### ARM

Considering that the last exercise ended with an ARM image, we will start now with that configuration.
We need to enable `ukdebug` in the configuration menu.
It is located in the `Library Configuration` menu.
But, for this exercise, besides enabling a component, we must modify it.

Enter the `ukdebug` configuration menu.
We need to have `Enable kernel messages (uk_printk)` checked.
Also, we need to change the option below it, `Kernel message level`, from `Show critical and error messages (default)` to `Show all types of messages`.
To make things prettier, also enable the `Colored output` option.
Save and exit the configuration, then build and run the image.

We have a bunch of initializations happening, before seeing the "Hello world!" message.
Let's break them down. We start with the platform internal library, `libkvmplat`.
Here, the hardware components are initialized, like the Serial module, `PL001 UART`, and the `GIC`, which is the interrupt controller.
After that, the memory address space is defined, and the booting process starts, by replacing the current stack with a larger one, that is part of the defined address space.
Lastly, before calling the main function of the application, the software components of Unikraft are initialized, like timers, interrupts, and bus handlers.
The execution ends in the platform library, with the shutdown command.

#### x86_64

For the x86 part, just change the architecture in the configuration interface.
Recall that, after changing the architecture, we have to clean the previously compiled files:

```
$ make clean
```

Build Unikraft:

```
$ make
```

Now run under QEMU / KVM.
The output differs.
We can see that, in the case of x86, the platform library initializes less components, or it is less verbose than the ARM one.
But the timer and bus initialization is more verbose.
We see what timer is used, the i8254 one.
Also, we see that the PCI bus is used.

If you are wondering what the Constructors are, they will be covered in [Session 06: Testing Unikraft](community/hackathons/sessions/testing-unikraft)
