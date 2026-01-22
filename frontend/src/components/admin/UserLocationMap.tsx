import { useMemo } from 'react';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';

interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  location: string;
  user_name: string;
  user_email: string;
}

interface UserLocationMapProps {
  users: UserLocation[];
}

export default function UserLocationMap({ users }: UserLocationMapProps) {
  // Filter users with valid coordinates
  const validUsers = useMemo(() => {
    return users.filter(
      (u) => u.latitude !== null && u.longitude !== null && u.latitude !== undefined && u.longitude !== undefined
    );
  }, [users]);

  // Prepare markers data for the map
  const markers = useMemo(() => {
    return validUsers.map((user, index) => ({
      latLng: [user.latitude!, user.longitude!],
      name: `${user.user_name} - ${user.location}`,
      style: { fill: '#3b82f6', r: 6 },
    }));
  }, [validUsers]);

  // Group users by country for region highlighting
  const regions = useMemo(() => {
    const countryCounts: Record<string, number> = {};
    validUsers.forEach((user) => {
      // Extract country from location string (format: "City, Country")
      const parts = user.location.split(',');
      if (parts.length > 1) {
        const country = parts[parts.length - 1].trim();
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }
    });
    return countryCounts;
  }, [validUsers]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">User Locations Map</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {validUsers.length > 0 
            ? `${validUsers.length} user${validUsers.length > 1 ? 's' : ''} with location data`
            : 'No user locations available'}
        </p>
      </div>
      <div className="relative h-[500px] w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <VectorMap
          map={worldMill}
          backgroundColor="transparent"
          zoomOnScroll={true}
          zoomButtons={true}
          panOnDrag={true}
          markers={markers}
          markerStyle={{
            initial: {
              fill: '#3b82f6',
              stroke: '#ffffff',
              'stroke-width': 2,
              r: 6,
            },
            hover: {
              fill: '#2563eb',
              stroke: '#ffffff',
              'stroke-width': 2,
              r: 8,
            },
          }}
          containerStyle={{
            width: '100%',
            height: '100%',
          }}
          containerClassName="map-container"
          onMarkerTipShow={(event: any, label: any, index: number) => {
            const user = validUsers[index];
            if (user) {
              label.html(`
                <div style="padding: 8px; background: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                  <div style="font-weight: 600; margin-bottom: 4px;">${user.user_name}</div>
                  <div style="font-size: 12px; color: #666;">${user.user_email}</div>
                  <div style="font-size: 12px; color: #666; margin-top: 4px;">📍 ${user.location}</div>
                </div>
              `);
            }
          }}
        />
      </div>
      {validUsers.length === 0 && (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <svg
            className="h-5 w-5 shrink-0 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-400">No user locations available</p>
        </div>
      )}
      {validUsers.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(regions).slice(0, 10).map(([country, count]) => (
            <span
              key={country}
              className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-500/20 dark:text-blue-300"
            >
              {country}: {count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
