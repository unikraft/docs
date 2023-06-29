#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

#include "log_manager.h"

#define LOG_FILE "logs.txt"

#include <stdio.h>

void view_logs(struct log_manager *manager, int num_lines) {
   /* TODO bonus */
}

void delete_logs(struct log_manager *manager) 
{
   /* TODO bonus */
}

void disable_logs(struct log_manager *manager)
{
   /* TODO bonus */
}

void enable_logs(struct log_manager *manager)
{
   /* TODO bonus */
}

struct log_manager *create_manager()
{
   /* TODO bonus */
}

void destroy_manager(struct log_manager *manager)
{
   /* TODO bonus */
}
