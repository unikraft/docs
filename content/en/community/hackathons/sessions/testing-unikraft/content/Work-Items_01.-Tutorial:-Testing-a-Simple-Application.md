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
