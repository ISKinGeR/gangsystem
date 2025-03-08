fx_version 'cerulean'
game 'gta5'

author 'Mercy Collective'
description 'Graffiti System'

dependency 'sprays' -- fix Could not find dependency cfx-mercy-sprays for resource mythic-graffiti.
server_script "@oxmysql/lib/MySQL.lua"

shared_scripts {
    'shared/sh_*.lua',
}

client_scripts {
    'client/*',
}

server_scripts {
    'server/*',
}

lua54 'yes'
