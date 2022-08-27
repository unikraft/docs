Using the  `grep` utility search the following and inspect the source code:
1. `struct vfsops`, `struct vnops`, `struct vfscore_fs_type`
1. `struct vnode`, `struct dentry`,  `struct mount`
1. `sys_open` look especially for VOP macros.
   How many operations does the open system call do?
4. `vfscore_vget` can you figure it out what this function does?
