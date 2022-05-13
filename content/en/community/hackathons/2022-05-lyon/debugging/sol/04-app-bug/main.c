#include <stdio.h>

int array_sum(int numbers[], int i);

int main() {
	
	int n=20000, sum;
	int numbers[100];

	sum = array_sum(numbers, n);

	printf("array sum: %d\n", sum);
	return 0;
}


int array_sum(int numbers[], int n) {
	int i;
	int sum = 0;

	for (i=0; i<=n; i++) {
		sum += numbers[i];
	}

	return sum;
}
