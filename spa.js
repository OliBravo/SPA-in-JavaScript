// This is my first application in JS

// namespace for the application
var spa = (function(){

// set default values
  var
    configMap = {
      height: 100,
      height_big: 300,
      width: 100,
      width_big: 300,
      toggle_size_animation_duration: 500,
      bkg: "red",
      html: "<div class='main-content'>Lorem ipsum dolor sit amet...</div>"
    },

    col_idx = 0,

    arrColors = ['red', 'blue', 'black', 'yellow'],

    jqueryMap = {},
    stateMap = {
      $container: null,
      is_big: false
    },

// methods
    changeColor, changeText, toggleSize, setJqueryMap;

  setJqueryMap = function() {
    var $container = stateMap.$container;

    jqueryMap = {
      $container: $container,
      $square: $container.find('.main-content')
    };
  }

  changeColor = function(){
    col_idx = (col_idx + 1) % arrColors.length;
    var color = arrColors[col_idx];

    jqueryMap.$square.css('background', color);

    return(false);
  };

  changeText = function(){

    var new_text = $('#myInput').val();
    jqueryMap.$square.html(new_text);
    return(false);
  };

  toggleSize = function(){
    var new_size = {
      height: null,
      width: null
    };

    if (stateMap.is_big){
      //console.log('I am big');
      stateMap.is_big = false;
      new_size.height = configMap.height;
      new_size.width = configMap.width;
    } else {
      //console.log('I am small');
      stateMap.is_big = true;
      new_size.height = configMap.height_big
      new_size.width = configMap.width_big;
    }

    jqueryMap.$square.animate(
      {
        height: new_size.height,
        width: new_size.width,
      },
      configMap.toggle_size_animation_duration
    );
    return(false);
  };

// event handlers
  onChangeColor = function( event ){
    changeColor();
  };

  onChangeText = function( event ){
    changeText();
  };

  onToggleSize = function( event ){
    toggleSize();
  }

// initialization
  initModule = function( $container ){

    stateMap.$container = $container;
    stateMap.is_big = false;
    stateMap.$container.html(configMap.html);

    setJqueryMap();
    //jqueryMap.$container.html(configMap.html);
    jqueryMap.$square
      .css('width', configMap.width)
      .css('height', configMap.height)
      .css('background', configMap.bkg)
    ;


    $('#btnChangeColor').click( onChangeColor );
    $('#btnToggleSize').click( onToggleSize );
    $('#myInput').on( 'input', onChangeText );
  };

  return {initModule: initModule} ;
})();
