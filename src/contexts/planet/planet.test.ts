import {
  toGeographicalCoordinates,
  toSphericalCoordinates,
  toSphericalDistribution,
} from ".";

describe("Planet", () => {
  for (const data of [
    [0, 0],
    [1, 1],
    [0.5, 0.5],
    [0.33, 0.67],
  ] as [number, number][]) {
    it("converts between spherical and geographical coordinates", () => {
      const sphericalDistribution = toSphericalDistribution(data);
      const geographicalDistribution = toGeographicalCoordinates(
        sphericalDistribution
      );
      const sphericalCoordinates = toSphericalCoordinates(
        geographicalDistribution
      );
      const geographicalCoordinates = toGeographicalCoordinates(
        sphericalCoordinates
      );
      console.log({ data, sphericalCoordinates, geographicalCoordinates });
      expect(sphericalCoordinates).toEqual(sphericalDistribution);
      expect(geographicalCoordinates).toEqual(geographicalDistribution);
    });
  }
});
