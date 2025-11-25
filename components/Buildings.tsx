
import React from 'react';
import { BuildingType, Era } from '../types';
import { COLORS } from '../constants';
import Residential from './buildings/Residential';
import Commercial from './buildings/Commercial';
import Industrial from './buildings/Industrial';
import Roads from './buildings/Roads';
import Nature from './buildings/Nature';
import Civic from './buildings/Civic';

interface BuildingProps {
  type: BuildingType;
  era: Era;
  position: [number, number, number];
  rotation: number;
  variant: number;
  n?: boolean;
  s?: boolean;
  e?: boolean;
  w?: boolean;
}

const Building: React.FC<BuildingProps> = ({ type, era, position, rotation, variant = 0, n=false, s=false, e=false, w=false }) => {
  const colors = COLORS[era];
  
  const finalRotation = (type === BuildingType.ROAD || type === BuildingType.BRIDGE) ? 0 : rotation;

  return (
    <group position={position} rotation={[0, finalRotation, 0]}>
        {type === BuildingType.ROAD && (
            <Roads era={era} rotation={rotation} n={!!n} s={!!s} e={!!e} w={!!w} />
        )}

        {type === BuildingType.RESIDENTIAL && (
            <Residential variant={variant} era={era} colors={colors} />
        )}

        {type === BuildingType.COMMERCIAL && (
            <Commercial variant={variant} era={era} colors={colors} />
        )}

        {(type === BuildingType.INDUSTRIAL || 
          type === BuildingType.GOLD_MINE || 
          type === BuildingType.SILVER_MINE || 
          type === BuildingType.COAL_MINE) && (
            <Industrial variant={variant} era={era} colors={colors} type={type} />
        )}

        {(type === BuildingType.FOREST || type === BuildingType.FARM) && (
            <Nature type={type} era={era} />
        )}

        {(type === BuildingType.SHERIFF || 
          type === BuildingType.MAYOR || 
          type === BuildingType.HOSPITAL || 
          type === BuildingType.STABLE || 
          type === BuildingType.BLACKSMITH ||
          type === BuildingType.BRIDGE) && (
            <Civic type={type} era={era} />
        )}
    </group>
  );
};

export default React.memo(Building);
