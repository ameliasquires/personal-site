#include <stdio.h>
import os
directory = './badges'
for filename in os.listdir(directory):
    f = os.path.join(directory, filename)
    if os.path.isfile(f):
        print("<img alt=\""+f+"\"  title=\""+f+"\" src=\""+f+"\">",end =" ")
