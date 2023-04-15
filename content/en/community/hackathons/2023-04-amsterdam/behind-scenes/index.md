---
title: Behind the Scenes
date: 2023-04-13T05:33:37+10:00
weight: 3
summary: "We take a look inside Unikraft internals - its build system and runtime infrastructure. Expected time 75min."
---

## Overview

In this session we take a look of what's happening behind the scenes when building and running Unikraft.
We take a dive into the internals of the build system and how Unikraft works with different applications.
Each application requires a specific configuration that specializes the Unikraft image to its requirements.

### 01. Unikraft Core

{{< readfile file="/community/hackathons/sessions/behind-scenes/content/Overview_03.-Unikraft-Core.md" markdown="true" >}}

### 02. Configuring Unikraft

{{< readfile file="/community/hackathons/sessions/behind-scenes/content/Overview_05.-Configuring-Unikraft---Config.uk.md" markdown="true" >}}

### 03. Building Unikraft

{{< readfile file="/community/hackathons/sessions/behind-scenes/content/Overview_06.-The-Build-System---basics.md" markdown="true" >}}

### 04. Running Unikraft

{{< readfile file="/community/hackathons/sessions/behind-scenes/content/Overview_07.-Running-Unikraft.md" markdown="true" >}}

## Summary

{{< readfile file="/community/hackathons/sessions/behind-scenes/content/Summary.md" markdown="true" >}}

## Work Items

### Support Files

{{< readfile file="/community/hackathons/sessions/behind-scenes/content/Work-Items_Support-Files.md" markdown="true" >}}

### 01. Tutorial: Building and Running Unikraft helloworld

We want to build the [`helloworld` application](https://github.com/unikraft/app-helloworld), using the Kconfig-based system.

#### Set Up

{{< readfile file="/community/hackathons/sessions/behind-scenes/content/Work-Items_01.-Set-Up.md" markdown="true" >}}

#### KVM, x86_64

{{< readfile file="/community/hackathons/sessions/behind-scenes/content/Work-Items_01.-KVM-x86_64.md" markdown="true" >}}

### 02. Tutorial: Make It Speak

{{< readfile file="/community/hackathons/sessions/behind-scenes/content/Work-Items_02.-Tutorial:-Make-It-Speak.md" markdown="true" >}}

#### KVM, x86_64

{{< readfile file="/community/hackathons/sessions/behind-scenes/content/Work-Items_02.-KVM-x86_64.md" markdown="true" >}}

### 03. Tutorial: Adding Filesystems to an Application

{{< readfile file="/community/hackathons/sessions/behind-scenes/content/Work-Items_06.-Tutorial---Reminder:-Adding-Filesystems-to-an-Application.md" markdown="true" >}}
