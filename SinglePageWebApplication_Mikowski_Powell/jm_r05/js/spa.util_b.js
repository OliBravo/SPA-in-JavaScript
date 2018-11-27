/**
 * spa.util_b.js
 * Plik JavaScript dla narzędzi przeglądarki.
 *
 * Opracowanie: Michael S. Mikowski
 * Są to procedury, które tworzyłem i aktualizowałem
 * od roku 1998, inspirując się materiałami znalezionymi w internecie.
 * Licencja X11 (MIT)
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa, getComputedStyle */

spa.util_b = (function () {
  'use strict';
  //---------------- ROZPOCZĘCIE SEKCJI ZMIENNYCH ZAKRESU MODUŁU --------------
  var
    configMap = {
      regex_encode_html  : /[&"'><]/g,
      regex_encode_noamp : /["'><]/g,
      html_encode_map    : {
        '&' : '&#38;',
        '"' : '&#34;',
        "'" : '&#39;',
        '>' : '&#62;',
        '<' : '&#60;'
      }
    },

    decodeHtml,  encodeHtml, getEmSize;

  configMap.encode_noamp_map = $.extend(
    {}, configMap.html_encode_map
  );
  delete configMap.encode_noamp_map['&'];
  //----------------- ZAKOŃCZENIE SEKCJI ZMIENNYCH ZAKRESU MODUŁU ---------------

  //------------------- ROZPOCZĘCIE SEKCJI METOD NARZĘDZIOWYCH ------------------
  // Rozpoczęcie metody decodeHtml.
  // Dekodowanie encji HTML w sposób przyjazny dla przeglądarki.
  // Zob.: http://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript.
  //
  //
  decodeHtml = function ( str ) {
    return $('<div/>').html(str || '').text();
  };
  // Zakończenie metody decodeHtml.


  // Rozpoczęcie metody encodeHtml.
  // Jest to koder pojedynczego kodowania dla encji html i obsługuje dowolną liczbę znaków.
  //
  //
  encodeHtml = function ( input_arg_str, exclude_amp ) {
    var
      input_str = String( input_arg_str ),
      regex, lookup_map
      ;

    if ( exclude_amp ) {
      lookup_map = configMap.encode_noamp_map;
      regex      = configMap.regex_encode_noamp;
    }
    else {
      lookup_map = configMap.html_encode_map;
      regex      = configMap.regex_encode_html;
    }
    return input_str.replace(regex,
      function ( match, name ) {
        return lookup_map[ match ] || '';
      }
    );
  };
  // Zakończenie metody encodeHtml.

  // Rozpoczęcie metody getEmSize.
  // Zwraca rozmiar jednostek em w pikselach.
  //
  getEmSize = function ( elem ) {
    return Number(
      getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
    );
  };
  // Zakończenie metody getEmSize.

  // Eksportowanie metod.
  return {
    decodeHtml : decodeHtml,
    encodeHtml : encodeHtml,
    getEmSize  : getEmSize
  };
  //------------------- ZAKOŃCZENIE SEKCJI METOD PUBLICZNYCH ---------------------
}());
