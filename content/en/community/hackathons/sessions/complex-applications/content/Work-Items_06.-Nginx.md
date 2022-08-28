The aim of this work item is to set up and run Nginx, a popular open-source web server.
Find the support files in the `work/06-set-up-and-run-nginx/` folder of the session directory.

From the point of view of the library dependencies, the Nginx app has the same dependencies as the Redis app. Of course, instead of `lib-redis`, the Nginx app depends on an external library called [lib-nginx](https://github.com/unikraft/lib-nginx). You can clone this library in the `libs/` directory in a similar manner as with the previous work items.
It's your choice how you assign the IP to the VM.

In the support folder of this work item there is a subfolder called `nginx` with the following structure:

```
nginx_files
`-- nginx/
    |-- conf/
    |   |-- fastcgi.conf
    |   |-- fastcgi_params
    |   |-- koi-utf
    |   |-- koi-win
    |   |-- mime.types
    |   |-- nginx.conf
    |   |-- nginx.conf.default
    |   |-- scgi_params
    |   |-- uwsgi_params
    |   `-- win-utf
    |-- data/
    |   `-- images/
    |       `-- small-img100.png
    |-- html/
    |   |-- 50x.html
    |   `-- index.html
    `-- logs/
        |-- error.log
        `-- nginx.pid
```

The path to the `nginx_files` folder should be given as a parameter to the `-e option` of the `qemu-guest`.
The `html/` folder stores the files of the website you want to be run.

If everything works as expected, you should see the following web page in the browser.

![nginx output](/community/hackathons/sessions/complex-applications/images/nginx_output.png)
