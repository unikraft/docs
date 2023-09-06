---
title: Licensing
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 502
---

## Unikraft License

Unikraft is licensed under [3-Clause BSD license](https://opensource.org/licenses/BSD-3-Clause) (SPDX short identifier: `BSD-3-Clause`), a permissive license which allows for re-use with modification provided that the license header remains.
This ensures that copyright and authorship remain in-tact and credit is given where credit is due, but allows Unikraft's code to be re-used for other purposes.
This license enables the wider community to reuse Unikraft source code for any use case they desire, provided authorship notice is preserved.

### Copyright Notices

Unikraft is organized into libraries where each might be individually licensed.
In general, each source file should declare who is the copyright owner and under which terms and conditions the code is licensed.
The main license of the project is the following `BSD-3-clause`s.
It applies in particular to source code files that do not declare a license and where there is no license information file (e.g., files `LICENSE`, `COPYING`) placed in the same or corresponding root folder.

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

In order to simplify working with license check tools, we add SPDX License Identifiers to the source files.
For C source or header files, this appears as follows:

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

For Makefiles, Python files, and other files which use a `#` symbol for commenting, this appears as follows:

```Makefile
# SPDX-License-Identifier: BSD-3-Clause
#
# Authors: ...
#
# Copyright (c) ...
#
# Redistribution...
```

## Use of GPL Code

Due to license incompatibility, code using GPL (General Public License) can not be added to the Unikraft code base.
Where a BSD licensed version is available, that is preferred.
In case there is no option of BSD-licensed code, the GPL code must be reimplemented and licensed under BSD-3-Clause.

## External Libraries

Unikraft makes extensive use of external libraries to facilitate the runtime of an application.
External libraries are to be "ported" on top of Unikraft: being able to be built using Unikraft core components.

Certain incompatibilities are to be fixed by patching the upstream version of the library.

A Unikraft library repository will consist of build scripts / recipes and patches, together with required files to build the library.
The upstream version of the library itself will not be part of the repository, rather it will be referenced with a URL.

As with Unikraft components, external libraries need to be implemented using a BSD-compatible license.
