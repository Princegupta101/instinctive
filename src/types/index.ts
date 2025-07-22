export interface Camera {
  id: string
  name: string
  location: string
  createdAt: string
  updatedAt: string
}

export interface Incident {
  id: string
  cameraId: string
  camera: Camera
  type: string
  tsStart: string
  tsEnd: string
  thumbnailUrl: string
  resolved: boolean
  createdAt: string
  updatedAt: string
}

export type IncidentType = 'Unauthorized Access' | 'Gun Threat' | 'Face Recognized' | 'Suspicious Activity'
