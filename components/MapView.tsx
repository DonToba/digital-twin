
'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { type Map, type GeoJSONSource } from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { alignment, design } from '@/lib/demo-data';

type Props = {
  buildings: FeatureCollection;
  extra: FeatureCollection[];
  threeD: boolean;
};

export default function MapView({ buildings, extra, threeD }: Props) {
  const node = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!node.current) return;

    const map = new maplibregl.Map({
      container: node.current,
      style:
        process.env.NEXT_PUBLIC_MAP_STYLE ||
        'https://demotiles.maplibre.org/style.json',
      center: [3.405, 6.458],
      zoom: 14.2,
      pitch: threeD ? 55 : 0,
      bearing: -15,
    });

    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      'top-right',
    );

    map.on('load', () => {
      const addGeoJsonSource = (id: string, data: FeatureCollection) => {
        map.addSource(id, { type: 'geojson', data });
      };

      const addPolygonLayer = (
        id: string,
        source: string,
        color: string,
        opacity: number,
        height: number,
      ) => {
        if (threeD) {
          map.addLayer({
            id,
            type: 'fill-extrusion',
            source,
            filter: ['==', ['geometry-type'], 'Polygon'],
            paint: {
              'fill-extrusion-color': color,
              'fill-extrusion-height': [
                'coalesce',
                ['get', 'height'],
                height,
              ],
              'fill-extrusion-base': 0,
              'fill-extrusion-opacity': opacity,
            },
          });
        } else {
          map.addLayer({
            id,
            type: 'fill',
            source,
            filter: ['==', ['geometry-type'], 'Polygon'],
            paint: {
              'fill-color': color,
              'fill-opacity': opacity,
            },
          });
        }
      };

      addGeoJsonSource('alignment', alignment);
      addGeoJsonSource('design', design);
      addGeoJsonSource('buildings', buildings);

      map.addLayer({
        id: 'design-row',
        type: 'fill',
        source: 'design',
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: {
          'fill-color': '#45d6d0',
          'fill-opacity': 0.1,
        },
      });

      map.addLayer({
        id: 'design-line',
        type: 'line',
        source: 'design',
        filter: ['==', ['geometry-type'], 'LineString'],
        paint: {
          'line-color': '#45d6d0',
          'line-width': 3,
          'line-dasharray': [2, 1],
        },
      });

      map.addLayer({
        id: 'alignment-line',
        type: 'line',
        source: 'alignment',
        paint: {
          'line-color': '#ffb45e',
          'line-width': 2,
        },
      });

      addPolygonLayer(
        'building-polygons',
        'buildings',
        '#d58c58',
        0.82,
        8,
      );

      extra.forEach((collection, index) => {
        const sourceId = `extra-${index}`;
        addGeoJsonSource(sourceId, collection);

        addPolygonLayer(
          `extra-fill-${index}`,
          sourceId,
          '#7896ff',
          threeD ? 0.72 : 0.24,
          6,
        );

        map.addLayer({
          id: `extra-line-${index}`,
          type: 'line',
          source: sourceId,
          filter: [
            'any',
            ['==', ['geometry-type'], 'LineString'],
            ['==', ['geometry-type'], 'MultiLineString'],
          ],
          paint: {
            'line-color': '#b7ed6b',
            'line-width': 2,
          },
        });

        map.addLayer({
          id: `extra-point-${index}`,
          type: 'circle',
          source: sourceId,
          filter: [
            'any',
            ['==', ['geometry-type'], 'Point'],
            ['==', ['geometry-type'], 'MultiPoint'],
          ],
          paint: {
            'circle-radius': 5,
            'circle-color': '#b7ed6b',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#10202b',
          },
        });
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [threeD, extra.length]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateBuildings = () => {
      const source = map.getSource('buildings') as
        | GeoJSONSource
        | undefined;
      source?.setData(buildings);
    };

    if (map.isStyleLoaded()) {
      updateBuildings();
    } else {
      map.once('load', updateBuildings);
    }
  }, [buildings]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateExtraSources = () => {
      extra.forEach((collection, index) => {
        const source = map.getSource(`extra-${index}`) as
          | GeoJSONSource
          | undefined;
        source?.setData(collection);
      });
    };

    if (map.isStyleLoaded()) {
      updateExtraSources();
    } else {
      map.once('load', updateExtraSources);
    }
  }, [extra]);

  return <div ref={node} className="map-canvas" />;
}
