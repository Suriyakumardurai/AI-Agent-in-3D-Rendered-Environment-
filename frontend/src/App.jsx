import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Ground Plane
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#bfff80" />
    </mesh>
  )
}

// Tree model
function Tree({ position }) {
  const { scene } = useGLTF('/models/tree.glb')
  return (
    <group position={position} scale={[0.03, 0.03, 0.03]}>
      <primitive object={scene} />
    </group>
  )
}

// Building model
function Building({ position }) {
  const { scene } = useGLTF('/models/building.glb')
  return (
    <group position={position} scale={[0.1, 0.1, 0.1]}>
      <primitive object={scene} />
    </group>
  )
}

// Agent model
function Agent({ position }) {
  const { scene } = useGLTF('/models/robot.glb')
  return (
    <group position={position} scale={[0.2, 0.2, 0.2]}>
      <primitive object={scene} />
    </group>
  )
}

// Component to handle click + camera focus
function ClickToFocus() {
  const { camera, gl, scene } = useThree()
  const controls = useRef()
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  useEffect(() => {
    function onDoubleClick(event) {
      const rect = gl.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      if (intersects.length > 0) {
        const point = intersects[0].point
        controls.current.target.copy(point)
        controls.current.update()
      }
    }

    gl.domElement.addEventListener('dblclick', onDoubleClick)
    return () => gl.domElement.removeEventListener('dblclick', onDoubleClick)
  }, [camera, gl, scene])

  return <OrbitControls ref={controls} enableZoom enableRotate />
}

export default function App() {
  return (
    <Canvas
      shadows
      camera={{ position: [5, 5, 5], fov: 60 }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="sunset" />
      <ClickToFocus />
      <Ground />

      {/* Trees */}
      <Tree position={[-10, 0, -5]} />
      <Tree position={[-5, 0, -10]} />
      <Tree position={[0, 0, -15]} />
      <Tree position={[5, 0, -5]} />
      <Tree position={[10, 0, -10]} />
      <Tree position={[15, 0, -5]} />

      {/* Buildings */}
      <Building position={[-15, 0, -15]} />
      <Building position={[10, 0, 5]} />
      <Building position={[0, 0, 12]} />

      {/* Agents */}
      <Agent position={[0, 0, 0]} />
      <Agent position={[2, 0, 2]} />
    </Canvas>
  )
}
