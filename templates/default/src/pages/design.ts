import jscad from '@jscad/modeling';
import { RGB, RGBA } from '@jscad/modeling/src/colors/types';
import { Parameter } from '../components/Parameters/parameters';

const { cuboid } = jscad.primitives;
const { colorize } = jscad.colors;
// const { translate, scale } = jscad.transforms;
// const { subtract, union } = jscad.booleans;
// const { extrudeFromSlices, slice } = jscad.extrusions;

type Shapes = (jscad.geometries.geom3.Geom3 | jscad.geometries.geom3.Geom3[])[];

interface Options {
  color: RGB | RGBA;
}

const options: Options = {
  color: [0.5, 0.5, 0.5, 1],
};

export const getParameterDefinitions = (): Parameter[] => (
  [
    { name: 'color', type: 'color', initial: '#888888', caption: 'Color' },
  ]
);

const parametersToOptions = (params: Partial<Options>): Options => {
  const {
    color,
  } = params;

  return color ? {
    ...options,
    ...params,
  } : options;
};

export const main = (params: Partial<Options>) => {
  const finalOptions = parametersToOptions(params);

  const shapes: Shapes = [
    cuboid(
      {
        size: [100, 100, 100],
      }
    ),
  ];

  return colorize(
    finalOptions.color,
    shapes,
  );
};
