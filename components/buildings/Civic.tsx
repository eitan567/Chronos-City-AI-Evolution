
import React from 'react';
import { Era, BuildingType } from '../../types';
import { SmokeParticle } from './Nature';
import { TILE_SIZE } from '../../constants';

interface CivicProps {
    type: BuildingType;
    era: Era;
}

const Civic: React.FC<CivicProps> = ({ type, era }) => {
    
    if (type === BuildingType.SHERIFF) {
        return (
            <group>
                <mesh position={[0, 0.5, 0]} castShadow>
                    <boxGeometry args={[1.4, 1, 1.2]} />
                    <meshStandardMaterial color="#8e44ad" /> 
                </mesh>
                <mesh position={[0, 0.8, 0.61]} rotation={[0,0,Math.PI/5]}>
                    <boxGeometry args={[0.3, 0.3, 0.05]} />
                    <meshStandardMaterial color="gold" />
                </mesh>
                <mesh position={[-0.4, 0.5, 0.62]}>
                    <planeGeometry args={[0.3, 0.3]} />
                    <meshBasicMaterial color="black" />
                </mesh>
                <mesh position={[-0.4, 0.5, 0.63]}>
                     <planeGeometry args={[0.02, 0.3]} />
                     <meshBasicMaterial color="silver" />
                </mesh>
            </group>
        );
    }

    if (type === BuildingType.MAYOR) {
         return (
            <group>
                <mesh position={[0, 0.75, 0]} castShadow>
                    <boxGeometry args={[1.6, 1.5, 1.4]} />
                    <meshStandardMaterial color="#ecf0f1" />
                </mesh>
                <mesh position={[0, 2, 0]} castShadow>
                    <boxGeometry args={[0.5, 1, 0.5]} />
                    <meshStandardMaterial color="#bdc3c7" />
                </mesh>
                 <mesh position={[0, 2.2, 0.26]}>
                    <circleGeometry args={[0.15, 12]} />
                    <meshBasicMaterial color="white" />
                </mesh>
                <mesh position={[0.6, 0.5, 0.8]} castShadow>
                     <cylinderGeometry args={[0.1, 0.1, 1]} />
                     <meshStandardMaterial color="#fff" />
                </mesh>
                <mesh position={[-0.6, 0.5, 0.8]} castShadow>
                     <cylinderGeometry args={[0.1, 0.1, 1]} />
                     <meshStandardMaterial color="#fff" />
                </mesh>
            </group>
        );
    }

    if (type === BuildingType.HOSPITAL) {
         return (
            <group>
                <mesh position={[0, 0.6, 0]} castShadow>
                    <boxGeometry args={[1.5, 1.2, 1.4]} />
                    <meshStandardMaterial color="#fff" />
                </mesh>
                <group position={[0, 1, 0.71]}>
                    <mesh>
                        <boxGeometry args={[0.4, 0.1, 0.02]} />
                        <meshBasicMaterial color="red" />
                    </mesh>
                    <mesh>
                        <boxGeometry args={[0.1, 0.4, 0.02]} />
                        <meshBasicMaterial color="red" />
                    </mesh>
                </group>
            </group>
        );
    }

    if (type === BuildingType.STABLE) {
         return (
            <group>
                <mesh position={[0, 0.5, 0]} castShadow>
                    <boxGeometry args={[1.6, 1, 1.6]} />
                    <meshStandardMaterial color="#795548" />
                </mesh>
                <mesh position={[0, 0.4, 0.81]}>
                    <planeGeometry args={[1.0, 0.8]} />
                    <meshStandardMaterial color="#3e2723" />
                </mesh>
                {era === Era.WILD_WEST && (
                    <mesh position={[0.5, 0.2, 0.9]}>
                         <boxGeometry args={[0.3, 0.3, 0.3]} />
                         <meshStandardMaterial color="#ffd54f" />
                    </mesh>
                )}
            </group>
        );
    }

    if (type === BuildingType.BLACKSMITH) {
        return (
           <group>
               <mesh position={[0, 0.5, 0]} castShadow>
                   <boxGeometry args={[1.4, 1, 1.4]} />
                   <meshStandardMaterial color="#555" />
               </mesh>
                <mesh position={[0, 0.4, 0.71]}>
                    <planeGeometry args={[1.0, 0.6]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
                <mesh position={[0, 0.2, 0.75]}>
                     <boxGeometry args={[0.2, 0.2, 0.1]} />
                     <meshStandardMaterial color="#111" />
                </mesh>
                <SmokeParticle position={[0, 1.2, 0]} />
           </group>
       );
   }

   if (type === BuildingType.BRIDGE) {
        const isModern = era === Era.MODERN || era === Era.FUTURE;
        return (
            <group>
                <mesh position={[0, 0.1, 0]} receiveShadow>
                    <boxGeometry args={[TILE_SIZE, 0.2, TILE_SIZE * 0.8]} />
                    <meshStandardMaterial color={isModern ? "#7f8c8d" : "#8d6e63"} />
                </mesh>
                 <mesh position={[0, 0.5, 0.7]}><boxGeometry args={[TILE_SIZE, 0.4, 0.05]} /><meshStandardMaterial color={isModern ? "#95a5a6" : "#5d4037"} transparent opacity={0.8} /></mesh>
                 <mesh position={[0, 0.5, -0.7]}><boxGeometry args={[TILE_SIZE, 0.4, 0.05]} /><meshStandardMaterial color={isModern ? "#95a5a6" : "#5d4037"} transparent opacity={0.8} /></mesh>
            </group>
        );
    }

    return null;
};

export default Civic;
