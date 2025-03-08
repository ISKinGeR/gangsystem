// let CanClickJoin = true;
// let CanClickContract = true;
// let BoostingIntervals = [];

// LoadBoosting = async function() {
//     $('.boosting-meter').animate({width: `0%`}, 0);
//     $('.boosting-meter-left').text(''); $('.boosting-meter-right').text('');
//     $('.laptop-boosting').show();

//     $.post(`https://${ScriptNames}boosting/Laptop/Boosting/Get`, JSON.stringify({}), function(Data) {
//         LaptopData.Boosting.Data = Data.Data;
//         $('.boosting-meter').animate({width: `${LaptopData.Boosting.Data.Progress}%`}, 750);
//         $('.boosting-meter-left').text(LaptopData.Boosting.Data.CurrentClass); $('.boosting-meter-right').text(LaptopData.Boosting.Data.NextClass);
//     });
//     LoadedApps['Boosting'] = true;
// }

// // My Contracts

// UpdateBoostingMarket = function(Data) {
//     $('.laptop-boosting-card-shop-container').html('');
//     if (Data.length <= 0) {
//         return;
//     }

//     for (let i = 0; i < Data.length; i++) {
//         let MarketId = (i + 1);
//         let BoostingCard = `<div class="laptop-boosting-card" id="boosting-market-card-${MarketId}">
//             <div class="laptop-boosting-card-class">${Data[i].Class}</div>
//             <div class="laptop-boosting-card-text laptop-boosting-card-username">${Data[i].Nickname}</div>
//             <div class="laptop-boosting-card-text laptop-boosting-card-vehicle">${Data[i].Name}</div>
//             <div class="laptop-boosting-card-text laptop-boosting-card-buy">Buy In: ${Data[i].Price} ${Data[i].PriceType}</div>
//             <div class="laptop-boosting-card-text laptop-boosting-card-time">Expires In: <span style="color: green;">Loading...</span></div>
//             <div class="laptop-boosting-card-buttons">
//                 ${ LaptopData.MainData.CitizenId === Data[i].Owner ?  `<div class="laptop-boosting-card-button" data-Type="Remove">Remove Contract</div>` : '<div class="laptop-boosting-card-button" data-Type="Buy">Buy Contract</div>' }
                
//             </div>
//         </div>`;
//         $('.laptop-boosting-card-shop-container').append(BoostingCard);
//         $(`#boosting-market-card-${MarketId}`).data('BoostingData', Data[i]);
//         $(`#boosting-market-card-${MarketId}`).data('BoostingId', MarketId);
//         CountDown(Data[i].ExpireMins, $(`#boosting-market-card-${MarketId}`), true, MarketId);
//     }
// }

// AddBoostingCard = function(Data) {
//     let BoostingCard = `<div class="laptop-boosting-card" id="boosting-card-${Data.Id}">
//         <div class="laptop-boosting-card-class">${Data.Class}</div>
//         <div class="laptop-boosting-card-text laptop-boosting-card-vehicle">${Data.Name}</div>
//         <div class="laptop-boosting-card-text laptop-boosting-card-buy">Buy In: ${Data.Price} ${Data.PriceType}</div>
//         <div class="laptop-boosting-card-text laptop-boosting-card-time">Expires In: <span style="color: green;">Loading...</span></div>
//         <div class="laptop-boosting-card-buttons">
//             <div class="laptop-boosting-card-button" data-Type="Start">Start Contract</div>
//             <div class="laptop-boosting-card-button" data-Type="Transfer">Transfer Contract</div>
//             <div class="laptop-boosting-card-button" data-Type="Sell">Sell Contract</div>
//             <div class="laptop-boosting-card-button" data-Type="Decline">Decline Contract</div>
//         </div>
//     </div>`;
//     $('.laptop-boosting-card-container').append(BoostingCard);
//     $(`#boosting-card-${Data.Id}`).data('BoostingData', Data);
//     CountDown(Data.ExpireMins, $(`#boosting-card-${Data.Id}`));
// }

// RemoveBoostingCard = function(Id) {
//     $(`#boosting-card-${Id}`).remove();
// }

// RemoveMarketBoostingCard = function(Id) {
//     $(`#boosting-market-card-${Id}`).remove();
// }

// UpdateBoostingCard = function(Data) {
//     let BoostingCard = `<div class="laptop-boosting-card-class">${Data.Class}</div>
//                         <div class="laptop-boosting-card-text laptop-boosting-card-vehicle">${Data.Name}</div>
//                         <div class="laptop-boosting-card-text laptop-boosting-card-buy">${Data.IsActive ? "" : `Buy In: ${Data.Price} ${Data.PriceType}`}</div>
//                         <div class="laptop-boosting-card-text laptop-boosting-card-time"><span style="color: green;">Active</span></div>
//                         <div class="laptop-boosting-card-buttons">
//                             <div class="laptop-boosting-card-button" data-Type="${Data.IsActive ? "Stop" : "Start"}">${Data.IsActive ? "Stop" : "Start"} Contract</div>
//                             <div class="laptop-boosting-card-button ${Data.IsActive ? "disabled" : ""}" data-Type="Transfer">Transfer Contract</div>
//                             <div class="laptop-boosting-card-button ${Data.IsActive ? "disabled" : ""}" data-Type="Sell">Sell Contract</div>
//                             <div class="laptop-boosting-card-button ${Data.IsActive ? "disabled" : ""}" data-Type="Decline">Decline Contract</div>
//                         </div>`;
//     $(`#boosting-card-${Data.Id}`).html(BoostingCard);
//     $(`#boosting-card-${Data.Id}`).data('BoostingData', Data);
//     if (!Data.IsActive) {
//         CountDown(Data.ExpireMins, $(`#boosting-card-${Data.Id}`));
//     } else {
//         if (BoostingIntervals[Data.Id] != undefined && BoostingIntervals[Data.Id] != null) {
//             clearInterval(BoostingIntervals[Data.Id]);
//             BoostingIntervals[Data.Id] = null;
//             $(`#boosting-card-${Data.Id}`).find('.laptop-boosting-card-time').html(`<span style="color: green;">Active</span>`);
//         }
//     }
// }

// function CountDown(Minutes, Element, IsMarket, MarketId) {
//     let Time = new Date().getTime() + (Minutes * 60000);
//     let BoostingId = null;
//     if (IsMarket) {
//         BoostingId = "market-"+Element.attr('id').replace('boosting-market-card-', '')
//     } else {
//         BoostingId = Element.attr('id').replace('boosting-card-', '');
//     }
//     if (BoostingIntervals[BoostingId]) return;
//     BoostingIntervals[BoostingId] = setInterval(function() {
//         let Now = new Date().getTime();
//         let Distance = Time - Now;
//         let Hours = Math.floor((Distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         let Minutes = Math.floor((Distance % (1000 * 60 * 60)) / (1000 * 60));
//         let Seconds = Math.floor((Distance % (1000 * 60)) / 1000);
//         if (Distance < 0) {
//             clearInterval(BoostingIntervals[BoostingId]);
//             Element.find('.laptop-boosting-card-time').html(`Expires In: <span style="color: red;">Expired</span>`);
//             let ContractData = Element.data('BoostingData');
//             $.post(`https://${ScriptNames}boosting/Laptop/Boosting/Contract/Expire`, JSON.stringify({
//                 Id: IsMarket ? MarketId : ContractData.Id,
//                 IsMarket: IsMarket || false,
//             }));
//         } else {
//             Element.find('.laptop-boosting-card-time').html(`Expires In: <span style="color: ${GetExpireColor(Hours, Minutes, Seconds)}">${Hours}h ${Minutes}m ${Seconds}s</span>`);
//         }
//     }, 1000);
// }

// function ClearCountDown(Id) {
//     if (BoostingIntervals[Id] != undefined && BoostingIntervals[Id] != null) {
//         clearInterval(BoostingIntervals[Id]);
//         BoostingIntervals[Id] = null;
//     }
// }

// function GetExpireColor(Hours, Minutes, Seconds) {
//     if (Hours == 0 && Minutes <= 59 && Seconds <= 59) return 'red';
//     if (Hours <= 1 && Minutes <= 59 && Seconds <= 59) return 'orange';
//     if (Hours >= 3) return 'green';
//     return 'green';
// }

// // Click

// // Buttons

// $(document).on('click', '.laptop-boosting-card-button', function(e) {
//     e.preventDefault();
//     let BoostingData = $(this).parent().parent().data('BoostingData');
//     let BoostingId = $(this).parent().parent().data('BoostingId');
//     let ButtonType = $(this).attr('data-Type');

//     if (BoostingData == undefined) { return };
//     if (BoostingData.IsExpired) { return };

//     if (ButtonType == 'Start' && CanClickContract) {
//         CanClickContract = false;
//         $.post(`https://${ScriptNames}boosting/Laptop/Boosting/Contract/Accept`, JSON.stringify({
//             Id: BoostingData.Id
//         }), function (Accepted) {
//             if (Accepted == true) {
//                 ShowLaptopNotification('fas fa-car', 'Boosting', 'Contract', 'You successfully accepted the contract.', 2000);
//                 setTimeout(() => { CanClickContract = true; }, 500);
//             } else {
//                 ShowLaptopNotification('fas fa-car', 'Boosting', 'Contract', Accepted, 4000);
//                 setTimeout(() => { CanClickContract = true; }, 500);
//             }
//         });

//     } else if (ButtonType == 'Stop' && CanClickContract) {
//         CanClickContract = false;
//         $.post(`https://${ScriptNames}boosting/Laptop/Boosting/Contract/Cancel`, JSON.stringify({
//             Id: BoostingData.Id
//         }));
//         ShowLaptopNotification('fas fa-car', 'Boosting', 'Contract', 'You successfully canceled the contract.', 2000);
//         setTimeout(() => { CanClickContract = true; }, 500);
//     } else if (ButtonType == 'Decline' && CanClickContract) {
//         CanClickContract = false;
//         $.post(`https://${ScriptNames}boosting/Laptop/Boosting/Contract/Decline`, JSON.stringify({
//             Id: BoostingData.Id
//         }), function(Success) {
//             if (Success) {
//                 // ClearCountDown(BoostingData.Id);
//                 $.post(`https://${ScriptNames}boosting/Laptop/Boosting/ClearCountdown`, JSON.stringify({
//                     Id: BoostingData.Id
//                 }));
//                 ShowLaptopNotification('fas fa-car', 'Boosting', 'Contract', 'You successfully declined the contract.', 2000);
//                 $(`#boosting-card-${BoostingData.Id}`).remove();
//             }
//         });
//         setTimeout(() => { CanClickContract = true; }, 500);
//     } else if (ButtonType == 'Transfer' && CanClickContract) {
//         CanClickContract = false;
//         CreateLaptopModal({
//             Title: 'Transfer Contract',
//             Description: 'Fill in a state ID to transfer the contract to.',
//             Inputs: [
//                 {
//                     Type: 'number',
//                     Label: 'State ID',
//                     Placeholder: '1234',
//                 }
//             ]
//         }, function(Result) { // Submit
//             $.post(`https://${ScriptNames}boosting/Laptop/Boosting/Contract/Transfer`, JSON.stringify({
//                 Id: BoostingData.Id,
//                 StateId: Result.Inputs[0] || false,
//             }), function(Message) {
//                 if (Message) {
//                     Message = Message.toLowerCase();
//                     if (Message == 'player-not-found') {
//                         ShowLaptopNotification('fas fa-car', 'Boosting', 'Transfer', 'Something went wrong while trying to transfer your contract..', 4000);
//                         return;
//                     } else if (Message == 'target-not-found') {
//                         ShowLaptopNotification('fas fa-car', 'Boosting', 'Transfer', 'Target is not online or does not exist..', 4000);
//                         return;
//                     } else if (Message == 'target-not-in-class') {
//                         ShowLaptopNotification('fas fa-car', 'Boosting', 'Transfer', 'Target does not have the same class as the contract..', 4000);
//                         return;
//                     }
//                     $.post(`https://${ScriptNames}boosting/Laptop/Boosting/ClearCountdown`, JSON.stringify({
//                         Id: BoostingData.Id
//                     }));

//                     ShowLaptopNotification('fas fa-car', 'Boosting', 'Transfer', 'You successfully transfered your contract.', 4000);
//                     $(`#boosting-card-${BoostingData.Id}`).remove();
//                 }
//             });
//         }, function(Result) { // Cancel

//         })
//         setTimeout(() => { CanClickContract = true; }, 500);
//     } else if (ButtonType == 'Sell' && CanClickContract) {
//         CanClickContract = false;
//         $.post(`https://${ScriptNames}boosting/Laptop/Boosting/Contract/Sell`, JSON.stringify({
//             Id: BoostingData.Id
//         }), function(Message) {
//             if (Message) {
//                 Message = Message.toLowerCase();
//                 if (Message == 'player-not-found') {
//                     ShowLaptopNotification('fas fa-car', 'Boosting', 'Sell', 'Something went wrong while trying to sell your contract..', 4000);
//                     return;
//                 }

//                 $.post(`https://${ScriptNames}boosting/Laptop/Boosting/ClearCountdown`, JSON.stringify({
//                     Id: BoostingData.Id
//                 }));

//                 ShowLaptopNotification('fas fa-car', 'Boosting', 'Sell', 'You successfully put your contract on the market.', 4000);
//                 $(`#boosting-card-${BoostingData.Id}`).remove();
//             }
//         });
//         setTimeout(() => { CanClickContract = true; }, 500);
//     } else if (ButtonType == 'Buy' && CanClickContract) {
//         CanClickContract = false;
//         $.post(`https://${ScriptNames}boosting/Laptop/Boosting/Contract/Buy`, JSON.stringify({
//             Id: BoostingId
//         }), function(Message) {
//             if (Message) {
//                 Message = Message.toLowerCase();
//                 if (Message == 'player-not-found') {
//                     ShowLaptopNotification('fas fa-car', 'Boosting', 'Buy', 'Something went wrong while trying to buy this contract..', 4000);
//                     return;
//                 } else if (Message == 'contract-not-found') {
//                     ShowLaptopNotification('fas fa-car', 'Boosting', 'Buy', 'Contract not found, someone might already have bought it..', 4000);
//                     return;
//                 } else if (Message == 'not-enough-money') {
//                     ShowLaptopNotification('fas fa-car', 'Boosting', 'Buy', 'You don\'t have enough crypto to buy this contract..', 4000);
//                     return;
//                 } else if (Message == 'target-not-in-class') {
//                     ShowLaptopNotification('fas fa-car', 'Boosting', 'Transfer', 'You\'re class is too low..', 4000);
//                     return;
//                 }

//                 $.post(`https://${ScriptNames}boosting/Laptop/Boosting/ClearCountdown`, JSON.stringify({
//                     Id: "market-"+BoostingId
//                 }));

//                 ShowLaptopNotification('fas fa-car', 'Boosting', 'Buy', 'You successfully bought the contract from the market.', 4000);
//                 $(`#boosting-market-card-${BoostingId}`).remove();
//             }
//         });
//         setTimeout(() => { CanClickContract = true; }, 500);
//     } else if (ButtonType == 'Remove' && CanClickContract) {
//         CanClickContract = false;
//         $.post(`https://${ScriptNames}boosting/Laptop/Boosting/Contract/Remove`, JSON.stringify({
//             Id: BoostingId
//         }), function(Message) {
//             if (Message) {
//                 Message = Message.toLowerCase();
//                 if (Message == 'player-not-found') {
//                     ShowLaptopNotification('fas fa-car', 'Boosting', 'Removed', 'Something went wrong while trying to remove this contract..', 4000);
//                     return;
//                 } else if (Message == 'contract-not-found') {
//                     ShowLaptopNotification('fas fa-car', 'Boosting', 'Removed', 'Contract not found, someone might already have bought it..', 4000);
//                     return;
//                 }

//                 $.post(`https://${ScriptNames}boosting/Laptop/Boosting/ClearCountdown`, JSON.stringify({
//                     Id: "market-"+BoostingId
//                 }));

//                 ShowLaptopNotification('fas fa-car', 'Boosting', 'Removed', 'You successfully removed the contract from the market.', 4000);
//                 $(`#boosting-market-card-${BoostingId}`).remove();
//             }
//         });
//         setTimeout(() => { CanClickContract = true; }, 500);
//     }
// });

// $(document).on('click', '.boosting-queue', function(e) {
//     e.preventDefault();
//     let Type = $(this).data('type');
//     if (Type === 'Join' && CanClickJoin) {
//         CanClickJoin = false;
//         $.post(`https://${ScriptNames}boosting/Laptop/Boosting/Join`, JSON.stringify({}), function(Success) {
//             if (Success) {
//                 $('.boosting-queue').data('type', 'Leave')
//                 $('.boosting-queue').text('Leave Queue');
//                 ShowLaptopNotification('fas fa-car', 'Boosting', 'Joined Queue', 'You joined the queue.', 4000);
//             } else {
//                 ShowLaptopNotification('fas fa-car', 'Boosting', 'Queue Failed', 'Not enough cops to join the queue..', 4000);
//             }
//         });
//         setTimeout(function() { CanClickJoin = true; }, 500);
//     } else if (Type === 'Leave' && CanClickJoin) {
//         CanClickJoin = false;
//         $('.boosting-queue').text('Join Queue');
//         $('.boosting-queue').data('type', 'Join')
//         $.post(`https://${ScriptNames}boosting/Laptop/Boosting/Leave`, JSON.stringify({}));
//         ShowLaptopNotification('fas fa-car', 'Boosting', 'Left Queue', 'You left the queue.', 4000);
//         setTimeout(function() { CanClickJoin = true; }, 500);
//     }
// });

// // Pages

// let CurrentPage = "contracts";
// $(document).on('click', '.boosting-button', function(e) {
//     e.preventDefault();
//     if ($(this).hasClass('selected') || $(this).hasClass('boosting-queue')) return;

//     let Page = $(this).attr('data-Page');
//     if (Page == CurrentPage) return;

//     $(`.boosting-${CurrentPage}`).removeClass('selected');
//     $(this).addClass('selected');
//     $(`[data-BoostingPage="${CurrentPage}"]`).hide();
//     $(`[data-BoostingPage="${Page}"]`).show();

//     ChangedPage(Page);

//     setTimeout(() => {
//         CurrentPage = Page;
//     }, 100);
// });

// function ChangedPage(Page) {
//     if (Page == 'market') {
//         // TODO: Load Market Contracts
//     }
// }