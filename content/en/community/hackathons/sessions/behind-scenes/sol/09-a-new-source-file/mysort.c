#include <stdlib.h>

static int compare(const void * a, const void *b)
{
	int a_int = *(int *)a, b_int = *(int *)b;

	return (a_int - b_int);
}

void mysort(int *arr, int nr)
{
	qsort(arr, nr, sizeof(*arr), compare);
}