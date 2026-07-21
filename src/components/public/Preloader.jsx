import React, { useEffect, useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, PerspectiveCamera, Stars, Text3D, Center, Environment, MeshDistortMaterial } from '@react-three/drei';
import SmokeEffect from './SmokeEffect';

// Lightning Effect Component - Synced with Theme
const Lightning = ({ hue }) => {
    const light = useRef();
    const color = new THREE.Color().setHSL(hue, 1, 0.5);

    useFrame(() => {
        if (light.current) {
            light.current.color.lerp(color, 0.1);
            if (Math.random() > 0.95) {
                light.current.intensity = 10 + Math.random() * 20; // Hyper Flash
                light.current.position.set(
                    (Math.random() - 0.5) * 40,
                    10 + Math.random() * 20,
                    (Math.random() - 0.5) * 40
                );
            } else {
                light.current.intensity = Math.max(0, light.current.intensity - 1);
            }
        }
    });

    return <pointLight ref={light} distance={100} decay={2} />;
};

// Magical Particle Swirl
const ParticleSwirl = ({ hue }) => {
    const count = 200;
    const mesh = useRef();
    const color = new THREE.Color().setHSL(hue, 1, 0.6);

    // Generate random positions spiraling out
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const x = Math.cos(t) + Math.sin(t * 1) / 10;
            const y = Math.sin(t) + Math.cos(t * 2) / 10;
            const z = Math.cos(t) + Math.sin(t * 3) / 10;
            temp.push({ t, factor, speed, x, y, z, mx: 0, my: 0 });
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setParticles(temp);
    }, [count]);

    // Use dummy object for instanced mesh styling
    const dummy = React.useMemo(() => new THREE.Object3D(), []);

    useFrame(() => {
        if (!mesh.current) return;

        // Rotate entire swirl
        mesh.current.rotation.y += 0.002;
        mesh.current.rotation.z += 0.001;

        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle;
            // Update time
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Update dummy object position
            dummy.position.set(
                (particle.mx + (x * factor) / 10) * a * 0.5,
                (particle.my + (y * factor) / 10) * b * 0.5,
                (particle.my + (z * factor) / 10) * s * 0.5
            );

            // Dynamic Scale Pulse
            const scale = (Math.sin(t * 5) + 2) * 0.1;
            dummy.scale.set(scale, scale, scale);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();

            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
        </instancedMesh>
    );
};

// 3D Text Component with Fluid/Distort Material
const UVKText = ({ setGlobalHue }) => {
    const textRef = useRef();
    const materialRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Dynamic Floating
        if (textRef.current) {
            textRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
            textRef.current.rotation.x = Math.cos(time * 0.3) * 0.1;
        }

        // "Sortable Colors" (Hue Shift)
        const hue = (time * 0.15) % 1;
        setGlobalHue(hue);

        if (materialRef.current) {
            materialRef.current.color.setHSL(hue, 0.9, 0.5);
            materialRef.current.emissive.setHSL(hue, 1, 0.8); // High Glow

            // Animate Distortion
            materialRef.current.distort = 0.3 + Math.sin(time) * 0.2;
        }
    });

    return (
        <Float speed={4} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.5, 0.5]}>
            <Center>
                <group ref={textRef} position={[0, 1, 0]}> {/* Lifted up slightly */}
                    <Text3D
                        font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
                        size={4}
                        height={0.5}
                        curveSegments={32}
                        bevelEnabled
                        bevelThickness={0.1}
                        bevelSize={0.05}
                        bevelOffset={0}
                        bevelSegments={8}
                    >
                        VUK
                        {/* THE MAGIC MATERIAL - ORANGE */}
                        <MeshDistortMaterial
                            ref={materialRef}
                            speed={2}
                            distort={0.4}
                            color="#FF7D44" // PURE ORANGE
                            emissive="#b33e00" // Deep Orange Glow
                            emissiveIntensity={1}
                            metalness={0.6}
                            roughness={0.2}
                            clearcoat={1}
                        />
                    </Text3D>
                </group>
            </Center>
        </Float>
    );
};

// 3D Scene Component
const LoadingScene = () => {
    const [hue, setHue] = useState(0);

    return (
        <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 20]} />
            <ambientLight intensity={0.1} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ffffff" />

            {/* Dynamic Lightning */}
            <Lightning hue={hue} />

            {/* The Particle Vortex */}
            <ParticleSwirl hue={hue} />

            <Environment files="/assets/potsdamer_platz_1k.hdr" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <UVKText setGlobalHue={setHue} />
        </Canvas>
    );
};

const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('Initializing Systems...');

    useEffect(() => {
        const messages = [
            'Syncing Data Streams...',
            'Optimizing UI Nodes...',
            'Launching Canvas...',
            'Compiling Assets...',
            'Finalizing UI...'
        ];

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                const increment = Math.random() * 4 + 1; // Faster increment for 1.2s delay
                return Math.min(prev + increment, 100);
            });
        }, 40);

        const msgTimer = setInterval(() => {
            setLoadingMessage(messages[Math.floor(Math.random() * messages.length)]);
        }, 500);

        return () => {
            clearInterval(timer);
            clearInterval(msgTimer);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
                opacity: 0,
                scale: 1.5,
                filter: "blur(20px)",
                transition: { duration: 0.8, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden cursor-none"
        >
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Suspense fallback={null}>
                    <LoadingScene />
                </Suspense>
            </div>

            {/* Cinematic Overlay - Smoke */}
            <SmokeEffect color="249, 115, 22" opacity={0.3} density={40} />

            <div className="absolute inset-0 z-10 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            ></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.1),_transparent_60%)] z-10 pointer-events-none"></div>

            <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 w-full h-full">
                {/* Tech Frame Container */}
                {/* Tech Frame Container - Clean (No Border) */}
                <div className="relative p-6 md:p-20 bg-black/0 backdrop-blur-none rounded-lg">

                    <div className="relative text-center w-full flex flex-col items-center justify-center mt-[40vh]"> {/* Push down significantly */}
                        {/* Loading Line & Percentage Container */}
                        <div className="flex items-center justify-center w-full max-w-[500px] gap-6">
                            {/* The Line Container */}
                            <div className="flex-1 h-[2px] bg-gray-800 border border-gray-700/50 rounded-full overflow-hidden relative backdrop-blur-sm">
                                <motion.div
                                    className="h-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,1)]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "linear", duration: 0.1 }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[100px] h-[4px] bg-gradient-to-r from-transparent to-white/90 blur-[2px] animate-pulse"></div>
                                </motion.div>
                            </div>

                            {/* The Percentage */}
                            <div className="text-orange-500 font-mono text-xl font-black tracking-tighter w-16 text-right tabular-nums drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                                {Math.floor(progress)}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Credits */}
            <div className="absolute bottom-10 w-full text-center z-30">
                <div className="inline-flex flex-col items-center gap-2">
                    <span className="text-[10px] md:text-xs text-gray-500 font-bold tracking-[0.6em] uppercase animate-pulse">
                        {loadingMessage}
                    </span>
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,1)] animate-ping"></div>
                </div>
            </div>
        </motion.div>
    );
};

export default Preloader;
