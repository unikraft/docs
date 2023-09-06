We also have a Docker setup prepared that you can use for building (not running) Unikraft images.
Make sure you have [Docker installed](https://docs.docker.com/engine/install/).
Grab the Docker container by running:

```console
$ docker pull index.unikraft.io/unikraft.org/hackathons/base:latest
```

You can then run an instance using:

```console
$ docker run --rm -it index.unikraft.io/unikraft.org/hackathons/base:latest /bin/bash
```

Inside the container you have all packages and setup required to setup and build Unikraft images.

**Note**:
The Docker container is only used to build Unikraft images.
Due to constraints in the Docker container and for optimal performance, running Unikraft images (via QEMU) is to be done on the host system (outside the Docker container).
