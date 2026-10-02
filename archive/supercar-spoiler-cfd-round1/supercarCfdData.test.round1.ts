import {
  computedCfdModels,
  marginalReturnSteps,
  roundHalfAwayFromZero,
  verifyCfdExpectedValues,
} from "./supercarCfdData";

describe("Supercar CFD Data Integrity Verification", () => {
  it("should pass all expected value assertions", () => {
    expect(verifyCfdExpectedValues()).toBe(true);
  });

  it("verifies exact values for Baseline model", () => {
    const b = computedCfdModels[0];
    expect(b.dragN).toBe(565.47);
    expect(b.verticalN).toBe(-1415.69);
    expect(roundHalfAwayFromZero(b.liftToDrag, 2)).toBe(-2.5);
  });

  it("verifies exact values for 190° model", () => {
    const m = computedCfdModels[1];
    expect(m.dragN).toBe(674.95);
    expect(m.verticalN).toBe(550.42);
    expect(roundHalfAwayFromZero(m.deltaDragN, 2)).toBe(109.48);
    expect(roundHalfAwayFromZero(m.deltaDragPercent, 1)).toBe(19.4);
    expect(roundHalfAwayFromZero(m.netVerticalShiftN, 2)).toBe(1966.11);
    expect(roundHalfAwayFromZero(m.liftToDrag, 2)).toBe(0.82);
  });

  it("verifies exact values for 175° model", () => {
    const m = computedCfdModels[2];
    expect(m.dragN).toBe(890.87);
    expect(m.verticalN).toBe(3444.84);
    expect(roundHalfAwayFromZero(m.deltaDragN, 2)).toBe(325.4);
    expect(roundHalfAwayFromZero(m.deltaDragPercent, 1)).toBe(57.5);
    expect(roundHalfAwayFromZero(m.netVerticalShiftN, 2)).toBe(4860.53);
    expect(roundHalfAwayFromZero(m.liftToDrag, 2)).toBe(3.87);
  });

  it("verifies exact values for 150° model", () => {
    const m = computedCfdModels[3];
    expect(m.dragN).toBe(1424.8);
    expect(m.verticalN).toBe(8587.88);
    expect(roundHalfAwayFromZero(m.deltaDragN, 2)).toBe(859.33);
    expect(roundHalfAwayFromZero(m.deltaDragPercent, 1)).toBe(152.0);
    expect(roundHalfAwayFromZero(m.netVerticalShiftN, 2)).toBe(10003.57);
    expect(roundHalfAwayFromZero(m.liftToDrag, 2)).toBe(6.03);
  });

  it("verifies marginal returns between steps", () => {
    expect(roundHalfAwayFromZero(marginalReturnSteps[0].marginalReturn, 2)).toBe(17.96);
    expect(roundHalfAwayFromZero(marginalReturnSteps[1].marginalReturn, 2)).toBe(13.41);
    expect(roundHalfAwayFromZero(marginalReturnSteps[2].marginalReturn, 2)).toBe(9.63);
  });
});
