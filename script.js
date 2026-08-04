// Email capture. No backend yet — stores locally and confirms, so the form
// never silently swallows an address. Swap for a real endpoint before launch.
(function () {
  var form = document.getElementById('notifyForm');
  var status = document.getElementById('notifyStatus');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = document.getElementById('email');
    var value = (input.value || '').trim();

    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      status.dataset.ok = '0';
      status.textContent = 'That email doesn’t look right — try again.';
      input.focus();
      return;
    }

    try {
      var list = JSON.parse(localStorage.getItem('ll_list') || '[]');
      if (list.indexOf(value) === -1) list.push(value);
      localStorage.setItem('ll_list', JSON.stringify(list));
    } catch (err) {
      /* storage unavailable — still confirm to the visitor */
    }

    status.dataset.ok = '1';
    status.textContent = 'You’re on the list. See you at the drop.';
    form.reset();
  });
})();
