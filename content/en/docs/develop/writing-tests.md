---
title: Writing Tests
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 502
---

## Writing tests

As of [Unikraft v0.6 (Dione)](https://unikraft.org/release/v0.6.0>), tests are a
mandatory addition to new Unikraft contribuitions when contributions are of the
following categories:

* New Unikraft core libraries (located within the core's `lib/` directory);
* New functions, methods or features; and,
* ...


This series introduces a minimal implementation testing infrastructure into Unikraft.  The primary contents includes the definition of a test (or suite of tests) and the mechanism by which one can use to register the suite to be run.

## Overview

In `uktest`, tests are organised hierarchically powered by the the lowest common denominator: the assertion.  This organisation is inspired by [KUnit](https://kunit.dev), the Linux Kernel's in-house testing system.  [For licensing reasons](#) the Unikraft project cannot use this source code.  However, by inspiration, we can organise the `uktest` library following a similar pattern:

 1. The assertion: repersents the lowest common denominator of a test: some   boolean operation which, when true, a single test passes.  Assertions are often used in-line and their usage should be no different to the  traditional use of the `ASSERT` macro.  In `uktest`, we introduce a new definition: `UK_TEST_EXPECT` which has one parameters: the same boolean opeation which is true-to-form of the traditional `ASSERT` macro.  With `uktest`, however, the macro is intelligently placed in context within a case (see 2.).  Additional text or descriptive explanation of the text can also be provided with the auxiliary and similar macro `UK_TEST_ASSERTF`.

 2. The test case: often, assertions are not alone in their means to check the legitimacy of operation in some function.  We find that a "case" is best way to organise a group of assertions in which one particular function of some system is under-going testing.  A case is independent of other cases, but related in the same sub-system.  For this reason we register them together in the same test suite.

 3. The test suite: represents a group of test cases.  This is the final and upper-most heirarchical repesentation of tests and their groupings.  With assertions grouped into test cases and test cases grouped into a test suite, we end this organisation in a fashion which allows us to follow a common design pattern within Unikraft: the registration model.  The syntax follows similar to other registation models within Unikraft, e.g. `ukbus`. However, `uktest`'s registation model is more powerful (see Test Execution).


## Creating tests

To register a test suite with `uktest`, we simply invokeuk_testsuite_register` with a unique symbol name.  This symbol is used along with test cases in order to create the references to one-another.  Each test case has only two input parameters: a reference to the suite is part, as well as a canonical name for the case itself.  Generally, the following pattern is used for test suites:

`$LIBNAME_$TESTSUITENAME_testsuite`

An the following for test cases:

`$LIBNAME_test_$TESTCASENAME`

To create a case, simply invoke the `UK_TESTCASE` macro with the two parameters describe previously, and use in the context of a function, for example:

```c
UK_TESTCASE(uktest_mycase_testsuite, uktest_test_case)
{
        int x = 1;
        UK_TEST_EXPECT(x > 0);
}
```

Finally, to register the case with a suite (see next section), call one of the possible registration functions:

```c
uk_testsuite_register(uktest_mycase_testsuite, NULL);
```

The above snippet can be organised within a library in a number of ways such as in-line or as an individual file representing the suite.  There are a number of test suite registration handles which are elaborated on in next section.  It should be noted that multiple test suites can exist within a library in order to test multiple features or components of said library.

{{< alert theme="info" >}}
### Recommended Conventions

In order to achieve consistency in the use of `uktest` across the Unikraft code base, the following recommendation is made regarding the registration of test suites:

1. A single test suite should be organised into its own file, prefixed with
   `test_`, e.g. `test_feature.c`.  This makes it easy to spot if tests for a
   library are being compiled in.
2. If there is more than one test suite for a library, all tests suites of the
   library should be stored within a new folder located at the root of the
   library named `tests/`.
3. All tests suites should have a corresponding KConfig option, prefixed with
   the library name and then the word "TEST", e.g. `LIBNAME_TEST_`.
4. Every library implementing one or more suite of tests must have a new
   menuconfig housing all test suite options under the name `LIBNAME_TEST`.
   This menuconfig option must invoke all the suites if `LIBUKTEST_ALL` is set
   to true.
{{< /alert >}}


## Registering tests

`uktest`'s registation model allows for the execution of tests at different levels of the boot process.  All tests occur before the invocation of the application's `main` method.  This is done such that the validity of the kernel-space functions can be legitimised before actual application code is invoked.  A fail-fast option is provided in order to crash the kernel in case of failures for earlier error diagnosis.

When registering a test suite, one can hook into either the constructor "`ctor`" table or initialisation table "`inittab`". This allows for running tests before or after certain libraries or sub-systems are invoked during the boot process.

The following registation methods are available:

 * `UK_TESTSUITE_AT_CTORCALL_PRIO`,
 * `uk_testsuite_early_prio`,
 * `uk_testsuite_plat_prio`,
 * `uk_testsuite_lib_prio`,
 * `uk_testsuite_rootfs_prio`,
 * `uk_testsuite_sys_prio`,
 * `uk_testsuite_late_prio`,
 * `uk_testsuite_prio` and,
 * `uk_testsuite_register`.

## Example test

## Enablng tests