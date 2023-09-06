/* SPDX-License-Identifier: BSD-3-Clause */
/*
 * Unikraft Monkey Animation
 *
 * Authors: Simon Kuenzer <simon.kuenzer@neclab.eu>
 *
 *
 * Copyright (c) 2020, NEC Laboratories Europe GmbH, NEC Corporation.
 *                     All rights reserved.
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

#ifndef MONKEY_H
#define MONKEY_H

#ifdef __Unikraft__
#include <uk/config.h>
#include <uk/plat/console.h>
#endif /* __Unikraft__ */

#ifndef ARRAY_SIZE
#define ARRAY_SIZE(x) (sizeof(x) / sizeof((x)[0]))
#endif /* ARRAY_SIZE */

#if !MONKEY_COLORS && __Unikraft__
#if CONFIG_LIBUKBOOT_BANNER_POWEREDBY_ANSI || \
    CONFIG_LIBUKBOOT_BANNER_POWEREDBY_EAANSI || \
    CONFIG_LIBUKBOOT_BANNER_POWEREDBY_U8ANSI
/*
 * Gray monkey for blue Unikraft logo
 */
#define MC_RST   UK_ANSI_MOD_RESET
#define MC_BODY  MC_RST UK_ANSI_MOD_BOLD UK_ANSI_MOD_COLORFG(UK_ANSI_COLOR_BLACK)
#define MC_FACE  MC_RST UK_ANSI_MOD_COLORFG(UK_ANSI_COLOR_WHITE)
#define MC_EYE   MC_RST /* terminal default color */
#define MC_MOUTH MC_FACE
#define MONKEY_COLORS

#elif CONFIG_LIBUKBOOT_BANNER_POWEREDBY_ANSI2 || \
      CONFIG_LIBUKBOOT_BANNER_POWEREDBY_EAANSI2 || \
      CONFIG_LIBUKBOOT_BANNER_POWEREDBY_U8ANSI2
/*
 * Brown monkey for gray Unikraft logo
 */
#define MC_RST   UK_ANSI_MOD_RESET
#define MC_BODY  MC_RST UK_ANSI_MOD_COLORFG(UK_ANSI_COLOR_YELLOW)
#define MC_FACE  MC_RST UK_ANSI_MOD_BOLD UK_ANSI_MOD_COLORFG(UK_ANSI_COLOR_YELLOW)
#define MC_EYE   MC_RST /* terminal default color */
#define MC_MOUTH MC_FACE
#define MONKEY_COLORS

#endif
#endif /* !MONKEY_COLORS && __Unikraft__ */

#ifndef MONKEY_COLORS
/* No colors */
#define MC_RST   ""
#define MC_BODY  MC_RST
#define MC_FACE  MC_RST
#define MC_EYE   MC_RST
#define MC_MOUTH MC_RST
#endif /* !MONKEY_COLORS */

static const char *monkey3[] = {
	MC_RST "     " MC_BODY "_" MC_RST "               ",
	MC_RST "   " MC_FACE "c" MC_EYE "'" MC_MOUTH "_" MC_EYE "'" MC_FACE "o" MC_RST "  " MC_BODY ".--'" MC_RST "       ",
	MC_RST "   " MC_BODY "(| |)_/" MC_RST "           ",

	MC_RST "     " MC_BODY "_" MC_RST "               ",
	MC_RST "   " MC_FACE "c" MC_EYE "'" MC_MOUTH "o" MC_EYE "'" MC_FACE "o" MC_RST "  " MC_BODY ".--." MC_RST "       ",
	MC_RST "   " MC_BODY "(| |)_/" MC_RST "           ",

	MC_RST "     " MC_BODY "_" MC_RST "               ",
	MC_RST "   " MC_FACE "c" MC_EYE "'" MC_MOUTH "_" MC_EYE "'" MC_FACE "o" MC_RST "  " MC_BODY ".-." MC_RST "        ",
	MC_RST "   " MC_BODY "(| |)_/" MC_RST "   " MC_BODY "`" MC_RST "       ",

	MC_RST "     " MC_BODY "_" MC_RST "               ",
	MC_RST "   " MC_FACE "c" MC_EYE "'" MC_MOUTH "o" MC_EYE "'" MC_FACE "o" MC_RST "  " MC_BODY ".--." MC_RST "       ",
	MC_RST "   " MC_BODY "(| |)_/" MC_RST "           ",

	MC_RST "     " MC_BODY "_" MC_RST "               ",
	MC_RST "   " MC_FACE "c" MC_EYE "'" MC_MOUTH "_" MC_EYE "'" MC_FACE "o" MC_RST "  " MC_BODY ".--'" MC_RST "       ",
	MC_RST "   " MC_BODY "(| |)_/" MC_RST "           ",

	MC_RST "     " MC_BODY "_" MC_RST "               ",
	MC_RST "   " MC_FACE "c" MC_EYE "'" MC_MOUTH "_" MC_EYE "'" MC_FACE "o" MC_RST "  " MC_BODY ".--." MC_RST "       ",
	MC_RST "   " MC_BODY "(| |)_/" MC_RST "           ",

	MC_RST "     " MC_BODY "_" MC_RST "               ",
	MC_RST "   " MC_FACE "c" MC_EYE "'" MC_MOUTH "_" MC_EYE "'" MC_FACE "o" MC_RST "  " MC_BODY ".-." MC_RST "        ",
	MC_RST "   " MC_BODY "(| |)_/" MC_RST "   " MC_BODY "`" MC_RST "       ",

	MC_RST "     " MC_BODY "_" MC_RST "               ",
	MC_RST "   " MC_FACE "c" MC_EYE "'" MC_MOUTH "_" MC_EYE "'" MC_FACE "o" MC_RST "  " MC_BODY ".--." MC_RST "       ",
	MC_RST "   " MC_BODY "(| |)_/" MC_RST "           ",

	MC_RST "     " MC_BODY "_" MC_RST "               ",
	MC_RST "   " MC_FACE "c-" MC_MOUTH "_" MC_FACE "-o" MC_RST "  " MC_BODY ".--'" MC_RST "       ",
	MC_RST "   " MC_BODY "(| |)_/" MC_RST "           ",

	MC_RST "     " MC_BODY "_" MC_RST "               ",
	MC_RST "   " MC_FACE "c" MC_EYE "'" MC_MOUTH "_" MC_EYE "'" MC_FACE "o" MC_RST "  " MC_BODY ".--." MC_RST "       ",
	MC_RST "   " MC_BODY "(| |)_/" MC_RST "           ",

	MC_RST "     " MC_BODY "_" MC_RST "               ",
	MC_RST "   " MC_FACE "c" MC_EYE "'" MC_MOUTH "_" MC_EYE "'" MC_FACE "o" MC_RST "  " MC_BODY ".-." MC_RST "        ",
	MC_RST "   " MC_BODY "(| |)_/" MC_RST "   " MC_BODY "`" MC_RST "       ",

	MC_RST "     " MC_BODY "_" MC_RST "               ",
	MC_RST "   " MC_FACE "c" MC_EYE "'" MC_MOUTH "_" MC_EYE "'" MC_FACE "o" MC_RST "  " MC_BODY ".--." MC_RST "       ",
	MC_RST "   " MC_BODY "(| |)_/" MC_RST "           ",

	MC_BODY ".---" MC_RST "    " MC_BODY "_" MC_RST "            ",
	MC_BODY "`--,___" MC_FACE "c " MC_EYE "\"" MC_MOUTH "." MC_RST "          ",
	MC_RST "   " MC_BODY "(,--( \\" MC_RST "           ",

	MC_BODY ".--" MC_RST "      " MC_BODY "_" MC_RST "           ",
	MC_BODY "`---,___" MC_FACE "c " MC_EYE "\"" MC_MOUTH "." MC_RST "         ",
	MC_RST "    " MC_BODY "( \\-(," MC_RST "           ",

	MC_BODY ".-" MC_RST "        " MC_BODY "_" MC_RST "          ",
	MC_BODY "`---'\\___" MC_FACE "c " MC_EYE "\"" MC_MOUTH "." MC_RST "        ",
	MC_RST "     " MC_BODY "(,--( \\" MC_RST "         ",

	MC_BODY "." MC_RST "    " MC_BODY "_" MC_RST "     " MC_BODY "_" MC_RST "         ",
	MC_BODY "`---'" MC_RST " " MC_BODY "\\___" MC_FACE "c " MC_EYE "\"" MC_MOUTH "." MC_RST "       ",
	MC_RST "      " MC_BODY "( \\-(," MC_RST "         ",

	MC_RST "     " MC_BODY "_" MC_RST "      " MC_BODY "_" MC_RST "        ",
	MC_BODY "`---'" MC_RST " " MC_BODY "`,___" MC_FACE "c " MC_EYE "\"" MC_MOUTH "." MC_RST "      ",
	MC_RST "       " MC_BODY "(,--( \\" MC_RST "       ",

	MC_RST "     " MC_BODY "_" MC_RST "       " MC_BODY "_" MC_RST "       ",
	MC_RST " " MC_BODY "---'" MC_RST " " MC_BODY "`-,___" MC_FACE "c " MC_EYE "\"" MC_MOUTH "." MC_RST "     ",
	MC_RST "        " MC_BODY "( \\-(," MC_RST "       ",

	MC_RST "     " MC_BODY "_" MC_RST "        " MC_BODY "_" MC_RST "      ",
	MC_RST "  " MC_BODY "--'" MC_RST " " MC_BODY "`--,___" MC_FACE "c " MC_EYE "\"" MC_MOUTH "." MC_RST "    ",
	MC_RST "         " MC_BODY "(,--( \\" MC_RST "     ",

	MC_RST "     " MC_BODY "_" MC_RST "         " MC_BODY "_" MC_RST "     ",
	MC_RST "   " MC_BODY "-'" MC_RST " " MC_BODY "`---,___" MC_FACE "c " MC_EYE "\"" MC_MOUTH "." MC_RST "   ",
	MC_RST "          " MC_BODY "( \\-(," MC_RST "     ",

	MC_RST "     " MC_BODY "_" MC_RST "          " MC_BODY "_" MC_RST "    ",
	MC_RST "    " MC_BODY "'" MC_RST " " MC_BODY "`---'\\___" MC_FACE "c " MC_EYE "\"" MC_MOUTH "." MC_RST "  ",
	MC_RST "           " MC_BODY "(,--( \\" MC_RST "   ",

	MC_RST "     " MC_BODY "_" MC_RST "     " MC_BODY "_" MC_RST "     " MC_BODY "_" MC_RST "   ",
	MC_RST "      " MC_BODY "`---'" MC_RST " " MC_BODY "\\___" MC_FACE "c " MC_EYE "\"" MC_MOUTH "." MC_RST " ",
	MC_RST "            " MC_BODY "( \\-(," MC_RST "   ",

	MC_RST "           " MC_BODY "_" MC_RST "    " MC_BODY "_" MC_RST "    ",
	MC_RST "      " MC_BODY "`---'" MC_RST " " MC_BODY "|" MC_RST " " MC_FACE "c" MC_BODY "   " MC_FACE "o" MC_RST "  ",
	MC_RST "            " MC_BODY "\\_(|,|)" MC_RST "  ",

	MC_RST "             " MC_BODY "_" MC_RST "  " MC_BODY ".---." MC_RST,
	MC_RST "           " MC_MOUTH "." MC_EYE "\"" MC_FACE " o" MC_BODY "___,-'" MC_RST,
	MC_RST "            " MC_BODY "/ )--,)" MC_RST "  ",

	MC_RST "            " MC_BODY "_" MC_RST "    " MC_BODY "---." MC_RST,
	MC_RST "          " MC_MOUTH "." MC_EYE "\"" MC_FACE " o" MC_BODY "___,--'" MC_RST,
	MC_RST "            " MC_BODY ",)-/ )" MC_RST "   ",

	MC_RST "           " MC_BODY "_" MC_RST "      " MC_BODY "--." MC_RST,
	MC_RST "         " MC_MOUTH "." MC_EYE "\"" MC_FACE " o" MC_BODY "___,---'" MC_RST,
	MC_RST "          " MC_BODY "/ )--,)" MC_RST "    ",

	MC_RST "          " MC_BODY "_" MC_RST "        " MC_BODY "-." MC_RST,
	MC_RST "        " MC_MOUTH "." MC_EYE "\"" MC_FACE " o" MC_BODY "___/`---'" MC_RST,
	MC_RST "          " MC_BODY ",)-/ )" MC_RST "     ",

	MC_RST "         " MC_BODY "_" MC_RST "     " MC_BODY "_" MC_RST "    " MC_BODY "." MC_RST,
	MC_RST "       " MC_MOUTH "." MC_EYE "\"" MC_FACE " o" MC_BODY "___/" MC_RST " " MC_BODY "`---'" MC_RST,
	MC_RST "        " MC_BODY "/ )--,)" MC_RST "      ",

	MC_RST "        " MC_BODY "_" MC_RST "      " MC_BODY "_" MC_RST "     ",
	MC_RST "      " MC_MOUTH "." MC_EYE "\"" MC_FACE " o" MC_BODY "___,'" MC_RST " " MC_BODY "`---'" MC_RST,
	MC_RST "        " MC_BODY ",)-/ )" MC_RST "       ",

	MC_RST "       " MC_BODY "_" MC_RST "       " MC_BODY "_" MC_RST "     ",
	MC_RST "     " MC_MOUTH "." MC_EYE "\"" MC_FACE " o" MC_BODY "___,-'" MC_RST " " MC_BODY "`---" MC_RST " ",
	MC_RST "      " MC_BODY "/ )--,)" MC_RST "        ",

	MC_RST "      " MC_BODY "_" MC_RST "        " MC_BODY "_" MC_RST "     ",
	MC_RST "    " MC_MOUTH "." MC_EYE "\"" MC_FACE " o" MC_BODY "___,--'" MC_RST " " MC_BODY "`--" MC_RST "  ",
	MC_RST "      " MC_BODY ",)-/ )" MC_RST "         ",

	MC_RST "     " MC_BODY "_" MC_RST "         " MC_BODY "_" MC_RST "     ",
	MC_RST "   " MC_MOUTH "." MC_EYE "\"" MC_FACE " o" MC_BODY "___,---'" MC_RST " " MC_BODY "`-" MC_RST "   ",
	MC_RST "     " MC_BODY "/ )-,)" MC_RST "          ",

	MC_RST "    " MC_BODY "_" MC_RST "          " MC_BODY "_" MC_RST "     ",
	MC_RST "  " MC_MOUTH "." MC_EYE "\"" MC_FACE " o" MC_BODY "___,----'" MC_RST " " MC_BODY "`" MC_RST "    ",
	MC_RST "    " MC_BODY ",)-/ )" MC_RST "           ",
};

#define monkey3_frame_count (ARRAY_SIZE(monkey3) / 3)

#endif /* MONKEY_H */
