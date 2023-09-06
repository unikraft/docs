#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

#include "log_manager.h"

#define LOG_FILE "logs.txt"

#include <stdio.h>

void view_logs(struct log_manager *manager, int num_lines)
{
    /* TODO bonus */
    int total_lines = 0;
    char buffer[1024];
    int bytes_read = 0;

    off_t pos = lseek(manager->fd, 0, SEEK_CUR);

    lseek(manager->fd, 0, SEEK_SET);
    while ((bytes_read = read(manager->fd, buffer, 1024)) > 0)
        for (int i = 0; i < bytes_read; ++i)
            if (buffer[i] == '\n')
                total_lines++;

    int skip_lines = total_lines - num_lines;

    lseek(manager->fd, 0, SEEK_SET);
    while ((bytes_read = read(manager->fd, buffer, 1024)) > 0)
        for (int i = 0; i < bytes_read; ++i)
        {
            if (skip_lines > 0)
            {
                if (buffer[i] == '\n')
                    skip_lines--;
            }
            else
                write(STDOUT_FILENO, &buffer[i], sizeof(buffer[i]));
        }

    lseek(manager->fd, pos, SEEK_CUR);
}

void delete_logs(struct log_manager *manager)
{
    /* TODO bonus */
    close(manager->fd);
    manager->fd = open(LOG_FILE, O_TRUNC | O_RDWR | O_CREAT, 0644);

}

void disable_logs(struct log_manager *manager)
{
    /* TODO bonus */
    manager->enabled = 0;

}

void enable_logs(struct log_manager *manager)
{
    /* TODO bonus */
    manager->enabled = 1;

}

struct log_manager *create_manager()
{
    /* TODO bonus */
    static int created = 0;
    static struct log_manager *manager = NULL;

    if (created)
        return manager;

    manager = malloc(sizeof(*manager));
    if (!manager)
        return NULL;

    manager->enabled = 1;
    manager->fd = open(LOG_FILE, O_RDWR | O_APPEND | O_CREAT, 0644);
    if (!manager->fd) {
        free(manager);
        return NULL;
    }

    created = 1;
    return manager;
}

void destroy_manager(struct log_manager *manager)
{
    /* TODO bonus */
    close(manager->fd);
    free(manager);
}
