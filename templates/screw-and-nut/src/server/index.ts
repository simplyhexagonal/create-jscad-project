import fs from 'fs';
import path from 'path';
import fastify from 'fastify';
import {
  m3fSerializer,
  x3dSerializer,
  svgSerializer,
} from '@jscad/io';
import {
  extrusions,
  transforms,
} from '@jscad/modeling';

const { rotateX, rotateY, rotateZ } = transforms;
const { project } = extrusions;


const postProcess = (entities: any, uiState: any) => {
  let finalEntities = entities;

  if (uiState.rotateEntitiesX) {
    finalEntities = rotateX(Math.PI / 2, finalEntities);
  }

  if (uiState.rotateEntitiesY) {
    finalEntities = rotateY(Math.PI / 2, finalEntities);
  }

  if (uiState.rotateEntitiesZ) {
    finalEntities = rotateZ(Math.PI / 2, finalEntities);
  }

  if (uiState.projectEntities) {
    finalEntities = project({}, finalEntities);
  }

  return finalEntities;
}

// @ts-ignore
import pkg from '../../package.json' assert { type: "json" };

const { version } = pkg;

// define __dirname for esm
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const server = fastify();

// const decoder = new TextDecoder();

server.get(
  '/api/version/',
  async () => {
    return { version };
  }
);

server.post(
  '/api/export/3mf/',
  async (request, reply) => {

    const options: Record<string, any> = request.body || {};

    const { main } = await import('../pages/design');

    console.log('Loading model...');

    let entities = await main(options);

    entities = postProcess(entities, options);

    console.log('Rendering model...');

    let rawData = [];

    try {
      rawData = m3fSerializer.serialize({}, entities);
    } catch (error) {
      console.error(error);

      return error;
    }

    console.log('Writing model...');

    const byteArray = new Uint8Array(rawData[0]);

    const buffer = Buffer.alloc(byteArray.length);

    for (var i = 0; i < byteArray.length; i++) {
        buffer.writeUInt8(byteArray[i], i);
    }

    try {
      fs.writeFileSync(
        path.join(__dirname, '../../output', options.exportName ? options.exportName : 'design.3mf'),
        buffer
      );
    } catch (error) {
      console.error(error);
    }

    console.log('Done.');

    reply.send(
      JSON.stringify(
        {
          status: 'ok',
        }
      )
    );
  }
);

server.post(
  '/api/export/x3d/',
  async (request, reply) => {
    console.log('/api/export/x3d/');

    const options: Record<string, any> = request.body || {};

    const { main } = await import('../pages/design');

    console.log('Loading model...');

    let entities = await main(options);

    entities = postProcess(entities, options);

    console.log('Rendering model...');

    let rawData = [];

    try {
      rawData = x3dSerializer.serialize({}, entities);
    } catch (error) {
      console.error(error);

      return error;
    }

    console.log('Writing model...');

    try {
      fs.writeFileSync(
        path.join(__dirname, '../../output', options.exportName ? options.exportName : 'design.x3d'),
        rawData.join()
      );
    } catch (error) {
      console.error(error);
    }

    console.log('Done.');

    reply.send(
      JSON.stringify(
        {
          status: 'ok',
        }
      )
    );
  }
);

server.post(
  '/api/export/svg/',
  async (request, reply) => {
    console.log('/api/export/svg/');

    const options: Record<string, any> = request.body || {};

    const { main } = await import('../pages/design');

    console.log('Loading model...');

    let entities = await main(options);

    entities = postProcess(entities, options);

    console.log('Rendering model...');

    let rawData = [];

    try {
      rawData = svgSerializer.serialize({}, entities);
    } catch (error) {
      console.error(error);

      return error;
    }

    console.log('Writing model...');

    try {
      fs.writeFileSync(
        path.join(__dirname, '../../output', options.exportName ? options.exportName : 'design.svg'),
        rawData.join()
      );
    } catch (error) {
      console.error(error);
    }

    console.log('Done.');

    reply.send(
      JSON.stringify(
        {
          status: 'ok',
        }
      )
    );
  }
);

server.listen(
  {
    host: '0.0.0.0',
    port: 3000,
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`\nServer listening at ${address}\n\nYou can now reload the Simple Browser to see the CAD design.`);
  }
);
