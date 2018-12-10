var platformsSwiper = new Swiper('.platforms-swiper', {
  grabCursor: true,
  navigation: {
    nextEl: '.platforms-swiper-button-next',
    prevEl: '.platforms-swiper-button-prev',
  },
  pagination: {
    el: '.platforms-swiper-pagination',
    clickable: true,
  }
});

var testimonialsSwiper = new Swiper('.testimonials-swiper', {
  grabCursor: true,
  spaceBetween: 45,
  slidesPerView: 2,
  navigation: {
    nextEl: '.testimonials-swiper-button-next',
    prevEl: '.testimonials-swiper-button-prev',
  },
  pagination: {
    el: '.testimonials-swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    767: {
      slidesPerView: 1,
      spaceBetween: 0,
    }
  }
});