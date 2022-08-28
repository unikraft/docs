#include <stdio.h>

#ifndef UK_DEBUG_TRACE
#define UK_DEBUG_TRACE
#endif

#include <uk/trace.h>

UK_TRACEPOINT(start_trace, "%d", int);
UK_TRACEPOINT(stop_trace, "%d", int);

void start_status()
{
    printf("Start tracing\n");
}

void stop_status()
{
    printf("Stop tracing\n");
}

int main(int argc, char *argv[])
{
    start_trace(argc);
    start_status();

    printf("Hello world!\n");

    stop_trace(argc);
    stop_status();

    return 0;
}
