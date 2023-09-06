#include <stdio.h>
#include <uk/test.h>

int factorial(int n) {
  int result = 1;
  for (int i = 1; i <= n; i++) {
    result *= i;
  }

  return result;
}

int prime(int n){

	if (n < 2)
		return 0;
	else if (n == 2)
		return 1;
	else {
		for ( int i = 2; i * i <= n; i++ ) 
			if ( n % i == 0)
				return 0;
		return 1;
	}
}


UK_TESTCASE(factorial_testsuite, factorial_test_positive)
{
	UK_TEST_EXPECT_SNUM_EQ(factorial(2), 2);
}

UK_TESTCASE(prime_testsuite, prime_test_prime_number)
{
	UK_TEST_EXPECT_SNUM_EQ(prime(2), 1);
	UK_TEST_EXPECT_SNUM_EQ(prime(6), 0);
}

uk_testsuite_register(factorial_testsuite, NULL);
uk_testsuite_register(prime_testsuite, NULL);
