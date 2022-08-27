#include <stdio.h>
#include <testutils_glue.h>

/* Import user configuration: */
#include <uk/config.h>

int main(void)
{
	run_all_libhogweed_tests(0);
	return 0;
}
