export default function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-800 py-10 text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} Samjah Stream</p>

      <div className="mt-4 flex justify-center gap-6">
        <a
          href="https://samjah-music.com/impressum/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          Impressum
        </a>

        <a
          href="https://samjah-music.com/datenschutzerklaerung/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          Datenschutz
        </a>
      </div>
    </footer>
  );
}