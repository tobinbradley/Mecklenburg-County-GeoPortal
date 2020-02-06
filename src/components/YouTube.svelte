<script>
  let tutorialIframe
  function loadVideo(vidId) {
    tutorialIframe.setAttribute("src", `https://www.youtube.com/embed/${this.dataset.embed}?autoplay=1`)
    tutorialIframe.classList.remove('hidden')
  }
</script>

<style>
.tutorial-wrapper {
  padding-bottom: 56.25%;
}
.play-button {
    width: 90px;
    height: 60px;
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

<div class="max-w-4xl mx-auto mt-16 mb-8 print:hidden">
  <div class="tutorial-wrapper relative">
    <div class="youtube w-full flex justify-center items-center absolute top-0 bottom-0">
      <img src="img/logo.svg" alt="logo image" loading="lazy" class="h-full w-auto">
      <div class="play-button bg-blue-900 cursor-pointer z-10 rounded-lg shadow-md transition duration-200 ease-in-out hover:bg-red-700 hover:shadow-lg" on:click|once={loadVideo} data-embed="agzk5yeHafg"></div>
      <iframe bind:this={tutorialIframe} class="hidden w-full h-full absolute t-0 b-0 z-20" frameborder="0" title="video tutorial" />
    </div>
  </div>
</div>