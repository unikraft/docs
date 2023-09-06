Update the previously built application, to echo back a `rot-13` encoded message.
To do this, you will have to create a custom function inside `lwip` (`~/.unikraft/libs/lwip/`) that your application (from the new directory `work/02-rot13`) can call in order to encode the string.
For example, you could implement the function `void rot13(char *msg);` inside `~/.unikraft/libs/lwip/sockets.c` and add its header inside `~/.unikraft/libs/lwip/include/sys/socket.h`.

The required resources are the exact same as in the previous exercise, you will just have to update `lwip`.
To test if this works, use the same methodology as before, but ensure that the echoed back string is encoded.
