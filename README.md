## Likes service

### Run
```
make run-likes
```

## Users service

### Run
```
make run-users
```

## Posts service

### Install dependencies
```
cd services/posts

npm i
```

### Run
```
make run-posts
```

## Api gateway
### Run
```
make run-nginx
```

## Frontend
```
cd frontend
npm i
cd ..
make run-frontend
```

## Database
### Initialize a sqlite database
```
make init-db
```

### Create a sqlite database
```
make create-db
```

### Recreate a sqlite database
```
make recreate-db
```