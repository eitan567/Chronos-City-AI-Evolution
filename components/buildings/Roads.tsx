
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Era } from '../../types';
import { COLORS, TILE_SIZE } from '../../constants';

const ROAD_W = 1.4; // Road Width (out of 2.0)
const HALF_RW = ROAD_W / 2; // 0.7
const TILE_H = 1.0; // Half Tile Size
const HALF_PI = Math.PI / 2;

// Helper to create dash positions along a curve
const getCurvedDashes = (cx: number, cy: number, r: number, startAngle: number, endAngle: number, count: number) => {
    const ops = [];
    const totalAngle = endAngle - startAngle;
    for (let i = 0; i <= count; i++) {
        const t = i / count;
        const angle = startAngle + t * totalAngle;
        ops.push({
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r,
            rot: angle + HALF_PI, // Tangent
            len: 0.3
        });
    }
    return ops;
};

// Helper to generate zebra stripe positions for a specific arm
const getCrosswalk = (offsetX: number, offsetY: number, rot: number) => {
    // Create 5 stripes
    const stripes = [];
    for(let i = -2; i <= 2; i++) {
        stripes.push({
            x: offsetX + (Math.abs(Math.cos(rot)) < 0.1 ? i * 0.15 : 0),
            y: offsetY + (Math.abs(Math.sin(rot)) < 0.1 ? 0 : i * 0.15),
            rot: rot,
            len: 0.3 
        });
    }
    return stripes;
}

const getRoadGeometry = (n: boolean, s: boolean, e: boolean, w: boolean): { shape: THREE.Shape, markings: any[], crosswalks: any[] } => {
    const shape = new THREE.Shape();
    const markings: any[] = [];
    const crosswalks: any[] = [];
    
    const count = (n?1:0) + (s?1:0) + (e?1:0) + (w?1:0);
    const rw = HALF_RW;
    const th = TILE_H;

    // 0. ISOLATED (Square)
    if (count === 0) {
        shape.moveTo(-rw, rw);
        shape.lineTo(rw, rw);
        shape.lineTo(rw, -rw);
        shape.lineTo(-rw, -rw);
        shape.closePath();
    }
    // 1. DEAD ENDS
    else if (count === 1) {
        if (n) {
            shape.moveTo(-rw, th);
            shape.lineTo(rw, th);
            shape.lineTo(rw, -0.2); // Stop short
            shape.lineTo(-rw, -0.2);
            shape.closePath();
            markings.push({ x: 0, y: 0.4, rot: HALF_PI, len: 0.6 });
        } else if (s) {
            shape.moveTo(-rw, 0.2);
            shape.lineTo(rw, 0.2);
            shape.lineTo(rw, -th);
            shape.lineTo(-rw, -th);
            shape.closePath();
            markings.push({ x: 0, y: -0.4, rot: HALF_PI, len: 0.6 });
        } else if (e) {
            shape.moveTo(-0.2, rw);
            shape.lineTo(th, rw);
            shape.lineTo(th, -rw);
            shape.lineTo(-0.2, -rw);
            shape.closePath();
            markings.push({ x: 0.4, y: 0, rot: 0, len: 0.6 });
        } else if (w) {
            shape.moveTo(-th, rw);
            shape.lineTo(0.2, rw);
            shape.lineTo(0.2, -rw);
            shape.lineTo(-th, -rw);
            shape.closePath();
            markings.push({ x: -0.4, y: 0, rot: 0, len: 0.6 });
        }
    }
    // 2. STRAIGHT
    else if (count === 2 && ((n && s) || (e && w))) {
        if (n && s) {
            shape.moveTo(-rw, th);
            shape.lineTo(rw, th);
            shape.lineTo(rw, -th);
            shape.lineTo(-rw, -th);
            shape.closePath();
            markings.push({ x: 0, y: 0, rot: HALF_PI, len: 1.4 });
        } else {
            shape.moveTo(-th, rw);
            shape.lineTo(th, rw);
            shape.lineTo(th, -rw);
            shape.lineTo(-th, -rw);
            shape.closePath();
            markings.push({ x: 0, y: 0, rot: 0, len: 1.4 });
        }
    }
    // 3. CORNERS (Curved)
    else if (count === 2) {
        if (n && e) {
            shape.moveTo(-rw, th); // N-Left
            shape.quadraticCurveTo(-rw, -rw, th, -rw); // Curve Outer to E-Bottom
            shape.lineTo(th, rw); // E-Top
            shape.quadraticCurveTo(rw, rw, rw, th); // Inner Curve to N-Right
            shape.closePath();
            
            markings.push({ x: 0, y: 0, rot: -Math.PI/4, len: 0.3 });
            markings.push({ x: -0.1, y: 0.5, rot: HALF_PI, len: 0.3 });
            markings.push({ x: 0.5, y: -0.1, rot: 0, len: 0.3 });

        } else if (n && w) {
            shape.moveTo(-th, -rw); // W-Bottom
            shape.quadraticCurveTo(rw, -rw, rw, th); // Curve Outer to N-Right
            shape.lineTo(-rw, th); // N-Left
            shape.quadraticCurveTo(-rw, rw, -th, rw); // Inner curve to W-Top
            shape.closePath();
             markings.push({ x: 0, y: 0, rot: Math.PI/4, len: 0.3 });
             markings.push({ x: 0.1, y: 0.5, rot: HALF_PI, len: 0.3 });
             markings.push({ x: -0.5, y: -0.1, rot: 0, len: 0.3 });

        } else if (s && e) {
            shape.moveTo(th, -rw); // E-Bottom
            shape.quadraticCurveTo(-rw, rw, th, rw); // Curve to E-Top -- wait check prev logic
            // Correct S+E Outer sweep: S-Left to E-Top
            shape.moveTo(-rw, -th); // S-Left
            shape.quadraticCurveTo(-rw, rw, th, rw); // Curve to E-Top
            shape.lineTo(th, -rw); // E-Bottom
            shape.quadraticCurveTo(rw, -rw, rw, -th); // Inner to S-Right
            shape.closePath();
            
             markings.push({ x: 0, y: 0, rot: Math.PI/4, len: 0.3 });
             markings.push({ x: -0.1, y: -0.5, rot: HALF_PI, len: 0.3 });
             markings.push({ x: 0.5, y: 0.1, rot: 0, len: 0.3 });

        } else if (s && w) {
            shape.moveTo(rw, -th); // S-Right
            shape.quadraticCurveTo(rw, rw, -th, rw); // Outer to W-Top
            shape.lineTo(-th, -rw); // W-Bottom
            shape.quadraticCurveTo(-rw, -rw, -rw, -th); // Inner to S-Left
            shape.closePath();
            
             markings.push({ x: 0, y: 0, rot: -Math.PI/4, len: 0.3 });
             markings.push({ x: 0.1, y: -0.5, rot: HALF_PI, len: 0.3 });
             markings.push({ x: -0.5, y: 0.1, rot: 0, len: 0.3 });
        }
    }
    // 4. T-JUNCTIONS (Smooth Fillets) + CROSSWALKS
    else if (count === 3) {
        if (!s) { // T pointing North (Arms: W, N, E) -> Bottom edge (South) is straight W-E
            shape.moveTo(-th, -rw); // W-Bottom
            shape.lineTo(-th, rw); // W-Top
            shape.quadraticCurveTo(-rw, rw, -rw, th); // Fillet to N-Left
            shape.lineTo(rw, th); // N-Right
            shape.quadraticCurveTo(rw, rw, th, rw); // Fillet to E-Top
            shape.lineTo(th, -rw); // E-Bottom
            shape.lineTo(-th, -rw); // Close straight bottom
            shape.closePath();
            
            markings.push({ x: 0, y: 0, rot: 0, len: 1.6 }); // W-E line
            // Crosswalks
            crosswalks.push(...getCrosswalk(-0.8, 0, 0)); // W
            crosswalks.push(...getCrosswalk(0.8, 0, 0)); // E
            crosswalks.push(...getCrosswalk(0, 0.8, HALF_PI)); // N
        } 
        else if (!n) { // T pointing South (Arms: W, S, E) -> Top edge (North) is straight W-E
            shape.moveTo(-th, rw); // W-Top
            shape.lineTo(th, rw); // E-Top
            shape.lineTo(th, -rw); // E-Bottom
            shape.quadraticCurveTo(rw, -rw, rw, -th); // Fillet to S-Right
            shape.lineTo(-rw, -th); // S-Left
            shape.quadraticCurveTo(-rw, -rw, -th, -rw); // Fillet to W-Bottom
            shape.closePath();
            
            markings.push({ x: 0, y: 0, rot: 0, len: 1.6 }); // W-E line
            // Crosswalks
            crosswalks.push(...getCrosswalk(-0.8, 0, 0)); // W
            crosswalks.push(...getCrosswalk(0.8, 0, 0)); // E
            crosswalks.push(...getCrosswalk(0, -0.8, HALF_PI)); // S
        }
        else if (!w) { // T pointing East (Arms: N, E, S) -> Left edge (West) is straight N-S
            shape.moveTo(-rw, th); // N-Left
            shape.lineTo(rw, th); // N-Right
            shape.quadraticCurveTo(rw, rw, th, rw); // Fillet to E-Top
            shape.lineTo(th, -rw); // E-Bottom
            shape.quadraticCurveTo(rw, -rw, rw, -th); // Fillet to S-Right
            shape.lineTo(-rw, -th); // S-Left
            shape.lineTo(-rw, th); // Close straight left
            shape.closePath();
            
            markings.push({ x: 0, y: 0, rot: HALF_PI, len: 1.6 }); // N-S line
            // Crosswalks
            crosswalks.push(...getCrosswalk(0, 0.8, HALF_PI)); // N
            crosswalks.push(...getCrosswalk(0, -0.8, HALF_PI)); // S
            crosswalks.push(...getCrosswalk(0.8, 0, 0)); // E
        }
        else if (!e) { // T pointing West (Arms: N, W, S) -> Right edge (East) is straight N-S
            shape.moveTo(rw, -th); // S-Right
            shape.lineTo(rw, th); // N-Right
            shape.lineTo(-rw, th); // N-Left
            shape.quadraticCurveTo(-rw, rw, -th, rw); // Fillet to W-Top
            shape.lineTo(-th, -rw); // W-Bottom
            shape.quadraticCurveTo(-rw, -rw, -rw, -th); // Fillet to S-Left
            shape.closePath();
            
            markings.push({ x: 0, y: 0, rot: HALF_PI, len: 1.6 }); // N-S line
             // Crosswalks
            crosswalks.push(...getCrosswalk(0, 0.8, HALF_PI)); // N
            crosswalks.push(...getCrosswalk(0, -0.8, HALF_PI)); // S
            crosswalks.push(...getCrosswalk(-0.8, 0, 0)); // W
        }
    }
    // 5. CROSSROADS + CROSSWALKS
    else if (count === 4) {
        shape.moveTo(-th, rw); // W-Top
        shape.quadraticCurveTo(-rw, rw, -rw, th); // Fillet to N-Left
        shape.lineTo(rw, th); // N-Right
        shape.quadraticCurveTo(rw, rw, th, rw); // Fillet to E-Top
        shape.lineTo(th, -rw); // E-Bot
        shape.quadraticCurveTo(rw, -rw, rw, -th); // Fillet to S-Right
        shape.lineTo(-rw, -th); // S-Left
        shape.quadraticCurveTo(-rw, -rw, -th, -rw); // Fillet to W-Bottom
        shape.closePath();
        
        // Crosswalks on all 4 sides
        crosswalks.push(...getCrosswalk(0, 0.8, HALF_PI)); // N
        crosswalks.push(...getCrosswalk(0, -0.8, HALF_PI)); // S
        crosswalks.push(...getCrosswalk(0.8, 0, 0)); // E
        crosswalks.push(...getCrosswalk(-0.8, 0, 0)); // W
    }

    return { shape, markings, crosswalks };
}

interface RoadsProps {
    era: Era;
    rotation: number;
    n: boolean;
    s: boolean;
    e: boolean;
    w: boolean;
}

const Roads: React.FC<RoadsProps> = ({ era, rotation, n, s, e, w }) => {
    const colors = COLORS[era];
    const { shape, markings, crosswalks } = useMemo(() => getRoadGeometry(n, s, e, w), [n, s, e, w]);

    const roadColor = era === Era.WILD_WEST ? "#5d4037" : "#34495e"; 
    const sidewalkColor = era === Era.WILD_WEST ? "#8d6e63" : "#95a5a6";
    const lineColor = era === Era.WILD_WEST ? "#d7ccc8" : "#ecf0f1";
    const extrudeSettings = { depth: 0.05, bevelEnabled: false };

    return (
        <group>
            {/* 1. SIDEWALK BASE (Solid Block) */}
            <mesh position={[0, 0.1, 0]} receiveShadow>
                <boxGeometry args={[TILE_SIZE, 0.25, TILE_SIZE]} />
                <meshStandardMaterial color={sidewalkColor} />
            </mesh>

            {/* 2. ASPHALT LAYER (Extruded Shape) */}
            <mesh position={[0, 0.23, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshStandardMaterial color={roadColor} />
            </mesh>

            {/* 3. LANE MARKINGS (Boxes) */}
            {markings.map((op, i) => (
                <mesh key={i} position={[op.x, 0.29, op.y]} rotation={[0, -op.rot, 0]}> 
                    <boxGeometry args={[op.len, 0.02, 0.1]} />
                    <meshBasicMaterial color={lineColor} />
                </mesh>
            ))}

            {/* 4. CROSSWALKS (Zebra Stripes) */}
            {crosswalks.map((cw, i) => (
                <mesh key={`cw-${i}`} position={[cw.x, 0.29, cw.y]} rotation={[0, -cw.rot, 0]}>
                    <boxGeometry args={[0.08, 0.02, 0.4]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>
            ))}

            {(era === Era.MODERN || era === Era.FUTURE) && (
                <mesh rotation={[-Math.PI / 2, 0, rotation]} position={[0, 0.03, 0]}>
                    <planeGeometry args={[0.2, 1.2]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
            )}
        </group>
    );
};

export default Roads;
