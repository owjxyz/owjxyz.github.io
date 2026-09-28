"""Check the rendered sidebar after `bundle exec jekyll build`."""

from html import unescape
from pathlib import Path
import re
import sys


page = Path(sys.argv[1] if len(sys.argv) > 1 else "_site/index.html").read_text()
navigation = re.search(r'<nav class="sidebar-nav heading"[^>]*>(.*?)</nav>', page, re.S).group(1)
groups = re.findall(r"<details\b[^>]*>.*?</details>", navigation, re.S)

actual = []
for group in groups:
    summary = re.search(r"<summary\b[^>]*>(.*?)</summary>", group, re.S).group(1)
    title = unescape(re.sub(r"<[^>]+>", "", summary)).strip()
    links = re.findall(r'<a\b[^>]*href="([^"]+)"', group)
    actual.append((title, links))

assert actual == [
    ("Blog", ["/blog/", "/travel/", "/about/"]),
    ("Study", ["/microprocessor/"]),
    ("Projects", ["https://owjxyz.github.io/ttalkkak/"]),
], actual
assert 'id="_drawer--opened"' in groups[0]
