# bun-kiwi

A basic, performant key-value store made with the purpose of checking out Bun. Successor of https://github.com/nunogois/bun-kv-store - Made originally in July 2022.

Includes a very basic custom router.

Could be useful as a simple REST API for a key-value store for stuff like hackathons.

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Getting Started

To install dependencies:

```bash
bun install
```

To develop:

```bash
bun dev
```

To run:

```bash
bun start
```

## Routes

- GET /store/this/is/my/identifier (returns all data in the `this/is/my/identifier` key)
- POST /store/this/is/my/identifier (stores data in the `this/is/my/identifier` key)
- DELETE /store/this/is/my/identifier (deletes all data in the `this/is/my/identifier` key)

A common use-case could be POSTing a JSON with your app's current state, then retrieving it at anytime by GETting it with the same URL.

You could technically generate a random and secure key to store your data, like `/store/my_app/MY_SECRET_KEY/users`, but...

**Even though you can delete the data you store at anytime, you should not store private or sensitive information in this store, unless you're hosting it yourself and know what you're doing.**

**Data in this store is solely the responsibility of its owners and can be lost at anytime.**

## Authentication

If you would like to enable authentication, you can create a `tokens.txt` file at the root of the project with a list of tokens to be used (one per line). You will need to send one of them as a Bearer token and each of them will use its own store.
