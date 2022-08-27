RM = rm -f
CC = gcc
CFLAGS += -O2 -g -fpie
LDFLAGS += -static-pie
LDLIBS +=

all: getcpu

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

%: %.o
	$(CC) $(LDFLAGS) $^ $(LDLIBS) -o $@

getcpu: getcpu.o

clean:
	$(RM) *.o *~ core getcpu
