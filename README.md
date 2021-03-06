# Metric Logger

## Task

Build a metric logging and reporting service that sums metrics by time window for the most recent hour.

## Test

> `npm test`

## Setup

- Clone repository
- Install all dependencies with `npm i`
- Fire up the server with `npm start`

## To use the Live server

> Live server is can be accessed at https://metlog.herokuapp.com
> ;

## Points 🚀

> BASE URL: `/api/v1`

### Log

> Saves record under specified `key` and deletes it after one hour

- Endpoint: `/metric/`**`key`**
- Method: `POST`
- Body:

```json
{
  "value": "100"
}
```

- Response:

```json
{}
```

### Get Sum

> Gets the sum of all records under a specified `key` in the last hour

- Endpoint: `/metric/`**`key`**`/sum`
- Method: `GET`
- Response:

```
100
```

#🥂
