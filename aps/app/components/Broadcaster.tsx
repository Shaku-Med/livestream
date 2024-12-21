'use client'

import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

export default function Broadcaster() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const socketRef = useRef<any>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    socketRef.current = io()

    socketRef.current.on('watcher', (id: string) => {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      })

      pcRef.current = peerConnection

      const stream = videoRef.current?.srcObject as MediaStream
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream))

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('candidate', id, event.candidate)
        }
      }

      peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socketRef.current.emit('offer', id, peerConnection.localDescription)
        })
    })

    socketRef.current.on('answer', (id: string, description: RTCSessionDescriptionInit) => {
      pcRef.current?.setRemoteDescription(description)
    })

    socketRef.current.on('candidate', (id: string, candidate: RTCIceCandidateInit) => {
      pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate))
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      socketRef.current.emit('broadcaster')
      setIsStreaming(true)
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} autoPlay muted playsInline className="w-full max-w-2xl mb-4" />
      <button
        onClick={startStreaming}
        disabled={isStreaming}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {isStreaming ? 'Streaming...' : 'Start Streaming'}
      </button>
    </div>
  )
}

