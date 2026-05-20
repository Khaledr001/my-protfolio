const LiveProjectButton = ({ href = "#", children = "See my work" }) => {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex items-center gap-2 text-white/60 hover:text-white text-[15px] font-medium tracking-wide transition-colors group"
    >
      <span>{children}</span>
      <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
    </a>
  );
};

export default LiveProjectButton;
