export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center gap-3 text-sm text-slate-500 sm:flex-row sm:justify-center sm:gap-6">
          <span>© 2025 Track My Courier. All rights reserved.</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span>Rupnagar, Punjab, India</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <a href="#" className="hover:text-brand-blue">Terms &amp; Conditions</a>
          <span className="hidden sm:inline text-slate-300">|</span>
          <a href="#" className="hover:text-brand-blue">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
