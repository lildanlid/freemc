let currentTab = 'worlds';
let allData = {};

const tabs = document.querySelectorAll('.tab');
const sectionTitle = document.getElementById('section-title');
const grid = document.getElementById('grid');
const searchInput = document.getElementById('search-input');
const noResults = document.getElementById('no-results');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    currentTab = tab.dataset.type;
    sectionTitle.textContent = currentTab;
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderGrid();
  });
});

searchInput.addEventListener('input', renderGrid);

function truncate(text, max = 100) {
  return text.length > max ? text.slice(0, max) + '...' : text;
}

function createCard(item) {
  return `
    <div class="bg-gray-800 rounded-2xl overflow-hidden shadow-lg transition-scale animate-fade-in flex flex-col justify-between">
      <img src="${item.banner}" alt="${item.title}" class="w-full object-contain bg-black max-h-80" onerror="this.src='assets/images/fallback-image.jpg';" />
      <div class="p-4 flex flex-col flex-grow">
        <h2 class="text-xl font-semibold mb-2">${item.title}</h2>
        <p class="text-gray-300 text-sm mb-4 flex-grow">${truncate(item.desc)}</p>
        <div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <a href="${item.download}" target="_blank"
             class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex justify-center items-center space-x-1">
            <span class="material-icons">download</span><span>Download</span>
          </a>
          <a href="${item.marketplace}" target="_blank"
             class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex justify-center items-center space-x-1">
            <span class="material-icons">storefront</span><span>Marketplace</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderGrid() {
  const items = (allData[currentTab] || []).filter(item => {
    const q = searchInput.value.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
  });

  grid.innerHTML = items.map(createCard).join('');
  noResults.classList.toggle('hidden', items.length > 0);
}

fetch('./api.json')
  .then(res => res.json())
  .then(data => {
    allData = data;
    renderGrid();
    document.querySelector(`.tab[data-type="${currentTab}"]`).classList.add('active');
  })
  .catch(err => {
    grid.innerHTML = `<div class="text-red-500">Failed to load the data. Please try again later.</div>`;
    console.error("Error loading data:", err);
  });
