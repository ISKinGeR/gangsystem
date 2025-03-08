local GangInvitations = {}

-- Application: Unknown (Gangs)

CreateThread(function()
    while not _Ready do
        Wait(100)
    end
    LoadGangs() -- Init

    Chat:RegisterAdminCommand("refreshGangs", function(Source, args, rawCommand)
        local Player = Fetch:Source(Source)
        if not Player then return end
        LoadGangs()
    end, {
        help = "Refetch all gangs from DB.",
    }, 0)
    
    Callbacks:RegisterServerCallback(Config.BaseName.."-glaptop/server/unknown/get-gang-by-id", function(Source, GangId, cb)
        cb(GetGangById(GangId))
    end)

    Callbacks:RegisterServerCallback(Config.BaseName.."-glaptop/server/unknown/get-discovered-sprays", function(Source, GangId, cb)
        local Gang = ServerConfig.Gangs[GangId]

        local Result = exports['oxmysql']:executeSync("SELECT `discovered_sprays` FROM `laptop_gangs` WHERE `gang_id` = @GangId", {
            ['@GangId'] = GangId
        })

        if Result[1] == nil then return cb(false) end
        cb(json.decode(Result[1].discovered_sprays))
    end)

    Callbacks:RegisterServerCallback(Config.BaseName.."-glaptop/server/unknown/get-player-gang", function(Source, data, cb)
        local Player = Fetch:Source(Source)
        if not Player then 
            kprint("Player not found!")
            return 
        end
    
        local playerSID = Player:GetData("Character"):GetData("SID")
        kprint("Player SID:", playerSID)
    
        local Gang = GetGangByPlayer(playerSID)
        if Gang then
            kprint("Gang found:", json.encode(Gang))
    
            if ServerConfig.Gangs[Gang.Id] then
                local sprays = exports[Config.BaseName..'-graffiti']:GetSpraysByGang(Gang.Id)
                kprint("Number of sprays for the gang:", #sprays)
    
                ServerConfig.Gangs[Gang.Id].TotalSprays = #sprays
            else
                kprint("Gang ID not found in ServerConfig.Gangs")
            end
        else
            kprint("No gang found for player:", playerSID)
        end
    
        cb(Gang)
    end)
    
    

    Callbacks:RegisterServerCallback(Config.BaseName.."-glaptop/server/unknown/add-member", function(Source, Data, cb)
        local Player = Fetch:Source(Source)
        if not Player then return end
        local Data = { Cid = tonumber(Data.Cid) }
        local Target = Fetch:SID(Data.Cid)
        if not Target then return Execute:Client(Source, "Notification", "Error", "Player not found..")end

        local Gang = GetGangByPlayer(Player:GetData("Character"):GetData("SID"))
        if not Gang then return end

        local TargetGang = GetGangByPlayer(Data.Cid)
        if TargetGang then return end
        
        if GangInvitations[Gang.Id] == nil then GangInvitations[Gang.Id] = {} end
        GangInvitations[Gang.Id][Data.Cid] = true

        -- TriggerClientEvent(Config.BaseName..'-phone/client/notification', Target:GetData('Source'), {
        --     Id = "gang-invite-" .. Target:GetData("Character"):GetData("SID"),
        --     Title = "Gang Invitation",
        --     Message =  Gang.Label .. " is inviting you to their gang.",
        --     Icon = "fas fa-user-ninja",
        --     IconBgColor = "#4f5efc",
        --     IconColor = "white",
        --     Sticky = true,
        --     Duration = 5000,
        --     Buttons = {
        --         {
        --             Icon = "fas fa-check-circle",
        --             Tooltip = "Accept",
        --             Event = Config.BaseName.."-glaptop/server/unknown/accept-invite",
        --             EventType = "server",
        --             EventData = { Id = "gang-invite-" .. Target:GetData("Character"):GetData("SID"), Gang = Gang.Id },
        --             Color = "#2ecc71",
        --         },
        --         {
        --             Icon = "fas fa-times-circle",
        --             Tooltip = "Decline",
        --             EventType = "Client",
        --             Event = "mythic-phone/client/hide-notification",
        --             EventData = Data.Id,
        --             Color = "#f2a365",
        --         },
        --     },
        -- })

        Phone.Notification:AddWithId(
            Target:GetData('Source'),
            "GangSystem",
            "Gang System",
            string.format(
                "%s is inviting you to their gang.",
                Gang.Label
            ),
            os.time() * 1000,
            -1,
            "comanager",
            {
                accept = Config.BaseName.."-glaptop/client/unknown/accept-invite",
                cancel = Config.BaseName.."-glaptop/client/unknown/cansel-invite",
            },
            { Gang = Gang.Id }
        )


        cb(Gang)
    end)

    Callbacks:RegisterServerCallback(Config.BaseName.."-glaptop/server/unknown/kick-member", function(Source, Data, cb)
        local Player = Fetch:Source(Source)
        if not Player then return end

        local Gang = GetGangByPlayer(Player:GetData("Character"):GetData("SID"))
        if not Gang then return end

        local TargetGang, TargetId = GetGangByPlayer(Data.Cid)
        if not TargetGang then return end

        if Gang.Id ~= TargetGang.Id then return end
        table.remove(ServerConfig.Gangs[Gang.Id].Members, TargetId)
        SaveGang(Gang.Id)

        cb(true)
    end)

    Callbacks:RegisterServerCallback(Config.BaseName.."-glaptop/server/unknown/get-messages", function(Source, data,cb)
        local Player = Fetch:Source(Source)
        if not Player then cb({}) return end

        local Gang = GetGangByPlayer(Player:GetData("Character"):GetData("SID"))
        if not Gang then return end

        local Chats = {}
        local Result = exports['oxmysql']:executeSync('SELECT * FROM `laptop_gangs_chat` WHERE `gang_id` = @GangId ORDER BY `timestamp` DESC', { ['@GangId'] = Gang.Id })

        for k, v in pairs(Result) do
            Chats[#Chats + 1] = {
                Sender = v.sender,
                SenderName = GetPlayerCharName(v.sender) or "Unknown",
                Message = v.message,
                Attachments = json.decode(v.attachments),
                Timestamp = v.timestamp
            }
        end

        cb(Chats)
    end)

    Callbacks:RegisterServerCallback(Config.BaseName.."-glaptop/server/unknown/send-message", function(Source, Data, cb)
        local Player = Fetch:Source(Source)
        if not Player then cb({Success = false, Msg = "Invalid Player"}) return end

        local Gang = GetGangByPlayer(Player:GetData("Character"):GetData("SID"))
        if not Gang then return end

        exports['oxmysql']:executeSync("INSERT INTO `laptop_gangs_chat` (`gang_id`, `sender`, `message`, `attachments`) VALUES (@GangId, @Sender, @Message, @Attachments)", {
            ['@GangId'] = Gang.Id,
            ['@Sender'] = Player:GetData("Character"):GetData("SID"),
            ['@Message'] = Data.Message,
            ['@Attachments'] = json.encode(Data.Attachments),
        })

        TriggerGangEvent(Gang.Id, Config.BaseName.."-glaptop/client/unknown/refresh-gang-chat")
        TriggerGangEvent(Gang.Id, Config.BaseName..'-phone/client/notification', {
            Id = Gang.Id .. '-new-message-' .. math.random(1, 999999),
            Title = Gang.Label,
            Message = ("%s - %s"):format(Player:GetData("Character"):GetData("First") .. " " .. Player:GetData("Character"):GetData("Last"), Data.Message),
            Icon = "fas fa-user-ninja",
            IconBgColor = "#4f5efc",
            IconColor = "white",
            Sticky = false,
            Duration = 2000,
            Buttons = {},
        })

        cb({Success = true})
    end)

    Callbacks:RegisterServerCallback(Config.BaseName.."-glaptop/server/unknown/get-crafting-name", function(Source, data,cb)
        local Player = Fetch:Source(Source)
        if not Player then return cb(false) end

        local Gang = GetGangByPlayer(Player:GetData("Character"):GetData("SID"))
        if not Gang then return cb(false) end

        if Gang.TotalSprays >= 54 then
            return cb('Powerful')
        elseif Gang.TotalSprays >= 36 then
            return cb('Feared')
        elseif Gang.TotalSprays >= 24 then
            return cb('Respected')
        elseif Gang.TotalSprays >= 16 then
            return cb('Established')
        elseif Gang.TotalSprays >= 8 then
            return cb('WellKnown')
        elseif Gang.TotalSprays >= 4 then
            return cb('Known')
        end

        cb(false)
    end)
end)

-- Functions

function LoadGangs()
    local Result = exports['oxmysql']:executeSync("SELECT * FROM `laptop_gangs`")

    if not Result or #Result == 0 then
        return
    end

    kprint("Fetched " .. #Result .. " gangs from database.")

    for k, v in pairs(Result) do

        if not v.gang_id or not v.gang_label or not v.gang_leader or not v.gang_members or not v.gang_metadata then
        else
            ServerConfig.Gangs[v.gang_id] = {
                Id = v.gang_id,
                Label = v.gang_label,
                Leader = {
                    Cid = v.gang_leader, 
                    Name = GetPlayerCharName(v.gang_leader) or "Unknown"
                },
                Members = json.decode(v.gang_members) or {},
                MaxMembers = ServerConfig.GangSizes[v.gang_id] or 7,
                Sales = 0,
                TotalCollected = 0,
                TotalSprays = #(exports[Config.BaseName..'-graffiti']:GetSpraysByGang(v.gang_id) or {}),
                MetaData = json.decode(v.gang_metadata) or {}
            }
        end
    end
end

GetPlayerCharName = function(SID)
    local ReturnValue = promise:new()
    local sidNumber = tonumber(SID)
    if not sidNumber then
        ReturnValue:resolve(nil)
        return Citizen.Await(ReturnValue)
    end

    Database.Game:find({
        collection = "characters",
        query = {
            SID = sidNumber
        }
    }, function(success, result)
        if success then
            if result and result[1] then
                local FirstName = result[1].First or ""
                local LastName = result[1].Last or ""
                local FullName = FirstName .. " " .. LastName
                ReturnValue:resolve(FullName)
            else
                ReturnValue:resolve(nil)
            end
        else
            ReturnValue:resolve(nil)
        end
    end)

    local Result = Citizen.Await(ReturnValue)
    return Result
end

function GetGangById(GangId)
    return ServerConfig.Gangs[GangId] or false
end
exports("GetGangById", GetGangById)

function GetGangByPlayer(CitizenId)
    CitizenId = tostring(CitizenId)

    kprint("Searching for CitizenId:", CitizenId)  -- kprint the CitizenId we are looking for.

    for k, v in pairs(ServerConfig.Gangs) do
        kprint("Checking Gang:", json.encode(v))  -- kprint the current gang being checked.
        kprint("Check Leader:", v.Leader.Cid)  -- kprint if the leader matches.

        if tostring(v.Leader.Cid) == CitizenId then
            kprint("Found Leader:", v.Leader.Cid)  -- kprint if the leader matches.
            return v
        end

        for i, j in pairs(v.Members) do
            kprint("Checking Member:", j.Cid)  -- kprint each member's CID in the gang.
            if tostring(j.Cid) == CitizenId then
                kprint("Found Member:", j.Cid)  -- kprint if a member matches.
                return v, i
            end
        end
    end
    return false, 0
end

exports("GetGangByPlayer", GetGangByPlayer)

function SaveGang(GangId)
    if ServerConfig.Gangs[GangId] == nil then return end

    exports['oxmysql']:executeSync("UPDATE `laptop_gangs` SET `gang_leader` = @Leader, `gang_members` = @Members WHERE `gang_id` = @GangId", {
        ['@GangId'] = GangId,
        ['@Members'] = json.encode(ServerConfig.Gangs[GangId].Members),
        ['@Leader'] = ServerConfig.Gangs[GangId].Leader.Cid,
    })
end

function SetGangMetadata(GangId, MetaDataId, Value)
    if ServerConfig.Gangs[GangId] == nil then return false end

    ServerConfig.Gangs[GangId].MetaData[MetaDataId] = Value
    exports['oxmysql']:executeSync("UPDATE `laptop_gangs` SET `gang_metadata` = @MetaData WHERE `gang_id` = @GangId", {
        ['@GangId'] = GangId,
        ['@MetaData'] = json.encode(ServerConfig.Gangs[GangId].MetaData),
    })
    return true
end
exports("SetGangMetadata", SetGangMetadata)

function SetGangLeader(GangId, Cid)
    if ServerConfig.Gangs[GangId] == nil then return false end
    ServerConfig.Gangs[GangId].Leader = { Cid = Cid, Name = GetPlayerCharName(Cid) }
    exports['oxmysql']:executeSync("UPDATE `laptop_gangs` SET `gang_leader` = ? WHERE `gang_id` = ?", {
        Cid,
        GangId,
    })
    SaveGang(GangId)
    return true
end
exports("SetGangLeader", SetGangLeader)

function GetGangMetadata(GangId, MetaDataId)
    if ServerConfig.Gangs[GangId] == nil then return false end
    return ServerConfig.Gangs[GangId].MetaData[MetaDataId]
end
exports("GetGangMetadata", GetGangMetadata)

function TriggerGangEvent(GangId, Event, ...)
    local Gang = exports[Config.BaseName..'-glaptop']:GetGangById(GangId)
    if not Gang then return end

    local Leader = Fetch:SID(Gang.Leader.Cid)
    if Leader then
        TriggerClientEvent(Event, Leader:GetData('Source'), ...)
    end
    
    for k, v in pairs(Gang.Members) do
        local Target = Fetch:SID(v.Cid)
        if Target then
            TriggerClientEvent(Event, Target:GetData('Source'), ...)
        end
    end
end
exports("TriggerGangEvent", TriggerGangEvent)

-- Events

RegisterNetEvent(Config.BaseName.."-glaptop/server/unknown/accept-invite", function(Data)
    local Source = source
    kprint("HERE                                         :",json.encode(Data))
    kprint("HERE                                         :",json.encode(Data))
    kprint("HERE                                         :",json.encode(Data))
    local Player = Fetch:Source(Source)
    if not Player then
        Phone.Notification:Add(Source,"Employment", "Invalid Invitation!", os.time() * 1000, 6000, "comanager", {
            view = "",
        }, nil)
        return
    end

    local Gang = ServerConfig.Gangs[Data.Gang]
    if not Gang then
        Phone.Notification:Add(Source,"Employment", "Invalid Invitation!", os.time() * 1000, 6000, "comanager", {
            view = "",
        }, nil)
        return
    end

    if not GangInvitations[Data.Gang] or not GangInvitations[Data.Gang][Player:GetData("Character"):GetData("SID")] then
        Phone.Notification:Add(Source,"Employment", "Invalid Invitation!", os.time() * 1000, 6000, "comanager", {
            view = "",
        }, nil)
        return
    end

    if #Gang.Members + 2 > Gang.MaxMembers then
        Phone.Notification:Add(Source,"Employment", "Invalid Invitation!", os.time() * 1000, 6000, "comanager", {
            view = "",
        }, nil)
        return
    end

    Phone.Notification:Add(Source,"Employment", "Accepting Invitation...", os.time() * 1000, 6000, "comanager", {
        view = "",
    }, nil)

    table.insert(ServerConfig.Gangs[Data.Gang].Members, {
        Cid = Player:GetData("Character"):GetData("SID"),
        Name = Player:GetData("Character"):GetData("First") .. " " .. Player:GetData("Character"):GetData("Last")
    })

    SaveGang(Data.Gang)
end)

RegisterNetEvent(Config.BaseName.."-glaptop/server/add-discovered", function(GangId, SprayId)
    local Gang = ServerConfig.Gangs[GangId]

    local Result = exports['oxmysql']:executeSync("SELECT `discovered_sprays` FROM `laptop_gangs` WHERE `gang_id` = @GangId", {
        ['@GangId'] = GangId
    })

    if Result[1] == nil then return end

    local DiscoveredSprays = json.decode(Result[1].discovered_sprays)
    DiscoveredSprays[#DiscoveredSprays + 1] = SprayId

    exports['oxmysql']:executeSync("UPDATE `laptop_gangs` SET `discovered_sprays` = @Sprays WHERE `gang_id` = @GangId", {
        ['@Sprays'] = json.encode(DiscoveredSprays),
        ['@GangId'] = GangId
    })

    local Leader = Fetch:SID(Gang.Leader.Cid)
    if Leader then
        TriggerClientEvent(Config.BaseName.."-graffiti/client/update-discovered", Leader:GetData('Source'), DiscoveredSprays)
    end

    for k, v in pairs(Gang.Members) do
        local Target = Fetch:SID(v.Cid)
        if Target then
            TriggerClientEvent(Config.BaseName.."-graffiti/client/update-discovered", Target:GetData('Source'), DiscoveredSprays)
        end
    end
end)