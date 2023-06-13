# 3D File Repository Web Application

This is a web application for managing and storing 3D files. It provides a RESTful API for managing 3D files in OBJ format. Below are the available endpoints and their features:

## Endpoints

- `GET /api/files`: Retrieves a list of all 3D files available in the repository.
- `PATCH /api/file`: Updates the name of a specific 3D file.
- `DELETE /api/file?id=${fileId}`: Deletes a specific 3D file from the repository.
- `GET /api/download?id=${fileId}`: Downloads a specific 3D file from the repository.
- `POST /api/upload`: Uploads a 3D file (OBJ format) to the repository.
- `GET /api/transform?id=${fileId}&scale_x=${scale.x}&scale_y=${scale.y}&scale_z=${scale.z}&offset_x=${offset.x}&offset_y=${offset.y}&offset_z=${offset.z}`: Downloads a transformed version of a specific 3D file from the repository.

## Features

- File Management: You can upload, download, update, and delete 3D files in the repository.
- Download and Transform: You can download both the original and transformed versions of a 3D file.

## OpenAPI Specification

The project includes an OpenAPI specification file named `openapi.yaml`. This file describes the API endpoints, request/response schemas, and other related information. You can refer to this file for a detailed overview of the API.

## Challenges Faced with Streams

Working with streams presented some challenges during the development process. Due to time restrictions, the upload endpoint was not implemented using streams. This endpoint currently consumes a significant amount of memory, which needs improvement. However, the download and transform endpoints function as expected.

## Comments and Pending Improvements

In the code, you will find comments that highlight important functions. 

Due to time limitations, not all planned features were implemented. If I had more time, the following improvements would be made:

- Implement stream-based upload endpoint to optimize memory usage.
- Include a progress bar on the front-end to visualize file upload progress.
- Implement a file size limit for uploading files.

## Running the Application

This application uses PostgreSQL as the database. The database is containerized using Docker. 

The connection details for the PostgreSQL database are as follows:

- Host: `localhost`
- Port: `5432`
- Database: `3dverse`
- Username: `postgres`
- Password: `12345` (replace with your chosen password)

Rename `.env.example` file to `.env`. You can modify the database configuration in the `docker-compose.yml` file located in the project.

To run the application locally, follow these steps:

1. Clone the repository
2. Install dependencies with `npm i`
1. Start the service defined in the Docker Compose file with `docker-compose up -d` 
2. Apply migrations with `npx prisma migrate dev` 
3. Generate the Prisma Client with `npx prisma generate` 
4. Start the development server with `npm run dev` as `npm run start` does not work and I didn't have time to address this problem
5. Open your web browser and visit `http://localhost:3000` to access the application.

## Final Thoughts

I would like to acknowledge the help I received from Alex in correcting my transform file algorithm. His assistance was valuable in achieving the desired functionality.

It was a great experience working on this project and exploring Next.js and stream handling. Although there were time constraints and other commitments (I had to do another coding challenge in the meantime), I appreciate the opportunity and what I have learned throughout this process.

For any questions or clarifications, please feel free to reach out.

Thank you for considering my submission!

Best,

Valentina

_______________________________________

# Challenge 3dfilestore Web

In this challenge, you will design the REST API and implement the backend features of a 3D file repository web application. The frontend of the web application is provided.

## Constraints

Your server should be efficient performance-wise:

- should not exceed ~512Mb of memory usage
- should support multiple clients at the same time

However, the performance of the database you choose will not be taken into account for this evaluation.

## Features

The server should support a single 3D file format. [OBJ Wavefront](https://en.wikipedia.org/wiki/Wavefront_.obj_file) is the suggested format but could be changed at your convenience.

The 3D file repository has the following features:

- Upload a 3D file
- List 3D files uploaded on the server
- Download file
- Rename file
- Delete file
- Download a transformed file ([see below](#Transform-and-Download-feature))

On the server-side, you can decide how you store the files (with the database of your choice or even using the file system).

## Goals

You should provide:

- A fully implemented and standalone backend code written in `Typescript`
- An [OpenAPI](https://www.openapis.org) specification file for your REST operations
- If your backend requires external dependencies such as a database, it should be either standalone (e.g. sqlite) or containerized with [Docker Compose](https://docs.docker.com/compose)

The frontend code is provided and has a mock of each requested features.

The transform feature is displayed as a link with hardcoded arguments, but keep in mind that arguments are just placeholders, and could be set manually by a user.

## Interfacing your API with the existing Web App

Modify the arguments passed to each function in `./src/api/functions.ts`.
Look for `// Todo:` comments or `<replace-me>` placeholders.

## Transform and Download feature

The **Transform and Download** is a special functionality that will transform each vertices in the file with a given scale and translation vector.

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

## Example `obj` files

You can find some `obj` files ready to use from the following links:

- [buggy.obj](https://storage.googleapis.com/corp-dev-challenge-3dfilestore-assets/buggy.obj)
- [engine.obj](https://storage.googleapis.com/corp-dev-challenge-3dfilestore-assets/engine.obj)
- [starwarsjuggeren.obj](https://storage.googleapis.com/corp-dev-challenge-3dfilestore-assets/starwarsjuggeren.obj)
- [teapot.obj](https://storage.googleapis.com/corp-dev-challenge-3dfilestore-assets/teapot.obj)
- [whale.obj](https://storage.googleapis.com/corp-dev-challenge-3dfilestore-assets/whale.obj)

## Toolchain

- [nodejs](https://nodejs.org): `>=18`
- [npm](https://www.npmjs.com): `>=9`

## How to use

```sh
npm install
npm run start:w
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](https://github.com/3dverse/challenge-3dfilestore-web/blob/main/LICENSE) file for details.
