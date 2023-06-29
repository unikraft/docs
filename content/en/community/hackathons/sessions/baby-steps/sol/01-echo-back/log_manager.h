#pragma once

struct log_manager {
    int fd;
    char enabled;
};

void view_logs(struct log_manager *manager, int num_lines);
void delete_logs(struct log_manager *manager);
void disable_logs(struct log_manager *manager);
void enable_logs(struct log_manager *manager);

struct log_manager* create_manager();
void destroy_manager(struct log_manager *manager);