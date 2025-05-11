import React, { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three' // Import THREE for raycasting

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
function Tree({ position, onClick }) {
  const { scene } = useGLTF('/models/tree.glb') // assuming path is correct now
  return (
    <group position={position} onClick={onClick} scale={[0.03,0.03,0.03]}>
      <primitive object={scene} />
    </group>
  )
}


// Building Model
function Building({ position, onClick }) {
  const { scene } = useGLTF('/models/building.glb') // Adjust the path if needed

  return (
    <group position={position} onClick={onClick} scale={[0.1,0.1,0.1]}>
      <primitive object={scene} />
    </group>
  )
}


// Agent Model
function Agent({ position, onClick }) {
  const { scene } = useGLTF('/models/robot.glb') // Adjust path if needed

  return (
    <group position={position} onClick={onClick} scale={[0.2, 0.2, 0.2]}>
      <primitive object={scene} />
    </group>
  )
}


export default function App() {
  const cameraRef = useRef()
  const controlsRef = useRef()
  const [focusPoint, setFocusPoint] = useState([0, 1, 0]) // Default focus in the center

  // Function to handle focus when an object is clicked
  const handleFocus = (position) => {
    setFocusPoint(position)
  }

  return (
    <Canvas
      shadows
      camera={{ position: [5, 5, 5], fov: 60 }}
      ref={cameraRef}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <OrbitControls ref={controlsRef} enableZoom={true} enableRotate={true} />
      <Environment preset="sunset" />
      
      {/* Ground */}
      <Ground />

      {/* Trees */}
      <Tree position={[-10, 0, -5]} onClick={() => handleFocus([-10, 0, -5])} />
      <Tree position={[-5, 0, -10]} onClick={() => handleFocus([-5, 0, -10])} />
      <Tree position={[0, 0, -15]} onClick={() => handleFocus([0, 0, -15])} />
      <Tree position={[5, 0, -5]} onClick={() => handleFocus([5, 0, -5])} />
      <Tree position={[10, 0, -10]} onClick={() => handleFocus([10, 0, -10])} />
      <Tree position={[15, 0, -5]} onClick={() => handleFocus([15, 0, -5])} />
     	

      {/* Buildings */}
      <Building position={[-15, 0, -15]} onClick={() => handleFocus([-15, 0, -15])} />
      <Building position={[10, 0, 5]} onClick={() => handleFocus([10, 0, 5])} />
      <Building position={[0, 0, 12]} onClick={() => handleFocus([0, 0, 12])} />

      {/* Agents */}
      <Agent position={[0, 0, 0]} />
      <Agent position={[2, 0, 2]} />
    </Canvas>
  )
}

