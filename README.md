# Static CLI ⚡

Static attempts to make it effortless to publish static websites to AWS' S3 + CloudFront, shamelessly taking inspiration from the amazing [Surge.sh](surge.sh).

### Usage

```sh
$ static ./ domain.com
```

### Install

```sh
$ npm i -g static-cli
```

### Features

* **Deplyed to S3:** Deploys your directory to an S3 bucket.
* **Custom domains:** prefixed with your domain name (or a random string if none is provided).
* **Automatic Static Hosting:** Enables Static Hosting for your bucket.
* **CDN'd via CloudFront:** Creates a CloudFront distribution so that your site is served over a CDN, making it speedy wherever you are in the world.
* **Invalidates cache on each deploy:** It will update the chache of your CloudFront distribution if one exists.
* **Client Side Routing:** It'll handle both standard static routing OR client side routing.
* **Custom error pages:** If you aren't using client side routing you can add your own 404 page by adding a 404.html document to the route of your directory.
* **Clean URLs:** All URLs will be 'cleaned', i.e. your-domain.com/hello.html is reached via your-domain.com/hello.

### Notes

* 🚨This will remove all contents of the S3 bucket if it exists already (and replace with the contents of our specified directory).
* ⏳ Deploying using cloudfront is not instant, for a new site you can expect to wait up to 20-30 minutes for it to propogate through your CDN. For an existing site it could be as good as instant.
* ℹ️ You'll need to have AWS configured with `~/.aws/credentials` or via environment variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.

### Deploying a client-side routed app

**tldr;** To handle routing client-side simply rename your index.html file to 200.html. All unknown requests will now return this file.

```sh
<!-- Example: with create-react-app -->
$ create-react-app my-app

<!-- Move into the root of your new React app -->
$ cd my-app

<!-- ...do some work on your app... -->

<!-- Build you app -->
$ npm run build

<!-- 🔑Rename your index.html file to 200.html -->
$ mv build/index.html build/200.html

<!-- Deploy 🚀 -->
$ static ./build my-domain.com
```
