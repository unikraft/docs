#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <errno.h>

#define BUFLEN 100
#define LISTEN_PORT 1234

int receive_and_send(int file_fd, int client_recvfd, int client_sendfd)
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

    // TODO: write to file before echoing back

    // TODO: apply rot13

	bytes_send = send(client_sendfd, buf, BUFLEN, 0);
	if (bytes_send < 0) {
		perror("bytes_send send");
		exit(1);
	}

	return bytes_received;
}

int main(int argc, char* argv[])
{
	int listen_fd = -1;
	struct sockaddr_in serv_addr;

	// TODO: open() the file you want to store the strings in;
	int file_fd =

	if (file_fd < 0) {
		perror("socket");
		exit(1);
	}

	lseek(file_fd, 0, SEEK_SET);

	listen_fd = socket(AF_INET, SOCK_STREAM, 0);
	if (listen_fd < 0) {
		perror("socket");
		exit(1);
	}

	int enable = 1;
	if (setsockopt(listen_fd, SOL_SOCKET, SO_REUSEADDR, &enable, sizeof(int)) == -1) {
		perror("setsocketopt");
		exit(1);
	}

	serv_addr.sin_family = AF_INET;
	serv_addr.sin_port = htons(LISTEN_PORT);
	serv_addr.sin_addr.s_addr = INADDR_ANY;

	int err = bind(listen_fd, (struct sockaddr *)&serv_addr, sizeof(serv_addr));
	if (err < 0) {
		perror("bind");
		exit(1);
	}

	struct sockaddr_in client_addr;

	int bytes_received;
	int conn_fd = -1;
	socklen_t socket_len = sizeof(struct sockaddr_in);

	listen(listen_fd, 1);

	conn_fd = accept(listen_fd, (struct sockaddr*)&client_addr, &socket_len);
	if (conn_fd < 0) {
		perror("conn_fd accept");
	}

	do {
		bytes_received = receive_and_send(file_fd, conn_fd, conn_fd);
	} while (bytes_received > 0);

	close(conn_fd);

	close(listen_fd);

    // TODO: close() file_fd

	return 0;
}

