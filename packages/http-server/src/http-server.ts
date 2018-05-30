// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/http-server
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {createServer, Server} from 'http';
import {HttpRequestListener} from '@loopback/rest';
import {AddressInfo} from 'net';
import * as pEvent from 'p-event';

/**
 * Object for specifyig the HTTP / HTTPS server options
 */
export type HttpServerOptions = {
  port: number;
  host: string | undefined;
};

/**
 * HTTP / HTTPS server used by LoopBack's RestServer
 *
 * @export
 * @class HttpServer
 */
export class HttpServer {
  private _port: number;
  private _host: string | undefined;
  /**
   * Protocol, default to `http`
   */
  private _protocol: 'http' | 'https'; // Will be extended to `http2` in the future
  private _url: string;
  private _address: AddressInfo;
  private httpRequestListener: HttpRequestListener;
  private httpServer: Server;

  /**
   * @param httpServerOptions
   * @param httpRequestListener
   */
  constructor(
    httpRequestListener: HttpRequestListener,
    httpServerOptions: HttpServerOptions,
  ) {
    this._port = httpServerOptions.port;
    this._host = httpServerOptions.host;
    this.httpRequestListener = httpRequestListener;
  }

  /**
   * Starts the HTTP / HTTPS server
   */
  public async start() {
    this.httpServer = createServer(this.httpRequestListener);
    this.httpServer.listen(this._port, this._host);
    await pEvent(this.httpServer, 'listening');
    this._address = this.httpServer.address() as AddressInfo;
    this._host = this._host || this._address.address;
    this._port = this._address.port;
    this._protocol = this._protocol || 'http';
    if (this._address.family === 'IPv6') {
      this._host = `[${this._host}]`;
    }
    if (process.env.TRAVIS) {
      // Travis CI seems to have trouble connecting to '[::]' or '[::1]'
      // Set host to `127.0.0.1`
      if (
        this._address.address === '::' ||
        this._address.address === '0.0.0.0'
      ) {
        this._host = '127.0.0.1';
      }
    }
    this._url = `${this._protocol}://${this.host}:${this.port}`;
  }

  /**
   * Stops the HTTP / HTTPS server
   */
  public async stop() {
    this.httpServer.close();
    await pEvent(this.httpServer, 'close');
  }

  /**
   * Protocol of the HTTP / HTTPS server
   */
  public get protocol(): 'http' | 'https' {
    return this._protocol;
  }

  /**
   * Port number of the HTTP / HTTPS server
   */
  public get port(): number {
    return this._port;
  }

  /**
   * Host of the HTTP / HTTPS server
   */
  public get host(): string | undefined {
    return this._host;
  }

  /**
   * URL of the HTTP / HTTPS server
   */
  public get url(): string {
    return this._url;
  }

  /**
   * Address of the HTTP / HTTPS server
   */
  public address(): AddressInfo {
    return this._address;
  }
}
