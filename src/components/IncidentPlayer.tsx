'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import Image from 'next/image'
import { Camera } from '@/types'

interface IncidentPlayerProps {
  selectedIncidentId?: string
  cameras: Camera[]
  selectedIncident?: any
}

export default function IncidentPlayer({ selectedIncidentId, cameras, selectedIncident }: IncidentPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(300) // 5 minutes in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => (prev < duration ? prev + 1 : 0))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Get the appropriate camera feed based on selected incident
  const getCameraFeed = () => {
    if (!selectedIncident) {
      return '/videos/main-player.svg'
    }
    
    const cameraName = selectedIncident.camera.name.toLowerCase()
    if (cameraName.includes('shop floor')) {
      return '/videos/shop-floor-feed.html'
    } else if (cameraName.includes('vault')) {
      return '/videos/vault-feed.html'
    } else if (cameraName.includes('entrance')) {
      return '/videos/entrance-feed.html'
    }
    return '/videos/main-player.svg'
  }

  const isVideoFeed = selectedIncident && getCameraFeed().endsWith('.html')

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white mb-2">Incident Player</h2>
        {selectedIncident ? (
          <div className="space-y-1">
            <span className="text-gray-400 text-sm">
              Playing: {selectedIncident.type} - {selectedIncident.camera.name}
            </span>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Incident ID: {selectedIncident.id.slice(-8)}</span>
              <span>•</span>
              <span>{new Date(selectedIncident.tsStart).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">
            Select an incident to view footage
          </span>
        )}
      </div>

      {/* Main Video Player */}
      <div className="relative bg-black rounded-lg mb-4 overflow-hidden">
        <div className="aspect-video flex items-center justify-center">
          {isVideoFeed ? (
            <iframe 
              src={getCameraFeed()}
              width="640"
              height="360"
              className="w-full h-full"
              frameBorder="0"
              title="Camera Feed"
            />
          ) : (
            <Image 
              src={getCameraFeed()} 
              alt="Camera Feed"
              width={640}
              height={360}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Play/Pause Overlay */}
          {!selectedIncident && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
            >
              <div className="bg-blue-600 hover:bg-blue-700 rounded-full p-4">
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </div>
            </button>
          )}

          {/* Play controls for incident playback */}
          {selectedIncident && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute bottom-20 left-4 bg-blue-600 hover:bg-blue-700 rounded-full p-3 transition-all"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white ml-0.5" />
              )}
            </button>
          )}

          {/* Status overlay */}
          {selectedIncident && (
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="bg-black bg-opacity-80 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${
                    selectedIncident.resolved ? 'bg-green-500' : 'bg-red-500 animate-pulse'
                  }`}></div>
                  <span className="text-white text-sm font-medium">
                    {selectedIncident.resolved ? 'RESOLVED' : 'ACTIVE INCIDENT'}
                  </span>
                </div>
                <p className="text-gray-300 text-xs">{selectedIncident.camera.name}</p>
                <p className="text-gray-400 text-xs">
                  {new Date(selectedIncident.tsStart).toLocaleTimeString()}
                </p>
              </div>
              
              <div className="bg-black bg-opacity-80 rounded-lg p-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-500 text-xs font-bold">REC</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:text-blue-400"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            
            <div className="flex-1 flex items-center space-x-2">
              <span className="text-white text-sm">{formatTime(currentTime)}</span>
              <div className="flex-1 bg-gray-600 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span className="text-white text-sm">{formatTime(duration)}</span>
            </div>
            
            <button className="text-white hover:text-blue-400">
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Camera Thumbnails */}
      <div className="grid grid-cols-3 gap-4">
        {cameras.slice(0, 3).map((camera, index) => (
          <div key={camera.id} className="relative group cursor-pointer">
            <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden">
              <iframe 
                src={`/thumbnails/live-feed-${index + 1}.html`}
                width="120"
                height="80"
                className="w-full h-full scale-100"
                frameBorder="0"
                title={`Live Feed ${camera.name}`}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all" />
              <div className="absolute bottom-1 left-1 right-1">
                <p className="text-white text-xs font-medium truncate">{camera.name}</p>
                <p className="text-gray-300 text-xs truncate">{camera.location}</p>
              </div>
              {/* Live indicator */}
              <div className="absolute top-1 right-1 flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-500 text-xs font-bold">LIVE</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
