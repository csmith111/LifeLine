# Lifeline

> Record your Lifeline, and optimize your life!

## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn dev

# build for production with minification
yarn build

# build for production and view the bundle analyzer report
yarn build --report
```

## App Run
```bash
# Install `json-server` globally
yarn global add json-server

cd data
# Create the data to serve to app in `db.js`

# Convert `db.js` to db.json, which will be served by `json-server`
./db2json.sh

# Invoke `json-server` to serve our data.
json-server db.json

# Move back to parent directory
cd ..

# Start the webpack bundle to compile and serve our app.
yarn dev

# App is at: http://localhost:8080
```

Details of Lifeline are at the [Wiki](https://github.com/vijaypatil/LifeLine/wiki).
