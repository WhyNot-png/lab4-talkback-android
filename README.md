# ЛР 4. Экранный доступ в мобильных ОС — вариант Android

TalkBack + Chrome на Android. Объект части 2 — собственная HTML-страница.

## Структура

| Путь | Что это |
| --- | --- |
| [`report/report.md`](report/report.md) | Отчёт (шаблон: поля ⟨…⟩ заполняются фактическими данными с телефона) |
| [`report/architecture.svg`](report/architecture.svg) | Архитектурная схема экранного доступа Android |
| [`stand/before.html`](stand/before.html) | Исходная версия стенда: 2 намеренных барьера |
| [`stand/after.html`](stand/after.html) | Исправленная версия: у кнопки-иконки поиска есть имя |
| [`stand/common.js`](stand/common.js) | Логика стенда и журнал событий DOM |
| `report/img/` | Сюда кладутся скриншоты с телефона и из DevTools |

## Барьеры стенда

1. **Поле поиска без подписи** — текст «Поиск по каталогу» рядом не связан с полем. Не исправлен в обеих версиях: нужен для негативного теста.
2. **Кнопка-иконка без имени** — внутри только SVG с `aria-hidden="true"`. В `after.html` исправлено через `aria-label="Найти"`.

```diff
- <button type="button" id="search-btn" class="icon-btn">
+ <button type="button" id="search-btn" class="icon-btn" aria-label="Найти">
    <svg aria-hidden="true" focusable="false" …>…</svg>
  </button>
```

## Как открыть стенд на телефоне

**По USB:**
```bash
cd stand
python3 -m http.server 8000
adb reverse tcp:8000 tcp:8000      # в другом терминале
# на телефоне: http://localhost:8000/before.html и /after.html
```
**По Wi-Fi (одна сеть):** `python3 -m http.server 8000 --bind 0.0.0.0`, на телефоне `http://IP-КОМПЬЮТЕРА:8000/before.html`.

После работы: Ctrl+C и `adb reverse --remove-all`.

## Инспекция

- Уровень браузера: телефон по USB → на компьютере `chrome://inspect/#devices` → Inspect → Elements → **Accessibility**.
- Платформенный уровень (`AccessibilityNodeInfo`) при включённом TalkBack:
  ```bash
  adb shell uiautomator dump /sdcard/ui.xml && adb pull /sdcard/ui.xml
  ```
- Журнал событий DOM виден внизу страницы и в Console. Это события DOM, а не события TalkBack.
