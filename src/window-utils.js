let util = {
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

      await window_create(
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
        { width: 220, height: 110, resize: false }
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
    let promise = new Promise(async (res, rej) => {
      let i = document.getElementsByClassName("window").length;
      let sel = [];
      let sel_t_n = 0
      let sel_t = fs_types[sel_t_n]
      l_b_width = 80
      await window_create(i, "fs", "");
      async function load() {
        let fil = []
        let ll = await new jssh(fs, "/", i, "null", "null", window_create);
        let tfs = ll.set_wd(ll.clean_path(inp.path));
        //console.log(sel_t)
        let files = "";
        files += "<div id='"+i+"-fs-cont-root' style='width:100%;height:100%;display:inline-flex;flex-direction:row;flex-wrap:wrap'>"
        //left bar
        //console.log(inp.path)
        let ppp = inp.path.split("/").filter(function (e) {
        return e !== "";
      })

        
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
              "'style='height:55px;position:relative;width:48px;display:inline-block;padding:10px;'><img style='height:48px;width:48px;' src='src/img/notepad.png'><div style='position:absolute;bottom:0;overflow-wrap: break-word; width:inherit;user-select:none;'>" +
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
        document.getElementById(i+"-fs-inner-cont").oncontextmenu = (ev) => {
          return false
        }
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

              tt.style.backgroundColor = "blue";
              setTimeout(() => {
                if (dou) {
                  if (ev.ctrlKey) {
                    if (sel.includes(f.name)) {
                      sel.splice(sel.indexOf(f.name), 1);
                    } else sel.push(f.name);
                  } else sel = [f.name];
                  //sel = [f.name];
                  document.getElementById(i + "-fd-bottom-sel").value =
                    sel.join(",") + (sel.length == 0 ? "Untitled" : "");
                  for (let aa of tfs) {
                    let ttt = document.getElementById(
                      i + "-id-name-" + aa.name
                    );
                    if (sel.includes(aa.name)) {
                      ttt.style.backgroundColor = "blue";
                    } else {
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
      load();
    });
    return promise;
  },
};
