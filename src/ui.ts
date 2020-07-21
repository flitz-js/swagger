// Copyright 2020-present Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { Flitz, RequestPathValidator } from 'flitz';
import { safeDump as dumpYaml } from 'js-yaml';
import { getAbsoluteFSPath } from 'swagger-ui-dist';
import { defaultFavIcon, indexHtml, swaggerUiInit } from './templates';

/**
 * A Swagger document.
 */
export interface SwaggerDocument {
  [property: string]: any;
}

/**
 * Options for 
 */
export interface SwaggerOptions {
  /**
   * The custom base path. Default: '/swagger'
   */
  basePath?: string;
  /**
   * When downloading documents via /json or /yaml
   * you can define the base filename. Default 'swagger'.
   */
  downloadName?: string;
  /**
   * Custom CSS.
   */
  css?: string;
  /**
   * URL to custom CSS.
   */
  cssUrl?: string;
  /**
   * The Swagger document.
   */
  document: SwaggerDocument;
  /**
   * URL to custom fav icon.
   */
  favIcon?: string;
  /**
   * Custom JavaScript.
   */
  js?: string;
  /**
   * URL to custom javascript.
   */
  jsUrl?: string;
  /**
   * Custom site title. Default: 'Swagger UI'
   */
  title?: string;
  /**
   * Custom ZU options.
   */
  uiOptions?: SwaggerUIOptions;
}

/**
 * Custom options for the UI.
 */
export interface SwaggerUIOptions {
  [property: string]: any;
}

/**
 * Sets up a flitz instance serving a Swagger UI.
 *
 * @param {Flitz} flitz The flitz instance.
 * @param {options} SwaggerOptions The custom options. 
 */
export function swagger(app: Flitz, options: SwaggerOptions): void {
  const basePath = options.basePath || '/swagger';
  if (typeof basePath !== 'string') {
    throw new TypeError('options.basePath must be a string');
  }

  const title = options.title || 'Swagger UI';
  if (typeof title !== 'string') {
    throw new TypeError('options.title must be a string');
  }

  const favIcon = options.favIcon || '';
  if (typeof favIcon !== 'string') {
    throw new TypeError('options.favIcon must be a string');
  }

  const cssUrl = options.cssUrl || '';
  if (typeof cssUrl !== 'string') {
    throw new TypeError('options.cssUrl must be a string');
  }

  const jsUrl = options.jsUrl || '';
  if (typeof jsUrl !== 'string') {
    throw new TypeError('options.jsUrl must be a string');
  }

  const customCss = options.css || '';
  if (typeof customCss !== 'string') {
    throw new TypeError('options.css must be a string');
  }

  const customJs = options.js || '';
  if (typeof customJs !== 'string') {
    throw new TypeError('options.js must be a string');
  }

  const downloadName = options.downloadName || '';
  if (typeof downloadName !== 'string') {
    throw new TypeError('options.downloadName must be a string');
  }

  // index.html
  {
    // build HTML
    let html = indexHtml;
    html = html.replace('<% title %>', title)
      .replace('<% favIconString %>', favIcon ? '<link rel="icon" href="' + favIcon + '" />' : defaultFavIcon)
      .replace('<% customJsUrl %>', jsUrl ? `<script src="${jsUrl}"></script>` : '')
      .replace('<% customCssUrl %>', cssUrl ? `<link href="${cssUrl}" rel="stylesheet">` : '')
      .replace('<% customCss %>', customCss)
      .replace('<% customJs %>', customJs ? `<script> ${customJs} </script>` : '')

    app.get(isIndexHtml(basePath), async (req, res) => {
      res.write(html);
      res.end();
    });
  }

  // swagger-ui-init.js
  {
    const initOptions = {
      swaggerDoc: options.document || undefined,
      customOptions: options.uiOptions || {},
      swaggerUrl: basePath + '/json',
    };

    // build JavaScript
    let js = swaggerUiInit;
    js = js.replace(
      '<% swaggerOptions %>',
      `var options = ${JSON.stringify(initOptions)}`
    );

    app.get(basePath + '/swagger-ui-init.js', async (req, res) => {
      res.setHeader('Content-type', 'application/javascript');
      res.write(js);
      res.end();
    });
  }

  // json
  {
    const jsonDoc = JSON.stringify(options.document, null, 2);

    app.get(basePath + '/json', async (req, res) => {
      res.setHeader('Content-type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${downloadName}.json`);

      res.write(jsonDoc);
      res.end();
    });
  }

  // yaml
  {
    const yamlDoc = dumpYaml(options.document);

    app.get(basePath + '/yaml', async (req, res) => {
      res.setHeader('Content-type', 'application/x-yaml');
      res.setHeader('Content-Disposition', `attachment; filename="${downloadName}.yaml`);

      res.write(yamlDoc);
      res.end();
    });
  }

  app.static(basePath, getAbsoluteFSPath());
}

function isIndexHtml(basePath: string): RequestPathValidator {
  return (req) => {
    return req.url === basePath ||
      req.url === basePath + '/' ||
      req.url === basePath + '/index.html';
  };
}
