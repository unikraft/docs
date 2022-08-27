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

#ifndef NETSPEED_H
#define NETSPEED_H

#ifdef __cplusplus
extern "C" {
#endif

#include <stdint.h>
#include <uk/plat/time.h>

/* NOTE: Call print_pps() instead (see below) */
int _print_pps(uint64_t nb_pkts, __nsec ns,
	       uint64_t *_prev_nb_pkts, __nsec *_prev_ns);

/* NOTE: Call print_bps() instead (see below) */
int _print_bps(uint64_t nb_bytes, __nsec ns,
	       uint64_t *_prev_nb_pkts, __nsec *_prev_ns);

/* NOTE: Call print_netspeed() instead (see below) */
int _print_netspeed(uint64_t nb_pkts, uint64_t nb_bytes, __nsec ns,
		    uint64_t *_prev_nb_pkts, uint64_t *_prev_nb_bytes,
		    __nsec *_prev_ns);

/**
 * Print packets per second based on current total packet count
 *
 * @param total_nb_pkts
 *    Current total packet count (uint64_t)
 * @return
 *    - Number of bytes printed
 */
#define print_pps(total_nb_pkts)					\
	({								\
		static __nsec prev_ns = 0;				\
		static uint64_t prev_nb_pkts = 0;			\
									\
		_print_pps((total_nb_pkts), ukplat_monotonic_clock(),	\
			   &prev_nb_pkts, &prev_ns);			\
	})

/**
 * Print bits per second based on current total bytes count
 *
 * @param total_nb_bytes
 *    Current total bytes count (uint64_t)
 * @return
 *    - Number of bytes printed
 */
#define print_bps(total_nb_bytes)					\
	({								\
		static __nsec prev_ns = 0;				\
		static uint64_t prev_nb_bytes = 0;			\
									\
		_print_bps((total_nb_bytes), ukplat_monotonic_clock(),	\
			   &prev_nb_bytes, &prev_ns);			\
	})

/**
 * Print packets per second and bits per second based on current
 * total bytes count
 *
 * @param total_nb_bytes
 *    Current total bytes count (uint64_t)
 * @return
 *    - Number of bytes printed
 */
#define print_netspeed(total_nb_pkts, total_nb_bytes)			\
	({								\
		static __nsec prev_ns = 0;				\
		static uint64_t prev_nb_pkts  = 0;			\
		static uint64_t prev_nb_bytes = 0;			\
									\
		_print_netspeed((total_nb_pkts), (total_nb_bytes),	\
				ukplat_monotonic_clock(),		\
				&prev_nb_pkts, &prev_nb_bytes,		\
				&prev_ns);				\
	})

#ifdef __cplusplus
}
#endif

#endif /* NETSPEED_H */
