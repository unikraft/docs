#include <stdio.h>
#include <stdlib.h>

int main(void)
{
	FILE *in;
	char buffer[128];

	printf("Hello, world!\n");

	in = fopen("/grass", "rt");
	if (in == NULL) {
		fprintf(stderr, "Error opening file '/green'.");
		exit(EXIT_FAILURE);
	}
	fgets(buffer, 128, in);
	printf("File contents: %s\n", buffer);
	fclose(in);

	printf("Bye, world!\n");

	return 0;
}
