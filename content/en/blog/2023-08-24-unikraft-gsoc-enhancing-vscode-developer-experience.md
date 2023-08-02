+++
title = "GSoC'23: Enhancing VS Code Developer Experience"
date = "2023-08-24T00:00:00+01:00"
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

### Progress in the past 3 weeks (August 1 To August 22, 2023)

* [Added support for command `Clean` in vscode extension](https://github.com/unikraft/ide-vscode/pull/7).
* [Added support for command `Properclean` in vscode extension](https://github.com/unikraft/ide-vscode/pull/7).
* [Added support for command `Fetch` in vscode extension](https://github.com/unikraft/ide-vscode/pull/7).
* [Added support for command `Prepare` in vscode extension](https://github.com/unikraft/ide-vscode/pull/7).
* [Made some other enhacements/changes in vscode extension](https://github.com/unikraft/ide-vscode/pull/7) as per mentor suggestions.

## Next Steps

Now, Vscode IDE Extension is compatible with the newly created golang based CLI `Kraftkit` and all the basic commands are working fine which was the main objective of this project, But additional tasks are still remaining to be acomplished, that are:

* Adding support in Unikraft's build cycle for packaging unikernels in different formats.
* The provisioning of an [LSP](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide) that would allow checks when writing Unikraft code such that relevant libraries are imported or not.

That I'm planing to work on beyond GSoC.

## About Me

I'm [Md Sahil](https://github.com/MdSahil-oss), A third year undergraduate student of Computer Science Engineering at [Maharshi Dayanand University](https://mdu.ac.in/).
