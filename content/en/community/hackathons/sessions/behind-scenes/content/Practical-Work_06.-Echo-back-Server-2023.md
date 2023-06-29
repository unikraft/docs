You will have to implement a simple echo-back server in C for the KVM platform.
The application will have to be able to open a socket on `172.44.0.2:1234` and send back to the client whatever the client sends to the server.
If the client closes the connection, the server will automatically close.

Enter the `work/06-echo-back/` directory.
Check the source code file (`main.c`) and support files.
Work on the contents to have a viable echo-back server implementation.
Things to consider:

* You will need some network client utility such as `netcat`.
* You will need the Lightweight TCP/IP stack library (lwip): https://github.com/unikraft/lib-lwip
* You will have to update the build and support files in the `work/06-echo-back/` directory.
* Same goes with the manual approach: you must modify the `Makefile` to include the `lwip` library dependency.

To test if your application works you can try sending it messages like so:

```console
$ nc 172.44.0.2 1234
```

After connecting to the server, whatever you enter in standard input, should be echoed back to you.

### Bonus items

For our echo-back server, we want to implement a log manager with basic functionalities.
The log manager should (at least, but you can come up with other functionalities):

1. Store in a file called `logs.txt` all messages received from the client. 
You should append the new logs at the end of the file.
1. Implement the following commands:
    1. `view logs`: displays the last 5 lines of the `logs.txt` file.
    1. `delete logs`: delete all the content from the `logs.txt` file without removing the file.
    1. `disable logs`: disables logging to the file. 
        If the logging is disabled, do nothing.
    1. `enable logs`: enable logging to file. 
        If the logging is enabled, do nothing.

    You should have one function for each of the commands above. 
    You can find a skel for this task in `log_manager.c` and `log_manager.h`.
    Have a look inside the `log_manager.h` and see the function you have to implement.

    Hint: For compiling multiple source files in Unikraft, you should modify the `Makefile.uk`.

    You can use netcat for testing (type one message and press enter):

    ```console
    $ nc 172.44.0.2 1234
    message1
    message2
    message2
    message3
    message4
    message5
    view logs
    another message
    view logs
    delete logs
    view logs
    random1
    disable logs
    random2
    view logs
    ```

    You should get the following output on your server:

    ```console
    message1
    message2
    message3
    message4
    message5
    message2
    message3
    message4
    message5
    another message
    random1
    ```