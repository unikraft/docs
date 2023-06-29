#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <errno.h>

/* TODO bonus : add logger header */

#define BUFLEN 100
#define LISTEN_PORT 1234

/* TODO bonus: add a log_manager as parameter of this function */
int receive_and_send(int client_recvfd, int client_sendfd)
{
	char buf[BUFLEN];
	int bytes_send = 0;
	int bytes_received = 0;

	memset(buf, 0, BUFLEN);

	/* TODO: recv() buffer into buf; */
	/* bytes_received = ...*/

	if (bytes_received < 0) {
		fprintf(stderr, "bytes_received recv");
		return -1;
	}

	/* TODO: send() buf back */
	/* bytes_send = ... */	

	if (bytes_send < 0) {
		fprintf(stderr, "bytes_send send");
		return -1;
	}

	/* TODO bonus: parse commands */
	if (!strncmp(buf, "view logs", strlen("view logs"))) {}
	else if (!strncmp(buf, "delete logs", strlen("delete logs"))) {}
	else if (!strncmp(buf, "enable logs", strlen("enable logs"))) {}
	else if (!strncmp(buf, "disable logs", strlen("disable logs"))) {}

	/* TODO: if we receive a string different from the commads above write it in a file */

	return bytes_received;
}

int main(int argc, char* argv[])
{
	int listen_fd = -1;
	int err;
	struct sockaddr_in serv_addr;

	/* TODO bonus: declare a log manager*/

	/* TODO: open socket fd; */
	/* listen_fd = ... */

	/* TODO bonus: create a log_manager structure */

	if (listen_fd < 0) {
		fprintf(stderr, "socket");
		return 1;
	}

	int enable = 1;
	if (setsockopt(listen_fd, SOL_SOCKET, SO_REUSEADDR, &enable, sizeof(int)) == -1) {
		fprintf(stderr, "setsocketopt");
		return 1;
	}

	serv_addr.sin_family = AF_INET;
	serv_addr.sin_port = htons(LISTEN_PORT);
	serv_addr.sin_addr.s_addr = INADDR_ANY;

	/* TODO: bind() the socket; */
	/* err =  ... */

	if (err < 0) {
		fprintf(stderr, "bind");
		return 1;
	}

	struct sockaddr_in client_addr;

	int bytes_received;
	int conn_fd = -1;
	socklen_t socket_len = sizeof(struct sockaddr_in);

	listen(listen_fd, 1);

	/* TODO: accept() new connection; */
	/* conn_fd = ... */

	if (conn_fd < 0) {
		fprintf(stderr, "conn_fd accept");
		return 1;
	}

	do {
		/* TODO bonus: add a log_manager as argument of this function */
		bytes_received = receive_and_send(conn_fd, conn_fd);
	} while (bytes_received > 0);

	/* TODO: close file descriptors */

	/* TODO bonus: destroy the log manager */

	return 0;
}
