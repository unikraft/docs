---
title: "Session 06: Testing Unikraft"
linkTitle: "06. Testing Unikraft"
---

## 00. The Concept of Testing

In this session, we are going to explore the idea of validation by testing.
Even though our main focus will be testing, we'll also tackle other validation methods such as fuzzing and symbolic execution.
Before diving into how we can do testing on Unikraft, let's first focus on several key concepts that are used when talking about testing.

There are three types of testing: unit testing, integration testing and end-to-end testing.
To better understand the difference between them, we will look over an example of a webshop.
If we're testing the whole workflow (creating an account, logging in, adding products to a cart, placing an order) we will call this **end-to-end testing**.
Our shop also has an analytics feature that allows us to see a couple of data points such as: how many times an article was clicked on, how much time did a user look at it and so on.
To make sure the inventory module and the analytics module are working correctly (a counter in the analytics module increases when we click on a product), we will be writing **integration tests**.
Our shop also has at least an image for every product which should maximize when we're clicking on it. To test this, we would write a **unit test**.

Running the test suite after each change is called **regression testing**. **Automatic testing** means that the tests are run and verified automatically. **Automated regression testing** is the best practice in software engineering.

One of the key metrics used in testing is **code coverage**.
This is used to measure the percentage of code that is executed during a test suite run.

There are three common types of coverage:
* **Statement coverage**: the percentage of code statements that are run during the testing
* **Branch coverage**: the percentage of branches executed during the testing (e.g. if or while)
* **Path coverage**: the percentage of paths executed during the testing

We'll now go briefly over two other validation techniques: fuzzing and symbolic execution.

### Fuzzing

**Fuzzing** or fuzz testing is an automated software testing technique that involves providing invalid, unexpected, or random data as inputs to a computer program.
The program is then monitored for exceptions such as crashes, failing built-in code assertions, or potential memory leaks.

The most popular OS fuzzers are [kAFL](https://github.com/IntelLabs/kAFL) and [syzkaller](https://github.com/google/syzkaller), but research in this area is very active.

### Symbolic Execution

As per Wikipedia, **symbolic** execution is a means of analyzing a program to determine what inputs cause each part of a program to execute.
An interpreter follows the program, assuming symbolic values for inputs rather than obtaining actual inputs as normal execution of the program would.
An example of a program being symbolically executed can be seen in the figure below:

![Symbolic execution](/docs/sessions/06-testing-unikraft/images/symbex.png)

The most popular symbolic execution engines are KLEE, S2E and angr.

## 01. Existing Testing Frameworks

Nowadays, testing is usually done using a framework.
There is no single testing framework that can be used for everything but one has plenty of options to chose from.

### Linux Testing

The main framework used by Linux for testing is KUnit.
The building block of KUnit are test cases, functions with the signature `void (*)(struct kunit *test)`. For example:

```C++
void example_add_test(struct kunit *test)
{
  /* check if calling add(1,0) is equal to 1 */
  KUNIT_EXPECT_EQ(test, 1, add(1, 0));
}
```

We can use macros such as `KUNIT_EXPECT_EQ` to verify results.

A set of test cases is called a **test suite**.
In the example below, we can see how one can add a test suite.

```C
static struct kunit_case example_add_cases[] = {
        KUNIT_CASE(example_add_test1),
        KUNIT_CASE(example_add_test2),
        KUNIT_CASE(example_add_test3),
        {}
};

static struct kunit_suite example_test_suite = {
        .name = "example",
        .init = example_test_init,
        .exit = example_test_exit,
        .test_cases = example_add_cases,
};
kunit_test_suite(example_test_suite);
```

The API is pretty intuitive and thoroughly detailed in the [official documentation](https://01.org/linuxgraphics/gfx-docs/drm/dev-tools/kunit/usage.html).

KUnit is not the only tool used for testing Linux, there are tens of tools used to test Linux at any time:

* Test suites: Linux Test Project (collection of tools), static code analyzers (Coverity, coccinelle, smatch, sparse), module tests (KUnit), fuzzing tools (Trinity, Syzkaller) and subsystem tests.
* Automatic testing: kisskb, 0Day, kernelci, Kerneltests.

In the figure below, we can see that as more and better tools were developed we saw an increase in reported vulnerabilities.
There was a peak in 2017, after which a steady decrease which may be caused by the amount of tools used to verify patches before being upstreamed.

![arch selection menu](/docs/sessions/06-testing-unikraft/images/linux_vulnerabilities.png)

### OSV Testing

Let's see how another unikernel does the testing.
OSv uses a different approach.
They're using the Boost test framework alongside tests consisting of standalone simple applications.
For example, to test `read` they have the following [standalone app](https://github.com/cloudius-systems/osv/blob/master/tests/tst-read.cc), whereas for [testing thevfs](https://github.com/cloudius-systems/osv/blob/master/tests/tst-vfs.cc), they use boost.

### User Space Testing

Right now, there are a plethora of existing testing frameworks for different programming languages.
For example, Google Test is a testing framework for C++ whereas JUnit for Java.
Let's take a quick look at how Google Test works:

We have the following C++ code for the factorial in a function.cpp:

```C++
int Factorial(int n) {
  int result = 1;
  for (int i = 1; i <= n; i++) {
    result *= i;
  }

  return result;
}
```

To create a test file, we'll create a new C++ source that includes `gtest/gtest.h`
We can now define the tests using the `TEST` macro. We named this test `Negative` and added it to the `FactorialTest`.

```C++
TEST(FactorialTest, Negative) {
...
}
```

Inside the test we can write C++ code as inside a function and use existing macros for adding test checks via macros such as `EXPECT_EQ`, `EXPECT_GT`.

```C++
#include "gtest/gtest.h"

TEST(FactorialTest, Negative)
{
      EXPECT_EQ(1, Factorial(-5));
      EXPECT_EQ(1, Factorial(-1));
      EXPECT_GT(Factorial(-10), 0);
}
```

In order to run the test we add a main function similar to the one below to the test file that we have just created:

```C++
int main(int argc, char ∗∗argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
```

Easy?
This is not always the case, for example this [sample](https://github.com/google/googletest/blob/master/googletest/samples/sample9_unittest.cc) shows a more advanced and nested test.

## 02. Unikraft's Testing Framework

Unikraft's testing framework, `uktest`, has been inspired by KUnit and provides a flexible testing API.

### API Overview

To use the API you have to include `uk/test.h`.
To register a testsuite, we simply call `uk_testsuite_register`.

```C++
uk_testsuite_register(factorial_testsuite, NULL);
```

We use the macro `UK_TESTCASE` to both declare a test suite and add a test case to it:

```C++
UK_TESTCASE(testsuite_name, testcase1_name)
{
	UK_TEST_EXPECT_SNUM_EQ(some_function(2), 2);
}

UK_TESTCASE(testsuite_name, testcase2_name)
{
	UK_TEST_EXPECT_SNUM_EQ(some_other_function(2), 2);
}
```

The entire API can be found [here](https://github.com/unikraft/unikraft/blob/usoc21/lib/uktest/include/uk/test.h).

## 03. The Design behind Unikraft's Testing Framework

The key ideas that were followed when writing `uktest` are:

* Non-sophisticated. It should follow an existing framework (e.g. KUnit) in order to reuse the existing documentation and have a smaller learning curve
* Ability to specify when to run the tests during the boot process
* Written in C
* Should not conflict with other unit test frameworks (e.g. the one used for testing libraries and apps such as Google Test)
* BSD-compatible license
* Have the ability to write tests as a whole file or as in-line tests above a method

### How Tests Are Run

Unikraft boot process is centred around the idea of constructors.
Not to be confused with class constructors, Unikraft's constructors are simply functions registered in a special section inside the image and ran at boot time.
We use the `section` [attribute](https://gcc.gnu.org/onlinedocs/gcc-3.2/gcc/Variable-Attributes.html) from GCC to tell the compiler to a specific section inside the binary, in our case `.uk_ctortab`.
Later at boot, we go through each value stored in the section and run it:

```C++
uk_ctortab_foreach(ctorfn, __init_array_start, __init_array_end) {
  if (!*ctorfn)
    continue;

  uk_pr_debug("Call constructor: %p()...\n", *ctorfn);
  (*ctorfn)();
}
```

There are multiple such loops through the boot code found in `ukboot/boot.c`.
The testing framework simply registers the test function that needs to be called during the run.

### Key Functions and Data Structures

The key structure used is `uk_testcase` defined as:

```C++
struct uk_testcase {
	/* The name of the test case. */
	const char *name;
	/* Pointer to the method  */
	void (*func)(struct uk_testcase *self);
	/* The number of failed assertions in this case. */
	unsigned int failed_asserts;
	/* The number of assertions in this case. */
	unsigned int total_asserts;
};
```

The macro that we're using to check conditions is `UK_TEST_ASSERT`.
It is a wrapper over `_uk_test_do_assert`:

```C++
static inline void
_uk_test_do_assert(struct uk_testcase *esac, bool cond, const char *fmt, ...)
{
	...
	esac->total_asserts++;

	if (!cond) {
		esac->failed_asserts++;
	...
}
```

Basically, what the function does is to increment the number of failed asserts if the condition is false.

We've seen that `uk_testsuite_register` is used to register tests.
What this call boils down to is:

```C++
#define uk_test_at_initcall_prio(suite, class, prio)			\
	static int UK_TESTSUITE_FN(suite)(void)				\
	{								\
		uk_testsuite_add(&suite);				\
		uk_testsuite_run(&suite);				\
		return 0;						\
	}								\
	uk_initcall_class_prio(UK_TESTSUITE_FN(suite), class, prio)
```

We can see that `uk_initcall_class_prio` registers the newly defined function as a constructor to be called at a specific time during the boot process.
`uk_testsuite_add` simply adds the test suite to a linked listed of available test suites.
`uk_testsuite_run` simply iterates runs all the test cases in the test suite.

```C++
int
uk_testsuite_run(struct uk_testsuite *suite)
{
	...
	/* Iterate through all the registered test cases */
	uk_testsuite_for_each_case(suite, testcase) {

    /* Run the test case function
		testcase->func(testcase);

		/* If one case fails, the whole suite fails. */
		if (testcase->failed_asserts > 0)
			suite->failed_cases++;
	}
	...
}
```

## Work Items

In this work session we will go over writing and running tests for Unikraft.
We will use `uktest` and `Google Test`.
Make sure you are on the `usoc21` branch on the core Unikraft repo and `staging` on all others.
`uktest` should be enabled from the Kconfig.

### Support Files

Session support files are available [on Google Drive](https://drive.google.com/drive/folders/1PEDtvR5W-eMGQgbJusMcDPc6hS6ghYAl?usp=sharing).
You can use your own setup or the per cloned repos in `work.zip`.
Take a peek at the solutions in `sol.zip`.

### 01. Tutorial: Testing a Simple Application

We will begin this session with a very simple example.
We can use the `app-helloworld` as a starting point.
In `main.c` remove all the existing code.
The next step is to include `uk/test.h` and define the factorial function:

```C++
#include <uk/test.h>

int factorial(int n) {
  int result = 1;
  for (int i = 1; i <= n; i++) {
    result *= i;
  }

  return result;
}
```

We are now ready to add a test suite with a test case:

```C++
UK_TESTCASE(factorial_testsuite, factorial_test_positive)
{
       UK_TEST_EXPECT_SNUM_EQ(factorial(2), 2);
}

uk_testsuite_register(factorial_testsuite, NULL);
```

When we run this application, we should see the following output.

```
test: factorial_testsuite->factorial_test_positive
    :	expected `factorial(2)` to be 2 but was 2 ....................................... [ PASSED ]
```

Throughout this session we will extend this simple app that we have just written.

### 02. Adding a New Test Suite

For this task, you will have to modify the existing factorial application by adding a new function that computes if a number is prime.
Add a new testsuite for this function.

### 03. Tutorial: Testing vfscore

We begin by adding a new file for the tests called `test_stat.c` in a newly created folder `tests` in the `vfscore` internal library:

```Makefile
LIBVFSCORE_SRCS-$(CONFIG_LIBVFSCORE_TEST_STAT) += \
    $(LIBVFSCORE_BASE)/tests/test_stat.c
```

We then add the menuconfig option in the `if LIBVFSCORE` block:

```KConfig
menuconfig LIBVFSCORE_TEST
    bool "Test vfscore"
    select LIBVFSCORE_TEST_STAT if LIBUKTEST_ALL
    default n

if LIBVFSCORE_TEST

config LIBVFSCORE_TEST_STAT
    bool "test: stat()"
    select LIBRAMFS
    default n

endif
```

And finally add a new testsuite with a test case.

```C++
#include <uk/test.h>

#include <fcntl.h>
#include <errno.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/mount.h>

typedef struct vfscore_stat {
    int rc;
    int errcode;
    char *filename;
} vfscore_stat_t;

static vfscore_stat_t test_stats [] = {
    { .rc = 0,    .errcode = 0,        .filename = "/foo/file.txt" },
    { .rc = -1,    .errcode = EINVAL,    .filename = NULL },
};

static int fd;

UK_TESTCASE(vfscore_stat_testsuite, vfscore_test_newfile)
{
    /* First check if mount works all right */
    int ret = mount("", "/", "ramfs", 0, NULL);
    UK_TEST_EXPECT_SNUM_EQ(ret, 0);

    ret = mkdir("/foo", S_IRWXU);
    UK_TEST_EXPECT_SNUM_EQ(ret, 0);

    fd = open("/foo/file.txt", O_WRONLY | O_CREAT, S_IRWXU);
    UK_TEST_EXPECT_SNUM_GT(fd, 2);

    UK_TEST_EXPECT_SNUM_EQ(
        write(fd, "hello\n", sizeof("hello\n")),
        sizeof("hello\n")
    );
    fsync(fd);
}

/* Register the test suite */
uk_testsuite_register(vfscore_stat_testsuite, NULL);
```

We will be using a simple app without any main function to run the testsuite, the output should be similar with:

```
test: vfscore_stat_testsuite->vfscore_test_newfile
    :	expected `ret` to be 0 but was 0 ................................................ [ PASSED ]
    :	expected `ret` to be 0 but was 0 ................................................ [ PASSED ]
    :	expected `fd` to be greater than 2 but was 3 .................................... [ PASSED ]
    :	expected `write(fd, "hello\n", sizeof("hello\n"))` to be 7 but was 7 ............ [ PASSED ]
```

### 04. Add a Test Suite for nolibc

Add a new test suite for nolibc with four test cases in it.
You can use any POSIX function from nolibc for this task.
Feel free to look over the [documentation](https://github.com/lancs-net/unikraft/blob/nderjung/uktest/lib/uktest/include/uk/test.h) to write more complex tests.

### 05. Tutorial: Running Google Test on Unikraft

For this tutorial, we will use Google Test under Unikraft.
Aside from `lib-googletest`, we'll also need to have `libcxx`, `libcxxabi`, `libunwind`, `compiler-rt` and `newlib` because we're testing C++ code.

The second step is to enable the Google Test library and its config option `Build google test with main`.

We can now add a new cpp file, `main.cpp`.
Make sure that the files end in `.cpp` and not `.c`, otherwise you'll get lots of errors.
In the source file we'll include `gtest/gtest.h`
We will now be able to add our factorial function and test it.

```C++
int Factorial(int n) {
  int result = 1;
  for (int i = 1; i <= n; i++) {
    result *= i;
  }

  return result;
}

TEST(FactorialTest, Negative) {
  EXPECT_EQ(1, Factorial(-5));
  EXPECT_EQ(1, Factorial(-1));
  EXPECT_GT(Factorial(-10), 0);

}
```

If we run our unikernel, we should see the following output:

```
[==========] Running 1 test from 1 test case.
[----------] Global test environment set-up.
[----------] 1 test from FactorialTest
[ RUN      ] FactorialTest.Negative
[       OK ] FactorialTest.Negative (0 ms)
[----------] 1 test from FactorialTest (0 ms total)

[----------] Global test environment tear-down
[==========] 1 test from 1 test case ran. (0 ms total)
[  PASSED  ] 1 test.
```

We can see that in this case, the tests are being run after the main call, not before!

### 06. Tutorial (Bonus): Using KLEE for Symbolic Execution

One of the most popular symbolic execution engine is [KLEE](https://klee.github.io/).
For convenience, we'll be using Docker.

```Bash
docker pull klee/klee:2.1
docker run --rm -ti --ulimit='stack=-1:-1' klee/klee:2.1
```

Let's look over this regular expression program, can you spot any bugs?
We'll create a file `ex.c` with this code:

```C++
#include <stdio.h>

static int matchhere(char*,char*);

static int matchstar(int c, char *re, char *text) {
  do {
    if (matchhere(re, text))
      return 1;
  } while (*text != '\0' && (*text++ == c || c== '.'));
  return 0;
}

static int matchhere(char *re, char *text) {
  if (re[0] == '\0')
     return 0;
  if (re[1] == '*')
    return matchstar(re[0], re+2, text);
  if (re[0] == '$' && re[1]=='\0')
    return *text == '\0';
  if (*text!='\0' && (re[0]=='.' || re[0]==*text))
    return matchhere(re+1, text+1);
  return 0;
}

int match(char *re, char *text) {
  if (re[0] == '^')
    return matchhere(re+1, text);
  do {
    if (matchhere(re, text))
      return 1;
  } while (*text++ != '\0');
  return 0;
}

#define SIZE 7

int main(int argc, char **argv) {
  char re[SIZE];

  int count = read(0, re, SIZE - 1);
  //klee_make_symbolic(re, sizeof re, "re");

  int m = match(re, "hello");
  if (m) printf("Match\n", re);

  return 0;
}
```

Now, let's run this program symbolically.
To do this, we'll uncomment the `klee_make_symbol` line, and comment the line with `read` and `printf`.
We'll compile the program with `clang` this time:

```Bash
clang -c -g -emit-llvm  ex.c
```

And run it with KLEE:

```Bash
klee ex.bc
```

We'll see the following output:

```
KLEE: output directory is "/home/klee/klee-out-4"
KLEE: Using STP solver backend
KLEE: ERROR: ex1.c:13: memory error: out of bound pointer
KLEE: NOTE: now ignoring this error at this location
KLEE: ERROR: ex1.c:15: memory error: out of bound pointer
KLEE: NOTE: now ignoring this error at this location

KLEE: done: total instructions = 5314314
KLEE: done: completed paths = 7692
KLEE: done: generated tests = 6804
```

This tells us that KLEE has found two memory errors.
It also gives us some info about the number of paths and instructions executed.
After the run, a folder `klee-last` has been generated that contains all the test cases.
We want to find the ones that generated memory errors:

```
klee@affd7769bb39:~/klee-last$ ls | grep err
test000018.ptr.err
test000020.ptr.err
```

We look at testcase 18:

```
klee@affd7769bb39:~/klee-last$ ktest-tool test000018.ktest
ktest file : 'test000018.ktest'
args       : ['ex1.bc']
num objects: 1
object 0: name: 're'
object 0: size: 7
object 0: data: b'^\x01*\x01*\x01*'
object 0: hex : 0x5e012a012a012a
object 0: text: ^.*.*.*
```

This is just a quick example of the power of symbolic execution, but it comes with one great problem: path explosion.
When we have more complicated programs that have unbounded loops, the number of paths grows exponentially and thus symbolic execution is not viable anymore.

## Further Reading

* [6.005 Reading 3: Test](https://ocw.mit.edu/ans7870/6/6.005/s16/classes/03-testing/index.html#automated_testing_and_regression_testing)
* [A gentle introduction to Linux Kernel fuzzing](https://blog.cloudflare.com/a-gentle-introduction-to-linux-kernel-fuzzing/)
* [Symbolic execution with KLEE](https://adalogics.com/blog/symbolic-execution-with-klee)
* [Using KUnit](https://www.kernel.org/doc/html/latest/dev-tools/kunit/usage.html)
