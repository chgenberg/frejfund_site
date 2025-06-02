import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'linear-gradient(135deg, #0a1628 0%, #04111d 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
            }}
          />
          
          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              textAlign: 'center',
            }}
          >
            {/* Logo/Brain representation */}
            <div
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                marginBottom: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '100px',
              }}
            >
              🧠
            </div>
            
            {/* Title */}
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 20px 0',
                fontFamily: 'system-ui',
              }}
            >
              Analysera din affärsidé med AI
            </h1>
            
            {/* Subtitle */}
            <p
              style={{
                fontSize: '36px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0 0 40px 0',
                fontFamily: 'system-ui',
              }}
            >
              Få din investeringsscore på 10 minuter
            </p>
            
            {/* CTA */}
            <div
              style={{
                fontSize: '32px',
                padding: '20px 40px',
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                color: 'white',
                borderRadius: '50px',
                fontWeight: 'bold',
                fontFamily: 'system-ui',
              }}
            >
              FrejFund.com
            </div>

            <div style={{ fontSize: 24, color: '#9ca3af', marginTop: 20 }}>
              www.FrejFund.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
} 