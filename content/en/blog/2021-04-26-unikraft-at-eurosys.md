+++
title = "Unikraft: Fast, Specialized Unikernels the Easy Way"
date = "2021-04-26T00:00:00+01:00"
author = "Felipe Huici"
tags = ["announcement"]
+++

The open source Unikraft project is proud to announce that its paper titled
"Unikraft: Fast, Specialized Unikernels the Easy Way" has not only been accepted
at Eurosys, one of the top systems conferences in the world, but that it has
been bestowed with the prestigious Best Paper Award.

In addition, the paper has received the conference's 3 reproducibility badges,
meaning that the results in the paper have been reproduced by independent
reviewers; you can even try the experiments out yourself here:

  > https://github.com/unikraft/eurosys21-artifacts.

Unikraft's main goal is to bring unikernels, specialized virtual machines able
to provide excellent performance, into the mainstream.  Unikraft is a novel
micro-library OS that fully modularizes OS primitives so that it is easy to
customize the unikernel and include only relevant components and exposes a set
of composable, performance-oriented APIs in order to make it easy for developers
to obtain high performance. Our evaluation using off-the-shelf applications such
as nginx, SQLite, and Redis shows that running them on Unikraft results in a
1.7x-2.7x performance improvement compared to Linux guests. In addition,
Unikraft images for these apps are around 1MB, require less than 10MB of RAM to
run, and boot in around 1ms on top of the VMM time (total boot time 3ms-40ms).
The full paper can be found here:

  > https://dl.acm.org/doi/proceedings/10.1145/3447786

Beyond the paper, we have put a lot of work into developing
[kraft](https://github.com/unikraft/kraft), a tool that makes it easy to build
and start Unikraft-build unikernels. Further, we are in the
process of integrating Unikraft with major monitoring and orchestration tools
such as Kubernetes and Prometheus, so stay tuned for much more!

Unikraft is part of the Xen Project, a hosted project at the Linux Foundation
and can be found at www.unikraft.org. We'd be more than grateful if you took
Unikraft out for a spin and gave us feedback on what you think. Contributions
are, of course,  more than welcome!
