+++
title = "Adding SMP support"
date = "2022-07-07 10:32:56"
author = "Sairaj Kodilkar"
tags = ["blog"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2022-badge.svg" align="right" />

The Unikraft v0.9.0 introduced the common SMP API, which created the need for synchronization primitives.
This project aims to add the SMP safe synchronization premitives as well as remove the race conditions in the kernel.
The project is the part of the GSOC'22.
The project started with making the existing primitives in the Unikraft kernel (mutex, semaphore) SMP safe and adding new synchronization premitives.
The new implementation is inspired by the FreeBSD code.
[This PR](https://github.com/unikraft/unikraft/pull/476) shows the current progress of the code.

We now briefly discuss each primitive in Unikraft.

## Spinlock


Unikraft has architecture-dependent spinlocks for both x86 and ARM.

### x86 spinlock

The x86 spinlock uses the instruction `cmpxchg`.
This instruction compares the value in AL, AX, EAX, or RAX register with the first operand.
If two values are equal then the second operand is loaded into the destination operand.
Otherwise, the destination operand is loaded into the AL, AX, EAX, or RAX register.
When used with the `lock` prefix, this instructions executes atomically across multiple CPUs, with current CPU taking ownership of the memory bus.

### ARM spinlock

ARM does not have the `cmpxchg` instruction or equivalent.
Instead it supports exclusive access to the memory.
The ARMv6 architecture introduced Load Link and Store conditional instructions in the form of Load-Exclusive and Store-Exclusive synchronization primitives, `ldrex` and `strex`.
The `ldrex` instruction loads the word from memory and initializes the monitor to track the exclusive memory accesses.
The `strex` instruction performs the conditional store to the memory.
If the exclusive access permits this store then it returns the value 0 otherwise, it returns the value 1.

## Mutex

Previously the mutex implemented in Unikraft was only capable of synchronization on single CPU (i.e. non-SMP) systems.
This was achieved by disabling the interrupts.
But this is not enough on the multiprocessor system as different threads running on the different logical CPUs may access the same data structure.
To solve the synchronization problem we can use spinlock to protect the mutex structure or we can use the atomic operations.
The current implementation uses the atomic operation `__atomic_compare_exchange_n(ptr, expected, new, memorder)` provided by GNU compiler.
This instruction compares the *ptr* with the *expected*.
If both are equal then it assigns the new value to the *ptr* and returns the *new* value otherwise it returns the old value of the *ptr*.
The Unikraft provides a wrapper named `ukarch_compare_exchange_sync()` on top of this atomic
operation to simplify the use.

Here is the snippet of the mutex `lock()` and `unlock()` functions
`uk_mutex_lock()` and `uk_mutex_unlock()`:
The `current` is the pointer to the current thread structure;
the `owner` variable is the owner thread of the mutex.
The lock count is maintained to support the recursive lock.

```C
uk_mutex_lock(uk_mutex *m)
{

	/* Initialize the variable */

	for (;;) {

		uk_waitq_wait_event(&m->wait, m->owner == NULL);

		if (ukarch_compare_exchange_sync(&m->owner, 0, current) == current) {
			ukarch_inc(&(m->lock_count));
			break;
		}
	}
}

uk_mutex_unlock(uk_mutex *m)
{
	if (ukarch_sub_fetch(&(m->lock_count), 1) == 0) {
		m->owner = NULL;
		uk_waitq_wake_up(&m->wait);
	}
}
```

## Semaphore

Previously semaphore implementation also relied on disabling interrupts for critical regions that required serial access.
But for multiprocessor synchronization, a spinlock is added to the semaphore structure to protect the internal `count` variable.
The following code snippet describes the semaphore down and up functions.

```C
uk_semaphore_down(uk_semahpore *s)
{
	for (;;) {
		uk_waitq_wait_event(&s->wait, s->count > 0);
		irqf = uk_spin_lock(&(s->sl));
		if (s->count > 0)
			break;
		uk_spin_unlock_irqf(&(s->sl), irqf);
	}
	--s->count;
	uk_spin_unlock(&(s->sl), irqf);
}

uk_semaphore_up(uk_semaphore *s)
{

	irqf = uk_spin_lock_irqf(&(s->sl));
	++s->count;
	uk_waitq_wake_up(&s->wait);
	uk_spin_unlock_irqf(&(s->sl), irqf);
}
```

## Reader-Writer Locks

The Reader-writer locks allow multiple readers to simultaneously acquire the lock but only allows a single writer to acquire the lock.
This means that the new reader can acquire the lock if there are zero writers, whereas the writer can acquire the lock only when there is no reader as well as a writer.
A simple implementation uses a spinlock to protect the internal data.
However, to get better performance we have used the atomic operation `__atomic_compare_exchange_n`.

Before implementing treader-writer locks we need to consider the following problems:
* Starvation of writers due to readers.
* Lost wake-up actions.

To solve the first problem, we give the higher priority to the writers.
That is, in the `lock()` function when the reader tries to acquire the lock it first checks if there are any pending writers;
if there are pending writers, it waits on the queue.
Also, in `unlock()` function, both readers and writers first check if there are any pending writers.
If yes, they wake up the writers instead of the readers.
To solve the lost wake-up problem we can use a `sleep()` call with no timeout.

The reader-writer lock is implemented using six basic functions: `uk_rwlock_rlock`, `uk_rwlock_runlock`, `uk_rwlock_wlock`, `uk_rwlock_wunlock`, `uk_rwlock_upgrade`, `uk_rwlock_downgrade`.

To implement these functions we need three flags:
* `UK_RWLOCK_READ` : 1 if the lock is held by readers, 0 if the lock is held by writers
* `UK_RWLOCK_READ_WAITERS` : 1 if readers are waiting for the lock, otherwise 0
* `UK_RWLOCK_WRITE_WAITERS` : 1 if writers are waiting for the lock, otherwise 0

These flags form the lower three bits of the lock variable.
The remaining bits have different meaning based on the `UK_RWLOCK_READ` flag.
When this flag is 1, i.e. lock is held by a reader then the upper bits store the count of the readers holding this lock.
Otherwise, when the lock is held by a writer these bits store the owner of the lock.
Instead of using the `struct thread` pointer, we distinguish the owners of the lock by using the address of the bottom of the stack.
Since each thread has a unique stack aligned to the page size we use the lower 12 bits to store the flags.
Along with this, there are separate queues for pending readers and pending writers.

Below we describe each method.

### Reader Lock

The reader checks if it can acquire the lock, i.e. there are no current or pending writers.
If it can then it increments the readers' count.
Otherwise, it sets the `UK_RWLOCK_READ_WAITERS` flag and waits in the shared queue.

```C
uk_rwlock_rlock(uk_rwlock *rwl)
{
	for(;;) {
		v = rwl->rwlock;
		if(_rw_can_read(v)) {
			setv = v + UK_RW_ONE_READER;
			if(ukarch_compare_exchange_sync(&rwl->rwlock, v, setv) == setv) {
				break;
			}
			continue;
		}

		if(!(rwl->rwlock & UK_RWLOCK_READ_WAITERS)) {
			ukarch_or(&rwl->rwlock, UK_RWLOCK_READ_WAITERS);
		}

		uk_waitq_wait_event(&rwl->shared, _rw_can_read(rwl->rwlock));
	}
}
```

### Writer Lock

The writer checks if it can get the lock for writing, i.e. the lock is not owned by a reader or a writer.
If it can, then it unsets the `UK_RWLOCK_READ` flag, otherwise it sets the `UK_RWLOCK_WRITE_WAITERS` flag and waits in the exclusive queue.

```C
void uk_rwlock_wlock(struct uk_rwlock *rwl)
{
	for(;;) {

		v = rwl->rwlock;
		setv = stackbottom | (v & UK_RWLOCK_WAITERS);

		if(_rw_can_write(v)) {
			if(ukarch_compare_exchange_sync(&rwl->rwlock, v, setv) == setv) {
				ukarch_inc(&(rwl->write_recurse));
				break;
			}
			continue;
		}

		ukarch_or(&rwl->rwlock, UK_RWLOCK_WRITE_WAITERS);
		uk_waitq_wait_event(&rwl->exclusive, _rw_can_write(rwl->rwlock));
	}
}
```

### Reader Unlock

The unlock function decrement the reader count.
If the reader count is 0 then it tries to wake up writers;
if there are no writers then it wakes up pending readers.

```C
void uk_rwlock_runlock(struct uk_rwlock *rwl)
{

	for(;;) {

		setv = (v - UK_RW_ONE_READER) & ~(UK_RWLOCK_WAITERS);

		if(UK_RW_READERS(setv) == 0 && (v & UK_RWLOCK_WAITERS)) {
			queue = &rwl->shared;
			if(v & UK_RWLOCK_WRITE_WAITERS) {
				setv |= (v & UK_RWLOCK_READ_WAITERS);
				queue = &rwl->exclusive;
			}
		}

		if(ukarch_compare_exchange_sync(&rwl->rwlock, v, setv) == setv)
			break;

		v = rwl->rwlock;
	}
	uk_waitq_wake_up(queue);
	return;
}
```

### Writer Unlock

The unlock function sets the `UK_RWLOCK_READ` flag and the read count to 0.
Then it tries to wake up pending writers;
if there are no pending writers then it wakes up the pending readers.

```C
void uk_rwlock_wunlock(struct uk_rwlock *rwl)
{
	for(;;) {

		setv = UK_RW_UNLOCK;

		if(v & UK_RWLOCK_WAITERS) {
			queue = &rwl->shared;
			if(v & UK_RWLOCK_WRITE_WAITERS) {
				setv |= (v & UK_RWLOCK_READ_WAITERS);
				queue = &rwl->exclusive;
			}
		}

		if(ukarch_compare_exchange_sync(&rwl->rwlock, v, setv) == setv)
			break;

		v = rwl->rwlock;
	}
	uk_waitq_wake_up(queue);
}
```

### Upgrade

The upgrade function upgrades a reader thread to a writer thread.
It first checks if there is only one reader, which has to be the current thread.
If yes, then it sets the current thread as owner and unsets the `UK_RWLOCK_READ` flag.
Otherwise it waits on the exclusive queue until all remaining readers release the lock.

```C
void uk_rwlock_upgrade(struct uk_rwlock *rwl)
{
	for(;;) {

		setv = stackbottom | (v & UK_RWLOCK_WAITERS);
		v = rwl->rwlock;

		if(_rw_can_upgrade(v)) {
			if(ukarch_compare_exchange_sync(&rwl->rwlock, v, setv) == setv) {
				ukarch_inc(&(rwl->write_recurse));
				break;
			}
			continue;
		}

		ukarch_or(&rwl->rwlock, UK_RWLOCK_WRITE_WAITERS);
		uk_waitq_wait_event(&rwl->exclusive, _rw_can_write(rwl->rwlock));
	}
}
```

### Downgrade

Downgrade function downgrades a writer to a reader.
The function sets the `UK_RWLOCK_READ` flag and reader count to 1.
After successfully setting this it wakes up all the pending readers.

```C
void uk_rwlock_downgrade(struct uk_rwlock *rwl)
{
	for(;;) {

		setv = (UK_RW_UNLOCK + UK_RW_ONE_READER) | (v & UK_RWLOCK_WRITE_WAITERS);

		if(ukarch_compare_exchange_sync(&rwl->rwlock, v, setv) == setv)
			break;

		v = rwl->rwlock;
	}
	uk_waitq_wake_up(&rwl->shared);
	return;
}
```

## Testing


Currently Unikraft does not have SMP safe wait queue and scheduler.
Hence the testing code does busy waiting on a given condition when `uk_waitq_wait_event()` is called.

## Future Work


In the future the we can add the support for adaptive locks.
In adaptive locks, a thread will either do busy waiting or sleep on the lock depending on the state of the thread holding the lock.
Along with this we are also planning to implement SMP safe data structures.


