---
title: Complex Applications
date: 2023-03-28T05:27:37+10:00
weight: 5
summary: "We will run full-fledged applications on top of Unikraft (nginx, redis, sqlite). Expected time: 75min."
---

## Overview

### Support Files

{{< readfile file="/community/hackathons/sessions/complex-applications/content/Work-Items_Support-Files.md" markdown="true" >}}

### Useful scripts

#### Qemu Wrapper

{{< readfile file="/community/hackathons/sessions/complex-applications/content/Work-Items_00.-Qemu-Wrapper.md" markdown="true" >}}

#### Wrappers to quickly setup and run the applications

In this session, we will do a step by step tutorial about how to set up from scratch some of the most popular applications that runs on top of Unikraft.
However, if you  want a **head start**, you can use one of the scripts from [github.com/unikraft-scripts](https://github.com/unikraft-upb/scripts).

First of all, you have to clone the repo:

```
$ git clone https://github.com/unikraft-upb/scripts.git unikraft-scripts
$ cd unikraft-scripts
```

If you want to start, for example,  the `nginx` application on Unikraft, you can run the following commands:

1. Getting all required resources to run the application

```
$ ./do-unikraft-nginx setup
```

2. Building the image for the application

```
$ ./do-unikraft-nginx build
```

3. Running the application

```
$ ./do-unikraft-nginx run
```

The script can be run from anywhere, as it would create a conventional local file hierarchy for building the Unikraft image.

### 01. SQLite

{{< readfile file="/community/hackathons/sessions/complex-applications/content/Work-Items_01.-SQLite-(Tutorial).md" markdown="true" >}}

### 02. SQLite New Filesystem

{{< readfile file="/community/hackathons/sessions/complex-applications/content/Work-Items_02.-SQLite-New-Filesystem-(Tutorial).md" markdown="true" >}}

### 03. Redis

{{< readfile file="/community/hackathons/sessions/complex-applications/content/Work-Items_03.-Redis-(Tutorial).md" markdown="true" >}}

### 04. Nginx

{{< readfile file="/community/hackathons/sessions/complex-applications/content/Work-Items_06.-Nginx.md" markdown="true" >}}
