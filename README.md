# Project setup
Open `back-end` directory in terminal

Run `npm install`

Run `docker-compose -p masketplace-db up -d`

Make sure no errors occured and you can see `mongodb` and `mong-express` containers running

Sometimes mongo-express might not connect on first try in that case you should try to activate it again with `docker-compose up mongo-express`

Go to `http://localhost:8081`, create a new database called `masketplace`
# Starting project
To start the project simply run `npm run serve`

