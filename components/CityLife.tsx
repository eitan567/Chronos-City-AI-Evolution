
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BuildingData, Era, TerrainTile, BuildingType } from '../types';
import { VEHICLE_SPEED, PEDESTRIAN_SPEED, TILE_SIZE } from '../constants';

interface CityLifeProps {
  roads: BuildingData[];
  era: Era;
  terrain: TerrainTile[];
}

const BIRD_COUNT = 5;
const VEHICLE_COUNT = 10; 
const PERSON_COUNT = 15;
const ANIMAL_COUNT = 8;

// --- 3D MODELS ---

const AnimalModel: React.FC<{ type: 'BISON' | 'DEER' }> = ({ type }) => {
    const color = type === 'BISON' ? "#3e2723" : "#8d6e63";
    const scale = type === 'BISON' ? 1 : 0.7;

    return (
        <group scale={[scale, scale, scale]}>
            {/* Body */}
            <mesh position={[0, 0.35, 0]} castShadow>
                <boxGeometry args={[0.4, 0.4, 0.7]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Legs */}
            <mesh position={[0.15, 0.1, 0.25]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
            <mesh position={[-0.15, 0.1, 0.25]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
            <mesh position={[0.15, 0.1, -0.25]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
            <mesh position={[-0.15, 0.1, -0.25]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
            {/* Head */}
            <mesh position={[0, 0.6, 0.4]} rotation={[-0.2, 0, 0]} castShadow>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {type === 'BISON' && (
                <mesh position={[0, 0.7, 0.2]} castShadow>
                    <boxGeometry args={[0.35, 0.3, 0.3]} />
                    <meshStandardMaterial color="#211210" />
                </mesh>
            )}
             {type === 'DEER' && (
                <group position={[0, 0.8, 0.4]}>
                     <mesh position={[0.1, 0, 0]} rotation={[0,0,-0.3]}><cylinderGeometry args={[0.02, 0.02, 0.3]} /><meshStandardMaterial color="#d7ccc8" /></mesh>
                     <mesh position={[-0.1, 0, 0]} rotation={[0,0,0.3]}><cylinderGeometry args={[0.02, 0.02, 0.3]} /><meshStandardMaterial color="#d7ccc8" /></mesh>
                </group>
            )}
        </group>
    )
}

const HorseModel: React.FC = () => (
  <group>
    {/* Body */}
    <mesh position={[0, 0.4, 0]} castShadow><boxGeometry args={[0.25, 0.3, 0.6]} /><meshStandardMaterial color="#5d4037" /></mesh>
    {/* Neck/Head */}
    <mesh position={[0, 0.6, 0.35]} rotation={[-0.5, 0, 0]} castShadow><boxGeometry args={[0.15, 0.4, 0.2]} /><meshStandardMaterial color="#5d4037" /></mesh>
    <mesh position={[0, 0.4, -0.3]} rotation={[-0.2, 0, 0]}><boxGeometry args={[0.05, 0.35, 0.05]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
    
    {/* LEGS - Added 4 separate legs */}
    <mesh position={[0.08, 0.15, 0.2]}><boxGeometry args={[0.06, 0.3, 0.06]} /><meshStandardMaterial color="#3e2723" /></mesh>
    <mesh position={[-0.08, 0.15, 0.2]}><boxGeometry args={[0.06, 0.3, 0.06]} /><meshStandardMaterial color="#3e2723" /></mesh>
    <mesh position={[0.08, 0.15, -0.2]}><boxGeometry args={[0.06, 0.3, 0.06]} /><meshStandardMaterial color="#3e2723" /></mesh>
    <mesh position={[-0.08, 0.15, -0.2]}><boxGeometry args={[0.06, 0.3, 0.06]} /><meshStandardMaterial color="#3e2723" /></mesh>
  </group>
);

const CarriageModel: React.FC = () => (
  <group>
      <group position={[0, 0, 0.9]}><HorseModel /></group>
      <mesh position={[0, 0.4, 0.4]}><boxGeometry args={[0.05, 0.05, 0.6]} /><meshStandardMaterial color="#8d6e63" /></mesh>
      <mesh position={[0, 0.6, -0.4]} castShadow><boxGeometry args={[0.6, 0.5, 0.8]} /><meshStandardMaterial color="#5D4037" /></mesh>
      <mesh position={[0, 0.86, -0.4]} castShadow><boxGeometry args={[0.65, 0.05, 0.85]} /><meshStandardMaterial color="#3E2723" /></mesh>
      <mesh position={[0, 0.5, 0.1]} castShadow><boxGeometry args={[0.5, 0.1, 0.3]} /><meshStandardMaterial color="#2c1b18" /></mesh>
      <mesh position={[0.35, 0.3, -0.4]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.08, 12]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
      <mesh position={[-0.35, 0.3, -0.4]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.08, 12]} /><meshStandardMaterial color="#1a1a1a" /></mesh>
  </group>
);

const CarModel: React.FC<{ color: string }> = ({ color }) => (
    <group>
        <mesh position={[0, 0.25, 0]} castShadow><boxGeometry args={[0.6, 0.25, 1.1]} /><meshStandardMaterial color={color} metalness={0.4} roughness={0.5} /></mesh>
        <mesh position={[0, 0.5, -0.1]} castShadow><boxGeometry args={[0.5, 0.25, 0.6]} /><meshStandardMaterial color="#333" /></mesh>
        <mesh position={[0.31, 0.15, 0.3]} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.15, 0.15, 0.1, 16]} /><meshStandardMaterial color="#111" /></mesh>
        <mesh position={[-0.31, 0.15, 0.3]} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.15, 0.15, 0.1, 16]} /><meshStandardMaterial color="#111" /></mesh>
        <mesh position={[0.31, 0.15, -0.3]} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.15, 0.15, 0.1, 16]} /><meshStandardMaterial color="#111" /></mesh>
        <mesh position={[-0.31, 0.15, -0.3]} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.15, 0.15, 0.1, 16]} /><meshStandardMaterial color="#111" /></mesh>
    </group>
);

const HumanModel: React.FC = () => {
    const shirtColor = useMemo(() => ["#e74c3c", "#3498db", "#f1c40f", "#9b59b6", "#2ecc71"][Math.floor(Math.random() * 5)], []);
    return (
        <group>
            <mesh position={[0, 0.35, 0]} castShadow><boxGeometry args={[0.16, 0.3, 0.08]} /><meshStandardMaterial color={shirtColor} /></mesh>
            <mesh position={[0, 0.6, 0]} castShadow><sphereGeometry args={[0.08]} /><meshStandardMaterial color="#f5cba7" /></mesh>
        </group>
    );
};

// --- LOGIC TYPES ---
type RoadNode = { id: string; x: number; z: number; type: BuildingType; neighbors: string[]; };
type RoadMap = Map<string, RoadNode>;
type TrafficRegistry = Map<string, { vehicleId: number; progress: number }[]>;

// --- HELPER ---
// Renamed from getTerrainSurfaceY to getEffectiveHeight to handle Bridge logic and prevent crashes
const getEffectiveHeight = (x: number, z: number, terrain: TerrainTile[], isBridge: boolean) => {
    // Precise Grid Snapping
    const gridX = Math.round(x / TILE_SIZE) * TILE_SIZE;
    const gridZ = Math.round(z / TILE_SIZE) * TILE_SIZE;
    
    const tile = terrain.find(t => t.x === gridX && t.z === gridZ);
    
    if (isBridge) {
        const base = tile ? tile.height - 0.5 : 0;
        return base + 0.2; // Bridge deck height
    }

    if (tile) {
        return tile.height - 0.5; // Terrain surface height
    }
    return 0.5;
};

// --- AGENTS ---

const WildAnimal: React.FC<{ type: 'BISON' | 'DEER', terrain: TerrainTile[] }> = ({ type, terrain }) => {
    const ref = useRef<THREE.Group>(null);
    const isSpawned = useRef(false);
    
    const state = useRef({
        x: (Math.random() - 0.5) * 36,
        z: (Math.random() - 0.5) * 36,
        targetX: (Math.random() - 0.5) * 36,
        targetZ: (Math.random() - 0.5) * 36,
        speed: 0.005 + Math.random() * 0.005,
        idleTime: 0
    });

    useFrame((_, delta) => {
        if (!ref.current) return;
        
        if (!isSpawned.current) isSpawned.current = true;

        const s = state.current;

        if (s.idleTime > 0) {
            s.idleTime -= delta;
            return;
        }

        const dx = s.targetX - s.x;
        const dz = s.targetZ - s.z;
        const dist = Math.sqrt(dx*dx + dz*dz);

        if (dist < 0.5) {
            s.idleTime = 2 + Math.random() * 3;
            s.targetX = (Math.random() - 0.5) * 36;
            s.targetZ = (Math.random() - 0.5) * 36;
        } else {
            const move = s.speed;
            s.x += (dx / dist) * move;
            s.z += (dz / dist) * move;
            
            // Use new helper
            const groundY = getEffectiveHeight(s.x, s.z, terrain, false);
            
            // Check for Water
            const gridX = Math.round(s.x / TILE_SIZE) * TILE_SIZE;
            const gridZ = Math.round(s.z / TILE_SIZE) * TILE_SIZE;
            const tile = terrain.find(t => t.x === gridX && t.z === gridZ);
            
            let sinkOffset = 0;
            if (tile && tile.type === 'WATER') {
                sinkOffset = -0.3;
            }

            const hop = Math.abs(Math.sin(Date.now() * 0.002)) * 0.1;

            ref.current.position.set(s.x, groundY + sinkOffset + hop, s.z);
            ref.current.lookAt(s.targetX, groundY, s.targetZ);
        }
    });

    return (
        <group ref={ref}>
            <AnimalModel type={type} />
        </group>
    )
}

const SmartVehicle: React.FC<{id: number, roadMap: RoadMap, era: Era, registry: React.MutableRefObject<TrafficRegistry>, terrain: TerrainTile[]}> = ({ id, roadMap, era, registry, terrain }) => {
    const ref = useRef<THREE.Group>(null);
    const innerRef = useRef<THREE.Group>(null); // For visual bobbing only
    const isSpawned = useRef(false);

    const state = useRef({ 
        currentId: '', 
        nextId: '', 
        prevId: '', 
        progress: 0, 
        speed: 0, 
        maxSpeed: VEHICLE_SPEED * (0.9 + Math.random() * 0.2), 
        laneOffset: 0.45 + (Math.random() * 0.1 - 0.05), 
        isInitialized: false, 
        stuckTime: 0 
    });

    useEffect(() => () => { if(registry.current.has(state.current.currentId)) { registry.current.set(state.current.currentId, registry.current.get(state.current.currentId)!.filter(v => v.vehicleId !== id)); } }, [id, registry]);
    
    useFrame((_, delta) => {
        if (!ref.current) return;
        const map = roadMap; 
        const agent = state.current; 
        const reg = registry.current;

        if (!agent.isInitialized || !map.has(agent.currentId)) {
            if (!isSpawned.current) {
                 const keys = Array.from(map.keys()); 
                 if (keys.length === 0) return;
                 agent.currentId = keys[Math.floor(Math.random() * keys.length)]; 
                 agent.progress = Math.random(); 
                 agent.isInitialized = true;
                 isSpawned.current = true;
            } else {
                const keys = Array.from(map.keys());
                if (keys.length > 0) {
                     agent.currentId = keys[Math.floor(Math.random() * keys.length)];
                     agent.isInitialized = true;
                }
            }
            return;
        }

        const currentRoad = map.get(agent.currentId); if (!currentRoad) return;
        if (!agent.nextId) { const neighbors = currentRoad.neighbors; if (neighbors.length === 0) { agent.nextId = agent.prevId || agent.currentId; } else { const validNeighbors = neighbors.filter(id => id !== agent.prevId); const candidates = validNeighbors.length > 0 ? validNeighbors : neighbors; agent.nextId = candidates[Math.floor(Math.random() * candidates.length)]; } }
        
        let targetSpeed = agent.maxSpeed; 
        const SAFE_DISTANCE = 0.6; 
        const vehiclesOnRoad = reg.get(agent.currentId) || []; 
        const carInFront = vehiclesOnRoad.find(v => v.vehicleId !== id && v.progress > agent.progress && v.progress - agent.progress < SAFE_DISTANCE);
        if (carInFront) targetSpeed = 0; 
        
        agent.speed = THREE.MathUtils.lerp(agent.speed, targetSpeed, delta * 3);
        
        if (agent.speed < 0.05) { 
            agent.stuckTime += delta; 
            if (agent.stuckTime > 3.0) {
                const keys = Array.from(map.keys());
                agent.currentId = keys[Math.floor(Math.random() * keys.length)];
                agent.progress = Math.random();
                agent.nextId = '';
                agent.stuckTime = 0;
            } 
        } else { 
            agent.stuckTime = 0; 
        }
        
        const moveDist = agent.speed * delta; 
        agent.progress += moveDist / TILE_SIZE;
        
        const currentList = reg.get(agent.currentId) || []; 
        const otherVehicles = currentList.filter(v => v.vehicleId !== id); 
        otherVehicles.push({ vehicleId: id, progress: agent.progress }); 
        reg.set(agent.currentId, otherVehicles);
        
        if (agent.progress >= 1) { 
            reg.set(agent.currentId, reg.get(agent.currentId)!.filter(v => v.vehicleId !== id)); 
            agent.prevId = agent.currentId; 
            agent.currentId = agent.nextId; 
            agent.nextId = ''; 
            agent.progress = 0; 
        }
        
        const nextRoad = map.get(agent.nextId); 
        if (!nextRoad) { agent.nextId = ''; return; }
        
        const p1 = currentRoad; 
        const p2 = nextRoad; 
        const dx = p2.x - p1.x; 
        const dz = p2.z - p1.z; 
        const len = Math.sqrt(dx*dx + dz*dz) || 1;
        const x = p1.x + dx * agent.progress; 
        const z = p1.z + dz * agent.progress;
        
        const rx = (dz/len); 
        const rz = -(dx/len); 
        const finalX = x + rx * agent.laneOffset; 
        const finalZ = z + rz * agent.laneOffset;
        
        const isBridge1 = p1.type === BuildingType.BRIDGE;
        const isBridge2 = p2.type === BuildingType.BRIDGE;
        
        // Calculate HEIGHT with smooth interpolation
        const y1 = getEffectiveHeight(p1.x, p1.z, terrain, isBridge1);
        const y2 = getEffectiveHeight(p2.x, p2.z, terrain, isBridge2);
        const surfaceY = THREE.MathUtils.lerp(y1, y2, agent.progress);
        
        // Offset for road surface
        const roadOffset = era === Era.WILD_WEST ? 0.06 : 0.25;
        const vehicleY = surfaceY + roadOffset;

        ref.current.position.set(finalX, vehicleY, finalZ);
        
        // LookAt Logic (FLAT ROTATION)
        // Look at the destination at the CURRENT vehicle height to prevent Pitch/Roll
        ref.current.lookAt(finalX + dx, vehicleY, finalZ + dz);
        
        // Bobbing animation on INNER group to avoid messing with physics/rotation
        if (innerRef.current) {
             if (era === Era.WILD_WEST && agent.speed > 0.1) { 
                innerRef.current.position.y = Math.sin(Date.now() * 0.015 + id) * 0.03; 
                innerRef.current.rotation.z = Math.sin(Date.now() * 0.005 + id) * 0.02; 
            } else {
                innerRef.current.position.y = 0;
                innerRef.current.rotation.z = 0;
            }
        }
    });

    return (
        <group ref={ref}>
            <group ref={innerRef}>
                {era === Era.WILD_WEST ? <CarriageModel /> : <CarModel color={era === Era.FUTURE ? "#00ffff" : ["white", "silver", "#333", "darkred", "navy"][id % 5]} />}
            </group>
        </group>
    );
};

const SmartPedestrian: React.FC<{ roadMap: RoadMap, terrain: TerrainTile[], era: Era }> = ({ roadMap, terrain, era }) => {
    const ref = useRef<THREE.Group>(null);
    const isSpawned = useRef(false);
    const state = useRef({ currentId: '', nextId: '', progress: 0, speed: PEDESTRIAN_SPEED * (0.8 + Math.random() * 0.4), sideOffset: Math.random() > 0.5 ? 0.85 : -0.85, isInitialized: false });
    
    useFrame((_, delta) => {
        if (!ref.current) return; 
        const map = roadMap; 
        const agent = state.current;
        
        if (!agent.isInitialized || !map.has(agent.currentId)) { 
            if (!isSpawned.current) {
                const keys = Array.from(map.keys()); 
                if (keys.length === 0) return; 
                agent.currentId = keys[Math.floor(Math.random() * keys.length)]; 
                agent.progress = Math.random(); 
                agent.isInitialized = true; 
                isSpawned.current = true;
            }
            return; 
        }
        
        const currentRoad = map.get(agent.currentId); if (!currentRoad) return;
        if (!agent.nextId) { const neighbors = currentRoad.neighbors; if (neighbors.length === 0) return; agent.nextId = neighbors[Math.floor(Math.random() * neighbors.length)]; }
        const nextRoad = map.get(agent.nextId); if (!nextRoad) { agent.nextId = ''; return; }
        
        agent.progress += (agent.speed * delta) / TILE_SIZE;
        if (agent.progress >= 1) { agent.currentId = agent.nextId; agent.nextId = ''; agent.progress = 0; if (Math.random() < 0.2) agent.sideOffset *= -1; }
        
        const dx = nextRoad.x - currentRoad.x; 
        const dz = nextRoad.z - currentRoad.z; 
        const len = Math.sqrt(dx*dx + dz*dz) || 1;
        const x = currentRoad.x + dx * agent.progress; 
        const z = currentRoad.z + dz * agent.progress;
        const rx = (dz / len); 
        const rz = -(dx / len);
        
        const finalX = x + rx * agent.sideOffset;
        const finalZ = z + rz * agent.sideOffset;
        
        // Height Interpolation
        const isBridge1 = currentRoad.type === BuildingType.BRIDGE;
        const isBridge2 = nextRoad.type === BuildingType.BRIDGE;
        const y1 = getEffectiveHeight(currentRoad.x, currentRoad.z, terrain, isBridge1);
        const y2 = getEffectiveHeight(nextRoad.x, nextRoad.z, terrain, isBridge2);
        const surfaceY = THREE.MathUtils.lerp(y1, y2, agent.progress);

        const pedOffset = 0.25;
        const pedestrianY = surfaceY + pedOffset;

        ref.current.position.set(finalX, pedestrianY, finalZ);
        ref.current.lookAt(nextRoad.x + rx * agent.sideOffset, pedestrianY, nextRoad.z + rz * agent.sideOffset); 
        
        ref.current.position.y = pedestrianY + Math.abs(Math.sin(Date.now() * 0.01 * (agent.speed/PEDESTRIAN_SPEED))) * 0.05;
    });
    return <group ref={ref}><HumanModel /></group>;
};

const Bird: React.FC<{ position: THREE.Vector3, speed: number, offset: number }> = ({ position, speed, offset }) => {
    const ref = useRef<THREE.Group>(null);
    useFrame(({ clock }) => { if(ref.current) { const t = clock.getElapsedTime(); ref.current.position.x = position.x + Math.sin(t * speed + offset) * 12; ref.current.position.z = position.z + Math.cos(t * speed + offset) * 8; ref.current.rotation.y = Math.atan2(-Math.cos(t * speed + offset), Math.sin(t * speed + offset)); const wingAngle = Math.sin(t * 12) * 0.5; ref.current.children[0].rotation.z = wingAngle; ref.current.children[1].rotation.z = -wingAngle; } });
    return ( <group ref={ref} position={position}> <mesh position={[0.2,0,0]}><planeGeometry args={[0.4, 0.2]} /><meshBasicMaterial color="#333" side={THREE.DoubleSide} /></mesh> <mesh position={[-0.2,0,0]}><planeGeometry args={[0.4, 0.2]} /><meshBasicMaterial color="#333" side={THREE.DoubleSide} /></mesh> </group> )
}

const CityLife: React.FC<CityLifeProps> = ({ roads, era, terrain }) => {
  const trafficRegistry = useRef<TrafficRegistry>(new Map());

  const roadMap = useMemo(() => {
      const map: RoadMap = new Map();
      trafficRegistry.current.clear();
      roads.forEach(r => { map.set(r.id, { id: r.id, x: r.x, z: r.z, type: r.type, neighbors: [] }); });
      roads.forEach(r => { const node = map.get(r.id); if (!node) return; const potentialNeighbors = roads.filter(n => { if (n.id === r.id) return false; const dx = Math.abs(n.x - r.x); const dz = Math.abs(n.z - r.z); return (dx < 0.1 && Math.abs(dz - TILE_SIZE) < 0.1) || (dz < 0.1 && Math.abs(dx - TILE_SIZE) < 0.1); }); node.neighbors = potentialNeighbors.map(n => n.id); });
      return map;
  }, [roads]);

  const vehicles = useMemo(() => new Array(VEHICLE_COUNT).fill(0).map((_, i) => i), []);
  const pedestrians = useMemo(() => new Array(PERSON_COUNT).fill(0).map((_, i) => i), []);
  const birds = useMemo(() => new Array(BIRD_COUNT).fill(0).map(() => ({ position: new THREE.Vector3((Math.random()-0.5)*30, 12 + Math.random()*4, (Math.random()-0.5)*30), speed: 0.05 + Math.random() * 0.05, offset: Math.random() * 10 })), []);
  const animals = useMemo(() => new Array(ANIMAL_COUNT).fill(0).map((_, i) => ({ id: i, type: Math.random() > 0.5 ? 'BISON' : 'DEER' as 'BISON' | 'DEER' })), []);

  return (
    <group>
        {birds.map((b, i) => <Bird key={i} {...b} />)}
        {animals.map((a) => <WildAnimal key={a.id} type={a.type} terrain={terrain} />)}
        
        {roadMap.size > 0 && (
            <>
                {vehicles.map(i => <SmartVehicle key={i} id={i} roadMap={roadMap} era={era} registry={trafficRegistry} terrain={terrain} />)}
                {pedestrians.map(i => <SmartPedestrian key={i} roadMap={roadMap} terrain={terrain} era={era} />)}
            </>
        )}
    </group>
  );
};

export default CityLife;
