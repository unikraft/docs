#include "mycorelib.h"

extern const struct lib_tab _uk_lib_inittab_start;
extern const struct lib_tab _uk_lib_inittab_end; 

#define uk_for_each_tab(iter) 			\
	for (iter = &_uk_lib_inittab_start;	\
		iter < &_uk_lib_inittab_end;	\
		iter++)


void my_init_function(void)
{
	const struct lib_tab *iter;


	uk_for_each_tab(iter) {
		iter->init_func();
	}
}


void my_end_function(void)
{
	const struct lib_tab *iter;
	
	uk_for_each_tab(iter) {
		iter->end_func();
	}	
}
