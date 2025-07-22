'use client'

import { Shield, Users, Settings, Search } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white">SecureSight</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-blue-400 hover:text-blue-300 font-medium">
              Dashboard
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300">
              Cameras
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300">
              Reports
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300">
              Analytics
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search incidents..."
              className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
          
          <button className="p-2 text-gray-400 hover:text-gray-300">
            <Users className="h-5 w-5" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-300">
            <Settings className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <span className="text-white text-sm">John Doe</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
