'use client';
import { useState, useEffect, useRef, TouchEvent } from 'react';
import { 
  BookOpen, Hourglass, Sun, Moon, BedDouble, Droplets, 
  Smartphone, Laptop, Gamepad2, Tv, Wine, Coffee, Cookie,
  Candy, Music, ShoppingBag, Users, Dumbbell,
  Users as Fraternity, Utensils, Church, CheckCircle, XCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// Define the start and end dates of Lent 2025
const ASH_WEDNESDAY = new Date('2025-03-05');
const EASTER_SUNDAY = new Date('2025-04-20');

// Calculate the total days of Lent
const TOTAL_DAYS = Math.ceil((EASTER_SUNDAY.getTime() - ASH_WEDNESDAY.getTime()) / (1000 * 60 * 60 * 24));

type Discipline = {
  id: string;
  name: string;
  icon: React.ReactNode;
  frequency: 'daily' | 'weekday' | 'weekly';
  days?: string[]; // For weekly disciplines
};

type Progress = {
  [date: string]: {
    [disciplineId: string]: 'completed' | 'failed' | 'skipped';
  };
};

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate] = useState(new Date()); // Actual current date
  const [progress, setProgress] = useState<Progress>({});
  const [showCompleted, setShowCompleted] = useState(true);
  const touchStartX = useRef<number | null>(null);
  
  // Load progress from localStorage on initial load
  useEffect(() => {
    const savedProgress = localStorage.getItem('exodusProgress');
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Failed to parse saved progress:', e);
      }
    }
  }, []);
  
  // Save to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem('exodusProgress', JSON.stringify(progress));
  }, [progress]);
  
  const disciplines: Discipline[] = [
    { id: 'reading', name: 'Read Exodus reading & reflection', icon: <BookOpen />, frequency: 'daily' },
    { id: 'holyHour', name: 'Make a Holy Hour', icon: <Hourglass />, frequency: 'daily' },
    { id: 'morningOffering', name: 'Morning Offering', icon: <Sun />, frequency: 'daily' },
    { id: 'nightlyExamen', name: 'Nightly Examen', icon: <Moon />, frequency: 'daily' },
    { id: 'sleep', name: 'Full night\'s sleep (8hrs)', icon: <BedDouble />, frequency: 'daily' },
    { id: 'coldShower', name: 'Take Cold Showers', icon: <Droplets />, frequency: 'daily' },
    { id: 'smartphone', name: 'Avoid unnecessary smartphone use', icon: <Smartphone />, frequency: 'daily' },
    { id: 'computer', name: 'Avoid unnecessary computer use', icon: <Laptop />, frequency: 'daily' },
    { id: 'games', name: 'Give up video games', icon: <Gamepad2 />, frequency: 'daily' },
    { id: 'tv', name: 'Give up TV', icon: <Tv />, frequency: 'daily' },
    { id: 'alcohol', name: 'Give up alcohol', icon: <Wine />, frequency: 'daily' },
    { id: 'sodas', name: 'No soda or sweet drinks', icon: <Coffee />, frequency: 'daily' },
    { id: 'snacks', name: 'No snacking between meals', icon: <Cookie />, frequency: 'daily' },
    { id: 'sweets', name: 'No desserts or sweets', icon: <Candy />, frequency: 'daily' },
    { id: 'music', name: 'Listen only to music that lifts the soul to God', icon: <Music />, frequency: 'daily' },
    { id: 'purchases', name: 'No unnecessary purchases', icon: <ShoppingBag />, frequency: 'daily' },
    { id: 'anchor', name: 'Check in with your anchor', icon: <Users />, frequency: 'daily' },
    { id: 'exercise', name: 'Physical exercise', icon: <Dumbbell />, frequency: 'weekday', days: ['Monday', 'Wednesday', 'Friday'] },
    { id: 'fraternity', name: 'Weekly fraternity meeting', icon: <Fraternity />, frequency: 'weekly', days: ['Wednesday'] },
    { id: 'fast', name: 'Fast', icon: <Utensils />, frequency: 'weekly', days: ['Wednesday', 'Friday'] },
    { id: 'sunday', name: 'Celebrate the Lord\'s day', icon: <Church />, frequency: 'weekly', days: ['Sunday'] }
  ];

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const getDateString = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };
  
  const isDisciplineForDate = (discipline: Discipline, date: Date): boolean => {
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    if (discipline.frequency === 'daily') return true;
    if (discipline.frequency === 'weekly' && discipline.days?.includes(day)) return true;
    if (discipline.frequency === 'weekday' && discipline.days?.includes(day)) return true;
    return false;
  };
  
  const getDaysElapsed = (): number => {
    const today = new Date();
    if (today < ASH_WEDNESDAY) return 0;
    if (today > EASTER_SUNDAY) return TOTAL_DAYS;
    
    return Math.ceil((today.getTime() - ASH_WEDNESDAY.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  const getProgress = (): number => {
    return Math.round((getDaysElapsed() / TOTAL_DAYS) * 100);
  };
  
  const handleDisciplineUpdate = (disciplineId: string, status: 'completed' | 'failed' | 'skipped') => {
    const dateStr = formatDate(selectedDate);
    // Create updated progress object
    const updatedProgress = {
      ...progress,
      [dateStr]: {
        ...(progress[dateStr] || {}),
        [disciplineId]: status
      }
    };
    
    // Update state
    setProgress(updatedProgress);
    
    // Save to localStorage immediately
    localStorage.setItem('exodusProgress', JSON.stringify(updatedProgress));
  };
  
  const getDisciplineStatus = (disciplineId: string): 'completed' | 'failed' | 'skipped' | null => {
    const dateStr = formatDate(selectedDate);
    if (!progress[dateStr]) return null;
    return progress[dateStr][disciplineId] || null;
  };
  
  const isLentActive = (): boolean => {
    return currentDate >= ASH_WEDNESDAY && currentDate <= EASTER_SUNDAY;
  };
  
  const getDaysUntilLent = (): number => {
    if (currentDate >= ASH_WEDNESDAY) return 0;
    return Math.ceil((ASH_WEDNESDAY.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  // Date navigation functions
  const goToNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    
    // Don't allow navigating to future dates beyond today
    if (nextDate <= currentDate) {
      setSelectedDate(nextDate);
    }
  };
  
  const goToPreviousDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    
    // Don't allow navigating before Ash Wednesday
    if (prevDate >= ASH_WEDNESDAY) {
      setSelectedDate(prevDate);
    }
  };
  
  // Swipe gesture handlers
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // Detect left or right swipe (threshold of 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left - go to next day
        goToNextDay();
      } else {
        // Swiped right - go to previous day
        goToPreviousDay();
      }
    }
    
    touchStartX.current = null;
  };
  
  const isSelectedDateToday = (): boolean => {
    const today = formatDate(currentDate);
    const selected = formatDate(selectedDate);
    return today === selected;
  };
  
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pb-24">
      {/* Header */}
      <header className="bg-purple-900 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Exodus</h1>
        <p className="text-center text-purple-200">Lenten Journey 2025</p>
      </header>
      
      {/* Progress Bar */}
      <div className="px-4 py-6">
        {isLentActive() ? (
          <>
            <div className="flex justify-between text-sm mb-1">
              <span>Ash Wednesday</span>
              <span>Easter Sunday</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-4 mb-1">
              <div 
                className="bg-purple-600 h-4 rounded-full transition-all duration-500" 
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            <p className="text-center text-sm mt-2">
              Day {getDaysElapsed()} of {TOTAL_DAYS} ({getProgress()}% complete)
            </p>
          </>
        ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
            <p className="font-semibold">Lent 2025 begins on {ASH_WEDNESDAY.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <p>{getDaysUntilLent()} days until Lent begins</p>
          </div>
        )}
      </div>
      
      {/* Date Navigation and Display */}
      <div 
        className="px-4 mb-4 touch-action-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-center">
          <button 
            onClick={goToPreviousDay}
            className="mr-2 p-2 rounded-full bg-purple-100 text-purple-800" 
            aria-label="Previous day"
            disabled={selectedDate <= ASH_WEDNESDAY}
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className="text-xl font-bold text-center">
            {getDateString(selectedDate)}
            {isSelectedDateToday() && <span className="ml-2 text-sm bg-green-500 text-white px-2 py-0.5 rounded-full">Today</span>}
          </h2>
          
          <button 
            onClick={goToNextDay}
            className="ml-2 p-2 rounded-full bg-purple-100 text-purple-800" 
            aria-label="Next day"
            disabled={selectedDate >= currentDate}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-1">
          Swipe left/right to navigate between days
        </p>
      </div>
      
      {/* Filter Toggle */}
      <div className="px-4 mb-4 flex justify-center">
        <button 
          onClick={() => setShowCompleted(!showCompleted)} 
          className="text-sm bg-purple-100 text-purple-800 px-4 py-2 rounded-full"
        >
          {showCompleted ? "Hide Completed" : "Show All"}
        </button>
      </div>
      
      {/* Disciplines List */}
      <div className="px-4">
        {selectedDate < ASH_WEDNESDAY ? (
          <div className="text-center py-8 text-gray-500">
            <p>Lent hasnt started yet for this date.</p>
          </div>
        ) : selectedDate > EASTER_SUNDAY ? (
          <div className="text-center py-8 text-gray-500">
            <p>Lent is complete for this date.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {disciplines
              .filter(discipline => isDisciplineForDate(discipline, selectedDate))
              .filter(discipline => showCompleted || getDisciplineStatus(discipline.id) !== 'completed')
              .map(discipline => {
                const status = getDisciplineStatus(discipline.id);
                
                return (
                  <li 
                    key={discipline.id} 
                    className={`p-4 rounded-lg shadow-sm flex items-center justify-between
                      ${status === 'completed' ? 'bg-green-50 border border-green-200' : 
                        status === 'failed' ? 'bg-red-50 border border-red-200' : 
                        'bg-white border border-gray-200'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full
                        ${status === 'completed' ? 'bg-green-100 text-green-600' : 
                          status === 'failed' ? 'bg-red-100 text-red-600' : 
                          'bg-purple-100 text-purple-600'}`}
                      >
                        {discipline.icon}
                      </div>
                      <span className="text-sm font-medium">{discipline.name}</span>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleDisciplineUpdate(discipline.id, 'completed')}
                        className={`p-2 rounded-full ${status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                        aria-label="Mark as completed"
                        disabled={selectedDate > currentDate}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        onClick={() => handleDisciplineUpdate(discipline.id, 'failed')}
                        className={`p-2 rounded-full ${status === 'failed' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                        aria-label="Mark as failed"
                        disabled={selectedDate > currentDate}
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
        
        {selectedDate >= ASH_WEDNESDAY && selectedDate <= EASTER_SUNDAY && 
         disciplines.filter(discipline => isDisciplineForDate(discipline, selectedDate))
                   .filter(discipline => showCompleted || getDisciplineStatus(discipline.id) !== 'completed').length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>All disciplines completed for this day! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}
