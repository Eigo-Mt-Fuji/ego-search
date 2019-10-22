{
  "name": "default",
  "database":"test",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "root",
  "synchronize": true,
  "logging": true,
  "entities":[
    `${__dirname}src/models/*.ts`
  ]
}
