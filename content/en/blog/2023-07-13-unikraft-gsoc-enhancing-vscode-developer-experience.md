+++
title = "GSoC'23: Enhancing VS Code Developer Experience"
date = "2023-07-13T00:00:00+01:00"
author = "Md Sahil"
tags = ["GSoC'23", "VS Code", "IDE Extension"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

# GSoC'23: Enhancing VS Code Developer Experience

## Motivation

The VS Code Extension for Unikraft enables developers to quickly and painlessly build unikernels from the VS Code IDE.
Amongst other features, it allows developers to list and find unikernel libraries as well as run basic commands.
In this project, I will upgrade the VS Code extension to use [KraftKit](https://github.com/unikraft/kraftkit), the newly released CLI companion tool for Unikraft, written in Go.

### Summary of Objectives

This project aims to achieve the following outcomes:

* Modify the project's main binary, `kraft`, to enable JSON output of various commands, so that the integration with VS Code could be done through a machine-readable interface.
* Update VS Code IDE extension to function properly with new Go-based KraftKit.
* Additionally, enhance the experience, including adding support for other steps, in Unikraft's build cycle: package unikernels in different formats, provide linting.

### Progress in the past 3 weeks (From June 19 To July 7, 2023)

* [Developed a subcommand `add` for the command `kraft pkg`](https://github.com/unikraft/kraftkit/pull/622) that pulls a new library to the project directory and updates `Kraftfile` of the project directory for the new added library.
* [Developed a subcommand `show` for the command `kraft pkg`](https://github.com/unikraft/kraftkit/pull/536) that shows manifest of a package in JSON|YAML format.
* [Developed a subcommand `prune` for the command `kraft pkg`](https://github.com/unikraft/kraftkit/pull/546) that prunes the library/libraries available on the host machine.
* [Developed a command `kraft lib create` for Kraftkit](https://github.com/unikraft/kraftkit/pull/591) just like `kraft lib init` in Pykraft to initiate a library template for development. 

## Next Steps

* My Next is to create more commands that will be used by IDE Extension to work properly with Kraftkit, Once all the commands are developed in Kraftkit that IDE Extension uses I'll start making further changes in IDE Extension for initialization & other operations.

## About Me

I'm [Md Sahil](https://github.com/MdSahil-oss), A third year undergraduate student of Computer Science Engineering at [Maharshi Dayanand University](https://mdu.ac.in/).
