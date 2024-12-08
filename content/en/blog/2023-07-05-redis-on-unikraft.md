+++
title = "Redis on Unikraft"
date = "2023-07-05T21:25:00+03:00"
author = "Ioan-Teodor Țeugea"
tags = ["Redis", "unikernel", "Unikraft"]
+++

### Why Redis?

`Redis` is currently [the 6th most popular database management system](https://db-engines.com/en/ranking).
Its wide use, especially in cloud applications, make it perfect for running as an unikernel, with
all the [advantages](https://unikraft.org/docs/features/) this brings. We ported `Redis` to `Unikraft`,
both as a [native Unikraft image](https://github.com/unikraft/app-redis) and
as a [binary compatible application](https://github.com/unikraft/dynamic-apps/tree/master/redis7)
for use with [elfloader](https://github.com/unikraft/app-elfloader).

### So how good is it?

In order to measure the performance, we used the `redis-benchmark` tool to get the number of
processed requests per second. The setup simulated 50 clients in parallel, with a total of 1 million
requests for each test it ran.

We tested `Unikraft` in both native and binary compatibility modes. For the binary compatible application, we 
also tested an `LD_PRELOAD` optimization from [Tianyi Liu](https://github.com/i-Pear). We also compared the
performance of `Unikraft` to other common deployment methods:
- Running `Redis` directly on the host system
- Using the `Docker` container
- Using a regular virtual machine

{{< figure
    src="/assets/imgs/2023-07-05-redis-get-rps.png"
    title="Processed GET requests per second"
    position="center"
>}}

Using `Unikraft` resulted in significant performance increases. The native image  processed approximately 225k 
GET requests per second, while the binary compatibility mode with the `LD_PRELOAD` optimization had similar 
performance, at 231k requests per second and disabling this optimization resulted in 192k requests per second. 
The fastest  non-`Unikraft` method, the `Docker` container, processed around 167k GET requests per second.
This means that using `Unikraft` resulted in **a performance increase of up to 38.32%** compared
to `Docker` and even more compared to the other methods tested.

### What's next?

We plan to increase the performance of `Unikraft` even further, port and test even more applications and
create a method for automatically running and publishing benchmark analyses.
