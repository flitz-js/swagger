[![npm](https://img.shields.io/npm/v/@flitz/swagger.svg)](https://www.npmjs.com/package/@flitz/swagger) [![supported flitz version](https://img.shields.io/static/v1?label=flitz&message=0.9.2%2B&color=blue)](https://github.com/flitz-js/flitz) [![last build](https://img.shields.io/github/workflow/status/flitz-js/body/Publish)](https://github.com/flitz-js/swagger/actions?query=workflow%3APublish) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/flitz-js/swagger/pulls)

# @flitz/swagger

> Sets up a [flitz](https://github.com/flitz-js/flitz) instance serving [Swagger UI](https://github.com/swagger-api/swagger-ui).

## Install

Run

```bash
npm install --save @flitz/swagger
```

from the folder, where your `package.json` is stored.

## Usage

```javascript
const flitz = require('flitz');
const swagger = require('@flitz/swagger');

const run = async () => {
  const app = flitz();

  // UI will be available at http://localhost:3000/swagger in browser
  //
  // you can download the document via:
  //   * JSON: http://localhost:3000/swagger/json
  //   * YAML: http://localhost:3000/swagger/yaml
  swagger(app, {
    // s. https://swagger.io/docs/
    document: {
      "openapi": "3.0.0",
      "info": {
        "title": "Sample API",
        "description": "Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.",
        "version": "0.1.9"
      },
      "servers": [
        {
          "url": "http://api.example.com/v1",
          "description": "Optional server description, e.g. Main (production) server"
        },
        {
          "url": "http://staging-api.example.com",
          "description": "Optional server description, e.g. Internal staging server for testing"
        }
      ],
      "paths": {
        "/users": {
          "get": {
            "summary": "Returns a list of users.",
            "description": "Optional extended description in CommonMark or HTML.",
            "responses": {
              "200": {
                "description": "A JSON array of user names",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  await app.listen(3000);
};

run();
```

Or the TypeScript way:

```typescript
import flitz from 'flitz';
import { swagger } from '@flitz/swagger';

const run = async () => {
  const app = flitz();

  // UI will be available at http://localhost:3000/swagger in browser
  swagger(app, {
    document: { /* https://swagger.io/docs/ */ }
  });

  await app.listen(3000);
};

run();
```

## TypeScript

TypeScript is optionally supported. The module contains its own [definition files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).

## License

MIT © [Marcel Kloubert](https://github.com/mkloubert)
