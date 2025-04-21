+++
title = "Thesis: NodeJS porting"
date = "2023-07-01T13:00:00+01:00"
author = ""
tags = ["Thesis"]
+++

# NodeJS on Unikraft

While Unikraft provides support for many languages like C, C++, Python and many more, it still lacks web application support to be exact JavaScript support.

Following this idea, we decided that it would be a good idea to port NodeJS as a binary compatible application and then as a native one. The main idea is to offer full support for the runtime environment on top of Unikraft in both modes.

## Journey

### Binary Compatibility Part

The main plan is to first port NodeJS as a prebuilt Linux application and then try to run it in
binary compatibility mode. Currently, the binary compatibility mode works with static PIE (position independent exe-
cutables) or dynamically linked Linux ELF files. In this mode, the application that
runs behind the scenes is a special ELF loader that, when started, copies
the image given to it in a 9PFS filesystem, loads it into memory and then hands over the
control to the loaded application. This approach is made with both types of executables,
with the difference that, when trying to run a dynamically linked executable, all its dependent
libraries as well as the Linux LD loader must be passed through the 9PFS filesystem. The
ELF Loader knows by itself to search for the LD loader and uses it to map all the needed
dependencies into memory.

Currently, I've managed to create a server that hosts an HTML page that can be viewed on a browser. It is pretty simple but it proves that NodeJS can run on top of Unikraft.
I've also started looking into porting NodeJS's official testsuite. Currently I've made a script that runs those tests, but it is at its first iteration and needs some improvements.

<figure>
    <img src="/static/assets/imgs/NodeJS_hosting_website.png">
    <figcaption align="center"><b>NodeJS server</b></figcaption>
</figure>

<figure>
    <img src="/static/assets/imgs/NodeJs_help.png">
    <figcaption align="center"><b>NodeJS help options</b></figcaption>
</figure>

### Native Part

Porting an application to run in native Unikraft mode means taking the build process and integrate it into Unikraft’s build system.
This is a pretty lenghty process that depends entirely on the complexity of the application's build system. Even if this process is a pretty time variable
it is still worth to try as this mode is the fastest mode in which Unikraft can run. With all that, I've divided the porting process into these next steps:

1. Check Application’s Dependencies
1. Obtain the Build Process of the Application
1. Translate Application’s Build Process into a Unirkaft Microlibrary
1. Try to Compile the Application
1. Application Fully Ported in Native Mode

#### Check Application’s Dependencies
Before even starting to port our main application, the best thing to do is check if all its dependencies are already ported and work in the Unikraft native environment.
Node's dependecies were mostly already ported at their latest version or an older one.

#### Obtain the Build Process of the Application

This step involves obtaining all sources that are taken into consideration when trying to build the application for a Linux compatible target.
In this step I took inspiration from Alpine's [abuild tool](https://wiki.alpinelinux.org/wiki/Abuild_and_Helpers) configuration and build steps. I prefered to do it this way because of Unikraft's and Alpine's libc compatibility. 

#### Translate Application’s Build Process into a Unirkaft Microlibrary

This step was the trickiest for me. To create a new micro-library, you first need to get accustomed to Unikraft's build system. The best way of doing that is to look throgh all other ports and note each symbol and its usage. Some other sources of inspiration are Unikraft's application [porting](https://unikraft.org/community/hackathons/usoc22/basic-app-porting/) [lessons](https://unikraft.org/community/hackathons/usoc22/advanced-app-porting/) and this [presentation](https://wiki.xenproject.org/images/2/23/Unikraft-buildsystem-compressed.pdf).


#### Try to Compile the Application

After introducing all necessary configuration items into the Config.uk and completing the
Makefile.uk with all the necessary sources, it is time to try and compile the final image.
In this step, several problems may appear, that will cause the compile step to fail. The job here is to analyse why the problem appeared and solve it.

#### Application Fully Ported in Native Mode

After a successful compilation step, we still need to make sure that the image boots up and
the application runs. If not, we can start debugging the image by either using the debug
messages or by using GDB. After the application fully starts, to evaluate the porting process,
we can run a test suite to see the extent of Unikraft’s support of the application.

Currently, I've managed to get NodeJS to compile natively and I'm in the step of trying to compile the application and make it start. 


## Next Steps

1. Finish the native port of NodeJS.
1. Refine NodeJS testsuite and make it work for the native mode also.
1. Make NodeJS native mode as configurable as posible