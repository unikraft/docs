#include <stdio.h>
#if CONFIG_APPHELLOWORLD_SORT
#include "mysort.h"
#endif /* CONFIG_APPHELLOWORLD_SORT */

/* Import user configuration: */
#ifdef __Unikraft__
#include <uk/config.h>
#endif /* __Unikraft__ */

#if CONFIG_APPHELLOWORLD_SPINNER
#include <time.h>
#include <errno.h>
#include "monkey.h"

static void millisleep(unsigned int millisec)
{
	struct timespec ts;
	int ret;

	ts.tv_sec = millisec / 1000;
	ts.tv_nsec = (millisec % 1000) * 1000000;
	do
		ret = nanosleep(&ts, &ts);
	while (ret && errno == EINTR);
}
#endif /* CONFIG_APPHELLOWORLD_SPINNER */

int main(int argc, char *argv[])
{
#if CONFIG_APPHELLOWORLD_PRINTARGS || CONFIG_APPHELLOWORLD_SPINNER
	int i;
#endif

	printf("Hello world!\n");

#if CONFIG_APPHELLOWORLD_SORT
	int array[100];

	for (int i = 0; i < 100; i++) {
		array[i] = 100 - i;
	}
	mysort(array, 100);
	for (int i = 0; i < 100; i++) {
		printf("%d ", array[i]);
	}
	printf("\n");
#endif /* CONFIG_APPHELLOWORLD_SORT */

#if CONFIG_APPHELLOWORLD_PRINTARGS
	printf("Arguments: ");
	for (i=0; i<argc; ++i)
		printf(" \"%s\"", argv[i]);
	printf("\n");
#endif /* CONFIG_APPHELLOWORLD_PRINTARGS */

#if CONFIG_APPHELLOWORLD_SPINNER
	i = 0;
	printf("\n\n\n");
	for (;;) {
		i %= (monkey3_frame_count * 3);
		printf("\r\033[2A %s \n", monkey3[i++]);
		printf(" %s \n",          monkey3[i++]);
		printf(" %s ",            monkey3[i++]);
		fflush(stdout);
		millisleep(250);
	}
#endif /* CONFIG_APPHELLOWORLD_SPINNER */
}
