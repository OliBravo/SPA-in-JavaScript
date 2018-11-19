/*
 * spa.util.js
 * Ogólne narzędzia JavaScript.
 *
 * Michael S. Mikowski — mmikowski@gmail.com
 * Są to procedury, które tworzyłem, kompilowałem i aktualizowałem
 * od roku 1998, inspirując się materiałami znalezionymi w internecie.
 *
 * Licencja X11 (MIT)
 *
*/

/*jslint          browser : true,  continue : true,
  devel  : true,  indent  : 2,     maxerr   : 50,
  newcap : true,  nomen   : true,  plusplus : true,
  regexp : true,  sloppy  : true,  vars     : false,
  white  : true
*/
/*global $, spa */

spa.util = (function () {
    var makeError, setConfigMap;
  
    // Rozpoczęcie publicznego konstruktora /makeError/.
    // Cel: złożony wrapper do tworzenia obiektu błędu.
    // Argumenty:
    //   * name_text — nazwa błędu;
    //   * msg_text — długi komunikat błędu;
    //   * data — opcjonalne dane dołączane do obiektu błędu.
    // Zwraca: nowo utworzony obiekt błędu.
    // Rzuca: nic.
    //
    makeError = function ( name_text, msg_text, data ) {
      var error     = new Error();
      error.name    = name_text;
      error.message = msg_text;
  
      if ( data ){ error.data = data; }
  
      return error;
    };
    // Zakończenie konstruktora publicznego /makeError/.
  
    // Rozpoczęcie metody publicznej /setConfigMap/.
    // Cel: wspólny kod do konfiguracji modułów funkcji.
    // Argumenty:
    //   * input_map — mapa par klucz-wartość do ustawienia w konfiguracji;
    //   * settable_map — mapa dozwolonych kluczy do ustawienia;
    //   * config_map — mapa, do której mają być zastosowane ustawienia.
    // Zwraca: true.
    // Rzuca: wyjątek, jeśli wprowadzany klucz jest niedozwolony.
    //
    setConfigMap = function ( arg_map ){
      var
        input_map    = arg_map.input_map,
        settable_map = arg_map.settable_map,
        config_map   = arg_map.config_map,
        key_name, error;
  
      for ( key_name in input_map ){
        if ( input_map.hasOwnProperty( key_name ) ){
          if ( settable_map.hasOwnProperty( key_name ) ){
            config_map[key_name] = input_map[key_name];
          }
          else {
            error = makeError( 'Błędne dane wejściowe',
              'Ustawianie klucza konfiguracyjnego |' + key_name + '| nie jest obsługiwane'
            );
            throw error;
          }
        }
      }
    };
    // Zakończenie metody publicznej /setConfigMap/.
  
    return {
      makeError    : makeError,
      setConfigMap : setConfigMap
    };
  }());
  