
export type ProtectionIntensity = 'Basic' | 'Enhanced' | 'Professional';

export interface ClothingItem {
  icon: string;
  text: string;
  desc: string;
  intensity?: ProtectionIntensity;
  specs?: {
    upf?: string;
    fabric?: string;
    color?: string;
    coating?: string;
  };
}

export interface ClothingLevel {
  summary: string;
  items: ClothingItem[];
}

export interface SunscreenLevel {
  spf: string;
  intensity: ProtectionIntensity;
  dosage: {
    faceNeck: string;
    arms: string;
    legs: string;
    torso: string;
  };
  reapplication: string;
  scenarios: string[];
}

export interface UVProtectionAdvice {
  uvIndex: number;
  clothingAdvice: ClothingLevel;
  sunscreenAdvice: SunscreenLevel | null;
  dataSource: string;
  protectionLevel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
}

export const getUVProtectionAdvice = (uv: number): UVProtectionAdvice => {
  const roundedUV = Math.round(uv);
  const dataSource = "WHO/NOAA/EPA Guidelines";

  // Dosage constants
  const dosage = {
    faceNeck: "5ml",
    arms: "5ml each",
    legs: "10ml each",
    torso: "10ml",
  };

  if (roundedUV <= 2) {
    return {
      uvIndex: uv,
      protectionLevel: 'Low',
      clothingAdvice: {
        summary: "No special sun protection clothing needed",
        items: [
          {
            icon: "✅",
            text: "No protection needed",
            desc: "UV levels are minimal. No sun protection is required.",
          },
        ],
      },
      sunscreenAdvice: null,
      dataSource,
    };
  }

  if (roundedUV <= 5) {
    // Moderate (3-5)
    return {
      uvIndex: uv,
      protectionLevel: 'Moderate',
      clothingAdvice: {
        summary: "Basic protection required",
        items: [
          {
            icon: "👕",
            text: "Cover up",
            desc: "Wear a T-shirt or shirt.",
            intensity: 'Basic',
            specs: {
              upf: "15+",
              fabric: "Cotton/Polyester",
              color: "Light colors OK",
            },
          },
          {
            icon: "👒",
            text: "Wear a hat",
            desc: "Wear a hat that shades the face.",
            intensity: 'Basic',
            specs: {
              upf: "15+",
              fabric: "Canvas/Straw",
              color: "Any",
            },
          },
          {
            icon: "🕶️",
            text: "Wear sunglasses",
            desc: "Wear sunglasses on bright days.",
            intensity: 'Basic',
            specs: {
              upf: "UV400",
              fabric: "Polycarbonate",
              color: "Grey/Brown tint",
            },
          },
        ],
      },
      sunscreenAdvice: {
        spf: "15",
        intensity: 'Basic',
        dosage,
        reapplication: "2 hours",
        scenarios: ["Daily commute", "Short outdoor walks"],
      },
      dataSource,
    };
  }

  if (roundedUV <= 7) {
    // High (6-7)
    return {
      uvIndex: uv,
      protectionLevel: 'High',
      clothingAdvice: {
        summary: "Enhanced protection required",
        items: [
          {
            icon: "👕",
            text: "Cover up",
            desc: "Wear sun-protective clothing.",
            intensity: 'Enhanced',
            specs: {
              upf: "30+",
              fabric: "Tightly woven",
              color: "Darker/Vivid colors",
            },
          },
          {
            icon: "👒",
            text: "Wear a hat",
            desc: "Wear a wide-brimmed hat.",
            intensity: 'Enhanced',
            specs: {
              upf: "30+",
              fabric: "Heavy cotton/Synthetic",
              color: "Dark underbrim",
            },
          },
          {
            icon: "🕶️",
            text: "Wear sunglasses",
            desc: "Protect your eyes with quality shades.",
            intensity: 'Enhanced',
            specs: {
              upf: "UV400",
              fabric: "Polarized",
              color: "Dark tint",
            },
          },
        ],
      },
      sunscreenAdvice: {
        spf: "30",
        intensity: 'Enhanced',
        dosage,
        reapplication: "2 hours",
        scenarios: ["Outdoor sports", "Beach", "Hiking"],
      },
      dataSource,
    };
  }

  if (roundedUV <= 10) {
    // Very High (8-10)
    return {
      uvIndex: uv,
      protectionLevel: 'Very High',
      clothingAdvice: {
        summary: "Professional protection required",
        items: [
          {
            icon: "👕",
            text: "Protection required",
            desc: "Wear long-sleeved shirt and trousers.",
            intensity: 'Professional',
            specs: {
              upf: "50+",
              fabric: "Specialized sun-protective",
              color: "Dark/Navy/Black",
            },
          },
          {
            icon: "👒",
            text: "Wear a hat",
            desc: "Wear a broad-brimmed hat protecting neck.",
            intensity: 'Professional',
            specs: {
              upf: "50+",
              fabric: "Tech fabric",
              color: "Dark/Reflective",
            },
          },
          {
            icon: "🕶️",
            text: "Wear sunglasses",
            desc: "Wrap-around sunglasses are essential.",
            intensity: 'Professional',
            specs: {
              upf: "UV400 Category 3/4",
              fabric: "Impact resistant",
              color: "Darkest tint",
            },
          },
        ],
      },
      sunscreenAdvice: {
        spf: "50+",
        intensity: 'Professional',
        dosage,
        reapplication: "2 hours or after swimming/sweating",
        scenarios: ["All outdoor activities", "Peak sun hours"],
      },
      dataSource,
    };
  }

  // Extreme (11+)
  return {
    uvIndex: uv,
    protectionLevel: 'Extreme',
    clothingAdvice: {
      summary: "Maximum protection required. Avoid sun.",
      items: [
        {
          icon: "☂️",
          text: "Seek shade",
          desc: "Seek shade, strictly avoid midday sun.",
          intensity: 'Professional',
        },
        {
          icon: "👕",
          text: "Protective clothing",
          desc: "Wear loose, long-sleeved shirt and trousers.",
          intensity: 'Professional',
          specs: {
            upf: "50+",
            fabric: "Specialized/Dense",
            color: "Dark",
            coating: "Ceramic/Titanium dioxide",
          },
        },
        {
          icon: "👒",
          text: "Wear a hat",
          desc: "Wear a broad-brimmed hat.",
          intensity: 'Professional',
          specs: {
            upf: "50+",
            fabric: "Double layer",
            color: "Dark",
          },
        },
        {
          icon: "🕶️",
          text: "Wear sunglasses",
          desc: "Wear quality wrap-around sunglasses.",
          intensity: 'Professional',
          specs: {
            upf: "UV400",
            fabric: "Polarized",
            color: "Dark",
          },
        },
      ],
    },
    sunscreenAdvice: {
      spf: "50+",
      intensity: 'Professional',
      dosage,
      reapplication: "Every 1-2 hours",
      scenarios: ["Avoid outdoors if possible", "Extreme exposure"],
    },
    dataSource,
  };
};
