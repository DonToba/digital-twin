declare module 'shpjs' {
  import type { FeatureCollection } from 'geojson';
  export default function shp(data: ArrayBuffer | Uint8Array): Promise<FeatureCollection | FeatureCollection[]>;
}
