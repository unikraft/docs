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
