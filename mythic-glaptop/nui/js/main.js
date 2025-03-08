let LaptopOpen = false;
let FirstTimeStartup = true;
let AppWindowOpen = false;
let NotifyCount = 0;
let NotificationsIntervals = [];
let Notifications = [];
let NotificationsCenter = {};
let CurrentLaptopApp = null;
LoadedApps = [];
ScriptNames = null;

let LaptopData = {
    MainData: {
        CitizenId: null,
        Data: null,
    },
    Boosting: {
        Data: null
    },
    Racing: {
        Data: null
    },
}

// Functions

OpenLaptopContainer = function(Data) {
    $('.laptop-wrapper').css('pointer-events', 'auto');
    $('.main-laptop-container').fadeIn(450);
    LaptopData.MainData.CitizenId = Data.CitizenId;
    LaptopData.MainData.Data = Data.LaptopData;
    LaptopData.MainData.Apps = Data.Apps;
    ScriptNames = Data.ScriptNames != null && Data.ScriptNames != undefined ? Data.ScriptNames : 'mythic-';

    if (Data.LaptopData.Background == 'Default') {
        $('#background-url').val('Default');
        $('.laptop-screen').css('background-image', `url("./images/background.jpg")`);
    } else {
        $('#background-url').val(Data.LaptopData.Background);
        $('.laptop-screen').css('background-image', `url('${Data.LaptopData.Background}')`);
    }

    $('#nickname').val(Data.LaptopData.Nickname);

    // Create Applications
    $('.laptop-apps').empty();

    // Trash App
    $('.laptop-apps').append(`<div class="laptop-app trash-app">
                                <div class="laptop-app-logo"><img src="./images/trash-can.png" alt="trash-app"></div>
                                <div class="laptop-app-title">Trash</div>
                            </div>`);
    // Random Folder
    $('.laptop-apps').append(`<div class="laptop-app folder-app">
                                <div class="laptop-app-logo"><img src="./images/folder.png" alt="folder-app"></div>
                                <div class="laptop-app-title">Stuff</div>
                            </div>`);
    // Other Apps
    $.each(Data.Apps, function(Key, Value) {
        if (!Value.Enabled) return;
        if (Value.Item != null && Value.Item != undefined) {
            $.post(`https://${GetParentResourceName()}/Laptop/HasItem`, JSON.stringify({
                Item: Value.Item,
            }), function(HasItem) {
                if (!HasItem) return;
                let App = `<div class="laptop-app ${Value.Name.toLowerCase() || 'trash'}-app" data-app="${Value.Name}" id="laptop-app-${Key}">
                                <div class="laptop-app-logo app-${Value.Color || 'grey'}">${(Value.Icon != null && Value.Icon != undefined) ? `<i class="${Value.Icon || 'fas fa-trash-alt'}"></i>` : `<img src="${'./images/'+Value.Image || './images/folder.png'}" alt="folder-app">`}</div>
                                <div class="laptop-app-title">${Value.Name}</div>
                            </div>`;
                $('.laptop-apps').append(App);
                $(`#laptop-app-${Key}`).data('AppData', Value);
                LoadedApps[Value.Name] = false;
            });
        }        
    });

    $('.laptop-apps').show();
    LaptopOpen = true

    if (Data.ShowStartupScreen) {
        if (FirstTimeStartup) {
            FirstTimeStartup = false;
            $('.laptop-startup-screen').fadeIn(250);
            setTimeout(() => {
                $('.laptop-startup-screen-loading').hide();
                setTimeout(() => {
                        $('.laptop-startup-screen-message').html('Welcome, ' + Data.LaptopData.Nickname);
                        $('.laptop-startup-screen-message').fadeIn(250);
                        setTimeout(() => {
                            $('.laptop-startup-screen-message').fadeOut(250);
                            $('.laptop-startup-screen').fadeOut(250);
    
                            setTimeout(() => {
                                $('.laptop-screen').fadeIn(250);
                                $('.laptop-screen').css('pointer-events', 'auto');
                                setTimeout(() => {
                                    $('.laptop-bottom-bar').css('transform', 'translateY(0%)');
                                }, 150);
                            }, 250);
                        }, 3000);
                }, 150);
            }, 3000);
        }
    } else {
        setTimeout(() => {
            $('.laptop-screen').fadeIn(250);
            $('.laptop-screen').css('pointer-events', 'auto');
            setTimeout(() => {
                $('.laptop-bottom-bar').css('transform', 'translateY(0%)');
            }, 150);
        }, 250);
    }
}

CloseLaptopContainer = function() {
    LaptopOpen = false
    $.post(`https://${GetParentResourceName()}/Laptop/Close`, JSON.stringify({}));
    $('.main-laptop-container').fadeOut(450, function() {
        $('.laptop-wrapper').css('pointer-events', 'none');
        $('.laptop-app-screen').fadeOut(150);
        $('.laptop-background').fadeOut(150);
    });
}

OpenApp = function(App) {
    $('.laptop-bottom-bar-apps').empty();
    $('.laptop-screen-title').html(App.Name);
    $('.laptop-bottom-bar-apps').append(`<div class="bottom-button app app-${App.Color || 'grey'}" data-App="${App.Name}"><i class="${App.Icon || 'fas fa-trash-alt'}"></i></div>`);
    
    // Hide all other apps except the one we want to open
    $.each(LaptopData.MainData.Apps, function(Key, Value) {
        if (Value.Name == App.Name) return;
        $(`.laptop-${Value.Name.toLowerCase()}`).hide();
    });

    CurrentLaptopApp = App;
    $('.laptop-background').fadeIn(150);
    $('.laptop-app-screen').fadeIn(150);
    AppWindowOpen = true;
}

MinimizeApp = function() {
    $('.laptop-app-screen').fadeOut(150);
    $('.laptop-background').fadeOut(150);
    AppWindowOpen = false;
    LoadedApps[CurrentLaptopApp.Name] = false;
    $(`[data-App="${CurrentLaptopApp.Name}"]`).removeClass(`app-${CurrentLaptopApp.Color || 'grey'}`);
}

CloseApp = function() {
    $('.laptop-app-screen').fadeOut(150);
    $('.laptop-background').fadeOut(150);
    $('.laptop-bottom-bar-apps').empty();
    OnAppClose();
}

OnAppClose = function() {
    LoadedApps[CurrentLaptopApp.Name] = false;
    AppWindowOpen = false;
    CurrentLaptopApp = null;
}

LoadApp = function(App) {
    if (App.Name == 'Market') {
        LoadMarket();
    } else if (App.Name == 'Boosting') {
        LoadBoosting();
    } else if (App.Name == 'Racing') {
        LoadRacing();
    } else if (App.Name == 'Mining') { 
        LoadMining();
    }
}

// Clicks 

$(document).on('click', '.bottom-button.app', function(Event) {
    Event.preventDefault();
    let AppType = $(this).attr("data-App");
    let AppData = $(`[data-app="${AppType}"]`).data("AppData");
    OpenApp(AppData);
    LoadApp(AppData);
});

$(document).on('click', '.laptop-app', function(Event) {
    Event.preventDefault();
    let AppData = $(this).data("AppData");
    if (AppData == null || AppData == undefined) return;
    OpenApp(AppData);
    LoadApp(AppData);
});

// Click outside settings
let CanInteract = true;
$(document).click(function(event) { 
    let $target = $(event.target);
    if (!CanInteract) return;
    if(!$target.closest('.bottom-settings').length && !$target.closest('.laptop-settings-window').length && $('.laptop-settings-window').is(":visible")) {
        CanInteract = false;
        $('.bottom-settings').toggleClass('active');
        $('.bottom-settings').toggleClass('selected');
        if ($('.laptop-settings-window').is(':visible')) {
            $('.laptop-settings-window').toggleClass('active');
            $('.laptop-settings-window').fadeOut(150);
        } 
        setTimeout(() => {
            CanInteract = true;
        }, 250);
    } else if(!$target.closest('.bottom-date-time').length && !$target.closest('.laptop-notifications-center').length && $('.laptop-notifications-center').is(":visible")) {
        CanInteract = false;
        $('.laptop-notifications-center').toggleClass('active');
        $('.bottom-date-time').toggleClass('selected');
        $('.laptop-notifications-center').fadeOut(150);
        setTimeout(() => {
            CanInteract = true;
        }, 250);
    }    
});

$(document).on('click', '.bottom-settings', function(Event) {
    Event.preventDefault();

    if (!CanInteract) return;
    $('.bottom-settings').toggleClass('active');
    $('.bottom-settings').toggleClass('selected');
    
    if ($('.laptop-settings-window').is(':visible')) {
        $('.laptop-settings-window').toggleClass('active');
        $('.laptop-settings-window').fadeOut(150);
    } else {
        $('.laptop-settings-window').fadeIn(150);
        $('.laptop-settings-window').toggleClass('active');
    }
});

$(document).on('click', '.laptop-settings-window-button', function(Event) {
    Event.preventDefault();
    let Button = $(this).text();

    if (Button == 'Save') {
        let NewBG = $('#background-url').val();
        let Nickname = $('#nickname').val();
        $.post(`https://${GetParentResourceName()}/Laptop/SaveSettings`, JSON.stringify({
            Background: NewBG,
            Nickname: Nickname,
        }), function(Saved) {
            $('#nickname').val(Nickname);
            $('#background-url').val(NewBG);
            if (NewBG.toLowerCase() == 'default') {
                $('.laptop-screen').css('background-image', "url('./images/background.jpg')");
            } else {
                $('.laptop-screen').css('background-image', `url('${NewBG}')`);
            }
            $('.bottom-settings').toggleClass('active');
            $('.bottom-settings').toggleClass('selected');
            if ($('.laptop-settings-window').is(':visible')) {
                $('.laptop-settings-window').toggleClass('active');
                $('.laptop-settings-window').fadeOut(150);
            }
            if (Saved) {
                ShowLaptopNotification('fas fa-cog', 'Settings', 'Saved', 'Your settings have been saved successfully', 4000);
            } else {
                ShowLaptopNotification('fas fa-cog', 'Settings', 'Saved', 'An error occurred when trying to save your settings', 4000);
            }
        });
    } else if (Button == 'Reset') {
        let NewNickname = 'User-'+Math.floor(Math.random() * 9999999);
        $.post(`https://${GetParentResourceName()}/Laptop/SaveSettings`, JSON.stringify({
            Background: 'Default',
            Nickname: NewNickname,
        }), function(Saved) {
            $('#nickname').val(NewNickname);

            $('#background-url').val('Default');
            $('.laptop-screen').css('background-image', "url('./images/background.jpg')");
           
            $('.bottom-settings').toggleClass('active');
            $('.bottom-settings').toggleClass('selected');
            if ($('.laptop-settings-window').is(':visible')) {
                $('.laptop-settings-window').toggleClass('active');
                $('.laptop-settings-window').fadeOut(150);
            } 
            if (Saved) {
                ShowLaptopNotification('fas fa-cog', 'Settings', 'Reset', 'Your settings have been reset successfully', 4000);
            } else {
                ShowLaptopNotification('fas fa-cog', 'Settings', 'Reset', 'An error occurred while trying to reset your settings', 4000);
            }
        });
    }
});

$(document).on('click', '.laptop-notifications-center-button', function(Event) {
    Event.preventDefault();
    $('.laptop-notifications-center-list').html('');
    NotificationsCenter = {};
    $('.empty-notifications').fadeIn(150);
});

$(document).on('click', '.bottom-date-time', function(Event) {
    Event.preventDefault();
    if (!CanInteract) return;
    $('.bottom-date-time').toggleClass('selected');
    if ($('.laptop-notifications-center').is(':visible')) {
        $('.laptop-notifications-center').toggleClass('active');
        $('.laptop-notifications-center').fadeOut(150);
    } else {
        $('.laptop-notifications-center-list').empty();
        $.each(NotificationsCenter, function(Key, Value) {
            let NotificationElem = `<div class="laptop-notify">
                <div class="laptop-notify-appname"><i class="${Value['NotifIcon']}"></i>${Value['NotifApp']}</div>
                <div class="laptop-notify-title">${Value['NotifTitle']}</div>
                <div class="laptop-notify-text">${Value['NotifDescription']}</div>
            </div>`
            $('.laptop-notifications-center-list').prepend(NotificationElem);
        });
        if ($('.laptop-notifications-center-list').children().length >= 1) {
            $('.empty-notifications').fadeOut(150);
        }
        $('.laptop-notifications-center').fadeIn(150);
        $('.laptop-notifications-center').toggleClass('active');
    }
});

function ShowLaptopNotification(Icon, App, Title, Description, Timeout) {
    NotifyCount += 1;
    let NotifyId = NotifyCount;
    let UniqueId = Math.floor(Math.random() * 9999999);

    Notifications[NotifyId] = $(".template-notify").clone();
    Notifications[NotifyId].hide().addClass('transReset');
    Notifications[NotifyId].addClass('notify-' + NotifyId);

    Notifications[NotifyId].removeClass('template-notify');
    Notifications[NotifyId].find('.laptop-notify-appname').html(`<i class="${Icon}"></i> ${App}`);
    Notifications[NotifyId].find('.laptop-notify-title').html(Title);
    Notifications[NotifyId].find('.laptop-notify-text').html(Description);
    Notifications[NotifyId].attr('notify-key', NotifyId);

    NotificationsCenter[UniqueId] = {
        NotifIcon: Icon,
        NotifApp: App,
        NotifTitle: Title,
        NotifDescription: Description,
    }

    $(".laptop-notify-container").prepend(Notifications[NotifyId]);

    Notifications[NotifyId].show(300, function() { 
        $(this).removeClass('transReset')
    });

    AnimateCSS('.notify-' + NotifyId, 'slideInRight', function(){
        Notifications[NotifyId].removeClass('animated slideInRight');
    });

    NotificationsIntervals[NotifyId] = setInterval(function(){
        AnimateCSS('.notify-' + NotifyId, 'slideOutRight', function(){
            Notifications[NotifyId].remove();
        });
        clearInterval(NotificationsIntervals[NotifyId]);
        NotificationsIntervals[NotifyId] = null;
    }, Timeout || 3500);
}

AnimateCSS = function(element, animationName, callback) {
    const node = document.querySelector(element)
    if (node == null) {
        return;
    }
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

CloseLaptopModal = function() {
    $('.laptop-modal-input input').unbind();
    $(".laptop-modal-button.confirm").unbind();
    $(".laptop-modal-button.cancel").unbind();
    $(".laptop-modal-close").unbind();
    $(".laptop-app-screen").unbind();
    $(".laptop-modal-wrapper").fadeOut(150);
}

CreateLaptopModal = function(ModalData, OnSubmit, OnCancel) {
    $('.laptop-modal-title').html(ModalData.Title);
    if (ModalData.Description == "" || ModalData.Description == null) {
        $('.laptop-modal-desc').hide();
    } else {
        $('.laptop-modal-desc').html(ModalData.Description);
        $('.laptop-modal-desc').show();
    }

    if (ModalData.Inputs == null || ModalData.Inputs == undefined || ModalData.Inputs.length === 0) {
        $('.laptop-modal-inputs').hide();
    } else {
        $('.laptop-modal-inputs').show();
        $('.laptop-modal-inputs').empty();
        $.each(ModalData.Inputs, function(Key, Value) {
            let Input = `<div class="laptop-modal-input" id="modal-input-${Key}">
                            <label for="modal-inputbox-${Key}">${Value.Label}</label>
                            <i class="${Value.Icon || 'fas fa-sticky-note'}"></i>
                            <input type="${Value.Type || "text"}" id="modal-inputbox-${Key}" name="modal-inputbox-${Key}" value="${Value.Text || ""}" placeholder="${Value.Placeholder || "Type.."}">
                        </div>`;
            $('#modal-input-'+Key).data('InputData', Value)
            $('.laptop-modal-inputs').append(Input);
        });
    }

    if (ModalData.DropDowns == null || ModalData.DropDowns == undefined || ModalData.DropDowns.length === 0) {
        $('.laptop-modal-dropdowns').hide();
    } else {
        $('.laptop-modal-dropdowns').show();
        $('.laptop-modal-dropdowns').empty();
        $.each(ModalData.DropDowns, function(Key, Value) {
            let DropDownOptions = ``;
            $.each(Value.Options, function(i, option) {
                DropDownOptions += `<option value="${option.Text}">${option.Text}</option>`;
            });

            let DropDown = `<div class="laptop-modal-dropdown" id="modal-dropdown-${Key}">
                                <label for="modal-dropdownbox-${Key}">${Value.Label}</label>
                                <select id="modal-dropdownbox-${Key}" name="modal-dropdownbox-${Key}">${DropDownOptions}</select>
                            </div>`;
            $('#modal-dropdown-'+Key).data('DropDownData', Value)
            $('.laptop-modal-dropdowns').append(DropDown);
        });
    }

    if (ModalData.CheckBoxes == null || ModalData.CheckBoxes == undefined || ModalData.CheckBoxes.length === 0) {
        $('.laptop-modal-checkboxes').hide();
    } else {
        $('.laptop-modal-checkboxes').show();
        $('.laptop-modal-checkboxes').empty();
        $.each(ModalData.CheckBoxes, function(Key, Value) {
            let Checkbox = `<div class="laptop-modal-checkbox" id="modal-checkbox-${Key}">
                                <div class="laptop-modal-checkboxbox">
                                    <input type="checkbox" id="modal-checkboxbox-${Key}" name="modal-checkboxbox-${Key}" ${Value.Checked ? "checked" : ""}>
                                    <svg viewBox="0 0 35.6 35.6">
                                        <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                                        <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                                        <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
                                    </svg>
                                </div>
                                <label for="modal-checkboxbox-${Key}">${Value.Label}</label>
                            </div>`;
            $('#modal-checkbox-'+Key).data('CheckBoxData', Value)
            $('.laptop-modal-checkboxes').append(Checkbox);
        });
    }

    $(".laptop-modal-button.confirm").click(function(e){
        e.preventDefault();

        let InputValues = [];
        if (ModalData.Inputs != null && ModalData.Inputs != undefined && ModalData.Inputs.length > 0) {
            $.each(ModalData.Inputs, function(i, input){
                let InputValue = $("#modal-inputbox-"+i).val();
                InputValues[i] = InputValue;
            });
        }

        let DropDownValues = [];
        if (ModalData.DropDowns != null && ModalData.DropDowns != undefined && ModalData.DropDowns.length > 0) {
            $.each(ModalData.DropDowns, function(i, input){
                let InputValue = $("#modal-dropdownbox-"+i).val();
                DropDownValues[i] = InputValue;
            });
        }

        let CheckBoxValues = [];
        if (ModalData.CheckBoxes != null && ModalData.CheckBoxes != undefined && ModalData.CheckBoxes.length > 0) {
            $.each(ModalData.CheckBoxes, function(i, input){
                let CheckBoxValue = $("#modal-checkboxbox-"+i).is(":checked");
                CheckBoxValues[i] = CheckBoxValue;
            });
        }

        setTimeout(() => {
            if (OnSubmit !== undefined) {
                OnSubmit({
                    Inputs: InputValues,
                    DropDowns: DropDownValues,
                    CheckBoxes: CheckBoxValues
                });
            }
            CloseLaptopModal();
        }, 150);
    });

    $(".laptop-app-screen").click(function(e){
        e.preventDefault();

        if (OnCancel !== undefined) {
            OnCancel();
        }
        CloseLaptopModal();
    });

    $(".laptop-modal-close").click(function(e){
        e.preventDefault();

        if (OnCancel !== undefined) {
            OnCancel();
        }
        CloseLaptopModal();
    });
        
    $('.laptop-modal-wrapper').fadeIn(150);
}



// Document

$(document).on('click', '.laptop-notify', function(Event) {
    Event.preventDefault();
    let NotifyId = $(this).attr('notify-key');
    if (NotificationsIntervals[NotifyId] != null && NotifyId != null) {
        AnimateCSS('.notify-' + NotifyId, 'slideOutRight', function(){
            Notifications[NotifyId].remove();
        });
        clearInterval(NotificationsIntervals[NotifyId]);
        NotificationsIntervals[NotifyId] = null;
    }
});

$(document).on('click', '.laptop-screen-min', function(Event) {
    Event.preventDefault();
    MinimizeApp();
});

$(document).on('click', '.laptop-screen-close', function(Event) {
    Event.preventDefault();
    CloseApp();
});

document.addEventListener('DOMContentLoaded', (event) => {
    window.addEventListener('message', function(event){
        let Component = event.data.Component;
        let Action = event.data.Action;
        let Data = event.data.Data;
        switch(Component) {
            case "Laptop":
                switch(Action) {
                    // Boosting
                    case "AddBoostingCard":
                        AddBoostingCard(Data);
                        break;
                    case "UpdateBoostingMarket":
                        UpdateBoostingMarket(Data);
                        break;
                    case "UpdateBoostingCard":
                        UpdateBoostingCard(Data);
                        break;
                    case "RemoveMarketBoostingCard":
                        RemoveMarketBoostingCard(Data);
                        break;
                    case "RemoveBoostingCard":
                        RemoveBoostingCard(Data);
                        break;
                    case "UpdateBoosting":
                        LoadBoosting();
                        break;
                    case "ClearCountdown":
                        ClearCountDown(Data)
                        break;
                    // Racing
                    case "UpdateRacing":
                        LoadRacing()
                        break;
                    case "UpdateRacers":
                        UpdateRacers(Data)
                        break;
                    // Laptop
                    case "OpenLaptop":
                        OpenLaptopContainer(Data)
                        break;
                    case "UpdateTime":
                        let CDate = new Date();
                        let CurrentType = 'PM'
                        let CurrentDate = CDate.getDate(); 
                        let CurrentMonth = CDate.getMonth() + 1
                    
                        if (Data.Hour >= 0 && Data.Hour <= 11) { CurrentType = 'AM' }
                        if (Data.Minute <= 9) { Data.Minute = `0${Data.Minute}` }
                    
                        $('.bottom-date-time').html(`${Data.Hour}:${Data.Minute} ${CurrentType} <br>${CurrentMonth}/${CurrentDate}/${CDate.getFullYear()}`);
                        break;
                  
                }
            break;
        }
    });
});

$(document).on({
    keydown: function(e) {
        if (e.keyCode == 27 && LaptopOpen) {
            if (AppWindowOpen) {
                CloseApp();
            } else {
                CloseLaptopContainer();
            }
        }
    },
});