One of the most popular symbolic execution engine is [KLEE](https://klee.github.io/).
For convenience, we'll be using Docker.

```Bash
docker pull klee/klee:2.1
docker run --rm -ti --ulimit='stack=-1:-1' klee/klee:2.1
```

Let's look over this regular expression program, can you spot any bugs?
We'll create a file `ex.c` with this code:

```C++
#include <stdio.h>

static int matchhere(char*,char*);

static int matchstar(int c, char *re, char *text) {
  do {
    if (matchhere(re, text))
      return 1;
  } while (*text != '\0' && (*text++ == c || c== '.'));
  return 0;
}

static int matchhere(char *re, char *text) {
  if (re[0] == '\0')
     return 0;
  if (re[1] == '*')
    return matchstar(re[0], re+2, text);
  if (re[0] == '$' && re[1]=='\0')
    return *text == '\0';
  if (*text!='\0' && (re[0]=='.' || re[0]==*text))
    return matchhere(re+1, text+1);
  return 0;
}

int match(char *re, char *text) {
  if (re[0] == '^')
    return matchhere(re+1, text);
  do {
    if (matchhere(re, text))
      return 1;
  } while (*text++ != '\0');
  return 0;
}

#define SIZE 7

int main(int argc, char **argv) {
  char re[SIZE];

  int count = read(0, re, SIZE - 1);
  //klee_make_symbolic(re, sizeof re, "re");

  int m = match(re, "hello");
  if (m) printf("Match\n", re);

  return 0;
}
```

Now, let's run this program symbolically.
To do this, we'll uncomment the `klee_make_symbol` line, and comment the line with `read` and `printf`.
We'll compile the program with `clang` this time:

```Bash
clang -c -g -emit-llvm  ex.c
```

And run it with KLEE:

```Bash
klee ex.bc
```

We'll see the following output:

```
KLEE: output directory is "/home/klee/klee-out-4"
KLEE: Using STP solver backend
KLEE: ERROR: ex1.c:13: memory error: out of bound pointer
KLEE: NOTE: now ignoring this error at this location
KLEE: ERROR: ex1.c:15: memory error: out of bound pointer
KLEE: NOTE: now ignoring this error at this location

KLEE: done: total instructions = 5314314
KLEE: done: completed paths = 7692
KLEE: done: generated tests = 6804
```

This tells us that KLEE has found two memory errors.
It also gives us some info about the number of paths and instructions executed.
After the run, a folder `klee-last` has been generated that contains all the test cases.
We want to find the ones that generated memory errors:

```
klee@affd7769bb39:~/klee-last$ ls | grep err
test000018.ptr.err
test000020.ptr.err
```

We look at testcase 18:

```
klee@affd7769bb39:~/klee-last$ ktest-tool test000018.ktest
ktest file : 'test000018.ktest'
args       : ['ex1.bc']
num objects: 1
object 0: name: 're'
object 0: size: 7
object 0: data: b'^\x01*\x01*\x01*'
object 0: hex : 0x5e012a012a012a
object 0: text: ^.*.*.*
```

This is just a quick example of the power of symbolic execution, but it comes with one great problem: path explosion.
When we have more complicated programs that have unbounded loops, the number of paths grows exponentially and thus symbolic execution is not viable anymore.
