#define _GNU_SOURCE
#include <stdio.h>
#include <uk/essentials.h>

struct my_structure {
	const char *name;
	int (*func)(void);
};

extern const struct my_structure my_section_start;
extern const struct my_structure my_section_end;

#define MY_REGISTER(s, f) static const struct my_structure	\
        __section(".my_section_entry")				\
        __my_section_var __used =				\
		{.name = (s),					\
		.func = (f)};



#define for_each_entry(iter)					\
	for (iter = &my_section_start;				\
		iter < &my_section_end;				\
		iter++)

int my_function(void)
{
	printf("BEST REGARDS FROM MY AWESOME FUCNTION\n");
	return 0;
}


MY_REGISTER("THIS_IS_THE_NAME", my_function);

int main()
{
	const struct my_structure *iter;
	printf("the size of my_structure is %ld\n", sizeof(struct my_structure));
	printf("the size of the section is %ld\n",
		(long) (&my_section_end)  - (long) (&my_section_start));
	printf("the address of the section is %p\n", &my_section_start);	

	printf("\n........iterating through section........\n");
	for_each_entry(iter) {
		printf("the name from this entry is: %s\n", iter->name);
		printf("now we'll call the function\n");
		iter->func();
	}
}
