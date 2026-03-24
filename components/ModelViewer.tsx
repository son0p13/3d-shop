"use client"

import { Canvas } from "@react-three/fiber"
import { useGLTF, Stage, PresentationControls } from "@react-three/drei"

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1} />
}

export default function ModelViewer({ url }: { url: string }) {
  return (
    <div className="h-[300px]">
      <Canvas>
        <PresentationControls global zoom={0.8}>
          <Stage environment="city">
            <Model url={url} />
          </Stage>
        </PresentationControls>
      </Canvas>
    </div>
  )
}