'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

export default function LiveStream() {
  const [isPlaying, setIsPlaying] = useState(false)
  const streamUrl = 'https://example.com/live-stream-url' // Replace with your actual stream URL

  return (
    <div className="w-full max-w-3xl">
      <div className="aspect-video bg-gray-800 mb-4">
        <ReactPlayer
          url={streamUrl}
          playing={isPlaying}
          controls
          width="100%"
          height="100%"
        />
      </div>
      <Button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-full"
      >
        {isPlaying ? 'Pause Stream' : 'Start Stream'}
      </Button>
    </div>
  )
}

