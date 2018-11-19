/*
 * module_template.js
 * Szablon do modułów funkcji przeglądarki
 *
 * Michael S. Mikowski - mike.mikowski@gmail.com
 * Copyright (c) 2011-2012 Manning Publications Co.
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, spa */

spa.chat = (function () {

    //---------------- ROZPOCZĘCIE SEKCJI ZMIENNYCH ZAKRESU MODUŁU --------------
    var
      configMap = {
          main_html : '<div>Cześć Kuba :)</div>',
        settable_map : { color_name: true },
        color_name   : 'blue'
      },
      stateMap  = { $container : null },
      jqueryMap = {},
  
      setJqueryMap, configModule, initModule;
    //----------------- ZAKOŃCZENIE SEKCJI ZMIENNYCH ZAKRESU MODUŁU ---------------
  
    //------------------- ROZPOCZĘCIE SEKCJI METOD NARZĘDZIOWYCH ------------------
    // Przykład: getTrimmedString.
    //-------------------- ZAKOŃCZENIE SEKCJI METOD NARZĘDZIOWYCH  -------------------
  
    //--------------------- ROZPOCZĘCIE SEKCJI METOD DOM --------------------
    // Rozpoczęcie metody DOM /setJqueryMap/.
    setJqueryMap = function () {
      var $container = stateMap.$container;
  
      jqueryMap = { $container : $container };
    };
    // Zakończenie metody DOM /setJqueryMap/.
    //---------------------- ZAKOŃCZENIE SEKCJI METOD DOM ---------------------
  
    //------------------- ROZPOCZĘCIE SEKCJI PROCEDUR OBSŁUGI ZDARZEŃ -------------------
    // Przykład: onClickButton = …
    //-------------------- ZAKOŃCZENIE SEKCJI PROCEDUR OBSŁUGI ZDARZEŃ --------------------
  
  
  
    //------------------- ROZPOCZĘCIE SEKCJI METOD PUBLICZNYCH -------------------
    // Rozpoczęcie metody publicznej /configModule/.
    // Cel: dostosowanie konfiguracji dozwolonych kluczy.
    // Argumenty: mapa konfigurowalnych kluczy i wartości.
    //   * color_name — kolor, który ma być użyty.
    // Ustawienia:
    //   * configMap.settable_map deklaruje dozwolone klucze.
    // Zwraca: true.
    // Rzuca: nic.
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
    // Cel: inicjowanie modułu.
    // Argumenty:
    //   * $container — element jQuery używany przez tę funkcję.
    // Zwraca: true.
    // Rzuca: nic.
    //
    initModule = function ( $container ) {
      $container.html(configMap.main_html);
      stateMap.$container = $container;
      setJqueryMap();
      return true;
    };
    // Zakończenie metody publicznej /initModule/.
  
    // Zwracanie metod publicznych.
    return {
      configModule : configModule,
      initModule   : initModule
    };
    //------------------- ZAKOŃCZENIE SEKCJI METOD PUBLICZNYCH ---------------------
  }());
  