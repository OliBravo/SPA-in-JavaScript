/*
 * spa.chat.js
 * Moduł funkcji czatu dla aplikacji SPA.
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, spa, getComputedStyle */

spa.chat = (function () {
  //---------------- ROZPOCZĘCIE SEKCJI ZMIENNYCH ZAKRESU MODUŁU --------------
  var
    configMap = {
      main_html : String()
        + '<div class="spa-chat">'
          + '<div class="spa-chat-head">'
            + '<div class="spa-chat-head-toggle">+</div>'
            + '<div class="spa-chat-head-title">'
              + 'Czat'
            + '</div>'
          + '</div>'
          + '<div class="spa-chat-closer">x</div>'
          + '<div class="spa-chat-sizer">'
            + '<div class="spa-chat-msgs"></div>'
            + '<div class="spa-chat-box">'
              + '<input type="text"/>'
              + '<div>Wyślij</div>'
            + '</div>'
          + '</div>'
        + '</div>',

      settable_map : {
        slider_open_time    : true,
        slider_close_time   : true,
        slider_opened_em    : true,
        slider_closed_em    : true,
        slider_opened_title : true,
        slider_closed_title : true,

        chat_model      : true,
        people_model    : true,
        set_chat_anchor : true
      },

      slider_open_time     : 250,
      slider_close_time    : 250,
      slider_opened_em     : 18,
      slider_closed_em     : 2,
      slider_opened_title  : 'Kliknij, aby zamknąć',
      slider_closed_title  : 'Kliknij, aby otworzyć',
      slider_opened_min_em : 10,
      window_height_min_em : 20,

      chat_model      : null,
      people_model    : null,
      set_chat_anchor : null
    },
    stateMap  = {
      $append_target   : null,
      position_type    : 'closed',
      px_per_em        : 0,
      slider_hidden_px : 0,
      slider_closed_px : 0,
      slider_opened_px : 0
    },
    jqueryMap = {},

    setJqueryMap, getEmSize, setPxSizes, setSliderPosition,
    onClickToggle, configModule, initModule,
    removeSlider, handleResize
    ;
  //----------------- ZAKOŃCZENIE SEKCJI ZMIENNYCH ZAKRESU MODUŁU ---------------

  //------------------- ROZPOCZĘCIE SEKCJI METOD NARZĘDZIOWYCH ------------------
  getEmSize = function ( elem ) {
    return Number(
      getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
    );
  };
  //-------------------- ZAKOŃCZENIE SEKCJI METOD NARZĘDZIOWYCH  -------------------

  //--------------------- ROZPOCZĘCIE SEKCJI METOD DOM --------------------
  // Rozpoczęcie metody DOM /setJqueryMap/.
  setJqueryMap = function () {
    var
      $append_target = stateMap.$append_target,
      $slider        = $append_target.find( '.spa-chat' );

    jqueryMap = {
      $slider : $slider,
      $head   : $slider.find( '.spa-chat-head' ),
      $toggle : $slider.find( '.spa-chat-head-toggle' ),
      $title  : $slider.find( '.spa-chat-head-title' ),
      $sizer  : $slider.find( '.spa-chat-sizer' ),
      $msgs   : $slider.find( '.spa-chat-msgs' ),
      $box    : $slider.find( '.spa-chat-box' ),
      $input  : $slider.find( '.spa-chat-input input[type=text]')
    };
  };
  // Zakończenie metody DOM /setJqueryMap/.

  // Rozpoczęcie metody DOM /setPxSizes/.
  setPxSizes = function () {
    var px_per_em, window_height_em, opened_height_em;

    px_per_em = getEmSize( jqueryMap.$slider.get(0) );
    window_height_em = Math.floor(
      ( $(window).height() / px_per_em ) + 0.5
    );

    opened_height_em
      = window_height_em > configMap.window_height_min_em
      ? configMap.slider_opened_em
      : configMap.slider_opened_min_em;

    stateMap.px_per_em        = px_per_em;
    stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
    stateMap.slider_opened_px = opened_height_em * px_per_em;
    jqueryMap.$sizer.css({
      height : ( opened_height_em - 2 ) * px_per_em
    });
  };
  // Zakończenie metody DOM /setPxSizes/.

  // Rozpoczęcie metody publicznej /setSliderPosition/.
  // Przykład: spa.chat.setSliderPosition( 'closed' );
  // Cel: przesunięcie suwaka czatu do żądanej pozycji.
  // Argumenty:
  //   * position_type — enum('closed', 'opened' lub 'hidden');
  // * callback — opcjonalne wywołanie zwrotne, które ma być uruchomione na koniec
  //     animacji suwaka. Wywołanie zwrotne otrzymuje kolekcję jQuery
  //     reprezentującą kontener div suwaka jako jego pojedynczy argument.
  //
  // Akcja:
  // ta metoda przesuwa suwak do żądanej pozycji.
  // Jeśli żądaną pozycją jest aktualna pozycja,
  // zwraca true bez podejmowania dalszych działań.
  // Zwraca:
  // * true — żądana pozycja została osiągnięta;
  // * false — żądana pozycja nie została osiągnięta.
  // Rzuca: nic.
  //
  setSliderPosition = function ( position_type, callback ) {
    var
      height_px, animate_time, slider_title, toggle_text;

    // Zwraca true, jeśli suwak jest już w żądanej pozycji.
    if ( stateMap.position_type === position_type ){
      return true;
    }

    // Przygotowanie parametrów animacji.
    switch ( position_type ){
      case 'opened' :
        height_px    = stateMap.slider_opened_px;
        animate_time = configMap.slider_open_time;
        slider_title = configMap.slider_opened_title;
        toggle_text  = '=';
      break;

      case 'hidden' :
        height_px    = 0;
        animate_time = configMap.slider_open_time;
        slider_title = '';
        toggle_text  = '+';
      break;

      case 'closed' :
        height_px    = stateMap.slider_closed_px;
        animate_time = configMap.slider_close_time;
        slider_title = configMap.slider_closed_title;
        toggle_text  = '+';
      break;

      // Rozwiązanie dla nieznanego argumentu position_type.
      default : return false;
    }

    // Animacja zmiany pozycji suwaka.
    stateMap.position_type = '';
    jqueryMap.$slider.animate(
      { height : height_px },
      animate_time,
      function () {
        jqueryMap.$toggle.prop( 'title', slider_title );
        jqueryMap.$toggle.text( toggle_text );
        stateMap.position_type = position_type;
        if ( callback ) { callback( jqueryMap.$slider ); }
      }
    );
    return true;
  };
  // Zakończenie metody publicznej DOM /setSliderPosition/.
  //---------------------- ZAKOŃCZENIE SEKCJI METOD DOM ---------------------

  //------------------- ROZPOCZĘCIE SEKCJI PROCEDUR OBSŁUGI ZDARZEŃ -------------------
  onClickToggle = function ( event ){
    var set_chat_anchor = configMap.set_chat_anchor;
    if ( stateMap.position_type === 'opened' ) {
      set_chat_anchor( 'closed' );
    }
    else if ( stateMap.position_type === 'closed' ){
      set_chat_anchor( 'opened' );
    }
    return false;
  };
  //-------------------- ZAKOŃCZENIE SEKCJI PROCEDUR OBSŁUGI ZDARZEŃ --------------------

  //------------------- ROZPOCZĘCIE SEKCJI METOD PUBLICZNYCH -------------------
  // Rozpoczęcie metody publicznej /configModule/.
  // Przykład: spa.chat.configModule({ slider_open_em : 18 });
  // Cel: konfiguracja modułu przed inicjowaniem.
  // Argumenty:
  //   * set_chat_anchor — wywołanie zwrotne do zmiany kotwicy adresu URI,
  //     aby wskazać stan opened (otwarty) lub closed (zamknięty). To wywołanie zwrotne
  //     musi zwracać wartość false (fałsz), jeśli żądany stan nie może zostać ustawiony.
  //   * chat_model — obiekt modelu czatu, który zapewnia metody
  //       do interakcji z naszym komunikatorem internetowym.
  //   * people_model — obiekt modelu użytkowników, który zapewnia
  //       metody do interakcji z listą użytkowników utrzymywaną przez Model.
  //   * slider_* ustawienia. Są to opcjonalne skalary.
  //       Pełną listę znajdziesz w configMap.settable_map.
  //       Przykład: slider_opened_em określa wysokość otwarcia w jednostkach em.
  // Akcja:
  //   wewnętrzna struktura danych konfiguracyjnych (configMap) jest
  //   aktualizowana za pomocą dostarczonych argumentów. Nie są podejmowane żadne inne działania.
  // Zwraca: true.
  // Rzuca: obiekt błędu JavaScript i ślad stosu w przypadku
  //        niedopuszczalnych lub brakujących argumentów.
  //
  configModule = function ( input_map ) {
    spa.util.setConfigMap({
      input_map    : input_map,
      settable_map : configMap.settable_map,
      config_map   : configMap
    });
    return true;
  };
  // Zakończenie metody publicznej /configModule/.

  // Rozpoczęcie metody publicznej /initModule/.
  // Przykład: spa.chat.initModule( $('#div_id') );
  // Cel:
  //   wskazuje Czatowi, aby zaoferował swoje możliwości użytkownikowi.
  // Argumenty:
  //   * $append_target (example: $('#div_id')).
  //   Kolekcja jQuery, która powinna reprezentować pojedynczy kontener DOM.
  //
  // Akcja:
  //   dołącza suwak czatu do dostarczonego kontenera i wypełnia
  //   go zawartością HTML. Następnie inicjuje elementy,
  //   zdarzenia oraz procedury obsługi, aby zapewnić użytkownikowi interfejs
  //   czatroomu.
  // Zwraca: true w przypadku powodzenia, false w przypadku niepowodzenia.
  // Rzuca: nic.
  //
  initModule = function ( $append_target ) {
    $append_target.append( configMap.main_html );
    stateMap.$append_target = $append_target;
    setJqueryMap();
    setPxSizes();

    // Inicjowanie suwaka czatu z domyślnym tytułem i w domyślnym stanie.
    jqueryMap.$toggle.prop( 'tytuł', configMap.slider_closed_title );
    jqueryMap.$head.click( onClickToggle );
    stateMap.position_type = 'closed';

    return true;
  };
  // Zakończenie metody publicznej /initModule/.

  // Rozpoczęcie metody publicznej /removeSlider/.
  // Cel:
  //   * usunięcie elementu DOM chatSlider;
  //   * przywrócenie stanu początkowego;
  //   * usunięcie wskaźników do wywołań zwrotnych oraz innych danych.
  // Argumenty: brak.
  // Zwraca: true.
  // Rzuca: nic.
  //
  removeSlider = function () {
    // Wycofuje inicjowanie i stan. 
    // Usuwa kontener DOM; usuwa także wiązania zdarzeń.
    if ( jqueryMap.$slider ) {
      jqueryMap.$slider.remove();
      jqueryMap = {};
    }
    stateMap.$append_target = null;
    stateMap.position_type  = 'closed';

    // Wycofanie kluczowych konfiguracji.
    configMap.chat_model      = null;
    configMap.people_model    = null;
    configMap.set_chat_anchor = null;

    return true;
  };
  // Zakończenie metody publicznej /removeSlider/.

  // Rozpoczęcie metody publicznej /handleResize /.
  // Cel:
  //   przy danym zdarzeniu zmiany rozmiaru okna
  //   dostosowanie w razie potrzeby dostarczanej przez ten moduł prezentacji.
  // Akcje:
  //   jeśli wysokość lub szerokość okna spadnie poniżej
  //   danej wartości granicznej, zmieniamy rozmiar suwaka czatu
  //   dla zmniejszonego rozmiaru okna.
  // Zwraca wartość boolean:
  //   * false — nie uwzględniono zmiany rozmiaru;
  //   * true — uwzględniono zmianę rozmiaru.
  // Rzuca: nic.
  //
  handleResize = function () {
    // Nic nie rób, jeśli nie mamy kontenera suwaka.
    if ( ! jqueryMap.$slider ) { return false; }

    setPxSizes();
    if ( stateMap.position_type === 'opened' ){
      jqueryMap.$slider.css({ height : stateMap.slider_opened_px });
    }
    return true;
  };
  // Zakończenie metody publicznej /handleResize/.

  // Zwracanie metod publicznych.
  return {
    setSliderPosition : setSliderPosition,
    configModule      : configModule,
    initModule        : initModule,
    removeSlider      : removeSlider,
    handleResize      : handleResize
  };
  //------------------- ZAKOŃCZENIE SEKCJI METOD PUBLICZNYCH ---------------------
}());