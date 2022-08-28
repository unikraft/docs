In tutorial above we have dynamically assigned an IP to the network interface used by Unikraft using the `dnsmasq` utility.
Find the support files in the `work/04-obtain-the-ip-statically/` folder of the session directory.

Modify the launching script and run the application with a static IP.
Beware that the assigned IP address must differ from the one assigned on the bridge.

You can use `redis-cli`, found in the suport folder to test your changes.
If everything runs as expected you should see the following output:

```bash
$ ./redis-cli -h 172.88.0.2 -p 6379
172.88.0.2:6379> PING
PONG
172.88.0.2:6379> 
```
