document.addEventListener('DOMContentLoaded', () => {
  const buildingCards = [
    {
      id: 'A',
      name: '글로벌센터',
      detail: '평생교육원 A302호 / 방문자 안내 핵심 건물',
      guide: '정문 기준 우측 동선 이동 후 A동 입구 표지 확인',
      tags: ['평생교육원', 'A302', '글로벌센터', 'A동'],
      x: 18,
      y: 37,
    },
    ...'BCDEFGHIJ'.split('').map((id, i) => ({
      id,
      name: '건물명 확인 필요',
      detail: '세부 시설 정보 확인 필요',
      guide: '공식 자료 확인 필요',
      tags: [`${id}동`, id],
      x: 34 + (i % 3) * 21,
      y: 22 + Math.floor(i / 3) * 20,
    })),
  ];

  let selectedBuildingId = 'A';

  const markerLayer = document.getElementById('markerLayer');
  const cardsBox = document.getElementById('buildingCards');
  const arBuilding = document.getElementById('arBuilding');
  const arGuide = document.getElementById('arGuide');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const searchResult = document.getElementById('searchResult');
  const goBuildings = document.getElementById('goBuildings');

  function renderBuildingCards() {
    cardsBox.innerHTML = '';

    buildingCards.forEach((building) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `building-card${building.id === selectedBuildingId ? ' active' : ''}`;
      card.innerHTML = `
        <h3>${building.id}동 · ${building.name}</h3>
        <p>${building.detail}</p>
        <p>안내: ${building.guide}</p>
      `;
      card.addEventListener('click', () => selectBuilding(building.id));
      cardsBox.appendChild(card);
    });
  }

  function renderMarkers() {
    markerLayer.innerHTML = '';

    buildingCards.forEach((building) => {
      const marker = document.createElement('button');
      marker.type = 'button';
      marker.className = `marker${building.id === selectedBuildingId ? ' active' : ''}`;
      marker.style.left = `${building.x}%`;
      marker.style.top = `${building.y}%`;
      marker.textContent = building.id;
      marker.setAttribute('aria-label', `${building.id}동 선택`);
      marker.addEventListener('click', () => selectBuilding(building.id));
      markerLayer.appendChild(marker);
    });
  }

  function updateArPreview(building) {
    arBuilding.textContent = `선택 건물: ${building.id}동 · ${building.name}`;
    arGuide.textContent = `AR 방향 안내: ${building.guide}`;
  }

  function selectBuilding(buildingId) {
    const selected = buildingCards.find((b) => b.id === buildingId);
    if (!selected) return;

    selectedBuildingId = selected.id;
    renderMarkers();
    renderBuildingCards();
    updateArPreview(selected);

    searchResult.textContent = `${selected.id}동 선택됨: ${selected.detail} (필요 시 공식 자료 확인)`;
  }

  function handleSearch() {
    const query = searchInput.value.trim();

    if (!query) {
      searchResult.textContent = '질문을 입력하면 건물 또는 교통 안내 결과가 표시됩니다.';
      return;
    }

    if (/(버스|지하철|주차|오시는 길)/i.test(query)) {
      searchResult.textContent = '교통 안내는 공식 캠퍼스맵 및 공식 홈페이지의 오시는 길 자료 확인이 필요합니다.';
      return;
    }

    if (/(평생교육원|A302|글로벌센터|A동)/i.test(query)) {
      selectBuilding('A');
      searchResult.textContent = '검색 결과: A동(글로벌센터)으로 안내합니다. 평생교육원/A302호는 공식 표지 및 자료를 함께 확인해 주세요.';
      return;
    }

    const matched = buildingCards.find((building) => building.tags.some((tag) => query.includes(tag)));
    if (matched) {
      selectBuilding(matched.id);
      return;
    }

    searchResult.textContent = '해당 키워드는 공식 자료 확인 필요. 아래 A~J 건물 목록에서 직접 선택해 주세요.';
  }

  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') handleSearch();
  });
  goBuildings.addEventListener('click', () => {
    document.getElementById('buildings').scrollIntoView({ behavior: 'smooth' });
  });

  renderMarkers();
  renderBuildingCards();
  selectBuilding('A');
});
