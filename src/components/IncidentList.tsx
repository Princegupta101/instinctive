'use client'

import { useState } from 'react'
import { AlertTriangle, Shield, Eye, Activity, Clock, MapPin, Check } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'
import { Incident } from '@/types'

interface IncidentListProps {
  incidents: Incident[]
  onSelectIncident: (incidentId: string) => void
  onResolveIncident: (incidentId: string) => void
  selectedIncidentId?: string
}

const getIncidentIcon = (type: string) => {
  switch (type) {
    case 'Gun Threat':
      return <AlertTriangle className="h-4 w-4" />
    case 'Unauthorized Access':
      return <Shield className="h-4 w-4" />
    case 'Face Recognized':
      return <Eye className="h-4 w-4" />
    case 'Suspicious Activity':
      return <Activity className="h-4 w-4" />
    default:
      return <AlertTriangle className="h-4 w-4" />
  }
}

const getIncidentColor = (type: string) => {
  switch (type) {
    case 'Gun Threat':
      return 'text-red-400 bg-red-900/20'
    case 'Unauthorized Access':
      return 'text-orange-400 bg-orange-900/20'
    case 'Face Recognized':
      return 'text-blue-400 bg-blue-900/20'
    case 'Suspicious Activity':
      return 'text-green-400 bg-green-900/20'
    default:
      return 'text-gray-400 bg-gray-900/20'
  }
}

export default function IncidentList({ 
  incidents, 
  onSelectIncident, 
  onResolveIncident, 
  selectedIncidentId 
}: IncidentListProps) {
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set())

  const handleResolve = async (incidentId: string) => {
    setResolvingIds(prev => new Set(prev).add(incidentId))
    
    try {
      await onResolveIncident(incidentId)
    } catch (error) {
      console.error('Failed to resolve incident:', error)
    } finally {
      setResolvingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(incidentId)
        return newSet
      })
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Active Incidents</h2>
        <p className="text-gray-400 text-sm">
          {incidents.filter(i => !i.resolved).length} unresolved incidents
        </p>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {incidents.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-400">No incidents found</p>
          </div>
        ) : (
          incidents.map((incident) => (
            <div
              key={incident.id}
              className={`
                relative p-4 rounded-lg border transition-all cursor-pointer
                ${incident.resolved 
                  ? 'bg-gray-900/50 border-gray-700 opacity-60' 
                  : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                }
                ${selectedIncidentId === incident.id ? 'ring-2 ring-blue-500' : ''}
              `}
              onClick={() => onSelectIncident(incident.id)}
            >
              <div className="flex items-start space-x-3">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-12 rounded overflow-hidden">
                    <Image
                      src={incident.thumbnailUrl}
                      alt={`${incident.type} incident`}
                      width={64}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Incident Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`p-1 rounded ${getIncidentColor(incident.type)}`}>
                      {getIncidentIcon(incident.type)}
                    </div>
                    <h3 className="text-white font-medium text-sm truncate">
                      {incident.type}
                    </h3>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-gray-400 text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{incident.camera.name} - {incident.camera.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {format(new Date(incident.tsStart), 'MMM d, HH:mm')} - {format(new Date(incident.tsEnd), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resolve Button */}
                {!incident.resolved && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleResolve(incident.id)
                      }}
                      disabled={resolvingIds.has(incident.id)}
                      className={`
                        px-3 py-1 rounded text-xs font-medium transition-all
                        ${resolvingIds.has(incident.id)
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                        }
                      `}
                    >
                      {resolvingIds.has(incident.id) ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Check className="h-3 w-3" />
                          <span>Resolve</span>
                        </div>
                      )}
                    </button>
                  </div>
                )}

                {/* Resolved Badge */}
                {incident.resolved && (
                  <div className="flex-shrink-0">
                    <div className="px-2 py-1 rounded text-xs font-medium bg-green-900/20 text-green-400 flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>Resolved</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
