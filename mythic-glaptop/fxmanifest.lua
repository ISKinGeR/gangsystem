fx_version "cerulean"
game "gta5"

author 'Mercy Collective'
description 'Laptop System'
version '1.0.0'

ui_page "web/public/index.html"

files {
    "web/public/**/*",
}

shared_scripts {
    "shared/sh_*.lua",
}

client_scripts {
    "client/*",
}

server_scripts {
    "shared/sv_config.lua",
    "server/*",
}

dependency "oxmysql"

lua54 "yes"