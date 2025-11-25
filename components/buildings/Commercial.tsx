
import React from 'react';
import { Era } from '../../types';

const WildWestCommercial: React.FC<{ variant: number, colors: any }> = ({ variant, colors }) => {
    switch (variant % 5) {
        case 0: // Saloon
             return (
                <group>
                    <mesh position={[0, 0.7, 0]} castShadow>
                        <boxGeometry args={[1.4, 1.4, 1.4]} />
                        <meshStandardMaterial color="#cd853f" />
                    </mesh>
                    <mesh position={[0, 1.5, 0.7]} castShadow>
                            <boxGeometry args={[1.4, 0.6, 0.1]} />
                            <meshStandardMaterial color="#8b4513" />
                    </mesh>
                    <mesh position={[0, 0.6, 0.71]}>
                         <planeGeometry args={[0.4, 0.8]} />
                         <meshStandardMaterial color="#222" />
                    </mesh>
                </group>
            );
        case 1: // General Store (A-frame)
            return (
                <group>
                    <mesh position={[0, 0.6, 0]} castShadow>
                        <boxGeometry args={[1.4, 1.2, 1.6]} />
                        <meshStandardMaterial color="#e67e22" />
                    </mesh>
                    <mesh position={[0, 1.4, 0]} rotation={[0, Math.PI/4, 0]} castShadow>
                         <coneGeometry args={[1.3, 0.6, 4]} />
                         <meshStandardMaterial color="#8b0000" />
                    </mesh>
                    <mesh position={[0, 0.5, 0.81]}>
                         <planeGeometry args={[1.4, 0.4]} />
                         <meshStandardMaterial color="#5d4037" />
                    </mesh>
                </group>
            );
        case 2: // Bank (Brick)
             return (
                <group>
                    <mesh position={[0, 0.8, 0]} castShadow>
                        <boxGeometry args={[1.4, 1.6, 1.4]} />
                        <meshStandardMaterial color="#a1887f" />
                    </mesh>
                    <mesh position={[0, 1.7, 0]} castShadow>
                        <boxGeometry args={[1.5, 0.2, 1.5]} />
                        <meshStandardMaterial color="#5d4037" />
                    </mesh>
                    <mesh position={[0.4, 0.8, 0.71]}>
                        <boxGeometry args={[0.2, 1.0, 0.1]} />
                        <meshStandardMaterial color="#fff" />
                    </mesh>
                    <mesh position={[-0.4, 0.8, 0.71]}>
                        <boxGeometry args={[0.2, 1.0, 0.1]} />
                        <meshStandardMaterial color="#fff" />
                    </mesh>
                </group>
            );
        case 3: // Hotel (Tall wooden)
            return (
                <group>
                     <mesh position={[0, 1, 0]} castShadow>
                        <boxGeometry args={[1.4, 2, 1.2]} />
                        <meshStandardMaterial color="#deb887" />
                    </mesh>
                    <mesh position={[0, 1.2, 0.65]}>
                         <boxGeometry args={[1.4, 0.1, 0.4]} />
                         <meshStandardMaterial color="#8b4513" />
                    </mesh>
                     <mesh position={[0, 2.1, 0]} rotation={[0, Math.PI/2, 0]}>
                         <cylinderGeometry args={[0.6, 0.6, 1.4, 3]} />
                         <meshStandardMaterial color="#5d4037" />
                    </mesh>
                </group>
            );
        case 4: // Trading Post (Open)
             return (
                <group>
                    <mesh position={[0, 0.5, 0]} castShadow>
                        <boxGeometry args={[1.6, 1, 1.6]} />
                        <meshStandardMaterial color="#d2b48c" />
                    </mesh>
                    <mesh position={[0.5, 0.4, 0.85]} castShadow>
                         <boxGeometry args={[0.4, 0.4, 0.4]} />
                         <meshStandardMaterial color="#8b4513" />
                    </mesh>
                    <mesh position={[-0.5, 0.4, 0.85]} castShadow>
                         <cylinderGeometry args={[0.2, 0.2, 0.5, 8]} />
                         <meshStandardMaterial color="#8b4513" />
                    </mesh>
                </group>
             );
        default: return null;
    }
};

const ModernCommercial: React.FC<{ variant: number, colors: any }> = ({ variant, colors }) => {
    switch (variant % 5) {
        case 0: // Glass Office
            return (
                <group>
                    <mesh position={[0, 1.5, 0]} castShadow>
                        <boxGeometry args={[1.2, 3, 1.2]} />
                        <meshPhysicalMaterial color="#3498db" metalness={0.6} roughness={0.1} opacity={0.8} transparent />
                    </mesh>
                    <mesh position={[0, 1.5, 0]}>
                        <boxGeometry args={[1.25, 3.05, 1.25]} />
                        <meshBasicMaterial color="white" wireframe />
                    </mesh>
                </group>
            );
        case 1: // Big Box Store
             return (
                <group>
                     <mesh position={[0, 0.75, 0]} castShadow>
                        <boxGeometry args={[1.8, 1.5, 1.8]} />
                        <meshStandardMaterial color="#e74c3c" />
                    </mesh>
                    <mesh position={[0, 1.55, 0]}>
                         <boxGeometry args={[1.9, 0.1, 1.9]} />
                         <meshStandardMaterial color="#fff" />
                    </mesh>
                    <mesh position={[0, 0.5, 0.91]}>
                        <planeGeometry args={[1.0, 0.8]} />
                        <meshStandardMaterial color="#ecf0f1" />
                    </mesh>
                </group>
            );
        case 2: // Corner Shop
            return (
                 <group>
                    <mesh position={[0, 0.75, 0]} castShadow>
                        <boxGeometry args={[1.5, 1.5, 1.5]} />
                        <meshStandardMaterial color="#f1c40f" />
                    </mesh>
                    {/* Awning */}
                     <mesh position={[0, 0.9, 0.8]} rotation={[0.4, 0, 0]}>
                        <boxGeometry args={[1.6, 0.1, 0.5]} />
                        <meshStandardMaterial color="#c0392b" />
                    </mesh>
                 </group>
            );
        case 3: // Tech Hub
             return (
               <group>
                   <mesh position={[0, 1, 0]} castShadow>
                       <cylinderGeometry args={[0.8, 0.8, 2, 8]} />
                       <meshPhysicalMaterial color="#9b59b6" metalness={0.5} roughness={0.3} />
                   </mesh>
                   <mesh position={[0, 2, 0]}>
                       <sphereGeometry args={[0.5]} />
                       <meshPhysicalMaterial color="#8e44ad" wireframe />
                   </mesh>
               </group>
             );
        case 4: // Modern Hotel
             return (
                <group>
                    <mesh position={[0, 1.8, 0]} castShadow>
                        <boxGeometry args={[1.0, 3.6, 1.0]} />
                        <meshStandardMaterial color="#34495e" />
                    </mesh>
                    <mesh position={[0, 0.5, 0]} castShadow>
                        <boxGeometry args={[1.6, 1.0, 1.6]} />
                        <meshStandardMaterial color="#2c3e50" />
                    </mesh>
                </group>
             );
        default: return null;
    }
};

interface CommercialProps {
    variant: number;
    era: Era;
    colors: any;
}

const Commercial: React.FC<CommercialProps> = ({ variant, era, colors }) => {
    if (era === Era.WILD_WEST) {
        return <WildWestCommercial variant={variant} colors={colors} />;
    } else {
        return <ModernCommercial variant={variant} colors={colors} />;
    }
};

export default Commercial;
