/* SPDX-License-Identifier: BSD-3-Clause */
/*
 * Helpers to print network speed with Packets/s and Mbits/s
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

#include <stdio.h>
#include <inttypes.h>
#include <uk/assert.h>
#include <uk/essentials.h>
#include "netspeed.h"

int _print_pps(uint64_t nb_pkts, __nsec ns,
	       uint64_t *_prev_nb_pkts, __nsec *_prev_ns)
{
	__nsec ns_delta;
	uint64_t ppcs; /* packets per centisecond */
	int ret = 0;

	UK_ASSERT(_prev_nb_pkts);
	UK_ASSERT(_prev_ns);

	ns_delta = ns - (*_prev_ns);
	ppcs     = ((nb_pkts - (*_prev_nb_pkts)) * 100000000000) / ns_delta;

	if (unlikely(ns_delta == ns)) {
		/* We got called the first time: _prev_ns was 0 */
		ppcs = 0;
	}
	ret = printf("%9"PRIu64".%02"PRIu64" packets/sec\n",
		     ppcs / 100, ppcs % 100);

	(*_prev_ns)      = ns;
	(*_prev_nb_pkts) = nb_pkts;
	return ret;
}

int _print_bps(uint64_t nb_bytes, __nsec ns,
	       uint64_t *_prev_nb_bytes, __nsec *_prev_ns)
{
	__nsec ns_delta;
	uint64_t kbps; /* kbits per second */
	int ret = 0;

	UK_ASSERT(_prev_nb_bytes);
	UK_ASSERT(_prev_ns);

	ns_delta = ns - (*_prev_ns);
	kbps     = ((nb_bytes - (*_prev_nb_bytes)) * 8000000)  / ns_delta;

	if (unlikely(ns_delta == ns)) {
		/* We got called the first time: _prev_ns was 0 */
		kbps = 0;
	}
	ret = printf("%5"PRIu64".%03"PRIu64" Mbits/sec\n",
		     kbps / 1000, kbps % 1000);

	(*_prev_ns)       = ns;
	(*_prev_nb_bytes) = nb_bytes;
	return ret;
}

int _print_netspeed(uint64_t nb_pkts, uint64_t nb_bytes, __nsec ns,
		    uint64_t *_prev_nb_pkts, uint64_t *_prev_nb_bytes,
		    __nsec *_prev_ns)
{
	__nsec ns_delta;
	uint64_t ppcs; /* packets per centisecond */
	uint64_t kbps; /* kbits per second */
	int ret = 0;

	UK_ASSERT(_prev_nb_pkts);
	UK_ASSERT(_prev_nb_bytes);
	UK_ASSERT(_prev_ns);

	ns_delta = ns - (*_prev_ns);
	ppcs     = ((nb_pkts - (*_prev_nb_pkts)) * 100000000000) / ns_delta;
	kbps     = ((nb_bytes - (*_prev_nb_bytes)) * 8000000)  / ns_delta;

	if (unlikely(ns_delta == ns)) {
		/* We got called the first time: _prev_ns was 0 */
		ppcs = 0;
		kbps = 0;
	}
	ret = printf("%9"PRIu64".%02"PRIu64" packets/sec, "
		     "%5"PRIu64".%03"PRIu64" Mbits/sec\n",
		     ppcs / 100, ppcs % 100,
		     kbps / 1000, kbps % 1000);

	(*_prev_ns)      = ns;
	(*_prev_nb_pkts)  = nb_pkts;
	(*_prev_nb_bytes) = nb_bytes;
	return ret;
}
