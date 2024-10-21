"use strict"

const screenElem = document.querySelector(".screen");
const numberOfKeysElem = document.getElementById("number-of-keys");
const screenBlackElem = document.getElementById("screen-blocker");
const textScreenElem = document.getElementById('text-screen');
const introButtonElem = document.getElementById("intro-button");
const instructionButtonElem = document.getElementById("instruction-button");
const startUpTextElem = document.getElementById("start-up-text");
const headingTextElem = document.getElementById("intro-heading");
const introTextElem = document.getElementById("intro-text");
const instructionTextBoxElem = document.getElementById("instruction-text-box");
const openingStoryTextElem = document.getElementById("opening-story-text");
const inputBarEnter = document.getElementById("input-bar");
const gameMainTextElem = document.getElementById("rest-of-game-text");
const gameTextPrimaryOptionsElem = document.getElementById('game-text-primary-options');
const gameTextSecondaryOptionsElem = document.getElementById('game-text-secondary-options');
const gameTextLookElem = document.getElementById('game-text-look');
const gameMainStoryOptionElem = document.getElementById('game-main-text-option');
const numberGameQuestionMark = document.getElementById('number-game-question-mark');
const addHiddenClassTo = (element)  => element.classList.add("hidden");
const removeHiddenClassFrom = (element)  => element.classList.remove("hidden");
const changeBackgroundImage = () => screenElem.style.backgroundImage = rooms[displayPlayersRoom].image;
const playSound = (audio) => new Audio(`Sounds/${audio}.mp3`);
const introAudio = playSound("Intro");
const clickAudio = playSound("Click");
const memoryAudio = playSound("Boop");
const winAudio = playSound("Victory");
const gameAudio = playSound("MedievalEminem");
const randomNumber = (number) => Math.floor(Math.random() * number);
const randomSecretNumber = randomNumber(21);
let randomRiddle = randomNumber(9);
let playersChoice;
let displayPlayersRoom = playerState.currentRoom;
let hasFateOfEldoriaBegun = false;
let hasFateOfEldoriaFinished = false;
let isRoomActivityInProgress = false;
let hasGameStateChanged = false;
textScreenElem.addEventListener('scroll', updateScrollIndicators);

function offOnButton() {
    const switchElem = document.querySelector(".slider");

    switchElem.addEventListener("click", function(){
        if (!hasFateOfEldoriaBegun) changeToNextGameState();

        numberOfKeysElem.innerHTML = `🗝️${playerState.keyPieces}`;
        hasFateOfEldoriaBegun = true;

        if (screenBlackElem.classList.contains("screen-background-black")) {
            switchElem.style.cursor = "not-allowed";
            /* playSound("Opening").play(); */
            removeHiddenClassFrom(startUpTextElem);
            
            setTimeout(() => {
                screenBlackElem.classList.remove("screen-background-black");
                screenBlackElem.style.zIndex = -5;
                switchElem.style.cursor = "pointer";
                addHiddenClassTo(startUpTextElem);
            }, 0);
            
        } else {
            screenBlackElem.classList.add("screen-background-black");
            screenBlackElem.style.zIndex = 10;
            introAudio.pause();
            gameAudio.pause();
            playSound("GameWin").pause();
        }
    })
}
offOnButton();

function musicAndRestartButton() {
    const restartButtonElem = document.getElementById("restart-button");
    const style = document.createElement('style');
    const musicButtonElem = document.getElementById("music-button");

    restartButtonElem.addEventListener("dblclick", function() {                 // Restart Button
        if (screenBlackElem.classList.contains("screen-background-black")) return;
        
        style.innerHTML = `*{cursor: wait !important;}`;
        document.head.appendChild(style);
        introAudio.pause();
        gameAudio.pause();
        playSound("Restart").play();
        setTimeout(() => {
            location.reload();
        }, 14000);
    })    

    musicButtonElem.addEventListener("click", function() {                      // Music Button
        if (screenBlackElem.classList.contains("screen-background-black")) return;  

        if (displayPlayersRoom === "Beginning" || displayPlayersRoom === "Instruction" || displayPlayersRoom === "Intro") return;                

        gameAudio.paused ? gameAudio.play() : gameAudio.pause();
    })
}
musicAndRestartButton();

function allGameButtons() {
    const inputButton = document.getElementById("input-bar-button");
    const storyTextAsButton = document.getElementById("story-text-as-button");

    inputButton.addEventListener("click", inputButtonEvent);               // 'Make a choice' button
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            inputButtonEvent();
        }
    })            
        
    function inputButtonEvent() {
        const choiceSavedValue = inputBarEnter.value.toLowerCase();
        const currentRoom = rooms[displayPlayersRoom];
        let isChoiceValid = false;
        playersChoice = choiceSavedValue;
        inputBarEnter.value = "";

        if (playersChoice != "") textScreenElem.scrollTop = 0;
        if (screenBlackElem.classList.contains("screen-background-black")) return;
        if (hasFateOfEldoriaFinished) return;

        switch (playersChoice) {
            case "allkeys":
                playerState.keyPieces = 3;
                numberOfKeysElem.innerHTML = `🗝️${playerState.keyPieces}`;
                break;
            case "fightboss":
                displayPlayersRoom = "CastleDoor";
                changeToNextGameState();
                break;
            case "playguess":                                                             /* Game Cheats */
                displayPlayersRoom = "Pier";
                changeToNextGameState();
                break;
            case "playdice":
                displayPlayersRoom = "CaveEnd";
                changeToNextGameState();
                break;
            case "playmemory":
                displayPlayersRoom = "Ruins";
                changeToNextGameState();
                break;
            case "recapgame":
                displayPlayersRoom = "CastleRoom";
                changeToNextGameState();
                break;
        }

        allRoomActivities();

        if (isRoomActivityInProgress) return;

        for (const direction of Object.keys(currentRoom.directions)) {
            const validChoices = [direction, "look", "story"]

            if (validChoices.includes(choiceSavedValue)) {
                isChoiceValid = true;
                break;
            }
        }

        if (!isChoiceValid) return;

        hasGameStateChanged = false;
        clickAudio.play();
        rooms["HotSpring"].checkPoisonCondition();
        displayCurrentArea();
    }

    introButtonElem.addEventListener("click", function() {              // 'Click to start' button
        displayPlayersRoom = "Instruction";
        changeToNextGameState();
    })

    instructionButtonElem.addEventListener("click", function() {        // 'Play button'
        displayPlayersRoom = "Intro";
        introAudio.play();
        changeToNextGameState();
    })

    storyTextAsButton.addEventListener("click", function() {            // 'Story-text' button
        displayPlayersRoom = "Village";
        introAudio.pause();
        gameAudio.play();
        changeToNextGameState();
    })
}
allGameButtons();

function displayCurrentArea() {
    const currentRoom = rooms[displayPlayersRoom];
    const displayAreaStoryText = currentRoom.areaStoryDescription;
    const displayAreaMainText = currentRoom.areaMainDescription;
    const displayLookText = currentRoom.areaLookDescription;
    let listAllOptions = "";

    if (playersChoice != "") textScreenElem.scrollTop = 0;

    switch (displayPlayersRoom) {
        case "Beginning":
            removeHiddenClassFrom(headingTextElem);
            removeHiddenClassFrom(introTextElem);
            removeHiddenClassFrom(introButtonElem);
            return;
        case "Instruction":
            removeHiddenClassFrom(instructionButtonElem);
            removeHiddenClassFrom(instructionTextBoxElem);
            return;
        case "Intro":
            removeHiddenClassFrom(openingStoryTextElem);
            return;
        default:
            removeHiddenClassFrom(gameMainTextElem);
            removeHiddenClassFrom(gameTextPrimaryOptionsElem);
            removeHiddenClassFrom(gameTextLookElem);
            removeHiddenClassFrom(numberOfKeysElem);
            break;
    }

    function checkBrokenBridgeLogic() {
        const displayAreaStoryTextExt = currentRoom.areaStoryDescriptionExt;
        const displayAreaMainTextExt = currentRoom.areaMainDescriptionExt;
        const displayLookTextExt = currentRoom.areaLookDescriptionExt;
        const isBrokenBridgeFixed = displayPlayersRoom === "BrokenBridge" && rooms["BrokenBridge"].isAreaActivityFinished;
    
        if (!currentRoom.hasAreaBeenVisited) {
            isBrokenBridgeFixed ? gameMainTextElem.innerHTML = displayAreaStoryTextExt : gameMainTextElem.innerHTML = displayAreaStoryText;
            currentRoom.hasAreaBeenVisited = true;
        } else {
            isBrokenBridgeFixed ? gameMainTextElem.innerHTML = displayAreaMainTextExt : gameMainTextElem.innerHTML = displayAreaMainText;
            removeHiddenClassFrom(gameMainStoryOptionElem);
        }
        
        if (playersChoice === "look") {
            isBrokenBridgeFixed ? gameMainTextElem.innerHTML = displayLookTextExt : gameMainTextElem.innerHTML = displayLookText;
            addHiddenClassTo(gameTextLookElem);
        }

        if (playersChoice === "story") {    // Original story will always be shown instead
            gameMainTextElem.innerHTML = displayAreaStoryText;
            addHiddenClassTo(gameMainStoryOptionElem);
        }
    }
    checkBrokenBridgeLogic();
    
    rooms["CastleBoss"].finalBossDisplayLogic();
    rooms["StoneHouse"].caveTrapDoorTravel();

    for (const [option, nextRoom] of Object.entries(currentRoom.directions)) {
        listAllOptions += `<br> ${option} <br>`;

        if (playersChoice === option && !hasGameStateChanged) {
            displayPlayersRoom = nextRoom;
            hasGameStateChanged = true;
            changeToNextGameState();
            return;
        }
    }
    gameTextPrimaryOptionsElem.innerHTML = listAllOptions;
}

function hideAllText() {
    addHiddenClassTo(startUpTextElem);
    addHiddenClassTo(introTextElem);
    addHiddenClassTo(headingTextElem);
    addHiddenClassTo(introButtonElem);
    addHiddenClassTo(instructionButtonElem);
    addHiddenClassTo(instructionTextBoxElem);
    addHiddenClassTo(openingStoryTextElem);
    addHiddenClassTo(gameMainTextElem);
    addHiddenClassTo(gameTextPrimaryOptionsElem);
    addHiddenClassTo(gameTextSecondaryOptionsElem);
    addHiddenClassTo(gameTextLookElem);
    addHiddenClassTo(gameMainStoryOptionElem);
    addHiddenClassTo(numberGameQuestionMark);
}

function changeToNextGameState() {
    hideAllText();
    changeBackgroundImage();
    displayCurrentArea();
}

function showMainGameElems() {
    removeHiddenClassFrom(gameTextLookElem);
    removeHiddenClassFrom(gameTextPrimaryOptionsElem);
    removeHiddenClassFrom(gameMainStoryOptionElem);
}

function hideMainGameElems() {
    addHiddenClassTo(gameTextLookElem);
    addHiddenClassTo(gameTextPrimaryOptionsElem);
    addHiddenClassTo(gameMainStoryOptionElem);
}

function allRoomActivities() {
    const validRooms = ["Pier", "RiverHouse", "StoneHouse", "HiddenHut", "AbandonedBuilding", "CaveTrick", "CaveCenter", "CaveEnd", "Forest", "HotSpring", "Field", "MagicPath", "MagicHouse", "Sphinx", "BoneChapel", "MysteryTown", "Ruins", "Castle", "CastleLibrary", "CastleChapel", "CastleDeath", "CastleRoom", "CastleBedroom"];
    
    if (validRooms.includes(displayPlayersRoom)) clickAudio.play();
    
    const roomActions = {
        "Tavern": clueTavern,
        "Pier": playGuessGamePier,
        "RiverHouse": clueRiverHouse,
        "StoneHouse": clueStoneHouse,
        "HiddenHut": clueHiddenHut,
        "AbandonedBuilding": clueAbandonedBuilding,
        "CaveTrick": clueCaveTrick,
        "CaveCenter": clueCaveCenter,
        "CaveEnd": playDiceGameCaveEnd,
        "Forest": clueForest,
        "HotSpring": clueHotSpring,
        "Field": clueField,
        "MagicPath": clueMagicPath,
        "Sphinx": playRiddleAnswersSphinx,
        "MagicHouse": clueMagicHouse,
        "BoneChurch": clueBoneChurch,
        "MysteryTown": clueMysteryTown,
        "Ruins": playMemoryGameRuins,
        "Castle": clueCastle,
        "CastleLibrary": clueCastleLibrary,
        "CastleChapel": clueCastleChapel,
        "CastleDeath": clueCastleDeath,
        "CastleRoom": clueCastleRoom,
        "CastleBedroom": clueCastleBedroom, 
        "CastleBoss": playFinalGameBoss
    };
    
    if (roomActions[displayPlayersRoom]) {
        roomActions[displayPlayersRoom]();
    }
}

function playerDeath() {
    gameAudio.pause();
    playSound("Death").play();
    removeHiddenClassFrom(gameTextSecondaryOptionsElem);
    hideMainGameElems();
    hasFateOfEldoriaFinished = true;
    textScreenElem.style.backdropFilter = "unset";
    gameMainTextElem.style.fontFamily = "ringFont";
    gameMainTextElem.style.color = "red";
    gameMainTextElem.style.letterSpacing = "3px";
    screenElem.style.backgroundImage = "url('Images/Death.jpg')";
    gameTextSecondaryOptionsElem.innerHTML = "<br>YOU HAVE FAILED<br><br>RESTART THE GAME";
}

function clueTavern() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You find yourself in the dimly lit tavern. The bartender gives you a knowing nod as your eyes meet, a silent acknowledgment of your shared secret. You can not help but feel a flicker of gratitude for the information he entrusted to you about Melkors castle - Minas Ithil, lying at the very northern edge of Eldoria.<br><br> The memory of his words lingers, reminding you of the journey that still awaits.<br><br>- To the East, is the end of the Old Village. <br><br>- To the West, is the main center of the Old Village.";
        return;
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>speak<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "speak":
            gameMainTextElem.innerHTML = 'You approach the bartender cautiously, seeking any scraps of knowledge that might aid you on your journey. Careful not to reveal too much, trust is a rare currency in these parts, so you tread lightly with your words. The bartender eyes you curiously before leaning in closer.<br><br> "<em>I might have something that could help</em>" he murmurs, "<em>but first, a question for you. What was the name of the dark wizard who was sealed away all those years ago?</em>" His gaze is steady, testing your knowledge.';
            addHiddenClassTo(gameTextSecondaryOptionsElem);            
            break;
        case "melkor":
            gameMainTextElem.innerHTML = '"<em>Correct!</em>" the bartender nods, a sly smile creeping onto his face. It seems he knew more about you than he let on, but needed to be sure you were not an imposter. Leaning in closer, he shares a secret known to only a few.<br><br> "<em>Melkors castle - Minas Ithil, lies far to the North, beyond the reach of most. But heed my warning traveler. Do not rush there blindly. You will need to assemble the Bloodless Key before the gates will yield to you.</em>" His heavy voice carries a weight that lingers, letting the implications sink in. You thank the stranger and proceed with your journey.';
            currentRoom.isAreaActivityFinished = true;
            break;
    }
}

function playGuessGamePier() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        addHiddenClassTo(numberGameQuestionMark);
        currentRoom.areaLookDescription = "You are standing on a weathered Pier, listening to the sound of old creaking boats and the slow mundane toil of the fisherman. The haunting husks of the fisherman are still paralysed in the same position you left them.<br><br>- The Old Village lies to the North.";
        return;
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>Speak<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "speak":
            gameMainTextElem.innerHTML = '"<em>Hello, stranger. I see you overheard our little commotion. We found this trinket on our last journey. None of us knows what it is, but we are debating whether it is something valuable... Hmmm how about a little game? It will definitely help us pass the time on such a slow day like today</em>."<br><br> These fishermen do not realize what they possess, a piece of the Bloodless Key! The elders have shown you enough scrolls to recognize the keys fragments, and this one bears an uncanny resemblance. Still, something about these men feels off. The timing, the situation, it is all too convenient. But you need all the pieces, no matter the cost.';
            gameTextSecondaryOptionsElem.innerHTML = "<br>Play game<br>";
            break;
        case "play game":
            gameMainTextElem.innerHTML = '"<em>The game is simple—a guessing game! I will choose a random number between 1 and 20, and you have five chances to guess it correctly. After each guess, I will tell you if you are too high or too low. Guess the number within five tries, and the trinket is yours. Only valid guesses count, of course.<br><br> Simple enough! Let us know when you are ready to begin.</em>" It does not seem like you have much of a choice. And curiously, they have neglected to mention what happens if you lose the game...';
            gameTextSecondaryOptionsElem.innerHTML = "<br>Ready<br>";
            break;
        case "ready":
            numberGameQuestionMark.innerHTML = "?";
            isRoomActivityInProgress = true;
            addHiddenClassTo(gameMainStoryOptionElem);
            addHiddenClassTo(gameTextPrimaryOptionsElem);
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            removeHiddenClassFrom(numberGameQuestionMark);
    }

    if (!isRoomActivityInProgress) return;
    
    if (isNaN(playersChoice) || playersChoice < 1 || playersChoice > 20) {
            return gameMainTextElem.innerHTML = "Your guess must only be between 1 and 20";
        }

    if (playersChoice == randomSecretNumber) {
        gameMainTextElem.innerHTML = "Correct! You have guessed the number and won the piece of the key! The men stare at you, their expressions hollow, as if all life had drained from them in an instant. They appear as though they are only empty husks, animated by some dark magic.<br><br> You have won, but it is clear now, you would not have left this place alive if you had lost that seemingly harmless game. Time to get the hell out of here.";
        numberGameQuestionMark.innerHTML = randomSecretNumber;
        playerState.keyPieces += 1;
        numberOfKeysElem.innerHTML = `🗝️${playerState.keyPieces}`;
        isRoomActivityInProgress = false;
        currentRoom.isAreaActivityFinished = true;
        winAudio.play();
        showMainGameElems();
        return;
    }
    else {
        gameMainTextElem.innerHTML = playersChoice > randomSecretNumber ? `Your number is too High!` : `Your number is too Low!`;
        currentRoom.guessGameScore--;
    }

    if (currentRoom.guessGameScore === 0 && !currentRoom.lives) {
        numberGameQuestionMark.innerHTML = randomSecretNumber;
        gameMainTextElem.innerHTML = "NO!! The moment your final chance slips away from you, the men suddenly attack you with sheer evil brutality. Their faces twist into near-demonic grins as they tear into you with their bare hands. Slowly ripping out each organ, cruelly savouring the bloody disembowelment. Before you can grasp what is happening, the light fades in a torrent of blood and viscera. Melkors evil is far more cruel than you ever imagined...";
        isRoomActivityInProgress = false;
        playerDeath();
        return;
    } else if (currentRoom.guessGameScore === 0) {
        gameMainTextElem.innerHTML = "You could not guess the correct number... But they will give you one last chance to try.";
        gameTextSecondaryOptionsElem.innerHTML = "<br>Ready<br>";
        currentRoom.guessGameScore = 5;
        currentRoom.lives = false;
        isRoomActivityInProgress = false;
        removeHiddenClassFrom(gameTextSecondaryOptionsElem);
        addHiddenClassTo(numberGameQuestionMark);
        return;
    }
}

function clueRiverHouse() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You are standing inside the River House, with the river flowing gently outside. You have already found the letter mentioning the Pier off the Village, there is nothing else of value here.<br><br> - To the West heads back along the River.";
        return;
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>bookshelf<br><br>chairs<br><br>papers<br><br>table<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "bookshelf":
            gameMainTextElem.innerHTML = "You slide the bookshelf forward. Hoping for a secret passage behind it proved to be too optimistic.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>chairs<br><br>papers<br><br>table<br>";
            break;
        case "chairs":
            gameMainTextElem.innerHTML = "You lift a stack of chairs off of one another but they were not conceling anything underneath.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>bookshelf<br><br>papers<br><br>table<br>";
            break;
        case "papers":
            gameMainTextElem.innerHTML = "You quickly read through a small stained stack of papers. They all relate to magic in some form but nothing that you can apply to your siutation.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>bookshelf<br><br>chairs<br><br>table<br>";
            break;
        case "table":
            gameMainTextElem.innerHTML = "You shove the table out of the way. Lying on the floor is an old letter, presumably to the owner of the house based on its seal.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>Read note<br>";
            break;
        case "read note":
            gameMainTextElem.innerHTML = "It is mostly torn up and degraded from age but you can just make out a small part of it - `I understand why you said the Pier off the Old Village is a place we should check, there is indeed something of magic origin there but still I could not find `, the rest of the note is gone. It would seem that the Pier might be worth a look.";
            currentRoom.isAreaActivityFinished = true;
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            removeHiddenClassFrom(gameTextLookElem);
            break;
    }
}

function clueStoneHouse() {
    const currentRoom = rooms[displayPlayersRoom]; 
    
    if (currentRoom.isAreaActivityFinished && !rooms.CaveEnd.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You are currently back in the deserted house, there is no indication that the person that was here earlier has returned at all, I doubt I will find them here again.<br><br> - To the East is a River.<br><br> - To the South is a Forest.<br><br> - To the West is an Abandoned Building.";
        return;
    } else if (currentRoom.isAreaActivityFinished && rooms.CaveEnd.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You are back in the deserted Stone House. The young woman is gone, vanishing as swiftly as she appeared. There is no sign she was ever here. But now, you at least have the knowledge that west of the Forest lies the Hot Springs, which are capable of curing any poison but that  you should also be quick if you have been poisoned.<br><br> - To the East is a River.<br><br> - To the South is the Forest.<br><br> - To the West is an Abandoned Building.";
        return;
    } else if (rooms.CaveEnd.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You are currently in the deserted Stone House. There is a young womans lifeless body in the middle of the house. You can not help but wonder who she is and what she has to do with all of this. She is still holding the note that explains to find the Hot Springs west of the Forest to cure any poison but that you should also be quick if you have been poisoned.<br><br> - To the East is the River.<br><br> - To the South is the Forest I need to get to.<br><br> - To the West is an Abandoned Building.";
        return;
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>search<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "search":
            gameMainTextElem.innerHTML = "As you cautiously move through the rooms, a sudden crash from the next room jolts you. The sharp bang sets your heart racing, every sense now on high alert to the potential danger.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>check<br>";
            isRoomActivityInProgress = true;
            addHiddenClassTo(gameMainStoryOptionElem);
            addHiddenClassTo(gameTextPrimaryOptionsElem);
            break;
        case "check":
            gameMainTextElem.innerHTML = "You creep toward the next room, heart pounding in your chest. As you round the corner, a blinding flash explodes before you, throwing your senses into chaos. You can feel someones presence nearby, but the disarray leaves you unable to confirm it.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>look around<br>";
            break;
        case "look around":
            gameMainTextElem.innerHTML = "You wait for the ringing in your ears to fade and the blinding light to clear. Glancing around, you find the room empty, save for a few pieces of old furniture. Someone was just here, but whether they are a threat remains unclear. With Melkors cunning, trust cannot be relied on.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>drawers<br><br>notes<br><br>carpet<br><br>leave<br>";
            break;
        case "carpet":
            gameMainTextElem.innerHTML = "You lift the carpet, hoping to find a hidden trap-door or secret passage, but your search turns up nothing.";
            currentRoom.check1 = true;
            gameTextSecondaryOptionsElem.innerHTML = "<br>drawers<br><br>notes<br><br>leave<br>";
            break;
        case "drawers":
            gameMainTextElem.innerHTML = "You search through each drawer in the house, but find nothing of value.";
            currentRoom.check2 = true;
            gameTextSecondaryOptionsElem.innerHTML = "<br>notes<br><br>carpet<br><br>leave<br>";
            break;
        case "notes":
            gameMainTextElem.innerHTML = "You sift through every scrap of paper you can find, but it's futile, nothing is of any value anymore.";
            currentRoom.check3 = true;
            gameTextSecondaryOptionsElem.innerHTML = "<br>drawers<br><br>carpet<br><br>leave<br>";
            break;
        case "leave":
            if (!(currentRoom.check1 && currentRoom.check2 && currentRoom.check3)) {
                gameMainTextElem.innerHTML = "You still have more potential places to check for clues in the house.";
                break;
            }

            gameMainTextElem.innerHTML = "You scour the room for any clue about the mysterious figure, but find nothing. There's no trace of where they went or how they vanished so quickly. Either they destroyed any evidence or left none at all. The only certainty is that someone out there does not want to be found...";
            isRoomActivityInProgress = false;
            currentRoom.isAreaActivityFinished = true;
            showMainGameElems();
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }
}

function clueHiddenHut() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You are in the Hidden Hut in the forest. The mysterious words, 'hkpf oqwpvckp, hkpf urjkpz...', remain scrawled on the wall, along with the small carving beneath: 'Each letter is two far ahead, bring them back.' Hopefully, this decryption will lead to something useful.<br><br> - To the North of here is an Abandoned Building.<br><br> - To the East is back deep into the Forest.<br><br> - To the West lies the Hot Springs.";
        return;
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>enter<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "enter":
            gameMainTextElem.innerHTML = "You step into the hut and immediately notice writing on the wall. Though it appears to have been etched in haste, you can still make out the message.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>read wall<br>";
            break;
        case "read wall":
            gameMainTextElem.innerHTML = "hkpf oqwpvckp, hkpf urjkpz... <br><br> The words seem nonsensical at first glance. There must be something around here that can help you decipher them.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>look around<br>";
            break;
        case "look around":
            gameMainTextElem.innerHTML = "You examine the small hut and find a barely legible carving beneath the words. It reads: 'Each letter is two far ahead, bring them back.' This is your only clue to solving the mystery - hkpf oqwpvckp, hkpf urjkpz...";
            currentRoom.isAreaActivityFinished = true;
            removeHiddenClassFrom(gameTextLookElem);
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }
}

function clueAbandonedBuilding() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished && currentRoom.isAreaActivityExtraFinished) {
        currentRoom.areaLookDescription = "You return to the Abandoned Building near the hidden cave system. The maps are still sprawled out on the table as you left them.<br><br> Glancing over the note you took with you once more, the warning about the cave chamber, with the small statue, chills you to the core. Never even listen to the statue, for it will force you to choose a path and either one will lead to your certain demise.<br><br> - To the East from here is the Stone House.<br><br> - To the South a path to the Hidden Hut.<br><br> - To the West is the Secret Path to the Cave.";
        return;
    } else if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You have returned to the Abandoned Building near to the hidden cave system. You were not able to figure out the danger that the explorers stumbled upon in that cave. You will have to risk the journey regardless.<br><br> - To the East from here is the Stone House.<br><br> - To the South a path to the Hidden Hut.<br><br> - To the West is the Secret Path to the Cave.";
        return;
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>read maps<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "read maps":
            gameMainTextElem.innerHTML = "You examine the maps more closely. They reveal a secret path to the west, discovered by explorers a long time ago. Further down, the writing suddenly becomes erratic, describing a chamber that splits into two seperate paths. The details become too jumbled to decipher.<br><br> You know of a spell that could make the writing legible again, but it carries a 50% risk of destroying the text entirely.<br><br>You must decide: take the risk now and use your spell or return later when you find another guarenteed method to read the maps.";
            addHiddenClassTo(gameMainStoryOptionElem);
            addHiddenClassTo(gameTextPrimaryOptionsElem);
            isRoomActivityInProgress = true;
            currentRoom.hasAreaMapBeenFound = true;
            gameTextSecondaryOptionsElem.innerHTML = "<br>use spell<br><br>return<br>";
            break;
        case "use spell":
            currentRoom.hasAreaMapBeenFound = false;
            gameMainTextElem.innerHTML = "";
            playSound("Magic").play();
            hideMainGameElems();
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            setTimeout(() => {
                if (randomSecretNumber > 10) {
                    gameMainTextElem.innerHTML = "Your spell succeeds! The jumbled words shift into neat, legible writing:<br><br> 'We entered the cave, seeking its secrets and hoping for treasure after discovering the hidden path. It felt like an incredible find until we reached a chamber with a small, eerie statue at its center. The chamber split into two opposing paths, and as we approached, the statue spoke, saying only one of the paths were correct. One would lead to riches and knowledge, the other to a violent, bloody end. I suggested we leave the chamber, but my companions could not resist the lure of wealth and knowledge.<br><br> They drew sticks to decide who would choose. My first companion, drawn by fate, chose the right path. The moment he disappeared into the darkness, a blood-curdling scream echoed, followed by a torrent of blood. My second companion, now convinced the left path held the treasure, rushed in without hesitation. But the same scream and wave of blood followed! I realized it was a trap... Neither path was safe. It exists to punish the greedy and foolish alike. If you find yourself in this cursed chamber, leave immediately!!! Do not even listen to the statue - It forces you to choose. I fled as fast as I could, but something followed me from that chamber. I write this in hopes it will help someone else avoid thi…' The note abruptly ends as if the writer was caught mid-sentence.";
                    currentRoom.isAreaActivityExtraFinished = true;
                    currentRoom.didSpellSucceed = true;
                } else {
                    gameMainTextElem.innerHTML = "Your spell fails! The notes ignite, consumed by flames as you recite the incantation. The secret is lost forever, leaving you no choice but to face the caves dangers without the explorers warning.";
                    currentRoom.didSpellFail = true;
                }
                currentRoom.wasSpellUsed = true;
                isRoomActivityInProgress = false;
                currentRoom.isAreaActivityFinished = true;
                showMainGameElems();
            }, 5000);
            break;
        case "return":
            gameMainTextElem.innerHTML = "You decide to return later, after finding another way to read the warning without risking the destruction of the maps. You can always proceed to the cave system without further information on the danger ahead,";
            isRoomActivityInProgress = false;
            showMainGameElems();
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }
}

function clueCaveTrick() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You have ended up back in the strange part of the cave system. The statues hollow gaze is still fixed on you. On either side of the statue, the two paths are still there, waiting for your decision.<br><br> One of dark. One of light. The statue still trying to speak to you in its cold, dead voice.<br><br> - The only way out is to the South, leading you to the Cave's Second Chamber.<br><br> - To the left of you, a dark tunnel that leads to the unknown.<br><br> - To the right of you, a light tunnel that leads to the unknown.";
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>listen<br><br>go left<br><br>go right<br>";
            currentRoom.isAreaActivityFinished = true;
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "listen":
            gameMainTextElem.innerHTML = `You focus intently, straining to hear the statues words. Once your attention is fully on it, the message becomes crystal clear: "You have entered the Cavern of Judgment. Before you lie two paths. One of light and one of darkness.<br><br> One will lead you to untold riches and knowledge. The other will bring certain demise. Choose your path, and let fate decide your destiny." The path behind you has closed while the statue was talking... You have no choice now but to choose a path.`;
            isRoomActivityInProgress = true;
            gameTextSecondaryOptionsElem.innerHTML = "<br>go left<br><br>go right<br>";
            addHiddenClassTo(gameMainStoryOptionElem);
            addHiddenClassTo(gameTextPrimaryOptionsElem);
            break;
        case "go left":
        case "go right":
            gameMainTextElem.innerHTML = "You step confidently down the path, convinced you have chosen correctly. But as you cross the threshold, a horrifying swarm of demonic creatures seizes you. They tear into you with such ferocity that you can not even muster a scream before your body is ripped apart, exploding into bone and gore. Your blood flowing like a river out of the cave. The final thing you hear, is the statue laughing maniacally. The malevolent tricks of this land have proven too overwhelming for your incompetent mind to understand.";
            playerDeath();
            break;
    }
}

function clueCaveCenter() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You stand in the center of the cave, surrounded by glowing crystals and the towering obelisk at its heart. You have seen the image from the obelisk and its suggestion of a talking tree in the deep of the Forest.<br><br> - To the North goes back up to the Cave's second chamber.<br><br> - To the East lies the caves deepest point.";
        return;
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>obelisk<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "obelisk":
            gameMainTextElem.innerHTML = "You place a hand on the obelisk, and a faint image forms. Its the forest outside of your village. Strangely, you see yourself speaking to one of the trees. The vision fades, and you are left staring at the obelisk once more. That was unexpected. You have never even heard of talking trees before, but it might be worth investigating if you find yourself in that area again.";
            currentRoom.isAreaActivityFinished = true;
            removeHiddenClassFrom(gameTextLookElem);
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }
}

function playDiceGameCaveEnd() {
    if (rooms["CaveEnd"].hasDiceGameStarted) return;

    const currentRoom = rooms[displayPlayersRoom];
    const diceImage = document.querySelector('.dice');
    const diceGameRollButton = document.getElementById('dice-game-button-roll');
    const diceGameHoldButton = document.getElementById('dice-game-button-hold');
    const diceGameNumberTemp = document.getElementById('dice-game-temp-number');
    const diceGameNumberPerm = document.getElementById('dice-game-perm-number');
    const diceGameRollCount = document.getElementById('dice-game-roll-count');
    const diceGameHoldCount = document.getElementById('dice-game-hold-count');
    let totalSavedScore = 0;
    let tempScore = 0;
    let rollClick = 45;
    let holdClick = 10;
    
    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You have returned to the very end of the cave system. The dragon pedastel sits in the same imposing spot. You think back to your trial of resolve. It very nearly claimed your life, but you were able to prevail and claim another piece of the bloodless key!.<br><br> - To the west of here is the Caves Center.<br><br> - To the south is a trap door, unsure of where it leads.";
        return;
    }

    function toggleNumberGameHiddenClasses() {
        gameMainTextElem.classList.toggle("hidden");
        diceImage.classList.toggle("hidden");
        diceGameRollButton.classList.toggle("hidden");
        diceGameHoldButton.classList.toggle("hidden");
        diceGameNumberTemp.classList.toggle("hidden");
        diceGameNumberPerm.classList.toggle("hidden");
        diceGameRollCount.classList.toggle("hidden");
        diceGameHoldCount.classList.toggle("hidden");
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>sith<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "sith":
            gameMainTextElem.innerHTML = "The dragon emits a soft, vibrating hum that quickly grows in intensity. The sound eventually becoming so powerful that you fear for your hearing. You shut your eyes, bracing for the worst, then just as suddenly as it began, the sound stops.<br><br> When you open your eyes, the dragon is silent, and sitting on the pedestal is a small stone tablet, seemingly materialized from nowhere.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>tablet<br>";
            break;
        case "tablet":
            gameMainTextElem.innerHTML = "Test your resolve... Can you keep your nerve?<br> Here are the instructions for the test: <br><br>Click 'ROLL' to roll a dice between 1 and 6.<br><br> Each roll is added to your temporary score on the left (in green).<br><br> But beware - If you ever roll a 1, you will lose all the temporary points saved up so far.<br><br> Click 'HOLD' to SAVE your temporary points to your permanent score on the right (in red).<br><br> In order to pass the test, you need to reach a permanent score of 100 (in red).<br><br> The catch, is that you can only roll the dice 45 times and you can only hold your score 10 times.<br><br> Counters are below each button to keep track of your remaining rolls and holds.<br><br> If either counter reaches 0, the test is over and you will fail.<br><br> You will be given only one extra chance should you fail...<br><br>Can you survive a battle with yourself?";
            gameTextSecondaryOptionsElem.innerHTML = "<br>start<br>";
            isRoomActivityInProgress = true;
            diceGameRollButton.addEventListener("click", roll);
            diceGameHoldButton.addEventListener("click", hold);
            hideMainGameElems();
            break;
        case "start":
            currentRoom.hasDiceGameStarted = true;
            toggleNumberGameHiddenClasses();
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }

    if (!isRoomActivityInProgress) return;
    
    function resetPoints() {
        tempScore = 0;
        diceGameNumberTemp.innerHTML = tempScore;
    }

    function checkGameState() {
        if (currentRoom.rollGameLives) {
            gameMainTextElem.innerHTML = "You were unable to pass the trial. You have your final attempt remaining.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>start test<br>";
            totalSavedScore = 0;
            tempScore = 0;
            rollClick = 45;
            holdClick = 10;
            diceGameNumberTemp.innerHTML = tempScore;
            diceGameNumberPerm.innerHTML = totalSavedScore;
            diceGameRollCount.innerHTML = rollClick;
            diceGameHoldCount.innerHTML = holdClick;
            currentRoom.rollGameLives = false;
            currentRoom.hasDiceGameStarted = false;
            isRoomActivityInProgress = false;
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            toggleNumberGameHiddenClasses();
            return;
        } else {
            gameMainTextElem.innerHTML = "You have run out again and failed the trial. As it ends, the dragon pedestal begins to tremble again, but this time with a terrifying, overwhelming power. The sound is so intense it completely shatters your eardrums. Your entire body is shaken so violently, your organs liquefying under the relentless force. You are blended from the inside out. Reduced to nothing more than a soft, puddle of mass. A gruesome warning left for anyone daring enough to attempt the dragons trial again and fail...";
            toggleNumberGameHiddenClasses();
            playerDeath();
            return;
        }
    }

    function roll() {
        let randomDice = randomNumber(6);
        diceImage.src = `Images/dice-${randomDice}.png`;
        rollClick--;
        diceGameRollCount.innerHTML = rollClick;

        if (randomDice === 0) {
            resetPoints();
        } else {
            tempScore += randomDice + 1;
            diceGameNumberTemp.innerHTML = tempScore; 
        }

        if (rollClick < 0) checkGameState();
    }

    function hold() {
        totalSavedScore += tempScore;
        diceGameNumberPerm.innerHTML = totalSavedScore;
        holdClick--;
        diceGameHoldCount.innerHTML = holdClick;
        resetPoints();

        if (holdClick < 0) checkGameState();
   
        if (totalSavedScore >= 100) {
            gameMainTextElem.innerHTML = "You have passed the test! As soon as you reach the required score, the dragon pedestal starts to hum again, but this time without its earlier menace. Smoke rises slowly from the base of the dragon, and suddenly, you spot the piece of the Bloodless Key lying in the center.<br><br> Just as you grab it, a horrifying realization strikes. The smoke from the pedastel is not just regular smoke, but poison! Your vision begins to blur, a sickly green haze overtaking your senses, and a sinister laugh echoes through the chamber. You passed the trial, but it seems Melkor has sabotaged the pedestal, ensuring your failure regardless.<br><br> Panic sets in until you notice a trap door on the floor that might have an answer. You have no idea where it leads, but time is running out. There is no choice left. Safe or not, you must act.";
            currentRoom.directions["trap door"] = "StoneHouse";
            gameTextPrimaryOptionsElem.innerHTML = "<br>west<br><br>trap door<br>";
            gameMainTextElem.style.color = "green";
            playerState.isPoisoned = true;
            isRoomActivityInProgress = false;
            currentRoom.hasDiceGameStarted = false;
            currentRoom.isAreaActivityFinished = true;
            playerState.keyPieces += 1;
            numberOfKeysElem.innerHTML = `🗝️${playerState.keyPieces}`;
            winAudio.play();
            showMainGameElems();
            toggleNumberGameHiddenClasses();
        }
    }
}

function clueForest() {
    const currentRoom = rooms[displayPlayersRoom];

    if (!rooms.CaveCenter.isAreaActivityFinished) return;

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You continue to explore the dense forest, the strange encounter with the talking tree still lingering in your thoughts. This land holds many oddities, but a tree speaking to you was not one you anticipated.<br><br> - To the North is the Stone House.<br><br> - To the East is an Old Village.<br><br> - To the South is the Dirt Path leading back to your village.<br><br> - To the West is a Hidden Hut.";
        return;
    } else if (rooms.CaveCenter.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You are exploring the dense forest, the image from the obelisk still vivid in your mind. Before you, stands the tree you saw yourself speaking to, yet it appears to be nothing more than an ordinary tree.<br><br> - To the North is a Stone House.<br><br> - To the East is an Old Village.<br><br> - To the South is a Dirt Path leading back to your village.<br><br> - To the West is a carefully Hidden Hut.";
    }
    
    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>talk to tree<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "talk to tree":
            gameMainTextElem.innerHTML = `You approach the tree from the obelisk's vision, not expecting much. But suddenly, the tree opens its ancient eyes and says, "<em>Beyond the broken stone bridge lies a place of great power. Without the bridge, it can only be reached from the north. Find the Valley of Cherry Blossoms; there, a root of evil guards the path to the Mysterious Town. Uncover its secrets, and you will find the great Ruins.</em>" The tree falls silent, returning to its sentinel stillness. You try asking more questions, but it remains unresponsive.`;
            currentRoom.isAreaActivityFinished = true;
            removeHiddenClassFrom(gameTextLookElem);
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }
}

function clueHotSpring() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You stand by the Hot Springs, the gentle steam rising from the water in delicate wisps. The water has healed your poisoning. You can always return, if your health is in mortal danger again.<br><br> - The surrounding area is serene, with only the path to the Hidden Hut to the East.";
        return;
    }

    if (!playerState.isPoisoned) return;

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>heal<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "heal":
            gameMainTextElem.innerHTML = "You lie down in the water, feeling its energy seep into your body, slowly purging the evils and poisons that had taken hold. What once felt like the edge of death is now fading, replaced by a surge of life rushing back through you. Strength returns to your limbs, and with it, a sense of renewed vitality. The healing waters are truly miraculous.";
            gameMainTextElem.style.color = "white";
            playerState.isPoisoned = false;
            currentRoom.isAreaActivityFinished = true;
            removeHiddenClassFrom(gameTextLookElem);
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }
}

function clueField() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished && currentRoom.isAreaActivityExtraFinished) {
        currentRoom.areaLookDescription = "You find yourself back in the open field, with no trace of the horrifying child from before. The unsettling memory lingers, casting a shadow over your steps. As you move through the field, you remain on edge, ever watchful for the childs sudden, chilling return.<br><br> - To the North is a Magic Path.<br><br> - To the South is the River.";
        return;
    } else if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You return to the open field, with no trace of the child. Doubt lingers over your choice to leave them, but your mission is too important to dwell on. You press on, focused on the path ahead.<br><br> - To the North is a Magic Path.<br><br> - To the South is the River.";
        return;
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>call<br>";
            hideMainGameElems();
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
            case "call":
            isRoomActivityInProgress = true;
            gameMainTextElem.innerHTML = "You call out to the figure, but there is no response. It remains still, its back turned to you, unmoving.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>walk<br>";
            hideMainGameElems();
            break;
        case "walk":
            gameMainTextElem.innerHTML = "You approach the figure and find it is just a small child, no older than five or six. It is odd to be alone in such a place. Perhaps they have become separated from their family, lost amid the darkness that has plagued these lands, alone and terrified.<br><br>You need to decide whether to help the child, or not take the risk and move on.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>help<br><br>leave<br>";
            break;
        case "leave":
            gameMainTextElem.innerHTML = "You decide the risk is too great and turn to leave, unsure if it was the right choice. The uncertainty lingers, but your training has taught you to trust your instincts. Sometimes, doing nothing is the wisest path. You continue your journey, moving cautiously forward while trying to push the potential encounter out of your mind.";
            isRoomActivityInProgress = false;
            currentRoom.isAreaActivityFinished = true;
            showMainGameElems();
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
        case "help":
            gameMainTextElem.innerHTML = "You place your hand on the child's shoulder and gently turn them around. Your blood turns to ice as you come face-to-face with hollow, empty eye sockets staring back at you. A ghastly, blood-streaked smile of jagged teeth sends a shiver down your spine. The child staring at you with a deathly stillness.<br><br> As you stagger back in shock, the child lunges at you, clawing at your face like a wild rabid beast. You fall back, fighting desperately, but suddenly when you look around, the field is completely empty. Shaken and disoriented, you realize it must have been a nightmarish illusion. It seems Melkor is somehow always watching, always scheming.";
            isRoomActivityInProgress = false;
            currentRoom.isAreaActivityFinished = true;
            currentRoom.isAreaActivityExtraFinished = true;
            showMainGameElems();
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }
}

function clueMagicPath() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished && currentRoom.isAreaActivityExtraFinished) {
        currentRoom.areaLookDescription = "You continue along the Magic Path, where the flowers and trees create an incredible mix of purple hues, more vibrant than anything you have ever seen. The woman is at her usual spot, softly humming the same sad tune.<br><br> She has already gifted you with the vision of the path to the cave system and the incredible power that resides at the end of it. She has also helped recreate your damaged texts, you have no more need of her help. Though her identity remains a mystery, something about her presence feels peaceful, you know you are safe here.<br><br> - To the North are the Mountains.<br><br> - to the East is the House of Magic - and South is back to the open Field.";
        return;
    } else if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You are back along the Magic Path, the colours are still more vibrant than anything you have seen. The woman is still there, softly humming the same sad tune. She has already showed you the path to the cave system and the incredible power that resides at the end of it.<br><br> She is able to restore any damaged texts that you may have. Though her identity remains a mystery, something about her presence feels peaceful, you sense no immediate threat at least.<br><br> - To the North are the Mountains.<br><br> - to the East is the House of Magic - and South is back to the open Field.";
    }

    switch (playersChoice) {
        case "look":
            if (currentRoom.isAreaActivityFinished) {
                gameTextSecondaryOptionsElem.innerHTML = "<br>restore texts<br>";
                removeHiddenClassFrom(gameTextSecondaryOptionsElem);
                break;
            }

            gameTextSecondaryOptionsElem.innerHTML = "<br>find woman<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "find woman":
            gameMainTextElem.innerHTML = "You follow the woman's soft, melancholic hum. The tune is unfamiliar, yet beautiful in its simplicity. As you weave through the trees, you finally come upon a clearing. An old woman sits by a small fire, her head bowed, seemingly lost in her own world, humming in a near-trance like state. She has not noticed your presence yet.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>speak<br>";
            break;
        case "speak":
            gameMainTextElem.innerHTML = "The woman slowly raises her head, her eyes meeting yours briefly. You brace for any sign of danger, but she continues her sorrowful tune, undisturbed. Suddenly, a vivid vision floods your mind. You see a Secret Path hidden within an Abandoned Building to the south-west, leading to a vast cave system. There is something of incredible power at the very end of it.<br><br> In the vision, you also glimpse the old womans magical ability to perfectly restore any damaged texts, a skill that could prove invaluable if the need arises. Just as quickly as the vision came, it fades, and you find yourself back in the clearing. The womans head is bowed once again, her melancholic hum still drifting through the enchanted woods.";
            currentRoom.isAreaActivityFinished = true;
            gameTextSecondaryOptionsElem.innerHTML = "<br>restore texts<br>";
            break;
        case "restore texts":
            if (!rooms.AbandonedBuilding.hasAreaMapBeenFound) {
                gameMainTextElem.innerHTML = "You have no damaged texts to have the woman restore.";
                removeHiddenClassFrom(gameTextLookElem);
                addHiddenClassTo(gameTextSecondaryOptionsElem);
                break;
            } 

            gameMainTextElem.innerHTML = "The woman glances up at you once more, her figure faintly glowing with a soft purple hue. Without warning, the faded and illegible texts in your possession begin to shift. Before your eyes, the words on the maps realign and become perfectly clear, as if newly written -<br><br> 'We entered the cave, seeking its secrets and hoping for treasure after discovering the hidden path. It felt like an incredible find until we reached a chamber with a small, eerie statue at its center. The chamber split into two opposing paths, and as we approached, the statue spoke, saying only one of the paths were correct. One would lead to riches and knowledge, the other to a violent, bloody end.<br><br> I suggested we leave the chamber, but my companions could not resist the lure of wealth and knowledge. They drew sticks to decide who would choose. My first companion, drawn by fate, chose the right path. The moment he disappeared into the darkness, a blood-curdling scream echoed, followed by a torrent of blood. My second companion, now convinced the left path held the treasure, rushed in without hesitation.<br><br> But the same scream and wave of blood followed! I realized it was a trap... Neither path was safe. It exists to punish the greedy and foolish alike. If you find yourself in this cursed chamber, leave immediately!!! Do not even listen to the statue - It forces you to choose. I fled as fast as I could, but something followed me from that chamber. I write this in hopes it will help someone else avoid thi…' The note abruptly ends as if the writer was caught mid-sentence.";
            rooms.AbandonedBuilding.isAreaActivityFinished = true;
            rooms.AbandonedBuilding.isAreaActivityExtraFinished = true;
            currentRoom.isAreaActivityExtraFinished = true;
            removeHiddenClassFrom(gameTextLookElem);
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }
} 

function playRiddleAnswersSphinx() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You stand before the Sphinx, its imposing figure dominating the landscape. You have completed all of the Sphinxs riddles and learned the location of all three pieces of the Bloodless Key. There is nothing left for you here. You should not stay here any longer than you need to.";
        return;
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>speak<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);

            if (currentRoom.firstRiddleComplete) {
                currentRoom.areaLookDescription = 'You are again standing before the great Sphinx. "<em>You have returned. Do you want to continue?</em>"';
                gameTextSecondaryOptionsElem.innerHTML = "<br>Riddles<br>";
            }
            break;
        case "speak":
            gameMainTextElem.innerHTML = 'The Sphinx remains still, but its voice seems to eminate from everywhere at once, as if it is one with the world around you. The sound is both cold and robotic, yet somehow warm and soothing. A contradiction impossible to decipher, leaving you unsure whether it is friend or foe. Its words are slow, deliberate, and monosyllabic:<br><br> "<em>I know who you are. I know why you are here. I know what you seek. I know where they are. I know your desire to know.</em>"';
            gameTextSecondaryOptionsElem.innerHTML = "<br>find keys<br>";
            break;
        case "find keys":
            gameMainTextElem.innerHTML = '"<em>I can tell you. But riddles must be answered. Truths figured out. Three sets of riddles. Three riddles per set. Four options per riddle. You must answer all, once a set is started. If two are answered correctly. Location is given. If two are answered incorrectly... There are no second chances. You must decide if it is worth the risk. Speak riddles to begin.</em>"';
            gameTextSecondaryOptionsElem.innerHTML = "";
            break;
        case "riddles":
            isRoomActivityInProgress = true;
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            hideMainGameElems();
            startSphinxRiddles();
            break;
    }

    if (!isRoomActivityInProgress) return;

    function prepareNextRiddleSet() {
        gameTextSecondaryOptionsElem.innerHTML = "<br>Go";
        isRoomActivityInProgress = true;
        currentRoom.secondRiddleComplete === false ? currentRoom.secondRiddleComplete = true : currentRoom.allRiddlesComplete = true;
        currentRoom.correctSphinxAnswers = 0;
        currentRoom.totalSphinxQuestions = 3;
    }

    function updateNextRiddle() {      
        gameTextSecondaryOptionsElem.innerHTML = "<br>Go";
        riddles[randomRiddle].hasBeenAnswered = true;
        currentRoom.totalSphinxQuestions > 0 ? currentRoom.totalSphinxQuestions-- : currentRoom.totalSphinxQuestions;
        updateRiddleRandomNumber();
    }

    function updateRiddleRandomNumber() {
        if (!riddles[randomRiddle].hasBeenAnswered) return;
        else {
            randomRiddle = randomNumber(13);
            updateRiddleRandomNumber();
        }
    }

    function startSphinxRiddles() {
        if (currentRoom.secondRiddleComplete) {
            gameMainTextElem.innerHTML = "<em>Prepare. The final set of riddles.</em>";
            prepareNextRiddleSet();
        } else if (currentRoom.firstRiddleComplete) {
            gameMainTextElem.innerHTML = "<em>Prepare. The second set of riddles.</em>";
            prepareNextRiddleSet();
        } else {
            currentRoom.firstRiddleComplete = true;
            gameMainTextElem.innerHTML = riddles[randomRiddle].question;
            gameTextSecondaryOptionsElem.innerHTML = riddles[randomRiddle].answerChoices;
        }
    }

    if (playersChoice === riddles[randomRiddle].correctAnswer) {
        gameMainTextElem.innerHTML = "<em>YOU ARE CORRECT</em>";
        currentRoom.correctSphinxAnswers++;
        updateNextRiddle();
    } else {
        for (const answer of riddles[randomRiddle].wrongAnswers) {
            if (playersChoice === answer) {
                gameMainTextElem.innerHTML = "<em>YOU ARE INCORRECT</em>";
                updateNextRiddle();
                break;
            } 
        }
    }

    if (playersChoice === "go") {
        gameMainTextElem.innerHTML = riddles[randomRiddle].question;
        gameTextSecondaryOptionsElem.innerHTML = riddles[randomRiddle].answerChoices;

        if (currentRoom.totalSphinxQuestions === 0 && currentRoom.correctSphinxAnswers >= 2 && currentRoom.allRiddlesComplete === true) {
            gameMainTextElem.innerHTML = "<em>You have answered all questions. You are succesful. You have earned the final location « East are Cherry Blossoms. North of them. A Church of Death. Follow the Valley past the Castle. As far as you can go. The great Ruins have what you seek » I have nothing more to give. Your journey must continue.</em>";

            isRoomActivityInProgress = false;
            currentRoom.isAreaActivityFinished = true;
            winAudio.play();
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            removeHiddenClassFrom(gameTextPrimaryOptionsElem);
            removeHiddenClassFrom(gameTextLookElem);
            return;
        } else if (currentRoom.totalSphinxQuestions === 0 && currentRoom.correctSphinxAnswers >= 2) {
            
            if (currentRoom.firstRiddleComplete === true) gameMainTextElem.innerHTML = "<em>You have answered three questions. You are succesful. You have earned a location « South is a River. West of it. An Abandoned Building. Through it. A secret Cave system. Find what you seek at the end » Return for the next set and location. Or begin now.</em>";
            
            if (currentRoom.secondRiddleComplete === true) gameMainTextElem.innerHTML = "<em>You have answered three questions. You are succesful. You have earned a location « South is an Old Village. Through the Tavern. There is a Pier. The water hides what you seek » Return for the final set and location. Or begin now.</em>";
            
            gameTextSecondaryOptionsElem.innerHTML = "<br>Riddles"
            isRoomActivityInProgress = false;
            winAudio.play();
            removeHiddenClassFrom(gameTextPrimaryOptionsElem);
            removeHiddenClassFrom(gameTextLookElem);
            return;
        } else if (currentRoom.totalSphinxQuestions === 0) {
            playerDeath();
            gameMainTextElem.innerHTML = "You have failed to answer at least two riddles correctly, just as the Sphinx warned. Its cold, unblinking sapphire gaze pierces through you and in an instant, your body becomes immobile. You feel the weight of an unseen force dragging you inward, spiraling into an abyss within your own mind. The further you fall, the more distant reality becomes.<br><br> As you forever sink deeper, the world will continue on, slowly falling into chaos. You are now a prisoner, locked in an endless descent. Forever witnessing everything unravel around you. Endlessly screaming, but no sound escapes. No one hears. No one ever will. An eternity of silence, where neither death nor freedom a possibility. You will never be free. You will never die.";
            return;
        }
    }
}

function clueMagicHouse() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityExtraFinished) {
        currentRoom.areaLookDescription = "You are back inside the House of Magic, where the shattered remains of the strange jar still lie on the floor. You had tried to break it open, but the protection spell ensured that force would only destroy its contents. There is nothing more the House of Magic can offer you now.<br><br>- To the North are the Cherry Blossoms valley. <br><br>- To the West is the Magic Path.";
        return;
    } else if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You find yourself back inside the House of Magic. You have taken the strange jar you found with you, in the hopes it can be opened elsewhere. The House is in the same state as you left it.<br><br>- To the North are the Cherry Blossoms valley. <br><br>- To the West is the Magic Path.";
        return;
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>take jar<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "take jar":
            gameMainTextElem.innerHTML = "You pick up the strange jar. Though you can not quite make out what is inside, it radiates an unmistakable magic. There is no clear way to open it, and something within seems to resist your attempts to lift the lid. You need to uncover what makes this jar so special, but the only way is to open it.<br><br> You can either try using magic to unlock it, attempt to break it, or keep it and hope to find another method.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>try magic<br><br>break jar<br><br>keep<br>";
            hideMainGameElems();
            break;
        case "try magic":
            gameMainTextElem.innerHTML = "You place the jar on a table, carefully drawing an incantation circle around it. Gathering the necessary herbs and powders from the jars nearby, you prepare for the spell. With the correct book in hand, you begin to recite the incantation... but nothing happens. The jar remains unchanged, unaffected by the magic.";
            break;
        case "break jar":
            gameMainTextElem.innerHTML = "Deciding it is not worth the effort to find another way, you forcefully smash the jar against the floor. Instantly, a loud bang erupts and the room fills with thick, dark smoke. The jar had been protected by a powerful spell. One that destroyed its contents the moment force was used. Whatever was inside is now lost, scattered to the winds of time.";
            currentRoom.isAreaActivityExtraFinished = true;
            showMainGameElems();
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
        case "keep":
            gameMainTextElem.innerHTML = "You have decided to keep the jar and hope that you can find another method of opening it.";
            rooms["BoneChurch"].hasJar = true;
            currentRoom.isAreaActivityFinished = true;
            showMainGameElems();
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }
}

function clueBoneChurch() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You find yourself back at the ominous Bone Church. The strange jar from the House of Magic has revealed its clue - 'There is a mysterious town where no one lives. A village of ghosts and secrets. Follow the trail of blue flame that lingers there. The mixed up letters will reveal the answer to <em>enter the ruins</em>'. With the mages soul now freed, there is nothing left for you in this place of darkness. You can finally leave this realm of evil behind.";
        return;
    } else if (currentRoom.hasJar) currentRoom.areaLookDescription = "You stand before the Bone Church, its grim structure sending a chill through your bones. This place has claimed the souls of thousands, a nightmare stretching back beyond reckoning. The horror here is palpable. You are close to Melkors castle now. His presence hangs heavy in the air, almost as if looming over you.<br><br>- To the East is the dreaded Castle. <br><br>- To the South is the valley that heads back to the Cherry Blossoms.<br><br> The jar you took from the House of Magic has started to glow for some reason. You pull it out and try to peer inside, but once again, its contents remain hidden from view.";

    if (!currentRoom.hasJar) return;

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>open jar<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "open jar":
            gameMainTextElem.innerHTML = "You try to open the jar exactly as you did in the House of Magic, but this time, it opens effortlessly. As the lid comes off, letters materialize from thin air, swirling and forming words:<br><br> 'There is a mysterious town where no one lives. A village of ghosts and secrets. Follow the trail of blue flame that lingers there. The jumbled letters will reveal the answer to <em>enter the ruins</em>.'<br><br> The words fade, and suddenly the jar explodes in a brilliant flash of colorful light. The light shoots toward the Bone Church, then bursts through its roof and vanishes. It seems the mage who created the House of Magic was captured by Melkor, their soul imprisoned in the Bone Church. They left the jar, hoping that one day a hero would bring it here and free them from their eternal prison. It was fortunate you did not decide to break it! You have received the clue as a small reward and can now move on from here.";
            currentRoom.isAreaActivityFinished = true;
            removeHiddenClassFrom(gameTextLookElem);
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }
}

function clueMysteryTown() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You stand once more outside the great houses, the blue flames flickering in the icy wind. The path ahead, through the grand house and toward the ancient ruins, has been revealed to you. Yet, the portal remains, offering a one-way trip back to the House of Magic.<br><br>- To the north, the dead Valley.<br><br>- Down the tunnel leads to the ancient Ruins.<br><br>- The portal goes to the Magic House.";

        gameTextPrimaryOptionsElem.innerHTML = "<br>north<br><br>tunnel<br><br>portal<br>";
        return;
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>green<br><br>blue<br><br>red<br><br>purple<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "green":
        case "red":
        case "purple":
            gameMainTextElem.innerHTML = "You follow the flames all the way to the great house at the end of the trail. You walk inside yet cannot see anything of value at the current house at all. It might be worth following another trail.";
            break;
        case "blue":
            gameMainTextElem.innerHTML = "You follow the trail of blue flames to an enormous house, its sheer scale imposing. Despite your search, you can not even find a way inside. On the main door, two large words are etched, but they do not make much sense to you -<br><br> 'TERNE' and 'SRNUI.'<br><br> Nearby, a stone carving offers a clue: 'The words on the door, you did not account for. They are each a mess, so now take a guess. Fix each words order, for each letter you should reorder. Speak both words aloud and reveal the path true and proud.'<br><br> It seems you must solve this riddle to move forward and find out what the Mysterious Town is hiding.";
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
        case "enterruins":
        case "enter ruins":
            gameMainTextElem.innerHTML = "As you speak the words, a deep rumble shakes the ground, and the massive doors slowly swing open. You step inside, finding a tunnel that stretches far into the distance, disappearing into the mountainside. It seems to lead beyond the village, hidden for reasons long forgotten. There is a sense of powerful magic lingering nearby, urging you to explore further.<br><br> Before venturing down the tunnel, you notice a strange contraption. Next to it lies a scroll, apparently left by the mage who helped the villagers conceal this passage long ago. According to the scroll, the device is a portal machine the mage created to return to his House of Magic. Unfortunately, the machine was never perfected. It only works the one way. Once you use it, you cannot return the same way.";
            gameTextPrimaryOptionsElem.innerHTML = "<br>north<br><br>portal<br><br>tunnel<br>";
            currentRoom.directions["tunnel"] = "Ruins";
            currentRoom.directions["portal"] = "MagicHouse";
            currentRoom.isAreaActivityFinished = true;
            showMainGameElems();
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }
}

function playMemoryGameRuins() {
    const currentRoom = rooms[displayPlayersRoom];
    const buttonColours = ["red", "blue", "green", "yellow"];
    const memoryGameButtons = document.querySelectorAll(".memory-game-buttons");
    const memoryGameButtonsContainer = document.querySelector(".memory-game-container");

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You stand in the heart of the ancient Ruins, surrounded by the remnants of a once great civilization. After solving the mystery of the Ruins, you have claimed a piece of the Bloodless Key and a piece of its history -<br><br> This was a civilization of immense magic and power, known for their good deeds and strength in the world. They were a formidable obstacle to Melkors rise, so he sought to destroy them swiftly. Melkor devised a cunning plan to infiltrate the city with spies and tear it apart from within. But the ancient people discovered his intentions and destroyed the great Stone Bridge, severing the only access to their city from the outside world. The Norse-like village nearby aided them, concealing the city from prying eyes and from Melkors evil.<br><br> Despite their efforts, Melkor devised another plan. He deceived the mage who had also been helping conceal the city, luring him into a trap. With the mages unwitting betrayal, Melkor ripped the souls from every person in the city as well as the village that helped hide them. The mage, realizing too late that he had been tricked, had his soul stripped away as well. They have all been trapped in the Bone Church ever since, leaving empty desolate ruins in their place. Only Melkors defeat can finally end their suffering.<br><br>- To the North, the path back through to the Mysterious Town.<br><br>- To the South, cross the newly repaired Bridge.";
        return;
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>temple<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "temple":
            gameMainTextElem.innerHTML = "You step into the vast expanse of the great temple ruins, you can feel the weight of forgotten power. As you enter, a blinding light suddenly descends from a crystal embedded in the roof high above, casting harsh shadows that seem to shift and move. Instinctively, you brace for danger, uncertain of what traps might remain to guard the temples ancient treasures.<br><br> Suddenly, the light forms the image of an old man on the ground before you, his expression heavy with sorrow. He does not appear to pose a threat, yet there is something strange about him. Perhaps he is one of the long lost citizens of this forsaken place, bound to it by magic or memory.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>talk<br>";
            break;
        case "talk":
            gameMainTextElem.innerHTML = '"<em>I am the Grand Wizard of this temple. To gain access to our knowledge, you must undergo the Test of Purity. Only those pure of soul may attempt it, and only the purest among them can hope to pass. If you harbor any evil intentions toward this sacred place or its people, the full force of our magic will strike you down without mercy. Should you take the test and fail, you will share the same fate. For we cannot allow even the slightest risk of this temple falling into the hands of evil. Step into the light, and begin your Test of Purity - if you truly believe that you are pure of heart.</em>"';
            gameTextSecondaryOptionsElem.innerHTML = "<br>light<br>";
            break;
        case "light":
            gameMainTextElem.innerHTML = 'As you step toward the man, his figure begins to dissolve into a shimmering mist and suddenly the world around you vanishes. In an instant, you are engulfed in a realm of pure, blinding light. All sense of direction is lost. There is nothing but the white void stretching endlessly in every direction.<br><br> The silence is overwhelming, save for a voice echoing in your mind, deep and solemn. It is the voice of the man, though his presence is nowhere to be seen. "<em>This is the testing ground. If you seek the truth of this place, you must prove yourself worthy. Your test is one of memory. Four colors will manifest before you. Watch closely as each one flashes in sequence. When they finish, it will be your task to recall and click the order exactly as it was shown to you. You have but three chances to pass this test. Ten correct in a row are needed to prove that your heart is pure.<br><br> Should you fail… the consequences are dire. But should you succeed and the answers you seek shall be revealed… Good luck.</em>"'; 
            gameTextSecondaryOptionsElem.innerHTML = "<br>begin<br>";
            hideMainGameElems();
            break;
        case "begin":
            gameMainTextElem.innerHTML = "Speak 'go' when ready.<br><br>";
            gameTextSecondaryOptionsElem.innerHTML = "go<br>";
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            removeHiddenClassFrom(memoryGameButtonsContainer);
            addMemoryGameListeners();
            break;
        case "go":
            gameMainTextElem.innerHTML = "";
            gameTextSecondaryOptionsElem.innerHTML = `<br>0`;
            textScreenElem.style.backgroundColor = "";
            isRoomActivityInProgress = true;
            currentRoom.memoryGamePattern = [];
            currentRoom.memoryLevel = 0;
            nextSequence();
            break;
    }

    if (!isRoomActivityInProgress) return;

    function addMemoryGameListeners() {
        for (const color of memoryGameButtons) {
            color.addEventListener("click", function() {
                const userChosenColour = this.getAttribute("id");
                currentRoom.memoryUserClickedPattern.push(userChosenColour);
                playSound("Click").play();
                checkAnswer(currentRoom.memoryUserClickedPattern.length - 1);
            });
        }
    }
    
    function checkAnswer(currentLevel) {
        if (!isRoomActivityInProgress) return;

        if (currentRoom.memoryGamePattern[currentLevel] === currentRoom.memoryUserClickedPattern[currentLevel]) {
            if (currentRoom.memoryUserClickedPattern.length === currentRoom.memoryGamePattern.length){
                currentRoom.memoryLevel++;
                gameTextSecondaryOptionsElem.innerHTML = `<br>${currentRoom.memoryLevel}`;

                setTimeout(function () {
                    nextSequence();
                }, 1000);
            }
        } else {
            gameMainTextElem.innerHTML = "You have failed your attempt. Say 'go' to try again.<br>";
            gameTextSecondaryOptionsElem.innerHTML = `<br>0`;
            currentRoom.memoryGameChances--;
            isRoomActivityInProgress = false;
            screenElem.style.backgroundColor = "rgba(98, 0, 0, 0.386)";
            playSound("Fail").play();
        }

        if (currentRoom.memoryGameChances === 0) {
            gameMainTextElem.innerHTML = "You have lost your third attempt and failed the trial... Without warning, a blinding beam of light descends upon you, searing your body yet not your flesh. You are burning from within. The heat is unimaginable, so intense that your blood begins to boil almost instantly, turning to steam and escaping your body in a cloud of crimson mist. Within moments, your organs and muscles follow, vaporizing in the heat, dissolving into nothingness. Your body trembles under the unbearable pressure as your bones crack, your insides liquefying under the relentless light.<br><br> In one horrifying instant, your body can no longer withstand the strain. You erupt. Flesh, bone and vapor scatter in a grotesque explosion. The remnants of your form vaporizing into the air. The light has cleansed you, leaving nothing but the faint memory of your presence. You were not pure enough to pass the test, and now your very essence has been purified.";
            addHiddenClassTo(memoryGameButtonsContainer);
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            playerDeath();
            return;
        }

        if (currentRoom.memoryLevel === 10) {
            gameMainTextElem.innerHTML = '"<em>You have succeeded and passed the trial. Congratulations. You will now receive the truth about what happened here -<br><br> Our civilization was of immense magic and power, known for their good deeds and strength in the world. We were a formidable obstacle to Melkors rise, so he sought to destroy us. Melkor devised a cunning plan to infiltrate the city with his spies and tear it apart from within. But we had discovered his intentions and destroyed the great Stone Bridge, severing the only access to the city from the outside world. The village you had to gain access through, aided us in our time of need, concealing the city from prying eyes and from Melkors evil.<br><br> Despite our efforts, Melkor devised another plan. He deceived the mage who had also been helping us conceal the city, luring him into a trap. With the mages unwitting betrayal, Melkor ripped the souls from every citizen in the city as well as the people from the village that helped hide us. The mage, realizing too late that he had been tricked, had his soul stripped away as well.<br><br> All my people have been trapped in the Bone Church ever since, leaving these empty desolate ruins in their place. I was the only one spared this fate due to my spiritual attachment to this temple. Only Melkors defeat can finally end their suffering. I have this piece of the Bloodless Key, hidden safely away from Melkor. Please take it and help my people be free.</em>"<br><br> The man looks at you one final desperate time and slowly fades away, never to be seen again. You feel weary after learning of such tragedy, but you must push through for the sake of his people and all the rest.<br><br> You suddenly hear a sound and look up to see the great Stone Bridge has magically repaired itself! Now that the Ruins no longer need protection from the outside world, the path is freely open for everyone. You have another piece of the key! It is time to proceed with your journey.';
            gameTextPrimaryOptionsElem.innerHTML = "<br>north<br><br>south<br>"
            isRoomActivityInProgress = false;
            currentRoom.isAreaActivityFinished = true;
            playerState.keyPieces += 1;
            numberOfKeysElem.innerHTML = `🗝️${playerState.keyPieces}`;
            rooms["BrokenBridge"].isAreaActivityFinished = true;
            rooms["BrokenBridge"].directions["north"] = "Ruins";
            currentRoom.directions["south"] = "BrokenBridge";
            memoryAudio.pause();
            winAudio.play();
            showMainGameElems();
            addHiddenClassTo(memoryGameButtonsContainer);
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            return;
        }
    }

    function nextSequence() {
        let randomMemoryNumber = randomNumber(4);
        let randomChosenColour = buttonColours[randomMemoryNumber];

        if (!isRoomActivityInProgress) return;

        currentRoom.memoryUserClickedPattern = [];
        currentRoom.memoryGamePattern.push(randomChosenColour);

        currentRoom.memoryGamePattern.forEach((color, index) => {
            const colorElem = document.getElementById(`${color}`);

            setTimeout(() => {
                switch (color) {
                    case "blue": 
                        colorElem.style.backgroundColor = "rgb(0, 60, 255)";
                        break;
                    case "green": 
                        colorElem.style.backgroundColor = "rgb(2, 254, 2)";
                        break;
                    case "red": 
                        colorElem.style.backgroundColor = "rgb(255, 0, 0)";
                        break;
                    case "yellow": 
                        colorElem.style.backgroundColor = "rgb(255, 255, 0)";
                        break;
                }
                memoryAudio.play();

                setTimeout(() => {
                    colorElem.style.backgroundColor = "";
                }, 700); 

            }, 1200 * index);
        });
    }
}

function clueCastle() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You stand before the daunting Castle, its dark towers clawing at the sky. You have the Bloodless Key reassembled and are ready to enter Minas Ithil. Good luck.<br><br> - To the North is the Castle Entrance.<br><br> - To the South lies a desolate Valley.<br><br> - To the West, the Bone Church waits in silence.";
        return;
    }

    if (playerState.keyPieces === 3) {
        currentRoom.directions["north"] = "CastleEntrance";
        currentRoom.isAreaActivityFinished = true;
    }
}

function clueCastleLibrary() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You have returned to the Library within the Castle. The vastness of knowledge stored here is staggering, locked away from the world, unseen and unused for centuries.<br><br> Among the countless shelves, you found the book that seemed imbued with some magic, left by an unknown friend. You learned of Melkors secret, that he sacrificed all of his remaining minions to grant himself immortality but also inadvertently created a weapon needed to remove that immortality. It is hidden right here, in his own Castle, as he thought it would be safest.<br><br> The book directs you to the Chapel, where the weapon lies in a secret room beneath the altar. You must use the spell - 'Morgon' to reveal and descend the stairs to the secret room. There is also the warning - DO NOT attempt any other spells! He has placed a deathly curse on the altar that will activate if any spell, other than the intened one, is used.<br><br> Yet as you read on, your blood turned to ice. The remaining pages, hundreds of them, are filled with just one word, over and over, etched in desperation: Hurry. Hurry. Hurry.<br><br>- To the North is the Central Room. <br><br>- To the East is back to the Castles Entrance.";
        return;
    }

    switch (playersChoice) {
        case "look":
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            gameTextSecondaryOptionsElem.innerHTML = "<br>read book<br>";
            break;
        case "read book":
            gameMainTextElem.innerHTML = "You open the ancient tome and begin reading. The first few pages recount the history of Eldoria and include a few incantations, knowledge you have already gleaned from the elders.<br><br> However, as you read further, the handwriting shifts drastically. It becomes erratic, rushed, as if written in desperation. You learn a chilling truth: Melkor managed to remain alive, sealed behind the magical door, because of a blood spell. Before the ancient heroes trapped him, he sacrificed all his unwitting minions, granting himself immortality.<br><br> But the spell had an unintended consequence, it also created a single weapon capable of stripping away that immortality. Unable to destroy it, Melkor concealed the weapon in a secret room within the Castle, hidden beneath the altar in the Chapel. To reveal the hidden passage beneath the altar, you must use the spell 'Morgon' and descend the stairs. DO NOT attempt any other spells! He has placed a deathly curse on the altar that will activate if any spell other than the intened one is used.<br><br> As you reach the end of the passage, your blood runs cold. The handwriting becomes increasingly erratic. Hundreds of pages remain, each filled with a single word, repeated endlessly: Hurry. Hurry. Hurry.";
            currentRoom.isAreaActivityFinished = true;
            rooms["CastleChapel"].hasBookBeenFound = true;
            removeHiddenClassFrom(gameTextLookElem);
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }
}

function clueCastleChapel() {
    const currentRoom = rooms[displayPlayersRoom];

    if (rooms["CastleDeath"].isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You have returned to the Chapel, the altar already moved. Having descended into the depths of despair and retrieved the weapon, the final piece of your quest now lies before you... Confronting Melkor.<br><br>- To the South, back to the Corridor.";
        return;
    } else if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You have returned to the Chapel. With the correct spell whispered under your breath, the altar shifted aside, revealing a spiral staircase that descends into an abyss of despair and darkness. Feeling the weight of the evil you pause, yet you feel a flicker of hope. The weapon that may save everyone lies at the end of this treacherous path.<br><br> As you gaze down the staircase, shadows flicker at the edges of your vision and an unsettling chill runs down your spine. You take a deep breath, steeling your resolve. The journey ahead will be perilous, but with determination, you descend into the unknown, ready to confront whatever horrors await you in the depths below.<br><br>- To the South, the Corridor.<br><br>- The Stairs down to an unknown area of darkness.";
        return;
    }

    if (!currentRoom.hasBookBeenFound) return;

    switch (playersChoice) {
        case "look":
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            gameTextSecondaryOptionsElem.innerHTML = "<br>touch altar<br>";
            break;
        case "touch altar":
            gameMainTextElem.innerHTML = "You place your hands on the cold stone altar, but there is no immediate response. It sits silent, waiting for something more. Your mind races as you remember the book from the Library, the frantic handwriting revealing the truth about this place. Taking a deep breath, you steady yourself and prepare to speak the ancient word.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>Purgon<br><br>Morgom<br><br>Gorone<br><br>Morgon<br>";
            break;
        case "purgon":
        case "morgom":
        case "gorone":
            gameMainTextElem.innerHTML = "You have used the wrong spell on the altar... In an instant, the ground trembles beneath you, and sharp spikes erupt from the stone floor, piercing your body in a thousand different places. A scream escapes your lips, but it is quickly stifled by the agony as the spikes impale you.<br><br> Miraculously, you remain conscious, yet you feel your life force draining away. Your blood is drawn from your body, flowing into the altar as if it were a ravenous beast consuming its prey. With each passing second, your strength wanes and the world around you begins to fade. Finally, as your body becomes a mere dry husk, the spikes split violently, tearing your remains apart and scattering your lifeless pieces across the chapel like grotesque confetti.<br><br> You came so close to fulfilling your one mission, but in the end, a simple spell proved too great a challenge, and now all is lost.";
            playerDeath();
            break;
        case "morgon":
            gameMainTextElem.innerHTML = "You recite the spell, your voice echoing through the chapel, and the altar begins to shudder. Slowly, it slides out of place, revealing a spiral staircase that descends into an abyss of darkness.<br><br> You can not see the bottom, nor do you know how far it will take you, but there is no turning back now. The weapon is down there, and it is the only thing that can stop Melkor. No matter how deep or treacherous the path becomes, you are prepared for anything. You step forward, ready to face whatever horrors may await.";
            currentRoom.isAreaActivityFinished = true;
            currentRoom.directions["stairs"] = "CastleDeath";
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            removeHiddenClassFrom(gameTextLookElem);
            break;
    }
}

function clueCastleDeath() {
    const currentRoom = rooms[displayPlayersRoom];
    const countDownElem = document.getElementById("castle-death-counter");
    
    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You stand in the room of darkness beneath the altar, the weight of the dagger heavy in your hand. The blade gleams, a pure black stone that seems to absorb all light around it, exuding a quiet but undeniable power. The shadows in the room seem to watch as you prepare to leave, but you feel no fear now.<br><br> With the weapon in your possession, you turn toward the spiral staircase, ready to ascend back into the world above. Every step takes you closer to your final confrontation. There is no reason to return to this cursed place ever again. All that remains is to find Melkor and finish what you started.";
        return;
    }

    switch (playersChoice) {
        case "look":
            gameTextSecondaryOptionsElem.innerHTML = "<br>walk<br>";
            addHiddenClassTo(gameTextLookElem);
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            break;
        case "walk":
            gameMainTextElem.innerHTML = "You step cautiously toward the smoldering ash pile, the only object in the dark room beneath the altar. As you near it, the bat-like creatures, which had been circling around, suddenly shoot into the ash with an eerie swiftness. In an instant, a small cloud of smoke swirls up from the pile, rising and coalescing into a strange, shifting mass above. It hovers ominously, as if watching you, waiting for something. The air grows colder, and the room feels even heavier with the sense of something stirring within.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>touch<br>";
            break;
        case "touch":
            gameMainTextElem.innerHTML = "The cloud suddenly solidifies into a glowing timer counting down ominously! You must quickly find the next number in both patterns below and type the correct four-digit code in before the timer runs out. Hurry!<br><br>";
            isRoomActivityInProgress = true;
            delete rooms["CastleChapel"].directions["stairs"];
            addHiddenClassTo(gameTextPrimaryOptionsElem);
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            removeHiddenClassFrom(countDownElem);
            break;
    }

    if (isRoomActivityInProgress && !currentRoom.hasTimerStarted) {
        currentRoom.hasTimerStarted = true;
        for (let i = 180; i >= 0; i--) {
            setTimeout(() => {
                countDownElem.textContent = i;

                if (i === 0 && isRoomActivityInProgress) {
                    gameMainTextElem.innerHTML = "You failed to solve the puzzle before the timer ran out... As the last second vanishes, the air grows with malevolent energy and a deep, otherworldly screetch fills the room.<br><br> Suddenly, a surge of black demonic energy erupts from every corner, flooding the space faster than you can react. It wraps around you, suffocating and burning all at once, until your body is no longer your own. You feel your skin dissolving, muscles shredding, as if millions of tiny demons are gnawing at you from the inside, devouring your essence with unspeakable agony. Paralyzed, all you can do is scream, though even your voice is quickly consumed by the darkness.<br><br> You feel your mind slip, your thoughts fading into the sea of tortured souls that fill this cursed place. Their sorrow intertwines with yours as you lose your identity, your consciousness slowly sinking into the swirling void of despair. Your soul is now trapped, intertwined with countless others, forever lost in this demonic abyss. Never to escape. Never to find peace.";
                    playerDeath();
                } 
            }, (180 - i) * 1000);
        }
        gameMainStoryOptionElem.innerHTML = "1, 3, 4, 7, 11, 18, ...<br><br> 5, 15, 5, 18, 5, 22, 5, ...";
    }

    if (playersChoice === "2927" || playersChoice === "2729") {
        gameMainTextElem.innerHTML = "You have solved the puzzle just in time, halting the countdown!<br><br> For a few moments, silence grips the room, so heavy and absolute that you can hear your own heartbeat. Then, the ash pile in the center begins to stir and slowly, something rises from its smoldering depths. It is a dagger, but not just any dagger. Its blade is forged from a stone as black as the void, polished to an unnatural sheen. The air around it seems to hum with power, as if this weapon has been waiting centuries to be claimed.<br><br> You feel a surge of certainty... You have found it! This is the weapon, the one thing capable of stripping Melkor of his immortality and ending his reign of horror. There is no turning back now. It is time to confront him. Whatever lies ahead, you know that there is no reason to return to this forsaken place again. The final battle awaits.";
        gameMainStoryOptionElem.innerHTML = "<br>Story"
        rooms["CastleBedroom"].hasWeaponBeenFound = true;
        isRoomActivityInProgress = false;
        currentRoom.isAreaActivityFinished = true;
        showMainGameElems();
        addHiddenClassTo(countDownElem);
        addHiddenClassTo(gameMainStoryOptionElem);
    }
}

function clueCastleRoom() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You find yourself back in the Central Room of the Castle. As you gaze into the mirror-like orb, it reflects the entirety of your journey. The paths you have tread and the choices you have made. Each decision, whether for better or worse, has guided you to this moment, the climactic conclusion of your quest. Touch the orb if you wish to recap your journey again.<br><br>- To the East is a Corridor. <br><br>- To the South is the Library. <br><br>- To the West is the main Bedroom.";
    }

    switch (playersChoice) {
        case "look":
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            gameTextSecondaryOptionsElem.innerHTML = "<br>orb<br>";
            break;
        case "orb":
            gameMainTextElem.innerHTML = `As you peer into its depths, the orb reveals all of Eldoria. A living mirror into the realm. The orb reflects not just places, but your entire journey.<br><br> You see your Village of Edune, where your journey began, a place that now feels so small compared to the trials that weigh upon you. Your gaze shifts to the Old Village and you see the Tavern, ${rooms["Tavern"].isAreaActivityFinished ? "with the helpful bartender that gave you some information after you answered his question." : "yet you were unable to pry any information from the bartender."} Outside you spy the Pier, which still holds the fisherman husks, whose very existence threatened your life for the piece of the Bloodless Key.<br><br> ${rooms["Forest"].isAreaActivityFinished ? "You see the obelisk within the Cave and the Forest outside of your Village with the very strange talking tree." : "You see the Forest outside of your Village, but you were unable to find the talking tree and its clue."} ${rooms["HiddenHut"].isAreaActivityFinished ? "You found the Hidden Hut in the Forest and the mystery words inside, hinting at the Sphinx hiding in the Mountains" : "You unfortunately did not solve the mystery within the Hidden Hut in the Forest, hinting at the Sphinx hiding in the Mountains."} ${rooms["Field"].isAreaActivityExtraFinished ? "You see the Field, and there, the haunting image of the demonic child you mistakenly chose to help. The regret of that choice still grips you, a chilling reminder of the danger lurking beneath innocence." : "You see the Field once more, and the memory of the child you encountered there returns. You could not afford to take the risk in helping them, a choice that still lingers in your mind."}<br><br> Further on, the Cave system concealed within the Abandoned Building comes into view. ${rooms["MagicPath"].isAreaActivityExtraFinished ? "You recall the old woman on the Magic Path, her hands worn but steady as she restored the damaged texts. It was through her magic that you uncovered the truth about the danger lurking within the cave." : "You did not make use of the old womans power to restore texts on the Magic Path."} ${rooms["AbandonedBuilding"].wasSpellUsed ? "You had made an attempt to use a spell to restore the damaged texts" : "You decided not to take the risk to attempt using a spell on the texts."} ${rooms["AbandonedBuilding"].didSpellFail ? "but it failed, leaving you to face the danger of the cave without the guidance you had hoped for." : ""} ${rooms["AbandonedBuilding"].didSpellSucceed ? "and you were successful, uncovering their hidden knowledge with ease. With the restoration complete, there was no need to seek out any other method." : ""} You remember managing to avoid death within the deceptive Cave chamber. You see the dragon pedestal resting at the Caves End, where yet another fragment was claimed after facing untold danger. Then you see yourself curing your poisoned body within the warmth of the Hot Springs, a brief respite after such chaos.<br><br>${rooms["StoneHouse"].isAreaActivityFinished && rooms["CaveEnd"].isAreaActivityFinished ? "You had discovered the woman in the Stone House, who revealed her harrowing tale of breaking free from Melkors service and she offered her guidance, eager to assist you in the battle against him." : "You had only stumbled upon the lifeless body of a woman in the Stone House, yet her identity and the purpose that brought her to that place remains shrouded in mystery, leaving you with unanswered questions."} ${rooms["RiverHouse"].isAreaActivityFinished ? "You found the clue referring to the Pier, hidden under the table in the River House." : "You did not find the clue about the Pier, which was hidden in the River House."} In the distance, the Sphinx looms in the mountains, ${rooms["Sphinx"].firstRiddleComplete ? "its deathly riddles still echoing in your mind." : "you did not take the risk in answering any of the Sphinx riddles and found the pieces on your own."} ${rooms["Sphinx"].allRiddlesComplete ? "You bravely answered every question the Sphinx had for you." : ""}<br><br> You then spy the Ruins that the Mysterious Town guarded. A town hiding another key fragment while still holding more secrets than it had ever revealed. You see the Bone Church, its horrors etched into your memory, ${rooms["BoneChurch"].isAreaActivityFinished ? "yet amidst the terror, there is a measure of solace in knowing that, at least you freed the mages soul from eternal damnation and received the clue." : "although sadly, you did not manage to free the mages soul from the jar found in the Magic House."}<br><br> Finally, you see Minas Ithil, the great Castle, standing tall against the landscape. Every path has led you here. Each challenge, every decision. You think of the dangers you have survived, the trials overcome. There were moments of doubt, of fear, but also of resolve. Now, standing in this room, staring into the mirror of your journey, one truth becomes clear. It is not over. Everything you have endured has brought you to this final confrontation. Time to finish what has been started.`;
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            currentRoom.isAreaActivityFinished = true;
            break;
    }
}

function clueCastleBedroom() {
    const currentRoom = rooms[displayPlayersRoom];

    if (currentRoom.isAreaActivityFinished) {
        currentRoom.areaLookDescription = "You have returned to the Bedroom, having already retrieved the dagger from beneath the altar and opened the secret passage behind the bookshelf with it.<br><br>- To the East is the Central Room. <br><br>- The passage to an unknown Corridor.";
        return;
    }

    
    switch (playersChoice) {
        case "look":
            removeHiddenClassFrom(gameTextSecondaryOptionsElem);
            gameTextSecondaryOptionsElem.innerHTML = "<br>bookshelf<br>";
            break;
            case "bookshelf":
            if (!currentRoom.hasWeaponBeenFound) addHiddenClassTo(gameTextSecondaryOptionsElem);

            gameMainTextElem.innerHTML = "You approach the seemingly unremarkable bookshelf, feeling an inexplicable tug towards it. As you begin to clear away the dust and clutter, something catches your eye.<br><br> A small, hidden hole at the back, previously concealed. It almost looks like a keyhole, yet its shape is unlike any key you have ever encountered before. The air around it seems to hum faintly with magic or some other hidden force, suggesting this might be more than just an ordinary lock.";
            gameTextSecondaryOptionsElem.innerHTML = "<br>try dagger<br>";
            break;
        case "try dagger":
            gameMainTextElem.innerHTML = "You take the dagger retrived from the Chapel and insert it into the keyhole. It slides in perfectly with a slight click at the end. There is a few seconds of silence then as you remove the dagger again, the entire bookshelf slides down into the ground, revealing a path forward to an unknown corridor. You do not know where it will lead but you can feel an incredible evil behind here. This passage can only be leading to one place. To one person.";
            currentRoom.isAreaActivityFinished = true;
            currentRoom.directions["passage"] = "CastleDoorCorridor";
            gameTextPrimaryOptionsElem.innerHTML = "<br>east<br><br>passage<br>";
            removeHiddenClassFrom(gameTextLookElem);
            addHiddenClassTo(gameTextSecondaryOptionsElem);
            break;
    }
}

function playFinalGameBoss() {
    const currentRoom = rooms[displayPlayersRoom];
    const playerHealthElem = document.getElementById("boss-fight-player-health");
    const bossHealthElem = document.getElementById("boss-fight-boss-health");

    switch (playersChoice) {
        case "look":
            gameMainTextElem.innerHTML = "The room feels sickly, suffocating under an unseen weight and in the far corner, you spot a figure. It is a creature of pure black, its glowing white eyes staring unblinking, hunched over like a grotesque devil. Its gaze cuts through the distance, piercing your very soul.<br><br> The moment your eyes meet, a torrent of despair floods your mind. Every horrible feeling imaginable rushes through you all at once. For a moment, you almost lose yourself to the overwhelming tide of darkness, but you manage to claw your way back to reality. That is when it hits you. This wretched being is Melkor!<br><br> Once human, but centuries of dark magic, forbidden rites, and being trapped behind the magical door with no hope of death have twisted him beyond recognition. What stands before you now is a decrepit, broken vessel of pure evil, no longer remotely human. He is the embodiment of all that is wrong in Eldoria and it is clear, you are the only one who can put an end to him.";
            isRoomActivityInProgress = true;   
            gameTextSecondaryOptionsElem.innerHTML = "<br>dagger<br>";
            hideMainGameElems();
            break;
        case "dagger":
            gameMainTextElem.innerHTML = "You draw the special dagger, its weight cold and reassuring in your hand. Suddenly, a piercing screech erupts from the hideous creature before you. It knows exactly what the dagger is and more importantly, what it can do. Its burning eyes fix on you with a searing hatred, the intensity almost pushing you back.<br><br> The centuries have twisted its form beyond recognition, its mouth long since dissolved, useless in a world where telepathy and dark magic sufficed for communication. Yet, despite its vile appearance, there is something more behind those eyes... Fear.  It understands that you are the last threat standing between it and complete domination. You hold the only weapon in all of Eldoria that can end its unnatural existence, and now you stand before it, dagger in hand.<br><br> A surge of confidence rushes through you. You can win this fight! But as the creature trembles, a flicker of doubt crosses your mind. There is nothing more dangerous than a cornered beast, especially one as powerful and corrupted as Melkor. Before you strike, you know you must plan carefully.<br><br> This battle will not be easy, but you also notice the fabled resurrection stone that will bring anyone pure of heart back to life, if the need arises...";
            gameTextSecondaryOptionsElem.innerHTML = "<br>plan<br>";
            break;
        case "plan":
            gameMainTextElem.innerHTML = "This is a 'turn-based' battle where strategy will be key to your survival. You will always act first and can choose one of three actions:<br><br>- Hit: A guaranteed strike that deals between *12 and 20* of HP damage.<br><br> - Spell: A high risk/ high reward move. It can deal between *1 and 40* of HP damage.<br><br> - Heal: Restore your health by an amount between *5 and 25* HP.<br><br> Once you have made your move, type 'end' to finish your turn and begin Melkors turn. It shares the same options as you but with a slight disadvantage. Its 'hit' attack only deals between *7 and 15 HP* of damage, thanks to the special dagger in your possession.<br><br>However, Melkors strength lies in his endurance as he has *250 HP*, while you only have *150 HP*. You cannot heal above this total amount. The battle is to bring the others health down to zero. Both of your current HP will be displayed at the top of the screen.<br><br> There is one more thing, the resurrection stone in the room grants you 3 chances to win this battle. But if the stones power is depleted and you fail, your defeat will be permanent. Choose wisely. Good luck!";
            gameTextSecondaryOptionsElem.innerHTML = "<br>fight<br>";
            break;
        case "fight":
            gameMainTextElem.innerHTML = "";
            playerHealthElem.innerHTML = `Your hp: ${currentRoom.playerHP}`;
            bossHealthElem.innerHTML = `Melkors hp: ${currentRoom.bossHP}`; 
            gameTextSecondaryOptionsElem.innerHTML = "<br>hit<br><br>spell<br><br>heal<br>";
            break;
        case "hit":
            hit();
            break;
        case "spell":
            spell();
            break;
        case "heal":
            heal();
            break;
        case "end":
            if (!currentRoom.hasPlayerChosen) return;
            hideAllText();

            setTimeout(() => {
                removeHiddenClassFrom(gameMainTextElem);
                removeHiddenClassFrom(gameTextSecondaryOptionsElem);
                bossTurn();
            }, 1500);
            break;
    }

    if (!isRoomActivityInProgress) return;

    function hit() {
        let playerDamage = randomNumber(9) + 12; // Random damage between 12 and 20
        let bossDamage = randomNumber(9) + 7;    // Random damage between 7 and 15
        playSound("Hit").play();

        if (currentRoom.currentFighter === "player" && !currentRoom.hasPlayerChosen) {
            currentRoom.bossHP -= playerDamage
            currentRoom.hasPlayerChosen = true;
            gameMainTextElem.innerHTML = `You attack Melkor causing <span class="boss-game-span-damage">${playerDamage}HP</span> damage.`;
            gameTextSecondaryOptionsElem.innerHTML = "<br>end<br>";
        } else if (currentRoom.currentFighter === "boss" && currentRoom.hasPlayerChosen) {
            currentRoom.playerHP -= bossDamage;
            gameMainTextElem.innerHTML = `Melkor has attacked you causing <span class="boss-game-span-damage">${bossDamage}HP</span> damage.`;
        }
        checkFightState();
    }

    function spell() {
        let spellDamage = randomNumber(40) + 1; // Random damage between 1 and 40
        playSound("Spell").play();

        if (currentRoom.currentFighter === "player" && !currentRoom.hasPlayerChosen) {
            currentRoom.bossHP -= spellDamage;
            currentRoom.hasPlayerChosen = true;
            gameMainTextElem.innerHTML = `You unleash a spell causing <span class="boss-game-span-damage">${spellDamage}HP</span> damage.`;
            gameTextSecondaryOptionsElem.innerHTML = "<br>end<br>";
        } else if (currentRoom.currentFighter === "boss" && currentRoom.hasPlayerChosen) {
            currentRoom.playerHP -= spellDamage;
            gameMainTextElem.innerHTML = `Melkor has used a spell causing <span class="boss-game-span-damage">${spellDamage}HP</span> damage.`;
        }
        checkFightState();      
    }

    function heal() {
        let healAmount = randomNumber(21) + 5; // Random heal between 5 and 25
        playSound("Heal").play();

        if (currentRoom.currentFighter === "player" && !currentRoom.hasPlayerChosen) {
            currentRoom.playerHP += healAmount;
            currentRoom.hasPlayerChosen = true;
            gameMainTextElem.innerHTML = `You have been healed for <span class="boss-game-span-heal">${healAmount}HP</span>.`;
            gameTextSecondaryOptionsElem.innerHTML = "<br>end<br>";
        } else if (currentRoom.currentFighter === "boss" && currentRoom.hasPlayerChosen) {
            currentRoom.bossHP += healAmount;
            gameMainTextElem.innerHTML = `Melkor has been healed for <span class="boss-game-span-heal">${healAmount}HP</span>.`;
        }

        if (currentRoom.playerHP > 150) currentRoom.playerHP = 150;
        if (currentRoom.bossHP > 200) currentRoom.bossHP = 200;

        checkFightState();
    }    

    function bossTurn() {
        const options = [hit, spell, heal];

        currentRoom.currentFighter = "boss";
        gameTextSecondaryOptionsElem.innerHTML = "<br>hit<br><br>spell<br><br>heal<br>";
        currentRoom.bossHP > 185 ? options[randomNumber(2)]() : options[randomNumber(3)]();   // Will not 'heal' if health is over 185
        currentRoom.hasPlayerChosen = false;
        currentRoom.currentFighter = "player";
    }

    function checkFightState() {
        if (currentRoom.playerHP <= 0) {
            
            if (currentRoom.numberOfLives === 0) {
                playerDeath();
                addHiddenClassTo(playerHealthElem);
                addHiddenClassTo(bossHealthElem);
                gameMainTextElem.innerHTML = "For the third and final time, Melkor stands victorious. As you collapse in defeat, the resurrection stone shatters into dust, its magic drained beyond recovery. In an instant, Melkor's power engulfs you. He locks you in a twisted spell of unrelenting torture, binding your soul to this wretched room for all eternity. Pain consumes you, each second a fresh wave of torment as the spell forces your body to remain alive, yet trapped in perpetual agony.<br><br> You scream, but there is no escape. Worse still, you have brought the Bloodless Key to it, unlocking the one thing that kept it at bay. Now, it is set free, a force of destruction that will soon engulf Eldoria, leaving the land in ruin. You are powerless, imprisoned in the very heart of darkness.<br><br> As Melkor rises to bring devastation upon the world, you remain behind, doomed to an eternity of suffering. Alive, yet dying with every passing moment. You came so close, yet at the final hurdle, everything was lost...";
                hasFateOfEldoriaFinished = true;
                return;
            }
            playSound("Loss").play();
            startFightOver();
        } else if (currentRoom.bossHP <= 0) {
            gameMainTextElem.innerHTML = "You have done it! With a final, desperate thrust, you drive the enchanted dagger deep into Melkors blackened heart, feeling the ancient magic coursing through the blade as it tears his immortality from his corrupted form. A piercing, inhuman scream fills the room as Melkors body convulses, twisting and contorting in agony. The sheer force of his essence collapsing in on itself creates a violent shockwave, sending you hurtling to the ground.<br><br> For a moment, all is still. You slowly push yourself up, your heart pounding, and look around. There is absolutely nothing left. The terrible, looming presence that once filled the room has vanished, annihilated in an instant. Melkor, the ageless scourge who once threatened all of Eldoria, has been destroyed forever. You have done the impossible. You have freed the world from his dark grasp. It is finally all over...";
            currentRoom.directions["finish"] = "Ending";
            currentRoom.isAreaActivityFinished = true;
            isRoomActivityInProgress = false;
            playSound("Win").play();
            removeHiddenClassFrom(gameTextPrimaryOptionsElem);
            addHiddenClassTo(playerHealthElem);
            addHiddenClassTo(bossHealthElem);
            addHiddenClassTo(gameTextSecondaryOptionsElem);
        } 
        playerHealthElem.innerHTML = `Your hp: ${currentRoom.playerHP}`;
        bossHealthElem.innerHTML = `Melkors hp: ${currentRoom.bossHP}`;
    }

    function startFightOver() {
        currentRoom.numberOfLives--;
        currentRoom.playerHP = 150;
        currentRoom.bossHP = 250;
        currentRoom.currentFighter = "player";
        currentRoom.hasPlayerChosen = false;
        gameMainTextElem.innerHTML = `You have been defeated. The resurrection stone hums with power and your broken body is restored to full life. You have ${currentRoom.numberOfLives} life remaining. Try again!`;
        gameTextSecondaryOptionsElem.innerHTML = "<br>fight<br>";
    }
}

function updateScrollIndicators() {
    const scrollUpIndicator = document.getElementById('scroll-up');
    const scrollDownIndicator = document.getElementById('scroll-down');
    const { scrollTop, scrollHeight, clientHeight } = textScreenElem;

    if (scrollTop > 0) {
        scrollUpIndicator.style.display = 'block';
    } else {
        scrollUpIndicator.style.display = 'none';
    }

    if (scrollTop + clientHeight < scrollHeight - 3) {
        scrollDownIndicator.style.display = 'block';
    } else {
        scrollDownIndicator.style.display = 'none';
    }
}
updateScrollIndicators();