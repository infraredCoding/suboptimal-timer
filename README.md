# Suboptimal Timer - A Cubing Timer That Syncs
Suboptimal Timer is a speedsolving timer made with [Vue.js 3](https://vuejs.org/) (TypeScript) and [Tailwind CSS](https://tailwindcss.com/). It uses [PouchDB](https://pouchdb.com/) to store the sessions and solves locally and [CouchDB](https://couchdb.apache.org/) as a remote database that syncs with the local PouchDB instance in real-time (providing that the user is logged in and has active internet connection).

This repository contains all of the frontend code (which is the bulk of the project). The authentication server and the CouchDB database server used for this project are maintained privately.

## How To Contribute
This project is open source, which means anyone can see the source code and can contribute to this project. 

### Development
Install all the packages necessary
```

npm install

```
Run the local development server
```

npm run serve

```
***If you need access to the authentication server and/or the couchdb database, please contact [Imran Rahman via email](mailto:imranrahman.ix@gmail.com), or via [Facebook](https://www.facebook.com/imranrahmanix/) ;)***