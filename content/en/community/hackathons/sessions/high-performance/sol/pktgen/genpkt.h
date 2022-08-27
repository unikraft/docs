/* SPDX-License-Identifier: BSD-3-Clause */
/*
 * Packet Generator
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

#ifndef GENPKT_H
#define GENPKT_H

#include <stdint.h>
#include <stddef.h>
#include <uk/alloc.h>
#include "netdef.h"
#include <uk/netdev.h>

#ifdef __cplusplus
extern "C" {
#endif

/**
 * Generates an UDP IPv4 Ethernet packet with dummy data as uk_netbuf.
 * The packet is allocated from the allocator a.
 *
 *  @param a
 *    Allocator to use to allocate the netbuf
 *  @param bufalign
 *    Buffer alignment (see netdev requirements)
 *  @param headroom
 *    Reserved headroom for encapsulation (see netdev requirements)
 *  @param pktlen
 *    Preferred size of the total Ethernet frame
 *    (at least UK_ETH_FRAME_MINLEN, at most UK_ETH_FRAME_UNTAGGED_MAXLEN)
 *  @param mac_src
 *    Reference to source MAC address
 *  @param mac_dst
 *    Reference to destination MAC address
 *  @param ipv4_src
 *    Source IPv4 address in the IPv4 header
 *  @param ipv4_src
 *    Destination IPv4 address in the IPv4 header
 *  @param port_src
 *    Source UDP Port
 *  @param port_dst
 *    Destination UDP Port
 *  @param ttl
 *    Time-To-Live value in IPv4 header
 *    (number of hops (e.g., routers) the packet should survive)
 * @return
 *    - (NULL): Allocation failed
 *    - Reference to allocated netbuf
 */
struct uk_netbuf *genpkt_udp4(struct uk_alloc *a,
			      size_t bufalign,
			      uint16_t headroom,
			      uint16_t pktlen,
			      const struct ether_addr *mac_src,
			      const struct ether_addr *mac_dst,
			      uint32_t ipv4_src,
			      uint32_t ipv4_dst,
			      uint16_t port_src,
			      uint16_t port_dst,
			      uint8_t ttl);

/**
 * Shorthand of  genpkt_udp4() for USoC'21
 *
 * Some values are filled out for you:
 *  Destination mac, IPv4 addresses, port numbers, and TTL
 */
static inline struct uk_netbuf *genpkt_usoc21(struct uk_alloc *a,
					      size_t bufalign,
					      uint16_t headroom,
					      uint16_t pktlen,
					      const struct uk_hwaddr *mac_src)
{
	struct ether_addr mac_dst = {{ 0xff, 0xff, 0xff, 0xff, 0xff, 0xff }};
	//struct ether_addr mac_dst = {{ 0x20, 0xc1, 0xc5, 0x4d, 0xa7, 0x07 }};

	return genpkt_udp4(a,
			   bufalign,
			   headroom,
			   pktlen,
			   (const struct ether_addr *) mac_src,
			   &mac_dst,
			   IPv4(192, 168, 128, 1),
			   IPv4(192, 168, 128, 254),
			   5001,
			   5001,
			   64 /* TTL like Linux */ );
}

#ifdef __cplusplus
}
#endif

#endif /* GENPKT_H */
