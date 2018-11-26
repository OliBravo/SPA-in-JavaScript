/*
 * spa.shell.js
 * Moduł powłoki dla aplikacji SPA.
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa */

spa.shell = (function () {
  //---------------- ROZPOCZĘCIE SEKCJI ZMIENNYCH ZAKRESU MODUŁU --------------
  var
    configMap = {
      anchor_schema_map : {
        chat  : { opened : true, closed : true }
      },
      main_html : String()
        + '<div class="spa-shell-head">'
          + '<div class="spa-shell-head-logo"></div>'
          + '<div class="spa-shell-head-acct"></div>'
          + '<div class="spa-shell-head-search"></div>'
        + '</div>'
        + '<div class="spa-shell-main">'
          + '<div class="spa-shell-main-nav"></div>'
          + '<div class="spa-shell-main-content"></div>'
        + '</div>'
        + '<div class="spa-shell-foot"></div>'
        + '<div class="spa-shell-modal"></div>'
    },

    stateMap  = { anchor_map : {} },
    jqueryMap = {},

    copyAnchorMap,    setJqueryMap,
    changeAnchorPart, onHashchange,
    setChatAnchor,    initModule;
  //----------------- ZAKOŃCZENIE SEKCJI ZMIENNYCH ZAKRESU MODUŁU ---------------

  //------------------- ROZPOCZĘCIE SEKCJI METOD NARZĘDZIOWYCH ------------------
  // Zwraca kopię przechowywanej mapy kotwicy; minimalizuje narzut.
  copyAnchorMap = function () {
    return $.extend( true, {}, stateMap.anchor_map );
  };
  //-------------------- ZAKOŃCZENIE SEKCJI METOD NARZĘDZIOWYCH  -------------------

  //--------------------- ROZPOCZĘCIE SEKCJI METOD DOM --------------------
  // Rozpoczęcie metody DOM /setJqueryMap/.
  setJqueryMap = function () {
    var $container = stateMap.$container;
    jqueryMap = { $container : $container };
  };
  // Zakończenie metody DOM /setJqueryMap/.

  // Rozpoczęcie metody DOM /changeAnchorPart/
  // Cel: zmiana części komponentu kotwicy URI.
  // Argumenty:
  //   * arg_map — mapa opisująca, którą część kotwicy URI chcemy zmienić.
  //
  // Zwraca:
  //   * true — część kotwicy adresu URI została zaktualizowana;
  //   * false — część kotwicy adresu URI nie mogła zostać zaktualizowana.
  // Akcje:
  //   bieżąca reprezentacja kotwicy przechowana w stateMap.anchor_map;
  //   sposób kodowania przez wtyczkę uriAnchor został omówiony w kolejnym podpunkcie.
  // Ta metoda:
  //   * tworzy kopię tej mapy za pomocą metody copyAnchorMap();
  //   * modyfikuje wartości kluczy za pomocą arg_map;
  //   * zarządza rozróżnianiem pomiędzy niezależnymi
  //     i zależnymi wartościami w kodowaniu;
  //   * próbuje zmienić adres URI za pomocą uriAnchor;
  //   * zwraca true w przypadku powodzenia oraz false, jeśli operacja się nie powiedzie.
  //
  changeAnchorPart = function ( arg_map ) {
    var
      anchor_map_revise = copyAnchorMap(),
      bool_return       = true,
      key_name, key_name_dep;

    // Rozpoczęcie wprowadzania zmian w mapie kotwicy.
    KEYVAL:
    for ( key_name in arg_map ) {
      if ( arg_map.hasOwnProperty( key_name ) ) {

        // Przeskakiwanie zależnych kluczy podczas iteracji.
        if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }

        // Aktualizacja niezależnej wartości klucza.
        anchor_map_revise[key_name] = arg_map[key_name];

        // Aktualizacja odpowiadającego klucza zależnego.
        key_name_dep = '_' + key_name;
        if ( arg_map[key_name_dep] ) {
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
        }
        else {
          delete anchor_map_revise[key_name_dep];
          delete anchor_map_revise['_s' + key_name_dep];
        }
      }
    }
    // Zakończenie wprowadzania zmian w mapie kotwicy.

    // Rozpoczęcie próby aktualizacji URI; przywrócenie poprzedniego w przypadku niepowodzenia.
    try {
      $.uriAnchor.setAnchor( anchor_map_revise );
    }
    catch ( error ) {
      // Zastąpienie adresu URI stanem obecnym.
      $.uriAnchor.setAnchor( stateMap.anchor_map,null,true );
      bool_return = false;
    }
    // Zakończenie próby aktualizacji adresu URI…

    return bool_return;
  };
  // Zakończenie metody DOM /changeAnchorPart/.
  //--------------------- ZAKOŃCZENIE SEKCJI METOD DOM ----------------------

  //------------------- ROZPOCZĘCIE SEKCJI PROCEDUR OBSŁUGI ZDARZEŃ -------------------
  // Rozpoczęcie procedury obsługi zdarzeń /onHashchange/.
  // Cel: obsługa zdarzenia hashchange.
  // Argumenty:
  //   * event — obiekt zdarzeń jQuery.
  // Ustawienia: brak.
  // Zwraca: false
  // Akcje:
  //   * parsuje komponent kotwicy adresu URI;
  //   * porównuje zaproponowany stan aplikacji ze stanem bieżącym;
  //   * dostosowuje aplikację tylko wtedy, kiedy proponowany stan
  //     różni się od istniejącegoi jest dozwolony w schemacie kotwicy
  //
  onHashchange = function ( event ) {
    var
      _s_chat_previous, _s_chat_proposed, s_chat_proposed,
      anchor_map_proposed,
      is_ok = true,
      anchor_map_previous = copyAnchorMap();

    // Próba parsowania kotwicy.
    try { anchor_map_proposed = $.uriAnchor.makeAnchorMap(); }
    catch ( error ) {
      $.uriAnchor.setAnchor( anchor_map_previous, null, true );
      return false;
    }
    stateMap.anchor_map = anchor_map_proposed;

    // Zmienne złożone.
    _s_chat_previous = anchor_map_previous._s_chat;
    _s_chat_proposed = anchor_map_proposed._s_chat;

    // Rozpoczęcie dostosowywania komponentu czatu, jeśli został zmieniony.
    if ( ! anchor_map_previous
     || _s_chat_previous !== _s_chat_proposed
    ) {
      s_chat_proposed = anchor_map_proposed.chat;
      switch ( s_chat_proposed ) {
        case 'opened' :
          is_ok = spa.chat.setSliderPosition( 'opened' );
        break;
        case 'closed' :
          is_ok = spa.chat.setSliderPosition( 'closed' );
        break;
        default :
          spa.chat.setSliderPosition( 'closed' );
          delete anchor_map_proposed.chat;
          $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
    }
    // Zakończenie dostosowywania komponentu czatu, jeśli został zmieniony.

    // Rozpoczęcie przywracania kotwicy, jeśli zmiana suwaka została odrzucona.
    if ( ! is_ok ){
      if ( anchor_map_previous ){
        $.uriAnchor.setAnchor( anchor_map_previous, null, true );
        stateMap.anchor_map = anchor_map_previous;
      }
      else {
        delete anchor_map_proposed.chat;
        $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
      }
    }
    // Koniec przywracania kotwicy, jeśli zmiana suwaka została odrzucona.

    return false;
  };
  // Zakończenie procedury obsługi zdarzeń /onHashchange/.
  //-------------------- ZAKOŃCZENIE SEKCJI PROCEDUR OBSŁUGI ZDARZEŃ --------------------

  //---------------------- ROZPOCZĘCIE SEKCJI WYWOŁAŃ ZWROTNYCH ---------------------
  // Rozpoczęcie metody wywołania zwrotnego /setChatAnchor/.
  // Przykład: setChatAnchor( 'closed' );.
  // Cel: zmiana komponentu chat kotwicy.
  // Argumenty:
  //   * position_type — może być 'closed' lub 'open'.
  // Akcja:
  //   jeśli to możliwe, zmienia parametr 'chat' kotwicy URI na żądaną wartość.
  
  // Zwraca:
  //   * true — żądana część kotwicy została zaktualizowana;
  //   * false — żądana część kotwicy nie została zaktualizowana.
  // Rzuca: nic.
  //
  setChatAnchor = function ( position_type ){
    return changeAnchorPart({ chat : position_type });
  };
  // Zakończenie metody wywołania zwrotnego /setChatAnchor/.
  //----------------------- ZAKOŃCZENIE SEKCJI WYWOŁAŃ ZWROTNYCH ----------------------

  //------------------- ROZPOCZĘCIE SEKCJI METOD PUBLICZNYCH -------------------
  // Rozpoczęcie metody publicznej /initModule/.
  // Przykład: spa.shell.initModule( $('#app_div_id') );
  // Cel:
  //   wskazuje Czatowi, aby zaoferował swoje możliwości użytkownikowi.
  // Argumenty:
  //   * $container (example: $('#app_div_id')).
  //   Kolekcja jQuery, która powinna reprezentować pojedynczy kontener DOM. 
  //
  // Akcja:
  //   wypełnia $container powłoką interfejsu użytkownika,
  //   a następnie konfiguruje i inicjuje moduły funkcji.
  //   Powłoka jest również odpowiedzialna za kwestie dotyczące całej przeglądarki,
  //   takie jak zarządzanie kotwicą URI i plikami cookie.
  // Zwraca: nic. 
  // Rzuca: nic.
  //
  initModule = function ( $container ) {
    // Ładowanie HTML i mapowanie kolekcji jQuery.
    stateMap.$container = $container;
    $container.html( configMap.main_html );
    setJqueryMap();

    // Skonfigurowanie wtyczki uriAnchor do stosowania schematu.
    $.uriAnchor.configModule({
      schema_map : configMap.anchor_schema_map
    });

    // Konfigurowanie i inicjowanie modułów funkcji.
    spa.chat.configModule({
      set_chat_anchor : setChatAnchor,
      chat_model      : spa.model.chat,
      people_model    : spa.model.people
    });
    spa.chat.initModule( jqueryMap.$container );

    // Obsługa zdarzeń zmiany kotwicy URI.
    // Robi się to po tym, jak wszystkie moduły funkcji zostaną skonfigurowane
    // i zainicjowane. W przeciwnym razie nie będą one gotowe do obsługi
    // zdarzenia wyzwalającego, które jest stosowane, aby się upewnić, że kotwica
    // jest uznana za załadowaną.
    //
    $(window)
      .bind( 'hashchange', onHashchange )
      .trigger( 'hashchange' );

  };
  // Zakończenie metody publicznej /initModule/.

  return { initModule : initModule };
  //------------------- ZAKOŃCZENIE SEKCJI METOD PUBLICZNYCH ---------------------
}());
