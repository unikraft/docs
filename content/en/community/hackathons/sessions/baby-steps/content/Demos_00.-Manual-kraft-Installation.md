Let's start with installing kraft (and validating the installation).

First of all, make sure you have all the dependencies installed:
```bash
$ sudo apt-get install -y --no-install-recommends build-essential \
        libncurses-dev libyaml-dev flex git wget socat bison \
        unzip uuid-runtime python3-pip
```

You'll also need QEMU for launching virtual/emulated machines which will run unikernels targeting the KVM platform:
```bash
$ sudo apt-get -y install qemu-kvm qemu-system-x86
```

To install the latest version of kraft, simply run:
```bash
$ pip3 install git+https://github.com/unikraft/kraft.git@staging
```

After installing or updating kraft, the first step is to download / update the software components available for building unikernel images.
For this, run:
```bash
$ kraft list update
```

It's very likely that running the command above will result in the following error:
```bash
GitHub rate limit exceeded.  You can tell kraft to use a personal access token by setting the UK_KRAFT_GITHUB_TOKEN environmental variable.
```

If this is the case, first create a GitHub personal access token with `repo:public-repo` permissions by following [these instructions](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token).
Then, use the following command:
```bash
$ UK_KRAFT_GITHUB_TOKEN=<your_GitHub_token_here> kraft list update
```

After this is done, you can get a list of all components that are available for use with kraft:
```bash
$ kraft list
UNIKRAFT                VERSION         RELEASED        LAST CHECKED
unikraft                0.10.0          20 hours ago    14 hours ago

PLATFORMS               VERSION         RELEASED        LAST CHECKED
solo5                   0.10.0          5 days ago      14 hours ago
[...]

LIBRARIES               VERSION         RELEASED        LAST CHECKED
newlib                  0.10.0          2 days ago      26 Aug 22
pthread-embedded        0.10.0          5 days ago      26 Aug 22
lwip                    0.10.0          3 days ago      26 Aug 22
http-parser             0.10.0          5 days ago      26 Aug 22
[...]

APPLICATIONS            VERSION         RELEASED        LAST CHECKED
helloworld              0.10.0          5 days ago      26 Aug 22
httpreply               0.10.0          5 days ago      26 Aug 22
python3                 0.10.0          5 days ago      26 Aug 22
redis                   0.10.0          5 days ago      26 Aug 22
[...]
```

So, with kraft we have an interface to configure, build and run unikernel images based on Unikraft core, (external) platforms, (external) libraries and applications.

By default, these are saved to `~/.unikraft/` directory, which is also the value of the `UK_WORKDIR` environment variable used by kraft.
This represents the working directory for all Unikraft components.
This is the usual layout of the `~/.unikraft/` directory:
```
|-- apps - This is where you would normally place existing app build
|-- archs - Here we place our custom arch's files
|-- libs - This is where the build system looks for external library pool sources
|-- plats - The files for our custom plats are placed here
`-- unikraft - The core source code of the Unikraft Unikernel
```

Apart from the general `UK_WORKDIR` environment variable that points to the overall directory, there are also environment variables available for the above subdirectories:
```
UK_ROOT - The directory for Unikraft's core source code [default: $UK_WORKDIR/unikraft]
UK_LIBS - The directory of all the external Unikraft libraries [default: $UK_WORKDIR/libs]
UK_APPS - The directory of all the template applications [default: $UK_WORKDIR/apps]
```

After successfully running the above commands, kraft is now installed on our system and we can get to building and running unikernels.
