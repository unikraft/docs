/* SPDX-License-Identifier: BSD-3-Clause */
/*
 * Copyright (c) 2006-2007, Kohsuke Ohtani
 * Copyright (C) 2014 Cloudius Systems, Ltd.
 * Copyright (c) 2019, NEC Europe Ltd., NEC Corporation.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the author nor the names of any co-contributors
 *    may be used to endorse or promote products derived from this software
 *    without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

#include <errno.h>

#define _BSD_SOURCE
#include <vfscore/vnode.h>
#include <vfscore/mount.h>
#include <vfscore/dentry.h>

#include "myramfs.h"

extern struct vnops myramfs_vnops;

static int myramfs_mount(struct mount *mp, const char *dev, int flags,
			   const void *data);

static int myramfs_unmount(struct mount *mp, int flags);

#define myramfs_sync    ((vfsop_sync_t)vfscore_nullop)
#define myramfs_vget    ((vfsop_vget_t)vfscore_nullop)
#define myramfs_statfs    ((vfsop_statfs_t)vfscore_nullop)

/*
 * File system operations
 */
struct vfsops myramfs_vfsops = {
		myramfs_mount,       /* mount */
		myramfs_unmount,     /* unmount */
		myramfs_sync,        /* sync */
		myramfs_vget,        /* vget */
		myramfs_statfs,      /* statfs */
		&myramfs_vnops,      /* vnops */
};

static struct vfscore_fs_type fs_myramfs = {
	.vs_name = "myramfs",
	.vs_init = NULL,
	.vs_op = &myramfs_vfsops,
};

UK_FS_REGISTER(fs_myramfs);

struct uk_list_head myramfs_head;

/*
 * Mount a file system.
 */
static int
myramfs_mount(struct mount *mp __unused, const char *dev __unused,
		int flags __unused, const void *data __unused)
{
	uk_pr_debug("%s: dev=%s\n", __func__, dev);

	UK_INIT_LIST_HEAD(&myramfs_head);

	return 0;
}

static int
myramfs_unmount(struct mount *mp, int flags __unused)
{

	vfscore_release_mp_dentries(mp);
	return 0;
}
