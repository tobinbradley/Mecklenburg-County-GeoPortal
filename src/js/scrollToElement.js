export default function scrollToElement(elem) {
  const top = elem.getBoundingClientRect().top
  if (
    top < window.pageYOffset ||
    top > window.innerHeight + window.pageYOffset
  ) {
    elem.scrollIntoView({ behavior: 'smooth' })
  }
}