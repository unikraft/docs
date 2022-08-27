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

/*
 * rmafs_vnops.c - vnode operations for RAM file system.
 */
#define _GNU_SOURCE

#include <uk/essentials.h>
#include <sys/stat.h>
#include <dirent.h>
#include <sys/param.h>

#include <errno.h>
#include <string.h>
#include <stdlib.h>

#include <uk/page.h>
#include <vfscore/vnode.h>
#include <vfscore/mount.h>
#include <vfscore/uio.h>
#include <vfscore/file.h>

#include "myramfs.h"
#include <dirent.h>
#include <fcntl.h>
#include <vfscore/fs.h>
#include <uk/list.h>

static struct uk_mutex myramfs_lock = UK_MUTEX_INITIALIZER(myramfs_lock);
static uint64_t inode_count = 1; /* inode 0 is reserved to root */
extern struct uk_list_head myramfs_head;

struct myramfs_node *
myramfs_allocate_node(const char *name)
{
	struct myramfs_node *np;

	np = malloc(sizeof(struct myramfs_node));
	if (np == NULL)
		return NULL;
	memset(np, 0, sizeof(struct myramfs_node));

	np->rn_namelen = strlen(name);
	np->rn_name = (char *) malloc(np->rn_namelen + 1);
	if (np->rn_name == NULL) {
		free(np);
		return NULL;
	}
	strlcpy(np->rn_name, name, np->rn_namelen + 1);

	return np;
}

void
myramfs_free_node(struct myramfs_node *np)
{
	free(np->rn_buf);

	free(np->rn_name);
	free(np);
}

static struct myramfs_node *
myramfs_add_node(struct myramfs_node *dnp __unused, char *name)
{

	struct myramfs_node *np;

	np = myramfs_allocate_node(name);
	if (np == NULL)
		return NULL;

	uk_mutex_lock(&myramfs_lock);

	uk_list_add(&np->next, &myramfs_head);

	uk_mutex_unlock(&myramfs_lock);

	return np;
}

static int
myramfs_remove_node(struct myramfs_node *dnp __unused, struct myramfs_node *np)
{
	struct uk_list_head *pos, *tmp;
	struct myramfs_node *entry;
	int found = 0;

	uk_mutex_lock(&myramfs_lock);

	uk_list_for_each_safe(pos, tmp, &myramfs_head) {
		entry = uk_list_entry(pos, struct myramfs_node, next);
		if (entry == np) {
			found = 1;
			uk_list_del(pos);
			break;
		}
	}

	if (found)
		myramfs_free_node(np);

	uk_mutex_unlock(&myramfs_lock);
	return 0;
}



static int
myramfs_lookup(struct vnode *dvp, char *name, struct vnode **vpp)
{
	struct myramfs_node *np, *entry;
	struct vnode *vp;
	size_t len;
	int found;
	struct uk_list_head *pos;


	*vpp = NULL;
	np = NULL;

	if (*name == '\0')
		return ENOENT;

	uk_mutex_lock(&myramfs_lock);

	len = strlen(name);
	found = 0;

	uk_list_for_each(pos, &myramfs_head) {
		entry = uk_list_entry(pos, struct myramfs_node, next);
		if (entry->rn_namelen == len &&
					memcmp(name, entry->rn_name, len) == 0) {
				np = entry;
				found = 1;
				break;
		}
	}

	if (found == 0) {
		uk_mutex_unlock(&myramfs_lock);
		return ENOENT;
	}

	if (vfscore_vget(dvp->v_mount, inode_count++, &vp)) {
		/* found in cache */
		*vpp = vp;
		uk_mutex_unlock(&myramfs_lock);
		return 0;
	}

	if (!vp) {
		uk_mutex_unlock(&myramfs_lock);
		return ENOMEM;
	}

	vp->v_data = np;
	vp->v_mode = UK_ALLPERMS;
	vp->v_size = np->rn_size;

	uk_mutex_unlock(&myramfs_lock);

	*vpp = vp;

	return 0;
}



/* Remove a file */
static int
myramfs_remove(struct vnode *dvp, struct vnode *vp, char *name __maybe_unused)
{
	return myramfs_remove_node(dvp->v_data, vp->v_data);
}



/*
 * Create empty file.
 */
static int
myramfs_create(struct vnode *dvp, char *name, mode_t mode)
{
	struct myramfs_node *np;

	if (strlen(name) > NAME_MAX)
		return ENAMETOOLONG;

	if (!S_ISREG(mode))
	         return EINVAL;


	np = myramfs_add_node(dvp->v_data, name);
	if (np == NULL)
		return ENOMEM;
	return 0;
}

static int
myramfs_read(struct vnode *vp, struct vfscore_file *fp __unused,
	   struct uio *uio, int ioflag __unused)
{
	struct myramfs_node *np =  vp->v_data;
	size_t len;

	if (uio->uio_offset < 0)
		return EINVAL;
	if (uio->uio_resid == 0)
		return 0;

	if (uio->uio_offset >= (off_t) vp->v_size)
		return 0;

	if (vp->v_size - uio->uio_offset < uio->uio_resid)
		len = vp->v_size - uio->uio_offset;
	else
		len = uio->uio_resid;

	return vfscore_uiomove(np->rn_buf + uio->uio_offset, len, uio);
}



static int
myramfs_write(struct vnode *vp, struct uio *uio, int ioflag)
{
	struct myramfs_node *np =  vp->v_data;

	if (uio->uio_offset < 0)
		return EINVAL;
	if (uio->uio_offset >= LONG_MAX)
		return EFBIG;
	if (uio->uio_resid == 0)
		return 0;

	if (ioflag & IO_APPEND)
		uio->uio_offset = np->rn_size;
		
	if ((size_t) uio->uio_offset + uio->uio_resid > (size_t) vp->v_size) {

		/* Expand the file size before writing to it */
		off_t end_pos = uio->uio_offset + uio->uio_resid;


		if (end_pos > (off_t) np->rn_bufsize) {
			// XXX: this could use a page level allocator
			size_t new_size = round_pgup(end_pos);
			void *new_buf = calloc(1, new_size);

			if (!new_buf)
				return EIO;
			if (np->rn_size != 0) {

				memcpy(new_buf, np->rn_buf, vp->v_size);
					free(np->rn_buf);
			}
			np->rn_buf = (char *) new_buf;
			np->rn_bufsize = new_size;
		}
		np->rn_size = end_pos;
		vp->v_size = end_pos;
	}
	return vfscore_uiomove(np->rn_buf + uio->uio_offset, uio->uio_resid,
			       uio);
}








#define myramfs_rename_node ((vnop_rename_node_t)vfscore_vop_nullop)
#define myramfs_set_file_data ((vnop_set_file_data_t)vfscore_vop_nullop)
#define myramfs_rename ((vnop_rename_t)vfscore_vop_nullop)
#define myramfs_open      ((vnop_open_t)vfscore_vop_nullop)
#define myramfs_close     ((vnop_close_t)vfscore_vop_nullop)
#define myramfs_seek      ((vnop_seek_t)vfscore_vop_nullop)
#define myramfs_ioctl     ((vnop_ioctl_t)vfscore_vop_einval)
#define myramfs_fsync     ((vnop_fsync_t)vfscore_vop_nullop)
#define myramfs_inactive  ((vnop_inactive_t)vfscore_vop_nullop)
#define myramfs_readdir ((vnop_readdir_t)vfscore_vop_nullop)
#define myramfs_mkdir ((vnop_mkdir_t)vfscore_vop_nullop)
#define myramfs_rmdir ((vnop_rmdir_t)vfscore_vop_nullop)
#define myramfs_getattr ((vnop_getattr_t)vfscore_vop_nullop)
#define myramfs_setattr	((vnop_setattr_t)vfscore_vop_nullop)
#define myramfs_truncate ((vnop_truncate_t)vfscore_vop_nullop)
#define myramfs_link      ((vnop_link_t)vfscore_vop_eperm)
#define myramfs_cache ((vnop_cache_t)vfscore_vop_nullop)
#define myramfs_fallocate ((vnop_fallocate_t)vfscore_vop_nullop)
#define myramfs_readlink ((vnop_readlink_t)vfscore_vop_nullop)
#define myramfs_symlink ((vnop_symlink_t)vfscore_vop_nullop)

/*
 * vnode operations
 */
struct vnops myramfs_vnops = {
		myramfs_open,             /* open */
		myramfs_close,            /* close */
		myramfs_read,             /* read */
		myramfs_write,            /* write */
		myramfs_seek,             /* seek */
		myramfs_ioctl,            /* ioctl */
		myramfs_fsync,            /* fsync */
		myramfs_readdir,          /* readdir */
		myramfs_lookup,           /* lookup */
		myramfs_create,           /* create */
		myramfs_remove,           /* remove */
		myramfs_rename,           /* remame */
		myramfs_mkdir,            /* mkdir */
		myramfs_rmdir,            /* rmdir */
		myramfs_getattr,          /* getattr */
		myramfs_setattr,          /* setattr */
		myramfs_inactive,         /* inactive */
		myramfs_truncate,         /* truncate */
		myramfs_link,             /* link */
		myramfs_cache,    			/* arc */
		myramfs_fallocate,        /* fallocate */
		myramfs_readlink,         /* read link */
		myramfs_symlink,          /* symbolic link */
};

