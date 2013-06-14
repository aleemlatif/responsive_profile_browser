/*	................................................................
		author: 	Aleem Latif
 		desc: 		JS code for Resposove Profile Browser 		
.................................................................. */

/**
	Main profileBrowser object for responsive design page layout
*/
var profileBrowser = {
	
	//	Set the default option values	
    options	 : {  	                
		sortOrder:	'asc',
		jsonData: data,		
		devices : {							// Set the devices with max resolution
			'widescreen': 3000,
			'desktop': 1200,
			'tablet': 800,
			'mobile': 600
		},		
		deviceSelected : 'widescreen'		// Set default device as 'widescreen'
	},
	
	init : function (data, sortOrder)	{
		_this = this;
		
		// Override defaults		
		_this.options.sortOrder = (sortOrder)? sortOrder : _this.options.sortOrder;	
		_this.options.jsonData = (data)? data : _this.options.jsonData;	
		
		// Sort JSON data through firstName
		_this.sortJasonData('firstName', _this.options.sortOrder);	
		
		// Generate Left Menu and show the first Bio data		
		_this.generateMenu();
		
		// Track click event on Menu Items
		_this.clickEventTracker();		
		
		// Call on DOM Load
		_this.setBrowserDevice();
		
		// Call on each window resize event
		$(window).resize(function() {
			// Reset Device type on window resize and adjust the location of Bio Data contents
			_this.setBrowserDevice();
		});
			
	},
	
	// sort JSON data through firstName properties, in ASC or DESC order
	sortJasonData: function(prop, sortOrder)	{
		    _this.options.jsonData = _this.options.jsonData.sort(function(a, b) {			  
				if (sortOrder == 'asc') return (a[prop] > b[prop]);				
				else return (b[prop] > a[prop]);
			});
	},
	
	/**
		Generate left menu, through firstName and lastName properties in the JSON data
	*/
	generateMenu: function()	{
		
		 $('.left_menu li').remove();
		 
		  var items = [];
		
		  $.each(_this.options.jsonData, function(key, val) {			  
			items.push('<li>' + '<a href="#'+ val.id +'" title="' + val.firstName +' '+ val.lastName +'">' + val.firstName +' '+ val.lastName +'</a>' + '</li>'); 
		  });	  
		  
		  // add classes to the first and last LI elements for rounded borders and default active state		   
		  items[0]=items[0].replace('<li>','<li class="first active">');
		  items[items.length-1]=items[items.length-1].replace('<li>','<li class="last">');
		  
		  // append the rendered menu items in the left menu
		  $('.left_menu').html(items.join(''));
		  
		  // Show contents for first menu item
		  _this.generateBioData(_this.options.jsonData[0].id);
		  
	},
	
	/**
	 	Generate Bio Data content, through other relevant properties from the JSON data
	*/
	generateBioData:	function(menuItemId)	{
			
		// if it is click from an <a> with href = '#'+id then remove '#' value
		if (menuItemId.indexOf("#") == 0)	{
			menuItemId = menuItemId.substr(1);
		}
		
		// reset content block
		$('#content_section').empty();
		
		$.each(_this.options.jsonData, function(key, val) {
				
				if (menuItemId == val.id)	{
					
					// replace any new line characters in the data with the <p> tags
					val.bio = val.bio.replace(/\n/g, "<hr />");
					
					// Append the contents into the contents section
					$('#content_section')
					.append(
						$("<div>").addClass("img-container").append(
							  $("<img>").attr("src", 'resources/'+val.picture).attr("alt", val.firstName +' '+ val.lastName).attr("title", val.firstName +' '+ val.lastName)
						),
										
						$("<h2>").html(val.firstName +' '+ val.lastName),									 
						$("<div>").addClass("biodata").append(
							  $("<p>").html(val.bio)
						)
					);
					
				}
		});
	},
	
	/**
			 Track click events on menu items and load relevant Bio Data
	*/
	clickEventTracker: function()	{		
								 				
			$('.left_menu li a').live('click', function(e) {	
				e.preventDefault();			
				_this.generateBioData( $(this).attr('href') );	
				
				$(this).parent('li').siblings().removeClass('active'); 
				$(this).parent('li').addClass('active');	
				
				_this.setBrowserDevice();	
				
				return false;
			});		
	},
	
	/**
		Track browser device type based upong window.width
	*/
	setBrowserDevice: function()	{
		
		var devices = _this.options.devices;
		var deviceSelected = _this.options.deviceSelected;
		
		// Get Window Height and Width
		var windowHeight = parseInt($(window).height() * 1);
		var windowWidth = parseInt($(window).width() * 1);
		
		if(windowWidth > devices.desktop) {
			deviceSelected = 'widescreen';
			// Append BioData after the #menu_section		
			$("#content_section").insertAfter("#menu_section"); 
		
		} else if(windowWidth < devices.desktop && windowWidth > devices.tablet) {
			deviceSelected = 'desktop';
				// Append BioData after the #menu_section			
			$("#content_section").insertAfter("#menu_section");
		
		} else if(windowWidth < devices.tablet && windowWidth > devices.mobile) {
			deviceSelected = 'tablet';
			// Append BioData after the #menu_section	
			$("#content_section").insertAfter("#menu_section");
		
		} else if ( (windowWidth <= devices.mobile) || ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent) ) ) {
			deviceSelected = 'mobile';
			// Append the BioData at the end of active menu item <li>		
			$("#content_section").appendTo(".left_menu li.active");			
		}
				
		//console.log(deviceSelected + ' | ' + windowWidth + ' | ' + windowHeight);
		
		return false;	
	}

}	// end : profileBrowser jQuery Object


/**
 	jQuery document.ready event handler
*/
$(function() {
	/**
		@	param 1 -> json data object
		@   param 2' -> asc' or 'desc' sort order
	*/
	profileBrowser.init(data, 'asc');		
});
