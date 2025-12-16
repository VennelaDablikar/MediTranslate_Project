export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} MediTranslate. Built with ❤️ for Healthcare Accessibility.</p>
      </div>
    </footer>
  );
}
