<script>
  let tutorialIframe

  function loadVideo(vidId) {
    tutorialIframe.setAttribute("src", `https://www.youtube.com/embed/${this.dataset.embed}?autoplay=1`)
    tutorialIframe.classList.remove('hidden')
  }
</script>

<style>
.play-button {
  width: 90px;
  height: 60px;
  @apply bg-sky-500 shadow-sky-500/50 cursor-pointer shadow-lg z-10 rounded-lg transition duration-300 ease-in-out;
}
.play-button:hover {
  @apply bg-red-700 shadow-red-700/50;
}
.play-button:before {
  content: "";
  border-style: solid;
  border-width: 15px 0 15px 26px;
  border-color: transparent transparent transparent #fff;
  margin-left: 3px;
}
.play-button,
.play-button:before {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d( -50%, -50%, 0 );
}
</style>


<div class="play-button" on:click|once={loadVideo} data-embed="agzk5yeHafg"></div>
<iframe bind:this={tutorialIframe} class="absolute hidden w-full h-full z-20" frameborder="0" title="video tutorial" />
