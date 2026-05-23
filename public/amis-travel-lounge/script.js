(() => {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.setAttribute('data-i18n-ready', 'true');
  });
})();
