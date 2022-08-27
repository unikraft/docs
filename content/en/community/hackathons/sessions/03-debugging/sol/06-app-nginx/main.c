#include <stdio.h>
#include <stdlib.h>
#include <uk/config.h>
extern int nginx_main(int argc, char *argv[]);

int main(int argc, char *argv[])
{
	int r;

	r = nginx_main(argc, argv);
	if (r) return r;

	return 0;
}
