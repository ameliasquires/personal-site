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
      function load() {
        let fil = []
        let ll = new jssh(fs, "/", i, "null", "null", window_create);
        let tfs = ll.set_wd(ll.clean_path(inp.path));
        //console.log(sel_t)
        let files = "";
        files += "<div id='"+i+"-fs-inner-cont' style='width:100%;height:100%;display:flex;flex-direction:row;flex-wrap:wrap'>"
        //left bar
        files+= "<div id='"+i+"-fs-left-bar' style='background-color:red;height:100%;width:"+l_b_width+"'></div>"
        files += "<div id='"+i+"-resize-e' class='resize-e' style='position:relative;right:0;'></div>"
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
          "<div id='" +
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
          "-content-button-sub' style='width:70px;margin-left:22px;padding-left:15px;padding-right:15px;top:0;text-align: center;display:inline-block;'>cancel</button></div>" +
          "</div>";
        document.getElementById(i + "-content-content").innerHTML = files;
        //console.log(tfs)
        for (let f of fil) {
          let tt = document.getElementById(i + "-id-name-" + f.name);
          //console.log(tt,f)
          let dou = false;
          tt.onclick = (ev) => {
            if (dou) {
              //console.log(f, inp);
              if (f.dir) {
                inp.path += f.name;
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
                    return inp.path + "/" + f.name;
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
