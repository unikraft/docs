+++
title = "Adding I/O APIC support"
date = "2022-08-21 23:30:02"
author = "Sairaj Kodilkar"
tags = ["blog"]
+++

This blog describes the ongoing work on the I/O APIC integration in unikraft.
Currently Unikraft is using the traditional 8259 PIC interrupt controller.
The ongoing work implement a function pointer based design.
This allows us to use 8259 as well as I/O APIC through same interface.

## Design

The new design implements the common API for both I/O APIC as well as PIC.
This is achieved by using the `struct` of function pointers to the interrupt controller operations.
At the time initialization of the interrupt controller, the code checkes the availibility of the I/O APIC.
If the IOAPIC is available then it uses the corrosponding pointer.

We describe the different part of code in the following sections

## IOAPIC detection and enable

The IOAPIC detection is done by reading the MADT entry provided by the ACPI.
For each IOAPIC in the system there is one entry in the MADT with type 1.
Each type 1 entry contains IOAPIC base address which are used to access the I/O APIC registers.
To enable the IOAPIC we write 1 to the IMCR register.

## IOAPIC registers

The I/O APIC has different registers for configurations.
These registers are indirectly accessed through the two registers:
* IOREGSEL: IO register select (index)
* IOWIN: IO window (Data)
Writing to the `IOREGSEL` selects the IOAPIC register.
The selected register data is available for read/write through IOWIN register.

IOAPIC has following registers:
* IOAPICID: (00h) IOAPIC ID.
* IOAPICVER: (01h) IOAPIC version.
* IOAPICARB: (02h) IOAPIC Arbitration ID.
* IOREDTBL: (10-3Fh) Redirection Table entry.

## Redirection Table

IOAPIC has one redirection table entry register per IRQ line.
Unlike IRQ pins of the 8259A, the notion of interrupt priority is completely unrelated to the position of the physical interrupt input signal on the APIC.
Instead, software determines the vector (and therefore the priority) for each corresponding interrupt input signal.
Each entry in the redirection table can be programmed for Vector number, Destination processor, etc.

## Initialization

To initialize the I/O APIC we first need to assign the unique ID to each of the I/O APIC present in the system.
After that each redirection entry is initialized with the vector number starting from 32.
These entries are masked until program installs a IRQ handler.

## Interrupt Source Override
It is assumed that the ISA interrupts will be identity-mapped into the first I/O APIC sources.
Most existing APIC designs, however, will contain at least one exception to this assumption.
The Interrupt Source Override Structure is provided in order to describe these exceptions.
For Example the IRQ 0 (Timer IRQ) can be connected to IRQ 2 in the APIC mode.





