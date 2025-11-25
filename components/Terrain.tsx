
import React from 'react';
import * as THREE from 'three';
import { TerrainTile, Era } from '../types';
import { TILE_SIZE, COLORS } from '../constants';

interface TerrainProps {
    tiles: TerrainTile[];
    era: Era;
    onPointerMove: (e: any) => void;
    onClick: (e: any) => void;
}

const Terrain: React.FC<TerrainProps> = ({ tiles, era, onPointerMove, onClick }) => {
    
    return (
        <group>
            {tiles.map((tile, i) => {
                const x = tile.x;
                const z = tile.z;
                const isWater = tile.type === 'WATER';
                const isHill = tile.type === 'HILL';
                
                let color = era === Era.WILD_WEST ? COLORS.SAND_GROUND : COLORS.GROUND;
                
                // VISIBILITY FIX: If decoration is GRASS, force the ground to be green
                if (!isWater && !isHill && tile.decoration === 'GRASS') {
                    color = "#689f38"; // Distinct grassy green
                } 
                // Color Variation for Ground (only if not grass)
                else if (!isWater && !isHill && tile.colorVariation) {
                     const base = new THREE.Color(color);
                     // Slight shift to reddish/yellowish for earthier look
                     base.offsetHSL(0, 0, (tile.colorVariation - 0.5) * 0.1); 
                     color = "#" + base.getHexString();
                }

                if (isWater) color = COLORS.WATER;
                
                if (isHill) {
                    if (tile.resourceHint === 'GOLD') color = COLORS.HILL_GOLD;
                    else if (tile.resourceHint === 'SILVER') color = COLORS.HILL_SILVER;
                    else if (tile.resourceHint === 'COAL') color = COLORS.HILL_COAL;
                    else color = COLORS.HILL;
                }

                const height = tile.height;
                const posY = height / 2 - 0.5; // Center the box around 0 relative to base

                // Deterministic pseudo-random rotation based on position
                const seed = x * 12.9898 + z * 78.233;
                const rotX = (Math.sin(seed) * 10) % Math.PI;
                const rotY = (Math.cos(seed) * 10) % Math.PI;
                const rotZ = (Math.sin(seed * 2) * 10) % Math.PI;

                return (
                    <group key={i} position={[x, 0, z]}>
                        {/* Main Tile Block */}
                        <mesh 
                            position={[0, posY, 0]} 
                            receiveShadow 
                            castShadow={isHill}
                            onPointerMove={onPointerMove}
                            onClick={onClick}
                            userData={{ type: tile.type }} // Used for logic checks
                        >
                            <boxGeometry args={[TILE_SIZE, height, TILE_SIZE]} />
                            <meshStandardMaterial color={color} roughness={1} />
                        </mesh>

                        {/* Decorations */}
                        {!isWater && tile.decoration === 'ROCK' && (
                             <mesh position={[0, height/2 + 0.15, 0]} castShadow rotation={[rotX, rotY, rotZ]}>
                                <dodecahedronGeometry args={[0.3]} />
                                <meshStandardMaterial color={COLORS.ROCK} />
                            </mesh>
                        )}
                        {!isWater && tile.decoration === 'BUSH' && (
                             <mesh position={[0, height/2 + 0.15, 0]} castShadow>
                                <dodecahedronGeometry args={[0.3]} />
                                <meshStandardMaterial color={era === Era.WILD_WEST ? "#556b2f" : "#228b22"} />
                            </mesh>
                        )}
                        {!isWater && tile.decoration === 'GRASS' && (
                            <group position={[0, height/2, 0]}>
                                <mesh position={[0.4, 0.1, 0.4]} rotation={[0, 0.5, 0]}>
                                    <coneGeometry args={[0.1, 0.2, 3]} />
                                    <meshStandardMaterial color="#8bc34a" />
                                </mesh>
                                 <mesh position={[-0.3, 0.1, -0.2]} rotation={[0, 0.2, 0]}>
                                    <coneGeometry args={[0.1, 0.25, 3]} />
                                    <meshStandardMaterial color="#8bc34a" />
                                </mesh>
                                <mesh position={[0.2, 0.1, -0.3]} rotation={[0, 0.8, 0]}>
                                    <coneGeometry args={[0.15, 0.3, 3]} />
                                    <meshStandardMaterial color="#aed581" />
                                </mesh>
                            </group>
                        )}
                    </group>
                );
            })}
        </group>
    );
};

export default React.memo(Terrain);
