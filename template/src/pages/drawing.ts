import {
  primitives,
  booleans,
  colors,
  transforms,
} from '@jscad/modeling';
import { RGBA } from '@jscad/modeling/src/colors/types';

const {
  subtract,
  intersect,
} = booleans;
const { colorize } = colors;
const {
  translate,
  rotate,
} = transforms;
const {
  cuboid,
  cylinderElliptic,
} = primitives;

const brickWidth = 85;
const brickDepth = 175;
const brickHeight = 35;
const brickColor: RGBA = [0.5, 0.5, 0.5, 0.5];

const boardWidth = 60;
const boardDepth = 40;
const boardHeight = 15;
const boardColor: RGBA = [1.0, 0.0, 0.0, 0.5];

const socketWidth = 26.5;
const socketDepth = 13;
const socketHeight = 18.5;

const screenWidth = 45;
const screenDepth = 15;
const screenHeight = 26.5;

const fuseWidth = 11;
const fuseDepth = 30;
const fuseHeight = 12;

const switchWidth = 19;
const switchDepth = 12;
const switchHeight = 12;

const potMinWidth = 7;
const potMaxWidth = 20;

const bananaMinWidth = 6;
const bananaMaxWidth = 11;

const materialThickness = 3;
const reinforcementThickness = 9;

const lidWidth = 194;
const lidDepth = 340;
const lidColor:RGBA = [1, 1, 0, 1];

const wallHeight = 64;
const wallDepth = lidDepth;
const wallColor:RGBA = [1, 0, 1, 1];

const panelWidth = lidWidth;
const panelHeight = wallHeight - materialThickness - materialThickness;
const panelColor:RGBA = [0, 1, 1, 1];

const reinforcementColor:RGBA = [0, 1, 0, 1];

const screwWidth = 3;

const caseOffset = -35;

const leftControlsOffset = -20 - 3.6875;

const selectionColor:RGBA = [1, 0, 0, 1];

const parts = [
    'brick',
    'board',
    'bottom_lid',
    'left_wall',
    'front_reinforcement',
    'middle_reinforcement',
    'back_reinforcement',
    'front_panel',
    'back_panel',
    //'top_lid',
    //'right_wall',
];

const shapes: any[] = [];

const lid = () => subtract(
  cuboid(
    {
      size: [lidWidth, lidDepth, materialThickness],
      center: [
        0,
        0,
        0,
      ],
    },
  ),
  cylinderElliptic({
    height: reinforcementThickness * 3,
    startRadius: [screwWidth / 2, screwWidth / 2],
    endRadius: [screwWidth / 2, screwWidth / 2],
    center: [
      ((panelWidth - screwWidth) / 2) - screwWidth,
      -((lidDepth - reinforcementThickness) / 2) + materialThickness,
      0,
    ],
  }),
  cylinderElliptic({
    height: reinforcementThickness * 3,
    startRadius: [screwWidth / 2, screwWidth / 2],
    endRadius: [screwWidth / 2, screwWidth / 2],
    center: [
      -((panelWidth - screwWidth) / 2) + screwWidth,
      -((lidDepth - reinforcementThickness) / 2) + materialThickness,
      0,
    ],
  }),
  cylinderElliptic({
    height: reinforcementThickness * 3,
    startRadius: [screwWidth / 2, screwWidth / 2],
    endRadius: [screwWidth / 2, screwWidth / 2],
    center: [
      ((panelWidth - screwWidth) / 2) - screwWidth,
      ((lidDepth - reinforcementThickness) / 2) - materialThickness,
      0,
    ],
  }),
  cylinderElliptic({
    height: reinforcementThickness * 3,
    startRadius: [screwWidth / 2, screwWidth / 2],
    endRadius: [screwWidth / 2, screwWidth / 2],
    center: [
      -((panelWidth - screwWidth) / 2) + screwWidth,
      ((lidDepth - reinforcementThickness) / 2) - materialThickness,
      0,
    ],
  }),
);

const wall = () => subtract(
  cuboid(
    {
      size: [materialThickness, wallDepth, wallHeight],
      center: [
        0,
        0,
        0,
      ],
    },
  ),
  rotate(
    [0, Math.PI / 2, 0],
    cylinderElliptic({
      height: reinforcementThickness * 3,
      startRadius: [screwWidth / 2, screwWidth / 2],
      endRadius: [screwWidth / 2, screwWidth / 2],
      center: [
        0,
        0,
        0,
      ],
    }),
  ),
);

const reinforcement = () => subtract(
  cuboid(
    {
      size: [panelWidth, reinforcementThickness, panelHeight],
      center: [
        0,
        0,
        0,
      ],
    },
  ),
  cuboid(
    {
      size: [
        panelWidth - (reinforcementThickness * 2),
        reinforcementThickness,
        panelHeight - (reinforcementThickness * 2),
      ],
      center: [
        0,
        0,
        0,
      ],
    },
  ),
  rotate(
    [0, Math.PI / 2, 0],
    cylinderElliptic({
      height: reinforcementThickness * 3,
      startRadius: [screwWidth / 2, screwWidth / 2],
      endRadius: [screwWidth / 2, screwWidth / 2],
      center: [
        0,
        0,
        (panelWidth / 2),
      ],
    }),
  ),
  rotate(
    [Math.PI / 2, 0, 0],
    cylinderElliptic({
      height: reinforcementThickness * 3,
      startRadius: [screwWidth / 2, screwWidth / 2],
      endRadius: [screwWidth / 2, screwWidth / 2],
      center: [
        -((panelWidth - screwWidth) / 2) + screwWidth,
        0,
        0,
      ],
    }),
  ),
  rotate(
    [0, Math.PI / 2, 0],
    cylinderElliptic({
      height: reinforcementThickness * 3,
      startRadius: [screwWidth / 2, screwWidth / 2],
      endRadius: [screwWidth / 2, screwWidth / 2],
      center: [
        0,
        0,
        -(panelWidth / 2),
      ],
    }),
  ),
  rotate(
    [Math.PI / 2, 0, 0],
    cylinderElliptic({
      height: reinforcementThickness * 3,
      startRadius: [screwWidth / 2, screwWidth / 2],
      endRadius: [screwWidth / 2, screwWidth / 2],
      center: [
        ((panelWidth - screwWidth) / 2) - screwWidth,
        0,
        0,
      ],
    }),
  ),
  cylinderElliptic({
    height: reinforcementThickness * 3,
    startRadius: [screwWidth / 2, screwWidth / 2],
    endRadius: [screwWidth / 2, screwWidth / 2],
    center: [
      ((panelWidth - screwWidth) / 2) - screwWidth,
      0,
      (panelHeight / 2),
    ],
  }),
  cylinderElliptic({
    height: reinforcementThickness * 3,
    startRadius: [screwWidth / 2, screwWidth / 2],
    endRadius: [screwWidth / 2, screwWidth / 2],
    center: [
      ((panelWidth - screwWidth) / 2) - screwWidth,
      0,
      -(panelHeight / 2),
    ],
  }),
  cylinderElliptic({
    height: reinforcementThickness * 3,
    startRadius: [screwWidth / 2, screwWidth / 2],
    endRadius: [screwWidth / 2, screwWidth / 2],
    center: [
      -((panelWidth - screwWidth) / 2) + screwWidth,
      0,
      (panelHeight / 2),
    ],
  }),
  cylinderElliptic({
    height: reinforcementThickness * 3,
    startRadius: [screwWidth / 2, screwWidth / 2],
    endRadius: [screwWidth / 2, screwWidth / 2],
    center: [
      -((panelWidth - screwWidth) / 2) + screwWidth,
      0,
      -(panelHeight / 2),
    ],
  }),
);

const frontPanel = () => subtract(
  cuboid(
    {
      size: [panelWidth, materialThickness, panelHeight],
      center: [
        0,
        0,
        0,
      ],
    },
  ),
  rotate(
    [Math.PI / 2, 0, 0],
    cylinderElliptic({
      height: reinforcementThickness * 3,
      startRadius: [screwWidth / 2, screwWidth / 2],
      endRadius: [screwWidth / 2, screwWidth / 2],
      center: [
        -((panelWidth - screwWidth) / 2) + screwWidth,
        0,
        0,
      ],
    }),
  ),
  rotate(
    [Math.PI / 2, 0, 0],
    cylinderElliptic({
      height: reinforcementThickness * 3,
      startRadius: [screwWidth / 2, screwWidth / 2],
      endRadius: [screwWidth / 2, screwWidth / 2],
      center: [
        ((panelWidth - screwWidth) / 2) - screwWidth,
        0,
        0,
      ],
    }),
  ),
  cuboid(
    {
      size: [screenWidth, screenDepth, screenHeight],
      center: [
        0,
        0,
        6,
      ],
    },
  ),
  rotate(
    [Math.PI / 2, 0, 0],
    cylinderElliptic({
      height: fuseDepth,
      startRadius: [bananaMinWidth / 2, bananaMinWidth / 2],
      endRadius: [bananaMinWidth / 2, bananaMinWidth / 2],
      center: [
        -34 - bananaMaxWidth - 3 + leftControlsOffset,
        -8,
        0,
      ],
    }),
  ),
  rotate(
    [Math.PI / 2, 0, 0],
    cylinderElliptic({
      height: fuseDepth,
      startRadius: [bananaMinWidth / 2, bananaMinWidth / 2],
      endRadius: [bananaMinWidth / 2, bananaMinWidth / 2],
      center: [
        -32 + leftControlsOffset,
        -8,
        0,
      ],
    }),
  ),
  cuboid(
    {
      size: [switchWidth, switchDepth, switchHeight],
      center: [
        -40 + leftControlsOffset,
        0,
        6,
      ],
    },
  ),
  rotate(
    [Math.PI / 2, 0, 0],
    cylinderElliptic({
      height: fuseDepth,
      startRadius: [bananaMinWidth / 2, bananaMinWidth / 2],
      endRadius: [bananaMinWidth / 2, bananaMinWidth / 2],
      center: [
        34 + bananaMaxWidth + 6,
        -8,
        0,
      ],
    }),
  ),
  rotate(
    [Math.PI / 2, 0, 0],
    cylinderElliptic({
      height: fuseDepth,
      startRadius: [bananaMinWidth / 2, bananaMinWidth / 2],
      endRadius: [bananaMinWidth / 2, bananaMinWidth / 2],
      center: [
        35,
        -8,
        0,
      ],
    }),
  ),
  cuboid(
    {
      size: [switchWidth, switchDepth, switchHeight],
      center: [
        
        43,
        0,
        6,
      ],
    },
  ),
  rotate(
    [Math.PI / 2, 0, 0],
    cylinderElliptic({
      height: fuseDepth,
      startRadius: [potMinWidth / 2, potMinWidth / 2],
      endRadius: [potMinWidth / 2, potMinWidth / 2],
      center: [
        72,
        0,
        0,
      ],
    }),
  ),
);

const backPanel = () => subtract(
  cuboid(
    {
      size: [panelWidth, materialThickness, panelHeight],
      center: [
        0,
        0,
        0,
      ],
    },
  ),
  rotate(
    [Math.PI / 2, 0, 0],
    cylinderElliptic({
      height: reinforcementThickness * 3,
      startRadius: [screwWidth / 2, screwWidth / 2],
      endRadius: [screwWidth / 2, screwWidth / 2],
      center: [
        -((panelWidth - screwWidth) / 2) + screwWidth,
        0,
        0,
      ],
    }),
  ),
  rotate(
    [Math.PI / 2, 0, 0],
    cylinderElliptic({
      height: reinforcementThickness * 3,
      startRadius: [screwWidth / 2, screwWidth / 2],
      endRadius: [screwWidth / 2, screwWidth / 2],
      center: [
        ((panelWidth - screwWidth) / 2) - screwWidth,
        0,
        0,
      ],
    }),
  ),
  cuboid(
    {
      size: [socketWidth, socketDepth, socketHeight],
      center: [
        0,
        0,
        0,
      ],
    },
  ),
  cuboid(
    {
      size: [switchWidth, switchDepth, switchHeight],
      center: [
        -50,
        0,
        0,
      ],
    },
  ),
  intersect(
    cuboid(
      {
        size: [fuseWidth, fuseDepth, fuseHeight],
        center: [
          50,
          0,
          0,
        ],
      },
    ),
    rotate(
      [Math.PI / 2, 0, 0],
      cylinderElliptic({
        height: fuseDepth,
        startRadius: [fuseHeight / 2, fuseHeight / 2],
        endRadius: [fuseHeight / 2, fuseHeight / 2],
        center: [
          50,
          0,
          0,
        ],
      }),
    ),
  ),
);

export const drawing = (_: any) => {
  if (parts.includes('brick')) {
    shapes.push(
      colorize(
        brickColor,
        cuboid({ size: [brickWidth, brickDepth, brickHeight] }),
      )
    );
  }

  if (parts.includes('board')) {
    shapes.push(
      colorize(
        boardColor,
        cuboid({
          size: [boardWidth, boardDepth, boardHeight],
          center: [0, -((brickDepth + boardDepth) / 2) - 35, 0],
        }),
      )
    );
  }

  if (parts.includes('bottom_lid')) {
    shapes.push(
      colorize(
        lidColor,
        translate(
          [0, caseOffset, -((wallHeight - materialThickness) / 2)],
          lid(),
        ),
      )
    );
  }

  if (parts.includes('top_lid')) {
    shapes.push(
      colorize(
        lidColor,
        translate(
          [0, caseOffset, ((wallHeight - materialThickness) / 2)],
          lid(),
        ),
      )
    );
  }

  if (parts.includes('left_wall')) {
    shapes.push(
      colorize(
        wallColor,
        translate(
          [-((lidWidth + materialThickness) / 2), caseOffset, 0],
          wall(),
        ),
      )
    );
  }

  if (parts.includes('right_wall')) {
    shapes.push(
      colorize(
        wallColor,
        translate(
          [((lidWidth + materialThickness) / 2), caseOffset, 0],
          wall(),
        ),
      )
    );
  }

  if (parts.includes('front_reinforcement')) {
    shapes.push(
      colorize(
        reinforcementColor,
        translate(
          [
            0,
            caseOffset - ((lidDepth - reinforcementThickness) / 2) + materialThickness,
            0,
          ],
          reinforcement(),
        ),
      )
    );
  }

  if (parts.includes('middle_reinforcement')) {
    shapes.push(
      colorize(
        reinforcementColor,
        translate(
          [0, caseOffset, 0],
          reinforcement(),
        ),
      )
    );
  }

  if (parts.includes('back_reinforcement')) {
    shapes.push(
      colorize(
        reinforcementColor,
        translate(
          [
            0,
            caseOffset + ((lidDepth - reinforcementThickness) / 2) - materialThickness,
            0,
          ],
          reinforcement(),
        ),
      )
    );
  }

  if (parts.includes('front_panel')) {
    shapes.push(
      colorize(
        panelColor,
        translate(
          [
            0,
            caseOffset - ((lidDepth - materialThickness) / 2),
            0,
          ],
          frontPanel(),
        ),
      )
    );
  }

  if (parts.includes('back_panel')) {
    shapes.push(
      colorize(
        panelColor,
        translate(
          [
            0,
            caseOffset + ((lidDepth - materialThickness) / 2),
            0,
          ],
          backPanel(),
        ),
      )
    );
  }

  return shapes;
};
