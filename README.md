This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment Variables

Before you `yarn start`, you'll want a `.env` file. You can copy `default.env` to `.env`.  Then you may edit that file to add things like Firebase configuration, but be careful never to commit any secrets to the repository nor build them within Docker images (see `.gitignore` and `.dockerignore`.)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Production Packaging

To package this application for production, build a Docker image. This process prepares the app to be served as static files by `nginx`, a very performant HTTP server.

```
docker build . --tag=spettway/canary
```

You can briefly test this on your workstation before publishing. Include environment variables.

```
docker run -p 8080:80 --env-file=.env spettway/canary
```

If that looks good, you can push the image up to a registry. You may need to set up an account on that registry and configure your Docker environment, especially if that registry is Docker Hub.

```
docker push spettway/canary
```
