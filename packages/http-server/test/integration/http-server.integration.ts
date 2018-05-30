// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/http-server
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {HttpServer} from '../../';
import {Application, ApplicationConfig} from '@loopback/core';
import {RestServer, RestComponent, RestBindings} from '@loopback/rest';
import {supertest as request, expect} from '@loopback/testlab';

describe('HttpServer (integration)', () => {
  it('starts server', async () => {
    const server = new HttpServer(
      (req, res) => {
        res.end();
      },
      {
        port: 9000,
        host: 'localhost',
      },
    );
    await server.start();
    request(server.url)
      .get('/')
      .expect(200);
    await server.stop();
  });

  // @bajtos how do we test this?
  it('stops server', async () => {
    const server = new HttpServer(
      (req, res) => {
        res.end();
      },
      {
        port: 9000,
        host: 'localhost',
      },
    );
    await server.start();
    await server.stop();
    return request(server.url)
      .get('/')
      .expect(200);
  });

  it('supports RestBindings', async () => {
    const app = new Application({
      rest: {
        port: 0,
      },
    });
    app.component(RestComponent);
    const server = await app.getServer(RestServer);
    server.bind(RestBindings.PORT).to(0);
    await server.start();
    // @bajtos `_httpServer` of `server` is protected, how do we check the port and other details here?
  });
});
