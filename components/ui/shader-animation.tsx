"use client"

import { useEffect, useRef } from "react"

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    let animationId: number
    let renderer: any

    try {
      const THREE = require("three")

      const vertexShader = `void main() { gl_Position = vec4( position, 1.0 ); }`
      const fragmentShader = `
        precision highp float;
        uniform vec2 resolution;
        uniform float time;
        void main(void) {
          vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
          float t = time*0.05;
          float lineWidth = 0.002;
          vec3 color = vec3(0.0);
          for(int j = 0; j < 3; j++){
            for(int i=0; i < 5; i++){
              color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
            }
          }
          gl_FragColor = vec4(color[0],color[1],color[2],1.0);
        }
      `

      const camera = new THREE.Camera()
      camera.position.z = 1
      const scene = new THREE.Scene()
      const geometry = new THREE.PlaneGeometry(2, 2)
      const uniforms = {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
      }
      const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })
      scene.add(new THREE.Mesh(geometry, material))

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      container.appendChild(renderer.domElement)

      const resize = () => {
        renderer.setSize(container.clientWidth, container.clientHeight)
        uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height)
      }
      resize()
      window.addEventListener("resize", resize)

      const animate = () => {
        animationId = requestAnimationFrame(animate)
        uniforms.time.value += 0.05
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        window.removeEventListener("resize", resize)
        cancelAnimationFrame(animationId)
        try { container.removeChild(renderer.domElement) } catch {}
        renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    } catch {
      // WebGL non disponible - le fond CSS suffit
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "#020617", overflow: "hidden" }}
    />
  )
}
