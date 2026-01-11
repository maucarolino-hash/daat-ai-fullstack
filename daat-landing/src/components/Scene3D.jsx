import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Particles = () => {
    const ref = useRef();

    // Create random particles in a volume (Starfield/Dust)
    const particles = useMemo(() => {
        const count = 2000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Spread particles across a wide volume
            positions[i * 3] = (Math.random() - 0.5) * 20;     // X: -10 to 10
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // Y: -10 to 10
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z: -5 to 5
        }
        return positions;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            // Very slow drift
            ref.current.rotation.y += 0.0005;
            ref.current.rotation.x += 0.0002;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02} // Slightly larger
                color="#a78bfa" // Even lighter violet
                sizeAttenuation
                transparent
                opacity={0.8} // Much brighter
            />
        </points>
    );
};

const Scene3D = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Particles />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default Scene3D;
