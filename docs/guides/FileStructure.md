# File Structure

To help understand the guides better, we will stick to this pattern of file structure in our examples.

```
├── config/
│   ├── db.js
├── collections/
│   ├── Posts.js
├── models/
│   ├── Post.js
├── index.js
└── package.json
```

## Initialize the project

It is best to generate your `package.json` file by doing:

```
$ npm init
```

## Dependencies

And then, make sure firenze.js AND your preferred adapter is installed:

```
$ npm install --save firenze firenze-adapter-mysql
```
