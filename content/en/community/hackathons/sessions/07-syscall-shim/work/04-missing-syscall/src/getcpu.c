#define _GNU_SOURCE
#include <stdio.h>
#include <unistd.h>
#include <sched.h>

int main(int argc, char *argv[])
{
	unsigned int cpu;

	printf("Here we are in the binary, calling getcpu\n");
	cpu = sched_getcpu();
	printf("Getcpu returned: %d\n", cpu);

	return 0;
}
