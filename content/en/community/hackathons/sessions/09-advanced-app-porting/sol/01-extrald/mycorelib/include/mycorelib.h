#include<uk/essentials.h>

typedef int (*init_func_type)(void);
typedef void (*end_func_type)(void);

struct lib_tab {
	init_func_type init_func;
	end_func_type end_func;
};

#define UK_LIB_INITTAB(func1, func2, prio) static const struct lib_tab	\
	__section(".uk_lib_inittab" # prio)				\
	__uk_lib_inittab_ ## prio __used __align(16)= 				\
		{.init_func = (func1),						\
		.end_func = (func2)};

void my_init_function(void);
void my_end_function(void);
