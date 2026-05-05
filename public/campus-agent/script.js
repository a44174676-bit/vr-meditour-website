document.addEventListener('DOMContentLoaded', () => {
  const buildingCards = [
    {
      id: 'A',
      name: 'A동 (글로벌센터)',
      info: '평생교육원, A302호 포함. 방문자 안내 핵심 건물.',
      guidance: '정문 기준 우측 동선으로 이동 후 A동 입구 표지 확인',
      tags: ['글로벌센터', '평생교육원', 'A302', 'A302호', 'A동'],
      x: 18,
      y: 36,
    },
    ...'BCDEFGHIJ'.split('').map((id, idx) => ({
      id,
      name: `${id}동 (건물명 확인 필요)`,
      info: '세부 시설 정보 확인 필요',
      guidance: '공식 자료 확인 필요',
      tags: [`${id}동`, id],
      x: 34 + (idx % 3) * 22,
      y: 20 + Math.floor(idx / 3) * 22,
    })),
  ];

  let selectedId = 'A';

  const markerContainer = document.getElementById('markerContainer');
  const buildingCardsEl = document.getElementById('buildingCards');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const searchResult = document.getElementById('searchResult');
  const arBuildingName = document.getElementById('arBuildingName');
  const arGuidance = document.getElementById('arGuidance');
  const scrollToBuildings = document.getElementById('scrollToBuildings');

  function renderMarkers() {
    markerContainer.innerHTML = '';
    buildingCards.forEach((b) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `marker${b.id === selectedId ? ' active' : ''}`;
      button.style.left = `${b.x}%`;
      button.style.top = `${b.y}%`;
      button.textContent = b.id;
      button.setAttribute('aria-label', `${b.id}동 선택`);
      button.addEventListener('click', () => selectBuilding(b.id));
      markerContainer.appendChild(button);
    });
  }

  function renderBuildingCards() {
    buildingCardsEl.innerHTML = '';
    buildingCards.forEach((b) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `building-card${b.id === selectedId ? ' active' : ''}`;
      card.innerHTML = `
        <h3>${b.id} · ${b.name}</h3>
        <p>${b.info}</p>
        <p>안내: ${b.guidance}</p>
      `;
      card.addEventListener('click', () => selectBuilding(b.id));
      buildingCardsEl.appendChild(card);
    });
  }

  function updateArPreview(building) {
    arBuildingName.textContent = `선택 건물: ${building.id} · ${building.name}`;
    arGuidance.textContent = `AR 방향 라벨: ${building.guidance}`;
  }

  function selectBuilding(id) {
    const building = buildingCards.find((b) => b.id === id);
    if (!building) return;
    selectedId = id;
    renderMarkers();
    renderBuildingCards();
    updateArPreview(building);
    searchResult.textContent = `${building.id}동 선택됨: ${building.info} (필요 시 공식 자료 확인)`;
  }

  function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
      searchResult.textContent = '질문을 입력하면 안내 결과를 제공합니다.';
      return;
    }

    if (/(버스|지하철|주차|오시는 길)/i.test(query)) {
      searchResult.textContent =
        '교통 안내: 버스/지하철/주차/오시는 길 정보는 공식 캠퍼스맵 및 학교 공식 안내 페이지 확인이 필요합니다.';
      return;
    }

    const matchA = /(평생교육원|A302|글로벌센터|A동)/i.test(query);
    if (matchA) {
      selectBuilding('A');
      searchResult.textContent = '검색 결과: A동(글로벌센터)으로 안내합니다. 평생교육원·A302호 관련 문의는 현장 표지 및 공식 자료를 함께 확인해 주세요.';
      return;
    }

    const matched = buildingCards.find((b) => b.tags.some((tag) => query.includes(tag)));
    if (matched) {
      selectBuilding(matched.id);
      searchResult.textContent = `검색 결과: ${matched.id}동 선택. ${matched.info}`;
      return;
    }

    searchResult.textContent = '해당 키워드의 상세 위치는 공식 자료 확인 필요. 건물 목록에서 A~J를 직접 선택해 주세요.';
  }

  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  scrollToBuildings.addEventListener('click', () => {
    document.getElementById('buildings').scrollIntoView({ behavior: 'smooth' });
  });

  renderMarkers();
  renderBuildingCards();
  selectBuilding(selectedId);
});
