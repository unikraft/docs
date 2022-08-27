The `ramfs` library has a tree-like structure, as we saw in the section dedicated to it.
Our library will be in the form of a list for ease of use.
We'll use the generic lists given before to make it even prettier.
This indicates that only ordinary files, not directories, are supported.

For this task we will still look in the files `myramfs_vfsops.c` and `myramfs_vnops.c` and we will perform the TODOs from 5 to 13.
But first we recommend you to look at the `struct myramfs_node` which is in the `myramfs.h` file.

To test this task go back to the `ramfs-app` and build it again (make sure to properclean).
If you solved everything correctly the output should look like this:

![05_output](./images/05_output.png)
