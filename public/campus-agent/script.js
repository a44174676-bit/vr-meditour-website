document.addEventListener('DOMContentLoaded', () => {
  const buildingCards = [
    {
      id: 'A',
      name: 'A동 (글로벌센터)',
      summary: '글로벌센터 / 평생교육원 A302호 / 방문자 안내 핵심 건물',
      details: '평생교육원, A302호 관련 문의는 공식 자료 확인 필요',
      x: 23,
      y: 30,
      keywords: ['평생교육원', 'a302', 'a302호', '글로벌센터', 'a동']
    },
    ...['B','C','D','E','F','G','H','I','J'].map((id, idx) => ({
      id,
      name: `${id}동`,
      summary: '건물명 확인 필요',
      details: '세부 시설 정보 확인 필요',
      x: 40 + (idx % 3) * 20,
      y: 28 + Math.floor(idx / 3) * 22,
      keywords: [`${id.toLowerCase()}동`, id.toLowerCase()]
    }))
  ];

  const markerWrap = document.getElementById('mapMarkers');
  const cardsWrap = document.getElementById('buildingCards');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const searchResult = document.getElementById('searchResult');
  const arBuilding = document.getElementById('arBuilding');
  const arGuide = document.getElementById('arGuide');

  let selectedBuildingId = 'A';

  function renderBuildingCards() {
    cardsWrap.innerHTML = buildingCards
      .map(
        (b) => `
        <button class="building-card ${b.id === selectedBuildingId ? 'active' : ''}" data-id="${b.id}" type="button">
          <div class="building-title">${b.id}. ${b.name}</div>
          <p class="building-desc">${b.summary}</p>
          <p class="building-desc">${b.details}</p>
        </button>
      `
      )
      .join('');

    cardsWrap.querySelectorAll('.building-card').forEach((card) => {
      card.addEventListener('click', () => {
        selectBuilding(card.dataset.id);
      });
    });
  }

  function renderMarkers() {
    markerWrap.innerHTML = buildingCards
      .map(
        (b) => `<button class="marker-btn ${b.id === selectedBuildingId ? 'active' : ''}" style="left:${b.x}%; top:${b.y}%;" data-id="${b.id}" type="button" aria-label="${b.id}동 선택">${b.id}</button>`
      )
      .join('');

    markerWrap.querySelectorAll('.marker-btn').forEach((marker) => {
      marker.addEventListener('click', () => {
        selectBuilding(marker.dataset.id);
      });
    });
  }

  function updateArPreview(building) {
    arBuilding.textContent = `${building.id}. ${building.name}`;
    arGuide.textContent = `${building.summary} · ${building.details}`;
  }

  function selectBuilding(id) {
    const building = buildingCards.find((item) => item.id === id);
    if (!building) return;
    selectedBuildingId = id;
    renderMarkers();
    renderBuildingCards();
    updateArPreview(building);
    searchResult.textContent = `${building.id}동 안내를 표시 중입니다. 공식 자료 확인이 필요한 항목은 현장 또는 공식 페이지에서 확인해 주세요.`;
  }

  function handleSearch() {
    const raw = searchInput.value.trim();
    const q = raw.toLowerCase();
    if (!q) {
      searchResult.textContent = '질문을 입력해 주세요. 예: 평생교육원 어디야?';
      return;
    }

    const transportKeywords = ['버스', '지하철', '주차', '오시는 길'];
    if (transportKeywords.some((keyword) => raw.includes(keyword))) {
      searchResult.textContent = '교통/오시는 길 안내는 공식 캠퍼스맵 또는 학교 공식 안내 페이지에서 최신 정보를 확인해 주세요.';
      return;
    }

    const found = buildingCards.find((b) => b.keywords.some((k) => q.includes(k)));
    if (found) {
      selectBuilding(found.id);
      searchResult.textContent = `${found.id}동 결과: ${found.summary}. ${found.details}.`;
      return;
    }

    searchResult.textContent = '정확한 매칭을 찾지 못했습니다. A~J 목록에서 선택하거나 공식 자료 확인이 필요합니다.';
  }

  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') handleSearch();
  });

  renderMarkers();
  renderBuildingCards();
  updateArPreview(buildingCards[0]);
  searchResult.textContent = 'A~J 건물 목록을 먼저 확인하고 필요한 경우 검색해 주세요.';
});
