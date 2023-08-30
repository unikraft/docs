+++
title = "GSoC'23: Arm CCA Support for Unikraft (Part 3)"
date = "2023-08-04T00:00:00+01:00"
author = "Xingjian Zhang"
tags = ["GSoC'23", "Security", "Arm CCA"]
+++

<img width="100px" src="https://summerofcode.withgoogle.com/assets/media/gsoc-2023-badge.svg" align="right" />

In the third quarter of GSoC, my work continues on bringing Arm CCA support to Unikraft.
After successfully [bringing `app-helloworld` to the realm world](./2023-07-14-unikraft-gsoc-arm-cca-2.md), this three-week work mainly focuses on implementing all the remaining RSI commands and adding tests on these interfaces.
This blog describes my progress and what this project may provide by the end of GSoC.

## Current Progress

The main focus of this period is to implement all the RSI commands and add tests on these interfaces.

The RSI commands help to protect applications in the Unikraft from the untrusted hypervisor and offer security operations like attestation and measurement.
The latest [Realm Management Monitor specification](https://developer.arm.com/documentation/den0137/latest/) specifies the following RSI commands:

* `RSI_ATTESTATION_TOKEN_CONTINUE`
* `RSI_ATTESTATION_TOKEN_INIT`
* `RSI_HOST_CALL`
* `RSI_IPA_STATE_GET`
* `RSI_IPA_STATE_SET`
* `RSI_MEASUREMENT_EXTEND`
* `RSI_MEASUREMENT_READ`
* `RSI_REALM_CONFIG`
* `RSI_VERSION`

A new `libukrsi` implements all these commands.
This library provides the APIs to pass parameters and get the return values of the RSI commands and uses `smccc_invoke` to invoke the commands.
It also provides functions like `uk_rsi_init` and `uk_rsi_setup_memory` that utilize the RSI commands to provide specific functionalities.

The unit test of the RSI commands uses the [`uktest`](https://unikraft.org/docs/develop/writing-tests/) framework.
The [`uktest`](https://unikraft.org/docs/develop/writing-tests/) framework provides a set of macros to define test cases and expected behaviors.
The test cases for `libukrsi` APIs follow the specification of the RSI commands, which defines both success and failure cases for each RSI command.
These test cases help to verify the correctness of the `libukrsi`'s implementation.

Besides working on `libukrsi` and its unit test, I also contributed two PRs relating to the serial console in Unikraft.
[PR #985](https://github.com/unikraft/unikraft/pull/985) adds two configurations to `ns16550`, so the serial driver can suit more use cases.
[PR #986](https://github.com/unikraft/unikraft/pull/986) migrates console APIs into a new `libukconsole`.
Each console provides an `ops` structure that implements console APIs, including `coutk`, `coutd`, `cink`, and `init`.

## Next Steps

As GSoC comes toward the end, the final three weeks of the project will focus on the following tasks:

* Improving current implementations.
* Wrapping up on existing PRs and possibly submitting new PRs to the Unikraft repository.
* Bringing more applications to the realm world and constructing a demo for the project.

## Acknowledgement

Thanks to all my mentors and the Unikraft community for their guidance and support.
