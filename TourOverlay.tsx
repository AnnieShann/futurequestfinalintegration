import { motion } from 'framer-motion';

export interface Cutout {
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
}

interface TourOverlayProps {
  cutout: Cutout | null;
  onBackdropClick?: () => void;
}

const TourOverlay = ({ cutout, onBackdropClick }: TourOverlayProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-[1100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onBackdropClick}
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {cutout && (
              <rect
                x={cutout.x}
                y={cutout.y}
                width={cutout.w}
                height={cutout.h}
                rx={cutout.rx}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.65)"
          mask="url(#tour-mask)"
        />
      </svg>

      {cutout && (
        <div
          className="absolute border-2 border-primary/40 animate-pulse pointer-events-none"
          style={{
            left: cutout.x,
            top: cutout.y,
            width: cutout.w,
            height: cutout.h,
            borderRadius: cutout.rx,
          }}
        />
      )}
    </motion.div>
  );
};

export default TourOverlay;
