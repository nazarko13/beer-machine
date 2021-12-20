import { createEnum } from 'common/utils';

const controlTypes = createEnum({
  topLeft: null,
  topRight: null,
  bottomLeft: null,
  bottomRight: null,
});

export const controlPositions = {
  [controlTypes.topLeft]: {
    top: 0,
    left: 0,
  },
  [controlTypes.topRight]: {
    top: 0,
    right: 0,
  },
  [controlTypes.bottomLeft]: {
    bottom: 0,
    left: 0,
  },
  [controlTypes.bottomRight]: {
    bottom: 0,
    right: 0,
  },
};

export const controlsOrderToAccess = [
  controlTypes.topLeft,
  controlTypes.topRight,
  controlTypes.bottomLeft,
];
