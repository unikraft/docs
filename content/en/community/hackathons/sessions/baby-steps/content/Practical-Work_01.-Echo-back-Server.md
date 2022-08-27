You will have to implement a simple echo-back server in C for the KVM platform.
The application will have to be able to open a socket on `172.44.0.2:1234` and send back to the client whatever the client sends to the server.
If the client closes the connection, the server will automatically close.

Enter the `work/01-echo-back/` directory.
Check the source code file (`main.c`) and support files.
Work on the contents to have a viable echo-back server implementation.
Things to consider:

* You will need some network client utility such as `netcat`.
* You will need the Lightweight TCP/IP stack library (lwip): https://github.com/unikraft/lib-lwip
* You will have to update the build and support files in the `work/01-echo-back/` directory.
* If you want to run the application without `kraft`, the KVM launch script and network setup are already included inside `work/01-echo-back/launch.sh`.

To test if your application works you can try sending it messages like so:
```
$ nc 172.44.0.2 1234
```

After connecting to the server, whatever you enter in standard input, should be echoed back to you.
