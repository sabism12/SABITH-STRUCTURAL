export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full overflow-hidden select-none bg-[#fff0d9] md:bg-[#fff0d9] min-h-[35vh] md:min-h-[60vh] flex flex-col items-center justify-center pt-24 pb-16 md:pt-20 md:pb-20">
      
      {/* Social Icons - Top Left */}
      <div className="absolute top-8 left-6 md:top-12 md:left-12 flex gap-3 md:gap-4 z-40 pointer-events-auto">
        <a href="https://www.linkedin.com/in/sabithismail/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#ff4f18]/10 flex items-center justify-center hover:border-[#ff4f18]/40 hover:bg-[#ff4f18]/5 transition-all duration-300">
          <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ff4f18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        </a>
        <a href="mailto:sabithismail6679@gmail.com" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#ff4f18]/10 flex items-center justify-center hover:border-[#ff4f18]/40 hover:bg-[#ff4f18]/5 transition-all duration-300">
          <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ff4f18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </a>
        <a href="tel:+97450371817" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#ff4f18]/10 flex items-center justify-center hover:border-[#ff4f18]/40 hover:bg-[#ff4f18]/5 transition-all duration-300">
          <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ff4f18]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </a>
      </div>

      {/* Scroll to Top - Top Right */}
      <button 
        onClick={scrollToTop}
        className="absolute top-8 right-6 md:top-12 md:right-12 w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#ff4f18]/10 flex items-center justify-center hover:border-[#ff4f18]/40 hover:bg-[#ff4f18]/5 transition-all duration-300 z-40 cursor-pointer group"
      >
        <svg 
          className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ff4f18] group-hover:-translate-y-0.5 transition-transform duration-300" 
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
      
      {/* Huge fading gradient text */}
      <div className="relative w-full flex justify-center items-center">
        <h1 
          className="text-[13vw] leading-[0.85] font-black tracking-tighter w-full text-center px-4"
          style={{
            fontFamily: "'MartianGrotesk', sans-serif",
            background: "linear-gradient(to bottom, #ff4f18 10%, #ff9054 50%, #fff0d9 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          MOHD SABITH.
        </h1>
      </div>

      {/* Bottom links */}
      <div className="absolute bottom-6 left-0 w-full px-6 md:px-12 flex justify-between items-center text-[10px] md:text-xs font-sans tracking-wide" style={{ color: "#9c948a", fontWeight: 500 }}>
        <a href="#" className="hover:text-black transition-colors">Structural Engineer</a>
        <span>© Mohd Sabith 2026</span>
      </div>
      
    </footer>
  );
}
