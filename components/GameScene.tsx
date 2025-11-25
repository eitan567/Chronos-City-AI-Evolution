
import React, { useRef, useState, useMemo } from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Grid, OrbitControls, Stars, Environment } from '@react-three/drei';
import { v4 as uuidv4 } from 'uuid';
import { BuildingType, Era, GameState } from '../types';
import { COLORS, GRID_SIZE, TILE_SIZE, BUILDING_COSTS } from '../constants';
import Building from './Buildings';
import CityLife from './CityLife';
import Terrain from './Terrain';
import * as THREE from 'three';

interface GameSceneProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

// --- CUSTOM LOW POLY CLOUDS ---
const CloudPuff = ({ position, scale }: { position: [number, number, number], scale: number }) => (
    <mesh position={position}>
        <dodecahedronGeometry args={[scale, 0]} />
        <meshStandardMaterial color="white" flatShading transparent opacity={0.7} />
    </mesh>
);

const SingleCloud = ({ position, speed }: { position: [number, number, number], speed: number }) => {
    const group = useRef<THREE.Group>(null);
    
    useFrame((_, delta) => {
        if (group.current) {
            group.current.position.x += speed * delta;
            // Reset position if it goes too far
            if (group.current.position.x > 60) {
                group.current.position.x = -60;
            }
        }
    });

    return (
        <group ref={group} position={position}>
            <CloudPuff position={[0, 0, 0]} scale={1.5} />
            <CloudPuff position={[1.2, -0.2, 0]} scale={1.1} />
            <CloudPuff position={[-1.2, -0.1, 0]} scale={1.2} />
            <CloudPuff position={[0.5, 0.5, 0.5]} scale={0.9} />
            <CloudPuff position={[-0.5, 0.4, -0.5]} scale={1.0} />
        </group>
    );
};

const LowPolyClouds = () => {
    // Generate random clouds
    const clouds = useMemo(() => {
        return new Array(8).fill(0).map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 100, 
                20 + Math.random() * 5, 
                (Math.random() - 0.5) * 60
            ] as [number, number, number],
            speed: 0.5 + Math.random() * 0.5 // Very slow drift
        }));
    }, []);

    return (
        <group>
            {clouds.map((cloud, i) => (
                <SingleCloud key={i} position={cloud.position} speed={cloud.speed} />
            ))}
        </group>
    );
};

const GameScene: React.FC<GameSceneProps> = ({ gameState, setGameState }) => {
  const [hoverPos, setHoverPos] = useState<[number, number, number] | null>(null);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // Snap to grid
    const x = Math.round(e.point.x / TILE_SIZE) * TILE_SIZE;
    const z = Math.round(e.point.z / TILE_SIZE) * TILE_SIZE;
    
    // Boundary check
    const limit = (GRID_SIZE * TILE_SIZE) / 2;
    if (x < -limit || x > limit || z < -limit || z > limit) {
        setHoverPos(null);
        return;
    }
    
    // Find tile height logic
    const tile = gameState.terrain.find(t => Math.abs(t.x - x) < 0.1 && Math.abs(t.z - z) < 0.1);
    const surfaceY = tile ? tile.height - 0.5 : 0;
    
    setHoverPos([x, surfaceY, z]);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!gameState.selectedBuildingType || !hoverPos) return;

    // Prevent building on water logic check
    const tile = gameState.terrain.find(t => Math.abs(t.x - hoverPos[0]) < 0.1 && Math.abs(t.z - hoverPos[2]) < 0.1);
    const isWater = tile?.type === 'WATER';
    const isBridge = gameState.selectedBuildingType === BuildingType.BRIDGE;

    if (isWater && !isBridge) return;
    if (!isWater && isBridge) return; // Bridges only on water

    const cost = BUILDING_COSTS[gameState.selectedBuildingType];
    if (gameState.money < cost) return; 

    const existingBuildingIndex = gameState.buildings.findIndex(
      b => Math.abs(b.x - hoverPos[0]) < 0.1 && Math.abs(b.z - hoverPos[2]) < 0.1
    );

    const isOccupied = existingBuildingIndex !== -1;

    // DEMOLISH LOGIC
    if (gameState.selectedBuildingType === BuildingType.DEMOLISH) {
        if (isOccupied) {
            setGameState(prev => {
                const newBuildings = [...prev.buildings];
                newBuildings.splice(existingBuildingIndex, 1);
                return {
                    ...prev,
                    money: prev.money - cost,
                    buildings: newBuildings,
                    newsFeed: prev.newsFeed.includes("ברוכים") ? "הבנייה החלה!" : prev.newsFeed
                };
            });
        } else if (tile && tile.decoration !== 'NONE') {
             // Clear decorations (Rocks/Bushes/Grass)
             setGameState(prev => {
                 const newTerrain = prev.terrain.map(t => {
                     if (t === tile) return { ...t, decoration: 'NONE' as const };
                     return t;
                 });
                 return {
                     ...prev,
                     money: prev.money - cost,
                     terrain: newTerrain
                 };
             });
        }
        return;
    }

    if (isOccupied) return;

    setGameState(prev => {
         return {
            ...prev,
            money: prev.money - cost,
            buildings: [
                ...prev.buildings,
                {
                id: uuidv4(),
                type: prev.selectedBuildingType!,
                era: prev.era,
                x: hoverPos[0],
                z: hoverPos[2],
                rotation: Math.random() > 0.5 ? 0 : Math.PI / 2,
                variant: Math.floor(Math.random() * 5)
                }
            ],
            newsFeed: prev.newsFeed.includes("ברוכים") ? "הבנייה החלה!" : prev.newsFeed
         };
    });
  };

  const skyColor = useMemo(() => {
     switch(gameState.era) {
         case Era.WILD_WEST: return "#87CEEB";
         case Era.INDUSTRIAL: return "#a89f91";
         case Era.MODERN: return "#6495ed";
         case Era.FUTURE: return "#050510";
         default: return "#87CEEB";
     }
  }, [gameState.era]);

  const roads = useMemo(() => gameState.buildings.filter(b => b.type === BuildingType.ROAD || b.type === BuildingType.BRIDGE), [gameState.buildings]);
  const isDemolishMode = gameState.selectedBuildingType === BuildingType.DEMOLISH;

  // Pass Neighbor info to buildings
  const buildingsWithNeighbors = useMemo(() => {
      return gameState.buildings.map(b => {
          const others = gameState.buildings;
          // Integer-based coordinate checking to avoid floating point errors
          const isAt = (cx: number, cz: number) => others.some(o => o.id !== b.id && Math.round(o.x) === Math.round(cx) && Math.round(o.z) === Math.round(cz));
          
          const hasN = isAt(b.x, b.z - TILE_SIZE);
          const hasS = isAt(b.x, b.z + TILE_SIZE);
          const hasE = isAt(b.x + TILE_SIZE, b.z);
          const hasW = isAt(b.x - TILE_SIZE, b.z);
          
          return { ...b, n: hasN, s: hasS, e: hasE, w: hasW };
      });
  }, [gameState.buildings]);
  
  // --- BUILD CURSOR LOGIC ---
  let cursorColor = "#9e9e9e"; // Neutral/Gray
  let isValid = false;
  let ghostHeight = 0.5; // 50% of tile height

  if (hoverPos && gameState.selectedBuildingType) {
      const tile = gameState.terrain.find(t => Math.abs(t.x - hoverPos[0]) < 0.1 && Math.abs(t.z - hoverPos[2]) < 0.1);
      const existingBuilding = gameState.buildings.find(b => Math.abs(b.x - hoverPos[0]) < 0.1 && Math.abs(b.z - hoverPos[2]) < 0.1);
      const isOccupied = !!existingBuilding;
      const isWater = tile?.type === 'WATER';
      
      if (gameState.selectedBuildingType === BuildingType.ROAD || gameState.selectedBuildingType === BuildingType.BRIDGE) {
          ghostHeight = 0.1;
      }

      if (isDemolishMode) {
          if (isOccupied || (tile && tile.decoration !== 'NONE')) {
              isValid = true;
              cursorColor = "#f44336"; // Red (Destructive but valid action)
          } else {
              isValid = false;
              cursorColor = "#9e9e9e"; // Gray (Nothing to destroy)
          }
      } else if (gameState.selectedBuildingType === BuildingType.BRIDGE) {
           if (isWater && !isOccupied) {
               isValid = true;
               cursorColor = "#4caf50"; // Green
           } else {
               isValid = false;
               cursorColor = "#f44336"; // Red
           }
      } else {
          // Standard buildings
          if (!isWater && !isOccupied) {
               isValid = true;
               cursorColor = "#4caf50"; // Green
          } else {
               isValid = false;
               cursorColor = "#f44336"; // Red
          }
      }
  }

  return (
    <>
      <color attach="background" args={[skyColor]} />
      <ambientLight intensity={gameState.era === Era.FUTURE ? 0.2 : 0.6} />
      <directionalLight position={[50, 50, 25]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
      
      {/* Custom Low Poly Clouds */}
      {gameState.era !== Era.FUTURE && <LowPolyClouds />}
      
      {gameState.era === Era.FUTURE && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
      <Environment preset={gameState.era === Era.FUTURE ? "city" : "park"} />

      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} minDistance={10} maxDistance={60} enableDamping />

      <group>
        <CityLife roads={roads} era={gameState.era} terrain={gameState.terrain} />

        {buildingsWithNeighbors.map(b => {
           // Calculate elevation based on terrain
           const tile = gameState.terrain.find(t => Math.abs(t.x - b.x) < 0.1 && Math.abs(t.z - b.z) < 0.1);
           const surfaceY = tile ? tile.height - 0.5 : 0;

           return (
              <Building 
                key={b.id} 
                type={b.type} 
                era={b.era} 
                position={[b.x, surfaceY, b.z]} 
                rotation={b.rotation} 
                variant={b.variant}
                n={b.n} s={b.s} e={b.e} w={b.w}
              />
           );
        })}

        {/* Render Terrain Grid */}
        <Terrain 
            tiles={gameState.terrain} 
            era={gameState.era} 
            onPointerMove={handlePointerMove} 
            onClick={handleClick}
        />

        {/* Ghost Cursor */}
        {hoverPos && gameState.selectedBuildingType && (
          <mesh position={[hoverPos[0], hoverPos[1] + ghostHeight/2, hoverPos[2]]}>
             <boxGeometry args={[TILE_SIZE - 0.2, ghostHeight, TILE_SIZE - 0.2]} />
             <meshStandardMaterial 
                color={cursorColor} 
                transparent 
                opacity={0.7}
                emissive={cursorColor}
                emissiveIntensity={0.5}
             />
          </mesh>
        )}
      </group>
    </>
  );
};

export default GameScene;
