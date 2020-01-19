let moveImgs=[];        //image : movePoints : currentPos
let isTriggerd= [];     //is Started?
let functionReady=[];

let AdjustTopPos =(origin)=>{
    return (parseInt(origin.substr(0,origin.length-2)) - 50).toString()+'px';
}
let AdjustLeftPos =(origin,value )=>{
    return (parseInt(origin.substr(0,origin.length-2)) + (parseInt(value.substr(0,value.length-2)))/5 ).toString()+'px';
}

$(window).resize(()=>{
    for(let i=0;i<moveImgs.length;++i){
        //창 크기가 변하면 원래 위치로 즉시 이동
        let img = moveImgs[i]['image'];
        let points = moveImgs[i]['points'];
        let currentPos= moveImgs[i]['currentPos'];

        let top = $(points[currentPos]).css('top');
        let left = $(points[currentPos]).css('left');
        $(img).css('top', AdjustTopPos(top));
        $(img).css('left',AdjustLeftPos(left,$('.points span').css('width')));
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
        let routers = $('.race').children('div');
        for(let i =0 ;i<routers.length;++i){
          let points = $(routers[i]).find('span');
          let image = $(routers[i]).find('img');
          let currentPos = 0;
          moveImgs[i]={image,points,currentPos};
        }

        for(let i=0;i<moveImgs.length;++i){
            //창 크기가 변하면 원래 위치로 즉시 이동
            let img = moveImgs[i]['image'];
            let points = moveImgs[i]['points'];
            let currentPos= moveImgs[i]['currentPos'];
    
            let top = $(points[currentPos]).css('top');
            let left = $(points[currentPos]).css('left');
            $(img).css('top', AdjustTopPos(top));
            $(img).css('left',AdjustLeftPos(left,$('.points span').css('width')));
        }

        let StartPathFind = async function(){    
            async function RoutingPath(start,moveImage,boolean)
            {
                let img = moveImage['image'];
                let points = moveImage['points'];
    
                let top = $(points[start]).css('top');
                let left = $(points[start]).css('left');
                $(img).css('top', AdjustTopPos(top));
                $(img).css('left',AdjustLeftPos(left,$('.points span').css('width')) );
    
                moveImage['currentPos'] = start;
                if(start<points.length-1){
                    return setTimeout(async function(){ await RoutingPath(start +1,moveImage,boolean)},1000);
                }
                else{
                    if(!!boolean)
                        $(img).attr('src','img/happy_icn.png')
                    else
                        $(img).attr('src','img/sad_icn.png')
                }
            }

            for(let i=0;i<moveImgs.length;++i){
                await RoutingPath(0,moveImgs[i], parseInt(i) === 0 ? false : true);     
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

        let poses = $('body #page');
        let state = false;
        let pose = poses[1].offsetTop;
        isTriggerd[0] = { state,pose};
        pose = poses[2].offsetTop
        isTriggerd[1] = {state,pose};
        pose = poses[3].offsetTop
        isTriggerd[2] = {state,pose};

        functionReady[0] = StartPathFind;      
        functionReady[1] = StartBox;
        functionReady[2] = StartGauge;

        let currentPos=0;
        $(window).scroll(() =>{
            var scrollValue = $(document).scrollTop() + 500;
            if(currentPos > 2)
                return; 

            console.log(isTriggerd);
            if(parseInt(scrollValue) > parseInt(isTriggerd[currentPos]['pose']) ){    //더 커지면
                if(isTriggerd[currentPos]['state'] === false){
                    functionReady[currentPos]();
                    isTriggerd['state']=true;
                    ++currentPos;
                }
            }       
        });
    }


)
