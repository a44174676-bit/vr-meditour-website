(function () {
  const ctas = document.querySelectorAll('.btn');
  ctas.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-disabled') === 'true') {
        return;
      }
    });
  });
})();
