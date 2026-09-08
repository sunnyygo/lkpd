import React from 'react';

// Progress bar tipis dengan aksen batik
export default function ProgressBar({ langkah, total }) {
  const persen = Math.round((langkah / total) * 100);
  return (
    <div className="w-full max-w-2xl mx-auto mb-5">
      <div className="flex justify-between text-[11px] text-stone-400 mb-1.5 tnum">
        <span className="uppercase tracking-wider">Progres</span>
        <span>{langkah}/{total}</span>
      </div>
      <div className="w-full bg-stone-200/70 rounded-full h-1.5">
        <div
          className="batik-stripe h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${persen}%` }}
        ></div>
      </div>
    </div>
  );
}
