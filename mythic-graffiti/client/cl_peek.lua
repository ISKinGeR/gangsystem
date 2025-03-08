function SetupEyes()
    PedInteraction:Add(
        "spray_guy",
        GetHashKey("a_m_y_cyclist_01"),
        vector3(-297.46, -1332.25, 30.3),
        306.24,
        10.0,
        {
            {
                icon = "spray-can",
                text = "Buy Gang Spray",
                event = Config.BaseName.."-graffiti/client/purchase-gang-spray",
                isEnabled = function()
                    return true
                end,
            },
            {
                icon = "spray-can",
                text = "Buy Normal Spray ($" .. Config.SprayPrice .. ")",
                event = Config.BaseName.."-graffiti/client/purchase-spray",
                isEnabled = function()
                    return true
                end,
            },
            {
                icon = "broom",
                text = "Buy Scrubbing Cloth ($" .. Config.ScrubPrice .. ")",
                event = Config.BaseName.."-graffiti/server/purchase-scrubcloth",
                isEnabled = function()
                    return true
                end,
            },
            {
                icon = "laptop",
                text = "Buy glaptop ($" .. Config.ScrubPrice .. ")",
                event = Config.BaseName.."-graffiti/server/purchase-glaptop",
                isEnabled = function()
                    return true
                end,
            },
        },
        "question",
        "WORLD_HUMAN_AA_SMOKE"
    )    

    for k, v in pairs(Config.Sprays) do
        Targeting:AddObject(GetHashKey(v.Model), "spray-can", {
            {
                icon = "soap",
                text = "Scrub",
                event = Config.BaseName.."-graffiti/client/scrub-graffiti",
                jobs = { "police" },
                jobDuty = true,
                data = {},
                isEnabled = function()
                    return LocalPlayer.state.onDuty == "police" and not LocalPlayer.state.isDead
                end,
            },
            {
                icon = "hand-holding",
                text = "Contest Graffiti",
                event = Config.BaseName.."-graffiti/client/contest-graffiti",
                data = {},
                isEnabled = function(data, entity)
                    local isContested = exports[Config.BaseName..'-graffiti']:IsGraffitiContested(entity.entity)
                    local isGangSpray = exports[Config.BaseName..'-graffiti']:IsGangSpray(entity.entity)
                    local isInSprayGang = exports[Config.BaseName..'-graffiti']:IsPlayerInSprayGang(entity.entity)
        
                    -- kprint("Contest Graffiti")
                    -- kprint("is Contested:", isContested)
                    -- kprint("is GangSpray:", isGangSpray)
                    -- kprint("is In Spray Gang:", isInSprayGang)
        
                    return isGangSpray and not isContested and not isInSprayGang
                end,
            },
            {
                icon = "eye",
                text = "Discover Graffiti",
                event = Config.BaseName.."-graffiti/client/discover-graffiti",
                data = {},
                isEnabled = function(data, entity)
                    local isGangSpray = exports[Config.BaseName..'-graffiti']:IsGangSpray(entity.entity)
                    -- kprint("Discover Graffiti")
                    -- kprint("is GangSpray:", isGangSpray)
                    return isGangSpray
                end,
            },
            {
                icon = "hand-holding",
                text = "Claim Graffiti",
                event = Config.BaseName.."-graffiti/client/claim-graffiti",
                data = {},
                isEnabled = function(data, entity)
                    local isContested = exports[Config.BaseName..'-graffiti']:IsGraffitiContested(entity.entity)
                    local isGangSpray = exports[Config.BaseName..'-graffiti']:IsGangSpray(entity.entity)
        
                    -- kprint("Claim Graffiti")
                    -- kprint("is Contested:", isContested)
                    -- kprint("is GangSpray:", isGangSpray)
        
                    return isGangSpray and isContested
                end,
            },
        }, 3.0)        
    end
    
end