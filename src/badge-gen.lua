local path = "./badges/"
local badges = io.popen("ls "..path)
if badges then
  for i in string.gmatch(badges:read("*a"), "(.-)\n") do
    io.write("<img alt=\""..path..i.."\" src=\""..path..i.."\">");
  end
end
