jQuery( function( $ ) {

  // ---- Animated background in menu ----

  const w = window.innerWidth
  const h = window.innerHeight
  
  const getPercentX  = (x) => Math.round(x / w * 100)
  const getPercentY  = (y) => Math.round(y / h * 100)

  const setStyleProp = document.documentElement.style.setProperty.bind(
    document.documentElement.style
  )
  
  document.addEventListener('mousemove', (e) => {
    const percentX  = getPercentX(e.screenX)
    const percentY  = getPercentX(e.screenY)

    const gradStart = `hsl(${ 280 + (20 * (percentY) / 100)}, 100%, 75%)`
    const gradEnd   = `hsl(${ 325 + (10 * (percentX) / 100)}, 100%, ${ 40 + 0.2 * (percentY) }%)`
    
    setStyleProp('--grad-start', gradStart)
    setStyleProp('--grad-end', gradEnd)
    
  })

  // ---- Show/hide menu ----

  var linkTo;
  
  var head = $("#head"),
      headHeight = $("#head").outerHeight(true),
  		header = $(".header"),
      headerHeight = $(".header").outerHeight(true),
      menu = $("#menu"),
      menuLinks = $(".header_navigation a");

  menuLinks.on("mouseenter", function() {
    // Select menu item
    linkTo = $(this).data('link');
    $('.menu_item').addClass('hidden');
    $('#menu_' + linkTo).removeClass('hidden');
    // Reveal menu
    menu.removeClass('folded');
  });
    
  header.on("mouseleave", function() {
    // Hide menu again
    menu.addClass('folded');
  });

  // ---- Stick/unstick menu ----
  $(window).scroll(function(){
		var headHeight = $("#head").outerHeight(true),
    		scroll = $(window).scrollTop(),
	      firstHeight = $(".container > .module:first-child").outerHeight(true);
            
    if (scroll >= firstHeight){
	    head.css('height', headHeight + 'px');
      header.addClass('fixed');
    } else {
      header.removeClass('fixed');
	    head.css('height', '');
    }
  });

  // ---- Random letters ----

  var characters = ['%','xx','18',':','÷','@','!','H','z','>', '˚d', 'Q', 'pd', '*/', 'K', '&', 'F', '!a', 'œ', '®'];
	var qp = characters;
  
  var quickPreview = function() {
	  i = 0;
	  setInterval(function () {
	    $('.random_letter').text(qp[i++ % qp.length]);
	  }, 200);
  }
  quickPreview();
  
  // ---- Quick Preview ----
    
  $("a.menu_retail_font")
  .on("mouseover", function() {
    var fontStyle = $(this).data('style');
    var fontqp = $(this).data('qp');
    
    // Get array from font-qp  
		qp = Array.from(fontqp);

    $('#menu_quick_preview').removeAttr('style').css('font-family','"' + fontStyle + '"');
  });
  
  $("a.menu_custom_font, a.menu_page")
  .on("mouseover", function() {
    customPreview = 'url(' + ($(this).data('image')) + ')';
    $('#menu_quick_preview figure').hide();
    $('#menu_quick_preview').css('background-image', customPreview);
  }).on('mouseout', function() {
    $('#menu_quick_preview figure').show();
    $('#menu_quick_preview').css('background-image', 'none');
  });

  // ---- Select product type ----

  $('.select-product').on('click', function() {
    // close all other selections
    $('.product-selector__product_selection').hide()

    // open the selected one
    $(this).next('.product-selector__product_selection').show()
  })


  // ---- Hide product selector on click outside ----

  $(document).mouseup(function (e) {
    var container = $(".product-selector__product_selection");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      container.hide();
    }
  });

  // ---- Save-n-Send (untested)
  $('.module-font__textarea').on('keyup', function() {
    // show save n send bar
  })

  // TODO: this element does not exist yet!
  $('#create_save_n_send').on('click', function(e) {
    e.preventDefault()
    // show save n send bar
    var modules = []
    $('.module-font').each(function(index) {
      var text = $('textarea', this).val()
      modules.push({
        index: index,
        text:  text
      })
    })
    // save to db
    $.ajax({
      type : "post",
      dataType : "json",
      url : save_n_send.ajaxurl,
      data : {action: "save_save_n_send", json: JSON.stringify(modules)}
    })
    .done(function(response) {
      var identifier = response.identifier
      console.log(response)
      // the link you want
      var url = window.location.href  + '?share=' + identifier
      console.log(url)
    })
    .error(function(res) {
      console.log(res)
    })
  })

  // check for share param
  var shareId = getParameterByName('share')
  if(shareId) {
    $.ajax({
      type : "post",
      dataType : "json",
      url : save_n_send.ajaxurl,
      data : {action: "load_save_n_send", identifier: shareId}
    })
    .done(function(response) {
        console.log(response.json)
    })
  }
  
  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  
  // ---- Sliders for changing the font size, letter spacing and line height ----

  var changeFontSize = function() {
    
    $(".slider--size").each(function() {
	    
	    var fontStartSize = $(this).parents(".module-font").data('size');
	    
	    if(fontStartSize == 'small') { // .size-small
		    var fontMin = 12,
		    		fontMax = 64;
	    } else if(fontStartSize == 'medium') { // .size-medium
		    var fontMin = 18,
		    		fontMax = 124;
	    } else { // .size-large .size-xl .size-xxl
		    var fontMin = 24,
		    		fontMax = 400;
	    }
	    
	    $(this).slider({
	      range: "min",
	      min: fontMin, // Fallback 0 
	      max: fontMax, // Fallback 100
	      slide: function (e, t) {
	          $(this).closest(".module-font").find(".textarea").css('font-size', t.value + "px");
	      },
	      create: function (e, t) {
	          $(this).slider("value", parseInt($(this).closest(".module-font").find(".textarea").css('font-size'), 10))
	      },
	      change: function (e, t) {
	      }        
	    });
	    
    });
  }
  changeFontSize();  
  
	var changeLetterSpace = function() {
    $(".slider--spacing").slider({
      range: "min",
      min: -50,
      max: 500,
      slide: function (e, t) {
        $(this).closest(".module-font").find(".textarea").css('letter-spacing', (t.value / 1000) + "em");
      },
      create: function (e, t) {
        $(this).slider("value", parseInt($(this).closest(".module-font").find(".textarea").css('letter-spacing'), 10))
      },
      change: function (e, t) {
      }        
    });  
  }
  changeLetterSpace();  
  
  var changeLogotypeSize = function() {
    $(".slider--logotype").slider({
      range: "min",
      min: 50,
      max: 600,
      slide: function (e, t) {
          $(this).closest(".module-font").find(".logotypearea img").css('height', t.value + "px");
      },
      create: function (e, t) {
          $(this).slider("value", parseInt($(this).closest(".module-font").find(".logotypearea img").css('height'), 10))
      }        
    });
  }
  changeLogotypeSize();  
	  
  // ---- Change spacing instead of type size ----
	  
	$(document).ready(function() {
		var hideObject = '.slider--size, .slider--spacing, button.align, button.direction';
		
    $(this).keydown(function(e) {
      if(e.keyCode == 18) {
        e.preventDefault();
        alt_shifter = true;
        console.log('Alt key down');
        $(hideObject).toggleClass('hide'); 
      }
    });
    
    $(this).keyup(function(e) {
      if(e.keyCode == 18) { 
        e.preventDefault();
        alt_shifter = false; 
        console.log('Alt key up');
        $(hideObject).toggleClass('hide'); 
      }
    });
    
  });
  
  // ---- Align text ----
  
  $('button.align ').on('click', function(e) {
    e.preventDefault();
    $('button.align').removeClass('align--active');
    $(this).addClass('align--active');
    $(this).closest(".module-font").find(".textarea").removeClass('left center right');
  
		if($(this).hasClass('align--left')) {
	    $(this).closest(".module-font").find(".textarea").addClass('left');
		}
		
		if($(this).hasClass('align--center')) {
	    $(this).closest(".module-font").find(".textarea").addClass('center');
		}
		
		if($(this).hasClass('align--right')) {
	    $(this).closest(".module-font").find(".textarea").addClass('right');
		}
  })
  
  // ---- Change text direction  ----
 
  $('button.direction').on('click', function(e) {
    e.preventDefault();
    $('button.direction').removeClass('direction--active');
    $(this).addClass('direction--active');
  
		if($(this).hasClass('direction--ltr')) {
	    $(this).closest(".module-font").find(".textarea").attr("dir", "ltr");
		}

		if($(this).hasClass('direction--rtl')) {
	    $(this).closest(".module-font").find(".textarea").attr("dir", "rtl");
		}
  })

  // ---- Show and Hide dropdown ----

  $(document).on('click', function(e) {
    if(!$(e.target).hasClass('dropdown__button')) {
      $('.dropdown').hide();
    }
  })

  $('.dropdown__button').on('click', function(e) {
    e.preventDefault();
    $(this).next('.dropdown').toggle();
  })

  // ---- Check alphabet ----

  $('[data-font]').on('click', function(e) {
    e.preventDefault();
    var font = $(this).data('font');
    var fontFamily = $(this).data('font-family');
    var url = $(this).data('url');
    var variations = $(this).data('variations').split(',');
    var parent = $(this).closest('.module-font');
    var alphabet = parent.data('alphabet');
    var fontAlphabets = $(this).data('supported-alphabets').split(',');
    parent.find('.fontfamily').html(font);
    
    parent.find('.module-font__url').attr('href', url);
    parent.find('.module-font__url').find('span').html(font);
    
    //parent.find('.module-font__bar .buy').html('<a class="buy--link" href="' + url +'">Buy ' + font + " &rarr;</a>" ) // Alternative with font name visible
    parent.find('.module-font__bar .buy').html('<a class="buy--link" href="' + url +'">Slow Buy <span class="arrow">&rarr;</span></a>');    
    parent.find('.module-font__content').find('.textarea').css('font-family','"' + fontFamily + '"');

    parent.find('.variationselector__list').html('');
    parent.find('.fontvariation').html(variations[0]);
    for (var i = 0; i < variations.length; i++) {
      var variation = variations[i];
      parent.find('.variationselector__list').append('<li><a href="#" data-font-family="' + font + ' ' + variation + '" data-variation="' + variation + '">' + variation + '</a></li>')
    }
    // change to fallback text? 
    if($.inArray(alphabet, fontAlphabets) < 0) {
      // font does not support current alphabet. Change to backup
      var newAlphabet = fontAlphabets[0];
      var newCopy = window.fallbackCopy[newAlphabet];
      parent.find('.textarea').html(newCopy);
      parent.data('alphabet', newAlphabet);
    }
  })

  $(document).on("click", "[data-variation]", function(e) {
    e.preventDefault();
    var variation = $(this).data('variation');
    var fontFamily = $(this).data('font-family');
    var parent = $(this).closest('.module-font');
    parent.find('.fontvariation').html(variation);
    parent.find('.module-font__content').find('.textarea').css('font-family','"' + fontFamily + '"');
  })

});
