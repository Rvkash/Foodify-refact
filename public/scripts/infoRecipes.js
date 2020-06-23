const span = document.querySelectorAll('.esconder')

for (const spa of span) {
  spa.addEventListener('click', function () {
    const id = spa.getAttribute('id')
    const modal = document.querySelector(`.modal${id}`)
    modal.classList.toggle('.active')
  })
}
