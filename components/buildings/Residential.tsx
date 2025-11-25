
import React from 'react';
import { Era } from '../../types';

const WildWestResidential: React.FC<{ variant: number, colors: any }> = ({ variant, colors }) => {
    switch (variant % 5) {
        case 0: // Classic Cabin
            return (
                <group>
                    <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                        <boxGeometry args={[1.2, 1, 1.0]} />
                        <meshStandardMaterial color="#8b4513" />
                    </mesh>
                    <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
                        <coneGeometry args={[1, 0.6, 4]} />
                        <meshStandardMaterial color="#5d4037" />
                    </mesh>
                    <mesh position={[0, 0.5, 0.51]}>
                        <planeGeometry args={[0.3, 0.6]} />
                        <meshStandardMaterial color="#2e1b0e" />
                    </mesh>
                </group>
            );
        case 1: // Two Story House
            return (
                <group>
                    <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
                        <boxGeometry args={[1.1, 1.5, 1.1]} />
                        <meshStandardMaterial color="#a0522d" />
                    </mesh>
                    <mesh position={[0, 1.7, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
                        <coneGeometry args={[1.0, 0.6, 4]} />
                        <meshStandardMaterial color="#3e2723" />
                    </mesh>
                    <mesh position={[0, 0.8, 0.6]} castShadow>
                        <boxGeometry args={[1.2, 0.1, 0.4]} />
                        <meshStandardMaterial color="#8b4513" />
                    </mesh>
                </group>
            );
        case 2: // T-Shape Shack
            return (
                <group>
                    <mesh position={[0.2, 0.5, 0]} castShadow>
                        <boxGeometry args={[0.8, 1, 1.4]} />
                        <meshStandardMaterial color="#cd853f" />
                    </mesh>
                    <mesh position={[-0.4, 0.4, 0]} castShadow>
                        <boxGeometry args={[0.6, 0.8, 0.8]} />
                        <meshStandardMaterial color="#cd853f" />
                    </mesh>
                    <mesh position={[0.2, 1, 0]} rotation={[0, Math.PI/4, 0]}>
                        <cylinderGeometry args={[0.4, 0.8, 0.5, 4]} />
                        <meshStandardMaterial color="#5d4037" />
                    </mesh>
                </group>
            );
        case 3: // Wide Ranch
            return (
                <group>
                    <mesh position={[0, 0.4, 0]} castShadow>
                        <boxGeometry args={[1.6, 0.8, 1.2]} />
                        <meshStandardMaterial color="#deb887" />
                    </mesh>
                     <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI/4, 0]} castShadow>
                        <coneGeometry args={[1.2, 0.5, 4]} />
                        <meshStandardMaterial color="#8b4513" />
                    </mesh>
                    <mesh position={[0.5, 0.4, 0.61]}>
                        <planeGeometry args={[0.3, 0.5]} />
                        <meshStandardMaterial color="#3e2723" />
                    </mesh>
                </group>
            );
        case 4: // Small Hovel
            return (
                <group>
                    <mesh position={[0, 0.4, 0]} castShadow>
                        <boxGeometry args={[1, 0.8, 1]} />
                        <meshStandardMaterial color="#6d4c41" />
                    </mesh>
                    <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI/4, 0]} castShadow>
                        <cylinderGeometry args={[0, 0.75, 0.6, 4]}/>
                        <meshStandardMaterial color="#4e342e" />
                    </mesh>
                </group>
            );
        default: return null;
    }
};

const ModernResidential: React.FC<{ variant: number, era: Era, colors: any }> = ({ variant, era, colors }) => {
    const isIndustrial = era === Era.INDUSTRIAL;
    const wallColor = isIndustrial ? "#8d6e63" : "#f5f5f5"; // Brick vs White
    const roofColor = isIndustrial ? "#3e2723" : "#34495e";

    switch (variant % 5) {
        case 0: // Suburban House
            return (
                <group>
                    <mesh position={[0, 0.5, 0]} castShadow>
                        <boxGeometry args={[1.2, 1, 1.2]} />
                        <meshStandardMaterial color={wallColor} />
                    </mesh>
                    <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI/4, 0]} castShadow>
                        <coneGeometry args={[1.0, 0.7, 4]} />
                        <meshStandardMaterial color={roofColor} />
                    </mesh>
                    <mesh position={[0, 0.5, 0.61]}>
                        <planeGeometry args={[0.3, 0.7]} />
                        <meshStandardMaterial color="#555" />
                    </mesh>
                </group>
            );
        case 1: // Townhouse (Narrow tall)
            return (
                <group>
                    <mesh position={[-0.3, 1, 0]} castShadow>
                        <boxGeometry args={[0.5, 2, 1.2]} />
                        <meshStandardMaterial color={isIndustrial ? "#795548" : "#e0e0e0"} />
                    </mesh>
                     <mesh position={[0.3, 1, 0]} castShadow>
                        <boxGeometry args={[0.5, 2, 1.2]} />
                        <meshStandardMaterial color={isIndustrial ? "#6d4c41" : "#cfcfcf"} />
                    </mesh>
                     <mesh position={[-0.3, 2.1, 0]} rotation={[0,0,Math.PI/4]} castShadow>
                        <boxGeometry args={[0.4, 0.4, 1.2]} />
                        <meshStandardMaterial color={roofColor} />
                    </mesh>
                     <mesh position={[0.3, 2.1, 0]} rotation={[0,0,Math.PI/4]} castShadow>
                        <boxGeometry args={[0.4, 0.4, 1.2]} />
                        <meshStandardMaterial color={roofColor} />
                    </mesh>
                </group>
            );
        case 2: // Apartment Block
            return (
                <group>
                    <mesh position={[0, 1.2, 0]} castShadow>
                        <boxGeometry args={[1.4, 2.4, 1.4]} />
                        <meshStandardMaterial color={isIndustrial ? "#a1887f" : "#bdc3c7"} />
                    </mesh>
                    {[0.4, 1.2, 2.0].map((y, i) => (
                         <mesh key={i} position={[0, y, 0.71]}>
                             <planeGeometry args={[1, 0.4]} />
                             <meshStandardMaterial color={isIndustrial ? "#333" : "#87ceeb"} />
                         </mesh>
                    ))}
                </group>
            );
        case 3: // L-Shape Modern
            return (
                <group>
                     <mesh position={[0.3, 0.6, -0.3]} castShadow>
                        <boxGeometry args={[1.2, 1.2, 0.8]} />
                        <meshStandardMaterial color={wallColor} />
                    </mesh>
                    <mesh position={[-0.3, 0.6, 0.3]} castShadow>
                        <boxGeometry args={[0.8, 1.2, 1.2]} />
                        <meshStandardMaterial color={wallColor} />
                    </mesh>
                    <mesh position={[0, 1.3, 0]} castShadow>
                         <boxGeometry args={[1.5, 0.1, 1.5]} />
                         <meshStandardMaterial color={roofColor} />
                    </mesh>
                </group>
            );
        case 4: // Duplex / Complex
            return (
                <group>
                    <mesh position={[0, 0.6, 0]} castShadow>
                        <boxGeometry args={[1.6, 1.2, 1.2]} />
                        <meshStandardMaterial color={isIndustrial ? "#8d6e63" : "#ecf0f1"} />
                    </mesh>
                    <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
                         <cylinderGeometry args={[0.7, 0.7, 1.6, 3]} />
                         <meshStandardMaterial color={roofColor} />
                    </mesh>
                    <mesh position={[-0.4, 0.5, 0.61]}>
                        <planeGeometry args={[0.3, 0.6]} />
                        <meshStandardMaterial color="#222" />
                    </mesh>
                    <mesh position={[0.4, 0.5, 0.61]}>
                        <planeGeometry args={[0.3, 0.6]} />
                        <meshStandardMaterial color="#222" />
                    </mesh>
                </group>
            );
        default: return null;
    }
};

interface ResidentialProps {
    variant: number;
    era: Era;
    colors: any;
}

const Residential: React.FC<ResidentialProps> = ({ variant, era, colors }) => {
    if (era === Era.WILD_WEST) {
        return <WildWestResidential variant={variant} colors={colors} />;
    } else {
        return <ModernResidential variant={variant} era={era} colors={colors} />;
    }
};

export default Residential;
