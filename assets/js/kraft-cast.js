import * as AsciinemaPlayer from 'asciinema-player';
AsciinemaPlayer.create('/assets/kraft.cast', document.getElementById('kraft-cast'), {
  loop: true,
  autoPlay: true,
  fit: 'width'
});
