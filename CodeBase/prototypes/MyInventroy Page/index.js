new Swiper('.slider1', {
  // Optional parameters
  loop: true,
  spaceBetween: 30,
  grabCursor: true,

  // If we need pagination
  pagination: {
    el: '.pagination1',
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.next1',
    prevEl: '.prev1'
  },

  breakpoints:{
    0:{
        slidesPerView: 1,
    },
    768:{
        slidesPerView: 2,
    },
    1080:{
        slidesPerView: 3,
    }
  }
 
});



new Swiper('.slider2', {
  // Optional parameters
  loop: true,
  spaceBetween: 30,
  grabCursor: true,

  // If we need pagination
  pagination: {
    el: '.pagination2',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.next2',
    prevEl: '.prev2'
  },

  breakpoints:{
    0:{
        slidesPerView: 1,
    },
    768:{
        slidesPerView: 2,
    },
    1080:{
        slidesPerView: 3,
    }
  }
 
});
