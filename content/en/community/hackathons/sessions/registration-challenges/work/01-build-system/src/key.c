#include <stdio.h>
#include <myheader.h>

extern char *key;
extern char *obf_string;
static char plain_string[PLAIN_SIZE];

static void deobfuscate(char *buffer, int len, char *key, int key_len)
{
	plain_string[len] = '\0';
	for (int i = 0; i < len; i++) {
		plain_string[i] = buffer[i] ^ key[i % key_len];
	}
}

char *get_key()
{
	deobfuscate(obf_string, PLAIN_SIZE, key, KEY_SIZE);
	return plain_string;
}
