---
title: Build Process
date: 2020-01-11T14:09:21+09:00
weight: 203
---

## Unikraft Build Process

The lifecycle of the construction of a Unikraft unikernel includes several
distinct steps:

{{< img
  class="max-w-xl mx-auto"
  src="/assets/imgs/unikraft-overview.svg"
  title="Overview of the Unikraft build process."
  caption="...."
  alt="...."
  position="center"
>}}

1. Configuring the Unikraft unikernel application with compile-time options;
2. Fetching the remote "origin" code of libraries;
3. Preparing the remote "origin" code of libraries;
4. Compiling the libraries and the core Unikraft code; and,
5. Finally, linking a final unikernel executable binary together.

The above steps are displayed in the diagram.
The Unikraft unikernel targets a specific platform and hardware architecture, which are set during the configuration step of the lifecycle.

The steps in the lifecycle above are discussed in this tutorial in greater depth.
Particularly, we cover `fetch`ing, `prepare`ing and compiling (`build`ing) "external" code which is to be used as a Unikraft unikernel application (or library for that matter).

{{< img
  class="max-w-xl mx-auto"
  src="/assets/imgs/unikraft-build-process.svg"
  title="Steps of the Unikraft build process"
  caption="..."
  position="center"
>}}

