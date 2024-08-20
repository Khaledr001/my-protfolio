import anime from "animejs";

const Modal = () => {
//   strokeDashoffset: [anime.setDashoffset, 0];
  anime({
    targets: ".line-drawing-demo .lines path",
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: "easeInOutSine",
    duration: 1500,
    delay: function (el, i) {
      return i * 250;
    },
    direction: "alternate",
    loop: true,
  });
  return (
    <div>
      <svg
        width="903"
        height="588"
        viewBox="0 0 903 588"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_4_8)">
          <path
            className="path"
            d="M474.5 12.5H149.5C103 12.5 7.17732 77.5 20.0108 193C26.1775 248.5 83.5001 357.5 318.511 343C375 343 376.5 447.5 319.5 455.5H187C141.833 457 45.4001 486.6 21.0001 567H278C420 559 466.333 453.667 462.5 401C462.5 276.5 331.5 235.5 278 235.5H175C100.5 206 128.5 130.5 175 122.5H287.5C431.9 122.5 471 56.3333 474.5 12.5Z"
            stroke="#2486CF"
            stroke-width="25"
            shape-rendering="crispEdges"
          />
          <path
            d="M502 356.5C488.5 274.5 449 269 449 263.5L716 12.5H867L502 356.5Z"
            stroke="#2486CF"
            stroke-width="25"
            shape-rendering="crispEdges"
          />
          <path
            d="M716 567L534 385C566.023 356.492 579.477 340.008 611.5 311.5L867 567H791.5H716Z"
            stroke="#2486CF"
            stroke-width="25"
            shape-rendering="crispEdges"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_4_8"
            x="0.143555"
            y="0"
            width="902.345"
            height="587.5"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_4_8"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_4_8"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default Modal;
