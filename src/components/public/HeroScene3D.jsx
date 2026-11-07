import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// ─── CAMERA RIG WITH SMOOTH MOUSE PARALLAX ───
const CameraRig = ({ mouseRef, isMobile, shouldReduceMotion }) => {
    const lookAtTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);
    const currentLookAt = useMemo(() => new THREE.Vector3(0, 0, 0), []);

    useFrame((state) => {
        if (shouldReduceMotion) {
            state.camera.position.set(0, 0, isMobile ? 9.5 : 8);
            state.camera.lookAt(0, 0, 0);
            return;
        }

        const mx = mouseRef?.current?.x || 0;
        const my = mouseRef?.current?.y || 0;

        const targetX = mx * 0.35;
        const targetY = my * 0.25;
        const targetZ = isMobile ? 9.5 : 8;

        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);

        lookAtTarget.set(mx * 0.2, my * 0.15, 0);
        currentLookAt.lerp(lookAtTarget, 0.05);
        state.camera.lookAt(currentLookAt);
    });

    return null;
};

// ─── 3D ORBIT RING AROUND PORTRAIT ───
const OrbitRingSystem = ({ isMobile, shouldReduceMotion }) => {
    const mainRingRef = useRef();
    const haloRingRef = useRef();
    const sparksRef = useRef();

    // Position center of orbit around the portrait location
    // Desktop: x = 2.3, y = -0.3, z = -0.1
    // Mobile: x = 0, y = -0.1, z = -0.6
    const centerPos = useMemo(() => (isMobile ? [0, -0.1, -0.6] : [2.3, -0.3, -0.1]), [isMobile]);

    // Spark nodes circling the orbit
    const sparkCount = 8;
    const sparkAngles = useMemo(() => {
        return Array.from({ length: sparkCount }, (_, i) => (i / sparkCount) * Math.PI * 2);
    }, [sparkCount]);

    const sparkDummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (mainRingRef.current) {
            mainRingRef.current.rotation.x = 0.65;
            mainRingRef.current.rotation.y = 0.25 + (shouldReduceMotion ? 0 : time * 0.06);
            mainRingRef.current.rotation.z = -0.2;

            const baseScale = isMobile ? 0.75 : 1;
            const pulseScale = baseScale * (1 + Math.sin(time * 1.5) * 0.02);
            mainRingRef.current.scale.set(pulseScale, pulseScale, pulseScale);
        }

        if (haloRingRef.current) {
            haloRingRef.current.rotation.x = -0.55;
            haloRingRef.current.rotation.y = -0.3 + (shouldReduceMotion ? 0 : time * 0.09);
            haloRingRef.current.rotation.z = 0.3;

            const haloScale = (isMobile ? 0.85 : 1.15) * (1 + Math.cos(time * 1.2) * 0.025);
            haloRingRef.current.scale.set(haloScale, haloScale, haloScale);
        }

        // Animate spark dots along the primary orbit
        if (sparksRef.current && !shouldReduceMotion) {
            const radiusX = isMobile ? 1.6 : 2.25;
            const radiusY = isMobile ? 1.4 : 1.95;

            sparkAngles.forEach((baseAngle, i) => {
                const angle = baseAngle + time * 0.8;
                const sx = Math.cos(angle) * radiusX;
                const sy = Math.sin(angle) * radiusY * 0.45;
                const sz = Math.sin(angle) * 0.65;

                sparkDummy.position.set(sx, sy, sz);
                const sScale = (Math.sin(angle * 2) * 0.4 + 0.8) * 0.05;
                sparkDummy.scale.set(sScale, sScale, sScale);
                sparkDummy.updateMatrix();

                sparksRef.current.setMatrixAt(i, sparkDummy.matrix);
            });
            sparksRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <group position={centerPos}>
            {/* Sleek Golden Orbital Ring */}
            <mesh ref={mainRingRef}>
                <torusGeometry args={[isMobile ? 1.55 : 2.15, 0.006, 32, 128]} />
                <meshStandardMaterial
                    color="#ff8c42"
                    emissive="#ea580c"
                    emissiveIntensity={1.2}
                    roughness={0.3}
                    metalness={0.9}
                    toneMapped={false}
                />
            </mesh>

            {/* Subtle Ethereal Outer Accent Ring */}
            <mesh ref={haloRingRef}>
                <torusGeometry args={[isMobile ? 1.75 : 2.45, 0.003, 24, 96]} />
                <meshStandardMaterial
                    color="#fbbf24"
                    emissive="#d97706"
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.35}
                    roughness={0.4}
                    metalness={0.95}
                    toneMapped={false}
                />
            </mesh>

            {/* Glowing Orbit Spark Energy Points */}
            {!shouldReduceMotion && (
                <instancedMesh ref={sparksRef} args={[null, null, sparkCount]}>
                    <sphereGeometry args={[0.7, 10, 10]} />
                    <meshBasicMaterial color="#fed7aa" />
                </instancedMesh>
            )}
        </group>
    );
};

// ─── ROOT 3D SCENE COMPONENT ───
const HeroScene3D = ({ mouseRef, isMobile = false, shouldReduceMotion = false }) => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, { threshold: 0 });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
            <Canvas
                frameloop={isVisible ? 'always' : 'never'}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                }}
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, isMobile ? 9.5 : 8], fov: 45, near: 0.1, far: 50 }}
            >
                {/* Camera Rig with smooth mouse parallax */}
                <CameraRig
                    mouseRef={mouseRef}
                    isMobile={isMobile}
                    shouldReduceMotion={shouldReduceMotion}
                />

                {/* Cinematic Ambient & Directional Lighting */}
                <ambientLight intensity={0.35} />
                <directionalLight position={[4, 5, 3]} intensity={0.5} color="#fff" />

                {/* Golden Orbit Ring surrounding portrait */}
                <OrbitRingSystem
                    isMobile={isMobile}
                    shouldReduceMotion={shouldReduceMotion}
                />

                {/* Atmospheric Golden Embers & Floating Dust */}
                <Sparkles
                    count={isMobile ? 35 : 90}
                    scale={[12, 8, 8]}
                    size={isMobile ? 2 : 2.8}
                    speed={0.3}
                    color="#f97316"
                    opacity={0.5}
                />
                <Sparkles
                    count={isMobile ? 20 : 50}
                    scale={[14, 9, 10]}
                    size={isMobile ? 1.6 : 2.2}
                    speed={0.18}
                    color="#fbbf24"
                    opacity={0.35}
                />
            </Canvas>
        </div>
    );
};

export default React.memo(HeroScene3D);
