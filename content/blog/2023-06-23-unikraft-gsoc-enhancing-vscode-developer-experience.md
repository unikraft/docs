+++
title = "GSoC'23: Enhancing VS Code Developer Experience"
date = "2023-06-23T00:00:00+01:00"
author = "Md Sahil"
tags = ["GSoC'23", "VS Code", "IDE Extension"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

## Motivation

The VS Code Extension for Unikraft enables developers to quickly and painlessly build unikernels from the VS Code IDE.
Amongst other features, it allows developers to list and find unikernel libraries as well as run basic commands.
In this project, I will upgrade the VS Code extension to use [KraftKit](https://github.com/unikraft/kraftkit), the newly released CLI companion tool for Unikraft, written in Go.

### Summary of Objectives

This project aims to achieve the following outcomes:

* Modify the project's main binary, `kraft`, to enable JSON output of various commands, so that the integration with VS Code could be done through a machine-readable interface.
* Update VS Code IDE extension to function properly with new Go-based KraftKit.
* Additionally, enhance the experience, including adding support for other steps, in Unikraft's build cycle: package unikernels in different formats, provide linting.

## Current Progress

* Updated KraftKit to [provide output in configurable format](https://github.com/unikraft/kraftkit/pull/499) (JSON | YAML) for the commands `kraft pkg list` and `kraft ps`.
* [Updated VS Code IDE Extension's Unikraft-view](https://github.com/unikraft/ide-vscode/pull/7) to list available local components in the system and in the workspace `Kraftfile`.

## Next Steps

* Create a subcommand `show` for command `kraft pkg` in KraftKit.
  This produces information about a component like happens in [`pykraft`](https://github.com/unikraft/pykraft) by the command `kraft list show`.
* Make listing of versions possible when adding a new library/component using the IDE extension.
* Update the IDE to enable the initialization & other steps to work properly with KraftKit.

## About Me

I'm [Md Sahil](https://github.com/MdSahil-oss), a third year undergraduate student of Computer Science Engineering at [Maharshi Dayanand University](https://mdu.ac.in/).
