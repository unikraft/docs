/*-
 *   BSD LICENSE
 * 
 *   Copyright(c) 2010-2013 Intel Corporation. All rights reserved.
 *   All rights reserved.
 * 
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 * 
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *     * Neither the name of Intel Corporation nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 * 
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 *   LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *   DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 *   THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * Copyright (c) 1982, 1986, 1990, 1993
 *      The Regents of the University of California.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. All advertising materials mentioning features or use of this software
 *    must display the following acknowledgement:
 *      This product includes software developed by the University of
 *      California, Berkeley and its contributors.
 * 4. Neither the name of the University nor the names of its contributors
 *    may be used to endorse or promote products derived from this software
 *    without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 *
 *      @(#)in.h        8.3 (Berkeley) 1/3/94
 * $FreeBSD: src/sys/netinet/in.h,v 1.82 2003/10/25 09:37:10 ume Exp $
 */

#ifndef _NETDEF_H_
#define _NETDEF_H_

/**
 * @file
 *
 * Collection of networking protocol header definitions
 * copied from Intel DPDK and adopted for Unikraft
 *  librte_ether: rte_ether.h
 *  librte_net: rte_ip.h
 *  librte_net: rte_udp.h
 *  librte_net: rte_tcp.h
 *  librte_eal: rte_byteorder.h
 */

#ifdef __cplusplus
extern "C" {
#endif

#include <stdint.h>
#include <string.h> /* rte_memcpy -> memcpy */
#include <uk/config.h>
#if CONFIG_LIBUKSWRAND
#include <uk/swrand.h> /* rte_rand -> uk_swrand_randr */
#endif /* CONFIG_LIBUKSWRAND */

#define ETHER_ADDR_LEN  6 /**< Length of Ethernet address. */
#define ETHER_TYPE_LEN  2 /**< Length of Ethernet type field. */
#define ETHER_CRC_LEN   4 /**< Length of Ethernet CRC. */
#define ETHER_HDR_LEN   \
	(ETHER_ADDR_LEN * 2 + ETHER_TYPE_LEN) /**< Length of Ethernet header. */
#define ETHER_MIN_LEN   64    /**< Minimum frame len, including CRC. */
#define ETHER_MAX_LEN   1518  /**< Maximum frame len, including CRC. */
#define ETHER_MTU       \
	(ETHER_MAX_LEN - ETHER_HDR_LEN - ETHER_CRC_LEN) /**< Ethernet MTU. */

#define ETHER_MAX_VLAN_FRAME_LEN \
	(ETHER_MAX_LEN + 4) /**< Maximum VLAN frame length, including CRC. */

#define ETHER_MAX_JUMBO_FRAME_LEN \
	0x3F00 /**< Maximum Jumbo frame length, including CRC. */

#define ETHER_MAX_VLAN_ID  4095 /**< Maximum VLAN ID. */

/**
 * Ethernet address:
 * A universally administered address is uniquely assigned to a device by its
 * manufacturer. The first three octets (in transmission order) contain the
 * Organizationally Unique Identifier (OUI). The following three (MAC-48 and
 * EUI-48) octets are assigned by that organization with the only constraint
 * of uniqueness.
 * A locally administered address is assigned to a device by a network
 * administrator and does not contain OUIs.
 * See http://standards.ieee.org/regauth/groupmac/tutorial.html
 */
struct ether_addr {
	uint8_t addr_bytes[ETHER_ADDR_LEN]; /**< Address bytes in transmission order */
} __attribute__((__packed__));

#define ETHER_LOCAL_ADMIN_ADDR 0x02 /**< Locally assigned Eth. address. */
#define ETHER_GROUP_ADDR       0x01 /**< Multicast or broadcast Eth. address. */

/**
 * Check if an Ethernet address is filled with zeros.
 *
 * @param ea
 *   A pointer to a ether_addr structure containing the ethernet address
 *   to check.
 * @return
 *   True  (1) if the given ethernet address is filled with zeros;
 *   false (0) otherwise.
 */
static inline int is_zero_ether_addr(const struct ether_addr *ea)
{
	int i;
	for (i = 0; i < ETHER_ADDR_LEN; i++)
		if (ea->addr_bytes[i] != 0x00)
			return 0;
	return 1;
}

/**
 * Check if an Ethernet address is a unicast address.
 *
 * @param ea
 *   A pointer to a ether_addr structure containing the ethernet address
 *   to check.
 * @return
 *   True  (1) if the given ethernet address is a unicast address;
 *   false (0) otherwise.
 */
static inline int is_unicast_ether_addr(const struct ether_addr *ea)
{
	return ((ea->addr_bytes[0] & ETHER_GROUP_ADDR) == 0);
}

/**
 * Check if an Ethernet address is a multicast address.
 *
 * @param ea
 *   A pointer to a ether_addr structure containing the ethernet address
 *   to check.
 * @return
 *   True  (1) if the given ethernet address is a multicast address;
 *   false (0) otherwise.
 */
static inline int is_multicast_ether_addr(const struct ether_addr *ea)
{
	return (ea->addr_bytes[0] & ETHER_GROUP_ADDR);
}

/**
 * Check if an Ethernet address is a broadcast address.
 *
 * @param ea
 *   A pointer to a ether_addr structure containing the ethernet address
 *   to check.
 * @return
 *   True  (1) if the given ethernet address is a broadcast address;
 *   false (0) otherwise.
 */
static inline int is_broadcast_ether_addr(const struct ether_addr *ea)
{
	const uint16_t *ea_words = (const uint16_t *)ea;

	return (ea_words[0] == 0xFFFF && ea_words[1] == 0xFFFF &&
		ea_words[2] == 0xFFFF);
}

/**
 * Check if an Ethernet address is a universally assigned address.
 *
 * @param ea
 *   A pointer to a ether_addr structure containing the ethernet address
 *   to check.
 * @return
 *   True  (1) if the given ethernet address is a universally assigned address;
 *   false (0) otherwise.
 */
static inline int is_universal_ether_addr(const struct ether_addr *ea)
{
	return (ea->addr_bytes[0] & ETHER_LOCAL_ADMIN_ADDR) ? 0 : 1;
}

/**
 * Check if an Ethernet address is a locally assigned address.
 *
 * @param ea
 *   A pointer to a ether_addr structure containing the ethernet address
 *   to check.
 * @return
 *   True  (1) if the given ethernet address is a locally assigned address;
 *   false (0) otherwise.
 */
static inline int is_local_admin_ether_addr(const struct ether_addr *ea)
{
	return (ea->addr_bytes[0] & ETHER_LOCAL_ADMIN_ADDR) ? 1 : 0;
}

/**
 * Check if an Ethernet address is a valid address. Checks that the address is a
 * unicast address and is not filled with zeros.
 *
 * @param ea
 *   A pointer to a ether_addr structure containing the ethernet address
 *   to check.
 * @return
 *   True  (1) if the given ethernet address is valid;
 *   false (0) otherwise.
 */
static inline int is_valid_assigned_ether_addr(const struct ether_addr *ea)
{
	return (is_unicast_ether_addr(ea) && (! is_zero_ether_addr(ea)));
}

#if CONFIG_LIBUKSWRAND
/**
 * Generate a random Ethernet address that is locally administered
 * and not multicast.
 * @param addr
 *   A pointer to Ethernet address.
 */
static inline void eth_random_addr(uint8_t *addr)
{
	uint64_t rand = ((uint64_t) ((uint32_t) uk_swrand_randr()) << 32)
			| (uint64_t) ((uint32_t) uk_swrand_randr());
	uint8_t *p = (uint8_t*)&rand;

	memcpy(addr, p, ETHER_ADDR_LEN);
	addr[0] &= ~ETHER_GROUP_ADDR;       /* clear multicast bit */
	addr[0] |= ETHER_LOCAL_ADMIN_ADDR;  /* set local assignment bit */
}
#endif /* CONFIG_LIBUKSWRAND */

/**
 * Fast copy an Ethernet address.
 *
 * @param ea_from
 *   A pointer to a ether_addr structure holding the Ethernet address to copy.
 * @param ea_to
 *   A pointer to a ether_addr structure where to copy the Ethernet address.
 */
static inline void ether_addr_copy(const struct ether_addr *ea_from,
				   struct ether_addr *ea_to)
{
#ifdef __INTEL_COMPILER
	uint16_t *from_words = (uint16_t *)(ea_from->addr_bytes);
	uint16_t *to_words   = (uint16_t *)(ea_to->addr_bytes);

	to_words[0] = from_words[0];
	to_words[1] = from_words[1];
	to_words[2] = from_words[2];
#else
	/*
	 * Use the common way, because of a strange gcc warning.
	 */
	*ea_to = *ea_from;
#endif
}

/**
 * Ethernet header: Contains the destination address, source address
 * and frame type.
 */
struct ether_hdr {
	struct ether_addr d_addr; /**< Destination address. */
	struct ether_addr s_addr; /**< Source address. */
	uint16_t ether_type;      /**< Frame type. */
} __attribute__((__packed__));

/**
 * Ethernet VLAN Header.
 * Contains the 16-bit VLAN Tag Control Identifier and the Ethernet type
 * of the encapsulated frame.
 */
struct vlan_hdr {
	uint16_t vlan_tci; /**< Priority (3) + CFI (1) + Identifier Code (12) */
	uint16_t eth_proto;/**< Ethernet type of encapsulated frame. */
} __attribute__((__packed__));

/* Ethernet frame types */
#define ETHER_TYPE_IPv4 0x0800 /**< IPv4 Protocol. */
#define ETHER_TYPE_IPv6 0x86DD /**< IPv6 Protocol. */
#define ETHER_TYPE_ARP  0x0806 /**< Arp Protocol. */
#define ETHER_TYPE_RARP 0x8035 /**< Reverse Arp Protocol. */
#define ETHER_TYPE_VLAN 0x8100 /**< IEEE 802.1Q VLAN tagging. */
#define ETHER_TYPE_1588 0x88F7 /**< IEEE 802.1AS 1588 Precise Time Protocol. */

/**
 * IPv4 Header
 */
struct ipv4_hdr {
	uint8_t  version_ihl;		/**< version and header length */
	uint8_t  type_of_service;	/**< type of service */
	uint16_t total_length;		/**< length of packet */
	uint16_t packet_id;		/**< packet ID */
	uint16_t fragment_offset;	/**< fragmentation offset */
	uint8_t  time_to_live;		/**< time to live */
	uint8_t  next_proto_id;		/**< protocol ID */
	uint16_t hdr_checksum;		/**< header checksum */
	uint32_t src_addr;		/**< source address */
	uint32_t dst_addr;		/**< destination address */
} __attribute__((__packed__));

/** Create IPv4 address */
#define IPv4(a,b,c,d) ((uint32_t)(((a) & 0xff) << 24) | \
					   (((b) & 0xff) << 16) | \
					   (((c) & 0xff) << 8)  | \
					   ((d) & 0xff))

/* Fragment Offset * Flags. */
#define	IPV4_HDR_DF_SHIFT	14
#define	IPV4_HDR_MF_SHIFT	13
#define	IPV4_HDR_FO_SHIFT	3

#define	IPV4_HDR_DF_FLAG	(1 << IPV4_HDR_DF_SHIFT)
#define	IPV4_HDR_MF_FLAG	(1 << IPV4_HDR_MF_SHIFT)

#define	IPV4_HDR_OFFSET_MASK	((1 << IPV4_HDR_MF_SHIFT) - 1)

#define	IPV4_HDR_OFFSET_UNITS	8

/* IPv4 protocols */
#define IPPROTO_IP         0  /**< dummy for IP */
#define IPPROTO_HOPOPTS    0  /**< IP6 hop-by-hop options */
#define IPPROTO_ICMP       1  /**< control message protocol */
#define IPPROTO_IGMP       2  /**< group mgmt protocol */
#define IPPROTO_GGP        3  /**< gateway^2 (deprecated) */
#define IPPROTO_IPV4       4  /**< IPv4 encapsulation */
#define IPPROTO_TCP        6  /**< tcp */
#define IPPROTO_ST         7  /**< Stream protocol II */
#define IPPROTO_EGP        8  /**< exterior gateway protocol */
#define IPPROTO_PIGP       9  /**< private interior gateway */
#define IPPROTO_RCCMON    10  /**< BBN RCC Monitoring */
#define IPPROTO_NVPII     11  /**< network voice protocol*/
#define IPPROTO_PUP       12  /**< pup */
#define IPPROTO_ARGUS     13  /**< Argus */
#define IPPROTO_EMCON     14  /**< EMCON */
#define IPPROTO_XNET      15  /**< Cross Net Debugger */
#define IPPROTO_CHAOS     16  /**< Chaos*/
#define IPPROTO_UDP       17  /**< user datagram protocol */
#define IPPROTO_MUX       18  /**< Multiplexing */
#define IPPROTO_MEAS      19  /**< DCN Measurement Subsystems */
#define IPPROTO_HMP       20  /**< Host Monitoring */
#define IPPROTO_PRM       21  /**< Packet Radio Measurement */
#define IPPROTO_IDP       22  /**< xns idp */
#define IPPROTO_TRUNK1    23  /**< Trunk-1 */
#define IPPROTO_TRUNK2    24  /**< Trunk-2 */
#define IPPROTO_LEAF1     25  /**< Leaf-1 */
#define IPPROTO_LEAF2     26  /**< Leaf-2 */
#define IPPROTO_RDP       27  /**< Reliable Data */
#define IPPROTO_IRTP      28  /**< Reliable Transaction */
#define IPPROTO_TP        29  /**< tp-4 w/ class negotiation */
#define IPPROTO_BLT       30  /**< Bulk Data Transfer */
#define IPPROTO_NSP       31  /**< Network Services */
#define IPPROTO_INP       32  /**< Merit Internodal */
#define IPPROTO_SEP       33  /**< Sequential Exchange */
#define IPPROTO_3PC       34  /**< Third Party Connect */
#define IPPROTO_IDPR      35  /**< InterDomain Policy Routing */
#define IPPROTO_XTP       36  /**< XTP */
#define IPPROTO_DDP       37  /**< Datagram Delivery */
#define IPPROTO_CMTP      38  /**< Control Message Transport */
#define IPPROTO_TPXX      39  /**< TP++ Transport */
#define IPPROTO_IL        40  /**< IL transport protocol */
#define IPPROTO_IPV6      41  /**< IP6 header */
#define IPPROTO_SDRP      42  /**< Source Demand Routing */
#define IPPROTO_ROUTING   43  /**< IP6 routing header */
#define IPPROTO_FRAGMENT  44  /**< IP6 fragmentation header */
#define IPPROTO_IDRP      45  /**< InterDomain Routing*/
#define IPPROTO_RSVP      46  /**< resource reservation */
#define IPPROTO_GRE       47  /**< General Routing Encap. */
#define IPPROTO_MHRP      48  /**< Mobile Host Routing */
#define IPPROTO_BHA       49  /**< BHA */
#define IPPROTO_ESP       50  /**< IP6 Encap Sec. Payload */
#define IPPROTO_AH        51  /**< IP6 Auth Header */
#define IPPROTO_INLSP     52  /**< Integ. Net Layer Security */
#define IPPROTO_SWIPE     53  /**< IP with encryption */
#define IPPROTO_NHRP      54  /**< Next Hop Resolution */
/* 55-57: Unassigned */
#define IPPROTO_ICMPV6    58  /**< ICMP6 */
#define IPPROTO_NONE      59  /**< IP6 no next header */
#define IPPROTO_DSTOPTS   60  /**< IP6 destination option */
#define IPPROTO_AHIP      61  /**< any host internal protocol */
#define IPPROTO_CFTP      62  /**< CFTP */
#define IPPROTO_HELLO     63  /**< "hello" routing protocol */
#define IPPROTO_SATEXPAK  64  /**< SATNET/Backroom EXPAK */
#define IPPROTO_KRYPTOLAN 65  /**< Kryptolan */
#define IPPROTO_RVD       66  /**< Remote Virtual Disk */
#define IPPROTO_IPPC      67  /**< Pluribus Packet Core */
#define IPPROTO_ADFS      68  /**< Any distributed FS */
#define IPPROTO_SATMON    69  /**< Satnet Monitoring */
#define IPPROTO_VISA      70  /**< VISA Protocol */
#define IPPROTO_IPCV      71  /**< Packet Core Utility */
#define IPPROTO_CPNX      72  /**< Comp. Prot. Net. Executive */
#define IPPROTO_CPHB      73  /**< Comp. Prot. HeartBeat */
#define IPPROTO_WSN       74  /**< Wang Span Network */
#define IPPROTO_PVP       75  /**< Packet Video Protocol */
#define IPPROTO_BRSATMON  76  /**< BackRoom SATNET Monitoring */
#define IPPROTO_ND        77  /**< Sun net disk proto (temp.) */
#define IPPROTO_WBMON     78  /**< WIDEBAND Monitoring */
#define IPPROTO_WBEXPAK   79  /**< WIDEBAND EXPAK */
#define IPPROTO_EON       80  /**< ISO cnlp */
#define IPPROTO_VMTP      81  /**< VMTP */
#define IPPROTO_SVMTP     82  /**< Secure VMTP */
#define IPPROTO_VINES     83  /**< Banyon VINES */
#define IPPROTO_TTP       84  /**< TTP */
#define IPPROTO_IGP       85  /**< NSFNET-IGP */
#define IPPROTO_DGP       86  /**< dissimilar gateway prot. */
#define IPPROTO_TCF       87  /**< TCF */
#define IPPROTO_IGRP      88  /**< Cisco/GXS IGRP */
#define IPPROTO_OSPFIGP   89  /**< OSPFIGP */
#define IPPROTO_SRPC      90  /**< Strite RPC protocol */
#define IPPROTO_LARP      91  /**< Locus Address Resoloution */
#define IPPROTO_MTP       92  /**< Multicast Transport */
#define IPPROTO_AX25      93  /**< AX.25 Frames */
#define IPPROTO_IPEIP     94  /**< IP encapsulated in IP */
#define IPPROTO_MICP      95  /**< Mobile Int.ing control */
#define IPPROTO_SCCSP     96  /**< Semaphore Comm. security */
#define IPPROTO_ETHERIP   97  /**< Ethernet IP encapsulation */
#define IPPROTO_ENCAP     98  /**< encapsulation header */
#define IPPROTO_APES      99  /**< any private encr. scheme */
#define IPPROTO_GMTP     100  /**< GMTP */
#define IPPROTO_IPCOMP   108  /**< payload compression (IPComp) */
/* 101-254: Partly Unassigned */
#define IPPROTO_PIM      103  /**< Protocol Independent Mcast */
#define IPPROTO_PGM      113  /**< PGM */
#define IPPROTO_SCTP     132  /**< Stream Control Transport Protocol */
/* 255: Reserved */
/* BSD Private, local use, namespace incursion */
#define IPPROTO_DIVERT   254  /**< divert pseudo-protocol */
#define IPPROTO_RAW      255  /**< raw IP packet */
#define IPPROTO_MAX      256  /**< maximum protocol number */

/*
 * IPv4 address types
 */
#define IPV4_ANY              ((uint32_t)0x00000000) /**< 0.0.0.0 */
#define IPV4_LOOPBACK         ((uint32_t)0x7f000001) /**< 127.0.0.1 */
#define IPV4_BROADCAST        ((uint32_t)0xe0000000) /**< 224.0.0.0 */
#define IPV4_ALLHOSTS_GROUP   ((uint32_t)0xe0000001) /**< 224.0.0.1 */
#define IPV4_ALLRTRS_GROUP    ((uint32_t)0xe0000002) /**< 224.0.0.2 */
#define IPV4_MAX_LOCAL_GROUP  ((uint32_t)0xe00000ff) /**< 224.0.0.255 */

/*
 * IPv4 Multicast-related macros
 */
#define IPV4_MIN_MCAST  IPv4(224, 0, 0, 0)          /**< Minimal IPv4-multicast address */
#define IPV4_MAX_MCAST  IPv4(239, 255, 255, 255)    /**< Maximum IPv4 multicast address */

#define IS_IPV4_MCAST(x) \
	((x) >= IPV4_MIN_MCAST && (x) <= IPV4_MAX_MCAST) /**< check if IPv4 address is multicast */

/**
 * IPv6 Header
 */
struct ipv6_hdr {
	uint32_t vtc_flow;     /**< IP version, traffic class & flow label. */
	uint16_t payload_len;  /**< IP packet length - includes sizeof(ip_header). */
	uint8_t  proto;        /**< Protocol, next header. */
	uint8_t  hop_limits;   /**< Hop limits. */
	uint8_t  src_addr[16]; /**< IP address of source host. */
	uint8_t  dst_addr[16]; /**< IP address of destination host(s). */
} __attribute__((__packed__));

/**
 * UDP Header
 */
struct udp_hdr {
	uint16_t src_port;    /**< UDP source port. */
	uint16_t dst_port;    /**< UDP destination port. */
	uint16_t dgram_len;   /**< UDP datagram length */
	uint16_t dgram_cksum; /**< UDP datagram checksum */
} __attribute__((__packed__));

/**
 * TCP Header
 */
struct tcp_hdr {
	uint16_t src_port;  /**< TCP source port. */
	uint16_t dst_port;  /**< TCP destination port. */
	uint32_t sent_seq;  /**< TX data sequence number. */
	uint32_t recv_ack;  /**< RX data acknowledgement sequence number. */
	uint8_t  data_off;  /**< Data offset. */
	uint8_t  tcp_flags; /**< TCP flags */
	uint16_t rx_win;    /**< RX flow control window. */
	uint16_t cksum;     /**< TCP checksum. */
	uint16_t tcp_urp;   /**< TCP urgent pointer, if any. */
} __attribute__((__packed__));

/*
 * An internal function to swap bytes in a 16-bit value.
 *
 * It is used by rte_bswap16() when the value is constant. Do not use
 * this function directly; rte_bswap16() is preferred.
 */
static inline uint16_t
rte_constant_bswap16(uint16_t x)
{
	return (uint16_t)(((x & 0x00ffU) << 8) |
		((x & 0xff00U) >> 8));
}

/*
 * An internal function to swap bytes in a 32-bit value.
 *
 * It is used by rte_bswap32() when the value is constant. Do not use
 * this function directly; rte_bswap32() is preferred.
 */
static inline uint32_t
rte_constant_bswap32(uint32_t x)
{
	return  ((x & 0x000000ffUL) << 24) |
		((x & 0x0000ff00UL) << 8) |
		((x & 0x00ff0000UL) >> 8) |
		((x & 0xff000000UL) >> 24);
}

/*
 * An internal function to swap bytes of a 64-bit value.
 *
 * It is used by rte_bswap64() when the value is constant. Do not use
 * this function directly; rte_bswap64() is preferred.
 */
static inline uint64_t
rte_constant_bswap64(uint64_t x)
{
	return  ((x & 0x00000000000000ffULL) << 56) |
		((x & 0x000000000000ff00ULL) << 40) |
		((x & 0x0000000000ff0000ULL) << 24) |
		((x & 0x00000000ff000000ULL) <<  8) |
		((x & 0x000000ff00000000ULL) >>  8) |
		((x & 0x0000ff0000000000ULL) >> 24) |
		((x & 0x00ff000000000000ULL) >> 40) |
		((x & 0xff00000000000000ULL) >> 56);
}

/*
 * An architecture-optimized byte swap for a 16-bit value.
 *
 * Do not use this function directly. The preferred function is rte_bswap16().
 */
static inline uint16_t rte_arch_bswap16(uint16_t _x)
{
	register uint16_t x = _x;
	asm volatile ("xchgb %b[x1],%h[x2]"
		      : [x1] "=Q" (x)
		      : [x2] "0" (x)
		      );
	return x;
}

/*
 * An architecture-optimized byte swap for a 32-bit value.
 *
 * Do not use this function directly. The preferred function is rte_bswap32().
 */
static inline uint32_t rte_arch_bswap32(uint32_t _x)
{
	register uint32_t x = _x;
	asm volatile ("bswap %[x]"
		      : [x] "+r" (x)
		      );
	return x;
}

/*
 * An architecture-optimized byte swap for a 64-bit value.
 *
  * Do not use this function directly. The preferred function is rte_bswap64().
 */
#ifdef RTE_ARCH_X86_64
/* 64-bit mode */
static inline uint64_t rte_arch_bswap64(uint64_t _x)
{
	register uint64_t x = _x;
	asm volatile ("bswap %[x]"
		      : [x] "+r" (x)
		      );
	return x;
}
#else /* ! RTE_ARCH_X86_64 */
/* Compat./Leg. mode */
static inline uint64_t rte_arch_bswap64(uint64_t x)
{
	uint64_t ret = 0;
	ret |= ((uint64_t)rte_arch_bswap32(x & 0xffffffffUL) << 32);
	ret |= ((uint64_t)rte_arch_bswap32((x >> 32) & 0xffffffffUL));
	return ret;
}
#endif /* RTE_ARCH_X86_64 */


#ifndef RTE_FORCE_INTRINSICS
/**
 * Swap bytes in a 16-bit value.
 */
#define rte_bswap16(x) ((uint16_t)(__builtin_constant_p(x) ?		\
				   rte_constant_bswap16(x) :		\
				   rte_arch_bswap16(x)))

/**
 * Swap bytes in a 32-bit value.
 */
#define rte_bswap32(x) ((uint32_t)(__builtin_constant_p(x) ?		\
				   rte_constant_bswap32(x) :		\
				   rte_arch_bswap32(x)))

/**
 * Swap bytes in a 64-bit value.
 */
#define rte_bswap64(x) ((uint64_t)(__builtin_constant_p(x) ?		\
				   rte_constant_bswap64(x) :		\
				   rte_arch_bswap64(x)))

#else

/**
 * Swap bytes in a 16-bit value.
 * __builtin_bswap16 is only available gcc 4.8 and upwards
 */
#if __GNUC__ > 4 || (__GNUC__ == 4 && __GNUC_MINOR__ >= 8)
#define rte_bswap16(x) __builtin_bswap16(x)
#else
#define rte_bswap16(x) ((uint16_t)(__builtin_constant_p(x) ?		\
				   rte_constant_bswap16(x) :		\
				   rte_arch_bswap16(x)))
#endif

/**
 * Swap bytes in a 32-bit value.
 */
#define rte_bswap32(x) __builtin_bswap32(x)

/**
 * Swap bytes in a 64-bit value.
 */
#define rte_bswap64(x) __builtin_bswap64(x)

#endif

/**
 * Convert a 16-bit value from CPU order to little endian.
 */
#define rte_cpu_to_le_16(x) (x)

/**
 * Convert a 32-bit value from CPU order to little endian.
 */
#define rte_cpu_to_le_32(x) (x)

/**
 * Convert a 64-bit value from CPU order to little endian.
 */
#define rte_cpu_to_le_64(x) (x)


/**
 * Convert a 16-bit value from CPU order to big endian.
 */
#define rte_cpu_to_be_16(x) rte_bswap16(x)

/**
 * Convert a 32-bit value from CPU order to big endian.
 */
#define rte_cpu_to_be_32(x) rte_bswap32(x)

/**
 * Convert a 64-bit value from CPU order to big endian.
 */
#define rte_cpu_to_be_64(x) rte_bswap64(x)


/**
 * Convert a 16-bit value from little endian to CPU order.
 */
#define rte_le_to_cpu_16(x) (x)

/**
 * Convert a 32-bit value from little endian to CPU order.
 */
#define rte_le_to_cpu_32(x) (x)

/**
 * Convert a 64-bit value from little endian to CPU order.
 */
#define rte_le_to_cpu_64(x) (x)


/**
 * Convert a 16-bit value from big endian to CPU order.
 */
#define rte_be_to_cpu_16(x) rte_bswap16(x)

/**
 * Convert a 32-bit value from big endian to CPU order.
 */
#define rte_be_to_cpu_32(x) rte_bswap32(x)

/**
 * Convert a 64-bit value from big endian to CPU order.
 */
#define rte_be_to_cpu_64(x) rte_bswap64(x)

#ifdef __cplusplus
}
#endif

#endif /* _NETDEF_H_ */
