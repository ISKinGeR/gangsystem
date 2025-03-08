export const PresetBackgrounds = [
    "", // empty = default
    "https://i.imgur.com/znBUadu.png",
    "https://i.imgur.com/6cyxd00.png",
    "https://i.imgur.com/4FjcN6U.png",
    "https://i.imgur.com/W53E6CT.png",
    "https://i.imgur.com/qqGaIdx.png",
    "https://i.imgur.com/ni2leOl.png",
    "https://i.imgur.com/tu6j2rh.png",
    "https://i.imgur.com/lNgJ11u.png",
    "https://i.imgur.com/j7hqSjN.png",
    "https://i.imgur.com/q6DIElF.png",
    "https://i.imgur.com/nFoBl71.png",
]

export const LaptopApps = [
    {
        Id: "Trash",
        Label: "Recycle Bin",
        Image: "trash.png",
        IsSvg: false, IsFake: true,
        RequiresVPN: false, IgnoreType: true
    },
    {
        Id: "Folder",
        Label: "Stuff",
        Image: "folder.png",
        IsSvg: false, IsFake: true,
        RequiresVPN: false, IgnoreType: true
    },
    {
        Id: "Internet",
        Label: "Internet Explorer",
        Image: "internetexplorer.svg",
        IsSvg: true, IsFake: false,
        RequiresVPN: false, Hidden: true,
        IgnoreType: true
    },
    {
        Id: "Unknown",
        Label: "Unknown",
        Image: "unknown.svg",
        IsSvg: true, IsFake: false,
        RequiresVPN: true, Type: "Crime",
    },
];