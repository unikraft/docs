#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/random.h>

char surnames[20][50] = {"Smith",
"Johnson",
"Williams",
"Brown",
"Jones",
"Garcia",
"Miller",
"Davis",
"Rodriguez",
"Martinez",
"Hernandez",
"Lopez",
"Gonzales",
"Wilson",
"Anderson",
"Thomas",
"Taylor",
"Moore",
"Jackson",
"Martin"};

char firstnames[20][50] = {"Liam",
"Olivia",
"Noah",
"Emma",
"Oliver",
"Ava",
"Elijah",
"Charlotte",
"William",
"Sophia",
"James",
"Amelia",
"Benjamin",
"Isabella",
"Lucas",
"Mia",
"Henry",
"Evelyn",
"Alexander",
"Harper"};

char cities[10][50] = {"Lisbon",
"Tallinn",
"Bath",
"Bruges",
"Paris",
"Granada",
"Venice",
"Valletta"};

char occupations[7][50] = {"Management",
"Business",
"Computers",
"Architecture",
"Life",
"Community",
"Law"};

char movies[8][50] = {"Shawshank",
"Godfather",
"Godfather_2",
"Dark_Knight",
"12_Angry_Men",
"Schindler",
"Lord_of_the_Rings",
"Pulp_Fiction"};



struct secret_struct {
	char surname[50];
	char firstname[50];
	char city[50];
	char occupation[50];
	char favourite_movie[50];
};

/*so that gdb can see the secret_struct*/
volatile struct secret_struct unused_secret;

void __attribute__ ((noinline)) unveil_mystery(void *mystery) {
	printf("There is nothing but void in here\n");
	printf("Maybe you're looking for some pointers, here's one: %p\n", mystery);
}

int main()
{
	char buf[10];
	unsigned int flags = 0;
	char data[250];
	int i;
	char surname[50];
	char firstname[50];
	char city[50];
	char occupation[50];
	char favourite_movie[50];

	printf("%ld\n", sizeof(struct secret_struct));	
	printf("Welcome, hacker! You need to find something about me.\n");
	getrandom(buf, 10, flags);
	i = (unsigned int) buf[0] % 20;
	strncpy(data, surnames[i], 50);
	i = (unsigned int) buf[0] % 20;
	strncpy(data + 50, firstnames[i], 50); 
	i = (unsigned int) buf[0] % 10;
	strncpy(data + 100, cities[i], 50); 
	i = (unsigned int) buf[0] % 7;
	strncpy(data + 150, occupations[i], 50);
	i = (unsigned int) buf[0] % 8;
	strncpy(data + 200, movies[i], 49);

	unveil_mystery(&data);
	
	printf("Did you find anything?\n");
	printf("surname:\n");
	scanf("%50s", surname);
	if(strcmp(data, surname))
		goto fail;
	printf("firstname:\n");
	scanf("%50s", firstname);
	if(strcmp(data + 50, firstname))
		goto fail;	
	printf("city:\n");
	scanf("%50s", city);
	if(strcmp(data + 100, city))
		goto fail;	
	printf("occupation:\n");
	scanf("%50s", occupation);
	if(strcmp(data + 150, occupation))
		goto fail;	
	printf("favourite_movie:\n");
	scanf("%50s", favourite_movie);
	if(strcmp(data + 200, favourite_movie))
		goto fail;

	printf("\nCongratulations, you've revealed my secret!\n");
	
	return 0;

fail:
	printf("\nKeep trying ... you really don't want to know anything about me?\n");	
}
