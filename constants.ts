

import { BuildingType, Era } from './types';

export const GAME_SPEED = 1; 
export const YEARS_PER_SECOND = 0.027; 
export const START_YEAR = 1850;
export const GRID_SIZE = 24;
export const TILE_SIZE = 2;

// Animation Speeds
export const CLOUD_SPEED = 0.2;
export const VEHICLE_SPEED = 0.8;
export const PEDESTRIAN_SPEED = 0.4;

export const BUILDING_COSTS: Record<BuildingType, number> = {
  [BuildingType.RESIDENTIAL]: 100,
  [BuildingType.COMMERCIAL]: 200,
  [BuildingType.INDUSTRIAL]: 300,
  [BuildingType.ROAD]: 10,
  [BuildingType.BRIDGE]: 100,
  [BuildingType.SHERIFF]: 500,
  [BuildingType.MAYOR]: 1000,
  [BuildingType.HOSPITAL]: 800,
  [BuildingType.STABLE]: 150,
  [BuildingType.BLACKSMITH]: 250,
  [BuildingType.FARM]: 150,
  [BuildingType.FOREST]: 50,
  [BuildingType.DEMOLISH]: 50,
  [BuildingType.GOLD_MINE]: 0,   // Generated, cannot buy usually
  [BuildingType.SILVER_MINE]: 0,
  [BuildingType.COAL_MINE]: 0,
};

export const BUILDING_INCOME: Record<BuildingType, number> = {
  [BuildingType.RESIDENTIAL]: 5,
  [BuildingType.COMMERCIAL]: 15,
  [BuildingType.INDUSTRIAL]: 25,
  [BuildingType.ROAD]: 0,
  [BuildingType.BRIDGE]: 0,
  [BuildingType.SHERIFF]: 0,
  [BuildingType.MAYOR]: 10,
  [BuildingType.HOSPITAL]: 5,
  [BuildingType.STABLE]: 10,
  [BuildingType.BLACKSMITH]: 20,
  [BuildingType.FARM]: 12,
  [BuildingType.FOREST]: 2,
  [BuildingType.DEMOLISH]: 0,
  [BuildingType.GOLD_MINE]: 50,
  [BuildingType.SILVER_MINE]: 30,
  [BuildingType.COAL_MINE]: 20,
};

export const POPULATION_CAPACITY: Record<BuildingType, number> = {
  [BuildingType.RESIDENTIAL]: 15,
  [BuildingType.COMMERCIAL]: 5,
  [BuildingType.INDUSTRIAL]: 0,
  [BuildingType.ROAD]: 0,
  [BuildingType.BRIDGE]: 0,
  [BuildingType.SHERIFF]: 2,
  [BuildingType.MAYOR]: 5,
  [BuildingType.HOSPITAL]: 20,
  [BuildingType.STABLE]: 5,
  [BuildingType.BLACKSMITH]: 3,
  [BuildingType.FARM]: 10,
  [BuildingType.FOREST]: 0,
  [BuildingType.DEMOLISH]: 0,
  [BuildingType.GOLD_MINE]: 5,
  [BuildingType.SILVER_MINE]: 5,
  [BuildingType.COAL_MINE]: 10,
};

export const COLORS = {
  GROUND: '#5ba65b', 
  SAND_GROUND: '#e6c288', 
  WATER: '#4fc3f7',
  HILL: '#8d6e63',
  HILL_GOLD: '#a1887f',
  HILL_SILVER: '#9e9e9e',
  HILL_COAL: '#5d4037',
  ROCK: '#7f8c8d',
  HIGHLIGHT: '#ffd700',
  DEMOLISH_HIGHLIGHT: '#ff0000',
  
  [Era.WILD_WEST]: {
    RESIDENTIAL: '#d2691e', 
    COMMERCIAL: '#cd853f', 
    INDUSTRIAL: '#8b4513', 
    ROAD: '#c2b280', 
    ROOF: '#8b0000',
    DETAILS: '#f4a460'
  },
  [Era.INDUSTRIAL]: {
    RESIDENTIAL: '#a52a2a', 
    COMMERCIAL: '#778899', 
    INDUSTRIAL: '#2f4f4f', 
    ROAD: '#696969', 
    ROOF: '#2e2e2e',
    DETAILS: '#b8860b'
  },
  [Era.MODERN]: {
    RESIDENTIAL: '#f5f5f5', 
    COMMERCIAL: '#87cefa', 
    INDUSTRIAL: '#708090', 
    ROAD: '#2c3e50', 
    ROOF: '#34495e',
    DETAILS: '#ecf0f1'
  },
  [Era.FUTURE]: {
    RESIDENTIAL: '#e0ffff', 
    COMMERCIAL: '#00ced1', 
    INDUSTRIAL: '#9370db', 
    ROAD: '#00ffff', 
    ROOF: '#ff00ff',
    DETAILS: '#00ff00'
  }
};

export const LABELS: Record<BuildingType, string> = {
  [BuildingType.RESIDENTIAL]: 'מגורים',
  [BuildingType.COMMERCIAL]: 'מסחר',
  [BuildingType.INDUSTRIAL]: 'תעשייה',
  [BuildingType.ROAD]: 'דרך',
  [BuildingType.BRIDGE]: 'גשר',
  [BuildingType.SHERIFF]: 'שריף/משטרה',
  [BuildingType.MAYOR]: 'עירייה',
  [BuildingType.HOSPITAL]: 'מרפאה/בי"ח',
  [BuildingType.STABLE]: 'אורווה/מוסך',
  [BuildingType.BLACKSMITH]: 'נפח/תיקונים',
  [BuildingType.FARM]: 'חווה/גידולים',
  [BuildingType.FOREST]: 'יער/פארק',
  [BuildingType.DEMOLISH]: 'הריסה',
  [BuildingType.GOLD_MINE]: 'מכרה זהב',
  [BuildingType.SILVER_MINE]: 'מכרה כסף',
  [BuildingType.COAL_MINE]: 'מכרה פחם',
};
