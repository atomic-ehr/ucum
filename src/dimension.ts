// Type for dimension object representation
export type DimensionObject = {
  L?: number;  // Length
  M?: number;  // Mass
  T?: number;  // Time
  A?: number;  // Angle
  Θ?: number;  // Temperature (Theta)
  Q?: number;  // Charge
  F?: number;  // Luminosity
};

// Dimension operations as pure functions
export const Dimension = {
  // Create a dimension object from named parameters
  create(dims: DimensionObject = {}): DimensionObject {
    // Return a normalized object (no undefined values)
    const result: DimensionObject = {};
    if (dims.L !== undefined && dims.L !== 0) result.L = dims.L;
    if (dims.M !== undefined && dims.M !== 0) result.M = dims.M;
    if (dims.T !== undefined && dims.T !== 0) result.T = dims.T;
    if (dims.A !== undefined && dims.A !== 0) result.A = dims.A;
    if (dims.Θ !== undefined && dims.Θ !== 0) result.Θ = dims.Θ;
    if (dims.Q !== undefined && dims.Q !== 0) result.Q = dims.Q;
    if (dims.F !== undefined && dims.F !== 0) result.F = dims.F;
    return result;
  },

  // Multiply dimensions (add exponents)
  multiply(a: DimensionObject, b: DimensionObject): DimensionObject {
    return Dimension.create({
      L: (a.L ?? 0) + (b.L ?? 0),
      M: (a.M ?? 0) + (b.M ?? 0),
      T: (a.T ?? 0) + (b.T ?? 0),
      A: (a.A ?? 0) + (b.A ?? 0),
      Θ: (a.Θ ?? 0) + (b.Θ ?? 0),
      Q: (a.Q ?? 0) + (b.Q ?? 0),
      F: (a.F ?? 0) + (b.F ?? 0)
    });
  },

  // Divide dimensions (subtract exponents)
  divide(a: DimensionObject, b: DimensionObject): DimensionObject {
    return Dimension.create({
      L: (a.L ?? 0) - (b.L ?? 0),
      M: (a.M ?? 0) - (b.M ?? 0),
      T: (a.T ?? 0) - (b.T ?? 0),
      A: (a.A ?? 0) - (b.A ?? 0),
      Θ: (a.Θ ?? 0) - (b.Θ ?? 0),
      Q: (a.Q ?? 0) - (b.Q ?? 0),
      F: (a.F ?? 0) - (b.F ?? 0)
    });
  },

  // Raise dimension to a power (multiply all exponents)
  power(dim: DimensionObject, n: number): DimensionObject {
    return Dimension.create({
      L: dim.L !== undefined ? dim.L * n : undefined,
      M: dim.M !== undefined ? dim.M * n : undefined,
      T: dim.T !== undefined ? dim.T * n : undefined,
      A: dim.A !== undefined ? dim.A * n : undefined,
      Θ: dim.Θ !== undefined ? dim.Θ * n : undefined,
      Q: dim.Q !== undefined ? dim.Q * n : undefined,
      F: dim.F !== undefined ? dim.F * n : undefined
    });
  },

  // Check if two dimensions are equal
  equals(a: DimensionObject, b: DimensionObject): boolean {
    return (a.L ?? 0) === (b.L ?? 0) &&
           (a.M ?? 0) === (b.M ?? 0) &&
           (a.T ?? 0) === (b.T ?? 0) &&
           (a.A ?? 0) === (b.A ?? 0) &&
           (a.Θ ?? 0) === (b.Θ ?? 0) &&
           (a.Q ?? 0) === (b.Q ?? 0) &&
           (a.F ?? 0) === (b.F ?? 0);
  },

  // Check if dimension is dimensionless
  isDimensionless(dim: DimensionObject): boolean {
    return (dim.L ?? 0) === 0 &&
           (dim.M ?? 0) === 0 &&
           (dim.T ?? 0) === 0 &&
           (dim.A ?? 0) === 0 &&
           (dim.Θ ?? 0) === 0 &&
           (dim.Q ?? 0) === 0 &&
           (dim.F ?? 0) === 0;
  },

  // Convert to string representation
  toString(dim: DimensionObject): string {
    const parts: string[] = [];
    
    // Process in standard order: L M T A Θ Q F
    if (dim.L !== undefined && dim.L !== 0) {
      parts.push(dim.L === 1 ? 'L' : `L^${dim.L}`);
    }
    if (dim.M !== undefined && dim.M !== 0) {
      parts.push(dim.M === 1 ? 'M' : `M^${dim.M}`);
    }
    if (dim.T !== undefined && dim.T !== 0) {
      parts.push(dim.T === 1 ? 'T' : `T^${dim.T}`);
    }
    if (dim.A !== undefined && dim.A !== 0) {
      parts.push(dim.A === 1 ? 'A' : `A^${dim.A}`);
    }
    if (dim.Θ !== undefined && dim.Θ !== 0) {
      parts.push(dim.Θ === 1 ? 'Θ' : `Θ^${dim.Θ}`);
    }
    if (dim.Q !== undefined && dim.Q !== 0) {
      parts.push(dim.Q === 1 ? 'Q' : `Q^${dim.Q}`);
    }
    if (dim.F !== undefined && dim.F !== 0) {
      parts.push(dim.F === 1 ? 'F' : `F^${dim.F}`);
    }
    
    return parts.length > 0 ? parts.join('·') : '1';
  }
};

// Predefined dimension constants
export const Dimensions = {
  // Base dimensions
  DIMENSIONLESS: {},
  LENGTH: { L: 1 },
  MASS: { M: 1 },
  TIME: { T: 1 },
  ANGLE: { A: 1 },
  TEMPERATURE: { Θ: 1 },
  CHARGE: { Q: 1 },
  LUMINOSITY: { F: 1 },
  
  // Common derived dimensions
  AREA: { L: 2 },                               // L²
  VOLUME: { L: 3 },                             // L³
  VELOCITY: { L: 1, T: -1 },                    // L·T⁻¹
  ACCELERATION: { L: 1, T: -2 },                // L·T⁻²
  FORCE: { L: 1, M: 1, T: -2 },                 // L·M·T⁻²
  ENERGY: { L: 2, M: 1, T: -2 },                // L²·M·T⁻²
  POWER: { L: 2, M: 1, T: -3 },                 // L²·M·T⁻³
  PRESSURE: { L: -1, M: 1, T: -2 },             // L⁻¹·M·T⁻²
  FREQUENCY: { T: -1 },                         // T⁻¹
  ELECTRIC_POTENTIAL: { L: 2, M: 1, T: -3, Q: -1 },  // L²·M·T⁻³·Q⁻¹
  ELECTRIC_RESISTANCE: { L: 2, M: 1, T: -3, Q: -2 }, // L²·M·T⁻³·Q⁻²
  ELECTRIC_CONDUCTANCE: { L: -2, M: -1, T: 3, Q: 2 }, // L⁻²·M⁻¹·T³·Q²
  ELECTRIC_CAPACITANCE: { L: -2, M: -1, T: 4, Q: 2 }, // L⁻²·M⁻¹·T⁴·Q²
} as const;

// Keep the enum for backward compatibility if needed
export enum DimensionType {
  L = 0, Length = 0,
  M = 1, Mass = 1,
  T = 2, Time = 2,
  A = 3, Angle = 3,
  Theta = 4, Temperature = 4,
  Q = 5, Charge = 5,
  F = 6, Luminosity = 6
}