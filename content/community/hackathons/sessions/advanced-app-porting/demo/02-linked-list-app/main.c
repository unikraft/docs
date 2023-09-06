#include <stdio.h>
#include <uk/list.h>
#include <stdlib.h>
#include <string.h>

struct car {
	char name[50];
	struct uk_list_head list;
};


static UK_LIST_HEAD(head_car);

struct car *allocate_car(char *name)
{
	struct car *car = malloc(sizeof(car));
	strcpy(car->name, name);
	return car;
}


void traverse()
{
	struct uk_list_head *pos;
	struct car *entry;

	printf("\n.....Traversing cars.....\n");
	uk_list_for_each(pos, &head_car) {
		entry = uk_list_entry(pos, struct car, list);
		printf("%s\n", entry->name);
	}

}

int main()
{
	struct car *c1, *c2, *c3;
	struct car *zero;
	struct uk_list_head *pos, *tmp;
	struct car *entry;


	c1 = allocate_car("BMW");
	c2 = allocate_car("Mercedes");
	c3 = allocate_car("Audi");
	

	printf("\nThe structure address for c1 is: %p\n", c1); 
	zero = (struct car *) 0;
	printf("The offset of list field inside car strucure is: %p\n",
		&zero->list);
	printf("The list field address for c1 is: %p\n",
		&c1->list);
	printf("The address of c1 based on calculation is %p\n",
		(void *) ((void *) &c1->list - (void *) &zero->list));

	uk_list_add(&c1->list, &head_car);
	uk_list_add(&c2->list, &head_car);
	uk_list_add(&c3->list, &head_car);


	traverse();

	printf("\n.....delete Mercedes from the list.....\n");
	uk_list_for_each_safe(pos, tmp, &head_car) {
		entry = uk_list_entry(pos, struct car, list);
		if (!strcmp(entry->name, "Mercedes")) {
			uk_list_del(pos);
			break;
		}
	}

	traverse();
}
