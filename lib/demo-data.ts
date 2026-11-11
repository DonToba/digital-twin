import type { FeatureCollection } from 'geojson';

// Synthetic teaching/demo data around an illustrative corridor. Not a cadastral or survey dataset.
export const alignment: FeatureCollection = {
 type:'FeatureCollection', features:[{type:'Feature',properties:{name:'Demo highway centreline',layer:'alignment'},geometry:{type:'LineString',coordinates:[[3.390,6.455],[3.395,6.456],[3.400,6.457],[3.405,6.458],[3.410,6.459],[3.415,6.460],[3.420,6.461]]}}]
};
export const design: FeatureCollection = {
 type:'FeatureCollection',features:[
 {type:'Feature',properties:{name:'Proposed carriageway',layer:'design'},geometry:{type:'LineString',coordinates:[[3.390,6.455],[3.395,6.456],[3.400,6.457],[3.405,6.458],[3.410,6.459],[3.415,6.460],[3.420,6.461]]}},
 {type:'Feature',properties:{name:'Proposed ROW',layer:'design'},geometry:{type:'Polygon',coordinates:[[[3.3897,6.45465],[3.4207,6.46065],[3.4203,6.46135],[3.3893,6.45535],[3.3897,6.45465]]]}}
]};
export const buildingsBefore: FeatureCollection = {
 type:'FeatureCollection',features:[
 ...[[3.397,6.4575],[3.401,6.4564],[3.407,6.4592],[3.412,6.4582],[3.417,6.4615]].map((p,i)=>({type:'Feature' as const,properties:{name:`Structure B${i+1}`,height:8+i*2,status:'existing'},geometry:{type:'Polygon' as const,coordinates:[[[p[0],p[1]],[p[0]+.00035,p[1]],[p[0]+.00035,p[1]+.00025],[p[0],p[1]+.00025],[p[0],p[1]]] ]}}))
 ]};
export const buildingsAfter: FeatureCollection = {
 type:'FeatureCollection',features:[
 ...[[3.397,6.4575],[3.401,6.4564],[3.407,6.4592],[3.412,6.4582],[3.417,6.4615],[3.405,6.4589],[3.414,6.4595]].map((p,i)=>({type:'Feature' as const,properties:{name:`Structure A${i+1}`,height:9+i*2,status:'observed'},geometry:{type:'Polygon' as const,coordinates:[[[p[0],p[1]],[p[0]+.00035,p[1]],[p[0]+.00035,p[1]+.00025],[p[0],p[1]+.00025],[p[0],p[1]]] ]}}))
 ]};
