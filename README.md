# jSQL

jSQL is a locally instanciated database

## Node.js

### Initialization

Create an emtpy directory which will act as the database.

Import jSQL.

```javascript
const jSQL = require("jsql");
```

Register the database within the application. The parameter of the ``Database`` contructor must be a full path.

```javascript
const jSQL = require("jsql");

const database = new jSQL.Database(__dirname + "/database");
```

### Execution

The ``execute`` function let's you execute queries on the database. jSQL uses [special syntax](##Syntax).

To execute a statement or a query, you have to do the following. ``query`` is a string.

```javascript
database.execute(query);
```

## Syntax

jSQL has special syntax. It's more organized than traditional SQL syntax, and it's faster. Arguments are separated using "|".

### Statement / Query Syntax

Creating a schema with the name "main":

```
+|schema|'main'
```

Deleting a schema with the name "main":

```
-|schema|'main'
```

Renaming a schema from "sc1" to "sc2":

```
^|schema|'sc1'|'sc2'
```

Creating a table with the name "accounts" in a schema with the name "main":

```
+|table|'main'|'accounts'
```

Deleting a table with the name "accounts" in a schema with the name "main":

```
-|table|'main'|'accounts'
```

Renaming a table from "accounts" to "profiles" in a schema with the name "main":

```
^|table|'main'|'accounts'|'profiles'
```

Inserting an object (objects must be **one dimensional** json objects) into a table with the name "accounts" in a schema with the name "main":

```
+|'main'|'accounts'|{'username': 'user1', 'password': 'pass1'}
```

Deleting everything in a table with the name "accounts" in a schema with the name "main":

```
-|'main'|'accounts'
```

Deleting everything under a [condition](#Conditions) in a table with the name "accounts" in a schema with the name "main":

```
-|'main'|'accounts'|{ "username": [["user1"], [true]] }
```

Updating **(Work in Progress)**:

```
^|"<schema>"|"<table>"|{object}|{conditions}
```

Selecting **(Work in Progress)**:

```
.|"<schema>"|"<table>"|{conditions}
```

### Conditions

A "conditions" parameter is just a json object with certain parameters in it.

``AND`` statements are wrapped in ``"&": {}``.

``OR`` statements are wrapped in ``"/": {}``.

A condition parameter is represented using a key and a **two dimensional** array.

The following is equivalent to ``WHERE username="user1";``. The boolean says if the corresponding value is ``=`` or ``!=``.

```json
{
  "username": [ [ "user1" ], [ true ] ]
}
```

If there are multiple conditions under the name key, they're embedded into the two dimensional array.

The following is equivalent to ``WHERE username="user1" OR username="user2;``.

```json
{
  "/": {
    "username": [ [ "user1", "user2" ], [ true, true ] ]
  }
}
```

The following is equivalent to ``WHERE username="user1" AND (password="pass1" OR password="pass2" OR email!="user1@example.com")``.

```json
{
  "&": {
    "username": [ [ "user1" ], [ true ] ],
    "/": {
      "password": [ ["pass1", "pass2" ], [ true, true ] ],
      "email": [ [ "user1@example.com" ], [ false ] ]
    }
  }
}
```
