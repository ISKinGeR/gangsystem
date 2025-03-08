Config = Config or {}
Config.Debug = false
Config.BaseName = 'mythic'
Config.UiName = 'mythic'


function kprint(...)
    if Config.Debug then
        print(args)
    end
end 