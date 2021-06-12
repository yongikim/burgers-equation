import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { DT } from "./constants.ts";

export class Cell {
  private _dx: number;
  private _u: number;

  get u() {
    return this._u;
  }

  constructor(dx: number, u: number) {
    this._dx = dx;
    this._u = u;
  }

  update(prevCellValue: number, nextCellValue: number) {
    const fluxRight = this.flux(this.u, nextCellValue);
    const fluxLeft = this.flux(prevCellValue, this.u);
    this._u -= (fluxRight - fluxLeft) / this._dx;
  }

  private flux(ul: number, ur: number): number {
    const u = this.riemann(0, ul, ur);
    return DT * Math.pow(u, 2) / 2;
  }

  private riemann(dxdt: number, ul: number, ur: number): number {
    const s = (ul + ur) / 2;
    if (dxdt < s) {
      return ul;
    } else if (dxdt > s) {
      return ur;
    } else {
      return s;
    }
  }
}

Deno.test("init cell", () => {
  const dx = 1;
  const u = 2;

  const cell = new Cell(dx, u);

  assertEquals(cell.u, u);
});
