# Filterable Car List with Pages
Project requested by [ARIMA](https://arima.eu/es/) to show my skills 

---

## Getting started

These steps will guide you through the process of setting the project up ready for development and testing. It is not intended to deploy it as is.

### Requirements
* [MongoDB](https://docs.mongodb.com/manual/installation/#tutorial-installation) and MongoDB tools (in order to import the database using [mongoimport](https://docs.mongodb.com/manual/reference/program/mongoimport/)) installed.
* [NodeJS](https://nodejs.org/en/download/)
* Root privileges

### Installing

The first step is to `git clone` this repository. Once that's done, **all the following steps are done from the root of the project you just cloned**.

1. Dependency installation.
```
# cd backendAPI && npm i
# cd client && npm i
```
2. Import the database.
```
# mongoimport --db=local --collection=cars --file=./backendAPI/db.json
```

### Running

Make sure the backend API is running if you want the client to load data taken from the database. To do so:

```
# cd backendAPI && node index.js
``` 

In another terminal, run the client like so:

```
# cd client && ng serve
```

The Angular client will tell you where is your project running. It should default to [localhost:4200](http://localhost:4200).

### Troubleshooting

As it's a simple project, you shouldn't run into any problems as long as everything is properly installed. 

The most probable issue that could happen is that the client isn't able to contact the backend API. Use a tool like telnet, [Postman](https://www.getpostman.com/) or your web browser to make sure the backend API is reachable. If it is and you client still can't reach the API, configure `client/src/app/network.service.ts` properly.

Keep in mind that this has been tested in a Manjaro machine and that some modifications may be needed depending on your OS.

---

## Contributing

Any bug-fixes, improvements or other kinds of feedback are welcome. You can always open an issue in this project, make a pull request or even send me a personal email. Don't refrain from contacting me if you think I can help you with your installation :D.

---

## Authors

* **[Urko Lekuona](https://github.com/UrkoLekuona)**

See also the list of [contributors](https://github.com/UrkoLekuona/clock-in-software/graphs/contributors) who participated in this project.


