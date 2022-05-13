#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <errno.h>

#define BUFLEN 100
#define LISTEN_PORT 1234

int receive_and_send(int client_recvfd, int client_sendfd)
{
    char buf[BUFLEN];
    int bytes_send;
    int bytes_received = 0;

    memset(buf, 0, BUFLEN);
    bytes_received = // recv() buffer into buf;
    if (bytes_received < 0) {
        fprintf(stderr, "bytes_received recv");
        return -1;
    }

    bytes_send = // send() buf back;
    if (bytes_send < 0) {
        fprintf(stderr, "bytes_send send");
        return -1;
    }

    return bytes_received;
}

int main(int argc, char* argv[])
{
    int listenfd = -1;
    struct sockaddr_in serv_addr;

    listenfd = // open socket() fd;
    if (listenfd < 0) {
        fprintf(stderr, "socket");
        return 1;
    }

    int enable = 1;
    if (setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &enable, sizeof(int)) == -1) {
        fprintf(stderr, "setsocketopt");
        return 1;
    }

    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(LISTEN_PORT);
    serv_addr.sin_addr.s_addr = INADDR_ANY;

    int err = // bind() the socket;
    if (err < 0) {
        fprintf(stderr, "bind");
        return 1;
    }

    struct sockaddr_in client_addr;

    int bytes_received;
    int connfd = -1;
    socklen_t socket_len = sizeof(struct sockaddr_in);

    listen(listenfd, 1);

    connfd = // accept() new connection;
    if (connfd < 0) {
        fprintf(stderr, "connfd accept");
        return 1;
    }

    do {
        bytes_received = receive_and_send(connfd, connfd);
    } while (bytes_received > 0);

    // close file descriptors

    return 0;
}
