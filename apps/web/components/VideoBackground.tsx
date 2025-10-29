'use client';

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  overlayGradient?: string;
  className?: string;
}

export default function VideoBackground({
  src,
  poster,
  overlay = true,
  overlayOpacity = 0.7,
  overlayGradient = 'from-blue-900 via-purple-900 to-blue-900',
  className = '',
}: VideoBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        <img src={poster} alt="Background" className="w-full h-full object-cover" />
      </video>

      {/* Overlay gradient */}
      {overlay && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${overlayGradient}`}
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}
