"use strict";
$(document).ready(function(){
    var ContadorElementos = 0;
    var PosicionElementos = [];
    var Regex = new RegExp(`[^a-zA-Z 0-9áéíóúÁÉÍÓÚñÑ-]`);
    var SelecionLinea = {"estado":false, "Id1":{}, "Id2":{} };

    //accion del menu
    $('.menu .fa-close').click(function(){
        $('.menu').animate({"right":"-20%"},1000)
        $('.menu_abrir').fadeIn(2000)
    })
    $('.menu_abrir .fa-bars').click(function(){
        $('.menu').animate({"right":"0"},1000)
        $('.menu_abrir').hide()
    })

    //se escucha los clicks de las figuras que se pintaran en el vanvas
    $('.menu .figura_svg').click(function(){
        var figura = this.classList[1];
        PosicionElementos[ContadorElementos] = {};
        //se pinta el elemento al contenedor
        $('.contenedor').append( figuras(figura, `elemento elemento_${ContadorElementos}`) );
        //se da la accion para que se pueda mover por el tablero
        $( `.elemento_${ContadorElementos}` ).draggable({ containment: ".contenedor" });
        //se escucha las propiedas del elemento si le dan click
        $(`.elemento`).click(function(){
            var IdElelemt = this.classList[1].replace("elemento_","");
            var top = PosicionElementos[ IdElelemt ].top+2;
            var left = PosicionElementos[ IdElelemt ].left+3;
            if(!SelecionLinea.estado){
                //Se valida que el menu no existe
                if( $(`.menu_elemento_${IdElelemt}`).length != 1 ){
                    $('.menu_elemento').remove()
                    //Se dibuja el menu en la pagina
                    $(".contenedor").append(`<div class="menu_elemento menu_elemento_${IdElelemt}"><div class="menu_opciones"><i class="fa fa-edit"></i></div><div class="menu_opciones"><i class="fa fa-trash-o"></i></div><div class="menu_opciones"><i class="fa fa-exchange"></i></div></div>`);
                    //se pone el boton encima de la figura
                    $(`.menu_elemento_${IdElelemt}`).css({"top":top,"left":left});
                    //Se muestra el elemento
                    $(`.menu_elemento_${IdElelemt}`).show();
                    //se animan los elementos de los botones
                    $(`.menu_elemento_${IdElelemt} .menu_opciones:nth-child(1)`).animate({"left":"-50px"});
                    $(`.menu_elemento_${IdElelemt} .menu_opciones:nth-child(2)`).animate({"top":"53px"});
                    $(`.menu_elemento_${IdElelemt} .menu_opciones:nth-child(3)`).animate({"left":"50px"});
                    //se escuchan los click del menu recien pintado
                    $(`.menu_elemento_${IdElelemt} .menu_opciones:nth-child(1)`).click(function(){
                        var IdElelemto = $(this).parent()[0].classList[1].replace("menu_elemento_","")
                        var top = PosicionElementos[ IdElelemto ].top-30;
                        var left = PosicionElementos[ IdElelemt ].left-20;
                        //se borra cualquier elemento de texto que hubiera antes
                        $(`.texto_${IdElelemto}`).remove()
                        //se pinta el input pra que el usuario especifique el texto
                        $(".contenedor").append(`<div class="elemento_texto texto_${IdElelemt}"><input type="text" placeholder="Texto" maxlength="10" style="width: 100px;"/></div>`);
                        //se posiciona el input sobre el circulo
                        $(`.texto_${IdElelemto}`).css({"top":top,"left":left})
                        //se escucha cuando digita el nombre del elemento
                        $(`.texto_${IdElelemto} input`).keyup(function(e){
                            $(this).val( $(this).val().replace(Regex,"") )
                            if(e.which == 13) {
                                $(this).parent().css({"pointer-events":"none"})
                                $(this).parent().html( $(this).val() )
                            }
                        }).keypress(function(e){
                            $(this).val( $(this).val().replace(Regex,"") )
                        }).focus();
                        //Se quita el menu
                        $('.menu_elemento').remove()
                    })
                    $(`.menu_elemento_${IdElelemt} .menu_opciones:nth-child(2)`).click(function(){
                        var IdElelemto = $(this).parent()[0].classList[1].replace("menu_elemento_","")
                        //Se quita el menu
                        $(`.elemento_${IdElelemto}, .texto_${IdElelemto}, .P1_${IdElelemto}, .P2_${IdElelemto}, .menu_elemento`).remove()
                    })
                    $(`.menu_elemento_${IdElelemt} .menu_opciones:nth-child(3)`).click(function(){
                        var IdElelemto = $(this).parent()[0].classList[1].replace("menu_elemento_","")
                        //se marca un estado con SelecionLinea
                        SelecionLinea.estado = true;
                        SelecionLinea.Id1 = IdElelemto ;
    
                        //Se pintan todos los lementos de azul y se le pone transparencia
                        $(`.elemento`).css({"background-color":"rgba(0, 196, 255,0.8)"});
                        $(`.elemento g`).css({"opacity":"0.6"});
    
                        //Se quita la transparencia del elemento seleccionado y se deja sin opacidad
                        $(`.elemento_${IdElelemto}`).css({"background-color":"transparent"});
                        $(`.elemento_${IdElelemto} g`).css({"opacity":"1"});

                        //Se quita el menu
                        $('.menu_elemento').remove()
                    })
                }
            }else{
                SelecionLinea.Id2 = IdElelemt ;

                var TopP1 = PosicionElementos[ SelecionLinea.Id1 ].top+25
                var LeftP1 = PosicionElementos[ SelecionLinea.Id1 ].left+25
                var TopP2 = PosicionElementos[ SelecionLinea.Id2 ].top+25
                var LeftP2 = PosicionElementos[ SelecionLinea.Id2 ].left+25

                $(`.elemento`).css({"background-color":"transparent"});
                $(`.elemento g`).css({"opacity":"1"});

                if( $(`.P1_${SelecionLinea.Id1}-P2_${SelecionLinea.Id2}`).length == 0 && SelecionLinea.Id1 != SelecionLinea.Id2){
                    $('.contenedor').append(`<svg class="elemento_linea P1_${SelecionLinea.Id1}-P2_${SelecionLinea.Id2} P1_${SelecionLinea.Id1} P2_${SelecionLinea.Id2}" height="100%" width="100%">
                                            <line x1="${LeftP1}" y1="${TopP1}"" x2="${LeftP2}" y2="${TopP2}" style="stroke:#1da1f2;stroke-width:2"/>
                                        </svg>`);
                }
                
                setTimeout(function(){ SelecionLinea.estado = false; }, 100);
            }
        }).mousemove(function(){
            var IdElelemt = this.classList[1].replace("elemento_","");
            var top = $(`.${this.classList[1]}`).position().top;
            var left = $(`.${this.classList[1]}`).position().left - $(`.contenedor`).offset().left ;
            //se guarda la posicion del elemento en la pantalla en PosicionElementos
            if(top != PosicionElementos[ IdElelemt ].top || left != PosicionElementos[ IdElelemt ].left){
                $('.menu_elemento').remove()
                PosicionElementos[ IdElelemt ] = {"top":top,"left":left}
                $(`.texto_${IdElelemt}`).css({"top":top-30,"left":left-20})

                //se valida se se debe mover una linea
                var lineas = $('.elemento_linea');
                for(var i=0; i<lineas.length; i++){
                    var ClaseLinea = $(lineas)[i].classList[1]
                    var P1 = ClaseLinea.split("-")[0].split("_")[1]
                    var P2 = ClaseLinea.split("-")[1].split("_")[1]

                    if(IdElelemt == P1){
                        $(`.${ClaseLinea} line`).attr({"x1":left+25})
                        $(`.${ClaseLinea} line`).attr({"y1":top+25})
                    }else if(IdElelemt == P2){
                        $(`.${ClaseLinea} line`).attr({"x2":left+25})
                        $(`.${ClaseLinea} line`).attr({"y2":top+25})
                    }
                }
            }
        })


        ContadorElementos +=1;
    })

    //se llama la figura que se quiere pintar en el contenedor
    function figuras(figura,clase){
        if(figura == "circulo"){
            return `<svg class="${clase} figura_svg" width="50" height="50"><g><circle cx="25" cy="25" r="24" stroke="black" stroke-width="2" fill="white" /></g></svg>`;
        }else if(figura == "doble_circulo"){
            return `<svg class="${clase} figura_svg" width="50" height="50"><g><circle cx="25" cy="25" r="24" stroke="black" stroke-width="2" fill="white" /><circle cx="25" cy="25" r="20" stroke="black" stroke-width="2" fill="white" /></g></svg>`;
        }else if(figura == 'cuadrado'){
            return `<svg class="${clase} figura_svg" width="50" height="50"><g><rect width="48" height="48" x="1" y="1" style="fill:white;stroke-width:2;stroke:black"/></g></svg>`;
        }else if(figura == "doble_cuadrado"){
            return `<svg class="${clase} figura_svg" width="50" height="50"><g><rect width="48" height="48" x="1" y="1" style="fill:white;stroke-width:2;stroke:black"></rect><rect width="40" height="40" x="5" y="5" style="fill:white;stroke-width:2;stroke:black"/></g></svg>`;
        }else if(figura == "triangulo"){
            return `<svg class="${clase} figura_svg" height="50" width="50"><g><polygon points="25,1 1,49 49,49" class="triangle" fill="white" stroke="black" stroke-width="2" fill="white" /></g></svg>`;
        }else if(figura == "equis"){
            return `<svg class="${clase} viewBox="0 0 50 50" height="50" width="50"><g><g transform="matrix(-1 0 0 1 863.55 0)"><path d="M818,4.7l40.5,40.5" style="stroke:#000000;stroke-width:12"/></g><g transform="matrix(-1 0 0 1 863.55 0)"><path d="M858.8,4.7l-40.5,40.5" style="stroke:#000000;stroke-width:12"/></g><g transform="matrix(-1 0 0 1 863.55 0)"><path d="M857.3,6.1l-37.5,37.8" style="stroke:#FFFFFF;stroke-width:7"/></g><g transform="matrix(-1 0 0 1 863.55 0)"><path class="st1" d="M819.5,5.7L857,43.5" style="stroke:#FFFFFF;stroke-width:7"/></g></g></svg>`;
        }
    }
})