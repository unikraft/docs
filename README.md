## This is the Unikraft Documentation website

It's the <https://unikraft.org> website for the latest version of
[Unikraft](https://github.com/unikraft/unikraft) and
[KraftKit](https://kraftkit.sh).

### Building and testing locally

```console
yarn install

yarn run dev
```

### Using Docker

```console
docker build -t ghcr.io/unikraft/docs:base --target base .

docker run -it --rm -v $(pwd):/docs -w /docs -p 3000:3000 --entrypoint sh ghcr.io/unikraft/docs:base

yarn run dev
```
