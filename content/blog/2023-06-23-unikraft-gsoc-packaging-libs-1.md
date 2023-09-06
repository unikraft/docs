+++
title = "Packaging Pre-built Micro-libraries for Faster and More Secure Builds"
date = "2023-06-23T00:20:00+08:00"
author = "Zeyu Li"
tags = ["GSOC'23", "Build tools"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

## About Me

I am [Zeyu Li](https://github.com/zyllee), a second-year master at [Guizhou University](https://www.gzu.edu.cn/en/) in China.

This is my first time being involved in the open source project, and I am very glad to be able to join this friendly and enthusiastic community.

## Motivation

Currently, libraries in [KraftKit](https://github.com/unikraft/kraftkit) are accessed from source, either from a remote tarball or Git repository.
To speed up builds, pre-built libraries can be made and delivered before the main build process to speed up the overall build of the unikernel.

## Summary of Objectives

The goal of the project is to add a `kraft pkg` implementation.
When this project is complete, the specific order of use when building the application will be:

```text
kraft pkg update -> kraft pkg -> kraft build
```

The purpose of the `kraft pkg` is to pre-package the micro-libraries required by the application.

Here is an example.
`kraft.yaml` is used to find out which libraries are required.
Take `app-nginx` as an example;
all I need to do is pull the required versions of the `musl`, `lwip` and `nginx` micro-libraries, check and manipulate them, configure them according to `kraft.yaml`, and then package them into a tarball as a micro-library.
To speed up builds, pre-built libraries can be made and delivered before the main build process to speed up the overall build of the unikernel.

## Progress

What I've done so far is getting gradually familiar with the whole project when solving [issue #479](https://github.com/unikraft/kraftkit/pull/479).

The purpose of this issue is to modify all the error print formats by adding error tracing function.
When finishing this issue, all the errors can be located exactly, including error line numbers and error information.

When solving this issue, I've overcome two difficulties:

* I got accustomed to the GitHub collaborative workflow.
* I improved my familiarity with the whole project.

## Problems

While working on the issue, I had a lot of support from [Alexander Jung](https://github.com/nderjung) (my mentor).
He helped me with printing debug information better and doing tests for the code update.
This took more time than I expected.

I am very thankful for Alex's support.
He provided me with tutorials about how to use Git and the GitHub interface and workflow.
I'm now better accustomed to Git and GitHub, but solving conflicts is still a problem for me.
I will work on improving my skills in solving conflicts.

## Next Steps

In the future I plan to:

* Complete [issue #479](https://github.com/unikraft/kraftkit/pull/479).
* Discuss with Alex about the project details and do actual work in the project.
