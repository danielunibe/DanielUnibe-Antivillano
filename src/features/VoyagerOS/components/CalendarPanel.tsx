import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const CalendarPanel = forwardRef<HTMLDivElement>((_props, ref) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  // Month details
  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week for the 1st

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDayIndex });

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      className="absolute bottom-[calc(100%+20px)] right-0 w-72 rounded-2xl bg-black/60 backdrop-blur-3xl p-4 text-white"
      style={{
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 1.5px rgba(255, 255, 255, 0.15)'
      }}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-base capitalize">{monthName} {year}</h3>
        <div className="flex gap-1">
          <button 
            type="button"
            onClick={handlePrevMonth}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 cursor-pointer active:scale-90 transition-transform text-white/80 hover:text-white"
          >
            &lt;
          </button>
          <button 
            type="button"
            onClick={handleNextMonth}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 cursor-pointer active:scale-90 transition-transform text-white/80 hover:text-white"
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {weekDays.map((day, i) => (
          <div key={`${day}-${i}`} className="text-xs font-bold text-white/60 py-1">
            {day}
          </div>
        ))}
        
        {/* Fill in blank cells for original spacing */}
        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} className="h-8 w-8" />
        ))}

        {daysArray.map((day) => (
          <div
            key={day}
            className={`flex items-center justify-center h-8 w-8 mx-auto rounded-full cursor-pointer hover:bg-white/10 text-sm transition-all ${
              isToday(day) 
                ? 'bg-blue-500 font-bold shadow-[0_0_8px_rgba(59,130,246,0.6)]' 
                : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </motion.div>
  );
});

CalendarPanel.displayName = 'CalendarPanel';
