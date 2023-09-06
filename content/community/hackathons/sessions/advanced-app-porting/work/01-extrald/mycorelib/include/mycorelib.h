#include<uk/essentials.h>

typedef int (*init_func_type)(void);
typedef void (*end_func_type)(void);

struct lib_tab {
	init_func_type init_func;
	end_func_type end_func;
};

// TODO 2: Define a registration macro into the new added section

void my_init_function(void);
void my_end_function(void);
