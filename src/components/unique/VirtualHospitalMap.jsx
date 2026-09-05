import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Navigation,
  Stethoscope,
  Users,
  Radio,
  Layers,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';

export const VirtualHospitalMap = () => {
  const { doctors, departments, appointments } = useApp();
  const navigate = useNavigate();

  const [activeFloor, setActiveFloor] = useState('floor1');
  const [selectedRoom, setSelectedRoom] = useState(null);

  const floor1Rooms = [
    { id: 'r101', room: 'Room 101', wing: 'Wing A', docId: 'doc-1', docName: 'Dr. Priya Sharma', dept: 'General Medicine', status: 'In Consult', color: '#0d9488', coords: { x: '18%', y: '35%' } },
    { id: 'r102', room: 'Room 102', wing: 'Wing A', docId: 'doc-11', docName: 'Dr. Marcus Vance', dept: 'General Medicine', status: 'Available', color: '#0d9488', coords: { x: '32%', y: '25%' } },
    { id: 'r108', room: 'Room 108', wing: 'Wing A', docId: 'doc-4', docName: 'Dr. Sunita Rao', dept: 'Dermatology', status: 'Available', color: '#8b5cf6', coords: { x: '46%', y: '35%' } },
    { id: 'r301', room: 'Room 301', wing: 'Wing C', docId: 'doc-3', docName: 'Dr. Aisha Patel', dept: 'Pediatrics', status: 'Available', color: '#f59e0b', coords: { x: '68%', y: '28%' } },
    { id: 'r214', room: 'Room 214', wing: 'Wing B', docId: 'doc-10', docName: 'Dr. Rohan Gupta', dept: 'Dental Surgery', status: 'Available', color: '#10b981', coords: { x: '82%', y: '45%' } },
  ];

  const floor2Rooms = [
    { id: 'r201', room: 'Room 201', wing: 'Wing B', docId: 'doc-2', docName: 'Dr. Rajesh Menon', dept: 'Cardiology', status: 'In Consult', color: '#f43f5e', coords: { x: '22%', y: '32%' } },
    { id: 'r202', room: 'Room 202', wing: 'Wing B', docId: 'doc-12', docName: 'Dr. Fatima Zahra', dept: 'Cardiology', status: 'Available', color: '#f43f5e', coords: { x: '38%', y: '22%' } },
    { id: 'r208', room: 'Room 208', wing: 'Wing B', docId: 'doc-5', docName: 'Dr. Vikram Malhotra', dept: 'Orthopedics', status: 'Available', color: '#2563eb', coords: { x: '55%', y: '35%' } },
    { id: 'r401', room: 'Room 401', wing: 'Wing D', docId: 'doc-7', docName: 'Dr. Elena Rostova', dept: 'Neurology', status: 'In Consult', color: '#6366f1', coords: { x: '72%', y: '25%' } },
    { id: 'r405', room: 'Room 405', wing: 'Wing D', docId: 'doc-8', docName: 'Dr. Ananya Sen', dept: 'Gynecology', status: 'Available', color: '#ec4899', coords: { x: '85%', y: '42%' } },
  ];

  const currentRooms = activeFloor === 'floor1' ? floor1Rooms : floor2Rooms;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Navigation className="w-3.5 h-3.5 animate-pulse" />
            MediMap 3D Virtual Hospital Navigation
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Interactive Hospital Floorplan & Live Room Beacons
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any room node on the floorplan to inspect live occupancy, doctor credentials, and queue status.
          </p>
        </div>

        {/* Floor Level Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setActiveFloor('floor1');
              setSelectedRoom(null);
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeFloor === 'floor1'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Level 1: Primary & OPD
          </button>
          <button
            onClick={() => {
              setActiveFloor('floor2');
              setSelectedRoom(null);
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeFloor === 'floor2'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Level 2: Speciality & Cardio
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 border border-teal-500/30 overflow-hidden shadow-inner flex items-center justify-center p-4">
        {/* Isometric Grid Mesh Canvas */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d948815_1px,transparent_1px),linear-gradient(to_bottom,#0d948815_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Central Nurse Triage Station Beacon */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-center pointer-events-none shadow-glow-teal">
          <div className="w-3 h-3 rounded-full bg-teal-400 mx-auto animate-ping mb-1" />
          <span className="text-[10px] font-mono uppercase font-black text-teal-200 tracking-wider">
            CENTRAL TRIAGE & WAITING LOUNGE
          </span>
        </div>

        {/* Interactive Room Nodes */}
        {currentRooms.map((room) => {
          const isSelected = selectedRoom?.id === room.id;
          const isInConsult = room.status === 'In Consult';

          return (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              style={{ left: room.coords.x, top: room.coords.y }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                isSelected ? 'scale-115 z-30' : 'hover:scale-105 z-20'
              }`}
            >
              <div
                className={`p-3 rounded-2xl border backdrop-blur-md transition-all text-center flex flex-col items-center ${
                  isSelected
                    ? 'bg-teal-500 text-white border-white shadow-xl shadow-teal-500/40 ring-4 ring-teal-400/30'
                    : isInConsult
                    ? 'bg-slate-900/90 text-amber-300 border-amber-500/50 shadow-lg'
                    : 'bg-slate-900/85 text-teal-300 border-teal-500/40 hover:border-teal-400 shadow-md'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isInConsult ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                    }`}
                  />
                  <span className="font-mono text-xs font-black">{room.room}</span>
                </div>
                <span className="text-[10px] font-bold truncate max-w-[100px]">
                  {room.docName.replace('Dr. ', '')}
                </span>
                <span className="text-[9px] text-slate-400 truncate max-w-[100px]">
                  {room.dept}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Detail Drawer (when clicked) */}
      {selectedRoom ? (
        <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-base shadow-md">
              {selectedRoom.room.split(' ')[1]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedRoom.docName} ({selectedRoom.room} - {selectedRoom.wing})
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                  {selectedRoom.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Department: <strong>{selectedRoom.dept}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/book-appointment?doctorId=${selectedRoom.docId}`)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm"
            >
              Book in this Room
            </button>
            <button
              onClick={() => navigate(`/doctors/${selectedRoom.docId}`)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Doctor Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
          <Info className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>Click any room beacon above on the floorplan to inspect live status & book instantly.</span>
        </div>
      )}
    </div>
  );
};
