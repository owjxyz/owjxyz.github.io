(() => {
  const button = document.getElementById('_search');
  const box = document.getElementById('_search-box');
  const input = document.getElementById('_search-input');
  const hits = document.getElementById('_hits');
  const closeButton = document.getElementById('_search-close');
  if (!button || !box || !input || !hits) return;

  let index;
  let pending;
  const normalize = (value) => value.toLocaleLowerCase().normalize('NFKC');

  function close() {
    button.parentElement.classList.remove('search-open');
    box.classList.remove('show');
    box.setAttribute('aria-hidden', 'true');
    hits.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    input.value = '';
    hits.replaceChildren();
    button.focus();
  }

  function open() {
    button.parentElement.classList.add('search-open');
    box.classList.add('show');
    box.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
    input.focus();
  }

  function render() {
    const words = normalize(input.value.trim()).split(/\s+/).filter(Boolean);
    hits.replaceChildren();
    if (!words.length) {
      hits.hidden = true;
      return;
    }

    const found = index.map((item) => {
      const title = normalize(item.title);
      const description = normalize(item.description || '');
      const body = normalize(item.body || '');
      if (!words.every((word) => title.includes(word) || description.includes(word) || body.includes(word))) return null;
      return { item, score: words.reduce((score, word) => score + (title.includes(word) ? 10 : 0) + (description.includes(word) ? 3 : 0) + (body.includes(word) ? 1 : 0), 0) };
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 20);

    const list = document.createElement('ul');
    for (const { item } of found) {
      const row = document.createElement('li');
      row.className = 'search-item';
      const picture = document.createElement('div');
      picture.className = 'search-img aspect-ratio sixteen-ten';
      if (item.image && item.image !== '/') {
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = '';
        picture.append(img);
      }
      const content = document.createElement('div');
      content.className = 'search-text';
      const heading = document.createElement('p');
      const link = document.createElement('a');
      link.className = 'heading';
      link.href = item.url;
      link.textContent = item.title;
      const url = document.createElement('small');
      url.textContent = item.url;
      heading.append(link, url);
      const summary = document.createElement('p');
      summary.textContent = item.description;
      content.append(heading, summary);
      row.append(picture, content);
      list.append(row);
    }
    if (!found.length) {
      const empty = document.createElement('li');
      empty.textContent = 'No results found';
      list.append(empty);
    }
    hits.append(list);
    hits.hidden = false;
  }

  button.addEventListener('click', async () => {
    if (box.classList.contains('show')) return close();
    open();
    try {
      pending ||= fetch(button.dataset.indexUrl).then((response) => {
        if (!response.ok) throw new Error(`Search index: ${response.status}`);
        return response.json();
      });
      index = await pending;
      if (input.value) render();
    } catch (error) {
      pending = null;
      hits.textContent = 'Search is temporarily unavailable.';
      hits.hidden = false;
      console.error(error);
    }
  });
  input.addEventListener('input', () => { if (index) render(); });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowDown') {
      const first = hits.querySelector('a');
      if (first) { event.preventDefault(); first.focus(); }
    }
  });
  hits.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  hits.addEventListener('click', (event) => { if (event.target.closest('a')) close(); });
  closeButton.addEventListener('click', close);
  document.addEventListener('click', (event) => { if (!event.target.closest('#_search, #_search-box, #_hits') && box.classList.contains('show')) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && box.classList.contains('show')) close(); });
})();
