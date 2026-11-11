'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

type Props={file?:File|null};
export default function ObjViewer({file}:Props){
 const host=useRef<HTMLDivElement>(null);
 const objectRef=useRef<THREE.Object3D|null>(null);
 useEffect(()=>{
  if(!host.current)return;
  const el=host.current; const scene=new THREE.Scene(); scene.background=new THREE.Color('#0a1119');
  const camera=new THREE.PerspectiveCamera(45,el.clientWidth/el.clientHeight,.1,10000); camera.position.set(22,18,25);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false}); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); renderer.setSize(el.clientWidth,el.clientHeight); renderer.outputColorSpace=THREE.SRGBColorSpace; el.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xc9e8ff,0x28313a,2));
  const key=new THREE.DirectionalLight(0xffffff,2.2);key.position.set(10,20,12);scene.add(key);
  const grid=new THREE.GridHelper(80,40,0x38515c,0x1c2c36);scene.add(grid);
  const material=new THREE.MeshStandardMaterial({color:0x9aaeb7,roughness:.86,metalness:.05});
  const loader=new OBJLoader();
  let url:string|undefined;
  const load=(source:string)=>loader.load(source,obj=>{if(objectRef.current)scene.remove(objectRef.current);obj.traverse(c=>{if((c as THREE.Mesh).isMesh){(c as THREE.Mesh).material=material;}});const box=new THREE.Box3().setFromObject(obj);const size=box.getSize(new THREE.Vector3());const center=box.getCenter(new THREE.Vector3());obj.position.sub(center);const max=Math.max(size.x,size.y,size.z)||1;obj.scale.setScalar(30/max);scene.add(obj);objectRef.current=obj;},undefined,err=>console.error('OBJ load failed',err));
  if(file){url=URL.createObjectURL(file);load(url);}else load('/demo/corridor-demo.obj');
  let down=false,px=0,py=0,rotY=0,rotX=0.35,dist=42;
  const onDown=(e:PointerEvent)=>{down=true;px=e.clientX;py=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)};
  const onMove=(e:PointerEvent)=>{if(!down)return;rotY+=(e.clientX-px)*.008;rotX=Math.max(-1.2,Math.min(1.2,rotX+(e.clientY-py)*.008));px=e.clientX;py=e.clientY};
  const onUp=()=>down=false;const onWheel=(e:WheelEvent)=>{dist=Math.max(12,Math.min(120,dist+e.deltaY*.04))};
  renderer.domElement.addEventListener('pointerdown',onDown);renderer.domElement.addEventListener('pointermove',onMove);renderer.domElement.addEventListener('pointerup',onUp);renderer.domElement.addEventListener('wheel',onWheel);
  let frame=0;const animate=()=>{frame=requestAnimationFrame(animate);camera.position.set(Math.sin(rotY)*dist,Math.sin(rotX)*dist*.65+8,Math.cos(rotY)*dist);camera.lookAt(0,0,0);renderer.render(scene,camera)};animate();
  const resize=()=>{if(!host.current)return;camera.aspect=host.current.clientWidth/host.current.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.current.clientWidth,host.current.clientHeight)};window.addEventListener('resize',resize);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);renderer.dispose();renderer.domElement.remove();if(url)URL.revokeObjectURL(url)};
 },[file]);
 return <div ref={host} className="model-canvas" />;
}
