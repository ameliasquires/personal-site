let util = {
  context_menu(target,opt){
    /*
      opt = {"menu":[
        {"name":string,
        "callback": function}
        , ...
      ],!"settings":{
          x:int,
          y:int,
          height:int,
          width:int
        }}

      ! is optional 
    */
    (()=>{
    target.oncontextmenu = ((ev)=>{
      console.log(ev)
      try{document.getElementById(target.id+"-menu").remove()}catch(e){}
      let aa = ""
      
      for(let op of opt.menu){
        aa+=`<div id='${target.id}-menu-${opt.menu.indexOf(op)}'>${op.name}</div>`
      }
      target.innerHTML += "<div id='"+target.id+"-menu' style='position:fixed;top:"+ev.clientY+";left:"+ev.clientX+"px;background-color:red'>"+aa+"</div>"
      for(let op of opt.menu){
        document.getElementById(`${target.id}-menu-${opt.menu.indexOf(op)}`).onclick = (()=>{
          op.callback()
        })
      }
      return false
    })
      })()
  },
  scrollbar(uid,minor_uid,root,target){
    (()=>{
      
    //root is the base of the window, only used for measuring
    //--
    //target is where the scrollbar will be placed, this element should be
    //larger than the root with scrollable overflow
    let scrolling = false
      console.log(uid,minor_uid)
      //try{document.getElementById(uid + "-" + minor_uid + "-content-scrollbar").remove()}catch(e){console.log(e)}
    if(undefined==procs[uid])
      procs[uid] = {}
      console.log("'" + uid + "-" + minor_uid + "-content-scrollbar'")
    target.innerHTML += "<div id='" + uid + "-" + minor_uid + "-content-scrollbar' class='scrollbar'><div id='" + uid + "-" + minor_uid + "-content-scrollbar-point' class='scrollbar-point'></div></div>"
    let thi_point = document.getElementById(uid + "-" + minor_uid + "-content-scrollbar-point")
    let thi_base = document.getElementById(uid + "-" + minor_uid + "-content-scrollbar")
    procs[uid].refresh = ()=>{
      
      //console.log(root.clientHeight / (target.clientHeight / root.clientHeight) / root.clientHeight)
      thi_point.style.display = "block"
      thi_base.style.display = "block"
      thi_point.style.height = root.clientHeight / (target.clientHeight / root.clientHeight)
      if(root.clientHeight / (target.clientHeight / root.clientHeight) / root.clientHeight >= 1){
        thi_point.style.display = "none"
        thi_base.style.display = "none"
      }

      if(thi_base.clientHeight<thi_point.offsetTop+thi_point.clientHeight){
        thi_point.style.top =  thi_base.clientHeight-thi_point.clientHeight
      }
    }
    //console.log(root)
    root.onscroll = () => {
      
        if (false==scrolling) {
          //console.log("uwu")
          let aaaa = (root.clientHeight - thi_point.clientHeight)
          let scro = (root.scrollTop / (root.scrollHeight - root.clientHeight))
          //console.log(aaaa, scro)
          thi_point.style.top = scro * aaaa
      }
    }
    thi_point.onmousedown = ((ev)=>{
      document.body.style.cursor = 'grabbing'
      thi_point.style.cursor = 'grabbing'
      py = ev.clientY
      document.body.style.userSelect = "none"
      
      document.onmouseup = (()=>{
        document.body.style.cursor = ''
        thi_point.style.cursor = 'grab'
        document.onmousemove = null
        document.onmouseup = null
        scrolling = false
      })
      document.onmousemove = ((evm)=>{
        scrolling = true
        let z = (thi_point.offsetTop - (py - evm.clientY))
        //console.log(z,thi_base.clientHeight - thi_point.clientHeight)
        if(z >= 0 && z < thi_base.clientHeight - thi_point.clientHeight){
          thi_point.style.top = z
          root.scrollTop = ((z / (thi_base.clientHeight - thi_point.clientHeight)) * (root.scrollHeight - thi_base.clientHeight + 24))
        } else {
          if(z < thi_base.clientHeight - thi_point.clientHeight){
            thi_point.style.top = 0
            //root.scrollTop = 
          } else {
            thi_point.style.top = thi_base.clientHeight - thi_point.clientHeight
          }
        }
        py = (evm.clientY)
      })
    })
    procs[uid].refresh()
      })()
  },
  async alert(inp) {
    let promise = new Promise(async (res, rej) => {
      bu = [];
      if (inp.buttons == undefined) {
        bu = ["ok", "no"];
      } else {
        bu = inp.buttons;
      }
      let buttons = "";
      let i = document.getElementsByClassName("window").length;
      for (let b of bu) {
        buttons +=
          "<button id='" +
          i +
          "-content-button-" +
          b +
          "' style='padding-left:15px;padding-right:15px;margin-right:10px;text-align: center;'>" +
          b +
          "</button>";
      }
      let r_x = inp.x | 25
      let r_y = inp.y | 25
       window_create(
        i,
        inp.title == undefined ? "Alert" : inp.title,
        `<table><tr><td style='padding: 5px;'><img src='./src/img/${
          inp.type == undefined ? "info" : inp.type
        }.png'></td></tr>
      <tr >
      <td style='padding: 5px;'>${
        inp.content == undefined ? "Alert" : inp.content
      }</td>
        <td style='padding: 5px;' >${buttons}</td>
        </tr></table>`,
        { width: 220, height: 110, resize: false,left:r_x,top:r_y }
      );
      for (let b of bu) {
        document.getElementById(i + "-content-button-" + b).onclick = () => {
          res(b);
        };
      }
    });
    return promise;
  },
  async fd(inp) {
    let i = document.getElementsByClassName("window").length;
    let promise = new Promise(async (res, rej) => {
      
      if(undefined==procs[i])
        procs[i] = {}
      let sel = [];
      let sel_t_n = 0
      let sel_t = fs_types[sel_t_n]
      l_b_width = 80
       window_create(i, "fs", "",{scroll:false});
      let ll = await new jssh(fs, "/", i, "null", "null", window_create);
      async function load() {
        let fil = []
        
        let tfs = ll.set_wd(ll.clean_path(inp.path));
        //console.log(sel_t)
        let files = "";
        files += "<div id='"+i+"-fs-cont-root' style='width:100%;height:100%;display:inline-flex;flex-direction:row;flex-wrap:wrap'>"
        //left bar
        //console.log(inp.path)
        let ppp = inp.path.split("/").filter(rem_emp)

        
        function rec_bar_fun(cdir,target_full,target_ind,padding,patt){
          let ret = ""
          for(let f of cdir){
            if(f.dir){
              //console.log(f.name,target_full,target_ind)
              let t_ret = ''
              let ttu = false
              if(f.name==target_full[target_ind]){
                ttu = true
                t_ret += rec_bar_fun(f.content,target_full,target_ind+1,padding+5,patt+"/"+f.name)
              }
              ret += "<div id='"+patt + "/"+ f.name + "/' style='white-space:nowrap;width:100%;user-select:none;"+(ttu&&target_ind==target_full.length - 1?"background-color:rgba(0,0,0,.25);":"")+";height:20px;margin-left:"+padding+"'>"+(ttu?"v ":"> ")+f.name+"</div>" + t_ret
                //console.log(false,f.name)
                
            }
          }
          return ret
        }

        let bar_opt =  "<div id='/' style='white-space:nowrap;width:100%;user-select:none;;height:20px;margin-left:"+0+"'>v /</div>"
                + (rec_bar_fun(fs,ppp,0,5,''))
      
        /*
        for(let dd of ppp){
          paa+=5
          cur_pat.push(dd)
          console.log(cur_pat,dd)
          tt_ppp = "/" + cur_pat.join("/")
          console.log(dd)
          let ttwd = (ll.set_wd(tt_ppp))
          for(let ff of ttwd){
            if(ff.dir){
              bar_opt+="<div style='width:80px;height:20px;background-color:blue;margin-left:"+paa+"'>"+ff.name+"</div>"
            }
          }
        }*/
        console.log(inp.path)
        files+= "<div id='"+i+"-fs-left-bar' onscroll='return false;' style='overflow:hidden;height:100%;width:"+l_b_width+"'>"+bar_opt+"</div>"
        files += "<div id='"+i+"-left-pane-resize-e' class='resize-e' style='position:relative;right:1;background-color:#aaaaaa;height:100%;'></div>"
        files += "<div id='"+i+"-fs-inner-cont' style='flex:1;align-content: flex-start;display:flex;flex-direction:row;flex-wrap:wrap'>"
        for (let f of tfs) {
          if (f.dir) {
            files +=
              "<div id='" +
              i +
              "-id-name-" +
              f.name +
              "' style='height:55px;position:relative;width:48px;display:inline-block;padding:10px;'><img style='height:48px;width:48px;' src='src/img/folder.png'><div style='position:absolute;bottom:0;overflow-wrap: break-word; width:inherit;user-select:none;'>" +
              f.name +
              "</div></div>";
            fil.push(f)
          } else {
            if(RegExp(sel_t.regex,"g").test(f.name)){
            files +=
              "<div id='" +
              i +
              "-id-name-" +
              f.name +
              "'style='height:55px;position:relative;width:48px;display:inline-block;padding:10px;'><img style='height:42px;width:42px;' src='src/img/doc.png'><div style='position:absolute;bottom:0;overflow-wrap: break-word; width:inherit;user-select:none;'>" +
              f.name +
              "</div></div>";
              fil.push(f)
          }
          }
        }
        files+="</div>"
        let opts = "";
        for (let uwu of fs_types) {
          let aad = ""
          if(uwu==sel_t)
            aad = "selected"
          opts +=
            "<option "+aad+">(" + uwu.identifier + ") " + uwu.descriptor + "</option>";
        }
        files +=
          "</div><div id='" +
          i +
          "-fd-bottom' class='fd-bottom' ><div id='" +
          i +
          "-fd-bar-top'><div style='width:70px;display:inline-block;'> File <u>n</u>ame: </div><div style='background-color:white;display:inline-block;width:40%' ><input style='display:inline-block;text-shadow:none;width:100%;' id='" +
          i +
          "-fd-bottom-sel' value='" +
          sel.join(",") +
          (sel.length == 0 ? "Untitled" : "") +
          "'></div><button id='" +
          i +
          "-content-button-sub' style='width:70px;margin-left:22px;padding-left:15px;padding-right:15px;top:0;text-align: center;display:inline-block;'>save</button></div>" +
          "<div id='" +
          i +
          "-fd-bar-bottom'>" +
          "<div  style='width:70px;display:inline-block;'>File <u>t</u>ype: </div><div style='background-color:white;display:inline-block;width:40%' ><select style='display:inline-block;text-shadow:none;width:100%;' id='" +
          i +
          "-fd-bottom2-sel' >"+
          opts +
          "'</select>" +
          "<button id='" +
          i +
          "-content-button2-sub' style='width:70px;margin-left:22px;padding-left:15px;padding-right:15px;top:0;text-align: center;display:inline-block;'>cancel</button></div>" +
          "";
        document.getElementById(i + "-content-content").innerHTML = files;
        //console.log(tfs)
        //util.scrollbar(document.getElementById(i+"-fs-inner-cont"))
        procs[i].load_listeners = () => {
          
        
        let ele = document.getElementById(i+"-fs-inner-cont")
        let ele_root = document.getElementById(i+"-content-content")
        console.log(inp.path.split("/").filter(rem_emp))
        util.scrollbar(i,'root-bar',ele_root.parentElement,ele)
        util.context_menu(ele,{menu:[
          {name:'new file',callback:()=>{ll.add_file(ll.fs,[...inp.path.split("/").filter(rem_emp),'untitled'],false);load()}},
          {name:'new directory',callback:()=>{ll.add_file(ll.fs,[...inp.path.split("/").filter(rem_emp),'untitled'],true);load()}},
        ]})
        //document.getElementById(i+"-fs-inner-cont").oncontextmenu = (ev) => {
        //  return false
        //}
        document.getElementById(i +"-content-button-sub").onclick = () => {
          res(inp.path+document.getElementById(i +"-fd-bottom-sel").value)
          document.getElementById(i+"-root").remove()
            
          }
        document.getElementById(i +"-content-button2-sub").onclick = () => {
          rej("canceled by user")
          document.getElementById(i+"-root").remove()
            
          }
        document.getElementById(i+"-left-pane-resize-e").onmousedown = (ev) => {
          let elep = document.getElementById(i+"-fs-left-bar")
          let px = ev.clientX
          document.body.style.cursor = "ew-resize"
          document.body.style.userSelect = "none"
          document.onmouseup = (() => {
              document.body.style.userSelect = ""
              document.onmousemove = null
              document.onmouseup = null
              document.body.style.cursor = ''

          })
          
          document.onmousemove = (ev) => {
            elep.style.width = (parseInt(elep.clientWidth) + (ev.clientX - px)) + "px"
            px = (ev.clientX)
          }
        }
        let aaaa = document.getElementById(i+"-fs-left-bar").children
          //console.log(aaaa)
          for(let zz = 0; zz!=aaaa.length; zz++){
            //console.log(zz)
            aaaa.item(zz).onclick = (()=>{
              inp.path = aaaa.item(zz).id
              load()
            })
          }
        for (let f of fil) {
          let tt = document.getElementById(i + "-id-name-" + f.name);
          //console.log(tt,f)
          let dou = false;
          tt.onclick = (ev) => {
            if (dou) {
              //console.log(f, inp);
              if (f.dir) {
                inp.path += f.name + "/";
              } else {
                if (f.name.includes(".exe"))
                  ll.ex_file(inp.path + "/" + f.name);
                else {
                  if (inp.open_file == true || inp.open_file == undefined) {
                    let iii = ll.ex_file("/apps/notepad.exe");
                    document.getElementById(
                      iii + "-content-content"
                    ).firstChild.value = ll.get_file(
                      inp.path + "/" + f.name
                    ).content;
                  } else {
                    //console.log(inp.path,'/',f.name)
                    inp.path = inp.path + f.name  + "/";
                    return
                  }
                  //console.log();
                }
              }
              load();
              dou = false;
            } else {
              dou = true;
              tt.style.boxShadow = "0 0 0 1px rgba(0,0,244,0.4) inset"
              tt.style.backgroundColor = "rgba(0,0,244,0.2)";
              setTimeout(() => {
                if (dou) {
                  if (ev.ctrlKey) {
                    if (sel.includes(f.name)) {
                      sel.splice(sel.indexOf(f.name), 1);
                    } else sel.push(f.name);
                  } else if (ev.shiftKey) {
                    let tem = false
                    let osel = sel
                    sel = []
                    for (let ff of fil) {
                      //console.log(ff.name,sel[0])
                      if(ff==f||ff.name==osel[0]){
                        //console.log("uwu")
                        if(tem){
                          sel.push(ff.name)
                          break
                        }
                        else
                          tem = true
                      }
                      if(tem){
                        sel.push(ff.name)
                      }
                    }
                  } else sel = [f.name];
                  //sel = [f.name];
                  document.getElementById(i + "-fd-bottom-sel").value =
                    sel.join(",") + (sel.length == 0 ? "Untitled" : "");
                  for (let aa of tfs) {
                    let ttt = document.getElementById(
                      i + "-id-name-" + aa.name
                    );
                    if (sel.includes(aa.name)) {
                      ttt.style.backgroundColor = "rgba(0,0,244,0.2)";
                      ttt.style.boxShadow = "0 0 0 1px rgba(0,0,244,0.4) inset"

                    } else {
                      ttt.style.boxShadow = ""
                      ttt.style.backgroundColor = "";
                    }
                  }
                  //load();
                  dou = false;
                }
              }, 200);
            }
          };
        }
        document.getElementById(i +"-fd-bottom2-sel").onchange = (ev) => {
          sel_t = fs_types[ev.target.selectedIndex]
          load()
        };
      }
        procs[i].load_listeners()
      }
      
      load();
      
    });
    return promise;
  },
};
