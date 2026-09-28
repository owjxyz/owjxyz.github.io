// Run after `bundle exec jekyll build`.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const site = process.argv[2] || '_site';
const page = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
const index = JSON.parse(fs.readFileSync(path.join(site, 'assets/search-index.json'), 'utf8'));

assert.match(page, /id="_search"[^>]*aria-label="Search"/);
assert.match(page, /id="_search-input"[^>]*type="search"/);
assert.match(page, /class="icon-search"/);
assert.match(page, /assets\/js\/search\.js/);
assert.ok(index.some((entry) => entry.title.includes('Arduino Keyboard')));
assert.ok(index.some((entry) => entry.url.includes('/microprocessor/') && entry.body.length > 0));
assert.ok(index.every((entry) => entry.url && entry.title));

const css = fs.readFileSync(path.join(site, 'assets/css/hydejack-9.2.1.css'), 'utf8');
assert.match(css, /#_search-box\{[^}]*clip-path:inset\(0 50% 0 50%\)[^}]*transition:/);
assert.match(css, /#_search-box\.show\{[^}]*clip-path:inset\(0\)/);
assert.match(css, /#_search-box>div\.nav-btn,#_search-box>button\{[^}]*border:0/);
