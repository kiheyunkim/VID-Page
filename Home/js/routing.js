let moveImgs=[];        //image : movePoints : currentPos

let AdjustPos =(origin)=>{
    return (parseInt(origin.substr(0,origin.length-2)) - 50).toString()+'px';
}

$(window).resize(()=>{
    for(let i=0;i<moveImgs.length;++i){
        //창 크기가 변하면 원래 위치로 즉시 이동
        let img = moveImgs[i]['image'];
        let points = moveImgs[i]['points'];
        let currentPos= moveImgs[i]['currentPos'];

        let top = $(points[currentPos]).css('top');
        let left = $(points[currentPos]).css('left');
        $(img).css('top', AdjustPos(top));
        $(img).css('left',left);
    }
});

$(window).onclick=(event)=>{
    let modal1 = $('#id01');
    let modal2 = $('#id02');
    if (event.target === modal1) 
        modal1.style.display = "none";
    if(event.target === modal2) 
        modal2.style.display = "none";
};

$(document).ready(
    ()=>{
        let StartPathFind = ()=>{
    
            let routers = $('.race').children('div');
            for(let i =0 ;i<routers.length;++i){
              let points = $(routers[i]).find('span');
              let image = $(routers[i]).find('img');
              let currentPos = 0;
              moveImgs[i]={image,points,currentPos};
            }
    
            async function RoutingPath(start,moveImage)
            {
                let img = moveImage['image'];
                let points = moveImage['points'];
    
                let top = $(points[start]).css('top');
                let left = $(points[start]).css('left');
                $(img).css('top', AdjustPos(top));
                $(img).css('left',left);
    
                moveImage['currentPos'] = start;
                if(start<points.length-1){
                    return setTimeout(async function(){ await RoutingPath(start +1,moveImage)},1000);
                }
            }
    
            for(let i=0;i<moveImgs.length;++i){
                RoutingPath(0,moveImgs[i]);
            }
        }

        let StartGauge = ()=>{
                $(('.graph .circle')).circleProgress().on(
                  'circle-animation-progress', function(event, progress, stepValue){
                    $(this).find('strong').text(String(stepValue.toFixed(2)).substr(2)+'%');
                });
        };

        let StartBox = ()=>{          

            async function Fade(){
                $('.unbox .bottom').css('animation','bottomFade 2s both');
                $('.unbox .inner').css('animation','backgroundFade 2s both');
            }

            async function BoxOpen(){
                $('.unbox .side').css('animation','boxSide 2.5s cubic-bezier(.77,0,.18,1) both');

                return setTimeout(async function(){await Fade()}, 2500);
            }

            BoxOpen();
        }


        StartPathFind();
        StartGauge();
        StartBox();
    }


)
