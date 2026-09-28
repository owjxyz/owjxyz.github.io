function spread(count) {
  var checkbox = document.getElementById('folder-checkbox-' + count);
  var icon = document.getElementById('spread-icon-' + count);
  var button = document.getElementById('spread-btn-' + count);

  checkbox.checked = !checkbox.checked;
  icon.textContent = checkbox.checked ? 'arrow_drop_down' : 'arrow_right';
  button.setAttribute('aria-expanded', String(checkbox.checked));
}
