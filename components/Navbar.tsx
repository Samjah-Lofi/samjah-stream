export default function Navbar() {
    return (
      <header className="flex items-center justify-between py-8">
  
        <div>
          <h1 className="text-3xl font-bold text-white">
            Samjah Stream
          </h1>
        </div>
  
        <nav className="hidden gap-8 text-gray-400 md:flex">
  
          <button className="hover:text-white">
            Kanäle
          </button>
  
          <button className="hover:text-white">
            Favoriten
          </button>
  
          <button className="hover:text-white">
            Verlauf
          </button>
  
        </nav>
  
        <button className="rounded-xl bg-zinc-800 px-5 py-3 text-white hover:bg-zinc-700">
          Mein Konto
        </button>
  
      </header>
    );
  }