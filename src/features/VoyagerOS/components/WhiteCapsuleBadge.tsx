import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Lock, Settings, RefreshCw, Zap, Laptop, Smartphone, Headphones, Wifi, Bluetooth } from 'lucide-react';
import { SoundIcon } from './icons/SoundIcon';
import { SoundMutedIcon } from './icons/SoundMutedIcon';
import { WifiIcon } from './icons/WifiIcon';
import { BatteryIcon } from './icons/BatteryIcon';
import { BluetoothIcon } from './icons/BluetoothIcon';

// --- TYPES ---
type DetailView = 'wifi' | 'bluetooth' | 'battery' | null;

interface WhiteCapsuleBadgeProps {
  height?: number;
  onClick?: () => void;
}

interface MenuContainerProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  icon: React.ReactNode;
  headerAction?: React.ReactNode;
}

interface SystemIconButtonProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  title: string;
  activeColor: string;
  isActive: boolean;
  isOpen: boolean;
}

export const WhiteCapsuleBadge: React.FC<WhiteCapsuleBadgeProps> = ({ height = 70, onClick }) => {
  const [now, setNow] = useState(new Date());
  
  // System States
  const [activeDetail, setActiveDetail] = useState<DetailView>(null);
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isBtOn, setIsBtOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const width = height * 5.2; 
  
  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), 1000);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDetail(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        clearInterval(timerId);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // -- Handlers --
  const toggleDetail = (e: React.MouseEvent, view: DetailView) => {
    e.stopPropagation();
    setActiveDetail(prev => prev === view ? null : view);
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  // -- Time Formatting Sincronizado --
  const timeString = new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);

  const dayString = now.toLocaleDateString('es-MX', { weekday: 'short' });
  const dateString = now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });

  return (
    <div className="relative" ref={containerRef}>
      
      {/* --- DETAILED POPOVERS --- */}
      <AnimatePresence>
        {activeDetail === 'wifi' && (
             <WifiMenu onClose={() => setActiveDetail(null)} isOn={isWifiOn} toggleOn={() => setIsWifiOn(!isWifiOn)} />
        )}
        {activeDetail === 'bluetooth' && (
             <BluetoothMenu onClose={() => setActiveDetail(null)} isOn={isBtOn} toggleOn={() => setIsBtOn(!isBtOn)} />
        )}
        {activeDetail === 'battery' && (
             <BatteryMenu onClose={() => setActiveDetail(null)} />
        )}
      </AnimatePresence>

      {/* --- MAIN CAPSULE --- */}
      <div
        onClick={onClick}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && onClick) onClick() }}
        role="button"
        tabIndex={0}
        className="relative flex items-center justify-between bg-black/40 backdrop-blur-[45px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6)] group cursor-pointer z-10 overflow-hidden px-2 py-0.5 gap-1.5 border border-white/10"
        style={{
          height: height,
          borderRadius: height / 2,
        }}
      >
        {/* --- LEFT CLUSTER: SYSTEM TOGGLES --- */}
        <div className="h-full bg-white/6 rounded-full flex items-center px-1.5 gap-1 shadow-inner">
          <SystemIconButton 
              onClick={(e) => toggleDetail(e, 'wifi')}
              isActive={isWifiOn}
              title="Wi-Fi"
              activeColor="#3b82f6"
              isOpen={activeDetail === 'wifi'}
          >
            <WifiIcon size={12} color={isWifiOn ? "white" : "#ffffff60"} />
          </SystemIconButton>
          
          <SystemIconButton 
              onClick={(e) => toggleDetail(e, 'bluetooth')}
              isActive={isBtOn}
              title="Bluetooth"
              activeColor="#2563eb"
              isOpen={activeDetail === 'bluetooth'}
          >
            <BluetoothIcon size={12} color={isBtOn ? "white" : "#ffffff60"} />
          </SystemIconButton>

          <SystemIconButton 
              onClick={handleMuteToggle}
              isActive={!isMuted}
              title="Volume"
              activeColor="#cbd5e1"
              isOpen={false}
          >
            {isMuted ? <SoundMutedIcon size={12} color="#ffffff60" /> : <SoundIcon size={12} color="white" />}
          </SystemIconButton>
           
          <SystemIconButton 
              onClick={(e) => toggleDetail(e, 'battery')}
              isActive={true}
              title="Battery"
              activeColor="#22c55e"
              isOpen={activeDetail === 'battery'}
          >
             <BatteryIcon size={12} color={activeDetail === 'battery' ? 'white' : '#10b981'} />
          </SystemIconButton>
        </div>

        {/* --- CENTER: DATE & TIME --- */}
        <div className="flex flex-col items-end justify-center px-1 select-none leading-none">
            <span className="text-white font-semibold text-[11px] tracking-tight font-mono">
                {timeString}
            </span>
            <span className="text-white/40 text-[8px] font-medium tracking-wide uppercase mt-0.5">
                {dayString} {dateString}
            </span>
        </div>
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const ToggleSwitch = ({ isOn, onToggle }: { isOn: boolean, onToggle: () => void }) => (
    <div 
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors duration-500 cursor-pointer ${isOn ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-white/10'}`}
    >
        <motion.div 
            className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm"
            animate={{ x: isOn ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
    </div>
);

// 1. Wifi Menu
const WifiMenu = ({ onClose, isOn, toggleOn }: { onClose: () => void, isOn: boolean, toggleOn: () => void }) => {
    const networks = [
        { ssid: 'Voyager_5G', signal: 100, secured: true, connected: true },
        { ssid: 'Starbucks_Free_WiFi', signal: 80, secured: false, connected: false },
        { ssid: 'iPhone 15 Pro', signal: 90, secured: true, connected: false },
        { ssid: 'Office_Network', signal: 40, secured: true, connected: false },
    ];

    return (
        <MenuContainer title="Wi-Fi" onClose={onClose} icon={<WifiIcon size={20} />} headerAction={<ToggleSwitch isOn={isOn} onToggle={toggleOn} />}>
            {isOn ? (
                <div className="flex flex-col gap-2">
                    {networks.map((net) => (
                        <div 
                            key={net.ssid}
                            className={`group relative flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${
                                net.connected 
                                ? 'bg-blue-600/25 shadow-[0_0_20px_rgba(37,99,235,0.2)]' 
                                : 'bg-transparent hover:bg-white/6'
                            }`}
                        >
                            <div className="flex items-center gap-4 z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${net.connected ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/50 group-hover:bg-white/20 group-hover:text-white'}`}>
                                   <Wifi size={16} />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className={`text-[15px] font-medium tracking-wide ${net.connected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{net.ssid}</span>
                                    {net.connected && <span className="text-[11px] text-blue-300 font-medium">Connected</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 z-10">
                                {net.secured && <Lock size={14} className="text-white/30" />}
                                <div className="flex items-end gap-[2px] h-3.5">
                                    {[0.4, 0.6, 0.8, 1].map((h, i) => (
                                        <div key={i} className={`w-1 rounded-sm transition-colors ${ (net.signal / 100) >= h ? (net.connected ? 'bg-white' : 'bg-white/80') : 'bg-white/20'}`} style={{ height: `${h * 100}%` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="mt-2 pt-3 flex justify-end">
                        <button className="text-xs text-white/50 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors">
                            <Settings size={14} /> Network Settings
                        </button>
                    </div>
                </div>
            ) : (
                <div className="h-40 flex flex-col items-center justify-center text-white/30 gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-1">
                        <WifiIcon size={32} color="currentColor" />
                    </div>
                    <span className="text-sm font-medium">Wi-Fi is turned off</span>
                </div>
            )}
        </MenuContainer>
    );
}

// 2. Bluetooth Menu
const BluetoothMenu = ({ onClose, isOn, toggleOn }: { onClose: () => void, isOn: boolean, toggleOn: () => void }) => {
    const devices = [
        { name: 'AirPods Pro', type: 'audio', battery: 85, connected: true },
        { name: 'MX Master 3S', type: 'mouse', battery: 60, connected: true },
        { name: 'Keychron K2', type: 'keyboard', battery: null, connected: false },
    ];
    return (
         <MenuContainer title="Bluetooth" onClose={onClose} icon={<BluetoothIcon size={20} />} headerAction={<ToggleSwitch isOn={isOn} onToggle={toggleOn} />}>
            {isOn ? (
                <div className="flex flex-col gap-2">
                    <div className="text-[11px] uppercase font-bold text-white/40 px-3 mb-1 tracking-wider">My Devices</div>
                    {devices.map((dev) => (
                        <div key={dev.name} className={`group relative flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${dev.connected ? 'bg-blue-600/25 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'bg-transparent hover:bg-white/6'}`}>
                            <div className="flex items-center gap-4 z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${dev.connected ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/50 group-hover:bg-white/20 group-hover:text-white'}`}>
                                    {dev.type === 'audio' && <Headphones size={16} />}
                                    {dev.type === 'mouse' && <Laptop size={16} />} 
                                    {dev.type === 'keyboard' && <Laptop size={16} />}
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className={`text-[15px] font-medium ${dev.connected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{dev.name}</span>
                                    {dev.connected ? (
                                        <span className="text-[11px] text-blue-300 flex items-center gap-1 font-medium">Connected {dev.battery && `• ${dev.battery}%`}</span>
                                    ) : (
                                        <span className="text-[11px] text-white/40 group-hover:text-white/60">Not Connected</span>
                                    )}
                                </div>
                            </div>
                            {dev.connected && (<div className="z-10"><div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6]" /></div>)}
                        </div>
                    ))}
                    <button className="w-full mt-2 py-3 rounded-2xl bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all flex items-center justify-center gap-2 group">
                         <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-700" /> <span className="text-sm font-medium">Pair new device</span>
                    </button>
                </div>
            ) : (
                 <div className="h-40 flex flex-col items-center justify-center text-white/30 gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-1"><Bluetooth size={32} color="currentColor" /></div>
                    <span className="text-sm font-medium">Bluetooth is off</span>
                </div>
            )}
         </MenuContainer>
    );
}

// 3. Battery Menu
const BatteryMenu = ({ onClose }: { onClose: () => void }) => {
    return (
        <MenuContainer title="Power" onClose={onClose} icon={<BatteryIcon size={20} />}>
            <div className="p-1 flex flex-col gap-6">
                <div className="flex items-center justify-between bg-gradient-to-br from-white/10 to-transparent p-5 rounded-3xl">
                    <div className="flex flex-col gap-1">
                         <div className="flex items-baseline gap-1"><span className="text-4xl font-bold text-white tracking-tight">85</span><span className="text-xl text-white/60">%</span></div>
                         <span className="text-xs text-green-400 font-medium tracking-wide flex items-center gap-1"><Zap size={12} fill="currentColor" /> Charging</span>
                    </div>
                    <div className="relative w-14 h-14">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            <path className="text-green-500 drop-shadow-[0_0_4px_rgba(34,197,94,0.5)]" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
                <div className="flex flex-col gap-3 px-1">
                    <div className="flex justify-between text-[11px] font-bold text-white/40 uppercase tracking-widest"><span>Efficiency</span><span>Performance</span></div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative shadow-inner">
                         <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-green-500 via-emerald-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                         <div className="absolute top-1/2 left-3/4 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg cursor-grab active:scale-95 transition-transform" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-1">
                     <button className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center"><Zap size={16} className="text-yellow-400 fill-current" /></div>
                             <div className="flex flex-col items-start"><span className="text-sm font-medium text-white">Battery Saver</span><span className="text-[10px] text-white/50">Reduces background activity</span></div>
                        </div>
                        <ToggleSwitch isOn={false} onToggle={() => {}} />
                     </button>
                </div>
            </div>
        </MenuContainer>
    );
}

const MenuContainer: React.FC<MenuContainerProps> = ({ title, children, onClose, icon, headerAction }) => (
    <motion.div
        className="absolute bottom-[calc(100%+24px)] right-0 w-[380px] bg-black/70 backdrop-blur-[60px] rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.85)] z-50 overflow-hidden flex flex-col origin-bottom-right"
        style={{
          boxShadow: '0 30px 70px -10px rgba(0,0,0,0.85), inset 0 1px 1.5px rgba(255,255,255,0.15)'
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
        onClick={(e) => e.stopPropagation()} 
    >
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <div className="relative flex items-center justify-between p-6 pb-2 z-10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shadow-inner">{icon}</div>
                <h3 className="text-xl font-semibold text-white tracking-tight">{title}</h3>
            </div>
            {headerAction}
        </div>
        <div className="p-6 pt-4 custom-scrollbar max-h-[500px] overflow-y-auto relative z-10">{children}</div>
    </motion.div>
);

const SystemIconButton: React.FC<SystemIconButtonProps> = ({ children, onClick, title, activeColor, isActive, isOpen }) => (
    <button 
        onClick={onClick}
        className="relative p-1.5 rounded-full transition-all duration-300 group/btn hover:bg-white/10"
        title={title}
    >
        <div 
            className="absolute inset-0 blur-lg transition-all duration-500 rounded-full"
            style={{ 
                backgroundColor: activeColor, 
                opacity: isOpen ? 0.6 : 0,
                transform: isOpen ? 'scale(1.5)' : 'scale(0.8)' 
            }}
        />
        <div className={`relative z-10 transition-transform duration-200 group-active/btn:scale-95`}>
            {children}
        </div>
    </button>
);
