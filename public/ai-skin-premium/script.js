(function(){
  const VALID_PREMIUM_ACCESS_CODES = ["BUSANBLUE"];
  const params = new URLSearchParams(window.location.search);
  const accessFromUrl = (params.get('access') || '').trim().toUpperCase();
  const badge = document.getElementById('accessBadge');
  const startBtn = document.getElementById('startPremiumBtn');
  const input = document.getElementById('accessInput');
  const applyBtn = document.getElementById('accessApplyBtn');
  const helperStatus = document.getElementById('accessHelperStatus');

  function isValid(code){return VALID_PREMIUM_ACCESS_CODES.includes(String(code || '').trim().toUpperCase());}
  function setValid(code){
    sessionStorage.setItem('aiSkinPremiumAccess', 'BUSANBLUE');
    badge.textContent = 'Premium Access 확인 완료 · BUSANBLUE';
    badge.classList.remove('invalid');
    startBtn.disabled = false;
  }
  function setInvalid(message){
    badge.textContent = message;
    badge.classList.add('invalid');
    startBtn.disabled = true;
  }

  if (isValid(accessFromUrl)) {
    setValid(accessFromUrl);
  } else if (accessFromUrl) {
    setInvalid('유효하지 않은 Premium Access입니다. 굿즈 안내서 QR을 다시 스캔해 주세요.');
  } else if (isValid(sessionStorage.getItem('aiSkinPremiumAccess'))) {
    setValid('BUSANBLUE');
  } else {
    setInvalid('Premium Access가 필요합니다. 굿즈 안내서 QR을 스캔해 주세요.');
  }

  startBtn.addEventListener('click', () => {
    if (!isValid(sessionStorage.getItem('aiSkinPremiumAccess'))) return;
    window.location.href = '/ai-skin/?access=BUSANBLUE&mode=premium';
  });

  applyBtn.addEventListener('click', () => {
    const code = input.value.trim().toUpperCase();
    if (isValid(code)) {
      setValid(code);
      helperStatus.textContent = 'Access Code 확인 완료. 프리미엄 리포트를 시작할 수 있습니다.';
    } else {
      helperStatus.textContent = '코드를 확인할 수 없습니다. 굿즈 안내서 QR을 다시 스캔해 주세요.';
    }
  });
})();
