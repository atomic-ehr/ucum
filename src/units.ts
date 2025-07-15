// Generated from ucum-essence.xml
// Do not edit manually

import type { DimensionObject } from './dimension';

export interface Unit {
  CODE: string;
  isMetric: boolean;
  isSpecial?: boolean;
  isBaseUnit?: boolean;
  class: string;
  name: string;
  printSymbol: string;
  property: string;
  dim?: string;
  dimension?: DimensionObject;
  value: {
    Unit: string;
    UNIT: string;
    value: string;
    function?: {
      name: string;
      value: string;
      Unit: string;
    };
  };
}

export const units: Record<string, Unit> = {
  "m": {
    CODE: "M",
    isMetric: true,
    isBaseUnit: true,
    class: "si",
    dim: "L",
    dimension: { L: 1 },
    name: "meter",
    printSymbol: "m",
    property: "length",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "s": {
    CODE: "S",
    isMetric: true,
    isBaseUnit: true,
    class: "si",
    dim: "T",
    dimension: { T: 1 },
    name: "second",
    printSymbol: "s",
    property: "time",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "g": {
    CODE: "G",
    isMetric: true,
    isBaseUnit: true,
    class: "si",
    dim: "M",
    dimension: { M: 1 },
    name: "gram",
    printSymbol: "g",
    property: "mass",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "rad": {
    CODE: "RAD",
    isMetric: true,
    isBaseUnit: true,
    class: "si",
    dim: "A",
    dimension: { A: 1 },
    name: "radian",
    printSymbol: "rad",
    property: "plane angle",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "K": {
    CODE: "K",
    isMetric: true,
    isBaseUnit: true,
    class: "si",
    dim: "C",
    dimension: { Θ: 1 },
    name: "kelvin",
    printSymbol: "K",
    property: "temperature",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "C": {
    CODE: "C",
    isMetric: true,
    isBaseUnit: true,
    class: "si",
    dim: "Q",
    dimension: { Q: 1 },
    name: "coulomb",
    printSymbol: "C",
    property: "electric charge",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "cd": {
    CODE: "CD",
    isMetric: true,
    isBaseUnit: true,
    class: "si",
    dim: "F",
    dimension: { F: 1 },
    name: "candela",
    printSymbol: "cd",
    property: "luminous intensity",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "10*": {
    CODE: "10*",
    isMetric: false,
    class: "dimless",
    name: "the number ten for arbitrary powers",
    printSymbol: "10",
    property: "number",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "10"
    }
  },
  "10^": {
    CODE: "10^",
    isMetric: false,
    class: "dimless",
    name: "the number ten for arbitrary powers",
    printSymbol: "10",
    property: "number",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "10"
    }
  },
  "[pi]": {
    CODE: "[PI]",
    isMetric: false,
    class: "dimless",
    name: "the number pi",
    printSymbol: "π",
    property: "number",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "3.1415926535897932384626433832795028841971693993751058209749445923"
    }
  },
  "%": {
    CODE: "%",
    isMetric: false,
    class: "dimless",
    name: "percent",
    printSymbol: "%",
    property: "fraction",
    value: {
      Unit: "10*-2",
      UNIT: "10*-2",
      value: "1"
    }
  },
  "[ppth]": {
    CODE: "[PPTH]",
    isMetric: false,
    class: "dimless",
    name: "parts per thousand",
    printSymbol: "ppth",
    property: "fraction",
    value: {
      Unit: "10*-3",
      UNIT: "10*-3",
      value: "1"
    }
  },
  "[ppm]": {
    CODE: "[PPM]",
    isMetric: false,
    class: "dimless",
    name: "parts per million",
    printSymbol: "ppm",
    property: "fraction",
    value: {
      Unit: "10*-6",
      UNIT: "10*-6",
      value: "1"
    }
  },
  "[ppb]": {
    CODE: "[PPB]",
    isMetric: false,
    class: "dimless",
    name: "parts per billion",
    printSymbol: "ppb",
    property: "fraction",
    value: {
      Unit: "10*-9",
      UNIT: "10*-9",
      value: "1"
    }
  },
  "[pptr]": {
    CODE: "[PPTR]",
    isMetric: false,
    class: "dimless",
    name: "parts per trillion",
    printSymbol: "pptr",
    property: "fraction",
    value: {
      Unit: "10*-12",
      UNIT: "10*-12",
      value: "1"
    }
  },
  "mol": {
    CODE: "MOL",
    isMetric: true,
    class: "si",
    name: "mole",
    printSymbol: "mol",
    property: "amount of substance",
    value: {
      Unit: "10*23",
      UNIT: "10*23",
      value: "6.02214076"
    }
  },
  "sr": {
    CODE: "SR",
    isMetric: true,
    class: "si",
    name: "steradian",
    printSymbol: "sr",
    property: "solid angle",
    value: {
      Unit: "rad2",
      UNIT: "RAD2",
      value: "1"
    }
  },
  "Hz": {
    CODE: "HZ",
    isMetric: true,
    class: "si",
    name: "hertz",
    printSymbol: "Hz",
    property: "frequency",
    value: {
      Unit: "s-1",
      UNIT: "S-1",
      value: "1"
    }
  },
  "N": {
    CODE: "N",
    isMetric: true,
    class: "si",
    name: "newton",
    printSymbol: "N",
    property: "force",
    value: {
      Unit: "kg.m/s2",
      UNIT: "KG.M/S2",
      value: "1"
    }
  },
  "Pa": {
    CODE: "PAL",
    isMetric: true,
    class: "si",
    name: "pascal",
    printSymbol: "Pa",
    property: "pressure",
    value: {
      Unit: "N/m2",
      UNIT: "N/M2",
      value: "1"
    }
  },
  "J": {
    CODE: "J",
    isMetric: true,
    class: "si",
    name: "joule",
    printSymbol: "J",
    property: "energy",
    value: {
      Unit: "N.m",
      UNIT: "N.M",
      value: "1"
    }
  },
  "W": {
    CODE: "W",
    isMetric: true,
    class: "si",
    name: "watt",
    printSymbol: "W",
    property: "power",
    value: {
      Unit: "J/s",
      UNIT: "J/S",
      value: "1"
    }
  },
  "A": {
    CODE: "A",
    isMetric: true,
    class: "si",
    name: "ampère",
    printSymbol: "A",
    property: "electric current",
    value: {
      Unit: "C/s",
      UNIT: "C/S",
      value: "1"
    }
  },
  "V": {
    CODE: "V",
    isMetric: true,
    class: "si",
    name: "volt",
    printSymbol: "V",
    property: "electric potential",
    value: {
      Unit: "J/C",
      UNIT: "J/C",
      value: "1"
    }
  },
  "F": {
    CODE: "F",
    isMetric: true,
    class: "si",
    name: "farad",
    printSymbol: "F",
    property: "electric capacitance",
    value: {
      Unit: "C/V",
      UNIT: "C/V",
      value: "1"
    }
  },
  "Ohm": {
    CODE: "OHM",
    isMetric: true,
    class: "si",
    name: "ohm",
    printSymbol: "Ω",
    property: "electric resistance",
    value: {
      Unit: "V/A",
      UNIT: "V/A",
      value: "1"
    }
  },
  "S": {
    CODE: "SIE",
    isMetric: true,
    class: "si",
    name: "siemens",
    printSymbol: "S",
    property: "electric conductance",
    value: {
      Unit: "Ohm-1",
      UNIT: "OHM-1",
      value: "1"
    }
  },
  "Wb": {
    CODE: "WB",
    isMetric: true,
    class: "si",
    name: "weber",
    printSymbol: "Wb",
    property: "magnetic flux",
    value: {
      Unit: "V.s",
      UNIT: "V.S",
      value: "1"
    }
  },
  "Cel": {
    CODE: "CEL",
    isMetric: true,
    isSpecial: true,
    class: "si",
    name: "degree Celsius",
    printSymbol: "°C",
    property: "temperature",
    value: {
      Unit: "cel(1 K)",
      UNIT: "CEL(1 K)",
      value: "undefined",
      function: {
        name: "Cel",
        value: "1",
        Unit: "K"
      }
    }
  },
  "T": {
    CODE: "T",
    isMetric: true,
    class: "si",
    name: "tesla",
    printSymbol: "T",
    property: "magnetic flux density",
    value: {
      Unit: "Wb/m2",
      UNIT: "WB/M2",
      value: "1"
    }
  },
  "H": {
    CODE: "H",
    isMetric: true,
    class: "si",
    name: "henry",
    printSymbol: "H",
    property: "inductance",
    value: {
      Unit: "Wb/A",
      UNIT: "WB/A",
      value: "1"
    }
  },
  "lm": {
    CODE: "LM",
    isMetric: true,
    class: "si",
    name: "lumen",
    printSymbol: "lm",
    property: "luminous flux",
    value: {
      Unit: "cd.sr",
      UNIT: "CD.SR",
      value: "1"
    }
  },
  "lx": {
    CODE: "LX",
    isMetric: true,
    class: "si",
    name: "lux",
    printSymbol: "lx",
    property: "illuminance",
    value: {
      Unit: "lm/m2",
      UNIT: "LM/M2",
      value: "1"
    }
  },
  "Bq": {
    CODE: "BQ",
    isMetric: true,
    class: "si",
    name: "becquerel",
    printSymbol: "Bq",
    property: "radioactivity",
    value: {
      Unit: "s-1",
      UNIT: "S-1",
      value: "1"
    }
  },
  "Gy": {
    CODE: "GY",
    isMetric: true,
    class: "si",
    name: "gray",
    printSymbol: "Gy",
    property: "energy dose",
    value: {
      Unit: "J/kg",
      UNIT: "J/KG",
      value: "1"
    }
  },
  "Sv": {
    CODE: "SV",
    isMetric: true,
    class: "si",
    name: "sievert",
    printSymbol: "Sv",
    property: "dose equivalent",
    value: {
      Unit: "J/kg",
      UNIT: "J/KG",
      value: "1"
    }
  },
  "gon": {
    CODE: "GON",
    isMetric: false,
    class: "iso1000",
    name: "gon",
    printSymbol: "[object Object]",
    property: "plane angle",
    value: {
      Unit: "deg",
      UNIT: "DEG",
      value: "0.9"
    }
  },
  "deg": {
    CODE: "DEG",
    isMetric: false,
    class: "iso1000",
    name: "degree",
    printSymbol: "°",
    property: "plane angle",
    value: {
      Unit: "[pi].rad/360",
      UNIT: "[PI].RAD/360",
      value: "2"
    }
  },
  "'": {
    CODE: "'",
    isMetric: false,
    class: "iso1000",
    name: "minute",
    printSymbol: "'",
    property: "plane angle",
    value: {
      Unit: "deg/60",
      UNIT: "DEG/60",
      value: "1"
    }
  },
  "''": {
    CODE: "''",
    isMetric: false,
    class: "iso1000",
    name: "second",
    printSymbol: "''",
    property: "plane angle",
    value: {
      Unit: "'/60",
      UNIT: "'/60",
      value: "1"
    }
  },
  "l": {
    CODE: "L",
    isMetric: true,
    class: "iso1000",
    name: "liter",
    printSymbol: "l",
    property: "volume",
    value: {
      Unit: "dm3",
      UNIT: "DM3",
      value: "1"
    }
  },
  "L": {
    CODE: "L",
    isMetric: true,
    class: "iso1000",
    name: "liter",
    printSymbol: "L",
    property: "volume",
    value: {
      Unit: "l",
      UNIT: "L",
      value: "1"
    }
  },
  "ar": {
    CODE: "AR",
    isMetric: true,
    class: "iso1000",
    name: "are",
    printSymbol: "a",
    property: "area",
    value: {
      Unit: "m2",
      UNIT: "M2",
      value: "100"
    }
  },
  "min": {
    CODE: "MIN",
    isMetric: false,
    class: "iso1000",
    name: "minute",
    printSymbol: "min",
    property: "time",
    value: {
      Unit: "s",
      UNIT: "S",
      value: "60"
    }
  },
  "h": {
    CODE: "HR",
    isMetric: false,
    class: "iso1000",
    name: "hour",
    printSymbol: "h",
    property: "time",
    value: {
      Unit: "min",
      UNIT: "MIN",
      value: "60"
    }
  },
  "d": {
    CODE: "D",
    isMetric: false,
    class: "iso1000",
    name: "day",
    printSymbol: "d",
    property: "time",
    value: {
      Unit: "h",
      UNIT: "HR",
      value: "24"
    }
  },
  "a_t": {
    CODE: "ANN_T",
    isMetric: false,
    class: "iso1000",
    name: "tropical year",
    printSymbol: "[object Object]",
    property: "time",
    value: {
      Unit: "d",
      UNIT: "D",
      value: "365.24219"
    }
  },
  "a_j": {
    CODE: "ANN_J",
    isMetric: false,
    class: "iso1000",
    name: "mean Julian year",
    printSymbol: "[object Object]",
    property: "time",
    value: {
      Unit: "d",
      UNIT: "D",
      value: "365.25"
    }
  },
  "a_g": {
    CODE: "ANN_G",
    isMetric: false,
    class: "iso1000",
    name: "mean Gregorian year",
    printSymbol: "[object Object]",
    property: "time",
    value: {
      Unit: "d",
      UNIT: "D",
      value: "365.2425"
    }
  },
  "a": {
    CODE: "ANN",
    isMetric: false,
    class: "iso1000",
    name: "year",
    printSymbol: "a",
    property: "time",
    value: {
      Unit: "a_j",
      UNIT: "ANN_J",
      value: "1"
    }
  },
  "wk": {
    CODE: "WK",
    isMetric: false,
    class: "iso1000",
    name: "week",
    printSymbol: "wk",
    property: "time",
    value: {
      Unit: "d",
      UNIT: "D",
      value: "7"
    }
  },
  "mo_s": {
    CODE: "MO_S",
    isMetric: false,
    class: "iso1000",
    name: "synodal month",
    printSymbol: "[object Object]",
    property: "time",
    value: {
      Unit: "d",
      UNIT: "D",
      value: "29.53059"
    }
  },
  "mo_j": {
    CODE: "MO_J",
    isMetric: false,
    class: "iso1000",
    name: "mean Julian month",
    printSymbol: "[object Object]",
    property: "time",
    value: {
      Unit: "a_j/12",
      UNIT: "ANN_J/12",
      value: "1"
    }
  },
  "mo_g": {
    CODE: "MO_G",
    isMetric: false,
    class: "iso1000",
    name: "mean Gregorian month",
    printSymbol: "[object Object]",
    property: "time",
    value: {
      Unit: "a_g/12",
      UNIT: "ANN_G/12",
      value: "1"
    }
  },
  "mo": {
    CODE: "MO",
    isMetric: false,
    class: "iso1000",
    name: "month",
    printSymbol: "mo",
    property: "time",
    value: {
      Unit: "mo_j",
      UNIT: "MO_J",
      value: "1"
    }
  },
  "t": {
    CODE: "TNE",
    isMetric: true,
    class: "iso1000",
    name: "tonne",
    printSymbol: "t",
    property: "mass",
    value: {
      Unit: "kg",
      UNIT: "KG",
      value: "1e3"
    }
  },
  "bar": {
    CODE: "BAR",
    isMetric: true,
    class: "iso1000",
    name: "bar",
    printSymbol: "bar",
    property: "pressure",
    value: {
      Unit: "Pa",
      UNIT: "PAL",
      value: "1e5"
    }
  },
  "u": {
    CODE: "AMU",
    isMetric: true,
    class: "iso1000",
    name: "unified atomic mass unit",
    printSymbol: "u",
    property: "mass",
    value: {
      Unit: "g",
      UNIT: "G",
      value: "1.66053906660e-24"
    }
  },
  "eV": {
    CODE: "EV",
    isMetric: true,
    class: "iso1000",
    name: "electronvolt",
    printSymbol: "eV",
    property: "energy",
    value: {
      Unit: "[e].V",
      UNIT: "[E].V",
      value: "1"
    }
  },
  "AU": {
    CODE: "ASU",
    isMetric: false,
    class: "iso1000",
    name: "astronomic unit",
    printSymbol: "AU",
    property: "length",
    value: {
      Unit: "Mm",
      UNIT: "MAM",
      value: "149597.870691"
    }
  },
  "pc": {
    CODE: "PRS",
    isMetric: true,
    class: "iso1000",
    name: "parsec",
    printSymbol: "pc",
    property: "length",
    value: {
      Unit: "m",
      UNIT: "M",
      value: "3.085678e16"
    }
  },
  "[c]": {
    CODE: "[C]",
    isMetric: true,
    class: "const",
    name: "velocity of light",
    printSymbol: "[object Object]",
    property: "velocity",
    value: {
      Unit: "m/s",
      UNIT: "M/S",
      value: "299792458"
    }
  },
  "[h]": {
    CODE: "[H]",
    isMetric: true,
    class: "const",
    name: "Planck constant",
    printSymbol: "[object Object]",
    property: "action",
    value: {
      Unit: "J.s",
      UNIT: "J.S",
      value: "6.62607015e-34"
    }
  },
  "[k]": {
    CODE: "[K]",
    isMetric: true,
    class: "const",
    name: "Boltzmann constant",
    printSymbol: "[object Object]",
    property: "(unclassified)",
    value: {
      Unit: "J/K",
      UNIT: "J/K",
      value: "1.380649e-23"
    }
  },
  "[eps_0]": {
    CODE: "[EPS_0]",
    isMetric: true,
    class: "const",
    name: "permittivity of vacuum",
    printSymbol: "[object Object]",
    property: "electric permittivity",
    value: {
      Unit: "F/m",
      UNIT: "F/M",
      value: "8.854187817e-12"
    }
  },
  "[mu_0]": {
    CODE: "[MU_0]",
    isMetric: true,
    class: "const",
    name: "permeability of vacuum",
    printSymbol: "[object Object]",
    property: "magnetic permeability",
    value: {
      Unit: "4.[pi].10*-7.N/A2",
      UNIT: "4.[PI].10*-7.N/A2",
      value: "1"
    }
  },
  "[e]": {
    CODE: "[E]",
    isMetric: true,
    class: "const",
    name: "elementary charge",
    printSymbol: "[object Object]",
    property: "electric charge",
    value: {
      Unit: "C",
      UNIT: "C",
      value: "1.602176634e-19"
    }
  },
  "[m_e]": {
    CODE: "[M_E]",
    isMetric: true,
    class: "const",
    name: "electron mass",
    printSymbol: "[object Object]",
    property: "mass",
    value: {
      Unit: "kg",
      UNIT: "kg",
      value: "9.1093837139e-31"
    }
  },
  "[m_p]": {
    CODE: "[M_P]",
    isMetric: true,
    class: "const",
    name: "proton mass",
    printSymbol: "[object Object]",
    property: "mass",
    value: {
      Unit: "kg",
      UNIT: "kg",
      value: "1.67262192595e-27"
    }
  },
  "[G]": {
    CODE: "[GC]",
    isMetric: true,
    class: "const",
    name: "Newtonian constant of gravitation",
    printSymbol: "[object Object]",
    property: "(unclassified)",
    value: {
      Unit: "m3.kg-1.s-2",
      UNIT: "M3.KG-1.S-2",
      value: "6.67430e-11"
    }
  },
  "[g]": {
    CODE: "[G]",
    isMetric: true,
    class: "const",
    name: "standard acceleration of free fall",
    printSymbol: "[object Object]",
    property: "acceleration",
    value: {
      Unit: "m/s2",
      UNIT: "M/S2",
      value: "980665e-5"
    }
  },
  "atm": {
    CODE: "ATM",
    isMetric: false,
    class: "const",
    name: "standard atmosphere",
    printSymbol: "atm",
    property: "pressure",
    value: {
      Unit: "Pa",
      UNIT: "PAL",
      value: "101325"
    }
  },
  "[ly]": {
    CODE: "[LY]",
    isMetric: true,
    class: "const",
    name: "light-year",
    printSymbol: "l.y.",
    property: "length",
    value: {
      Unit: "[c].a_j",
      UNIT: "[C].ANN_J",
      value: "1"
    }
  },
  "gf": {
    CODE: "GF",
    isMetric: true,
    class: "const",
    name: "gram-force",
    printSymbol: "gf",
    property: "force",
    value: {
      Unit: "g.[g]",
      UNIT: "G.[G]",
      value: "1"
    }
  },
  "[lbf_av]": {
    CODE: "[LBF_AV]",
    isMetric: false,
    class: "const",
    name: "pound force",
    printSymbol: "lbf",
    property: "force",
    value: {
      Unit: "[lb_av].[g]",
      UNIT: "[LB_AV].[G]",
      value: "1"
    }
  },
  "Ky": {
    CODE: "KY",
    isMetric: true,
    class: "cgs",
    name: "Kayser",
    printSymbol: "K",
    property: "lineic number",
    value: {
      Unit: "cm-1",
      UNIT: "CM-1",
      value: "1"
    }
  },
  "Gal": {
    CODE: "GL",
    isMetric: true,
    class: "cgs",
    name: "Gal",
    printSymbol: "Gal",
    property: "acceleration",
    value: {
      Unit: "cm/s2",
      UNIT: "CM/S2",
      value: "1"
    }
  },
  "dyn": {
    CODE: "DYN",
    isMetric: true,
    class: "cgs",
    name: "dyne",
    printSymbol: "dyn",
    property: "force",
    value: {
      Unit: "g.cm/s2",
      UNIT: "G.CM/S2",
      value: "1"
    }
  },
  "erg": {
    CODE: "ERG",
    isMetric: true,
    class: "cgs",
    name: "erg",
    printSymbol: "erg",
    property: "energy",
    value: {
      Unit: "dyn.cm",
      UNIT: "DYN.CM",
      value: "1"
    }
  },
  "P": {
    CODE: "P",
    isMetric: true,
    class: "cgs",
    name: "Poise",
    printSymbol: "P",
    property: "dynamic viscosity",
    value: {
      Unit: "dyn.s/cm2",
      UNIT: "DYN.S/CM2",
      value: "1"
    }
  },
  "Bi": {
    CODE: "BI",
    isMetric: true,
    class: "cgs",
    name: "Biot",
    printSymbol: "Bi",
    property: "electric current",
    value: {
      Unit: "A",
      UNIT: "A",
      value: "10"
    }
  },
  "St": {
    CODE: "ST",
    isMetric: true,
    class: "cgs",
    name: "Stokes",
    printSymbol: "St",
    property: "kinematic viscosity",
    value: {
      Unit: "cm2/s",
      UNIT: "CM2/S",
      value: "1"
    }
  },
  "Mx": {
    CODE: "MX",
    isMetric: true,
    class: "cgs",
    name: "Maxwell",
    printSymbol: "Mx",
    property: "flux of magnetic induction",
    value: {
      Unit: "Wb",
      UNIT: "WB",
      value: "1e-8"
    }
  },
  "G": {
    CODE: "GS",
    isMetric: true,
    class: "cgs",
    name: "Gauss",
    printSymbol: "Gs",
    property: "magnetic flux density",
    value: {
      Unit: "T",
      UNIT: "T",
      value: "1e-4"
    }
  },
  "Oe": {
    CODE: "OE",
    isMetric: true,
    class: "cgs",
    name: "Oersted",
    printSymbol: "Oe",
    property: "magnetic field intensity",
    value: {
      Unit: "/[pi].A/m",
      UNIT: "/[PI].A/M",
      value: "250"
    }
  },
  "Gb": {
    CODE: "GB",
    isMetric: true,
    class: "cgs",
    name: "Gilbert",
    printSymbol: "Gb",
    property: "magnetic tension",
    value: {
      Unit: "Oe.cm",
      UNIT: "OE.CM",
      value: "1"
    }
  },
  "sb": {
    CODE: "SB",
    isMetric: true,
    class: "cgs",
    name: "stilb",
    printSymbol: "sb",
    property: "lum. intensity density",
    value: {
      Unit: "cd/cm2",
      UNIT: "CD/CM2",
      value: "1"
    }
  },
  "Lmb": {
    CODE: "LMB",
    isMetric: true,
    class: "cgs",
    name: "Lambert",
    printSymbol: "L",
    property: "brightness",
    value: {
      Unit: "cd/cm2/[pi]",
      UNIT: "CD/CM2/[PI]",
      value: "1"
    }
  },
  "ph": {
    CODE: "PHT",
    isMetric: true,
    class: "cgs",
    name: "phot",
    printSymbol: "ph",
    property: "illuminance",
    value: {
      Unit: "lx",
      UNIT: "LX",
      value: "1e-4"
    }
  },
  "Ci": {
    CODE: "CI",
    isMetric: true,
    class: "cgs",
    name: "Curie",
    printSymbol: "Ci",
    property: "radioactivity",
    value: {
      Unit: "Bq",
      UNIT: "BQ",
      value: "37e9"
    }
  },
  "R": {
    CODE: "ROE",
    isMetric: true,
    class: "cgs",
    name: "Roentgen",
    printSymbol: "R",
    property: "ion dose",
    value: {
      Unit: "C/kg",
      UNIT: "C/KG",
      value: "2.58e-4"
    }
  },
  "RAD": {
    CODE: "[RAD]",
    isMetric: true,
    class: "cgs",
    name: "radiation absorbed dose",
    printSymbol: "RAD",
    property: "energy dose",
    value: {
      Unit: "erg/g",
      UNIT: "ERG/G",
      value: "100"
    }
  },
  "REM": {
    CODE: "[REM]",
    isMetric: true,
    class: "cgs",
    name: "radiation equivalent man",
    printSymbol: "REM",
    property: "dose equivalent",
    value: {
      Unit: "RAD",
      UNIT: "[RAD]",
      value: "1"
    }
  },
  "[in_i]": {
    CODE: "[IN_I]",
    isMetric: false,
    class: "intcust",
    name: "inch",
    printSymbol: "in",
    property: "length",
    value: {
      Unit: "cm",
      UNIT: "CM",
      value: "254e-2"
    }
  },
  "[ft_i]": {
    CODE: "[FT_I]",
    isMetric: false,
    class: "intcust",
    name: "foot",
    printSymbol: "ft",
    property: "length",
    value: {
      Unit: "[in_i]",
      UNIT: "[IN_I]",
      value: "12"
    }
  },
  "[yd_i]": {
    CODE: "[YD_I]",
    isMetric: false,
    class: "intcust",
    name: "yard",
    printSymbol: "yd",
    property: "length",
    value: {
      Unit: "[ft_i]",
      UNIT: "[FT_I]",
      value: "3"
    }
  },
  "[mi_i]": {
    CODE: "[MI_I]",
    isMetric: false,
    class: "intcust",
    name: "mile",
    printSymbol: "mi",
    property: "length",
    value: {
      Unit: "[ft_i]",
      UNIT: "[FT_I]",
      value: "5280"
    }
  },
  "[fth_i]": {
    CODE: "[FTH_I]",
    isMetric: false,
    class: "intcust",
    name: "fathom",
    printSymbol: "fth",
    property: "depth of water",
    value: {
      Unit: "[ft_i]",
      UNIT: "[FT_I]",
      value: "6"
    }
  },
  "[nmi_i]": {
    CODE: "[NMI_I]",
    isMetric: false,
    class: "intcust",
    name: "nautical mile",
    printSymbol: "n.mi",
    property: "length",
    value: {
      Unit: "m",
      UNIT: "M",
      value: "1852"
    }
  },
  "[kn_i]": {
    CODE: "[KN_I]",
    isMetric: false,
    class: "intcust",
    name: "knot",
    printSymbol: "knot",
    property: "velocity",
    value: {
      Unit: "[nmi_i]/h",
      UNIT: "[NMI_I]/H",
      value: "1"
    }
  },
  "[sin_i]": {
    CODE: "[SIN_I]",
    isMetric: false,
    class: "intcust",
    name: "square inch",
    printSymbol: "",
    property: "area",
    value: {
      Unit: "[in_i]2",
      UNIT: "[IN_I]2",
      value: "1"
    }
  },
  "[sft_i]": {
    CODE: "[SFT_I]",
    isMetric: false,
    class: "intcust",
    name: "square foot",
    printSymbol: "",
    property: "area",
    value: {
      Unit: "[ft_i]2",
      UNIT: "[FT_I]2",
      value: "1"
    }
  },
  "[syd_i]": {
    CODE: "[SYD_I]",
    isMetric: false,
    class: "intcust",
    name: "square yard",
    printSymbol: "",
    property: "area",
    value: {
      Unit: "[yd_i]2",
      UNIT: "[YD_I]2",
      value: "1"
    }
  },
  "[cin_i]": {
    CODE: "[CIN_I]",
    isMetric: false,
    class: "intcust",
    name: "cubic inch",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[in_i]3",
      UNIT: "[IN_I]3",
      value: "1"
    }
  },
  "[cft_i]": {
    CODE: "[CFT_I]",
    isMetric: false,
    class: "intcust",
    name: "cubic foot",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[ft_i]3",
      UNIT: "[FT_I]3",
      value: "1"
    }
  },
  "[cyd_i]": {
    CODE: "[CYD_I]",
    isMetric: false,
    class: "intcust",
    name: "cubic yard",
    printSymbol: "cu.yd",
    property: "volume",
    value: {
      Unit: "[yd_i]3",
      UNIT: "[YD_I]3",
      value: "1"
    }
  },
  "[bf_i]": {
    CODE: "[BF_I]",
    isMetric: false,
    class: "intcust",
    name: "board foot",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[in_i]3",
      UNIT: "[IN_I]3",
      value: "144"
    }
  },
  "[cr_i]": {
    CODE: "[CR_I]",
    isMetric: false,
    class: "intcust",
    name: "cord",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[ft_i]3",
      UNIT: "[FT_I]3",
      value: "128"
    }
  },
  "[mil_i]": {
    CODE: "[MIL_I]",
    isMetric: false,
    class: "intcust",
    name: "mil",
    printSymbol: "mil",
    property: "length",
    value: {
      Unit: "[in_i]",
      UNIT: "[IN_I]",
      value: "1e-3"
    }
  },
  "[cml_i]": {
    CODE: "[CML_I]",
    isMetric: false,
    class: "intcust",
    name: "circular mil",
    printSymbol: "circ.mil",
    property: "area",
    value: {
      Unit: "[pi]/4.[mil_i]2",
      UNIT: "[PI]/4.[MIL_I]2",
      value: "1"
    }
  },
  "[hd_i]": {
    CODE: "[HD_I]",
    isMetric: false,
    class: "intcust",
    name: "hand",
    printSymbol: "hd",
    property: "height of horses",
    value: {
      Unit: "[in_i]",
      UNIT: "[IN_I]",
      value: "4"
    }
  },
  "[ft_us]": {
    CODE: "[FT_US]",
    isMetric: false,
    class: "us-lengths",
    name: "foot",
    printSymbol: "[object Object]",
    property: "length",
    value: {
      Unit: "m/3937",
      UNIT: "M/3937",
      value: "1200"
    }
  },
  "[yd_us]": {
    CODE: "[YD_US]",
    isMetric: false,
    class: "us-lengths",
    name: "yard",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ft_us]",
      UNIT: "[FT_US]",
      value: "3"
    }
  },
  "[in_us]": {
    CODE: "[IN_US]",
    isMetric: false,
    class: "us-lengths",
    name: "inch",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ft_us]/12",
      UNIT: "[FT_US]/12",
      value: "1"
    }
  },
  "[rd_us]": {
    CODE: "[RD_US]",
    isMetric: false,
    class: "us-lengths",
    name: "rod",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ft_us]",
      UNIT: "[FT_US]",
      value: "16.5"
    }
  },
  "[ch_us]": {
    CODE: "[CH_US]",
    isMetric: false,
    class: "us-lengths",
    name: "Gunter's chain",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[rd_us]",
      UNIT: "[RD_US]",
      value: "4"
    }
  },
  "[lk_us]": {
    CODE: "[LK_US]",
    isMetric: false,
    class: "us-lengths",
    name: "link for Gunter's chain",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ch_us]/100",
      UNIT: "[CH_US]/100",
      value: "1"
    }
  },
  "[rch_us]": {
    CODE: "[RCH_US]",
    isMetric: false,
    class: "us-lengths",
    name: "Ramden's chain",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ft_us]",
      UNIT: "[FT_US]",
      value: "100"
    }
  },
  "[rlk_us]": {
    CODE: "[RLK_US]",
    isMetric: false,
    class: "us-lengths",
    name: "link for Ramden's chain",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[rch_us]/100",
      UNIT: "[RCH_US]/100",
      value: "1"
    }
  },
  "[fth_us]": {
    CODE: "[FTH_US]",
    isMetric: false,
    class: "us-lengths",
    name: "fathom",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ft_us]",
      UNIT: "[FT_US]",
      value: "6"
    }
  },
  "[fur_us]": {
    CODE: "[FUR_US]",
    isMetric: false,
    class: "us-lengths",
    name: "furlong",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[rd_us]",
      UNIT: "[RD_US]",
      value: "40"
    }
  },
  "[mi_us]": {
    CODE: "[MI_US]",
    isMetric: false,
    class: "us-lengths",
    name: "mile",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[fur_us]",
      UNIT: "[FUR_US]",
      value: "8"
    }
  },
  "[acr_us]": {
    CODE: "[ACR_US]",
    isMetric: false,
    class: "us-lengths",
    name: "acre",
    printSymbol: "",
    property: "area",
    value: {
      Unit: "[rd_us]2",
      UNIT: "[RD_US]2",
      value: "160"
    }
  },
  "[srd_us]": {
    CODE: "[SRD_US]",
    isMetric: false,
    class: "us-lengths",
    name: "square rod",
    printSymbol: "",
    property: "area",
    value: {
      Unit: "[rd_us]2",
      UNIT: "[RD_US]2",
      value: "1"
    }
  },
  "[smi_us]": {
    CODE: "[SMI_US]",
    isMetric: false,
    class: "us-lengths",
    name: "square mile",
    printSymbol: "",
    property: "area",
    value: {
      Unit: "[mi_us]2",
      UNIT: "[MI_US]2",
      value: "1"
    }
  },
  "[sct]": {
    CODE: "[SCT]",
    isMetric: false,
    class: "us-lengths",
    name: "section",
    printSymbol: "",
    property: "area",
    value: {
      Unit: "[mi_us]2",
      UNIT: "[MI_US]2",
      value: "1"
    }
  },
  "[twp]": {
    CODE: "[TWP]",
    isMetric: false,
    class: "us-lengths",
    name: "township",
    printSymbol: "",
    property: "area",
    value: {
      Unit: "[sct]",
      UNIT: "[SCT]",
      value: "36"
    }
  },
  "[mil_us]": {
    CODE: "[MIL_US]",
    isMetric: false,
    class: "us-lengths",
    name: "mil",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[in_us]",
      UNIT: "[IN_US]",
      value: "1e-3"
    }
  },
  "[in_br]": {
    CODE: "[IN_BR]",
    isMetric: false,
    class: "brit-length",
    name: "inch",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "cm",
      UNIT: "CM",
      value: "2.539998"
    }
  },
  "[ft_br]": {
    CODE: "[FT_BR]",
    isMetric: false,
    class: "brit-length",
    name: "foot",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[in_br]",
      UNIT: "[IN_BR]",
      value: "12"
    }
  },
  "[rd_br]": {
    CODE: "[RD_BR]",
    isMetric: false,
    class: "brit-length",
    name: "rod",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ft_br]",
      UNIT: "[FT_BR]",
      value: "16.5"
    }
  },
  "[ch_br]": {
    CODE: "[CH_BR]",
    isMetric: false,
    class: "brit-length",
    name: "Gunter's chain",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[rd_br]",
      UNIT: "[RD_BR]",
      value: "4"
    }
  },
  "[lk_br]": {
    CODE: "[LK_BR]",
    isMetric: false,
    class: "brit-length",
    name: "link for Gunter's chain",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ch_br]/100",
      UNIT: "[CH_BR]/100",
      value: "1"
    }
  },
  "[fth_br]": {
    CODE: "[FTH_BR]",
    isMetric: false,
    class: "brit-length",
    name: "fathom",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ft_br]",
      UNIT: "[FT_BR]",
      value: "6"
    }
  },
  "[pc_br]": {
    CODE: "[PC_BR]",
    isMetric: false,
    class: "brit-length",
    name: "pace",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ft_br]",
      UNIT: "[FT_BR]",
      value: "2.5"
    }
  },
  "[yd_br]": {
    CODE: "[YD_BR]",
    isMetric: false,
    class: "brit-length",
    name: "yard",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ft_br]",
      UNIT: "[FT_BR]",
      value: "3"
    }
  },
  "[mi_br]": {
    CODE: "[MI_BR]",
    isMetric: false,
    class: "brit-length",
    name: "mile",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ft_br]",
      UNIT: "[FT_BR]",
      value: "5280"
    }
  },
  "[nmi_br]": {
    CODE: "[NMI_BR]",
    isMetric: false,
    class: "brit-length",
    name: "nautical mile",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ft_br]",
      UNIT: "[FT_BR]",
      value: "6080"
    }
  },
  "[kn_br]": {
    CODE: "[KN_BR]",
    isMetric: false,
    class: "brit-length",
    name: "knot",
    printSymbol: "",
    property: "velocity",
    value: {
      Unit: "[nmi_br]/h",
      UNIT: "[NMI_BR]/H",
      value: "1"
    }
  },
  "[acr_br]": {
    CODE: "[ACR_BR]",
    isMetric: false,
    class: "brit-length",
    name: "acre",
    printSymbol: "",
    property: "area",
    value: {
      Unit: "[yd_br]2",
      UNIT: "[YD_BR]2",
      value: "4840"
    }
  },
  "[gal_us]": {
    CODE: "[GAL_US]",
    isMetric: false,
    class: "us-volumes",
    name: "Queen Anne's wine gallon",
    printSymbol: "",
    property: "fluid volume",
    value: {
      Unit: "[in_i]3",
      UNIT: "[IN_I]3",
      value: "231"
    }
  },
  "[bbl_us]": {
    CODE: "[BBL_US]",
    isMetric: false,
    class: "us-volumes",
    name: "barrel",
    printSymbol: "",
    property: "fluid volume",
    value: {
      Unit: "[gal_us]",
      UNIT: "[GAL_US]",
      value: "42"
    }
  },
  "[qt_us]": {
    CODE: "[QT_US]",
    isMetric: false,
    class: "us-volumes",
    name: "quart",
    printSymbol: "",
    property: "fluid volume",
    value: {
      Unit: "[gal_us]/4",
      UNIT: "[GAL_US]/4",
      value: "1"
    }
  },
  "[pt_us]": {
    CODE: "[PT_US]",
    isMetric: false,
    class: "us-volumes",
    name: "pint",
    printSymbol: "",
    property: "fluid volume",
    value: {
      Unit: "[qt_us]/2",
      UNIT: "[QT_US]/2",
      value: "1"
    }
  },
  "[gil_us]": {
    CODE: "[GIL_US]",
    isMetric: false,
    class: "us-volumes",
    name: "gill",
    printSymbol: "",
    property: "fluid volume",
    value: {
      Unit: "[pt_us]/4",
      UNIT: "[PT_US]/4",
      value: "1"
    }
  },
  "[foz_us]": {
    CODE: "[FOZ_US]",
    isMetric: false,
    class: "us-volumes",
    name: "fluid ounce",
    printSymbol: "oz fl",
    property: "fluid volume",
    value: {
      Unit: "[gil_us]/4",
      UNIT: "[GIL_US]/4",
      value: "1"
    }
  },
  "[fdr_us]": {
    CODE: "[FDR_US]",
    isMetric: false,
    class: "us-volumes",
    name: "fluid dram",
    printSymbol: "",
    property: "fluid volume",
    value: {
      Unit: "[foz_us]/8",
      UNIT: "[FOZ_US]/8",
      value: "1"
    }
  },
  "[min_us]": {
    CODE: "[MIN_US]",
    isMetric: false,
    class: "us-volumes",
    name: "minim",
    printSymbol: "",
    property: "fluid volume",
    value: {
      Unit: "[fdr_us]/60",
      UNIT: "[FDR_US]/60",
      value: "1"
    }
  },
  "[crd_us]": {
    CODE: "[CRD_US]",
    isMetric: false,
    class: "us-volumes",
    name: "cord",
    printSymbol: "",
    property: "fluid volume",
    value: {
      Unit: "[ft_i]3",
      UNIT: "[FT_I]3",
      value: "128"
    }
  },
  "[bu_us]": {
    CODE: "[BU_US]",
    isMetric: false,
    class: "us-volumes",
    name: "bushel",
    printSymbol: "",
    property: "dry volume",
    value: {
      Unit: "[in_i]3",
      UNIT: "[IN_I]3",
      value: "2150.42"
    }
  },
  "[gal_wi]": {
    CODE: "[GAL_WI]",
    isMetric: false,
    class: "us-volumes",
    name: "historical winchester gallon",
    printSymbol: "",
    property: "dry volume",
    value: {
      Unit: "[bu_us]/8",
      UNIT: "[BU_US]/8",
      value: "1"
    }
  },
  "[pk_us]": {
    CODE: "[PK_US]",
    isMetric: false,
    class: "us-volumes",
    name: "peck",
    printSymbol: "",
    property: "dry volume",
    value: {
      Unit: "[bu_us]/4",
      UNIT: "[BU_US]/4",
      value: "1"
    }
  },
  "[dqt_us]": {
    CODE: "[DQT_US]",
    isMetric: false,
    class: "us-volumes",
    name: "dry quart",
    printSymbol: "",
    property: "dry volume",
    value: {
      Unit: "[pk_us]/8",
      UNIT: "[PK_US]/8",
      value: "1"
    }
  },
  "[dpt_us]": {
    CODE: "[DPT_US]",
    isMetric: false,
    class: "us-volumes",
    name: "dry pint",
    printSymbol: "",
    property: "dry volume",
    value: {
      Unit: "[dqt_us]/2",
      UNIT: "[DQT_US]/2",
      value: "1"
    }
  },
  "[tbs_us]": {
    CODE: "[TBS_US]",
    isMetric: false,
    class: "us-volumes",
    name: "tablespoon",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[foz_us]/2",
      UNIT: "[FOZ_US]/2",
      value: "1"
    }
  },
  "[tsp_us]": {
    CODE: "[TSP_US]",
    isMetric: false,
    class: "us-volumes",
    name: "teaspoon",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[tbs_us]/3",
      UNIT: "[TBS_US]/3",
      value: "1"
    }
  },
  "[cup_us]": {
    CODE: "[CUP_US]",
    isMetric: false,
    class: "us-volumes",
    name: "cup",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[tbs_us]",
      UNIT: "[TBS_US]",
      value: "16"
    }
  },
  "[foz_m]": {
    CODE: "[FOZ_M]",
    isMetric: false,
    class: "us-volumes",
    name: "metric fluid ounce",
    printSymbol: "oz fl",
    property: "fluid volume",
    value: {
      Unit: "mL",
      UNIT: "ML",
      value: "30"
    }
  },
  "[cup_m]": {
    CODE: "[CUP_M]",
    isMetric: false,
    class: "us-volumes",
    name: "metric cup",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "mL",
      UNIT: "ML",
      value: "240"
    }
  },
  "[tsp_m]": {
    CODE: "[TSP_M]",
    isMetric: false,
    class: "us-volumes",
    name: "metric teaspoon",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "mL",
      UNIT: "mL",
      value: "5"
    }
  },
  "[tbs_m]": {
    CODE: "[TBS_M]",
    isMetric: false,
    class: "us-volumes",
    name: "metric tablespoon",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "mL",
      UNIT: "mL",
      value: "15"
    }
  },
  "[gal_br]": {
    CODE: "[GAL_BR]",
    isMetric: false,
    class: "brit-volumes",
    name: "gallon",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "l",
      UNIT: "L",
      value: "4.54609"
    }
  },
  "[pk_br]": {
    CODE: "[PK_BR]",
    isMetric: false,
    class: "brit-volumes",
    name: "peck",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[gal_br]",
      UNIT: "[GAL_BR]",
      value: "2"
    }
  },
  "[bu_br]": {
    CODE: "[BU_BR]",
    isMetric: false,
    class: "brit-volumes",
    name: "bushel",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[pk_br]",
      UNIT: "[PK_BR]",
      value: "4"
    }
  },
  "[qt_br]": {
    CODE: "[QT_BR]",
    isMetric: false,
    class: "brit-volumes",
    name: "quart",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[gal_br]/4",
      UNIT: "[GAL_BR]/4",
      value: "1"
    }
  },
  "[pt_br]": {
    CODE: "[PT_BR]",
    isMetric: false,
    class: "brit-volumes",
    name: "pint",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[qt_br]/2",
      UNIT: "[QT_BR]/2",
      value: "1"
    }
  },
  "[gil_br]": {
    CODE: "[GIL_BR]",
    isMetric: false,
    class: "brit-volumes",
    name: "gill",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[pt_br]/4",
      UNIT: "[PT_BR]/4",
      value: "1"
    }
  },
  "[foz_br]": {
    CODE: "[FOZ_BR]",
    isMetric: false,
    class: "brit-volumes",
    name: "fluid ounce",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[gil_br]/5",
      UNIT: "[GIL_BR]/5",
      value: "1"
    }
  },
  "[fdr_br]": {
    CODE: "[FDR_BR]",
    isMetric: false,
    class: "brit-volumes",
    name: "fluid dram",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[foz_br]/8",
      UNIT: "[FOZ_BR]/8",
      value: "1"
    }
  },
  "[min_br]": {
    CODE: "[MIN_BR]",
    isMetric: false,
    class: "brit-volumes",
    name: "minim",
    printSymbol: "",
    property: "volume",
    value: {
      Unit: "[fdr_br]/60",
      UNIT: "[FDR_BR]/60",
      value: "1"
    }
  },
  "[gr]": {
    CODE: "[GR]",
    isMetric: false,
    class: "avoirdupois",
    name: "grain",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "mg",
      UNIT: "MG",
      value: "64.79891"
    }
  },
  "[lb_av]": {
    CODE: "[LB_AV]",
    isMetric: false,
    class: "avoirdupois",
    name: "pound",
    printSymbol: "lb",
    property: "mass",
    value: {
      Unit: "[gr]",
      UNIT: "[GR]",
      value: "7000"
    }
  },
  "[oz_av]": {
    CODE: "[OZ_AV]",
    isMetric: false,
    class: "avoirdupois",
    name: "ounce",
    printSymbol: "oz",
    property: "mass",
    value: {
      Unit: "[lb_av]/16",
      UNIT: "[LB_AV]/16",
      value: "1"
    }
  },
  "[dr_av]": {
    CODE: "[DR_AV]",
    isMetric: false,
    class: "avoirdupois",
    name: "dram",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "[oz_av]/16",
      UNIT: "[OZ_AV]/16",
      value: "1"
    }
  },
  "[scwt_av]": {
    CODE: "[SCWT_AV]",
    isMetric: false,
    class: "avoirdupois",
    name: "short hundredweight",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "[lb_av]",
      UNIT: "[LB_AV]",
      value: "100"
    }
  },
  "[lcwt_av]": {
    CODE: "[LCWT_AV]",
    isMetric: false,
    class: "avoirdupois",
    name: "long hundredweight",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "[lb_av]",
      UNIT: "[LB_AV]",
      value: "112"
    }
  },
  "[ston_av]": {
    CODE: "[STON_AV]",
    isMetric: false,
    class: "avoirdupois",
    name: "short ton",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "[scwt_av]",
      UNIT: "[SCWT_AV]",
      value: "20"
    }
  },
  "[lton_av]": {
    CODE: "[LTON_AV]",
    isMetric: false,
    class: "avoirdupois",
    name: "long ton",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "[lcwt_av]",
      UNIT: "[LCWT_AV]",
      value: "20"
    }
  },
  "[stone_av]": {
    CODE: "[STONE_AV]",
    isMetric: false,
    class: "avoirdupois",
    name: "stone",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "[lb_av]",
      UNIT: "[LB_AV]",
      value: "14"
    }
  },
  "[pwt_tr]": {
    CODE: "[PWT_TR]",
    isMetric: false,
    class: "troy",
    name: "pennyweight",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "[gr]",
      UNIT: "[GR]",
      value: "24"
    }
  },
  "[oz_tr]": {
    CODE: "[OZ_TR]",
    isMetric: false,
    class: "troy",
    name: "ounce",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "[pwt_tr]",
      UNIT: "[PWT_TR]",
      value: "20"
    }
  },
  "[lb_tr]": {
    CODE: "[LB_TR]",
    isMetric: false,
    class: "troy",
    name: "pound",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "[oz_tr]",
      UNIT: "[OZ_TR]",
      value: "12"
    }
  },
  "[sc_ap]": {
    CODE: "[SC_AP]",
    isMetric: false,
    class: "apoth",
    name: "scruple",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "[gr]",
      UNIT: "[GR]",
      value: "20"
    }
  },
  "[dr_ap]": {
    CODE: "[DR_AP]",
    isMetric: false,
    class: "apoth",
    name: "dram",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "[sc_ap]",
      UNIT: "[SC_AP]",
      value: "3"
    }
  },
  "[oz_ap]": {
    CODE: "[OZ_AP]",
    isMetric: false,
    class: "apoth",
    name: "ounce",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "[dr_ap]",
      UNIT: "[DR_AP]",
      value: "8"
    }
  },
  "[lb_ap]": {
    CODE: "[LB_AP]",
    isMetric: false,
    class: "apoth",
    name: "pound",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "[oz_ap]",
      UNIT: "[OZ_AP]",
      value: "12"
    }
  },
  "[oz_m]": {
    CODE: "[OZ_M]",
    isMetric: false,
    class: "apoth",
    name: "metric ounce",
    printSymbol: "",
    property: "mass",
    value: {
      Unit: "g",
      UNIT: "g",
      value: "28"
    }
  },
  "[lne]": {
    CODE: "[LNE]",
    isMetric: false,
    class: "typeset",
    name: "line",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[in_i]/12",
      UNIT: "[IN_I]/12",
      value: "1"
    }
  },
  "[pnt]": {
    CODE: "[PNT]",
    isMetric: false,
    class: "typeset",
    name: "point",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[lne]/6",
      UNIT: "[LNE]/6",
      value: "1"
    }
  },
  "[pca]": {
    CODE: "[PCA]",
    isMetric: false,
    class: "typeset",
    name: "pica",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[pnt]",
      UNIT: "[PNT]",
      value: "12"
    }
  },
  "[pnt_pr]": {
    CODE: "[PNT_PR]",
    isMetric: false,
    class: "typeset",
    name: "Printer's point",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[in_i]",
      UNIT: "[IN_I]",
      value: "0.013837"
    }
  },
  "[pca_pr]": {
    CODE: "[PCA_PR]",
    isMetric: false,
    class: "typeset",
    name: "Printer's pica",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[pnt_pr]",
      UNIT: "[PNT_PR]",
      value: "12"
    }
  },
  "[pied]": {
    CODE: "[PIED]",
    isMetric: false,
    class: "typeset",
    name: "pied",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "cm",
      UNIT: "CM",
      value: "32.48"
    }
  },
  "[pouce]": {
    CODE: "[POUCE]",
    isMetric: false,
    class: "typeset",
    name: "pouce",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[pied]/12",
      UNIT: "[PIED]/12",
      value: "1"
    }
  },
  "[ligne]": {
    CODE: "[LIGNE]",
    isMetric: false,
    class: "typeset",
    name: "ligne",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[pouce]/12",
      UNIT: "[POUCE]/12",
      value: "1"
    }
  },
  "[didot]": {
    CODE: "[DIDOT]",
    isMetric: false,
    class: "typeset",
    name: "didot",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[ligne]/6",
      UNIT: "[LIGNE]/6",
      value: "1"
    }
  },
  "[cicero]": {
    CODE: "[CICERO]",
    isMetric: false,
    class: "typeset",
    name: "cicero",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[didot]",
      UNIT: "[DIDOT]",
      value: "12"
    }
  },
  "[degF]": {
    CODE: "[DEGF]",
    isMetric: false,
    isSpecial: true,
    class: "heat",
    name: "degree Fahrenheit",
    printSymbol: "°F",
    property: "temperature",
    value: {
      Unit: "degf(5 K/9)",
      UNIT: "DEGF(5 K/9)",
      value: "undefined",
      function: {
        name: "degF",
        value: "5",
        Unit: "K/9"
      }
    }
  },
  "[degR]": {
    CODE: "[degR]",
    isMetric: false,
    class: "heat",
    name: "degree Rankine",
    printSymbol: "°R",
    property: "temperature",
    value: {
      Unit: "K/9",
      UNIT: "K/9",
      value: "5"
    }
  },
  "[degRe]": {
    CODE: "[degRe]",
    isMetric: false,
    isSpecial: true,
    class: "heat",
    name: "degree Réaumur",
    printSymbol: "°Ré",
    property: "temperature",
    value: {
      Unit: "degre(5 K/4)",
      UNIT: "DEGRE(5 K/4)",
      value: "undefined",
      function: {
        name: "degRe",
        value: "5",
        Unit: "K/4"
      }
    }
  },
  "cal_[15]": {
    CODE: "CAL_[15]",
    isMetric: true,
    class: "heat",
    name: "calorie at 15 °C",
    printSymbol: "[object Object]",
    property: "energy",
    value: {
      Unit: "J",
      UNIT: "J",
      value: "4.18580"
    }
  },
  "cal_[20]": {
    CODE: "CAL_[20]",
    isMetric: true,
    class: "heat",
    name: "calorie at 20 °C",
    printSymbol: "[object Object]",
    property: "energy",
    value: {
      Unit: "J",
      UNIT: "J",
      value: "4.18190"
    }
  },
  "cal_m": {
    CODE: "CAL_M",
    isMetric: true,
    class: "heat",
    name: "mean calorie",
    printSymbol: "[object Object]",
    property: "energy",
    value: {
      Unit: "J",
      UNIT: "J",
      value: "4.19002"
    }
  },
  "cal_IT": {
    CODE: "CAL_IT",
    isMetric: true,
    class: "heat",
    name: "international table calorie",
    printSymbol: "[object Object]",
    property: "energy",
    value: {
      Unit: "J",
      UNIT: "J",
      value: "4.1868"
    }
  },
  "cal_th": {
    CODE: "CAL_TH",
    isMetric: true,
    class: "heat",
    name: "thermochemical calorie",
    printSymbol: "[object Object]",
    property: "energy",
    value: {
      Unit: "J",
      UNIT: "J",
      value: "4.184"
    }
  },
  "cal": {
    CODE: "CAL",
    isMetric: true,
    class: "heat",
    name: "calorie",
    printSymbol: "cal",
    property: "energy",
    value: {
      Unit: "cal_th",
      UNIT: "CAL_TH",
      value: "1"
    }
  },
  "[Cal]": {
    CODE: "[CAL]",
    isMetric: false,
    class: "heat",
    name: "nutrition label Calories",
    printSymbol: "Cal",
    property: "energy",
    value: {
      Unit: "kcal_th",
      UNIT: "KCAL_TH",
      value: "1"
    }
  },
  "[Btu_39]": {
    CODE: "[BTU_39]",
    isMetric: false,
    class: "heat",
    name: "British thermal unit at 39 °F",
    printSymbol: "[object Object]",
    property: "energy",
    value: {
      Unit: "kJ",
      UNIT: "kJ",
      value: "1.05967"
    }
  },
  "[Btu_59]": {
    CODE: "[BTU_59]",
    isMetric: false,
    class: "heat",
    name: "British thermal unit at 59 °F",
    printSymbol: "[object Object]",
    property: "energy",
    value: {
      Unit: "kJ",
      UNIT: "kJ",
      value: "1.05480"
    }
  },
  "[Btu_60]": {
    CODE: "[BTU_60]",
    isMetric: false,
    class: "heat",
    name: "British thermal unit at 60 °F",
    printSymbol: "[object Object]",
    property: "energy",
    value: {
      Unit: "kJ",
      UNIT: "kJ",
      value: "1.05468"
    }
  },
  "[Btu_m]": {
    CODE: "[BTU_M]",
    isMetric: false,
    class: "heat",
    name: "mean British thermal unit",
    printSymbol: "[object Object]",
    property: "energy",
    value: {
      Unit: "kJ",
      UNIT: "kJ",
      value: "1.05587"
    }
  },
  "[Btu_IT]": {
    CODE: "[BTU_IT]",
    isMetric: false,
    class: "heat",
    name: "international table British thermal unit",
    printSymbol: "[object Object]",
    property: "energy",
    value: {
      Unit: "kJ",
      UNIT: "kJ",
      value: "1.05505585262"
    }
  },
  "[Btu_th]": {
    CODE: "[BTU_TH]",
    isMetric: false,
    class: "heat",
    name: "thermochemical British thermal unit",
    printSymbol: "[object Object]",
    property: "energy",
    value: {
      Unit: "kJ",
      UNIT: "kJ",
      value: "1.054350"
    }
  },
  "[Btu]": {
    CODE: "[BTU]",
    isMetric: false,
    class: "heat",
    name: "British thermal unit",
    printSymbol: "btu",
    property: "energy",
    value: {
      Unit: "[Btu_th]",
      UNIT: "[BTU_TH]",
      value: "1"
    }
  },
  "[HP]": {
    CODE: "[HP]",
    isMetric: false,
    class: "heat",
    name: "horsepower",
    printSymbol: "",
    property: "power",
    value: {
      Unit: "[ft_i].[lbf_av]/s",
      UNIT: "[FT_I].[LBF_AV]/S",
      value: "550"
    }
  },
  "tex": {
    CODE: "TEX",
    isMetric: true,
    class: "heat",
    name: "tex",
    printSymbol: "tex",
    property: "linear mass density (of textile thread)",
    value: {
      Unit: "g/km",
      UNIT: "G/KM",
      value: "1"
    }
  },
  "[den]": {
    CODE: "[DEN]",
    isMetric: false,
    class: "heat",
    name: "Denier",
    printSymbol: "den",
    property: "linear mass density (of textile thread)",
    value: {
      Unit: "g/9/km",
      UNIT: "G/9/KM",
      value: "1"
    }
  },
  "m[H2O]": {
    CODE: "M[H2O]",
    isMetric: true,
    class: "clinical",
    name: "meter of water column",
    printSymbol: "[object Object]",
    property: "pressure",
    value: {
      Unit: "kPa",
      UNIT: "KPAL",
      value: "980665e-5"
    }
  },
  "m[Hg]": {
    CODE: "M[HG]",
    isMetric: true,
    class: "clinical",
    name: "meter of mercury column",
    printSymbol: "m Hg",
    property: "pressure",
    value: {
      Unit: "kPa",
      UNIT: "KPAL",
      value: "133.3220"
    }
  },
  "[in_i'H2O]": {
    CODE: "[IN_I'H2O]",
    isMetric: false,
    class: "clinical",
    name: "inch of water column",
    printSymbol: "[object Object]",
    property: "pressure",
    value: {
      Unit: "m[H2O].[in_i]/m",
      UNIT: "M[H2O].[IN_I]/M",
      value: "1"
    }
  },
  "[in_i'Hg]": {
    CODE: "[IN_I'HG]",
    isMetric: false,
    class: "clinical",
    name: "inch of mercury column",
    printSymbol: "in Hg",
    property: "pressure",
    value: {
      Unit: "m[Hg].[in_i]/m",
      UNIT: "M[HG].[IN_I]/M",
      value: "1"
    }
  },
  "[PRU]": {
    CODE: "[PRU]",
    isMetric: false,
    class: "clinical",
    name: "peripheral vascular resistance unit",
    printSymbol: "P.R.U.",
    property: "fluid resistance",
    value: {
      Unit: "mm[Hg].s/ml",
      UNIT: "MM[HG].S/ML",
      value: "1"
    }
  },
  "[wood'U]": {
    CODE: "[WOOD'U]",
    isMetric: false,
    class: "clinical",
    name: "Wood unit",
    printSymbol: "Wood U.",
    property: "fluid resistance",
    value: {
      Unit: "mm[Hg].min/L",
      UNIT: "MM[HG].MIN/L",
      value: "1"
    }
  },
  "[diop]": {
    CODE: "[DIOP]",
    isMetric: false,
    class: "clinical",
    name: "diopter",
    printSymbol: "dpt",
    property: "refraction of a lens",
    value: {
      Unit: "/m",
      UNIT: "/M",
      value: "1"
    }
  },
  "[p'diop]": {
    CODE: "[P'DIOP]",
    isMetric: false,
    isSpecial: true,
    class: "clinical",
    name: "prism diopter",
    printSymbol: "PD",
    property: "refraction of a prism",
    value: {
      Unit: "100tan(1 rad)",
      UNIT: "100TAN(1 RAD)",
      value: "undefined",
      function: {
        name: "tanTimes100",
        value: "1",
        Unit: "rad"
      }
    }
  },
  "%[slope]": {
    CODE: "%[SLOPE]",
    isMetric: false,
    isSpecial: true,
    class: "clinical",
    name: "percent of slope",
    printSymbol: "%",
    property: "slope",
    value: {
      Unit: "100tan(1 rad)",
      UNIT: "100TAN(1 RAD)",
      value: "undefined",
      function: {
        name: "100tan",
        value: "1",
        Unit: "deg"
      }
    }
  },
  "[mesh_i]": {
    CODE: "[MESH_I]",
    isMetric: false,
    class: "clinical",
    name: "mesh",
    printSymbol: "",
    property: "lineic number",
    value: {
      Unit: "/[in_i]",
      UNIT: "/[IN_I]",
      value: "1"
    }
  },
  "[Ch]": {
    CODE: "[CH]",
    isMetric: false,
    class: "clinical",
    name: "Charrière",
    printSymbol: "Ch",
    property: "gauge of catheters",
    value: {
      Unit: "mm/3",
      UNIT: "MM/3",
      value: "1"
    }
  },
  "[drp]": {
    CODE: "[DRP]",
    isMetric: false,
    class: "clinical",
    name: "drop",
    printSymbol: "drp",
    property: "volume",
    value: {
      Unit: "ml/20",
      UNIT: "ML/20",
      value: "1"
    }
  },
  "[hnsf'U]": {
    CODE: "[HNSF'U]",
    isMetric: false,
    class: "clinical",
    name: "Hounsfield unit",
    printSymbol: "HF",
    property: "x-ray attenuation",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[MET]": {
    CODE: "[MET]",
    isMetric: false,
    class: "clinical",
    name: "metabolic equivalent",
    printSymbol: "MET",
    property: "metabolic cost of physical activity",
    value: {
      Unit: "mL/min/kg",
      UNIT: "ML/MIN/KG",
      value: "3.5"
    }
  },
  "[hp'_X]": {
    CODE: "[HP'_X]",
    isMetric: false,
    isSpecial: true,
    class: "clinical",
    name: "homeopathic potency of decimal series (retired)",
    printSymbol: "X",
    property: "homeopathic potency (retired)",
    value: {
      Unit: "hpX(1 1)",
      UNIT: "HPX(1 1)",
      value: "undefined",
      function: {
        name: "hpX",
        value: "1",
        Unit: "1"
      }
    }
  },
  "[hp'_C]": {
    CODE: "[HP'_C]",
    isMetric: false,
    isSpecial: true,
    class: "clinical",
    name: "homeopathic potency of centesimal series (retired)",
    printSymbol: "C",
    property: "homeopathic potency (retired)",
    value: {
      Unit: "hpC(1 1)",
      UNIT: "HPC(1 1)",
      value: "undefined",
      function: {
        name: "hpC",
        value: "1",
        Unit: "1"
      }
    }
  },
  "[hp'_M]": {
    CODE: "[HP'_M]",
    isMetric: false,
    isSpecial: true,
    class: "clinical",
    name: "homeopathic potency of millesimal series (retired)",
    printSymbol: "M",
    property: "homeopathic potency (retired)",
    value: {
      Unit: "hpM(1 1)",
      UNIT: "HPM(1 1)",
      value: "undefined",
      function: {
        name: "hpM",
        value: "1",
        Unit: "1"
      }
    }
  },
  "[hp'_Q]": {
    CODE: "[HP'_Q]",
    isMetric: false,
    isSpecial: true,
    class: "clinical",
    name: "homeopathic potency of quintamillesimal series (retired)",
    printSymbol: "Q",
    property: "homeopathic potency (retired)",
    value: {
      Unit: "hpQ(1 1)",
      UNIT: "HPQ(1 1)",
      value: "undefined",
      function: {
        name: "hpQ",
        value: "1",
        Unit: "1"
      }
    }
  },
  "[hp_X]": {
    CODE: "[HP_X]",
    isMetric: false,
    class: "clinical",
    name: "homeopathic potency of decimal hahnemannian series",
    printSymbol: "X",
    property: "homeopathic potency (Hahnemann)",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[hp_C]": {
    CODE: "[HP_C]",
    isMetric: false,
    class: "clinical",
    name: "homeopathic potency of centesimal hahnemannian series",
    printSymbol: "C",
    property: "homeopathic potency (Hahnemann)",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[hp_M]": {
    CODE: "[HP_M]",
    isMetric: false,
    class: "clinical",
    name: "homeopathic potency of millesimal hahnemannian series",
    printSymbol: "M",
    property: "homeopathic potency (Hahnemann)",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[hp_Q]": {
    CODE: "[HP_Q]",
    isMetric: false,
    class: "clinical",
    name: "homeopathic potency of quintamillesimal hahnemannian series",
    printSymbol: "Q",
    property: "homeopathic potency (Hahnemann)",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[kp_X]": {
    CODE: "[KP_X]",
    isMetric: false,
    class: "clinical",
    name: "homeopathic potency of decimal korsakovian series",
    printSymbol: "X",
    property: "homeopathic potency (Korsakov)",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[kp_C]": {
    CODE: "[KP_C]",
    isMetric: false,
    class: "clinical",
    name: "homeopathic potency of centesimal korsakovian series",
    printSymbol: "C",
    property: "homeopathic potency (Korsakov)",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[kp_M]": {
    CODE: "[KP_M]",
    isMetric: false,
    class: "clinical",
    name: "homeopathic potency of millesimal korsakovian series",
    printSymbol: "M",
    property: "homeopathic potency (Korsakov)",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[kp_Q]": {
    CODE: "[KP_Q]",
    isMetric: false,
    class: "clinical",
    name: "homeopathic potency of quintamillesimal korsakovian series",
    printSymbol: "Q",
    property: "homeopathic potency (Korsakov)",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "eq": {
    CODE: "EQ",
    isMetric: true,
    class: "chemical",
    name: "equivalents",
    printSymbol: "eq",
    property: "amount of substance",
    value: {
      Unit: "mol",
      UNIT: "MOL",
      value: "1"
    }
  },
  "osm": {
    CODE: "OSM",
    isMetric: true,
    class: "chemical",
    name: "osmole",
    printSymbol: "osm",
    property: "amount of substance (dissolved particles)",
    value: {
      Unit: "mol",
      UNIT: "MOL",
      value: "1"
    }
  },
  "[pH]": {
    CODE: "[PH]",
    isMetric: false,
    isSpecial: true,
    class: "chemical",
    name: "pH",
    printSymbol: "pH",
    property: "acidity",
    value: {
      Unit: "pH(1 mol/l)",
      UNIT: "PH(1 MOL/L)",
      value: "undefined",
      function: {
        name: "pH",
        value: "1",
        Unit: "mol/l"
      }
    }
  },
  "g%": {
    CODE: "G%",
    isMetric: true,
    class: "chemical",
    name: "gram percent",
    printSymbol: "g%",
    property: "mass concentration",
    value: {
      Unit: "g/dl",
      UNIT: "G/DL",
      value: "1"
    }
  },
  "[S]": {
    CODE: "[S]",
    isMetric: false,
    class: "chemical",
    name: "Svedberg unit",
    printSymbol: "S",
    property: "sedimentation coefficient",
    value: {
      Unit: "10*-13.s",
      UNIT: "10*-13.S",
      value: "1"
    }
  },
  "[HPF]": {
    CODE: "[HPF]",
    isMetric: false,
    class: "chemical",
    name: "high power field",
    printSymbol: "HPF",
    property: "view area in microscope",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[LPF]": {
    CODE: "[LPF]",
    isMetric: false,
    class: "chemical",
    name: "low power field",
    printSymbol: "LPF",
    property: "view area in microscope",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "100"
    }
  },
  "kat": {
    CODE: "KAT",
    isMetric: true,
    class: "chemical",
    name: "katal",
    printSymbol: "kat",
    property: "catalytic activity",
    value: {
      Unit: "mol/s",
      UNIT: "MOL/S",
      value: "1"
    }
  },
  "U": {
    CODE: "U",
    isMetric: true,
    class: "chemical",
    name: "Unit",
    printSymbol: "U",
    property: "catalytic activity",
    value: {
      Unit: "umol/min",
      UNIT: "UMOL/MIN",
      value: "1"
    }
  },
  "[iU]": {
    CODE: "[IU]",
    isMetric: true,
    class: "chemical",
    name: "international unit",
    printSymbol: "IU",
    property: "arbitrary",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[IU]": {
    CODE: "[IU]",
    isMetric: true,
    class: "chemical",
    name: "international unit",
    printSymbol: "i.U.",
    property: "arbitrary",
    value: {
      Unit: "[iU]",
      UNIT: "[IU]",
      value: "1"
    }
  },
  "[arb'U]": {
    CODE: "[ARB'U]",
    isMetric: false,
    class: "chemical",
    name: "arbitrary unit",
    printSymbol: "arb. U",
    property: "arbitrary",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[USP'U]": {
    CODE: "[USP'U]",
    isMetric: false,
    class: "chemical",
    name: "United States Pharmacopeia unit",
    printSymbol: "U.S.P.",
    property: "arbitrary",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[GPL'U]": {
    CODE: "[GPL'U]",
    isMetric: false,
    class: "chemical",
    name: "GPL unit",
    printSymbol: "",
    property: "biologic activity of anticardiolipin IgG",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[MPL'U]": {
    CODE: "[MPL'U]",
    isMetric: false,
    class: "chemical",
    name: "MPL unit",
    printSymbol: "",
    property: "biologic activity of anticardiolipin IgM",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[APL'U]": {
    CODE: "[APL'U]",
    isMetric: false,
    class: "chemical",
    name: "APL unit",
    printSymbol: "",
    property: "biologic activity of anticardiolipin IgA",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[beth'U]": {
    CODE: "[BETH'U]",
    isMetric: false,
    class: "chemical",
    name: "Bethesda unit",
    printSymbol: "",
    property: "biologic activity of factor VIII inhibitor",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[anti'Xa'U]": {
    CODE: "[ANTI'XA'U]",
    isMetric: false,
    class: "chemical",
    name: "anti factor Xa unit",
    printSymbol: "",
    property: "biologic activity of factor Xa inhibitor (heparin)",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[todd'U]": {
    CODE: "[TODD'U]",
    isMetric: false,
    class: "chemical",
    name: "Todd unit",
    printSymbol: "",
    property: "biologic activity antistreptolysin O",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[dye'U]": {
    CODE: "[DYE'U]",
    isMetric: false,
    class: "chemical",
    name: "Dye unit",
    printSymbol: "",
    property: "biologic activity of amylase",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[smgy'U]": {
    CODE: "[SMGY'U]",
    isMetric: false,
    class: "chemical",
    name: "Somogyi unit",
    printSymbol: "",
    property: "biologic activity of amylase",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[bdsk'U]": {
    CODE: "[BDSK'U]",
    isMetric: false,
    class: "chemical",
    name: "Bodansky unit",
    printSymbol: "",
    property: "biologic activity of phosphatase",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[ka'U]": {
    CODE: "[KA'U]",
    isMetric: false,
    class: "chemical",
    name: "King-Armstrong unit",
    printSymbol: "",
    property: "biologic activity of phosphatase",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[knk'U]": {
    CODE: "[KNK'U]",
    isMetric: false,
    class: "chemical",
    name: "Kunkel unit",
    printSymbol: "",
    property: "arbitrary biologic activity",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[mclg'U]": {
    CODE: "[MCLG'U]",
    isMetric: false,
    class: "chemical",
    name: "Mac Lagan unit",
    printSymbol: "",
    property: "arbitrary biologic activity",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[tb'U]": {
    CODE: "[TB'U]",
    isMetric: false,
    class: "chemical",
    name: "tuberculin unit",
    printSymbol: "",
    property: "biologic activity of tuberculin",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[CCID_50]": {
    CODE: "[CCID_50]",
    isMetric: false,
    class: "chemical",
    name: "50% cell culture infectious dose",
    printSymbol: "[object Object]",
    property: "biologic activity (infectivity) of an infectious agent preparation",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[TCID_50]": {
    CODE: "[TCID_50]",
    isMetric: false,
    class: "chemical",
    name: "50% tissue culture infectious dose",
    printSymbol: "[object Object]",
    property: "biologic activity (infectivity) of an infectious agent preparation",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[EID_50]": {
    CODE: "[EID_50]",
    isMetric: false,
    class: "chemical",
    name: "50% embryo infectious dose",
    printSymbol: "[object Object]",
    property: "biologic activity (infectivity) of an infectious agent preparation",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[PFU]": {
    CODE: "[PFU]",
    isMetric: false,
    class: "chemical",
    name: "plaque forming units",
    printSymbol: "PFU",
    property: "amount of an infectious agent",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[FFU]": {
    CODE: "[FFU]",
    isMetric: false,
    class: "chemical",
    name: "focus forming units",
    printSymbol: "FFU",
    property: "amount of an infectious agent",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[CFU]": {
    CODE: "[CFU]",
    isMetric: false,
    class: "chemical",
    name: "colony forming units",
    printSymbol: "CFU",
    property: "amount of a proliferating organism",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[IR]": {
    CODE: "[IR]",
    isMetric: false,
    class: "chemical",
    name: "index of reactivity",
    printSymbol: "IR",
    property: "amount of an allergen calibrated through in-vivo testing using the Stallergenes® method",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[BAU]": {
    CODE: "[BAU]",
    isMetric: false,
    class: "chemical",
    name: "bioequivalent allergen unit",
    printSymbol: "BAU",
    property: "amount of an allergen calibrated through in-vivo testing based on the ID50EAL method of (intradermal dilution for 50mm sum of erythema diameters",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[AU]": {
    CODE: "[AU]",
    isMetric: false,
    class: "chemical",
    name: "allergen unit",
    printSymbol: "AU",
    property: "procedure defined amount of an allergen using some reference standard",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[Amb'a'1'U]": {
    CODE: "[AMB'A'1'U]",
    isMetric: false,
    class: "chemical",
    name: "allergen unit for Ambrosia artemisiifolia",
    printSymbol: "Amb a 1 U",
    property: "procedure defined amount of the major allergen of ragweed",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[PNU]": {
    CODE: "[PNU]",
    isMetric: false,
    class: "chemical",
    name: "protein nitrogen unit",
    printSymbol: "PNU",
    property: "procedure defined amount of a protein substance",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[Lf]": {
    CODE: "[LF]",
    isMetric: false,
    class: "chemical",
    name: "Limit of flocculation",
    printSymbol: "Lf",
    property: "procedure defined amount of an antigen substance",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[D'ag'U]": {
    CODE: "[D'AG'U]",
    isMetric: false,
    class: "chemical",
    name: "D-antigen unit",
    printSymbol: "",
    property: "procedure defined amount of a poliomyelitis d-antigen substance",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[FEU]": {
    CODE: "[FEU]",
    isMetric: false,
    class: "chemical",
    name: "fibrinogen equivalent unit",
    printSymbol: "",
    property: "amount of fibrinogen broken down into the measured d-dimers",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[ELU]": {
    CODE: "[ELU]",
    isMetric: false,
    class: "chemical",
    name: "ELISA unit",
    printSymbol: "",
    property: "arbitrary ELISA unit",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[EU]": {
    CODE: "[EU]",
    isMetric: false,
    class: "chemical",
    name: "Ehrlich unit",
    printSymbol: "",
    property: "Ehrlich unit",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "Np": {
    CODE: "NEP",
    isMetric: true,
    isSpecial: true,
    class: "levels",
    name: "neper",
    printSymbol: "Np",
    property: "level",
    value: {
      Unit: "ln(1 1)",
      UNIT: "LN(1 1)",
      value: "undefined",
      function: {
        name: "ln",
        value: "1",
        Unit: "1"
      }
    }
  },
  "B": {
    CODE: "B",
    isMetric: true,
    isSpecial: true,
    class: "levels",
    name: "bel",
    printSymbol: "B",
    property: "level",
    value: {
      Unit: "lg(1 1)",
      UNIT: "LG(1 1)",
      value: "undefined",
      function: {
        name: "lg",
        value: "1",
        Unit: "1"
      }
    }
  },
  "B[SPL]": {
    CODE: "B[SPL]",
    isMetric: true,
    isSpecial: true,
    class: "levels",
    name: "bel sound pressure",
    printSymbol: "B(SPL)",
    property: "pressure level",
    value: {
      Unit: "2lg(2 10*-5.Pa)",
      UNIT: "2LG(2 10*-5.PAL)",
      value: "undefined",
      function: {
        name: "lgTimes2",
        value: "2",
        Unit: "10*-5.Pa"
      }
    }
  },
  "B[V]": {
    CODE: "B[V]",
    isMetric: true,
    isSpecial: true,
    class: "levels",
    name: "bel volt",
    printSymbol: "B(V)",
    property: "electric potential level",
    value: {
      Unit: "2lg(1 V)",
      UNIT: "2LG(1 V)",
      value: "undefined",
      function: {
        name: "lgTimes2",
        value: "1",
        Unit: "V"
      }
    }
  },
  "B[mV]": {
    CODE: "B[MV]",
    isMetric: true,
    isSpecial: true,
    class: "levels",
    name: "bel millivolt",
    printSymbol: "B(mV)",
    property: "electric potential level",
    value: {
      Unit: "2lg(1 mV)",
      UNIT: "2LG(1 MV)",
      value: "undefined",
      function: {
        name: "lgTimes2",
        value: "1",
        Unit: "mV"
      }
    }
  },
  "B[uV]": {
    CODE: "B[UV]",
    isMetric: true,
    isSpecial: true,
    class: "levels",
    name: "bel microvolt",
    printSymbol: "B(μV)",
    property: "electric potential level",
    value: {
      Unit: "2lg(1 uV)",
      UNIT: "2LG(1 UV)",
      value: "undefined",
      function: {
        name: "lgTimes2",
        value: "1",
        Unit: "uV"
      }
    }
  },
  "B[10.nV]": {
    CODE: "B[10.NV]",
    isMetric: true,
    isSpecial: true,
    class: "levels",
    name: "bel 10 nanovolt",
    printSymbol: "B(10 nV)",
    property: "electric potential level",
    value: {
      Unit: "2lg(10 nV)",
      UNIT: "2LG(10 NV)",
      value: "undefined",
      function: {
        name: "lgTimes2",
        value: "10",
        Unit: "nV"
      }
    }
  },
  "B[W]": {
    CODE: "B[W]",
    isMetric: true,
    isSpecial: true,
    class: "levels",
    name: "bel watt",
    printSymbol: "B(W)",
    property: "power level",
    value: {
      Unit: "lg(1 W)",
      UNIT: "LG(1 W)",
      value: "undefined",
      function: {
        name: "lg",
        value: "1",
        Unit: "W"
      }
    }
  },
  "B[kW]": {
    CODE: "B[KW]",
    isMetric: true,
    isSpecial: true,
    class: "levels",
    name: "bel kilowatt",
    printSymbol: "B(kW)",
    property: "power level",
    value: {
      Unit: "lg(1 kW)",
      UNIT: "LG(1 KW)",
      value: "undefined",
      function: {
        name: "lg",
        value: "1",
        Unit: "kW"
      }
    }
  },
  "st": {
    CODE: "STR",
    isMetric: true,
    class: "misc",
    name: "stere",
    printSymbol: "st",
    property: "volume",
    value: {
      Unit: "m3",
      UNIT: "M3",
      value: "1"
    }
  },
  "Ao": {
    CODE: "AO",
    isMetric: false,
    class: "misc",
    name: "Ångström",
    printSymbol: "Å",
    property: "length",
    value: {
      Unit: "nm",
      UNIT: "NM",
      value: "0.1"
    }
  },
  "b": {
    CODE: "BRN",
    isMetric: false,
    class: "misc",
    name: "barn",
    printSymbol: "b",
    property: "action area",
    value: {
      Unit: "fm2",
      UNIT: "FM2",
      value: "100"
    }
  },
  "att": {
    CODE: "ATT",
    isMetric: false,
    class: "misc",
    name: "technical atmosphere",
    printSymbol: "at",
    property: "pressure",
    value: {
      Unit: "kgf/cm2",
      UNIT: "KGF/CM2",
      value: "1"
    }
  },
  "mho": {
    CODE: "MHO",
    isMetric: true,
    class: "misc",
    name: "mho",
    printSymbol: "mho",
    property: "electric conductance",
    value: {
      Unit: "S",
      UNIT: "S",
      value: "1"
    }
  },
  "[psi]": {
    CODE: "[PSI]",
    isMetric: false,
    class: "misc",
    name: "pound per square inch",
    printSymbol: "psi",
    property: "pressure",
    value: {
      Unit: "[lbf_av]/[in_i]2",
      UNIT: "[LBF_AV]/[IN_I]2",
      value: "1"
    }
  },
  "circ": {
    CODE: "CIRC",
    isMetric: false,
    class: "misc",
    name: "circle",
    printSymbol: "circ",
    property: "plane angle",
    value: {
      Unit: "[pi].rad",
      UNIT: "[PI].RAD",
      value: "2"
    }
  },
  "sph": {
    CODE: "SPH",
    isMetric: false,
    class: "misc",
    name: "sphere",
    printSymbol: "sph",
    property: "solid angle",
    value: {
      Unit: "[pi].sr",
      UNIT: "[PI].SR",
      value: "4"
    }
  },
  "[car_m]": {
    CODE: "[CAR_M]",
    isMetric: false,
    class: "misc",
    name: "metric carat",
    printSymbol: "[object Object]",
    property: "mass",
    value: {
      Unit: "g",
      UNIT: "G",
      value: "2e-1"
    }
  },
  "[car_Au]": {
    CODE: "[CAR_AU]",
    isMetric: false,
    class: "misc",
    name: "carat of gold alloys",
    printSymbol: "[object Object]",
    property: "mass fraction",
    value: {
      Unit: "/24",
      UNIT: "/24",
      value: "1"
    }
  },
  "[smoot]": {
    CODE: "[SMOOT]",
    isMetric: false,
    class: "misc",
    name: "Smoot",
    printSymbol: "",
    property: "length",
    value: {
      Unit: "[in_i]",
      UNIT: "[IN_I]",
      value: "67"
    }
  },
  "[m/s2/Hz^(1/2)]": {
    CODE: "[M/S2/HZ^(1/2)]",
    isMetric: false,
    isSpecial: true,
    class: "misc",
    name: "meter per square seconds per square root of hertz",
    printSymbol: "",
    property: "amplitude spectral density",
    value: {
      Unit: "sqrt(1 m2/s4/Hz)",
      UNIT: "SQRT(1 M2/S4/HZ)",
      value: "undefined",
      function: {
        name: "sqrt",
        value: "1",
        Unit: "m2/s4/Hz"
      }
    }
  },
  "[NTU]": {
    CODE: "[NTU]",
    isMetric: false,
    class: "misc",
    name: "Nephelometric Turbidity Unit",
    printSymbol: "",
    property: "turbidity",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "[FNU]": {
    CODE: "[FNU]",
    isMetric: false,
    class: "misc",
    name: "Formazin Nephelometric Unit",
    printSymbol: "",
    property: "turbidity",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "bit_s": {
    CODE: "BIT_S",
    isMetric: false,
    isSpecial: true,
    class: "infotech",
    name: "bit",
    printSymbol: "[object Object]",
    property: "amount of information",
    value: {
      Unit: "ld(1 1)",
      UNIT: "ld(1 1)",
      value: "undefined",
      function: {
        name: "ld",
        value: "1",
        Unit: "1"
      }
    }
  },
  "bit": {
    CODE: "BIT",
    isMetric: true,
    class: "infotech",
    name: "bit",
    printSymbol: "bit",
    property: "amount of information",
    value: {
      Unit: "1",
      UNIT: "1",
      value: "1"
    }
  },
  "By": {
    CODE: "BY",
    isMetric: true,
    class: "infotech",
    name: "byte",
    printSymbol: "B",
    property: "amount of information",
    value: {
      Unit: "bit",
      UNIT: "bit",
      value: "8"
    }
  },
  "Bd": {
    CODE: "BD",
    isMetric: true,
    class: "infotech",
    name: "baud",
    printSymbol: "Bd",
    property: "signal transmission rate",
    value: {
      Unit: "/s",
      UNIT: "/s",
      value: "1"
    }
  }
};

// Export base units separately for convenience
export const baseUnits = Object.fromEntries(
  Object.entries(units).filter(([_, unit]) => unit.isBaseUnit)
);
