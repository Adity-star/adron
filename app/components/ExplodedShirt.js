'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { useScroll, useTransform, MotionValue } from 'framer-motion'
import * as THREE from 'three'

function Piece({ position, rotation = [0, 0, 0], geometry, color = '#e9e4d8', metalness = 0.1, roughness = 0.6, progress, explodeOffset = [0, 0, 0], wireframe }) {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    // progress (0..1): 0 = exploded, 1 = assembled
    const p = progress.current ?? 0
    const ex = 1 - p
    ref.current.position.x = position[0] + explodeOffset[0] * ex
    ref.current.position.y = position[1] + explodeOffset[1] * ex
    ref.current.position.z = position[2] + explodeOffset[2] * ex
    ref.current.rotation.x = rotation[0] + ex * 0.4
    ref.current.rotation.y += 0.0015
  })
  return (
    <mesh ref={ref} castShadow receiveShadow>
      {geometry}
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} wireframe={wireframe} />
    </mesh>
  )
}

function Shirt({ progress, wireframeAmount }) {
  // wireframeAmount is a ref-tracked 0..1; we just use threshold inside meshes
  const matMode = useRef(0)
  useFrame(() => { matMode.current = wireframeAmount.current ?? 0 })

  // For simplicity we use one global wireframe boolean: when progress < 0.35 -> wireframe
  return (
    <group position={[0, -0.3, 0]}>
      {/* Body */}
      <Piece
        progress={progress}
        position={[0, 0, 0]}
        explodeOffset={[0, 1.5, 0]}
        geometry={<boxGeometry args={[2.2, 2.6, 0.5]} />}
      />
      {/* Left sleeve */}
      <Piece
        progress={progress}
        position={[-1.55, 0.6, 0]}
        rotation={[0, 0, 0.35]}
        explodeOffset={[-1.4, 0, 0]}
        geometry={<cylinderGeometry args={[0.35, 0.32, 1.4, 24]} />}
      />
      {/* Right sleeve */}
      <Piece
        progress={progress}
        position={[1.55, 0.6, 0]}
        rotation={[0, 0, -0.35]}
        explodeOffset={[1.4, 0, 0]}
        geometry={<cylinderGeometry args={[0.35, 0.32, 1.4, 24]} />}
      />
      {/* Collar */}
      <Piece
        progress={progress}
        position={[0, 1.45, 0.05]}
        explodeOffset={[0, 1.2, 0.6]}
        color="#d9d3c4"
        geometry={<torusGeometry args={[0.45, 0.09, 12, 32, Math.PI]} />}
      />
      {/* Pocket */}
      <Piece
        progress={progress}
        position={[-0.55, 0.2, 0.26]}
        explodeOffset={[-0.8, -0.6, 1.0]}
        color="#c9c2b1"
        geometry={<boxGeometry args={[0.55, 0.6, 0.05]} />}
      />
      {/* Buttons strip */}
      {[0.85, 0.45, 0.05, -0.35, -0.75].map((y, i) => (
        <Piece
          key={i}
          progress={progress}
          position={[0, y, 0.27]}
          explodeOffset={[0.3 + i * 0.05, 0, 1.3 + i * 0.1]}
          color="#b5ad99"
          metalness={0.55}
          roughness={0.25}
          geometry={<cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />}
          rotation={[Math.PI / 2, 0, 0]}
        />
      ))}
    </group>
  )
}

export default function ExplodedShirt({ progressRef, wireframeRef }) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 6.5], fov: 36 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.25} />
        <spotLight position={[5, 6, 5]} angle={0.5} penumbra={1} intensity={1.6} color="#fff6e0" />
        <spotLight position={[-5, 3, 4]} angle={0.6} penumbra={1} intensity={1.0} color="#a8bdd6" />
        <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.2}>
          <Shirt progress={progressRef} wireframeAmount={wireframeRef} />
        </Float>
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  )
}
