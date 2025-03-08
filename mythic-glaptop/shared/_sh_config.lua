Config = {}

Config.LaptopSettings = {
    ['ScriptNames'] = 'mythic-', -- Prefix your scripts names start with
    ['LaptopItem'] = 'glaptop', -- Item name to open the laptop
    ['ShowStartupScreen'] = true, -- Show laptop startup screen when opening for first time.
    ['AnimationType'] = 'Tablet', -- 'Laptop' = animation with laptop (longer); 'Tablet' = animation with holding tablet in hand (shorter)
}

Config.LaptopApps = {
    [1] = {
        ['Name'] = 'Boosting', -- Name of app
        ['Icon'] = 'fas fa-car', -- Icon of app (https://fontawesome.com/icons?d=gallery&m=free)
        -- ['Image'] = 'folder.png', -- Image of app (in /nui/images/)
        ['Color'] = 'blue', -- Color of app (grey, cyan, blue, dark-blue)
        ['Item'] = 'boosting-usb', -- Item to see app
        ['Enabled'] = false, -- App available?
    },
    [2] = { -- WIP
        ['Name'] = 'Market',
        ['Icon'] = 'fas fa-store',
        ['Color'] = 'cyan', -- grey, cyan, blue, dark-blue
        ['Item'] = 'boosting-usb', -- Item to see app
        ['Enabled'] = false, -- App available?
    },
    [3] = { -- WIP
        ['Name'] = 'Mining',
        ['Icon'] = 'fas fa-coins',
        ['Color'] = 'dark-blue', -- grey, cyan, blue, dark-blue
        ['Item'] = 'boosting-usb', -- Item to see app
        ['Enabled'] = false, -- App available?
    },
    [4] = {
        ['Name'] = 'Racing',
        ['Icon'] = 'fas fa-flag-checkered',
        ['Color'] = 'dark-blue', -- grey, cyan, blue, dark-blue
        ['Item'] = 'racing-usb', -- Item to see app
        ['Enabled'] = true, -- App available?
    },
}