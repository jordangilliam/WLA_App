import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import MapboxGL from '@rnmapbox/maps'
import { FieldSite } from '../../lib/types'

interface FieldSiteMarkerProps {
  site: FieldSite
  onPress: (site: FieldSite) => void
}

export const FieldSiteMarker: React.FC<FieldSiteMarkerProps> = ({ site, onPress }) => {
  return (
    <MapboxGL.PointAnnotation
      id={`site-${site.id}`}
      coordinate={[site.lng, site.lat]}
      onSelected={() => onPress(site)}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.marker, getMarkerStyle(site.type)]}>
          <Text style={styles.markerIcon}>{getMarkerIcon(site.type)}</Text>
        </View>
        {/* Geofence radius circle */}
        <MapboxGL.CircleLayer
          id={`geofence-${site.id}`}
          style={{
            circleRadius: site.radius,
            circleColor: 'rgba(100, 150, 255, 0.2)',
            circleStrokeColor: 'rgba(100, 150, 255, 0.8)',
            circleStrokeWidth: 2,
          }}
        />
      </View>
      {/* Callout bubble */}
      <MapboxGL.Callout title={site.name}>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{site.name}</Text>
          <Text style={styles.calloutType}>{formatSiteType(site.type)}</Text>
          <Text style={styles.calloutDescription}>{site.description}</Text>
        </View>
      </MapboxGL.Callout>
    </MapboxGL.PointAnnotation>
  )
}

function getMarkerIcon(type: string): string {
  const icons: Record<string, string> = {
    education_center: '🏫',
    forest: '🌲',
    stream: '🌊',
    lake: '💧',
    park: '🏞️',
    mountain: '⛰️',
    wetland: '🌿',
    cave: '🕳️',
    default: '📍',
  }
  return icons[type] || icons.default
}

function getMarkerStyle(type: string): any {
  const colors: Record<string, string> = {
    education_center: '#4A90E2',
    forest: '#2D8B3A',
    stream: '#3498DB',
    lake: '#5DADE2',
    park: '#52B788',
    mountain: '#8B6B47',
    wetland: '#16A085',
    cave: '#7D6E83',
    default: '#95A5A6',
  }
  return {
    backgroundColor: colors[type] || colors.default,
  }
}

function formatSiteType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 20,
  },
  callout: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    minWidth: 200,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  calloutType: {
    fontSize: 12,
    color: '#7F8C8D',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
  },
})

