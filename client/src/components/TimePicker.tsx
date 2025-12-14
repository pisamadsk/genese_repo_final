import { useState, useRef, useEffect } from "react";

interface TimePickerProps {
  value: { hours: number; minutes: number };
  onChange: (value: { hours: number; minutes: number }) => void;
  maxHours?: number;
  maxMinutes?: number;
}

export default function TimePicker({
  value,
  onChange,
  maxHours = 23,
  maxMinutes = 59,
}: TimePickerProps) {
  const [selectedHours, setSelectedHours] = useState(value.hours);
  const [selectedMinutes, setSelectedMinutes] = useState(value.minutes);
  const [isScrollingHours, setIsScrollingHours] = useState(false);
  const [isScrollingMinutes, setIsScrollingMinutes] = useState(false);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemHeight = 50;
  const visibleItems = 3;
  const containerHeight = itemHeight * visibleItems;

  // Generate arrays
  const hours = Array.from({ length: maxHours + 1 }, (_, i) => i);
  const minutes = Array.from({ length: maxMinutes + 1 }, (_, i) => i);

  // Snap to nearest item with smooth animation
  const snapToItem = (element: HTMLDivElement | null, index: number, isHours: boolean) => {
    if (!element) return;
    
    const targetScroll = index * itemHeight;
    const currentScroll = element?.scrollTop || 0;
    const distance = targetScroll - currentScroll;
    const duration = 300; // ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: cubic-bezier for smooth bounce effect
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easeOutBounce = (t: number) => {
        if (t < 0.36) return 7.5625 * t * t;
        if (t < 0.73) return 7.5625 * (t - 0.54) * (t - 0.54) + 0.75;
        if (t < 0.91) return 7.5625 * (t - 0.84) * (t - 0.84) + 0.9375;
        return 7.5625 * (t - 0.95) * (t - 0.95) + 0.984375;
      };

      const easedProgress = easeOutBounce(progress);
      element.scrollTop = currentScroll + distance * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  // Handle scroll for hours
  const handleHoursScroll = () => {
    if (!hoursRef.current) return;
    setIsScrollingHours(true);

    // Clear previous timeout
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    // Set new timeout for snap
    scrollTimeoutRef.current = setTimeout(() => {
      if (!hoursRef.current) return;
      const scrollTop = hoursRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(index, maxHours));
      
      setSelectedHours(clampedIndex);
      onChange({ hours: clampedIndex, minutes: selectedMinutes });
      snapToItem(hoursRef.current, clampedIndex, true);
      setIsScrollingHours(false);
    }, 150);
  };

  // Handle scroll for minutes
  const handleMinutesScroll = () => {
    if (!minutesRef.current) return;
    setIsScrollingMinutes(true);

    // Clear previous timeout
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    // Set new timeout for snap
    scrollTimeoutRef.current = setTimeout(() => {
      if (!minutesRef.current) return;
      const scrollTop = minutesRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(index, maxMinutes));
      
      setSelectedMinutes(clampedIndex);
      onChange({ hours: selectedHours, minutes: clampedIndex });
      snapToItem(minutesRef.current, clampedIndex, false);
      setIsScrollingMinutes(false);
    }, 150);
  };

  // Initialize scroll position
  useEffect(() => {
    if (hoursRef.current) {
      hoursRef.current.scrollTop = value.hours * itemHeight;
      setSelectedHours(value.hours);
    }
    if (minutesRef.current) {
      minutesRef.current.scrollTop = value.minutes * itemHeight;
      setSelectedMinutes(value.minutes);
    }
  }, [value.hours, value.minutes, itemHeight]);

  return (
    <div className="flex gap-8 items-center justify-center py-8">
      <style>{`
        .time-picker-scroll {
          scroll-behavior: smooth;
        }
        
        .time-picker-scroll::-webkit-scrollbar {
          width: 4px;
        }
        
        .time-picker-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .time-picker-scroll::-webkit-scrollbar-thumb {
          background: hsl(var(--primary));
          border-radius: 2px;
          opacity: 0.6;
        }
        
        .time-picker-scroll::-webkit-scrollbar-thumb:hover {
          opacity: 1;
        }
      `}</style>

      {/* Hours Picker */}
      <div className="flex flex-col items-center">
        <div
          ref={hoursRef}
          onScroll={handleHoursScroll}
          className="time-picker-scroll relative overflow-y-scroll overflow-x-hidden bg-gradient-to-b from-transparent via-foreground/10 to-transparent rounded-lg border border-border/50 transition-all"
          style={{
            height: `${containerHeight}px`,
            width: "70px",
          }}
        >
          <div className="flex flex-col">
            {/* Top padding */}
            <div style={{ height: `${itemHeight}px` }} />

            {/* Hours items */}
            {hours.map((hour) => (
              <div
                key={hour}
                className={`flex items-center justify-center font-semibold transition-all flex-shrink-0 ${
                  selectedHours === hour
                    ? "text-foreground text-3xl scale-110"
                    : "text-muted-foreground/40 text-lg scale-100"
                }`}
                style={{
                  height: `${itemHeight}px`,
                  transitionDuration: isScrollingHours ? "0ms" : "200ms",
                }}
              >
                {String(hour).padStart(2, "0")}
              </div>
            ))}

            {/* Bottom padding */}
            <div style={{ height: `${itemHeight}px` }} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 font-medium uppercase tracking-wider">
          hours
        </p>
      </div>

      {/* Separator */}
      <div className="text-4xl font-bold text-foreground">:</div>

      {/* Minutes Picker */}
      <div className="flex flex-col items-center">
        <div
          ref={minutesRef}
          onScroll={handleMinutesScroll}
          className="time-picker-scroll relative overflow-y-scroll overflow-x-hidden bg-gradient-to-b from-transparent via-foreground/10 to-transparent rounded-lg border border-border/50 transition-all"
          style={{
            height: `${containerHeight}px`,
            width: "70px",
          }}
        >
          <div className="flex flex-col">
            {/* Top padding */}
            <div style={{ height: `${itemHeight}px` }} />

            {/* Minutes items */}
            {minutes.map((minute) => (
              <div
                key={minute}
                className={`flex items-center justify-center font-semibold transition-all flex-shrink-0 ${
                  selectedMinutes === minute
                    ? "text-foreground text-3xl scale-110"
                    : "text-muted-foreground/40 text-lg scale-100"
                }`}
                style={{
                  height: `${itemHeight}px`,
                  transitionDuration: isScrollingMinutes ? "0ms" : "200ms",
                }}
              >
                {String(minute).padStart(2, "0")}
              </div>
            ))}

            {/* Bottom padding */}
            <div style={{ height: `${itemHeight}px` }} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 font-medium uppercase tracking-wider">
          minutes
        </p>
      </div>
    </div>
  );
}
