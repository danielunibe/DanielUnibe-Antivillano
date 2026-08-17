import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { NotificationIcon } from '../../icons/NotificationIcon';
import { FlatDockButton } from '../../FlatDockButton';
import { viewAnimation } from '../animations';

interface NotificationsDockViewProps {
  onClose: () => void;
  count: number;
}

export const NotificationsDockView: React.FC<NotificationsDockViewProps> = ({ onClose, count }) => {
  return (
    <motion.div
      className="flex items-center gap-3 w-full"
      style={{ width: '350px' }}
      key='notifications'
      {...viewAnimation}
    >
      <div className="flex-shrink-0">
        <NotificationIcon size={28} color="white" />
      </div>
      <p className="flex-grow font-semibold text-lg text-white">
        Notifications {count > 0 && <span className="text-white/70">({count})</span>}
      </p>
      <FlatDockButton label="Close" onClick={onClose}>
        <X size={24} color="white" />
      </FlatDockButton>
    </motion.div>
  );
};
