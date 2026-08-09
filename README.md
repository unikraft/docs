# Unikraft Documentation

This is the repository hosting Unikraft documentation.
It is deployed on the [Unikraft website](https://unikraft.org/)

To access the latest Unikraft documentation, visit https://unikraft.org/docs and [KraftKit](https://kraftkit.sh).

Documentation is written in [MDX](https://mdxjs.com/) format.
> 💡 Make sure [Node.js](https://nodejs.org/) and `npm` are installed on your system before proceeding.

You can check if they are installed with:
```bash
node -v
npm -v
```
You can build and run either natively or using Docker.

## Building and Testing Natively

You can build and run the documentation locally by following these steps:

1. Install the dependencies:
   ```bash
   npm install
    ```
2. Generate metadata for the search feature:
   ```bash
   npm run search-meta:gen
    ```
3. Start the development server:
   ```bash
   npm run dev
    ```
See also [contributing/docs#building-the-website](https://unikraft.org/docs/contributing/docs#building-the-website).

## Using Docker

In order to use Docker, follow [the instructions](https://docs.docker.com/get-started/).

### For Local Development

```console
docker build -t ghcr.io/unikraft/docs:dev --target dev .

docker run -it --rm -v $(pwd):/docs -w /docs -p 3000:3000 ghcr.io/unikraft/docs:dev
```

### For Production Deployment

```console
docker build -t ghcr.io/unikraft/docs:runner --target runner .

docker run -it --rm -p 3000:3000 ghcr.io/unikraft/docs:runner
```

## Contributing

If you would like to contribute, please read our [Contribution Guidelines](https://unikraft.org/docs/contributing/).
