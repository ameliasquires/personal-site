alias default := server
alias cloc := loc
server:
    node src/server.js
badge-gen:
    lua src/badge-gen.lua
loc:
    cloc .
