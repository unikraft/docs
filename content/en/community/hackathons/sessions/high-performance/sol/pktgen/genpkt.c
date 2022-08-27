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

#include <uk/print.h>
#include <uk/hexdump.h>
#include <errno.h>
#include <uk/netdev.h>
#include <uk/netbuf.h>
#include <uk/assert.h>
#include <uk/essentials.h>

#include "netdef.h"
#include "genpkt.h"

#define IPV4_HDR_LEN  (sizeof(struct ipv4_hdr))
#define UDP_HDR_LEN   (sizeof(struct udp_hdr))

#define ETHER_HDR_OFFSET     (0)
#define IPV4_HDR_OFFSET      (ETHER_HDR_OFFSET + ETHER_HDR_LEN)
#define UDP4_HDR_OFFSET      (IPV4_HDR_OFFSET  + IPV4_HDR_LEN)
#define UDP4_PAYLOAD_OFFSET  (UDP4_HDR_OFFSET  + UDP_HDR_LEN)

static uint16_t _ipv4_hdr_checksum_be16(struct ipv4_hdr *ipv4_hdr)
{
	uint16_t *p;
	uint16_t s = 0x0;
	uint16_t i;

	for (i = 0; i < sizeof(*ipv4_hdr); i++) {
		p = ((uint16_t *) ipv4_hdr) + i;

		/* skip checksum field */
		if (likely(p != &ipv4_hdr->hdr_checksum))
			s += rte_be_to_cpu_16(*p);
	}
	s += 0x2;
	s = ~s;
	return rte_cpu_to_be_16(s);
}

/**
 * Destructor that is called when packets that we created by
 * `genpkt_udp4()` are free'd. We use it to print a debug message only.
 */
static void _genpkt_dtor(struct uk_netbuf *nb __maybe_unused)
{
	uk_pr_debug("netbuf %p free'd\n", nb);
}


/* Make sure that a generated UDP IPV4 Ethernet frame fits into the minimum size */
UK_CTASSERT(UDP4_PAYLOAD_OFFSET <= UK_ETH_FRAME_MINLEN);
/* We assume packet size fit at most into UINT16_T */
UK_CTASSERT(UINT16_MAX >= UK_ETH_FRAME_UNTAGGED_MAXLEN);

struct uk_netbuf *genpkt_udp4(struct uk_alloc *a,
			      size_t ioalign,
			      uint16_t headroom,
			      uint16_t pktlen,
			      const struct ether_addr *mac_src,
			      const struct ether_addr *mac_dst,
			      uint32_t ipv4_src,
			      uint32_t ipv4_dst,
			      uint16_t port_src,
			      uint16_t port_dst,
			      uint8_t ttl)
{
	struct uk_netbuf *nb;
	struct ether_hdr *eth_hdr;
	struct ipv4_hdr *ipv4_hdr;
	struct udp_hdr *udp_hdr;
	uint16_t i;

	/*
	 * --------------------------------------------------------------------
	 * Check arguments
	 */
	UK_ASSERT(a); /* did we get an allocator? */
	UK_ASSERT(pktlen >= UK_ETH_FRAME_MINLEN
		  && pktlen <= UK_ETH_FRAME_UNTAGGED_MAXLEN); /* pktlen? */
	UK_ASSERT(mac_src); /* source mac address given */
	UK_ASSERT(mac_dst); /* destination mac address given */


	/*
	 * --------------------------------------------------------------------
	 * Allocate packet buffer
	 */
	nb = uk_netbuf_alloc_buf(a,
				 headroom + pktlen, /* buffer length */
				 ioalign,
				 headroom,
				 0, _genpkt_dtor);
	if (unlikely(!nb)) {
		 /* allocation failed */
		errno = ENOMEM;
		return NULL;
	}

	/*
	 * --------------------------------------------------------------------
	 * Generate headers
	 */
	eth_hdr  = (struct ether_hdr *)((char *) nb->data + ETHER_HDR_OFFSET);
	ipv4_hdr = (struct ipv4_hdr *)((char *) nb->data + IPV4_HDR_OFFSET);
	udp_hdr  = (struct udp_hdr *)((char *) nb->data + UDP4_HDR_OFFSET);

	ether_addr_copy(mac_src, &eth_hdr->s_addr);
	ether_addr_copy(mac_dst, &eth_hdr->d_addr);
	eth_hdr->ether_type = rte_cpu_to_be_16(ETHER_TYPE_IPv4);

	ipv4_hdr->src_addr = rte_cpu_to_be_32(ipv4_src);
	ipv4_hdr->dst_addr = rte_cpu_to_be_32(ipv4_dst);
	ipv4_hdr->packet_id = 0;
	ipv4_hdr->fragment_offset = 0;
	ipv4_hdr->type_of_service = 0;
	ipv4_hdr->version_ihl = 0x45; /* Version 4 and header length: 5x 32bits */
	ipv4_hdr->total_length = rte_cpu_to_be_16(pktlen - IPV4_HDR_OFFSET);
	ipv4_hdr->time_to_live = ttl;
	ipv4_hdr->next_proto_id = IPPROTO_UDP;
	ipv4_hdr->hdr_checksum = _ipv4_hdr_checksum_be16(ipv4_hdr);

	udp_hdr->src_port = rte_cpu_to_be_16(port_src);
	udp_hdr->dst_port = rte_cpu_to_be_16(port_dst);
	udp_hdr->dgram_len = rte_cpu_to_be_16(pktlen - UDP4_HDR_OFFSET);
	udp_hdr->dgram_cksum = 0x0; /* no UDP checksum */

	/*
	 * --------------------------------------------------------------------
	 * Payload
	 */
	for (i = UDP4_PAYLOAD_OFFSET; i < pktlen; ++i)
		*((char *) nb->data + i) = 'U';

	nb->len = pktlen;
	UK_ASSERT(nb->data + nb->len <= nb->buf + nb->buflen);

	uk_hexdumpd(nb->data, nb->len, UK_HXDF_GRPDWORD | UK_HXDF_ADDR, 2);

	return nb;
}
