+++
title = "Radix-Tree: Internal data structures for SGX EPC Page Management"
date = "2022-08-22T00:00:00+01:00"
author = "Xiangyi Meng"
tags = ["Security", "Intel SGX", "Radix-Tree"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2022-badge.svg" align="right" />

EPC Page management is the key point of the SGX driver. 
It includes the following features:
- Add an EPC page
- Block an EPC page
- Load an EPC page as blocked/unblocked
- Remove a page from EPC
- Write back/invalidate an EPC page

These functions depend on suitable data structures. 
Let's clarify our requirements: we have a structure 
```c
struct sgx_encl_page {
	unsigned long addr;
	unsigned int flags;
	struct sgx_epc_page *epc_page;
	struct sgx_va_page *va_page;
	unsigned int va_offset;
};
```
, each of which represents an EPC page. 
Intuitively, the `addr` of it will be the index of each instance of this structure. 
A hash table seems enough to be the backend storage structure and it has an expected `O(1)` lookup/insert/remove performance , but it may take much space, which is rare in kernel. 
Paying attention to an important point, the `addr`s of the EPC pages usually share some common prefix. 
*This fits the character of radix-tree very well.*

## What is a radix-tree?
Quoted from Wikipedia:
> A radix tree (also radix trie or compact prefix tree or compressed trie) is a data structure that represents a space-optimized trie (prefix tree) in which each node that is the only child is merged with its parent. 
> The result is that the number of children of every internal node is at most the radix r of the radix tree, where r is a positive integer and a power x of 2, having x ≥ 1. 
> Unlike regular trees, edges can be labeled with sequences of elements as well as single elements. 
> This makes radix trees much more efficient for small sets (especially if the strings are long) and for sets of strings that share long prefixes.

In our case, we want to store pointers to the `sgx_encl_page` structure, which is indexed by `unsigned long` values. 
Below is a simple illustration of a radix-tree:
```text
                                                                    +-------------+
                                                                    |*00* 01 10 11|
                                                                    +-------------+
                                                                  /---  /   \  ---\
                                                            /-----     /     \     -----\
                                                      /-----          /       \          -----\
                                                /-----               /         \               -----\
                                         +-------------+     +-----------+     +-----------+     +-----------+
                                         |*00* 01 10 11|     |00 01 10 11|     |00 01 10 11|     |00 01 10 11|
                                         +-------------+     +-----------+     +-----------+     +-----------+
                                         /-                                                              -\
                                      /--                                                                  --\
                                    /-                                                                        --\
                                 /--                                                                             --\
                           +-------------+                                                                     +-----------+
                           |00 01 *10* 11|                              .........                              |00 01 10 11|
                           +-------------+                                                                     +-----------+
                         /---  /   \  ---\                                                                 /---  /   \  ---\
                   /-----     /     \     -----\                                                     /-----     /     \     -----\
             /-----          /       \          -----\                                         /-----          /       \          -----\
       /-----               /         \               -----\                             /-----               /         \               -----\
+-----------+     +-----------+     +-------------+     +-----------+               +-----------+     +-----------+     +-----------+     +-----------+
|00 01 10 11|     |00 01 10 11|     |00 01 10 *11*|     |00 01 10 11|               |00 01 10 11|     |00 01 10 11|     |00 01 10 11|     |00 01 10 11|
+-----------+     +-----------+     +-------------+     +-----------+               +-----------+     +-----------+     +-----------+     +-----------+
```

Looking at the index surrounded by two stars (\*xx\*), suppose we'd like to lookup the value indexed by 11100000, we first search 00 in the root node, and it points to the leftmost child. 
In this node, we lookup 00, which also points to the leftmost child. 
Then we go to the corresponding child at the third level. 
In this node, we lookup 10, which points to the third child of this node. 
Now we reach the leaf node, and we lookup 11. 
The result is the pointer to the requested structure.

## Implementation details
Above is the basic design of a radix-tree, which use two bits in each level. 
Our implementation is based on the freebsd code (commit 307f78f), with some modifications to make it adapt to the Unikraft's API.

The radix-tree node and root are defined as
```c
#define	UK_RADIX_TREE_MAP_SHIFT	6 /* each layer represents 6 bits of the index */
#define	UK_RADIX_TREE_MAP_SIZE	(1UL << UK_RADIX_TREE_MAP_SHIFT) /* max number of child nodes: 2^6 = 64 1000000 */
#define	UK_RADIX_TREE_MAP_MASK	(UK_RADIX_TREE_MAP_SIZE - 1UL) /* mask: 2^6 - 1 = 63 111111 */
#define	UK_RADIX_TREE_MAX_HEIGHT \
	howmany(sizeof(long) * NBBY, UK_RADIX_TREE_MAP_SHIFT) /* ((8 * 8) + 5) / 6 = 11 */

struct uk_radix_tree_node {
	void		*slots[UK_RADIX_TREE_MAP_SIZE];
	int		count;
};

struct uk_radix_tree_root {
	struct uk_radix_tree_node	*rnode;
	int			height;
};
```
In each node, the `slots` array stores pointers to the `sgx_encl_page` structures, and the `count` field stores the number of valid entries in the array. 
Each node has 64 slots and the max height is 11 (according to those macro definitions).

There is one important operation, which is to calculate the slot position of a given index at a specific height. 
The following code snippet is the implementation of this operation:
```c
static inline int
uk_radix_pos(long id, int height)
{
	return (id >> (UK_RADIX_TREE_MAP_SHIFT * height)) & UK_RADIX_TREE_MAP_MASK;
}
```
Based on the above definitions, the insertion/deletion/lookup operations is okay to be implemented accordingly. 
Readers could refer to PR [#520](https://github.com/unikraft/unikraft/pull/520) for details of the implementation. 
In summary, below interfaces/structures are exposed to the user:
```c
struct uk_radix_tree_node {
	void		*slots[UK_RADIX_TREE_MAP_SIZE];
	int		count;
};

struct uk_radix_tree_root {
	struct uk_radix_tree_node	*rnode;
	int			height;
};

struct uk_radix_tree_iter {
	unsigned long index;
};

UK_RADIX_TREE_INIT();
UK_INIT_RADIX_TREE(root);
UK_RADIX_TREE(name);

int uk_radix_tree_insert(struct uk_radix_tree_root *root, unsigned long index, void *item);
void *uk_radix_tree_delete(struct uk_radix_tree_root *root, unsigned long index);
void *uk_radix_tree_lookup(struct uk_radix_tree_root *root, unsigned long index);

uk_radix_tree_for_each_slot(slot, root, iter, start);
bool uk_radix_tree_iter_find(struct uk_radix_tree_root *root, struct uk_radix_tree_iter *iter, void ***pppslot);
void uk_radix_tree_iter_delete(struct uk_radix_tree_root *root, struct uk_radix_tree_iter *iter, void **slot);
```