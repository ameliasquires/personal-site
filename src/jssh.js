class jssh {
  constructor(fs, working_dir, uid) {
    this.fs = fs;
    this.working_dir = working_dir;
    this.uid = uid;
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
    for (let i = path.length; i != 0; i--) {
      if (path[i] == "..") {
        path.splice(i - 1, 2);
      }
    }
    return "/" + path.join("/");
  }
  main() {
    for (let d of fs) {
      if (d.name == ".bashrc") {
        for (let line of d.content.split("\n")) {
          document.getElementById("line").value = line;
          this.ex();
        }
        break;
      }
    }
    setInterval(() => {
      document.getElementById("line").focus();
    }, 10);
  }
  ex() {
    let temp_working_dir = this.working_dir;
    document.getElementById("history").innerHTML +=
      "λ " + document.getElementById("line").value + "</br>";
    let com = document.getElementById("line").value;
    let stripped = com.split(" ");
    switch (stripped[0]) {
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
        document.getElementById("history").innerHTML += add;
        break;
      case "clear":
        document.getElementById("history").innerHTML = "";
        break;
      case "echo":
        document.getElementById("history").innerHTML += com.substr(4) + "</br>";
        break;
      case "help":
        document.getElementById("history").innerHTML +=
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
            document.getElementById("history").innerHTML += a.content + "</br>";
            document.getElementById("line").value = "";
            return;
          }
        }
        document.getElementById("history").innerHTML +=
          "jssh: " +
          this.clean_path(temp_working_dir) +
          " file or dir not found</br>";
        break;
      case "pwd":
        document.getElementById("history").innerHTML +=
          this.clean_path(temp_working_dir) + "</br>";
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
          document.getElementById("history").innerHTML +=
            "jssh: `" + temp_working_dir + "` directory not found</br>";
          return;
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
          document.getElementById("history").innerHTML +=
            "jssh: `" + temp_working_dir + "` directory not found</br>";
          return;
        }
        if (stripped.includes("-a")) {
          document.getElementById("history").innerHTML +=
            "<font style='opacity:.3'>[</font>.<font style='opacity:.3'>]</font></br>";
          document.getElementById("history").innerHTML +=
            "<font style='opacity:.3'>[</font>..<font style='opacity:.3'>]</font></br>";
        }

        for (let i of wd) {
          if (
            (i.name[0] == "." && stripped.includes("-a")) ||
            i.name[0] != "."
          ) {
            if (i.dir)
              document.getElementById("history").innerHTML +=
                "<font style='opacity:.3'>[</font>" +
                i.name +
                "<font style='opacity:.3'>]</font></br>";
            else
              document.getElementById("history").innerHTML += i.name + "</br>";
          }
        }
        break;
      default:
        document.getElementById("history").innerHTML +=
          "jssh: " +
          stripped[0] +
          ": command not found or not implemented</br>";
        break;
    }

    document.getElementById("line").value = "";
  }
}
