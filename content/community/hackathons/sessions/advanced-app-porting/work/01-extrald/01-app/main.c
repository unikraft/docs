#include <stdio.h>
#include <uk/list.h>
#include <stdlib.h>
#include <stdio.h>
#include <mycorelib.h>

int func_init1(void) {
	printf("Init function from app 01-app\n");
	return 0;
}

int func_init2(void) {
	printf("Init function from app 01-app\n");
	return 0;
}

void func_end1(void) {
	printf("End function from app 01-app\n");
}

void func_end2(void) {
	printf("End function from app 01-app\n");
}

// TODO 5: register these functions using the registration macro

int main()
{
	printf("\nCall init function from mycorelib\n");
	my_init_function();

	printf("\nCall end function from mycorelib\n");
	my_end_function();
}
