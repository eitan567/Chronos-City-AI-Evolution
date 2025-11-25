
import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      [elemName: string]: any;
    }
  }
}

export enum Era {
  WILD_WEST = 'WILD_WEST',
  INDUSTRIAL = 'INDUSTRIAL',
  MODERN = 'MODERN',
  FUTURE = 'FUTURE'
}

export enum BuildingType {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  ROAD = 'ROAD',
  BRIDGE = 'BRIDGE',
  SHERIFF = 'SHERIFF',     
  MAYOR = 'MAYOR',         
  HOSPITAL = 'HOSPITAL',   
  STABLE = 'STABLE',       
  BLACKSMITH = 'BLACKSMITH', 
  FARM = 'FARM',           
  FOREST = 'FOREST',       
  DEMOLISH = 'DEMOLISH',
  // Resources
  GOLD_MINE = 'GOLD_MINE',
  SILVER_MINE = 'SILVER_MINE',
  COAL_MINE = 'COAL_MINE'
}

export interface BuildingData {
  id: string;
  type: BuildingType;
  era: Era;
  x: number;
  z: number;
  rotation: number;
  variant: number; 
}

export interface TerrainTile {
    x: number;
    z: number;
    type: 'GROUND' | 'WATER' | 'HILL';
    decoration: 'NONE' | 'ROCK' | 'BUSH' | 'GRASS';
    height: number;
    resourceHint?: 'GOLD' | 'SILVER' | 'COAL';
    colorVariation?: number;
}

export interface Mission {
  description: string;
  targetType: 'POPULATION' | 'BUILDING_COUNT' | 'MONEY';
  targetValue: number;
  completed: boolean;
}

export interface GameState {
  year: number;
  era: Era;
  money: number;
  population: number;
  buildings: BuildingData[];
  terrain: TerrainTile[];
  selectedBuildingType: BuildingType | null;
  newsFeed: string;
  isLoadingAI: boolean;
  mission: Mission | null;
}

export const ERA_THRESHOLDS = {
  [Era.WILD_WEST]: 1850,
  [Era.INDUSTRIAL]: 1900,
  [Era.MODERN]: 1950,
  [Era.FUTURE]: 2020
};

export interface AIResponse {
  newsHeadline: string;
  populationGrowth: number;
  moneyBonus: number;
  era: string;
  mission: {
    description: string;
    targetType: 'POPULATION' | 'BUILDING_COUNT' | 'MONEY';
    targetValue: number;
  } | null;
}
