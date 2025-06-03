'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Wind, 
  Thermometer, 
  Home, 
  Settings,
  Sun,
  Moon,
  ChevronUp,
  ChevronDown,
  Car,
  Shield,
  Power,
  LucideProps
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'light' | 'blinds' | 'ac' | 'garage';
  room: string;
  isOn: boolean;
  value?: number;
  icon: React.ComponentType<LucideProps>;
}

const SmartHomeApp = () => {
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Światło główne', type: 'light', room: 'Salon', isOn: false, value: 80, icon: Lightbulb },
    { id: '2', name: 'Lampa nocna', type: 'light', room: 'Sypialnia', isOn: true, value: 30, icon: Lightbulb },
    { id: '3', name: 'Światło kuchenne', type: 'light', room: 'Kuchnia', isOn: false, value: 100, icon: Lightbulb },
    { id: '4', name: 'Rolety salon', type: 'blinds', room: 'Salon', isOn: false, value: 75, icon: Sun },
    { id: '5', name: 'Rolety sypialnia', type: 'blinds', room: 'Sypialnia', isOn: true, value: 20, icon: Moon },
    { id: '6', name: 'Klimatyzacja salon', type: 'ac', room: 'Salon', isOn: true, value: 22, icon: Wind },
    { id: '7', name: 'Klimatyzacja sypialnia', type: 'ac', room: 'Sypialnia', isOn: false, value: 24, icon: Thermometer },
    { id: '8', name: 'Brama garażowa', type: 'garage', room: 'Garaż', isOn: false, value: 0, icon: Car },
  ]);

  const [selectedRoom, setSelectedRoom] = useState<string>('Wszystkie');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const rooms = ['Wszystkie', 'Salon', 'Sypialnia', 'Kuchnia', 'Garaż'];

  const toggleDevice = (id: string) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, isOn: !device.isOn } : device
    ));
  };

  const updateDeviceValue = (id: string, newValue: number) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, value: newValue } : device
    ));
  };

  const filteredDevices = selectedRoom === 'Wszystkie' 
    ? devices 
    : devices.filter(device => device.room === selectedRoom);

  const getDeviceStatusColor = (device: Device) => {
    if (!device.isOn) return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    
    switch (device.type) {
      case 'light':
        return 'bg-yellow-200 dark:bg-yellow-700/80 text-yellow-800 dark:text-yellow-200';
      case 'blinds':
        return 'bg-blue-200 dark:bg-blue-700/80 text-blue-800 dark:text-blue-200';
      case 'ac':
        return 'bg-cyan-200 dark:bg-cyan-700/80 text-cyan-800 dark:text-cyan-200';
      case 'garage':
        return 'bg-green-200 dark:bg-green-700/80 text-green-800 dark:text-green-200';
      default:
        return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getDeviceValueLabel = (device: Device) => {
    switch (device.type) {
      case 'light':
        return `${device.value}%`;
      case 'blinds':
        return `${device.value}% otwarte`;
      case 'ac':
        return `${device.value}°C`;
      case 'garage':
        return device.isOn ? 'Otwarta' : 'Zamknięta';
      default:
        return '';
    }
  };

  const renderDeviceControl = (device: Device) => {
    if (device.type === 'garage') {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleDevice(device.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            device.isOn 
              ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white' 
              : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white'
          }`}
        >
          {device.isOn ? 'Zamknij' : 'Otwórz'}
        </motion.button>
      );
    }

    return (
      <div className="flex items-center space-x-3">
        <div className="flex flex-col items-center space-y-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => updateDeviceValue(device.id, Math.min((device.value || 0) + 10, 100))}
            className="p-1 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors"
            disabled={!device.isOn}
          >
            <ChevronUp size={16} />
          </motion.button>
          <span className="text-lg font-bold min-w-[60px] text-center text-gray-800 dark:text-gray-200">
            {getDeviceValueLabel(device)}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => updateDeviceValue(device.id, Math.max((device.value || 0) - 10, 0))}
            className="p-1 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors"
            disabled={!device.isOn}
          >
            <ChevronDown size={16} />
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-3">
            <Home className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Smart Home</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <Settings size={20} />
            </motion.button>
          </div>
        </motion.header>

        {/* Room Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {rooms.map((room) => (
              <motion.button
                key={room}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRoom(room)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedRoom === room
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {room}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Światła</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {devices.filter(d => d.type === 'light' && d.isOn).length}
                </p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Klimatyzacja</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {devices.filter(d => d.type === 'ac' && d.isOn).length}
                </p>
              </div>
              <Wind className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rolety</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {devices.filter(d => d.type === 'blinds' && d.isOn).length}
                </p>
              </div>
              <Sun className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bezpieczeństwo</p>
                <p className="text-2xl font-bold text-green-500 dark:text-green-400">OK</p>
              </div>
              <Shield className="h-8 w-8 text-green-500 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Devices Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredDevices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 rounded-xl shadow-sm transition-all duration-300 border border-gray-200 dark:border-gray-600 ${
                  getDeviceStatusColor(device)
                } hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <device.icon 
                      size={24} 
                      className={device.isOn ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'} 
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {device.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {device.room}
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleDevice(device.id)}
                    className={`p-2 rounded-full transition-colors ${
                      device.isOn 
                        ? 'bg-white/30 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/30 text-gray-800 dark:text-gray-200' 
                        : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Power size={16} />
                  </motion.button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full transition-colors ${
                      device.isOn ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-400 dark:bg-gray-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {device.isOn ? 'Włączone' : 'Wyłączone'}
                    </span>
                  </div>
                  
                  {device.isOn && renderDeviceControl(device)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-gray-500 dark:text-gray-400"
        >
          <p>Smart Home POC - Next.js 15+ z TypeScript i Tailwind CSS</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default SmartHomeApp;