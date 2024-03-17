# Unikraft Documentation

This is the repository hosting Unikraft documentation.
It is deployed on the [Unikraft website](https://unikraft.org/)
It provides information for the latest version of [Unikraft](https://github.com/unikraft/unikraft) and [KraftKit](https://kraftkit.sh).

Documentation is written in [MDX](https://mdxjs.com/) format.
Building and deploying it requires Node and NPM.
You can build and run either natively or using Docker.

## Building and Testing Natively

```console
npm install

npm run search-meta:gen

npm run dev
```

See also [contributing/docs#building-the-website](https://unikraft.org/docs/contributing/docs#building-the-website).

## Using Docker

In order to use Docker, follow [the instructions](https://docs.docker.com/get-started/).

For local development:

```console
docker build -t ghcr.io/unikraft/docs:dev --target dev .

docker run -it --rm -v $(pwd):/docs -w /docs -p 3000:3000 ghcr.io/unikraft/docs:dev
```

For production deployment:

```console
docker build -t ghcr.io/unikraft/docs:runner --target runner .

docker run -it --rm -p 3000:3000 ghcr.io/unikraft/docs:runner
```

## Contributing

Please see our [Contribution Guide](https://unikraft.org/docs/contributing/docs) for more details.
