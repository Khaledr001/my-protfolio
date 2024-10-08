import React from "react";

const Carosole = () => {
    let swiper = new Swiper(".mySwiper", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  return (
    <section className="max-w-screen-xl mx-auto pb-12">
      <h2 className="text-3xl sm:text-[40px] bg-[#111] sm:w-max relative z-10 font-bold px-4 py-2 mx-auto text-center text-[#1788ae] sm:border-2 border-[#1788ae] rounded-md">
        What my clients are saying?
      </h2>
      <div className="swiper mySwiper !py-14">
        <div className="swiper-wrapper items-center">
          <div className="swiper-slide px-4">
            <div className="flex flex-col md:flex-row w-full md:max-w-[800px] items-center rounded-lg p-9 shadow-[0_0px_50px_rgba(59,130,246,0.6)] cursor-grab">
              <img
                className="shrink-0 w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full drop-shadow-[0_0px_80px_rgba(59,130,246,1)]"
                src="/assets/images/saatvik.webp"
                alt="testimonial 3"
              />
              <div className="testimonial-text ml-6 text-left pt-6 md:pt-16 relative">
                <p className="text-sm md:text-base mb-2">
                  “Anurag is a talented, committed individual who will leave no
                  stone unturned in his pursuit to provide with the best. His
                  attention to detail and in-depth experience in the of web
                  development is indeed commendable. He has exhibited exemplary
                  skills in the field, and I hope to see all the great projects
                  coming up!”
                </p>
                <h2 className="text-right text-[#459bd5] font-bold text-2xl md:text-4xl">
                  Saatvik Nagpal
                </h2>
                <h5 className="text-right text-[#459bd5] text-base md:text-lg">
                  Founder, EazyGrad
                </h5>
              </div>
            </div>
          </div>
          <div className="swiper-slide px-4">
            <div className="flex flex-col md:flex-row max-w-[800px] items-center rounded-lg p-9 shadow-[0_0px_50px_rgba(59,130,246,0.6)] cursor-grab">
              <img
                className="shrink-0 w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full drop-shadow-[0_0px_80px_rgba(59,130,246,1)]"
                src="/assets/images/kira.webp"
                alt="testimonial 3"
              />
              <div className="testimonial-text ml-6 text-left pt-6 md:pt-16 relative">
                <p className="text-sm md:text-base mb-2">
                  “Anurag was a wonderful developer to work with! He anticipated
                  everything I need to consider for my website. He also went the
                  extra mile and added details that I hadn't considered! He is
                  helping my business grow, and I will definitely work with him
                  again!”
                </p>
                <h2 className="text-right text-[#459bd5] font-bold text-2xl md:text-4xl">
                  Kira Bragg
                </h2>
                <h5 className="text-right text-[#459bd5] text-base md:text-lg">
                  English Mentor
                </h5>
              </div>
            </div>
          </div>
          <div className="swiper-slide px-4">
            <div className="flex flex-col md:flex-row max-w-[800px] items-center rounded-lg p-9 shadow-[0_0px_50px_rgba(59,130,246,0.6)] cursor-grab">
              <img
                className="shrink-0 w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full drop-shadow-[0_0px_80px_rgba(59,130,246,1)]"
                src="/assets/images/Srihari.webp"
                alt="testimonial 3"
              />
              <div className="testimonial-text ml-6 text-left pt-6 md:pt-16 relative">
                <p className="text-sm md:text-base mb-2">
                  “I worked with Anurag to make my website. I am speechless by
                  looking at his work ethic and dedication. Working with him was
                  the best decision I made.”
                </p>
                <h2 className="text-right text-[#459bd5] font-bold text-2xl md:text-4xl">
                  Srihari Kestur
                </h2>
                <h5 className="text-right text-[#459bd5] text-base md:text-lg">
                  Founder Harigurus
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-pagination"></div>
      </div>
    </section>
  );
};

export default Carosole;
