import React, { useState } from 'react';

export default function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-6">محرر الفيديو المبسط</h1>
      
      {!videoUrl ? (
        <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl cursor-pointer shadow-lg">
          اختر فيديو للاستيراد
          <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
        </label>
      ) : (
        <div className="w-full max-w-md flex flex-col items-center">
          <video src={videoUrl} controls className="w-full rounded-lg shadow-md mb-4" />
          <button 
            onClick={() => setVideoUrl(null)}
            className="bg-red-600 px-4 py-2 rounded-lg text-sm"
          >
            اختيار فيديو آخر
          </button>
        </div>
      )}
    </div>
  );
}
