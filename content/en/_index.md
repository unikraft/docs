---
title: Unikraft
description: Extreme Specialization for Security and Performance
date: 2020-01-26T04:15:05+09:00
draft: false
landing:
  quickStart: Quick Start
  notify:
    pill: New release
    text: v0.10.0 (Phoebe) is out!
    link: /blog/2022-08-20-unikraft-releases-phoebe
  viewOnGithub: View on GitHub
  whatsAUnikraft: What's a unikernel?
  leading: Unikraft is a fast, secure and open-source Unikernel Development Kit
  subtext: By tailoring the operating system, libraries and configuration to the particular needs of your application, it vastly reduces virtual machine and container image sizes to a few KBs, provides blazing performance, and drastically cuts down your software stack's attack surface.
  points:
    - text: Blazing fast
      link: "#blazing-fast"
    - text: Developer-friendly
      link: "#developer-friendly"
    - text: Small footprint & green
      link: "#small-footprint"
    - text: Cloud-native ready
      link: "#cloud-native-ready"
    - text: POSIX-compatible
      link: "#posix-compatible"
    - text: Fully modular
      link: "#fully-modular"
    - text: Research-backed
      link: "#research-backed"
    - text: Feature-rich
      link: "#fully-modular"
    - text: Production ready 
      link: "#production-ready"
blazingFast:
  feature: Blazing Fast
  header: Unikraft is faster than Linux
  leader: On Unikraft, NGINX is 166% faster than on Linux and 182% faster than on Docker
  left: <strong>Unikraft outperforms well-configured custom Linux kernel images</strong>, even those with security mitigations turned off!  Compared to other Unikernel Development Kits, library OSes and containers, Unikraft still comes out on top.
  right: We benchmarked NGINX throughput in terms of requests per second compared to other unikernels, Linux and Docker; Unikraft achieves 182% performance improvement with respect to Docker.
  callToAction: Unikraft has been extensively and carefully benchmarked, <a class=" font-medium text-blue-400 hover:underline" href="/docs/features/performance">read more about performance &rarr;</a>
developerFriendly:
  feature: Developer Friendly
  header: Build Unikernels Quickly and Easily
  about: With the Unikraft companion command-line client <code>kraft</code>, you can quickly and easily define, configure, build, and run unikernel applications.  Get everything from OS library dependencies to pre-built binaries and more.
  getStarted: Get started
multiFeature:
  learnMore: Learn more &rarr;
  id1: "#"
  icon1: /assets/imgs/pallet.svg
  feature1: High density
  leader1: Saturate servers and squeeze maximum utility.  1K+ VM guests on a single server.
  link1: /docs/features/performance
  id2: "#"
  icon2: /assets/imgs/binary-code.svg
  feature2: Binary Optimizations
  leader2: Optimize images with built-in Dead-Code Elimination, Link-Time Optizations and more.
  link2: /docs/features/performance
  id3: posix-compatible
  feature3: POSIX-compatible 
  leader3: With the more than 160+ syscalls and multiple lib-C's and standard libraries.
  link3: /docs/features/posix-compatibility
researchBacked:
  feature: Research Backed
  leader: Built and used by leading academic institutes and companies
  about: Unikraft's design, performance and security have been extensively developed, evaluated and put into production at leading companies and academic institutes.
  callToAction: The award-winning Unikraft research work has appeared in top-tier research and industry conferences, <a class="font-medium text-blue-400 hover:underline" href="/community/research">read more about research and development &rarr;</a>
fullyModular:
  feature: Fully Modular
  leader: Build highly customized, performant and secure VM images for your use case
  about: Unikraft is fully modular, with a constantly growing ecosystem with many popular open-source operating system and application libraries  like <code>musl</code> and <code>openssl</code> available for use, allowing you to pick and choose exactly what you need for your target application.
  featureRich: Feature Rich
  features:
    - count: 100+
      feature: <span class="font-medium text-white">Libraries</span> to choose from.
    - count: 25K+
      feature: <span class="font-medium text-white">Options</span> to configure your application with.
    - count: 160+
      feature: <span class="font-medium text-white">Syscalls</span> are available, covering more than 90% of use cases.
productionReady:
  feature: Production Ready
  leader: Runs on Major Cloud Platforms
  about: Along with major CPU architectures, Unikraft can be deployed on leading cloud providers.
  callToAction: To target a specific cloud vendor, <a class=" font-medium text-blue-400 hover:underline" href="/docs/operations/cloud/">read more about deployments &rarr;</a>
smallFootprint:
  feature: Small Footprint & green
  leading: Unikraft is green &amp; efficient
  about: From cloud to embedded devices, running an application on Unikraft both increases efficiency and reduces power consumption as less resources are necessary.
  bubble1heading: <span class="text-4xl">70%</span> less
  bubble1about: <span class="font-bold text-white">Power consumption</span> compared to Alpine Linux &amp; RaspianOS.
  bubble2heading: <span class="text-4xl">Kilobytes</span>
  bubble2about: <span class="font-bold text-white">Idle memory usage</span> for popular apps like NGINX or Redis.
  bubble3about: Unikraft supports <span class="font-medium">ARM</span> and <span class="font-medium">ARM64</span> architectures and popular platforms including <span class="font-medium">Raspberry Pi B+</span>.
  callToAction: Learn more about embedded devices &rarr;
cloudNativeReady:
  unikraftCloudPlatform: Unikraft Cloud Platform
  startFreeTrial: Sign-up for your free trial
  about: The cloud is essential to your business but you know you are overpaying.  Automatically deploy your app as an extremely efficient, green, and highly secure image with the click of a button on the <strong>Unikraft Cloud Platform</strong>.
  learnMore: Learn more
footer:
  sections:
    - title: Getting Started
      links:
        - title: What is a unikernel?
          link: /docs/concepts/
        - title: Install CLI companion tool
          link: /docs/usage/install
        - title: Unikraft Cloud
          link: https://unikraft.io
        - title: Help & Support
          link: /docs/help-and-support
    - title: Community
      links:
        - title: Meetings
          link: /community/events
        - title: Publications
          link: /community/publications
        - title: Presentations & Talks
          link: /community/talks
        - title: People
          link: /community/people
        - title: Privacy Policy
          link: /privacy
        - title: Imprint
          link: /imprint
    - title: Features
      links:
        - title: Performance
          link: /docs/features/performance
        - title: Security
          link: /docs/features/security
        - title: Environmental Impact
          link: /docs/features/green
        - title: POSIX-Compatibility
          link: /docs/features/posix-compatibility
  funding: Partly funded by the <span class="font-medium">European Union's Horizon 2020</span> research and innovation programme trough the <a class="font-medium hover:underline hover:text-white" href="http://unicore-project.eu/">UNICORE project</a>, grant agreeent No. 825377.
  copyright: "&copy; {year} The Unikraft Authors. All rights reserved. Documentation distributed under CC BY-NC 4.0."
---
