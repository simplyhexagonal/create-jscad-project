const { cuboid, cylinderElliptic } = require('@jscad/modeling').primitives;
const { union, subtract } = require('@jscad/modeling').booleans;
const { colorize } = require('@jscad/modeling').colors;
const { translate, rotate } = require('@jscad/modeling').transforms;

const brickWidth = 85;
const brickDepth = 175;
const brickHeight = 35;

const boardWidth = 60;
const boardDepth = 40;
const boardHeight = 15;

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

const wallHeight = 64;
const wallDepth = lidDepth;

const panelWidth = lidWidth;
const panelHeight = wallHeight - materialThickness - materialThickness;

const screwWidth = 3;

const caseOffset = 35;

const leftControlsOffset = -20 - 3.6875;

const parts = [
    "brick",
    "bottom_lid",
    //"top_lid",
    "left_wall",
    //"right_wall",
    "front_reinforcement",
    "middle_reinforcement",
    "back_reinforcement",
    "front_panel",
    "back_panel",
    "board",
];

const shapes = [];

if (parts.includes('brick')) {
    shapes.push(
        colorize(
            [0.5, 0.5, 0.5, 0.5],
            cuboid({
                size: [
                    brickWidth,
                    brickDepth,
                    brickHeight,
                ],
                center: [0, 0, 0],
            })
        )
    );
}

if (parts.includes('bottom_lid')) {
    shapes.push(
        subtract(
            translate(
                [0, -caseOffset, -((wallHeight - materialThickness) / 2)],
                cuboid({
                    size: [
                        lidWidth,
                        lidDepth,
                        materialThickness,
                    ],
                    center: [0, 0, 0],
                }),
            ),

            translate(
                [0, -caseOffset -((lidDepth - reinforcementThickness) / 2) + materialThickness, 0],
                translate(
                    [((panelWidth - screwWidth) / 2) - screwWidth, 0, -(panelHeight / 2) + reinforcementThickness],
                    cylinderElliptic({
                        height: reinforcementThickness * 3,
                        startWidth: screwWidth / 2,
                        endWidth: screwWidth / 2,
                        center: [0,0,0],
                    }),
                ),
            ),

            translate(
                [0, -caseOffset -((lidDepth - reinforcementThickness) / 2) + materialThickness, 0],
                translate(
                    [(-(panelWidth - screwWidth) / 2) + screwWidth, 0, -(panelHeight / 2) + reinforcementThickness],
                    cylinderElliptic({
                        height: reinforcementThickness * 3,
                        startWidth: screwWidth / 2,
                        endWidth: screwWidth / 2,
                        center: [0,0,0],
                    }),
                ),
            ),

            translate(
                [0, -caseOffset + ((lidDepth - reinforcementThickness) / 2) - materialThickness, 0],
                translate(
                    [((panelWidth - screwWidth) / 2) - screwWidth, 0, -(panelHeight / 2) + reinforcementThickness],
                    cylinderElliptic({
                        height: reinforcementThickness * 3,
                        startWidth: screwWidth / 2,
                        endWidth: screwWidth / 2,
                        center: [0,0,0],
                    }),
                ),
            ),

            translate(
                [0, -caseOffset + ((lidDepth - reinforcementThickness) / 2) - materialThickness, 0],
                translate(
                    [(-(panelWidth - screwWidth) / 2) + screwWidth, 0, -(panelHeight / 2) + reinforcementThickness],
                    cylinderElliptic({
                        height: reinforcementThickness * 3,
                        startWidth: screwWidth / 2,
                        endWidth: screwWidth / 2,
                        center: [0,0,0],
                    }),
                ),
            ),
        )
    );
}

const main = () => {
module.exports = { main };  return shapes;
};

module.exports = { main };
