// Журнал событий DOM. Это НЕ журнал фокуса TalkBack: смахивание к объекту не обязано вызывать focusin.
(function () {
  const out = document.getElementById('log');
  const t0 = performance.now();
  function desc(el) {
    if (!el || el === document.body) return 'body';
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    if (el.type) s += '[type=' + el.type + ']';
    return s;
  }
  window.logEvt = function (type, el, extra) {
    const line = `[${((performance.now() - t0) / 1000).toFixed(2)}s] ${type} → ${desc(el)}${extra ? ' | ' + extra : ''}`;
    console.log(line);
    if (out) out.textContent += line + '\n';
  };
  document.addEventListener('focusin', e => logEvt('focusin', e.target));
  document.addEventListener('input', e => logEvt('input', e.target, 'value=' + JSON.stringify(e.target.value)));
  document.addEventListener('change', e => logEvt('change', e.target,
    e.target.type === 'checkbox' ? 'checked=' + e.target.checked : 'value=' + e.target.value));
  document.addEventListener('click', e => { if (e.target.closest('button')) logEvt('click', e.target.closest('button')); });

  // Диалог
  const dlg = document.getElementById('dlg');
  const openBtn = document.getElementById('open-dialog');
  openBtn.addEventListener('click', () => {
    dlg.showModal();
    logEvt('dialog-open (запись приложения)', dlg, 'activeElement=' + desc(document.activeElement));
  });
  document.getElementById('close-dialog').addEventListener('click', () => dlg.close());
  dlg.addEventListener('close', () => {
    // Chrome сам возвращает фокус на кнопку-открыватель; фиксируем, куда он реально попал
    setTimeout(() => logEvt('close', dlg, 'activeElement=' + desc(document.activeElement)), 0);
  });

  // Ползунок: озвучиваемое значение
  const vol = document.getElementById('volume');
  const volOut = document.getElementById('volume-out');
  vol.addEventListener('input', () => { volOut.textContent = vol.value + '%'; });

  // Кнопка поиска: видимый результат
  document.getElementById('search-btn').addEventListener('click', () => {
    const q = document.getElementById('q').value.trim();
    document.getElementById('result').textContent = q ? `Найдено 3 результата по запросу «${q}»` : 'Введите запрос';
  });

  document.getElementById('clear-log').addEventListener('click', () => { out.textContent = ''; });
})();
