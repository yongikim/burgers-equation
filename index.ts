import { Godunov, Range } from "./Godunov.ts";

const range: Range = [0, 3];
const numCells = 100;
const initFun = (x: number): number => {
  if (x < 1) {
    return -0.2;
  } else if (x < 2) {
    return -0.1;
  } else {
    return -0.2;
  }
};

const godunov = new Godunov(range, numCells, initFun);

godunov.solve();
