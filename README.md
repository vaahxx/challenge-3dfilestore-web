# Challenge 3dfilestore Web

For this test, we provide you a front-side of a web application, and you have to design a REST api and implement the backend application features.

This web app is a simple 3D file repository and should have the following features:

- Upload some 3D file, a single format is required, _obj_ is suggested for this exercice.
- List 3D files uploaded on the server

This app **doesn't require** to display a 3D viewer of these files.
As suggested, the server should support a single 3D file format, and [OBJ Wavefront](https://en.wikipedia.org/wiki/Wavefront_.obj_file) is a suggested format, but could be changed to your convenience.

Each file hosted on this server should expose the following features:

- Download file
- Rename file
- Delete file
- Download a transformed file ([see below](#Transform-and-Download-feature))

On the server-side, you can store stored files however you want, with the database of your choice or even use the file system.

In the end, you should provide:

- A fully implemented and standalone backend code written in `Typescript`
- An [OpenAPI](https://www.openapis.org) specification file for your REST operations
- If your backend requires external dependencies such as a database, it should be either standalone (e.g. sqlite) or containerized with [Docker Compose](https://docs.docker.com/compose)

The whole frontend is provided and has a mock of each requested features.

The transform feature is displayed is a link with hardcoded arguments, but keep in mind that arguments are just placeholders, and could be set manually by a user.

> ⚠️ Keep in mind that your code should be efficient performance-wise.
>
> The performance of the database you choose will not factor in this evaluation. ⚠️

### Transform and Download feature

It is a special functionality that will transform each vertices in the file with a given scale and translation vector.

For example with an _obj_ the vertices are described like this:

```obj
v 1  1  1
v 1  0  1
v 2 10 10
```

The transform feature will allow you to download the file with a dynamic scale and translation vectors.
For example, if we specify `[2, 2, 2]` as a scale vector, the file will be downloaded and transformed like that:

```obj
v 2  2  2
v 2  0  2
v 4 20 20
```

With a `[10, 0, 0]` as a translation vector, the file will be downloaded and transformed like that:

```obj
v 11  1  1
v 11  0  1
v 20 10 10
```

> ⚠️ The transformed file should not alter the original file stored on the server! ⚠️

## Toolchain

- [nodejs](https://nodejs.org): `>=18`
- [npm](https://www.npmjs.com): `>=9`

## How to

```sh
npm install
npm run start:w
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](https://github.com/3dverse/challenge-3dfilestore-web/blob/main/LICENSE) file for details.
