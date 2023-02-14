class jssh {
  constructor(fs, working_dir, uid, input, history, window_create = null) {
    this.fs = fs;
    this.working_dir = working_dir;
    this.input = input;
    this.history = history;
    this.uid = uid;
    this.window_create = window_create;
  }
  set_wd(dir) {
    //let lwd = fs
    let wd = fs;
    let path = dir
      .split("/")
      .filter(function (e) {
        return e !== "";
      })
      .filter(function (e) {
        return e !== ".";
      });
    for (let i in path) {
      if (path[i] == "..") {
        path.splice(i - 1, 2);
      }
    }

    for (let dir of path) {
      let found = false;
      //lwd = wd;
      if (dir != ".") {
        for (let i of wd) {
          if (i.name == dir && i.dir) {
            wd = i.content;
            found = true;
            break;
          }
        }
        if (!found) {
          return 1;
        }
      }
    }
    return wd;
    //return 1;
  }
  clean_path(path) {
    path = path
      .split("/")
      .filter(function (e) {
        return e !== "";
      })
      .filter(function (e) {
        return e.replace(" ", "") !== ".";
      });
    for (let i = 0; i != path.length; i++) {
      if (path[i] == "..") {
        path.splice(i - 1, 2);
        return this.clean_path("/" + path.join("/"));
      }
    }
    if (path.includes("..")) path = [];
    return "/" + path.join("/");
  }
  main() {
    for (let d of fs) {
      if (d.name == ".bashrc") {
        for (let line of d.content.split("\n").join("</br>").split("</br>")) {
          if (line.trim() != "") {
            document.getElementById(this.input).value = line.trim();
            this.ex();
          }
        }
        break;
      }
    }
    //setInterval(() => {
    //  document.getElementById(this.input).focus();
    //}, 10);
  }
  stdout(line) {
    if (this.history != "null" && this.input != "null")
      document.getElementById(this.history).innerHTML += line;
    return;
  }
  add_file(fs, path, dir) {
    //console.log(fs, path);
    if (path.length == 1)
      return fs.push({
        name: path[0],
        perms: { r: true },
        dir: dir,
        content: dir ? [] : "",
      });

    for (let f in fs) {
      if (fs[f].name == path[0] && fs[f].dir) {
        fs = fs[f].content;
        path.splice(0, 1);
        return this.add_file(fs, path, dir);
      }
    }
    document.getElementById(this.history).innerHTML +=
      "jssh: " + path.join("/") + ": directory not found</br>";
  }
  write_file(fs, path, content, append) {
    if (path.length == 1) {
      for (let f in fs) {
        if (fs[f].name == path[0] && !fs[f].dir) {
          //console.log(append ? fs[f].content + content : content);
          fs[f].content = append ? fs[f].content + "\n" + content : content;
          return fs;
        }
      }
    }
    /*
      return fs.push({
        name: path[0],
        perms: { r: true },
        dir: dir,
        content: dir ? [] : "",
      });*/

    for (let f in fs) {
      if (fs[f].name == path[0] && fs[f].dir) {
        fs = fs[f].content;
        path.splice(0, 1);
        return this.write_file(fs, path, content, append);
      }
    }
    document.getElementById(this.history).innerHTML +=
      "jssh: " + path.join("/") + ": file not found</br>";
  }
  rem_file(fs, path) {
    //console.log(fs, path);
    if (path.length == 1) {
      for (let f in fs) {
        //console.log(f);
        if (fs[f].name == path[0]) {
          fs.splice(f, 1);
          break;
        }
      }
      return fs;
    }

    for (let f in fs) {
      if (fs[f].name == path[0] && fs[f].dir) {
        fs = fs[f].content;
        path.splice(0, 1);
        return this.rem_file(fs, path);
      }
    }
    document.getElementById(this.history).innerHTML +=
      "jssh: " + path.join("/") + ": file or directory not found</br>";
  }
  ex_file(path, args = []) {
    let id = document.getElementsByClassName("window").length;
    let pa = path.split("/");
    let it = pa.splice(pa.length - 1, 1);
    for (let i of this.set_wd(pa.join("/") + "/")) {
      if (i.name == it[0] && !i.dir) {
        let cont = i.content;
        for (let line of cont.split("\n")) {
          //console.log(line);
          let stripped = line.split(" ");
          switch (stripped[0]) {
            case "window":
              if (this.window_create != null) {
                let t = line.split(" ");
                t.splice(0, 2);
                let settings = {};
                let con2 = cont.split("\n");
                for (let l of con2) {
                  if (l.trim().split(" ")[0] == "meta") {
                    let nuwu = l.trim().split(" ");
                    nuwu.splice(0, 1);
                    let trim = nuwu.join(" ").trim().split(",");
                    for (let i of trim) {
                      settings[i.trim().split(" ")[0]] = i.trim().split(" ")[1];
                    }
                  }
                }
                console.log(settings);
                //let id = document.getElementsByClassName("window").length;
                //console.log(id);
                this.window_create(
                  id,
                  stripped[1],
                  t.join(" ").replace(/#_ID/g, id),
                  settings
                );
              } else {
                this.stdout("unable to make window reference");
              }
              break;
            case "echo":
              let t = line.split(" ");
              t.splice(0, 1);
              this.stdout(t.join(" "));
              break;
            case "js":
              let tt = line.split(" ");
              tt.splice(0, 1);
              (async () => {
                let time = new Date().getTime();
                await eval(tt.join(" ").replace(/#_ID/g, id));
                this.stdout(
                  "took " + Math.abs(new Date().getTime() - time) / 1000 + "s"
                );
              })();
              break;
          }
        }
        break;
      }
    }
  }
  ex(stdin = null) {
    let temp_working_dir = this.working_dir;
    //document.getElementById(this.history).innerHTML +=
    //  "λ " + document.getElementById(this.input).value + "</br>";
    let com = document.getElementById(this.input).value;
    if (stdin != null) com = stdin;
    let stripped = com.split(" ");
    let redir = false,
      redir_app = false;

    let history_write = "";
    document.getElementById(this.history).innerHTML +=
      "λ " + document.getElementById(this.input).value + "</br>";
    if (stripped.includes(">")) redir = true;
    else if (stripped.includes(">>")) redir_app = true;
    //console.log(redir, redir_app);
    swi: switch (stripped[0]) {
      case "touch":
        this.add_file(
          this.fs,
          this.clean_path(
            stripped[1][0] == "/"
              ? stripped[1]
              : this.working_dir + "/" + stripped[1]
          )
            .split("/")
            .filter(function (e) {
              return e !== "";
            }),
          false
        );

        break;
      case "rm":
        this.rem_file(
          this.fs,
          this.clean_path(
            stripped[1][0] == "/"
              ? stripped[1]
              : this.working_dir + "/" + stripped[1]
          )
            .split("/")
            .filter(function (e) {
              return e !== "";
            })
        );
        break;
      case "mkdir":
        this.add_file(
          this.fs,
          this.clean_path(
            stripped[1][0] == "/"
              ? stripped[1]
              : this.working_dir + "/" + stripped[1]
          )
            .split("/")
            .filter(function (e) {
              return e !== "";
            }),
          true
        );
        break;
      case "jssh":
        this.main();
        break;
      case "neofetch":
        let add = "";
        add +=
          "<table style='padding:5px;'><tr style='padding:5px;'><td style='padding:5px;'><pre id='txt'>\
,-.       _,---._ __   / \\ \n \
/  )    .-'       `./ /   \\ \n \
(  (   ,'            `/    /| \n \
\\  `-\"             '\\    / | \n \
`.              ,   \\ /   | \n \
/`.          ,'-`----Y   | \n \
(            ;        |   ' \n \
|  ,-.    ,-'         |  / \n \
|  | (   |            | / \n \
)  |  \\  `.___________|/ \n \
`--'   `--' </pre>"; //position this plz:)
        add +=
          "</td><td style='padding:5px;'>hello, i am grant, they/them</br>i am mostly a typescript and c++ dev, but</br>i can work in most languages</br>--</br>i enjoy manga, and coding in free time</br>contact me at grantsquires@disroot.org</br></br>";
        let colors = ["#cdb4db", "#ffc8dd", "#ffafcc", "#bde0fe", "#a2d2ff"];
        for (let co of colors) {
          add +=
            "<pre style='margin-bottom:-2px;display:inline-block;height:25px;width:30px;background-color:" +
            co +
            ";'></pre>";
        }
        add += "</br>";
        colors = ["#a81d61", "#ff218e", "#fcd800", "#0194fc", "#007cd5"];
        for (let co of colors) {
          add +=
            "<pre style='display:inline-block;height:25px;width:30px;background-color:" +
            co +
            ";'></pre>";
        }

        add += "</td></tr></table></br></br>";
        history_write += add;
        break;
      case "clear":
        document.getElementById(this.history).innerHTML = "";
        break;
      case "echo":
        history_write += com.substr(4).split(redir ? ">" : ">>")[0] + "</br>";
        break;
      case "help":
        history_write +=
          "jssh -- version 1.0.0 (dev)</br></br>commands: neofetch, help,</br> cat [path],pwd,</br>ls [path] [-a], cd [path],</br>clear, echo [str],jssh</br>";
        break;
      case "cat":
        temp_working_dir += "/";
        for (let i of stripped) {
          if (i != stripped[0] && i[0] != "-") {
            if (i[0] == "/") temp_working_dir = i;
            else temp_working_dir += i;
            break;
          }
        }
        let tt = temp_working_dir.split("/");
        tt.splice(tt.length - 1, 1);
        let wa = this.set_wd(this.clean_path(tt.join("/")));
        for (let a of wa) {
          if (
            a.name ==
              temp_working_dir.split("/")[
                temp_working_dir.split("/").length - 1
              ] &&
            !a.dir
          ) {
            history_write += a.content + "</br>";
            document.getElementById(this.input).value = "";
            break;
          }
        }
        if (history_write == "") {
          history_write +=
            "jssh: " +
            this.clean_path(temp_working_dir) +
            " file or dir not found</br>";
        }
        break;
      case "pwd":
        history_write += this.clean_path(temp_working_dir) + "</br>";
        break;
      case "cd":
        if (temp_working_dir != "/") temp_working_dir += "/";
        for (let i of stripped) {
          if (i != stripped[0] && i[0] != "-") {
            if (i[0] == "/") temp_working_dir = i + "/";
            else temp_working_dir += i + "/";
            break;
          }
        }
        let ww = this.set_wd(temp_working_dir);
        if (ww == 1) {
          history_write +=
            "jssh: `" + temp_working_dir + "` directory not found</br>";
          break;
        }
        this.working_dir = this.clean_path(temp_working_dir);

        break;
      case "ls":
        if (temp_working_dir != "/") temp_working_dir += "/";
        for (let i of stripped) {
          if (i != stripped[0] && i[0] != "-") {
            if (i[0] == "/") temp_working_dir = i + "/";
            else temp_working_dir += i + "/";
            break;
          }
        }
        let wd = this.set_wd(this.clean_path(temp_working_dir));
        if (wd == 1) {
          history_write +=
            "jssh: `" + temp_working_dir + "` directory not found</br>";
          return;
        }
        if (stripped.includes("-a")) {
          history_write +=
            "<font style='opacity:.3'>[</font>.<font style='opacity:.3'>]</font></br>";
          history_write +=
            "<font style='opacity:.3'>[</font>..<font style='opacity:.3'>]</font></br>";
        }

        for (let i of wd) {
          if (
            (i.name[0] == "." && stripped.includes("-a")) ||
            i.name[0] != "."
          ) {
            if (i.dir)
              history_write +=
                "<font style='opacity:.3'>[</font>" +
                i.name +
                "<font style='opacity:.3'>]</font></br>";
            else history_write += i.name + "</br>";
          }
        }
        break;
      default:
        //change newline char
        let pa = this.clean_path(stripped[0]).split("/");
        if (stripped[0][0] != "/") {
          pa = this.clean_path(this.working_dir + "/" + stripped[0]).split("/");
        }
        let or = pa;
        let it = pa.splice(pa.length - 1, 1);

        for (let i of this.set_wd(pa.join("/") + "/")) {
          if (i.name == it[0] && !i.dir) {
            if (stripped[0][0] != "/")
              this.ex_file(
                this.clean_path(this.working_dir + "/" + stripped[0])
              );
            else this.ex_file(this.clean_path(stripped[0]));
            break swi;
          }
        }

        history_write +=
          "jssh: " + stripped[0] + ": file or command not found</br>";

        break;
      /*} else {
          history_write +=
            "jssh: " +
            stripped[0] +
            ": command not found or not implemented</br>";
          break;
        }*/
    }

    if (redir || redir_app) {
      let pp = (redir ? com.split(">") : com.split(">>"))
        .filter(function (e) {
          return e !== "";
        })[1]
        .trim();
      pp = this.clean_path(pp[0] == "/" ? pp : this.working_dir + "/" + pp);

      pp = pp.split("/").filter(function (e) {
        return e !== "";
      });
      this.write_file(this.fs, pp, history_write.trim(), redir_app);
    } else {
      document.getElementById(this.history).innerHTML += history_write;
    }
    document.getElementById(this.input).value = "";
  }
}
