#include <stdio.h>
#include <fortune.h>

int main(void)
{
  fortune_t *fortune = rand_fortune();
  printf("\"%s\"\n\t-- %s\n\n", fortune->quote, fortune->author);

  return 0;
}
