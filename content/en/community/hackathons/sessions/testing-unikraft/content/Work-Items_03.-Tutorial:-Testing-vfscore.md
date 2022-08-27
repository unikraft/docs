We begin by adding a new file for the tests called `test_stat.c` in a newly created folder `tests` in the `vfscore` internal library:

```Makefile
LIBVFSCORE_SRCS-$(CONFIG_LIBVFSCORE_TEST_STAT) += \
    $(LIBVFSCORE_BASE)/tests/test_stat.c
```

We then add the menuconfig option in the `if LIBVFSCORE` block:

```KConfig
menuconfig LIBVFSCORE_TEST
    bool "Test vfscore"
    select LIBVFSCORE_TEST_STAT if LIBUKTEST_ALL
    default n

if LIBVFSCORE_TEST

config LIBVFSCORE_TEST_STAT
    bool "test: stat()"
    select LIBRAMFS
    default n

endif
```

And finally add a new testsuite with a test case.

```C++
#include <uk/test.h>

#include <fcntl.h>
#include <errno.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/mount.h>

typedef struct vfscore_stat {
    int rc;
    int errcode;
    char *filename;
} vfscore_stat_t;

static vfscore_stat_t test_stats [] = {
    { .rc = 0,    .errcode = 0,        .filename = "/foo/file.txt" },
    { .rc = -1,    .errcode = EINVAL,    .filename = NULL },
};

static int fd;

UK_TESTCASE(vfscore_stat_testsuite, vfscore_test_newfile)
{
    /* First check if mount works all right */
    int ret = mount("", "/", "ramfs", 0, NULL);
    UK_TEST_EXPECT_SNUM_EQ(ret, 0);

    ret = mkdir("/foo", S_IRWXU);
    UK_TEST_EXPECT_SNUM_EQ(ret, 0);

    fd = open("/foo/file.txt", O_WRONLY | O_CREAT, S_IRWXU);
    UK_TEST_EXPECT_SNUM_GT(fd, 2);

    UK_TEST_EXPECT_SNUM_EQ(
        write(fd, "hello\n", sizeof("hello\n")),
        sizeof("hello\n")
    );
    fsync(fd);
}

/* Register the test suite */
uk_testsuite_register(vfscore_stat_testsuite, NULL);
```

We will be using a simple app without any main function to run the testsuite, the output should be similar with:

```
test: vfscore_stat_testsuite->vfscore_test_newfile
    :	expected `ret` to be 0 but was 0 ................................................ [ PASSED ]
    :	expected `ret` to be 0 but was 0 ................................................ [ PASSED ]
    :	expected `fd` to be greater than 2 but was 3 .................................... [ PASSED ]
    :	expected `write(fd, "hello\n", sizeof("hello\n"))` to be 7 but was 7 ............ [ PASSED ]
```
