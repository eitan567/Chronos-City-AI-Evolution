
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { v4 as uuidv4 } from 'uuid';
import { Era, GameState, BuildingType, ERA_THRESHOLDS, TerrainTile, BuildingData } from './types';
import { YEARS_PER_SECOND, START_YEAR, BUILDING_INCOME, POPULATION_CAPACITY, GRID_SIZE, TILE_SIZE } from './constants';
import { generateCityEvent } from './services/geminiService';
import GameScene from './components/GameScene';
import UIOverlay from './components/UIOverlay';

// --- TERRAIN GENERATION ---
const generateInitialMap = (): { terrain: TerrainTile[], initialBuildings: BuildingData[] } => {
    const terrain: TerrainTile[] = [];
    const initialBuildings: BuildingData[] = [];
    const halfGrid = GRID_SIZE / 2;

    // 1. Generate Base Grid
    for (let x = -halfGrid; x < halfGrid; x++) {
        for (let z = -halfGrid; z < halfGrid; z++) {
            terrain.push({
                x: x * TILE_SIZE,
                z: z * TILE_SIZE,
                type: 'GROUND',
                decoration: 'NONE',
                height: 1, // Base height
                colorVariation: Math.random() // For slight tint variety
            });
        }
    }

    // 2. Create River (Sinusoidal path)
    const phase = Math.random() * Math.PI;
    terrain.forEach(tile => {
        const normalizedX = tile.x / (GRID_SIZE * TILE_SIZE);
        const riverCenterZ = Math.sin(normalizedX * 4 + phase) * 10;
        if (Math.abs(tile.z - riverCenterZ) < TILE_SIZE * 1.5) {
            tile.type = 'WATER';
            tile.height = 0.5;
        }
    });

    // 3. Create Hills (Clusters)
    const hillCenters = [
        { x: (Math.random()-0.5)*30, z: (Math.random()-0.5)*30, r: 8, resource: 'GOLD' },
        { x: (Math.random()-0.5)*30, z: (Math.random()-0.5)*30, r: 6, resource: 'COAL' },
        { x: (Math.random()-0.5)*30, z: (Math.random()-0.5)*30, r: 6, resource: 'SILVER' }
    ];

    terrain.forEach(tile => {
        if (tile.type === 'WATER') return;
        
        let isHill = false;
        hillCenters.forEach(hill => {
            const dx = tile.x - hill.x;
            const dz = tile.z - hill.z;
            if (Math.sqrt(dx*dx + dz*dz) < hill.r) {
                tile.type = 'HILL';
                tile.height = 2 + Math.random();
                tile.resourceHint = hill.resource as any;
                isHill = true;
            }
        });

        // 4. Decorations & Resources
        const rand = Math.random();
        
        // Mines on Hills
        if (isHill && rand > 0.9) {
            const mineType = tile.resourceHint === 'GOLD' ? BuildingType.GOLD_MINE : (tile.resourceHint === 'SILVER' ? BuildingType.SILVER_MINE : BuildingType.COAL_MINE);
            initialBuildings.push({
                id: uuidv4(),
                type: mineType,
                era: Era.WILD_WEST,
                x: tile.x,
                z: tile.z,
                rotation: Math.random() * Math.PI,
                variant: 0
            });
        }
        // Nature on Ground
        else if (!isHill) {
            if (rand > 0.95) {
                // Scattered Forest Buildings
                 initialBuildings.push({
                    id: uuidv4(),
                    type: BuildingType.FOREST,
                    era: Era.WILD_WEST,
                    x: tile.x,
                    z: tile.z,
                    rotation: Math.random() * Math.PI,
                    variant: Math.floor(Math.random() * 3)
                });
            } else if (rand > 0.90) {
                tile.decoration = 'ROCK';
            } else if (rand > 0.80) {
                tile.decoration = 'BUSH';
            } else if (Math.random() < 0.30) { 
                // 30% Grass Chance
                tile.decoration = 'GRASS';
            }
        }
    });

    return { terrain, initialBuildings };
};

const App: React.FC = () => {
  const { terrain: initialTerrain, initialBuildings } = useMemo(() => generateInitialMap(), []);

  const [gameState, setGameState] = useState<GameState>({
    year: START_YEAR,
    era: Era.WILD_WEST,
    money: 2000,
    population: 20,
    buildings: initialBuildings, // Mines & Trees are pre-placed
    terrain: initialTerrain,
    selectedBuildingType: BuildingType.RESIDENTIAL,
    newsFeed: "ברוכים הבאים למערב הפרוע! התחילו לבנות את העיר שלכם.",
    isLoadingAI: false,
    mission: null
  });

  const lastAITriggerRef = useRef<number>(START_YEAR);
  const lastIncomeRef = useRef<number>(0);

  // Main Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const newYear = prev.year + (YEARS_PER_SECOND / 10); 
        
        const now = Date.now();
        let addedMoney = 0;
        if (now - lastIncomeRef.current > 2000) { 
             prev.buildings.forEach(b => {
                 addedMoney += BUILDING_INCOME[b.type];
             });
             lastIncomeRef.current = now;
        }

        let eraMultiplier = 1;
        if (prev.era === Era.INDUSTRIAL) eraMultiplier = 2;
        if (prev.era === Era.MODERN) eraMultiplier = 5;
        if (prev.era === Era.FUTURE) eraMultiplier = 10;

        let maxCapacity = 50; 
        let jobSlots = 0;
        let attractors = 0;

        prev.buildings.forEach(b => {
            maxCapacity += (POPULATION_CAPACITY[b.type] || 0) * eraMultiplier;
            if ([BuildingType.COMMERCIAL, BuildingType.INDUSTRIAL, BuildingType.BLACKSMITH, BuildingType.STABLE].includes(b.type)) jobSlots += 1;
            if ([BuildingType.MAYOR, BuildingType.SHERIFF, BuildingType.HOSPITAL, BuildingType.FOREST].includes(b.type)) attractors += 1;
        });

        let growthRate = 0.02; 
        growthRate += jobSlots * 0.05; 
        growthRate += attractors * 0.03; 

        let newPop = prev.population;
        if (newPop < maxCapacity) {
            newPop += growthRate;
            if (newPop > maxCapacity) newPop = maxCapacity;
        } else if (newPop > maxCapacity) {
            newPop -= 0.1;
        }

        let updatedMission = prev.mission;
        if (updatedMission && !updatedMission.completed) {
            let isCompleted = false;
            if (updatedMission.targetType === 'POPULATION' && prev.population >= updatedMission.targetValue) isCompleted = true;
            if (updatedMission.targetType === 'MONEY' && prev.money >= updatedMission.targetValue) isCompleted = true;
            if (updatedMission.targetType === 'BUILDING_COUNT' && prev.buildings.length >= updatedMission.targetValue) isCompleted = true;
            if (isCompleted) updatedMission = { ...updatedMission, completed: true };
        }

        return {
          ...prev,
          year: newYear,
          money: prev.money + addedMoney,
          population: newPop,
          mission: updatedMission
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // AI Event Trigger Logic
  useEffect(() => {
    const checkAIEvent = async () => {
        const isMissionComplete = gameState.mission?.completed;
        const timeElapsed = gameState.year - lastAITriggerRef.current >= 5;

        if ((timeElapsed || isMissionComplete) && !gameState.isLoadingAI) {
            lastAITriggerRef.current = gameState.year;
            setGameState(prev => ({ ...prev, isLoadingAI: true }));

            const response = await generateCityEvent(
                gameState.year,
                gameState.era,
                gameState.population,
                gameState.buildings.length,
                gameState.mission
            );

            let nextEra = gameState.era;
            if (response.era === 'FUTURE' || gameState.year >= ERA_THRESHOLDS[Era.FUTURE]) nextEra = Era.FUTURE;
            else if (response.era === 'MODERN' || gameState.year >= ERA_THRESHOLDS[Era.MODERN]) nextEra = Era.MODERN;
            else if (response.era === 'INDUSTRIAL' || gameState.year >= ERA_THRESHOLDS[Era.INDUSTRIAL]) nextEra = Era.INDUSTRIAL;

            let nextMission = gameState.mission;
            if (response.mission) {
                nextMission = {
                    description: response.mission.description,
                    targetType: response.mission.targetType,
                    targetValue: response.mission.targetValue,
                    completed: false
                };
            } else if (isMissionComplete) {
                nextMission = null; 
            }

            setGameState(prev => ({
                ...prev,
                newsFeed: response.newsHeadline,
                population: prev.population + response.populationGrowth,
                money: prev.money + response.moneyBonus,
                era: nextEra,
                mission: nextMission,
                isLoadingAI: false
            }));
        }
    };
    checkAIEvent();
  }, [gameState.year, gameState.mission?.completed]);

  return (
    <div className="relative w-full h-full bg-gray-900 select-none">
      <Canvas shadows camera={{ position: [25, 25, 25], fov: 45 }}>
        <GameScene gameState={gameState} setGameState={setGameState} />
      </Canvas>
      <UIOverlay gameState={gameState} setGameState={setGameState} />
    </div>
  );
};

export default App;
