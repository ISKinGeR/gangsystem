AddEventHandler("Graffiti:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Database = exports["mythic-base"]:FetchComponent("Database")
	Logger = exports["mythic-base"]:FetchComponent("Logger")
	Callbacks = exports["mythic-base"]:FetchComponent("Callbacks")
	Fetch = exports["mythic-base"]:FetchComponent("Fetch")
	Middleware = exports["mythic-base"]:FetchComponent("Middleware")
	Execute = exports["mythic-base"]:FetchComponent("Execute")
	Inventory = exports["mythic-base"]:FetchComponent("Inventory")
    Wallet = exports["mythic-base"]:FetchComponent("Wallet")
    Chat = exports["mythic-base"]:FetchComponent("Chat")
    Phone = exports["mythic-base"]:FetchComponent("Phone")

    _Ready = true
end

AddEventHandler("Core:Shared:Ready", function()
	exports["mythic-base"]:RequestDependencies("Graffiti", {
		"Database",
		"Logger",
		"Callbacks",
		"Fetch",
		"Middleware",
		"Execute",
        "Wallet",
        "Chat",
		"Phone",

		"Inventory"
	}, function(error)
		if #error > 0 then
			return
		end
		RetrieveComponents()
        Inventory.Items:RegisterUse("glaptop", "Glaptop", function(source, itemData)
            TriggerClientEvent(Config.BaseName..'-glaptop/client/open', source, "Crime")
        end)
    
    end)
end)