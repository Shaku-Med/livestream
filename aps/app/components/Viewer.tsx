'use client'

import { useEffect, useRef } from 'react'
import io from 'socket.io-client'

export default function Viewer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const socketRef = useRef<any>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)

  useEffect(() => {
    socketRef.current = io()

    socketRef.current.on('broadcaster', () => {
      socketRef.current.emit('watcher')
    })

    socketRef.current.on('offer', (id: string, description: RTCSessionDescriptionInit) => {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      })

      pcRef.current = peerConnection

      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socketRef.current.emit('answer', id, peerConnection.localDescription)
        })

      peerConnection.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0]
        }
      }

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('candidate', id, event.candidate)
        }
      }
    })

    socketRef.current.on('candidate', (id: string, candidate: RTCIceCandidateInit) => {
      pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate))
    })

    socketRef.current.on('disconnectPeer', () => {
      if (pcRef.current) {
        pcRef.current.close()
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} autoPlay playsInline className="w-full max-w-2xl" />
    </div>
  )
}

