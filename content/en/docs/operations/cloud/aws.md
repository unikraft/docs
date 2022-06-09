---
title: AWS
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 521
---

# AWS

Amazon Web Services (AWS) is a cloud computing platform provided by Amazon that includes a mixture of
Iaas, Paas, Saas. AWS services offer scalable solutions for compute, storage, databases, analytics, and
more.

AWS has data centers spread across availability zones in regions across the world so an AWS customer
can spin up virtual machines and replicate data in different AZs to achieve a highly reliable infrastructure that is resistant to failures of individual servers or an entire data center.

Amazon Elastic Compute Cloud (Amazon EC2) provides scalable computing capacity in the Amazon Web Services (AWS) Cloud. Using Amazon EC2 eliminates your need to invest in hardware up front, so you can develop and deploy applications faster. Amazon EC2 enables you to scale up or down to handle changes in requirements or spikes in popularity, reducing your need to forecast traffic.

## Drivers

## Elastic Network Adapter (ENA)

ENA is a custom network interface optimized to deliver high throughput and packet per second (PPS) performance, and consistently low latencies on EC2 instances.
Ena documentation can be found [here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/enhanced-networking-ena.html).

In order to run Unikraft on AWS with ENA we have to register the ENA driver to `uknetdev`.

The original open-source ENA drivers which we used as a model to develop our driver for Unikraft can be found at [amzn-drivers](https://github.com/amzn/amzn-drivers) for FreeBSD and [dpdk](https://github.com/DPDK/dpdk) for dpdk (at `drivers/net/ena`).

The source code for the Unikraft ENA driver can be found at the `plat/kvm/drivers/ena` subfolder.
The high-level view (function names, flow) of the driver should be the same as all the other drivers that already exist (e.g. FreeBSD, dpdk).
The difference will come from the low-level operations like memory allocation, synchronization, register
operations, etc. The platform specific operations for Unikraft can be found at `plat/kvm/drivers/ena/include/ena_defs/ena_plat_unikraft.h`.
