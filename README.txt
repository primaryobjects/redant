Red Ant

Description

A Node.js REST service for saving/loading JSON in MongoDb. Created as part of the 2012 AP Technology Summit.

Why "Red Ant"?

Red ants are one of the largest types of ants on the US east coast. They're extremely strong, fast, and can even bite you if you let them. On a sunny day, you can find a red ant colony carrying all types of debris, food, and dead insects into their nest, stashing them away for a rainy day.

Likewise (or maybe not, but let's just go with it), the Red Ant service is a Node.js RESTful service that stores and retrieves data to a Mongo database. Any type of data may be stored in JSON format, by simply posting the data to the designated URI /v1/nest

API

The API methods are included below and follow the traditional REST interface. You can test the methods using any RESTful client, such as the Advanced REST client app for Google Chrome.

Loading Data

GET /v1/nest/[objectId]

Saving Data

POST /v1/nest
(include JSON post data in the request, any format, the entire object will be stored)

Updating Data

PUT /v1/nest/[objectId]
(include JSON post data in the request, any format, the entire object will be replaced)

Author

Kory Becker
http://www.primaryobjects.com
