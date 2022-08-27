#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <errno.h>

#define BUFLEN 100
#define LISTEN_PORT 1234

int receive_and_send(int filefd, int client_recvfd, int client_sendfd)
{
	char buf[BUFLEN];
	int bytes_send;
	int bytes_received = 0;

	memset(buf, 0, BUFLEN);
	bytes_received = recv(client_recvfd, buf, BUFLEN, 0);
	if (bytes_received < 0) {
		perror("bytes_received recv");
		exit(1);
	}

        // write to file before echoing back

        // rot13

	bytes_send = send(client_sendfd, buf, BUFLEN, 0);
	if (bytes_send < 0) {
		perror("bytes_send send");
		exit(1);
	}

	return bytes_received;
}

int main(int argc, char* argv[])
{
	int listenfd = -1;
	struct sockaddr_in serv_addr;

	int filefd = // open() the file you want to store the strings in;
	if (filefd < 0) {
		perror("socket");
		exit(1);
	}

	lseek(filefd, 0, SEEK_SET);

	listenfd = socket(AF_INET, SOCK_STREAM, 0);
	if (listenfd < 0) {
		perror("socket");
		exit(1);
	}

	int enable = 1;
	if (setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &enable, sizeof(int)) == -1) {
		perror("setsocketopt");
		exit(1);
	}

	serv_addr.sin_family = AF_INET;
	serv_addr.sin_port = htons(LISTEN_PORT);
	serv_addr.sin_addr.s_addr = INADDR_ANY;

	int err = bind(listenfd, (struct sockaddr *)&serv_addr, sizeof(serv_addr));
	if (err < 0) {
		perror("bind");
		exit(1);
	}

	struct sockaddr_in client_addr;

	int bytes_received;
	int connfd = -1;
	socklen_t socket_len = sizeof(struct sockaddr_in);

	listen(listenfd, 1);

	connfd = accept(listenfd, (struct sockaddr*)&client_addr, &socket_len);
	if (connfd < 0) {
		perror("connfd accept");
	}

	do {
		bytes_received = receive_and_send(filefd, connfd, connfd);
	} while (bytes_received > 0);

	close(connfd);

	close(listenfd);

        // close() filefd

	return 0;
}

