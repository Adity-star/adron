'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Environment, Float, Text3D, ContactShadows } from '@react-three/drei'
import { Suspense, useRef } from 'react'

const HELVETIKER = 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json'

function Mono({ scale = 1 }) {
  const ref = useRef()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.18
    }
  })
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={ref} scale={scale}>
        <Center>
          <Text3D
            font={HELVETIKER}
            size={1.6}
            height={0.45}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.04}
            bevelSize={0.03}
            bevelOffset={0}
            bevelSegments={8}
            letterSpacing={-0.06}
          >
            AD
            <meshStandardMaterial
              color="#e9e4d8"
              metalness={1}
              roughness={0.22}
              envMapIntensity={1.4}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  )
}

export default function ADMonogram({ scale = 1 }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.8]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.25} />
        <spotLight position={[5, 6, 5]} angle={0.4} penumbra={1} intensity={2.2} color="#fff6e0" />
        <spotLight position={[-6, -3, 4]} angle={0.6} penumbra={1} intensity={1.2} color="#a0b4d0" />
        <pointLight position={[0, -4, 3]} intensity={0.6} color="#fff" />
        <Mono scale={scale} />
        <ContactShadows position={[0, -1.8, 0]} opacity={0.55} scale={8} blur={2.6} far={3} />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  )
}
