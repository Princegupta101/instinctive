'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import IncidentPlayer from '@/components/IncidentPlayer'
import IncidentList from '@/components/IncidentList'
import { Incident, Camera } from '@/types'

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [cameras, setCameras] = useState<Camera[]>([])
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [showResolved, setShowResolved] = useState(false)

  // Fetch incidents
  const fetchIncidents = async () => {
    try {
      const response = await fetch(`/api/incidents?resolved=${showResolved}`)
      if (response.ok) {
        const data = await response.json()
        setIncidents(data)
      }
    } catch (error) {
      console.error('Failed to fetch incidents:', error)
    }
  }

  // Fetch cameras
  const fetchCameras = async () => {
    try {
      const response = await fetch('/api/cameras')
      if (response.ok) {
        const data = await response.json()
        setCameras(data)
      }
    } catch (error) {
      console.error('Failed to fetch cameras:', error)
    }
  }

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchIncidents(), fetchCameras()])
      setLoading(false)
    }
    loadData()
  }, [showResolved]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle incident selection
  const handleSelectIncident = (incidentId: string) => {
    setSelectedIncidentId(incidentId)
  }

  // Get the selected incident object
  const selectedIncident = incidents.find(incident => incident.id === selectedIncidentId)

  // Handle incident resolution with optimistic updates
  const handleResolveIncident = async (incidentId: string) => {
    // Optimistic update
    setIncidents(prevIncidents => 
      prevIncidents.map(incident => 
        incident.id === incidentId 
          ? { ...incident, resolved: true }
          : incident
      )
    )

    try {
      const response = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        throw new Error('Failed to resolve incident')
      }

      const updatedIncident = await response.json()
      
      // Update with server response
      setIncidents(prevIncidents => 
        prevIncidents.map(incident => 
          incident.id === incidentId ? updatedIncident : incident
        )
      )

      // If showing only unresolved incidents, remove resolved ones
      if (!showResolved) {
        setTimeout(() => {
          setIncidents(prevIncidents => 
            prevIncidents.filter(incident => incident.id !== incidentId)
          )
        }, 1000) // Delay to show the resolved state briefly
      }

    } catch (error) {
      // Revert optimistic update on error
      setIncidents(prevIncidents => 
        prevIncidents.map(incident => 
          incident.id === incidentId 
            ? { ...incident, resolved: false }
            : incident
        )
      )
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="p-6">
        {/* Filter Controls */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowResolved(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !showResolved 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Active Only
              </button>
              <button
                onClick={() => setShowResolved(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showResolved 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Show All
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incident Player - Left Side (2/3 width) */}
          <div className="lg:col-span-2">
            <IncidentPlayer 
              selectedIncidentId={selectedIncidentId}
              cameras={cameras}
              selectedIncident={selectedIncident}
            />
          </div>

          {/* Incident List - Right Side (1/3 width) */}
          <div className="lg:col-span-1">
            <IncidentList
              incidents={incidents}
              onSelectIncident={handleSelectIncident}
              onResolveIncident={handleResolveIncident}
              selectedIncidentId={selectedIncidentId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
