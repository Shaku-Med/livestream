import Broadcaster from './components/Broadcaster'
import Viewer from './components/Viewer'
import React from 'react'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Live Streaming App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Broadcaster</h2>
          <Broadcaster />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Viewer</h2>
          <Viewer />
        </div>
      </div>
    </main>
  )
}

