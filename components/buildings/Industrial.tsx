
import React from 'react';
import { Era, BuildingType } from '../../types';
import { SmokeParticle } from './Nature';

interface IndustrialProps {
    variant: number;
    era: Era;
    colors: any;
    type?: BuildingType;
}

const Industrial: React.FC<IndustrialProps> = ({ variant, era, colors, type }) => {
    
    // MINE MODELS
    if (type === BuildingType.GOLD_MINE) {
        return (
            <group>
                 <mesh position={[0, 0.3, 0]} castShadow>
                    <coneGeometry args={[0.8, 0.6, 6]} />
                    <meshStandardMaterial color="#8d6e63" />
                </mesh>
                <mesh position={[0.3, 0.4, 0.3]} castShadow>
                    <dodecahedronGeometry args={[0.25]} />
                    <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[-0.2, 0.3, -0.2]} castShadow>
                    <dodecahedronGeometry args={[0.2]} />
                    <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.6, 0]} castShadow>
                     <boxGeometry args={[0.4, 0.8, 0.4]} />
                     <meshStandardMaterial color="#5d4037" />
                </mesh>
            </group>
        );
    }
    
    if (type === BuildingType.SILVER_MINE) {
        return (
             <group>
                 <mesh position={[0, 0.3, 0]} castShadow>
                    <coneGeometry args={[0.8, 0.6, 6]} />
                    <meshStandardMaterial color="#7f8c8d" />
                </mesh>
                <mesh position={[0.3, 0.4, 0.3]} castShadow>
                    <dodecahedronGeometry args={[0.25]} />
                    <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
                </mesh>
                 <mesh position={[0, 0.6, 0]} castShadow>
                     <boxGeometry args={[0.4, 0.8, 0.4]} />
                     <meshStandardMaterial color="#333" />
                </mesh>
            </group>
        );
    }

    if (type === BuildingType.COAL_MINE) {
        return (
             <group>
                 <mesh position={[0, 0.3, 0]} castShadow>
                    <coneGeometry args={[0.9, 0.6, 5]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
                <mesh position={[0.3, 0.3, 0.3]} castShadow>
                    <dodecahedronGeometry args={[0.2]} />
                    <meshStandardMaterial color="#000" roughness={0.8} />
                </mesh>
                <mesh position={[-0.3, 0.2, -0.3]} castShadow>
                    <dodecahedronGeometry args={[0.25]} />
                    <meshStandardMaterial color="#000" roughness={0.8} />
                </mesh>
                 <mesh position={[0, 0.6, 0]} castShadow>
                     <boxGeometry args={[0.5, 0.5, 0.5]} />
                     <meshStandardMaterial color="#5d4037" />
                </mesh>
                <SmokeParticle position={[0, 1, 0]} />
            </group>
        );
    }

    // STANDARD INDUSTRY
    switch (variant % 5) {
        case 0: // Classic Factory
            return (
                <group>
                    <mesh position={[0, 0.6, 0]} castShadow>
                        <boxGeometry args={[1.8, 1.2, 1.4]} />
                        <meshStandardMaterial color={colors.INDUSTRIAL} />
                    </mesh>
                     <mesh position={[0.5, 1.5, 0.4]} castShadow>
                        <cylinderGeometry args={[0.15, 0.2, 1.5]} />
                        <meshStandardMaterial color="#222" />
                    </mesh>
                    <SmokeParticle position={[0.5, 2.3, 0.4]} />
                </group>
            );
        case 1: // Warehouse
            return (
                <group>
                    <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI/6, Math.PI/2]} castShadow>
                        <cylinderGeometry args={[1, 1, 1, 3]} />
                        <meshStandardMaterial color="#7f8c8d" />
                    </mesh>
                    <mesh position={[0, 0.5, 0]}>
                         <boxGeometry args={[1.8, 0.8, 1.2]} />
                         <meshStandardMaterial color="#95a5a6" />
                    </mesh>
                </group>
            );
        case 2: // Tanks
            return (
                <group>
                    <mesh position={[-0.4, 0.7, 0]} castShadow>
                        <cylinderGeometry args={[0.4, 0.4, 1.4, 12]} />
                        <meshStandardMaterial color="#555" />
                    </mesh>
                    <mesh position={[0.4, 0.7, 0]} castShadow>
                        <cylinderGeometry args={[0.4, 0.4, 1.4, 12]} />
                        <meshStandardMaterial color="#555" />
                    </mesh>
                    <mesh position={[0, 0.2, 0]} castShadow>
                        <boxGeometry args={[1.6, 0.4, 1]} />
                        <meshStandardMaterial color="#333" />
                    </mesh>
                </group>
            );
        case 3: // Smelter / Power
             return (
                <group>
                     <mesh position={[0, 0.5, 0]} castShadow>
                        <boxGeometry args={[1.4, 1, 1.4]} />
                        <meshStandardMaterial color="#444" />
                    </mesh>
                    <mesh position={[-0.4, 1.2, -0.4]} castShadow>
                        <cylinderGeometry args={[0.1, 0.2, 1.5]} />
                         <meshStandardMaterial color="#222" />
                    </mesh>
                     <mesh position={[0.4, 1.2, 0.4]} castShadow>
                        <cylinderGeometry args={[0.1, 0.2, 1.5]} />
                         <meshStandardMaterial color="#222" />
                    </mesh>
                     <SmokeParticle position={[-0.4, 2, -0.4]} />
                     <SmokeParticle position={[0.4, 2, 0.4]} />
                </group>
             );
        case 4: // Lumber / Shipping
             return (
                <group>
                     <mesh position={[0, 0.1, 0]}>
                        <planeGeometry args={[1.8, 1.8]} />
                         <meshStandardMaterial color="#5d4037" />
                    </mesh>
                    <mesh position={[-0.5, 0.3, -0.5]} castShadow>
                        <boxGeometry args={[0.5, 0.6, 0.8]} />
                        <meshStandardMaterial color="#d35400" />
                    </mesh>
                     <mesh position={[0.5, 0.3, 0.5]} castShadow>
                        <boxGeometry args={[0.5, 0.6, 0.8]} />
                        <meshStandardMaterial color="#c0392b" />
                    </mesh>
                    <mesh position={[0, 0.6, 0]} castShadow>
                        <boxGeometry args={[0.6, 0.6, 0.6]} />
                        <meshStandardMaterial color="#f39c12" />
                    </mesh>
                </group>
             );
        default: return null;
    }
};

export default Industrial;
