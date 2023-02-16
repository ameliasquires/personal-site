local path = "./badges/"
local badges = io.popen("dir "..path)
if badges then
  for i in badges:read("*a"):gmatch("(.-)\n") do 
    for w in i:gmatch("%S+") do 
      io.write("<img alt=\""..path..w.."\" src=\""..path..w.."\">"); 
    end 
  end
end
