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
Let's break them down.
We start with the platform internal library, `libkvmplat`.
Here, the hardware components are initialized, like the Serial module, `PL001 UART`, and the `GIC`, which is the interrupt controller.
After that, the memory address space is defined, and the booting process starts, by replacing the current stack with a larger one, that is part of the defined address space.
Lastly, before calling the main function of the application, the software components of Unikraft are initialized, like timers, interrupts, and bus handlers.
The execution ends in the platform library, with the shutdown command.
