import jscad from '@jscad/modeling';
import { Parameter } from './parameters';
const { cylinder } = jscad.primitives;
const { subtract, union } = jscad.booleans;
const { colorize } = jscad.colors;
const { extrudeFromSlices, slice } = jscad.extrusions;
const { translate, scale } = jscad.transforms;

interface Options {
  hexWidth: number;
  hexHeight: number;
  threadLength: number;
  threadSize: number;
  innerRadius: number;
  outerRadius: number;
  slicesPerRevolution: number;
  segments: number;
  tolerance: number;
}

const options = {
  hexWidth: 2.5,
  hexHeight: 3,
  threadLength: 10,
  threadSize: 1,
  innerRadius: 1,
  outerRadius: 1.5,
  slicesPerRevolution: 12,
  segments: 32,
  tolerance: 0.1,
};

export const getParameterDefinitions = (): Parameter[] => (
  [
    { name: 'color', type: 'color', initial: '#FFB431', caption: 'Color' },
    { name: 'threadLength', type: 'number', initial: options.threadLength, caption: 'Screw Length (mm)' },
    { name: 'threadDiameter', type: 'number', initial: options.outerRadius * 2, caption: 'Screw Diameter (mm)' },
    { name: 'tolerance', type: 'number', initial: options.tolerance, step: 0.1, caption: 'Tolerance (mm)' },
  ]
);

export const main = (params: any) => {
  const {
    color,
    threadLength,
    threadDiameter,
    tolerance,
  } = params;

  const finalOptions = color ? {
    ...options,
    threadLength,
    innerRadius: ((threadDiameter / 2) / 3) * 2,
    outerRadius: threadDiameter / 2,
    hexWidth: ((threadDiameter / 2) / 3) * 5,
    hexHeight: threadDiameter,
    tolerance: tolerance,
  } : options;

  return colorize(
    color || [1, 0, 0, 1],
    [
      bolt(finalOptions),
      translate(
        [0, -(finalOptions.hexWidth * 2), 0], 
        nut(finalOptions),
      ),
    ]
  );
};

// generate bolt by attaching threads to a hex head
const bolt = (options: Options) => {
  return union(
    translate([0, 0, options.threadLength], hex(options)),
    threads(options),
  );
};

// generate nut by subtracting threads from a hex block
const nut = (options: Options) => {
  const finalTolerance = (options.outerRadius + options.tolerance) / options.outerRadius;

  return subtract(
    hex(options),
    scale(
      [finalTolerance, finalTolerance, finalTolerance],
      threads({ ...options, threadLength: options.hexHeight }),
    ),
  );
};

// generate hexagonal block
const hex = (options: Options) => {
  const radius = options.hexWidth * 1.1547005; // hexagon outer radius
  const height = options.hexHeight;

  return cylinder({ center: [0, 0, height / 2], height, radius, segments: 6 });
};

// generate a threaded shaft using extrudeFromSlices
const threads = (options: Options) => {
  const { innerRadius, outerRadius, segments, threadLength } = options;
  const revolutions = threadLength / options.threadSize;
  const numberOfSlices = options.slicesPerRevolution * revolutions;

  return extrudeFromSlices({
    numberOfSlices,
    callback: (progress, index, base) => {
      // generate each slice manually
      const points: any[] = [];

      for (let i = 0; i < segments; i++) {
        const pointAngle = Math.PI * 2 * i / segments;
        const threadAngle = (2 * Math.PI * revolutions * progress) % (Math.PI * 2);

        // define the shape of the threads
        const phase = angleDiff(threadAngle, pointAngle) / Math.PI
        const radius = lerp(innerRadius, outerRadius, 1.4 * phase - 0.2)

        const x = radius * Math.cos(pointAngle);
        const y = radius * Math.sin(pointAngle);

        points.push([x, y, threadLength * progress]);
      }

      return slice.fromPoints(points);
    }
  }, {});
};

// linear interpolation with bounding
const lerp = (a: number, b: number, t: number) => Math.max(a, Math.min(b, a + (b - a) * t));

const angleDiff = (angle1: number, angle2: number) => {
  const diff = Math.abs((angle1 - angle2) % (Math.PI * 2));
  return diff > Math.PI ? Math.PI * 2 - diff : diff;
};