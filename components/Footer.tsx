export default function Footer() {
    return (
      <footer className="mt-24 border-t border-zinc-800 py-10 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Samjah Stream</p>
  
        <div className="mt-4 flex justify-center gap-6">
          <a href="#">Impressum</a>
          <a href="#">Datenschutz</a>
          <a href="#">Kontakt</a>
        </div>
      </footer>
    );
  }
