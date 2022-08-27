/* SPDX-License-Identifier: BSD-3-Clause */
/*
 * Extra netbuf routines
 *
 * Authors: Simon Kuenzer <simon.kuenzer@neclab.eu>
 *
 *
 * Copyright (c) 2021, NEC Europe Ltd., NEC Corporation. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

#ifndef NETBUF_H
#define NETBUF_H

#include <uk/netbuf.h>

#ifdef __cplusplus
extern "C" {
#endif

/**
 * Allocate a duplicate of a src netbuf. The data buffer area is copied
 * into the new netbuf.
 * Metadata (struct uknetbuf, priv) is placed at the end of the according
 * allocation.
 * @param a
 *   Allocator to be used for allocating `struct uk_netbuf` and the
 *   corresponding buffer area (single allocation).
 *   On uk_netbuf_free() and refcount == 0 the allocation is free'd
 *   to this allocator.
 * @param buflen
 *   Size of the buffer area
 * @param bufalign
 *   Alignment for the buffer area (`m->buf` will be aligned to it)
 * @param headroom
 *   Number of bytes reserved as headroom from the buffer area.
 *   `headroom` has to be smaller or equal to `buflen`.
 *   Please note that `m->data` is aligned when `headroom` is 0.
 *   In order to keep this property when a headroom is used,
 *   it is recommended to align up the required headroom.
 * @param privlen
 *   Length for reserved memory to store private data. This memory is free'd
 *   together with this netbuf. If privlen is 0, either no private data is
 *   required or external meta data corresponds to this netbuf. m->priv can be
 *   modified after the allocation.
 * @param dtor
 *   Destructor that is called when netbuf is free'd (optional)
 * @returns
 *   - (NULL): Allocation failed
 *   - initialized uk_netbuf
 */
struct uk_netbuf *uk_netbuf_dup_single(struct uk_alloc *a, size_t buflen,
				       size_t bufalign, uint16_t headroom,
				       size_t privlen, uk_netbuf_dtor_t dtor,
				       const struct uk_netbuf *src);

#ifdef __cplusplus
}
#endif

#endif /* NETBUF_H */
