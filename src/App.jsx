import { useState } from 'react'
import './index.css' // Tailwind burada aktifleşiyor

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Tailwind CSS Çalışıyor Mu?</h1>

      <button
        onClick={() => setCount(count + 1)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Sayaç: {count}
      </button>

      <p className="mt-6 text-gray-700 text-sm">
        Bu sayfa <code className="bg-white px-2 py-1 rounded shadow">App.jsx</code> dosyasıdır.
      </p>

      <div className="mt-10 border-t pt-6 w-full max-w-md text-center text-xs text-gray-500">
        Tailwind versiyonun doğru kuruluysa yukarıdaki buton mavi olmalı.
      </div>
    </div>
  )
}

export default App
