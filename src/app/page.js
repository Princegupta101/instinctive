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
  }, [showResolved])

  // Handle incident selection
  const handleSelectIncident = (incidentId: string) => {
    setSelectedIncidentId(incidentId)
  }

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
}" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.js
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
