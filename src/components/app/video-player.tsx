export function VideoPlayer({
  src,
  autoplay = false,
  loop = true,
  poster,
  className,
  alt = "",
}: {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  poster?: string;
  className?: string;
  alt?: string;
}) {
  return (
    <video
      className={className}
      src={src}
      poster={poster || undefined}
      autoPlay={autoplay}
      muted={autoplay}
      loop={loop}
      controls={!autoplay}
      playsInline
      preload="metadata"
      aria-label={alt}
    >
      Your browser does not support HTML5 video.
    </video>
  );
}