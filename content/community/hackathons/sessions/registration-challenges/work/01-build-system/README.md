# 01-build-system

## Challenge Description

You are given the following file structure:

```console
.
|-- key.c
|-- main.c
`-- some
    `-- far
        `-- away
            |-- include
            |   `-- myheader.h
            `-- src
                `-- values.c
```

Your task is to create a `Makefile` that will be used to build everything into an executable file.
After everything is done, if you run the executable you will find a flag:

```console
$ ./main
[...]
USoC{...}
```

## Resources

You can find a basic tutorial on building a `Makefile` [here](https://cs.colby.edu/maxwell/courses/tutorials/maketutor/), and a more detailed example [here](https://makefiletutorial.com/).
