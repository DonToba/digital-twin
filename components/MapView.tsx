'use client';
import {useEffect,useRef} from 'react';
import maplibregl,{Map} from 'maplibre-gl';
import type {FeatureCollection} from 'geojson';
import {alignment,design} from '@/lib/demo-data';

type Props={buildings:FeatureCollection;extra:FeatureCollection[];threeD:boolean};
export default function MapView({buildings,extra,threeD}:Props){
 const node=useRef<HTMLDivElement>(null);const mapRef=useRef<Map|null>(null);
 useEffect(()=>{
  if(!node.current)return;
const map = new maplibregl.Map({container: node.current, style: process.env.NEXT_PUBLIC_MAP_STYLE || 'https://demotiles.maplibre.org/style.json',  center: [3.405, 6.458],zoom: 14.2,pitch: threeD ? 55 : 0,bearing: -15});
  map.addControl(new maplibregl.NavigationControl({visualizePitch:true}),'top-right');
  map.on('load',()=>{
   const add=(id:string,data:FeatureCollection)=>map.addSource(id,{type:'geojson',data});
   add('alignment',alignment);add('design',design);add('buildings',buildings);
   map.addLayer({id:'design-row',type:'fill',source:'design',filter:['==',['geometry-type'],'Polygon'],paint:{'fill-color':'#45d6d0','fill-opacity':.10}});
   map.addLayer({id:'design-line',type:'line',source:'design',filter:['==',['geometry-type'],'LineString'],paint:{'line-color':'#45d6d0','line-width':3,'line-dasharray':[2,1]}});
   map.addLayer({id:'alignment-line',type:'line',source:'alignment',paint:{'line-color':'#ffb45e','line-width':2}});
   map.addLayer({id:'building-polygons',type:threeD?'fill-extrusion':'fill',source:'buildings',paint:threeD?{'fill-extrusion-color':'#d58c58','fill-extrusion-height':['coalesce',['get','height'],8],'fill-extrusion-base':0,'fill-extrusion-opacity':.82}:{'fill-color':'#d58c58','fill-opacity':.65}});
   extra.forEach((g,i)=>{
    const id=`extra-${i}`;add(id,g);
    map.addLayer({id:`extra-fill-${i}`,type:threeD?'fill-extrusion':'fill',source:id,filter:['==',['geometry-type'],'Polygon'],paint:threeD?{'fill-extrusion-color':'#7896ff','fill-extrusion-height':['coalesce',['get','height'],6],'fill-extrusion-base':0,'fill-extrusion-opacity':.72}:{'fill-color':'#7896ff','fill-opacity':.24}});
    map.addLayer({id:`extra-line-${i}`,type:'line',source:id,filter:['in',['geometry-type'],'LineString','MultiLineString'],paint:{'line-color':'#b7ed6b','line-width':2}});
    map.addLayer({id:`extra-point-${i}`,type:'circle',source:id,filter:['in',['geometry-type'],'Point','MultiPoint'],paint:{'circle-radius':5,'circle-color':'#b7ed6b','circle-stroke-width':1,'circle-stroke-color':'#10202b'}});
   });
  });
  mapRef.current=map;return()=>{map.remove();mapRef.current=null};
 },[threeD,extra.length]);
 useEffect(()=>{const m=mapRef.current;if(!m)return;const apply=()=>{const s=m.getSource('buildings') as maplibregl.GeoJSONSource|undefined;s?.setData(buildings)};if(m.isStyleLoaded())apply();else m.once('load',apply);},[buildings]);
 useEffect(()=>{const m=mapRef.current;if(!m)return;const apply=()=>extra.forEach((g,i)=>{const s=m.getSource(`extra-${i}`) as maplibregl.GeoJSONSource|undefined;s?.setData(g)});if(m.isStyleLoaded())apply();else m.once('load',apply);},[extra]);
 return <div ref={node} className="map-canvas"/>;
}
