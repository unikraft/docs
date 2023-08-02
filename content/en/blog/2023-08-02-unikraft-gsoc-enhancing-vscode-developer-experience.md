+++
title = "GSoC'23: Enhancing VS Code Developer Experience"
date = "2023-08-02T00:00:00+01:00"
author = "Md Sahil"
tags = ["GSoC'23", "VS Code", "IDE Extension"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

# GSoC'23: Enhancing VS Code Developer Experience

## Motivation

The VS Code Extension for Unikraft enables developers to quickly and painlessly build unikernels from the VS Code IDE.
Amongst other features, it allows developers to list and find unikernel libraries as well as run basic commands.
In this project, I will upgrade the VS Code extension to use [KraftKit](https://github.com/unikraft/kraftkit),
the newly released CLI companion tool for Unikraft, written in Go.

### Summary of Objectives

This project aims to achieve the following outcomes:

* Modify the project's main binary, `kraft`, to enable JSON output of various commands, so that the integration with VS Code could be done through a machine-readable interface.
* Update VS Code IDE extension to function properly with new Go-based KraftKit.
* Additionally, enhance the experience, including adding support for other steps, in Unikraft's build cycle: package unikernels in different formats, provide linting.

### Progress in the past 3 weeks (July 10 To July 31, 2023)

* [Made enhancements in the created command `kraft lib create`](https://github.com/unikraft/kraftkit/pull/591) as per mentors suggestions.
* [Updated Vscode ide-extension's `initialise` command](https://github.com/unikraft/ide-vscode/pull/7/files#diff-f129d072035dff692c6f04605faa5bb8e3222dddf745f66c383d5fa01ef0463d) to support [`Kraftkit`](https://github.com/unikraft/kraftkit).
* [Updated Vscode ide-extension's `build` command](https://github.com/unikraft/ide-vscode/pull/7/files#diff-fb19954ad9c19d5004b1b36f4322497cb03dce0b6cf3377e2cf16873950c71a8) to support [`Kraftkit`](https://github.com/unikraft/kraftkit).
* [Updated Vscode ide-extension's `configure` command](https://github.com/unikraft/ide-vscode/pull/7/files#diff-9c8471ac0f2149c839cf25ec75c9516842dfd1e0621fe91cbfc0248cf68a7c3a) to support [`Kraftkit`](https://github.com/unikraft/kraftkit).
* [Updated Vscode ide-extension's `update` command](https://github.com/unikraft/ide-vscode/pull/7/files#diff-9c8471ac0f2149c839cf25ec75c9516842dfd1e0621fe91cbfc0248cf68a7c3a) to support [`Kraftkit`](https://github.com/unikraft/kraftkit).
* Also did some little-little tasks in [Vscode IDE-Extension](https://github.com/unikraft/ide-vscode/pull/7/files) to make it compatible with [`Kraftkit`](https://github.com/unikraft/kraftkit).

## Next Steps

* To make Vscode ide-extension's `run` command compatible with [Kraftkit](https://github.com/unikraft/kraftkit).
* Also, I have to make some improvements in the Vscode ide-extesion to make it consistent.

## About Me

I'm [Md Sahil](https://github.com/MdSahil-oss), A third year undergraduate student of Computer Science Engineering at [Maharshi Dayanand University](https://mdu.ac.in/).
