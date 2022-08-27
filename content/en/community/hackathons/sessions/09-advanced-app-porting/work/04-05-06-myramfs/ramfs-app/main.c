#include <stdio.h>
#include <fcntl.h>
#include <errno.h>

int main()
{
	int fd1 = open("file1.txt", O_WRONLY | O_CREAT);
	int fd2 = open("file2.txt", O_WRONLY | O_CREAT);
	int fd3 = open("file3.txt", O_WRONLY | O_CREAT);
	char buf[200];	

	printf("File descriptor %d\n", fd1);
	printf("File descriptor %d\n", fd2);
	printf("File descriptor %d\n", fd3);
	
	write(fd1, "Hi this is a test message,", 200);
	write(fd2, " if you receive this message it means that you", 200);
	write(fd3, " have solved everything well! Congratulations!!!", 200);
	
	close(fd1);
	close(fd2);
	close(fd3);
	
	fd1 = open("file1.txt", O_RDONLY);
        fd2 = open("file2.txt", O_RDONLY);
        fd3 = open("file3.txt", O_RDONLY);

	printf("%d\n", fd1);
	buf[0] = '\0';
	printf("\n.....message from file.....\n");
	read(fd1, buf, 200);
	printf("%s", buf);
	read(fd2, buf, 200);
	printf("%s", buf);
	read(fd3, buf, 200);
	printf("%s\n\n", buf);


	close(fd1);
	close(fd2);
	close(fd3);


	return 0;
	
}
