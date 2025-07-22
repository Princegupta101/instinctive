import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.incident.deleteMany()
  await prisma.camera.deleteMany()

  // Create cameras
  const cameras = await Promise.all([
    prisma.camera.create({
      data: {
        name: 'Shop Floor A',
        location: 'Manufacturing Floor A, Building 1',
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Vault',
        location: 'Security Vault, Underground Level',
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Entrance',
        location: 'Main Entrance, Ground Floor',
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Parking Lot',
        location: 'Employee Parking Lot, Zone A',
      },
    }),
  ])

  // Create incidents with timestamps spanning 24 hours
  const now = new Date()
  const incidents = []

  // Helper function to create timestamp
  const createTimestamp = (hoursAgo: number, minutesOffset: number = 0) => {
    const timestamp = new Date(now)
    timestamp.setHours(timestamp.getHours() - hoursAgo)
    timestamp.setMinutes(timestamp.getMinutes() + minutesOffset)
    return timestamp
  }

  // Recent incidents (unresolved) - More active incidents for better demo
  incidents.push(
    // Very recent incidents (last hour)
    {
      cameraId: cameras[0].id, // Shop Floor A
      type: 'Unauthorized Access',
      tsStart: createTimestamp(0, -10),
      tsEnd: createTimestamp(0, -5),
      thumbnailUrl: '/thumbnails/incident-1.svg',
      resolved: false,
    },
    {
      cameraId: cameras[2].id, // Entrance
      type: 'Gun Threat',
      tsStart: createTimestamp(0, -25),
      tsEnd: createTimestamp(0, -20),
      thumbnailUrl: '/thumbnails/incident-2.svg',
      resolved: false,
    },
    {
      cameraId: cameras[1].id, // Vault
      type: 'Motion Detection',
      tsStart: createTimestamp(0, -35),
      tsEnd: createTimestamp(0, -30),
      thumbnailUrl: '/thumbnails/incident-3.svg',
      resolved: false,
    },
    {
      cameraId: cameras[3].id, // Parking Lot
      type: 'Suspicious Activity',
      tsStart: createTimestamp(0, -45),
      tsEnd: createTimestamp(0, -40),
      thumbnailUrl: '/thumbnails/incident-4.svg',
      resolved: false,
    },
    
    // Recent incidents (last few hours)
    {
      cameraId: cameras[2].id, // Entrance
      type: 'Face Recognized',
      tsStart: createTimestamp(1, -15),
      tsEnd: createTimestamp(1, -10),
      thumbnailUrl: '/thumbnails/incident-3.svg',
      resolved: false,
    },
    {
      cameraId: cameras[0].id, // Shop Floor A
      type: 'Motion Detection',
      tsStart: createTimestamp(2, 0),
      tsEnd: createTimestamp(1, -50),
      thumbnailUrl: '/thumbnails/incident-4.svg',
      resolved: false,
    },
    {
      cameraId: cameras[3].id, // Parking Lot
      type: 'Unauthorized Access',
      tsStart: createTimestamp(2, -30),
      tsEnd: createTimestamp(2, -25),
      thumbnailUrl: '/thumbnails/incident-1.svg',
      resolved: false,
    },
    {
      cameraId: cameras[1].id, // Vault
      type: 'Gun Threat',
      tsStart: createTimestamp(3, -10),
      tsEnd: createTimestamp(3, -5),
      thumbnailUrl: '/thumbnails/incident-2.svg',
      resolved: false,
    },
    {
      cameraId: cameras[2].id, // Entrance
      type: 'Suspicious Activity',
      tsStart: createTimestamp(4, -20),
      tsEnd: createTimestamp(4, -15),
      thumbnailUrl: '/thumbnails/incident-4.svg',
      resolved: false,
    },
    {
      cameraId: cameras[0].id, // Shop Floor A
      type: 'Face Recognized',
      tsStart: createTimestamp(5, -30),
      tsEnd: createTimestamp(5, -25),
      thumbnailUrl: '/thumbnails/incident-3.svg',
      resolved: false,
    }
  )

  // Older incidents (mix of resolved and some still active)
  incidents.push(
    // Some recent resolved incidents
    {
      cameraId: cameras[1].id, // Vault
      type: 'Motion Detection',
      tsStart: createTimestamp(6, 0),
      tsEnd: createTimestamp(5, -55),
      thumbnailUrl: '/thumbnails/incident-4.svg',
      resolved: true,
    },
    {
      cameraId: cameras[3].id, // Parking Lot
      type: 'Face Recognized',
      tsStart: createTimestamp(7, -15),
      tsEnd: createTimestamp(7, -10),
      thumbnailUrl: '/thumbnails/incident-3.svg',
      resolved: true,
    },
    
    // Older resolved incidents
    {
      cameraId: cameras[1].id, // Vault
      type: 'Face Recognized',
      tsStart: createTimestamp(8, 0),
      tsEnd: createTimestamp(7, -55),
      thumbnailUrl: '/thumbnails/incident-3.svg',
      resolved: true,
    },
    {
      cameraId: cameras[0].id, // Shop Floor A
      type: 'Unauthorized Access',
      tsStart: createTimestamp(10, -45),
      tsEnd: createTimestamp(10, -40),
      thumbnailUrl: '/thumbnails/incident-1.svg',
      resolved: true,
    },
    {
      cameraId: cameras[3].id, // Parking Lot
      type: 'Suspicious Activity',
      tsStart: createTimestamp(12, 0),
      tsEnd: createTimestamp(11, -50),
      thumbnailUrl: '/thumbnails/incident-4.svg',
      resolved: true,
    },
    {
      cameraId: cameras[2].id, // Entrance
      type: 'Gun Threat',
      tsStart: createTimestamp(15, -20),
      tsEnd: createTimestamp(15, -15),
      thumbnailUrl: '/thumbnails/incident-2.svg',
      resolved: true,
    },
    {
      cameraId: cameras[1].id, // Vault
      type: 'Unauthorized Access',
      tsStart: createTimestamp(18, 0),
      tsEnd: createTimestamp(17, -55),
      thumbnailUrl: '/thumbnails/incident-1.svg',
      resolved: true,
    },
    
    // Some older unresolved incidents to show variety
    {
      cameraId: cameras[0].id, // Shop Floor A
      type: 'Motion Detection',
      tsStart: createTimestamp(20, -30),
      tsEnd: createTimestamp(20, -25),
      thumbnailUrl: '/thumbnails/incident-4.svg',
      resolved: false,
    },
    {
      cameraId: cameras[3].id, // Parking Lot
      type: 'Gun Threat',
      tsStart: createTimestamp(22, 0),
      tsEnd: createTimestamp(21, -58),
      thumbnailUrl: '/thumbnails/incident-2.svg',
      resolved: true,
    }
  )

  // Insert all incidents
  for (const incident of incidents) {
    await prisma.incident.create({
      data: incident,
    })
  }

  console.log('Seed data created successfully!')
  console.log(`Created ${cameras.length} cameras`)
  console.log(`Created ${incidents.length} incidents`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
