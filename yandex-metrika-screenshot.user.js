// ==UserScript==
// @name         Yandex Metrika Screenshot
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Screenshot mode
// @author       popstas
// @match        https://metrika.yandex.ru/*
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/viasite/userscript-yandex-metrika-screenshot/master/dist/yandex-metrika-screenshot.user.js
// ==/UserScript==

/*
Что делает:
- Добавляет в правый нижний угол Метрики кнопку "Скриншот"
- Убирает лишнее со страницы, так, чтобы можно было сделать скриншот всей страницы
- Минимальная ширина страницы 600 точек, а не 1300, как обычно
- Компонует всю доп. инфу в строку шапки
*/

(function() {
  'use strict';
  var u = 'undefined';
  var win = typeof unsafeWindow != u ? unsafeWindow : window;
  var $ = win.$;

  GM_addStyle(`
.screenshot .chart-report__top-controls-bar,
.screenshot .period-selector,
.screenshot .report-page__toolbar + .report-page__toolbar,
.screenshot .segments-list_empty,
.screenshot .add-to-favorites__icon,
.screenshot .counter-toolbar__switcher .icon,
.screenshot .counter-toolbar__caption,
.screenshot .report-page__header-controls,
.screenshot .chart-collapser__switcher,
.screenshot .data-table__constructor-row,
.screenshot .data-table__cell_type_dimension .data-table__controls,
.screenshot .data-table__controls .hint-icon,
.screenshot .data-table__more-row,
.screenshot .report-support__link,
.screenshot .icon__help3,
.robot-setting-dropdown,

/* filters */
.segments-list__group_empty_yes,
.add-filter-button,

.screenshot .main-menu,
.screenshot .header2,
.screenshot .b-page__accounts,
.screenshot .footer
{ display: none; }

body.screenshot {
min-width: 800px;
overflow-y: auto;
}

.screenshot .report-page__header {
  margin-top: -52px;
  /*margin-left: 191px;*/
}
.screenshot .report-page__report-headline {
  font-size: 15px !important;
  text-align: right;
}

/* site name */
.screenshot .b-page__counter {
  padding-left: 420px;
}

.screenshot .report-page__toolbar {
text-align: right;
margin-top: -37px;
}

.screenshot .chart-report__chart-wrap .chart-report__chart-inner {
margin-left: -32px;
}

/* table */
.screenshot .report-page__table { margin-top: 0; }
.screenshot .data-table__row:not(.data-table__row_checked_yes) {
display: none;
}

.screenshot__switcher{
position: fixed;
bottom: 10px;
right: 10px;
z-index: 2;
}
`);

const state = {
  screenshot: false,
  interval: false,
};

function switchScreenshot() {
  state.screenshot = !state.screenshot;

  // hide for screenshot
  $(this).hide();
  setTimeout(() => { $(this).show() }, 2000);

  if (state.screenshot) {
    $('body').addClass('screenshot');

    // remove H annotations
    $('.chart-annotation-mark__icon').
      filter((ind, elem) => $(elem).text() == 'H').
      parents('.chart-annotation-mark').
      remove();
  }

  else {
    $('body').removeClass('screenshot');
  }
}

function checkForGraph() {
  const button = $('.chart-collapser__switcher');
  if (button.length > 0) {
    clearInterval(state.interval);
    const sw = $('<button class="button2 button2_theme_normal button2_size_s button2_pin_circle-circle button2_view_classic i-bem button2_js_inited screenshot__switcher"><span class="button2__text">Скриншот</span></button>');
    sw.on('click', switchScreenshot);
    button.parents('.chart-collapser__controls').after(sw);
  }
}

$(function(){
  let tries = 10;
  state.interval = setInterval(() => {
    checkForGraph();
    tries--;
    if (tries <= 0) clearInterval(state.interval);
  }, 1000);
});

})();