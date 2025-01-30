console.log("Hello AI");
// https://jscompress.com/


function aigallery(options = {}){
    var fn = 'aigallery';

    var aiJsonData;
    var aiFilterAll;

    var ftypeNames = {};
    
    // https://github.com/jiren/JsonQuery
    var whereDataInit = [];
    whereDataInit["type"] = "kitchen";
    // whereDataInit["type"] = "bathroom";
    // whereDataInit["type"] = "living_room";

    var whereData = $.merge(whereDataInit, []);

    var whereLimit = 9;
    var whereOffset = 0;
    var wherePage = 0;
    var whereOrder = {'ullrich_rank': 'desc', 'filter.front_color': 'asc'};

    var resultAll;

    var aiAssetsData = [];

    // var ftypes = ["front_color","surface_finish","worktop_color","style","building","scenery"];
    var ftypes = {
        "kitchen": ["front_color","surface_finish","worktop_color","style","building","scenery"],
        "bathroom": ["front_color","surface_finish","worktop_color","flooring","style","building"],
        "living_room": ["front_color","surface_finish","flooring","style","building","scenery"],
    };


    var aifilterID = '#aifilter';
    var isMobile = false;
    var lityGen;


    $( window ).resize(function() {
        if ($(window).width() < 768) {
          whereLimit = 8;
          isMobile = true;
          $('body').addClass('isMobile');
          // initBuildFilter();
        } else {
          whereLimit = 9;
          isMobile = false;
          // initBuildFilter();
          $('body').removeClass('isMobile');

        }
    }).resize();

    // $.getJSON( '/special/ai/data/ai_showroom.json', function( data ) {
    // $.getJSON( '/special/ai/data/ai-data.json', function( data ) {
    // $.getJSON( '/special/ai/data/ai-data-de.json', function( data ) {
    $.getJSON( '/special/ai/data/ai-data-'+currentlang+'.json', function( data ) {
        // console.log('get ai-data');
        // ftypeNames = data.filter;
        // new
        ftypeNames = filterArray[whereData["type"]];
        window.aiJsonData = JsonQuery(data.aidata, {'id': 'image_id'});

        window.aiFilterAll = getFilter(window.aiJsonData);
        initBuildFilter();

    });
    // new 07/2024
    $.getJSON( '/special/ai/data/data-links-'+currentlang+'.json', function( data ) {
        aiAssetsData[whereDataInit["type"]] = data;
        // console.log("aiAssetsData");
        // console.log(aiAssetsData);
    });

    $(document).on('change', aifilterID, function(event) {
        where = [];
        whereData = [];
        var hb = "";

        var f = $(aifilterID).serialize();
        // console.log('change ',f);

        var parts = f.split('&');
        var count = 0;
        for (var i = 0, len = parts.length; i < len; i++) {
            pp = parts[i].split('=');
            if (!pp[1]) {continue;};
            whereData['filter.' + pp[0]] = pp[1].replace(/%20/g, ' ');

            hb +=  pp[0] + "=" + pp[1] + "&";

            count++;
        };
        // console.log('whereData onchange');
        // console.log(whereData);
        // console.log(hb);

        if (hb != "") {
            hb = '#' + hb;
        }
        // var newUrl = window.location.href.split('#')[0] + hb;
        // window.history.replaceState({}, '', newUrl);
    

        whereOffset = wherePage = 0;
        if(count==0) {
            $(aifilterID+' select').prop('selectedIndex',0);
            // 10/2024 remove disabled
            // $(aifilterID+' select option').prop('disabled', false);
        }
        filterData();

    });

    function initBuildFilter(){

        console.log('filterBuild');
        // console.log(ftypes[whereData["type"]]);
        // $.each(ftypes[whereData["type"]], function(ftypekey,ftype) {
        //     console.log(ftype);
        //     var tt = filterArray[whereData["type"]][ftype];
        //     console.log(tt);
        // });

        // $.each(ftypes, function(key, ftype) {
        $.each(ftypes[whereData["type"]], function(key, ftype) {


            $(aifilterID+' select[name="'+ftype+'"] option').remove();

            if (isMobile) {
                // $(aifilterID+' select[name="'+ftype+'"]').closest('.col').find('.filter-label').remove();
                $(aifilterID+' select[name="'+ftype+'"]').append('<option value="">» '+ftypeNames[ftype]['fname']+'</option>');

            } else {
                $(aifilterID+' select[name="'+ftype+'"]').closest('.col').find('.filter-label').html(ftypeNames[ftype]['fname']);
                $(aifilterID+' select[name="'+ftype+'"]').append('<option value="">'+aiText.chooseall+'</option>');

                    // $(aifilterID+' select[name="'+ftype+'"]').append('<option value="">Auswahl</option>');

            }

            $.each(ftypeNames[ftype], function(fkey, fvalue) {
                if (window.aiFilterAll[ftype].includes(fkey)) {
                    $(aifilterID+' select[name="'+ftype+'"]').append('<option value="'+fkey+'" >'+fvalue+'</option>');
                } else {
                    if (fkey != 'fname') {
                        console.log('Missing: ', ftype, fkey);
                    }
                }
            });
        });

        /*
        var hashParams = window.location.hash.substring(1).split('&');
        var paramPairs = hashParams.map(function(param) {
          return param.split('=');
        });
      
        for (var i = 0; i < paramPairs.length; i++) {
            if (paramPairs[i][0]) {
                var paramName = paramPairs[i][0];
                var paramValue = paramPairs[i][1];
                $(aifilterID+' select[name="' + paramName + '"] option[value="' + paramValue + '"]').prop('selected',true);
                $(aifilterID+' select[name="' + paramName + '"]').val(paramValue);
            }
        }
        */
        $(aifilterID+' select').selectric('refresh');

        // console.log('init serialize ',$(aifilterID).serialize());

        $(aifilterID).change();
       

    }

    function getFilter(data){
        // console.log('getFilter: data');
        // console.log(data);
        var filter = [];
        // $.each(ftypes, function(key, ftype) {
        $.each(ftypes[whereData["type"]], function(key, ftype) {
            var g = data.groupBy('filter.' + ftype).exec();
            filter[ftype] = [];
            $.each(g, function(key2, val2) {
                filter[ftype].push(key2);
            })
        });
        return filter;
    }

    function filterData(){

        // console.log('filterData whereData');
        // console.log(whereData);

        whereData = $.extend(whereData, whereDataInit);
        window.AIwhereData = whereData;
        // console.log(whereData);
        // console.log('where');
        // console.log(where);


        resultAll = window.aiJsonData.where(whereData).exec();
        // console.log(resultAll);

        var result = window.aiJsonData.where(whereData).limit(whereLimit).offset(whereOffset).order(whereOrder).exec();
        showResultlist(result);

        var filterRemaining = getFilter(JsonQuery(result));
        // var filterRemaining = getFilter(JsonQuery(resultAll));
        // console.log('filterData filterRemaining');
        // console.log(filterRemaining);

        filterAdjust(filterRemaining);
    }


    

    function resetFilter(){
        $(aifilterID+' select').prop('selectedIndex',0);
        // 10/2024 remove disabled
        // $(aifilterID+' select option').prop('disabled', false);
        $(aifilterID).change();
    
    }
    $(document).on('click', '.reset-filter', function(event) {
        resetFilter();
    });

    function filterAdjust(filter){

        // console.log('filterAdjust: aiFilterAll');
        // console.log(window.aiFilterAll);
        // console.log('filterAdjust: filter');
        // console.log(filter);

        // console.log(filter);

        var f = $(aifilterID).serialize();
        var parts = f.split('&');
        var count = 0;
        var filterSet;
        for (var i = 0, len = parts.length; i < len; i++) {
            pp = parts[i].split('=');
            if (!pp[1]) {continue;};
            // console.log("pp",pp);
            filterSet = pp[0];
            count++;
        };
        // console.log('count', filterSet,count);
        // disable all if more then one filter is selected, not only first choice

        // 10/2024 remove disabled
        // if (count > 1) {
        //     $(aifilterID+' select option:not(:first-child)').prop('disabled', true);
        // } else if (count == 1) {
        //     $(aifilterID+' select:not([name="'+filterSet+'"]) option:not(:first-child)').prop('disabled', true);
        // }


        if (count==0) {
            $('.reset-filter').hide();
            // $('.generate-content').removeClass('active');
        } else {
            $('.reset-filter').show();
            // $('.generate-content').addClass('active');
        }

        // enable all remaining
        // 10/2024 remove disabled

        // $.each(ftypes, function(key, ftype) {
        //     $.each(filter[ftype], function(fkey, fvalue) {
        //         $(aifilterID+' select[name="'+ftype+'"] option[value="'+fvalue+'"]').prop('disabled', false);
        //     });
        // });
        // if (count == 1) {
        //     $(aifilterID+' select[name="'+filterSet+'"] option').prop('disabled', false);
        // }

        $(aifilterID+' select').selectric('refresh');

    }

    function showResultlist(res){
        console.log(res);
        // TODO: paging, then no empty
        $('.show-more,.no-results').addClass('hidden');
        if (whereOffset == 0) {
            $('.output-list').empty();
        }

        // 10/2024 remove disabled
        if (res.length == 0) {
            $('.no-results').removeClass('hidden');
        };
        
        for ( var i = 0; i < res.length; i++ ) {
            // console.log(res[i]);
            res[i]['nr'] = ""+(i+1);
            res[i].filterlist = JSON.stringify(res[i].filter);

                    // $.each(res[i].filter, function(key, val) {
                    //     // console.log(key,ftypeNames[key]['fname']);
                    //     var ff = ftypeNames[key]['fname'] + ": " + ftypeNames[key][val] + "<br>"
                    // });

                    // if (res[i].desc.de) {
                    //     res[i].desc = res[i].desc.de.trimEnd().replace(/<br \/>/g, ' ');
                    // }
            res[i].desc = res[i].desc.trimEnd().replace(/<br \/>/g, ' ');

            res[i]['cssstyle']="animation-delay: " + 0.1*(1+i) + 's;';
            var tt =  simtmpl("list_tmpl", res[i]);
            $('.output-list').append(tt);
        }

        wherePage++;
        whereOffset = whereLimit * wherePage;
        
        // filterData();
        if (whereOffset < resultAll.length) {
            $('.show-more').removeClass('hidden');
        }
    }
    function showMore(){
        filterData();
    }
    $(document).on('click', '.show-more', function(event) {
        showMore();
    });

    // function showDetail(){
    //     lity(data);
    // }    
    $(document).on('click', '.js-show-detail', function(event) {
        event.preventDefault();
        var imageid = $(this).closest('.ai-card').data('id');
        var im = window.aiJsonData.find(imageid);

        // var asset = aiAssetsData[whereDataInit["type"]][kid];
        console.log('im',im);

        im['desc'] = im['desc'].trimEnd().replace(/\n/g,"<br />");

        im['reckitchen'] = "";
        if (im.kitchen && im.kitchen.length > 0) {
            if (im.kitchen.length==1) {
                im['reckitchen'] = "<h5>"+aiText.kitchen_header1+"</h5>";
            } else {
                im['reckitchen'] = "<h5>"+aiText.kitchen_header0+"</h5>";
            }
            $.each(im.kitchen, function(key, k) {
                if (im.kitchen.length==1) {
                    k['onlyone'] = 'full';
                }
                console.log('k',k);
                im['reckitchen'] += simtmpl("kitchen_tmpl", k);
            });
        }
        console.log(im);

        var pills = "";
        // $.each(ftypes, function(key, ftype) {
        $.each(ftypes[whereData["type"]], function(key, ftype) {
            if (ftype == 'front_color') {
                return;
            }
            pills += '<span title="'+ftypeNames[ftype]['fname']+'">' + ftypeNames[ftype][im['filter'][ftype]] + '</span>';
        });

        im['pills'] = pills;
        im['specialpill'] = ftypeNames['front_color']['fname'] + "<span>" + ftypeNames['front_color'][im['filter']['front_color']] + "</span>";

        var tt =  simtmpl("showdetail_tmpl", im);
        lity(tt);

    });
    function generateAI(){
        console.log('generateAI');
        console.log(window.AIwhereData);
        var f = $('#aifilter').serialize();
        console.log(f);

        var j = {
            "user_id": -1,
            "num_images": 4,
            "timestamp": new Date().toJSON(),
            "watermark": "nobilia",
            "language": currentlang,
            "text_style": "default",
            "room_type": window.AIwhereData.type,
            "image_width": 1024,
            "image_height": 1024,
            "filter": {}
        };

        var parts = f.split('&');
        for (var i = 0, len = parts.length; i < len; i++) {
            pp = parts[i].split('=');
            if (pp[1]) {
                j.filter[pp[0]] = pp[1];
            }
            // if (!pp[1]) {
                // j.filter[pp[0]] = "all";
            // };
        };

        console.log(j);
        console.log(JSON.stringify(j));

        
        var tt =  simtmpl("showgenerateloading_tmpl", {
            "loadingHeader":aiText.loadingHeader,
            "knowledgeheader":aiText.knowledgeheader,
            "knowledge1":aiText.knowledge1,
            "knowledge2":aiText.knowledge2,
            "knowledge3":aiText.knowledge3,
            "knowledge4":aiText.knowledge4,
            "knowledge5":aiText.knowledge5,
            "knowledge6":aiText.knowledge6,
            "knowledge7":aiText.knowledge7,
            "knowledge8":aiText.knowledge8,
            "knowledge9":aiText.knowledge9,

        });
        console.log("lityGen: " + lityGen);
        if (lityGen) {
            lityGen.close();
        }
        lityGen = lity(tt);

        $('.knowledge p').hide();
        showRandomParagraph();
        var knowledgeintervalID = setInterval(showRandomParagraph, 8000);


/*
        setTimeout(function(){
            clearInterval(knowledgeintervalID);
              showGeneratedResponse("data");
            },8000);
*/

        //JSON.stringify(j)
        /*
        $.post(
            'https://mother-addmfkb6c2c6dmey.germanywestcentral-01.azurewebsites.net/api/generate_full_response',
            JSON.stringify(j),
            function( data ) {
                showGeneratedResponse("data");
                console.log(data);
            }
        );
        */
        console.log('JSONdata: ' + JSON.stringify(j));
        $.ajax({
              type: "POST",
              url: 'https://mother-addmfkb6c2c6dmey.germanywestcentral-01.azurewebsites.net/api/generate_full_response',
              data: JSON.stringify(j),
              success: function( data ) {
                clearInterval(knowledgeintervalID);
                showGeneratedResponse(data);
                console.log(data);
                },
              contentType: "application/json",
              crossDomain: true,
              dataType: "json"
            });
        /*
*/
    }
    function showGeneratedResponse(data){


                // ## response  ###########################
/*                
        var AIresponse = {
            "filter": {
                "front_color": "white",
                "worktop_color": "marble"
            },
            "generated_images": [
                "base64Image1",
                "R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
            ],
            "recommended_fronts": [
                {
                    "front_bk": 336,
                    "generated_text": "Moderne Wohntr\u00e4ume werden wahr: Entdeckt den Charme von Magnolia supermatt auf Beton Sand! \u2060\nUnsere Front in Magnolia supermatt verspricht eine K\u00fcchengestaltung, die durch ihre Sanftheit und ihre supermatte Veredelung besticht. Durch die Kombination mit der Nachbildung einer Beton Sand Arbeitsplatte erhaltet ihr einen Wohnraum, der zeitgem\u00e4\u00dfe \u00c4sthetik mit einem Gef\u00fchl von Erdverbundenheit harmonisch vereint. Diese Materialien repr\u00e4sentieren einen Lifestyle, der eure Pers\u00f6nlichkeit widerspiegelt und euch t\u00e4glich aufs Neue inspiriert. \nSchafft den perfekten Ort zum Kochen, Leben und Wohlf\u00fchlen mit dieser trendbewussten Kombination!\n#nobilia #Highlight #MagnoliaSupermatt #BetonSand #modernliving #k\u00fcchengestaltung\n\n"

                }
            ]
        };
        AIresponse = JSON.stringify(AIresponse);
        var AIresponseData = JSON.parse(AIresponse);
*/
        // var AIresponseData = JSON.parse(data);
        var AIresponseData = data;

        // console.log(AIresponseData);

        var kid = AIresponseData.recommended_fronts[0].front_bk;
        var ktext = AIresponseData.recommended_fronts[0].generated_text;

console.log('showGeneratedResponse:aiAssetsData: ', aiAssetsData);
        var asset = aiAssetsData[whereDataInit["type"]][kid];
// console.log('asset: ', asset);
        if (asset) {
            var reckitchen = "<h5>"+aiText.kitchen_header1+"</h5>";
            asset['onlyone'] = 'full';
            reckitchen += simtmpl("kitchen_tmpl", asset);
        } else {
            var reckitchen = "";
        }


        var pills = "";
        /*
        $.each(ftypes, function(key, ftype) {
            if (ftype == 'front_color') {
                // return;
            }
            if (AIresponseData.filter[ftype]) {
                pills += '<span title="'+ftypeNames[ftype]['fname']+'">' + ftypeNames[ftype][AIresponseData.filter[ftype]] + '</span>';
            };
        });

        console.log(pills);*/
            /*
          <div class="pills">
            <%=pills%>
          </div>
          */

        var genlinks = "";
            genlinks += '<a href="'+aiText['catalogue-link-'+whereData["type"]]+'" class="textlink" target="_blank">'+aiText['catalogue-text-'+whereData["type"]]+'</a>';
            genlinks += '<a href="'+aiText['dealersearch-link']+'" class="textlink" target="_blank">'+aiText['dealersearch-text']+'</a>';

            var t = simtmpl("showgenerate_tmpl", {
                // "pills":pills,
                "genlinks":genlinks,
                "desc":ktext,
                "reckitchen":reckitchen
            });


            $('.showgenerate .outer').fadeOut( 300, function() {
                $(this).html(t);
                $(this).find('picture.main-img').removeClass('hidden marg-bgutter').css('height','0px');

                if (AIresponseData.images[0]) {
                    $(this).find('.genimg .i1 img').attr('src', 'data:image/jpg;base64,' + AIresponseData.images[0])
                };
                if (AIresponseData.images[1]) {
                    $(this).find('.genimg .i2 img').attr('src', 'data:image/jpg;base64,' + AIresponseData.images[1])
                };
                if (AIresponseData.images[2]) {
                    $(this).find('.genimg .i3 img').attr('src', 'data:image/jpg;base64,' + AIresponseData.images[2])
                };
                if (AIresponseData.images[3]) {
                    $(this).find('.genimg .i4 img').attr('src', 'data:image/jpg;base64,' + AIresponseData.images[3])
                };
                // $(this).fadeIn();
                $( this ).fadeIn( 400, function() {
                    $(this).find('picture.main-img').addClass('hidden marg-bgutter').css('height','100%');
                });
            });

    }

    
    $(document).on('click', '.showgenerate .genimg div img', function(event) {
        event.preventDefault();
        $('picture.main-img img').attr('src', $(this).attr('src')).parent().removeClass('hidden');
    });
    $(document).on('click', '.showgenerate picture.main-img img', function(event) {
        event.preventDefault();
        $(this).parent().addClass('hidden');
    });
    $(document).on('click', '.showgenerate .generate-new', function(event) {
        event.preventDefault();
        generateAI();
    });

    $(document).on('click', '.generateAI', function(event) {
        event.preventDefault();
        generateAI();
    });
}


// $(function() {

    window.aig = new aigallery();
    // window.aig.test();

// }); 


let lastShownParagraph = null;
function showRandomParagraph() {
  
  const paragraphs = document.querySelectorAll('.knowledge p');

  // Alle Paragraphen ausblenden
  paragraphs.forEach(p => p.classList.remove('shown'));
  $('.knowledge p').fadeOut();

  // Zufälligen Index auswählen, solange der letzte gezeigte Paragraph einen Cooldown hat
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * paragraphs.length);
  } while (paragraphs[randomIndex] === lastShownParagraph);

  // Neuen Paragraphen anzeigen und als letzten gezeigten speichern
  paragraphs[randomIndex].classList.add('shown');
  lastShownParagraph = paragraphs[randomIndex];

  $(paragraphs[randomIndex]).fadeIn();
}

        // $k.hide().removeClass('hidden');

/***************************************************************************************************
* simtmplcache
***************************************************************************************************/
(function(){
    var simtmplcache = {};
   
    this.simtmpl = function simtmpl(str, data){
      var fn = !/\W/.test(str) ?
        simtmplcache[str] = simtmplcache[str] ||
          simtmpl(document.getElementById(str).innerHTML) :
  
        new Function("obj",
          "var p=[],print=function(){p.push.apply(p,arguments);};" +
          "with(obj){p.push('" +
          str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            // .replace(/\t=(.*?)%>/g, "',if($1)$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'")
        + "');}return p.join('');");
     
      return data ? fn( data ) : fn;
    };
  })();








