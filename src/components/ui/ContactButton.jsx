const ContactButton = ({ children = "Get in touch", onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background:
          "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
        outline: "2px solid white",
        outlineOffset: "-3px",
      }}
      className="px-8 py-4 rounded-full text-white font-semibold text-[15px] tracking-wide cursor-pointer transition-opacity hover:opacity-80 active:scale-95"
    >
      {children}
    </button>
  );
};

export default ContactButton;
