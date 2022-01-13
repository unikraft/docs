---
title: Licensing
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 502
---

## Unikraft License

Unikraft is licensed under [BSD-3-Clause](#), a permissive license which allows
for re-use with modification provded that the license header remains.  This
ensures that copyright and authorship remain in-tact and credit is given where
credit is due, but allows Unikraft's code to be re-used for other purposes.
This license enables the wider community to ...

### Copyright Notices

Unikraft is organized into libraries where each might be individually licensed.
In general, each source file should declare who is the copyright owner and under
which terms and conditions the code is licensed.  The main license of the
project is the following `BSD-3-clause`s.  It applies in
particular to source code files that do not declare a license and where there is
no license information file (e.g., files `LICENSE`, `COPYING`) placed in the
same or corresponding root folder.

```txt
Copyright (c) YYYY, Copyright Holder.
                    All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
```

In order to simplify working with license check tools, we add SPDX License
Identifiers to the source files.  For C source or header files, this appears as
follows:

```c
/* SPDX-License-Identifier: BSD-3-Clause */
/**
  * Authors: ...
  *
  * Copyright (c) ...
  * 
  * Redistribution...
  */
```

For Makefiles, python files, and other files which use a `#` symbol for
commenting, this appears as follows:

```Makefile
# SPDX-License-Identifier: BSD-3-Clause
#
# Authors: ...
#
# Copyright (c) ...
#
# Redistribution...
```

## Use of GPLv2 Code


## External libraries

Unikraft makes extensive use of external libraries to facilitate the the runtime
of an application.  It is s

