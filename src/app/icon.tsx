import { ImageResponse } from 'next/og'
import { GraduationCap } from 'lucide-react'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#3498db', // primary color
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: 8
        }}
      >
        <GraduationCap size={20} />
      </div>
    ),
    {
      ...size,
    }
  )
}
