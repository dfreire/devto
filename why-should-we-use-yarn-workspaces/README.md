# Why should we use yarn workspaces?

## The Problem

If you are working on a non-trivial project, chances are that at some point you will decide to extract pieces of code into separate packages.

Then you'll have some of your packages depending on others, and dependencies common to several packages, for example, `lodash` might be used by several packages.

Each of your packages will have its own `node_modules`. The same version of `lodash` can be repeated several times.

When you change the code of a package, you'll need to bump its version number, publish the changes, go to every other package that depends on it, update the version number of the dependency, and upgrade.

## The Solution

[Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) helps with the two issues:

- It sets up a single `node_modules` without repetitions.
- It allows you to change the code of one of your packages and have those changes instantly visible to the other packages that use it.

## Example

Say we have two packages: `conversions` and `myapp`.

`conversions/package.json` looks like this:

```json
{
  "name": "conversions",
  "version": "0.1.0",
  "main": "index.js"
}
```
`conversions/index.js` like this:

```js
const milesToKilometers = miles => miles * 1.609344;

module.exports = { milesToKilometers };
```

`myapp/package.json` like this:

```json
{
  "name": "project-bluebook",
  "version": "0.4.3",
  "main": "index.js",
  "dependencies": {
    "conversions": "^0.1.0"
  }
}
```

And finally `myapp/index.js` like this:

```js
const { milesToKilometers } = require('conversions');

console.log(`3 miles = ${milesToKilometers(3)}`);
```

Inside our top-level directory, let's create a sub-directory for holding all of our packages:

```
mdkir packages
```

And a `package.json` with the content:

```json
{
  "name": "root",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

`private: true`, because this `root` package is not meant to be published.

`workspaces: ["packages/*"]`, to tell yarn where to look for our packages.

Now lets move all your packages to the `packages` directory.

```
mv conversions packages/
mv myapp packages/
```

After moving, our directory layout looks like this:

```
/packages
  /conversions
    /node_modules
    index.js
    package.json
  /myapp
    /node_modules
    index.js
    package.json
  package.json  
```

Now lets go ahead and delete the individual package's `node_modules`:

```
rm -rf packages/conversions/node_modules
rm -rf packages/myapp/node_modules
```

And tell yarn to do its thing, simply by running:
```
yarn
```

You'll notice the updated layout:

```
/packages
  /conversions
    index.js
    package.json
  /myapp
    index.js
    package.json
  /node_modules
  package.json  
```

Ok, time to try it.

Lets change `packages/conversions/index.js` to:

```js
const ONE_MILE_IN_KILOMETERS = 1.609344;

const milesToKilometers = miles => miles * ONE_MILE_IN_KILOMETERS;

const kilometersToMiles = kilometers => kilometers / ONE_MILE_IN_KILOMETERS;

module.exports = { milesToKilometers, kilometersToMiles };
```

The new function `kilometersToMiles` should be instantly available to be used in `packages/myapp/index.js`:

```js
const { milesToKilometers, kilometersToMiles } = require('conversions');

console.log(`3 miles = ${milesToKilometers(3)}`);
console.log(`8 kms = ${kilometersToMiles(8)}`);
```

Notice that we didn't changed the `conversions` package version number. We will still need to do it later in order to publish the updated version of this package, but we don't have to do it during development just to have those changes available to `myapp` .

---

If you liked what you've read and want to get notified when I publish something new, please consider subscribing to the [mailing list](https://airtable.com/shr6oZPj9xxsYq0h8).
