let util = {
    alert(inp){
        
        window_create(document.getElementsByClassName("window").length,
        (inp.title == undefined ? "Alert" : inp.title),
        "<img src='./src/img/"+(inp.content == undefined ? "info" : inp.content) +".png'> <button>ok</button>"+ (inp.content == undefined ? "Alert" : inp.content),
        {width:220,height:110,resize:false})
    }
}