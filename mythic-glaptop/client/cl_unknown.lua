RegisterNUICallback("Unknown/FetchGang", function(Data, cb)
    Callbacks:ServerCallback(Config.BaseName.."-glaptop/server/unknown/get-player-gang", {}, cb)
end)

RegisterNUICallback("Unknown/AddMember", function(Data, cb)
    Callbacks:ServerCallback(Config.BaseName.."-glaptop/server/unknown/add-member", Data, cb)
end)

RegisterNUICallback("Unknown/KickMember", function(Data, cb)
    Callbacks:ServerCallback(Config.BaseName.."-glaptop/server/unknown/kick-member", Data, cb)
end)

RegisterNUICallback("Unknown/ToggleDiscoveredGraffitis", function(Data, cb)
    TriggerEvent(Config.BaseName.."-graffiti/client/toggle-discovered")
    cb("Ok")
end)

RegisterNUICallback("Unknown/ToggleContestedGraffitis", function(Data, cb)
    TriggerEvent(Config.BaseName.."-graffiti/client/toggle-contested")
    cb("Ok")
end)

RegisterNUICallback("Unknown/GetMessages", function(Data, cb)
    Callbacks:ServerCallback(Config.BaseName.."-glaptop/server/unknown/get-messages", {}, cb)
end)

RegisterNUICallback("Unknown/SendMessage", function(Data, cb)
    Callbacks:ServerCallback(Config.BaseName.."-glaptop/server/unknown/send-message", Data, cb)
end)

RegisterNetEvent(Config.BaseName.."-glaptop/client/unknown/refresh-gang-chat", function()
    if LaptopVisible then
        Callbacks:ServerCallback(Config.BaseName.."-glaptop/server/unknown/get-messages", {}, function(Result)
            SendUIMessage("Unknown/SetMessages", Result)
        end)
    end
end)
