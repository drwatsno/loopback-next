---
lang: en
title: 'Add a Datasource'
keywords: LoopBack 4.0, LoopBack 4
tags:
sidebar: lb4_sidebar
permalink: /doc/en/lb4/todo-tutorial-datasource.html
summary: LoopBack 4 Todo Application Tutorial - Add a Datasource
---

### Datasources

Datasources are LoopBack's way of connecting to various sources of data, such as
databases, APIs, message queues and more. In LoopBack 4, datasources can be
represented as strongly-typed objects and freely made available for
[injection](Dependency-injection.md) throughout
the application. Typically, in LoopBack 4, datasources are used in conjunction
with [Repositories](Repositories.md) to provide
access to data.

Since our Todo API will need to persist instances of Todo items, we'll need to
create a datasource definition to make this possible.

### Building a Datasource

Create a new folder in the root directory of the project called `config`, and
then inside that folder, create a `datasources.json` file. For the purposes of
this tutorial, we'll be using the memory connector provided with the Juggler.

#### config/datasources.json

```json
{
  "name": "db",
  "connector": "memory",
  "file": "./data/db.json"
}
```

Inside the `src/datasources` directory create a new file called `db.datasource.ts`. This file will create
a strongly-typed export of our datasource using the `juggler.DataSource`,
which we can consume in our application via injection.

#### src/datasources/db.datasource.ts

```ts

import * as path from 'path';
import {juggler} from '@loopback/repository';

const dsConfigPath = path.resolve(
  __dirname,
  '../../../config/datasources.json',
);
const config = require(dsConfigPath);

export const db = new juggler.DataSource(config);
```

Create a `data` folder in the applications root and add a new file called `db.json` contain and example database.

#### data/db.json
```json
{
  "ids": {
    "Todo": 5
  },
  "models": {
    "Todo": {
      "1": "{\"title\":\"Take over the galaxy\",\"desc\":\"MWAHAHAHAHAHAHAHAHAHAHAHAHAMWAHAHAHAHAHAHAHAHAHAHAHAHA\",\"id\":1}",
      "2": "{\"title\":\"destroy alderaan\",\"desc\":\"Make sure there are no survivors left!\",\"id\":2}",
      "3": "{\"title\":\"terrorize senate\",\"desc\":\"Tell them they're getting a budget cut.\",\"id\":3}",
      "4": "{\"title\":\"crush rebel scum\",\"desc\":\"Every.Last.One.\",\"id\":4}"
    }
  }
}
```
Once you're ready, we'll move onto adding a [repository](todo-tutorial-repository.md) for the
datasource.

### Navigation

Previous step: [Add your Todo model](todo-tutorial-model.md)

Next step: [Add a repository](todo-tutorial-repository.md)
