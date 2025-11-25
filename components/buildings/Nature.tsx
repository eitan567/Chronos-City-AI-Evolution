
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Era, BuildingType } from '../../types';

export const SmokeParticle = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null);
  const speed = Math.random() * 0.01 + 0.005; 
  const offset = Math.random() * 100;

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() + offset;
      ref.current.position.y += speed;
      ref.current.position.x += Math.sin(t * 1.5) * 0.005;
      ref.current.scale.setScalar(1 + Math.sin(t) * 0.2);
      if (ref.current.position.y > 3) {
        ref.current.position.y = 1.5;
        (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.4;
      }
      (ref.current.material as THREE.MeshBasicMaterial).opacity -= 0.001;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshBasicMaterial color="#cccccc" transparent opacity={0.4} />
    </mesh>
  );
};

const TreeGroup: React.FC<{ era: Era }> = ({ era }) => {
    const treeCount = 3;
    const trees = useMemo(() => {
        return new Array(treeCount).fill(0).map((_, i) => ({
            x: (Math.random() - 0.5) * 1.2,
            z: (Math.random() - 0.5) * 1.2,
            scale: 0.8 + Math.random() * 0.5,
            type: Math.floor(Math.random() * 2)
        }));
    }, []);

    return (
        <group>
            {trees.map((t, i) => (
                <group key={i} position={[t.x, 0, t.z]} scale={[t.scale, t.scale, t.scale]}>
                     {/* Trunk */}
                    <mesh position={[0, 0.3, 0]} castShadow>
                        <cylinderGeometry args={[0.1, 0.15, 0.6]} />
                        <meshStandardMaterial color="#5d4037" />
                    </mesh>
                    {/* Leaves */}
                    {era === Era.WILD_WEST || era === Era.INDUSTRIAL ? (
                        // Pine/Classic Tree
                        <mesh position={[0, 0.9, 0]} castShadow>
                            <coneGeometry args={[0.5, 1.2, 8]} />
                            <meshStandardMaterial color="#2d5a27" />
                        </mesh>
                    ) : (
                        // Modern Round Tree
                         <mesh position={[0, 0.9, 0]} castShadow>
                            <dodecahedronGeometry args={[0.5]} />
                            <meshStandardMaterial color="#4caf50" />
                        </mesh>
                    )}
                </group>
            ))}
        </group>
    )
}

interface NatureProps {
    type: BuildingType;
    era: Era;
}

const Nature: React.FC<NatureProps> = ({ type, era }) => {
    if (type === BuildingType.FOREST) {
        return <TreeGroup era={era} />;
    }

    if (type === BuildingType.FARM) {
        return (
            <group>
                {/* Soil */}
                <mesh position={[0, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
                    <planeGeometry args={[1.8, 1.8]} />
                    <meshStandardMaterial color="#5d4037" />
                </mesh>
                {/* Crops */}
                {[...Array(4)].map((_, r) => (
                    <group key={r} position={[-0.6 + r * 0.4, 0, 0]}>
                         {[...Array(5)].map((_, c) => (
                            <mesh key={c} position={[0, 0.2, -0.6 + c * 0.3]} castShadow>
                                <sphereGeometry args={[0.12, 6, 6]} />
                                <meshStandardMaterial color={era === Era.FUTURE ? "#00ff00" : "#8bc34a"} />
                            </mesh>
                         ))}
                    </group>
                ))}
                {/* Fence */}
                {era === Era.WILD_WEST && (
                    <mesh position={[0.9, 0.25, 0]}>
                         <boxGeometry args={[0.05, 0.5, 1.8]} />
                         <meshStandardMaterial color="#8d6e63" />
                    </mesh>
                )}
            </group>
        );
    }

    return null;
};

export default Nature;
