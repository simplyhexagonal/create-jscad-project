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
    console.log('/api/export/3mf/');

    const { drawing } = await import('../pages/drawing');

    console.log('Loading model...');

    const entities = await drawing(request.body || {});

    console.log('Rendering model...');

    const rawData = m3fSerializer.serialize({}, entities);

    console.log('Writing model...');

    // console.log(rawData);

    const byteArray = new Uint8Array(rawData[0]);

    const buffer = Buffer.alloc(byteArray.length);

    for (var i = 0; i < byteArray.length; i++) {
        buffer.writeUInt8(byteArray[i], i);
    }

    try {
      fs.writeFileSync(
        path.join(__dirname, '../../output', 'drawing.3mf'),
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

    const { drawing } = await import('../pages/drawing');

    console.log('Loading model...');

    const entities = await drawing(request.body || {});

    console.log('Rendering model...');

    const rawData = x3dSerializer.serialize({}, entities);

    console.log('Writing model...');

    // console.log(rawData);

    try {
      fs.writeFileSync(
        path.join(__dirname, '../../output', 'drawing.x3d'),
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

    const { drawing } = await import('../pages/drawing');

    console.log('Loading model...');

    let entities = await drawing({});

    // console.log(request.body);
    entities = postProcess(entities, request.body || {});

    console.log('Rendering model...');

    const rawData = svgSerializer.serialize({}, entities);

    console.log('Writing model...');

    // console.log(rawData);

    try {
      fs.writeFileSync(
        path.join(__dirname, '../../output', 'drawing.svg'),
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

    console.log(`Server listening at ${address}`);
  }
);
