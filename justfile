alias cloc := loc
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]
default:
    @echo "fun fact your pc is {{arch()}} and is probably on {{os()}}"
    @just --list --list-heading $'and you can use these scripts (maybe)\n'
server:
    node src/server.js
badge-gen:
    lua src/badge-gen.lua
loc:
    cloc .

