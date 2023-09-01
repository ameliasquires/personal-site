

//https://stackoverflow.com/questions/10309650/add-elements-to-the-dom-given-plain-text-html-using-only-pure-javascript-no-jqu
//lets me add elements without fucking up listeners
function appendHtml(el, str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
}

function meta_parse(inp){
  inp = inp.split(" ")
  inp.shift()
  inp = inp.join(" ").split(",")
  //console.log(inp)
  let r = {};
  for(let i of inp){
    i = i.trim()
    r[i.split(" ")[0]] = i.split(" ")[1];
  }
  return r
}

const rem_emp = function (e) {return e !== "";};

function indexs_of(inp,sel){
  if(sel==''){
      let fm = []
      for(let n = 0; n<=inp.length;n++){
        fm.push(n)
      }
      //console.log(fm)
      return fm
    }
  let m = []
  for(let i = inp.indexOf(sel);i>=0;i=inp.indexOf(sel,i+1)){
    m.push(i)
  }
  return m
}
function hrx(inp,match){ //hgx for human (readable) regex, a more user friendly regex
                         //similar to the ones used in command lines
  for(let x in match){
    //console.log(match[x])
    if(match[0]=='*'){
      m = match.split("")
      m.splice(0,1)
      m = m.join("")
      mm = m.split("*")[0]
      //m = m.join("")
      
      if(!inp.includes(mm))
        return false
      
      //let zz = inp.indexOf(m)
      let ava = indexs_of(inp,mm)
      //console.log(m)
      for(let a of ava){
        //console.log(a,m)
        i = inp.split("")
        i.splice(0,a)
        i = i.join("")
        let test = hrx(i,m)
        if(test)
          return true
      
      }
      return false
      //match = m
      //console.log(m,i)
    } else {
      //console.log(inp,match)
      if(inp[0]==match[0]){
        i = inp.split("")
        ma = match.split("")
        i.splice(0,1)
        ma.splice(0,1)
        inp=i.join("")
        match=ma.join("")
      } else {
        return false
      }
    }
  }
  //console.log(inp,match)
  return (inp==''&&''==match)
}