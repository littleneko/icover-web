var countries = {
    jp: 'JP',
    us: 'US',
    cn: 'CN',
    hk: 'HK',
    tw: 'TW'

}

function getSearchParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = decodeURIComponent(tmparr[1]);
    }
    return params;
}

function performSearch() {
    $('#results').html('');
    //$('#results').append('<h3>Searching...</h3>');
    $('#results').append('<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>');

    var query = $('#key').val();
    if (!query.length) {
        return false;
    };

    var country = ($('#country').val()) ? $('#country').val() : 'jp';
    
    $.ajax({
        type: "GET",
        crossDomain: true,
        url: 'https://itunes.apple.com/search?',
        data: {term: query, country: country, media: "music", entity: "album"},
        dataType: 'jsonp',
        success: function (data) {
            $('#results').html('');
            if (!data.resultCount) {
                $('#results').append('<h3>No results found.</h3>');
            } else {
                $('#footer').empty();
                for (var i = 0; i < data.resultCount; i++) {
                    var result = data.results[i];
                    console.log(result.collectionName);

                    var img_300 = result.artworkUrl100.replace("100x100bb.jpg", "300x300bb.jpg");
                    var img_500 = result.artworkUrl100.replace("100x100bb.jpg", "500x500bb.jpg");
                    var img_800 = result.artworkUrl100.replace("100x100bb.jpg", "800x800bb.jpg");
                    var img_1000 = result.artworkUrl100.replace("100x100bb.jpg", "1000x1000bb.jpg");
                    var img_max = result.artworkUrl100.replace("100x100bb.jpg", "10000x10000bb.jpg");

                    var html = '<div class="col-md-4 col-sm-6 item"> <div class="thumbnail product-item">';
                    html += '<a href="'+img_500+'" target="_blank"><img src="'+img_300+'" alt="product"></a>';
                    html += '<div class="caption"><a href="'+result.collectionViewUrl+'" target="_blank" class="product-title" title="'+result.collectionName+' - '+result.artistName+'">'+(result.collectionName+' - '+result.artistName)+'</a>';
                    html += '<p>Download: <a href="'+img_500+'" download="'+result.artistName+' - '+result.collectionName+'_500"> 500 </a>'+
                    '<a href="'+img_800+'" download="'+result.artistName+' - '+result.collectionName+'_8800"> 800 </a>'+
                    '<a href="'+img_1000+'" download="'+result.artistName+' - '+result.collectionName+'_1000"> 1000 </a>'+
                    '<a href="'+img_max+'" download="'+result.artistName+' - '+result.collectionName+'_MAX"> MAX </a></p>';
                    html += '</div> </div> </div>'

                    $('#results').append(html).masonry('reloadItems').masonry('layout');
                };
            }
        },
        complete: function () {
            flow();
        }
    })
}

function flow() {
    var $container = $('.masonry-container');
    $container.imagesLoaded( function () {
        $container.masonry({
            columnWidth: '.item',
            itemSelector: '.item'
        });
    });
}

$(document).ready(function() {	

	var sortable = [];
	for (var key in countries) {
		sortable.push([key, countries[key]]);	
	}
    sortable.sort(function(a, b) {
    	/*if(a[1] < b[1]) return 1;
	    if(a[1] > b[1]) return -1;*/
	    return 1;
    });
	
	for (var i = sortable.length - 1; i >= 0; i--) {
		var array = sortable[i];
		$('#country').append('<option value="'+array[0]+'">'+array[1]+'</option>');
	};

    var params = getSearchParameters();
    if (params.key && params.country) {
        $('#query').val(params.key);
        $('#country').val(params.country);
        performSearch();
    };

	$('#iTunesSearch').submit(function() {
		performSearch();
		return false;
	});

});