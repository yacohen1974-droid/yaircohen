import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'YourBrand - Brand Name | שירות מקצועי';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            border: '1px solid rgba(180,140,80,0.2)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            border: '1px solid rgba(180,140,80,0.1)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            zIndex: 10,
            textAlign: 'center',
            padding: '0 80px',
          }}
        >
          {/* Label */}
          <p
            style={{
              color: 'rgba(180,140,80,0.9)',
              fontSize: '14px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              margin: 0,
              fontFamily: 'sans-serif',
            }}
          >
            PSYCHOTHERAPY · HOLISTIC · Brand Name
          </p>

          {/* Brand name */}
          <h1
            style={{
              color: '#f5f0e8',
              fontSize: '96px',
              fontWeight: 700,
              margin: 0,
              fontFamily: 'serif',
              lineHeight: 1,
            }}
          >
            Brand Name
          </h1>

          {/* Divider */}
          <div
            style={{
              width: '60px',
              height: '1px',
              background: 'rgba(180,140,80,0.6)',
              display: 'flex',
            }}
          />

          {/* Tagline */}
          <p
            style={{
              color: 'rgba(245,240,232,0.75)',
              fontSize: '28px',
              margin: 0,
              fontFamily: 'sans-serif',
              fontWeight: 300,
            }}
          >
            שירות מקצועי · טבעון · עמק יזרעאל · אונליין
          </p>
        </div>

        {/* Bottom watermark */}
        <p
          style={{
            position: 'absolute',
            bottom: '32px',
            color: 'rgba(245,240,232,0.3)',
            fontSize: '14px',
            letterSpacing: '0.2em',
            fontFamily: 'sans-serif',
            margin: 0,
            display: 'flex',
          }}
        >
          www.brandname.co.il
        </p>
      </div>
    ),
    { ...size }
  );
}
