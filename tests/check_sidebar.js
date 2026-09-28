// Run after `bundle exec jekyll build` with the generated site directory.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const site = process.argv[2] || '_site';
const page = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
const nav = page.match(/<nav class="sidebar-nav heading"[^>]*>([\s\S]*?)<\/nav>/)[1];
const groups = [...nav.matchAll(/<li>\s*<div class="menu-wrapper">([\s\S]*?)<\/div>\s*<div class="menu-wrapper">([\s\S]*?)<\/div>\s*<\/li>/g)];
const actual = groups.map(([, parent, children]) => [
  parent.match(/<a[^>]*href="([^"]+)"/)[1],
  parent.match(/<a[^>]*>\s*([^<]+)\s*<\/a>/)[1].trim(),
  [...children.matchAll(/<a[^>]*href="([^"]+)"/g)].map((match) => match[1]),
]);

assert.deepEqual(actual, [
  ['/blog/', 'Blog', ['/blog/', '/travel/']],
  ['/study/', 'Study', ['/microprocessor/']],
  ['/projects/', 'Projects', ['https://owjxyz.github.io/ttalkkak/']],
]);
assert.match(nav, /<li>\s*<div class="menu-wrapper">\s*<a[^>]*href="\/about\/"[^>]*>\s*About\s*<\/a>\s*<\/div>\s*<\/li>\s*<\/ul>/);
assert.match(groups[0][1], /id="_drawer--opened"/);
assert.equal([...nav.matchAll(/id="folder-checkbox-\d+"/g)].length, 3);
assert.equal([...nav.matchAll(/class="material-icons"/g)].length, 3);
assert.match(page, /assets\/js\/sidebar-folder\.js/);
assert.match(page, /fonts\.googleapis\.com\/icon\?family=Material\+Icons/);
for (const dir of ['blog', 'study', 'projects', 'travel', 'microprocessor', 'about']) {
  assert.ok(fs.existsSync(path.join(site, dir, 'index.html')), `${dir} page missing`);
}
assert.match(fs.readFileSync(path.join(site, 'study/index.html'), 'utf8'), /href="\/microprocessor\/"/);
assert.match(fs.readFileSync(path.join(site, 'projects/index.html'), 'utf8'), /href="https:\/\/owjxyz\.github\.io\/ttalkkak\/"/);

const firstCount = Number(groups[0][1].match(/onclick="spread\((\d+)\)"/)[1]);
const elements = {
  [`folder-checkbox-${firstCount}`]: { checked: false },
  [`spread-icon-${firstCount}`]: { textContent: 'arrow_right' },
  [`spread-btn-${firstCount}`]: { attrs: {}, setAttribute(key, value) { this.attrs[key] = value; } },
};
const context = { document: { getElementById: (id) => elements[id] } };
vm.runInNewContext(fs.readFileSync(path.join(site, 'assets/js/sidebar-folder.js'), 'utf8'), context);
context.spread(firstCount);
assert.equal(elements[`folder-checkbox-${firstCount}`].checked, true);
assert.equal(elements[`spread-icon-${firstCount}`].textContent, 'arrow_drop_down');
assert.equal(elements[`spread-btn-${firstCount}`].attrs['aria-expanded'], 'true');
context.spread(firstCount);
assert.equal(elements[`folder-checkbox-${firstCount}`].checked, false);
assert.equal(elements[`spread-icon-${firstCount}`].textContent, 'arrow_right');
assert.equal(elements[`spread-btn-${firstCount}`].attrs['aria-expanded'], 'false');
