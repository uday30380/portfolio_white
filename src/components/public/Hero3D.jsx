import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Stars, Text3D, Center, Environment, Sparkles } from '@react-three/drei';

const UVKText = () => {
    const textRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Subtle floating rotation
        if (textRef.current) {
            textRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
            textRef.current.rotation.x = Math.cos(time * 0.3) * 0.05;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
            <Center top>
                <group ref={textRef}>
                    <Text3D
                        font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
                        size={3.5}
                        height={0.5}
                        curveSegments={32}
                        bevelEnabled
                        bevelThickness={0.1}
                        bevelSize={0.05}
                        bevelOffset={0}
                        bevelSegments={8}
                    >
                        UVK
                        <meshStandardMaterial
                            color="#FF7D44"
                            emissive="#b33e00"
                            emissiveIntensity={0.2}
                            metalness={0.9}
                            roughness={0.1}
                        />
                    </Text3D>
                </group>
            </Center>
        </Float>
    );
};

const Hero3D = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#FF7D44" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />

                {/* Premium Environment Reflections */}
                <Environment files="/assets/potsdamer_platz_1k.hdr" />

                {/* Stars & Sparkles for Premium particles */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={50} scale={10} size={4} speed={0.4} opacity={0.5} color="#FF7D44" />

                {/* 3D UVK Text */}
                <UVKText />

            </Canvas>
        </div>
    );
};

export default Hero3D;
