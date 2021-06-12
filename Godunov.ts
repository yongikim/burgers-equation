import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { Cell } from "./Cell.ts";
import { simpsonIntegration } from "./Utils.ts";
import { DT, T_END } from "./constants.ts";

export type Range = [number, number];
type BoundaryValues = [number, number];

export class Godunov {
  private _cells: Cell[];
  private _cellValues: number[];
  private _boundaryValues: BoundaryValues;

  get cells() {
    return this._cells;
  }

  constructor(
    xrange: Range,
    numCells: number,
    initFun: (u: number) => number,
  ) {
    this._cells = this.createCells(xrange, numCells, initFun);
    this._cellValues = this._cells.map((cell) => cell.u);

    const leftBoundaryValue = initFun(xrange[0] - 1);
    const rightBoundaryValue = initFun(xrange[1] + 1);
    this._boundaryValues = [leftBoundaryValue, rightBoundaryValue];
  }

  solve() {
    this.writeCellValuesToFile("./initValues.txt");

    for (let n = 0; n * DT < T_END; n++) {
      this.updateCells();
    }

    this.writeCellValuesToFile("./finalValues.txt");
  }

  private createCells(
    xrange: Range,
    numCells: number,
    initFun: (x: number) => number,
  ): Cell[] {
    const cells = [];
    const dx = (xrange[1] - xrange[0]) / numCells;
    for (let cellIndex = 0; cellIndex < numCells; cellIndex++) {
      const xLeft = xrange[0] + cellIndex * dx;
      const xRight = xLeft + dx;
      const u = simpsonIntegration(initFun, [xLeft, xRight]) / dx;
      cells.push(new Cell(dx, u));
    }
    return cells;
  }

  private updateCells() {
    for (let cellIndex = 0; cellIndex < this._cells.length; cellIndex++) {
      const ul = cellIndex == 0
        ? this._boundaryValues[0]
        : this._cellValues[cellIndex - 1];
      const ur = cellIndex == this._cells.length - 1
        ? this._boundaryValues[1]
        : this._cellValues[cellIndex + 1];

      this._cells[cellIndex].update(ul, ur);
    }

    this._cellValues = this._cells.map((cell) => cell.u);
  }

  private writeCellValuesToFile(filename: string) {
    let fileContent = "";
    this._cells.forEach((cell, cellIndex) =>
      fileContent += `${cellIndex}, ${cell.u}\n`
    );
    Deno.writeTextFileSync(filename, fileContent);
  }
}

Deno.test("init Godunov", () => {
  const range: Range = [0, 3];
  const numCells = 3;
  const initFun = (x: number): number => {
    if (0 <= x && x < 1) {
      return 1;
    } else if (1 <= x && x < 2) {
      return -2;
    } else if (2 <= x && x < 3) {
      return 1;
    } else {
      return 0;
    }
  };

  const godunov = new Godunov(range, numCells, initFun);

  console.log(godunov.cells);

  assertEquals(godunov.cells.length, 3);
  assertEquals(Math.abs(1 - godunov.cells[0].u) < 0.01, true);
  assertEquals(Math.abs(-2 - godunov.cells[1].u) < 0.01, true);
  assertEquals(Math.abs(1 - godunov.cells[2].u) < 0.01, true);
});
