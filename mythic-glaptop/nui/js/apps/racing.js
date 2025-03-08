// let SourceCid = null;
// let PlayerRace = null;
// let CurrentPageRacing = "races";
// let CurrentPageAction = null;

// LoadRacing = async function() {
//     $('.laptop-racing').show();
//     SwitchPage('races', CurrentPageRacing);

//     $.post(`https://${ScriptNames}racing/Laptop/Racing/Get`, JSON.stringify({}), function(Data) {
//         SourceCid = Data.SourceCid;
//         PlayerRace = Data.RaceData.PlayerRace;
//         LaptopData.Racing.Data = Data.RaceData;
//         InitializeRacing(Data.RaceData.Races, Data.RaceData.Tracks);
//     });
//     LoadedApps['Racing'] = true;
// }

// InitializeRacing = function(Races, Tracks) {
//     $('[data-RacingPage="races"]').find('.laptop-racing-card-container').empty();
//     $('[data-RacingPage="tracks"]').find('.laptop-racing-card-container').empty();
//     $('[data-RacingPage="leaderboards"]').find('.laptop-racing-card-container').empty();

//     let ActiveRaces = [];
//     let PendingRaces = [];
//     let CompletedRaces = [];

//     // Load Races

//     if (Races.length <= 0) {
//         let NoRaces = `<div class="laptop-racing-race-category" data-RaceCategory="none">
//             <div class="laptop-racing-race-category-title">No active races found..</div>
//         </div>`;
//         $('[data-RacingPage="races"]').find('.laptop-racing-card-container').append(NoRaces);  
//     } else {
//         let PendingCategory = `<div class="laptop-racing-race-category" data-RaceCategory="pending">
//             <div class="laptop-racing-race-category-title">Pending</div>
//             <div class="laptop-racing-race-category-list"></div>
//         </div>`;
//         $('[data-RacingPage="races"]').find('.laptop-racing-card-container').append(PendingCategory);  

//         let ActiveCategory = `<div class="laptop-racing-race-category" data-RaceCategory="active">
//             <div class="laptop-racing-race-category-title">Active</div>
//             <div class="laptop-racing-race-category-list"></div>
//         </div>`;
//         $('[data-RacingPage="races"]').find('.laptop-racing-card-container').append(ActiveCategory);

//         let CompletedCategory = `<div class="laptop-racing-race-category" data-RaceCategory="completed">
//             <div class="laptop-racing-race-category-title">Completed</div>
//             <div class="laptop-racing-race-category-list"></div>
//         </div>`;
//         $('[data-RacingPage="races"]').find('.laptop-racing-card-container').append(CompletedCategory);  
//     }

//     if (Races.length !== 0) {
//         Races.forEach(function(Race, Index) {
//             if (Race.Data.Started) {
//                 ActiveRaces[ActiveRaces.length] = Race
//             } else if (Race.Data.Waiting) {
//                 PendingRaces[PendingRaces.length] = Race
//             } else {
//                 CompletedRaces[CompletedRaces.length] = Race
//             }
//         });
//     }
    
//     $.each(ActiveRaces, function(RaceId, RaceData) {
//         AddRaceCard(RaceData, 'races', 'active');
//     });

//     $.each(PendingRaces, function(RaceId, RaceData) {
//         AddRaceCard(RaceData, 'races', 'pending');
//     });

//     $.each(CompletedRaces, function(RaceId, RaceData) {
//         AddRaceCard(RaceData, 'races', 'completed');
//     });

//     // Load Tracks

//     if (Tracks.length <= 0) {
//         let NoTracks = `<div class="laptop-racing-race-category" data-RaceCategory="none">
//             <div class="laptop-racing-race-category-title">No tracks found..</div>
//         </div>`;
//         $('[data-RacingPage="tracks"]').find('.laptop-racing-card-container').append(NoTracks);  
//     } else {
//         $.each(Tracks, function(TrackId, TrackData) {
//             AddRaceCard(TrackData, 'tracks', 'tracks');
//         });
//     }
// }

// AddRaceCard = async function(Data, Type, RaceStatus) {
//     if (Data == null || Data == undefined) return;

//     let RaceOptions
//     if (Type != "tracks") {
//         RaceOptions = await GetRaceOptions(Data.Settings);
//     }
        
//     let RaceButtons = [];
//     if (RaceStatus != null && RaceStatus != undefined) {
//         if (RaceStatus == "pending") {
//             let PendingButtons = ``;
//             if (SourceCid != null && SourceCid != undefined) {
//                 PendingButtons = `${ 
//                     (SourceCid === Data.SetupCitizenId) ? 
//                     `<div class="laptop-racing-card-button phone-racing-start" data-Type="Start"><i class="fas fa-chevron-circle-right"></i> Start Race</div> 
//                     <div class="laptop-racing-card-button phone-racing-stop" data-Type="Stop"><i class="fas fa-flag-checkered"></i> Stop Race</div>
//                     <div class="laptop-racing-card-button phone-racing-racers" data-Type="Racers"><i class="fas fa-users"></i> Racers</div>` : // Is Creator so stop race
                
//                     !PlayerRace ? `<div class="laptop-racing-card-button phone-racing-join" data-Type="Join"><i class="fas fa-angle-double-right"></i> Join Race</div>` : // Race == false so not in race
                    
//                     PlayerRace === Data.RaceId ? `<div class="laptop-racing-card-button phone-racing-leave" data-Type="Leave"><i class="fas fa-sign-out-alt"></i> Leave Race</div>` :  // Race is not false and race id is same so leave
//                     `<div class="laptop-racing-card-button phone-racing-join" data-Type="Join"><i class="fas fa-angle-double-right"></i> Join Race</div>`
//                 }`;
//             }
//             RaceButtons.push(PendingButtons);
//         } else if (RaceStatus == "active") {
//             let ActiveButtons = ``;
//             if (SourceCid != null && SourceCid != undefined) {
//                 ActiveButtons = `${ (SourceCid === Data.SetupCitizenId) ? 
//                     `<div class="laptop-racing-card-button phone-racing-stop" data-Type="Stop"><i class="fas fa-flag-checkered"></i> Stop Race</div>` : // Is Creator so stop race
//                     !PlayerRace ? `` : // Race == false so not in race
//                     PlayerRace === Data.RaceId ? `<div class="laptop-racing-card-button phone-racing-leave" data-Type="Leave"><i class="fas fa-sign-out-alt"></i> Leave Race</div>` :  // Race is not false and race id is same so leave
//                     ``
//                 } <div class="laptop-racing-card-button phone-racing-racers" data-Type="Racers"><i class="fas fa-users"></i> Racers</div>`;
//             }
//             RaceButtons.push(ActiveButtons);
//         } else if (RaceStatus == "completed") {
//             let CompletedButtons = `<div class="laptop-racing-card-button phone-racing-leaderboard" data-Type="Statistics"><i class="fas fa-trophy"></i> Statistics</div>`;
//             RaceButtons.push(CompletedButtons);
//         } else if (RaceStatus == "tracks" && Type == "tracks") { // Tracks
//             let TrackButtons = `
//                 <div class="laptop-racing-card-button phone-racing-leaderboard" data-Type="Leaderboards"><i class="fas fa-trophy"></i> Best Times</div>
//                 <div class="laptop-racing-card-button phone-racing-preview" data-Type="Preview"><i class="fas fa-eye"></i> Toggle Track</div>
//                 <div class="laptop-racing-card-button phone-racing-setgps" data-Type="GPS"><i class="fas fa-map-marker"></i> Set GPS</div>
//                 <div class="laptop-racing-card-button phone-racing-create" data-Type="Create"><i class="fas fa-map-marker"></i> Create Race</div>
//             `;
//             RaceButtons.push(TrackButtons);
//         }
//     }

//     if (Type == "tracks") {
//         let RaceElem = `<div class="laptop-racing-card" id="racing-card-${Type}-${Data.RaceId}">
//             <div class="laptop-racing-card-text laptop-racing-card-name">${Data.RaceName}</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">By ${Data.CreatorName}</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">${Data.Distance}mi</div>
//             <div class="laptop-racing-card-buttons"> ${RaceButtons} </div>
//         </div>`;
//         $(`[data-RacingPage="${Type}"]`).find('.laptop-racing-card-container').append(RaceElem);
//         $(`#racing-card-${Type}-${Data.RaceId}`).data(`RacingData`, Data);
//     } else {
//         if (RaceStatus == null || RaceStatus == undefined) return;
//         let RaceElem = `<div class="laptop-racing-card" id="racing-card-${Type}-${Data.Id}">
//             <div class="laptop-racing-card-text laptop-racing-card-name">${Data.RaceName}</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">${Data.Settings.Laps} Lap(s)</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name"><i class="fas fa-map-marker"></i> ${Data.RaceData.RaceName} - ${Data.RaceData.Distance}mi</div>
//             ${ RaceOptions.length > 0 ? `<div class="laptop-racing-card-text laptop-racing-card-name">${RaceOptions}</div>` : `` }
//             <div class="laptop-racing-card-buttons"> ${RaceButtons} </div>
//             <div class="laptop-racing-card-racers">

//             </div>
//         </div>`;
//         $(`[data-RacingPage="${Type}"]`).find(`[data-RaceCategory="${RaceStatus}"`).find('.laptop-racing-race-category-list').append(RaceElem);
//         $(`#racing-card-${Type}-${Data.Id}`).data(`RacingData`, Data);
//     }
// }

// async function GetRaceOptions(Settings) {
//     return new Promise((resolve, reject) => {
//         try {
//             let RaceOptions = "";
//             if (Settings.Reversed) {
//                 RaceOptions += `<i class="fas fa-backward"></i>R`;
//             }
//             // if (Settings.HitPenalty > 0) {
//             //     RaceOptions += ` <i class="fas fa-car-crash" style="margin-left: .1vh;"></i> ${Settings.HitPenalty}`;
//             // }
//             if (Settings.ForceFP) {
//                 RaceOptions += ` <i class="fas fa-camera" style="margin-left: .1vh;"></i>FP`;
//             }
//             if (Settings.Phasing !== "None") {
//                 RaceOptions += ` <i class="fas fa-ghost" style="margin-left: .1vh;"></i>P-${Settings.Phasing == '30 Seconds' ? '30' : Settings.Phasing == '60 Seconds' ? '60' : 'F'}`;
//             }
//             resolve(RaceOptions);
//         } catch (error) {
//             reject(error);
//         }
//     });
// }


// $(document).on('click', '.racing-createtrack', function(e) {
//     e.preventDefault();
//     CreateLaptopModal({
//         Title: 'Create Track',
//         Description: 'Create a new race track',
//         Inputs: [
//             {
//                 Icon: 'fas fa-flag-checkered',
//                 Type: 'text',
//                 Label: 'Name',
//                 Placeholder: 'Track name...',
//             },
//         ],
//     }, function(Result) { // Submit
//         $.post(`https://${ScriptNames}racing/Laptop/Racing/CreateRace`, JSON.stringify({
//             Name: Result.Inputs[0],
//         }), function(Data) {
//             if (Data == 'success') {
//                 ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Created', 'You successfully started to create a track..', 4000);
//             } else {
//                 ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Error', Data, 4000);
//             }
//         });
//     }, function(Result) { // Cancel
//     })
// });

// $(document).on('click', '.laptop-racing-card-button', function(e) {
//     e.preventDefault();

//     let Type = $(this).attr('data-Type');
//     if (Type == null || Type == undefined) return;
//     Type = Type.toLowerCase();
    
//     let RaceData = $(this).parent().parent().data('RacingData');
//     if (RaceData == null || RaceData == undefined) {
//         RaceData = $(this).parent().parent().parent().data('RacingData').RaceData;
//     };
//     if (RaceData == undefined) return;

//     if (Type == "start") {
//         $.post(`https://${ScriptNames}racing/Laptop/Racing/StartRace`, JSON.stringify({
//             Id: RaceData.Id,
//         }), function(Success) {
//             if (Success) {
//                 ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Started', 'You started the race..', 4000);
//             } else {
//                 ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Error', 'Something went wrong while trying to start the race..', 4000);
//             }
//         });
//     } else if (Type == "stop") {
//         $.post(`https://${ScriptNames}racing/Laptop/Racing/CancelRace`, JSON.stringify({
//             Id: RaceData.Id,
//         }), function(Success) {
//             if (Success) {
//                 ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Canceled', 'You canceled the race..', 4000);
//             } else {
//                 ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Error', 'Something went wrong while trying to cancel the race..', 4000);
//             }
//         });
//     } else if (Type == "join") {
//         $.post(`https://${ScriptNames}racing/Laptop/Racing/JoinRace`, JSON.stringify({
//             Id: RaceData.Id,
//         }), function(Success) {
//             if (Success) {
//                 ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Joined', 'You joined the race..', 4000);
//             } else {
//                 ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Error', 'Something went wrong while trying to join the race..', 4000);
//             }
//         });
//     } else if (Type == "leave") {
//         $.post(`https://${ScriptNames}racing/Laptop/Racing/LeaveRace`, JSON.stringify({
//             Id: RaceData.Id,
//         }), function(Success) {
//             if (Success) {
//                 ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Left', 'You left the race..', 4000);
//             } else {
//                 ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Error', 'Something went wrong while trying to leave the race..', 4000);
//             }
//         });
//     } else if (Type == "preview") {
//         $.post(`https://${ScriptNames}racing/Laptop/Racing/ToggleRaceLap`, JSON.stringify({
//             Race: RaceData
//         }), function(Data) {
//             ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Preview', 'You toggled the race preview..', 4000);
//         });
//     } else if (Type == "create") {
//         CreateLaptopModal({
//             Title: 'Setup Race ('+RaceData.RaceName+')',
//             Description: 'Setup a race by filling in the following boxes.',
//             Inputs: [
//                 { Icon: 'fas fa-flag-checkered', Type: 'text', Label: 'Name', Placeholder: 'Race name...', },
//                 { Icon: 'fas fa-road', Type: 'number', Label: 'Laps', Placeholder: 'Amount of laps...', Text: 1, },
//                 { Icon: 'fas fa-clock', Type: 'number', Label: 'Countdown (Seconds)', Placeholder: 'Countdown in seconds...', Text: 3, },
//                 // { Icon: 'fas fa-car-crash', Type: 'number', Label: 'Penalty On Hit (Seconds)', Placeholder: 'Penalty on hit...', Text: 0, }, // WIP
//             ],
//             DropDowns: [
//                 {
//                     Label: 'Phasing',
//                     Options: [
//                         { Text: 'None', },
//                         { Text: '30 Seconds', },
//                         { Text: '60 Seconds', },
//                         { Text: 'Full', },
//                     ],
//                 },
//             ],
//             CheckBoxes: [
//                 { Label: 'Reversed', Checked: false, },
//                 { Label: 'Force First Person', Checked: false, },
//                 { Label: 'Freeze On Countdown', Checked: false, },
//             ],
//         }, function(Result) { // Submit
//             GenerateUniqueRaceId().then((RaceId) => {
//                 $.post(`https://${ScriptNames}racing/Laptop/Racing/SetupRace`, JSON.stringify({
//                     Id: RaceId,
//                     Name: Result.Inputs[0],
//                     Laps: Result.Inputs[1],
//                     Countdown: Result.Inputs[2],
//                     // HitPenalty: Result.Inputs[3],
//                     Phasing: Result.DropDowns[0],
//                     Reversed: Result.CheckBoxes[0],
//                     ForceFP: Result.CheckBoxes[1],
//                     FreezeCountdown: Result.CheckBoxes[2],
//                     RaceData: RaceData,
//                     RaceId: RaceData.RaceId,
//                 }), function(Created) {
//                     if (Created) {
//                         ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Created', 'You successfully setup a race..', 4000);
//                     } else {
//                         ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Error', 'Something went wrong while trying to organize a race..', 4000);
//                     }
//                 });
//             }).catch((error) => {
//                 ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Error', 'Something went wrong while trying to organize a race..', 4000);
//             });

//         }, function(Result) { // Cancel
//         })
//     } else if (Type == "racers") {
//         CurrentPageAction = "live-racing";
//         $.post(`https://${ScriptNames}racing/Laptop/Racing/GetRaceData`, JSON.stringify({
//             Id: RaceData.Id,
//         }), function(Race) {
//             if (Race == null || Race == undefined || !Race) {
//                 return;
//             }
//             SwitchPage('leaderboards', CurrentPageRacing);
//             UpdateRacers(Race, true);
//         });
//     } else if (Type == "statistics") {
//         LoadRaceEndStatistics(RaceData.Id);
//     } else if (Type == "leaderboards") {
//         LoadTrackBestTimes(RaceData);
//     } else {
//         $.post(`https://${ScriptNames}racing/Laptop/Racing/SetGPS`, JSON.stringify({
//             TrackData: RaceData,
//         }), function(Success) {
//             if (Success) {
//                 ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'GPS', 'You set the GPS to the track..', 4000);
//             } else {
//                 ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Error', 'Something went wrong while trying to set the GPS..', 4000);
//             }
//         });
//     }
// });

// // Pagination

// function LoadTrackBestTimes(RaceData) {
//     CurrentPageAction = "leaderboards";
//     $('.laptop-racing-card-container-title').hide();
//     $(`[data-RacingPage="leaderboards"]`).find('.laptop-racing-card-container').empty();
//     $(`.racing-leaderboards`).show();
//     $(`.racing-leaderboards`).html("Best Times");
//     let Tracks = LaptopData.Racing.Data.Tracks;
//     Tracks.forEach(function(Track, Index) {
//         if (Track.RaceId == RaceData.RaceId) {
//             RaceData = Track;
//         }
//     });

//     if (RaceData == null || RaceData == undefined) return;

//     $('.laptop-racing-card-container-title').show();
//     $('.laptop-racing-card-container-title').html(RaceData.RaceName+ ' | Best Lap Times')

//     RaceData.Records.sort(function(a, b) {
//         return a.Time - b.Time;
//     });
//     $.each(RaceData.Records, function(i, Leaderboard) {
//         let LeaderboardElem = `<div class="laptop-racing-card" id="racing-card-leaderboard-${RaceData.RaceId}">
//             <div class="laptop-racing-card-text laptop-racing-card-name">#${i + 1}</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">${Leaderboard.Holder.Firstname} ${Leaderboard.Holder.Lastname}</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">${Leaderboard.Holder.Vehicle}</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">${SecondsTimeSpanToHMS(Leaderboard.Time)}</div>
//         </div>`;

//         $(`[data-RacingPage="leaderboards"]`).find('.laptop-racing-card-container').append(LeaderboardElem);
//     });

//     SwitchPage('leaderboards', CurrentPageRacing);
// }

// function LoadRaceEndStatistics(Id) {
//     CurrentPageAction = "end-racing"
//     $('.laptop-racing-card-container-title').hide();
//     $(`[data-RacingPage="leaderboards"]`).find('.laptop-racing-card-container').empty();
//     $(`.racing-leaderboards`).show();
//     $(`.racing-leaderboards`).html("Statistics");

//     $.post(`https://${ScriptNames}racing/Laptop/Racing/GetRaceData`, JSON.stringify({
//         Id: Id,
//     }), function(Race) {
//         if (Race == null || Race == undefined || !Race) {
//             ShowLaptopNotification('fas fa-flag-checkered', 'Racing', 'Error', 'Something went wrong while trying to get the race data..', 4000);
//             return;
//         }
//         $('.laptop-racing-card-container-title').show();
//         $('.laptop-racing-card-container-title').html(`(${Race.RaceData.RaceName}) ${Race.RaceName} | Statistics (Laps: ${Race.Settings.Laps})`)

//         Race.Data.Racers.sort(function(a, b) {
//             return a.Time - b.Time;
//         });
//         $.each(Race.Data.Racers, function(i, Racer) {
//             let RacerElem = !Racer.DNFFinish ? 
//             `<div class="laptop-racing-card">
//                 ${ Racer.Finished ? `<div class="laptop-racing-card-text laptop-racing-card-name"><i class="fas fa-flag-checkered"></i></div>` : `<div class="laptop-racing-card-text laptop-racing-card-name">DNF</div>` }
//                 <div class="laptop-racing-card-text laptop-racing-card-name">#${i + 1}</div>
//                 <div class="laptop-racing-card-text laptop-racing-card-name">${Racer.Firstname} ${Racer.Lastname}</div>
//                 <div class="laptop-racing-card-text laptop-racing-card-name">${Racer.VehicleModel}</div>
//                 <div class="laptop-racing-card-text laptop-racing-card-name">${SecondsTimeSpanToHMS(Racer.Time)}</div>
//             </div>` : `<div class="laptop-racing-card">
//                 <div class="laptop-racing-card-text laptop-racing-card-name">#${i + 1}</div>
//                 <div class="laptop-racing-card-text laptop-racing-card-name">${Racer.Firstname} ${Racer.Lastname}</div>
//                 <div class="laptop-racing-card-text laptop-racing-card-name">${Racer.VehicleModel}</div>
//                 <div class="laptop-racing-card-text laptop-racing-card-name">DNF</div>
//             </div>`;

//             $(`[data-RacingPage="leaderboards"]`).find('.laptop-racing-card-container').append(RacerElem);
//         });

//         SwitchPage('leaderboards', CurrentPageRacing);
//     });
// }

// function UpdateRacers(Race, Bypass) {
//     if (CurrentPageRacing != "leaderboards" && !Bypass) return;
//     if (CurrentPageAction != "live-racing") return;

//     $('.laptop-racing-card-container-title').hide();
//     $(`[data-RacingPage="leaderboards"]`).find('.laptop-racing-card-container').empty();
//     $(`.racing-leaderboards`).show();
//     $(`.racing-leaderboards`).html("Racers");

//     $('.laptop-racing-card-container-title').show();
//     $('.laptop-racing-card-container-title').html(`(${Race.RaceData.RaceName}) ${Race.RaceName} | Racers (${Race.Data.Racers.length})`)

//     let FinishedRacers = Race.Data.Racers.filter(function(Racer) {
//         return Racer.Time !== "DNF";
//     });
//     let NonFinishedRacers = Race.Data.Racers.filter(function(Racer) {
//         return Racer.Time === "DNF";
//     });
//     FinishedRacers.sort(function(a, b) { // Sort Racers
//         return a.Time - b.Time;
//     });
//     $.each(FinishedRacers, function(i, Racer) { // Add Racers
//         let RacerElem = `<div class="laptop-racing-card">
//             ${ Racer.Finished ? `<div class="laptop-racing-card-text laptop-racing-card-name"><i class="fas fa-flag-checkered"></i></div>` : `` }
//             <div class="laptop-racing-card-text laptop-racing-card-name">#${i + 1}</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">${Racer.Firstname} ${Racer.Lastname}</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">${Racer.VehicleModel}</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">${SecondsTimeSpanToHMS(Racer.Time)}</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">Lap ${Racer.Lap} / ${Race.Settings.Laps} </div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">Checkpoint ${Racer.Checkpoint} / ${Race.Settings.TotalCheckPoints} </div>
//         </div>`;

//         $(`[data-RacingPage="leaderboards"]`).find('.laptop-racing-card-container').append(RacerElem);
//     });
//     $.each(NonFinishedRacers, function(i, Racer) { // Add DNF Racers
//         let DNFRacerElem = Racer.DNFFinish ? `<div class="laptop-racing-card">
//             <div class="laptop-racing-card-text laptop-racing-card-name">#${i + 1}</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">${Racer.Firstname} ${Racer.Lastname}</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">${Racer.VehicleModel}</div>
//             <div class="laptop-racing-card-text laptop-racing-card-name">DNF</div>
//         </div>` : ``;

//         $(`[data-RacingPage="leaderboards"]`).find('.laptop-racing-card-container').append(DNFRacerElem);
//     });

//     if (!Race.Data.Started && !Race.Data.Waiting) {
//         setTimeout(() => { // 
//             LoadRaceEndStatistics(Race.Id);
//         }, 1500);
//     }
// }

// function GetFinishedRacers(Racers) {
//     let Finished = 0
//     Racers.forEach(function(Racer, Index) {
//         if (Racer.Finished) {
//             Finished = Finished + 1;
//         }
//     });
//     return Finished;
// }

// $(document).on('click', '.racing-button', function(e) {
//     e.preventDefault();
//     if ($(this).hasClass('selected') || $(this).hasClass('racing-createtrack')) return;

//     let Page = $(this).attr('data-RPage');
//     if (Page == CurrentPageRacing) return;

//     $(`.racing-${CurrentPageRacing}`).removeClass('selected');
//     $(this).addClass('selected');
//     $(`[data-RacingPage="${CurrentPageRacing}"]`).hide();
//     $(`[data-RacingPage="${Page}"]`).show();

//     ChangedPage(Page);

//     setTimeout(() => {
//         CurrentPageRacing = Page;
//     }, 100);
// });

// function SwitchPage(ToPage, FromPage) {
//     if (ToPage == FromPage) return;

//     $(`.racing-${FromPage}`).removeClass('selected');
//     $(`.racing-${ToPage}`).addClass('selected');
//     $(`[data-RacingPage="${FromPage}"]`).hide();
//     $(`[data-RacingPage="${ToPage}"]`).show();

//     ChangedPage(ToPage);

//     setTimeout(() => {
//         CurrentPageRacing = ToPage;
//     }, 100);
// }

// function ChangedPage(Page) {
//     if (Page == 'races') {
//         $(`.racing-leaderboards`).hide();
//         $(`.racing-leaderboards`).html("Best Times");
//         $('.laptop-racing-card-container-title').hide();
//         $(`[data-RacingPage="leaderboards"]`).find('.laptop-racing-card-container').empty();
//     } else if (Page == 'tracks') {
//         $(`.racing-leaderboards`).hide();
//         $(`.racing-leaderboards`).html("Best Times");
//         $('.laptop-racing-card-container-title').hide();
//         $(`[data-RacingPage="leaderboards"]`).find('.laptop-racing-card-container').empty();
//     } else if (Page == 'leaderboards') {
//     }
// }

// // Utils

// function SecondsTimeSpanToHMS(s) {
//     let h = Math.floor(s / 3600); // Get whole hours
//     s -= h * 3600; // Subtract hours from the total seconds
//     let m = Math.floor(s / 60); // Get whole minutes
//     s -= m * 60; // Subtract minutes from the total seconds
//     // Zero padding on minutes and seconds
//     return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s);
// }

// function GenerateUniqueRaceId() {
//     return new Promise((resolve, reject) => {
//         function CheckUniqueId() {
//             const id = Math.floor(Math.random() * 1000000000);
//             if (LaptopData.Racing.Data.Races.length === 0) {
//                 resolve(id);
//             } else {
//                 const isIdUnique = LaptopData.Racing.Data.Races.every((race) => race.Id !== id);
//                 if (isIdUnique) {
//                     resolve(id);
//                 } else {
//                     CheckUniqueId();
//                 }
//             }
//         }
//         CheckUniqueId();
//     });
// }
