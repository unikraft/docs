+++
title = "Adding SMP support"
date = "2022-07-19 6:53:56"
author = "Sairaj Kodilkar"
tags = ["blog"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2022-badge.svg" align="right" />

The previous blog on the SMP support explained different synchronization primitives for the unikraft.
As a part of the next step, I started exploring some of the lockless data structures.
There has been an extensive amount of research to optimize this lockless data structure.

Below I describe some of the lockless data structures that I explored in the past few weeks.

## Read-Copy-Update (RCU)

Quoted from Wikipedia:
> In computer science, read-copy-update (RCU) is a synchronization mechanism that avoids the use of lock primitives while multiple threads concurrently read and update elements that are linked through pointers and that belong to shared data structures (e.g., linked lists, trees, hash tables).
> Whenever a thread is inserting or deleting elements of data structures in shared memory, all readers are guaranteed to see and traverse either the older or the new structure, therefore avoiding inconsistencies (e.g., dereferencing null pointers).

The RCU arranges the pointer manipulation in such a way that the readers either see an older or newer version.
Hence the reader can access the data structure even when it is in the process of being updated.
This avoids the overhead to acquire and release the lock.
The following diagram demonstrates how a new node may be inserted into the RCU linked list

<img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Read-Copy_Update_Deletion_Procedure.svg"/>

The RCU list has one big challenge while deleting the node from the given list.
Since readers may have pointers pointing to the node being deleted, we have to be careful with memory deallocation.
We cannot deallocate the node until there is no reference to the node.
There are mainly two solutions to this problem

* Reference-Counted search and delete
* Deferred Free

#### Reference-Counted Search And Delete

This method associates a reference count with each node of the linked list.
At the start of the read/search operation, the reference count is incremented by one.
The count is decremented when the read operation is over.
The delete operation does not deallocate the memory until the reference count is zero.

#### Deferred Free

This method delays the deallocation of the node until the end of the grace period.
The grace period is a sufficient amount of time when we are sure that all read operations have been completed.
The grace period can be an amount of time until which every CPU has been through a quiescent state (e.g., context switch, idle loop, etc)

The RCU still has the race condition between two different writes, hence the user has to ensure that writes are mutually exclusive.
Because of this RCU is good only when there are a large number of readers and only a few writers.

### Lock-Free Linked Lists Using Compare and Swap

This method is quite complex and uses auxiliary nodes.
The method introduces additional memory overhead and as well a complex memory reclamation algorithm similar to RCU.

### Problems

For the lock-free data structure to work efficiently it requires an advanced scheduler.
The scheduler must be able to run a memory reclamation algorithm on each CPU to determine the quiescent state.
The Unikraft's new scheduler is still under development hence I decided to delay the actual implementation.

## Posix-Futex Review

Along with this, I did my first review of PR#488 by @adinasm.
The PR implements the posix-futex library for unikraft.
Futex stands for fast userspace mutex.
It is supposed to avoid syscalls and their overhead.


## Future Work

I started reviewing PR for adding SMP support to x86.
Following this, I will work on APIC integration.

