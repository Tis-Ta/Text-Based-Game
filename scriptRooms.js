"use strict"

const playerState = {
    currentRoom: "Beginning",
    inventory: [],
    keyPieces: 0,
    isPoisoned: false
};
const riddles = [
    {
    question: "What has one eye but cannot see?",
    answerChoices: "<br>Clock<br><br>Pin<br><br>Needle<br><br>Thread",
    correctAnswer: "needle",
    wrongAnswers: ["clock", "pin", "thread"],
    hasBeenAnswered: false
    },
    {
    question: "How do you make the number one disappear?",
    answerChoices: "<br>Subtract One<br><br>Add g<br><br>Add r<br><br>Add l",
    correctAnswer: "add g",
    wrongAnswers: ["subtract one", "add r", "add l"],
    hasBeenAnswered: false
    },
    {
    question: "Take away my first letter, and I still sound the same. Take away my last letter, I still sound the same. Even take away my letter in the middle, I will still sound the same. What am I?",           
    answerChoices: "<br>Nothing<br><br>Empty<br><br>Something<br><br>You",
    correctAnswer: "empty",
    wrongAnswers: ["nothing", "something", "you"],
    hasBeenAnswered: false
    },
    {
    question: "In a race, if you overtake the 2nd person, which place would you find yourself in?",        
    answerChoices: "<br>1st<br><br>2nd<br><br>3rd<br><br>4th",
    correctAnswer: "2nd",
    wrongAnswers: ["1st", "3rd", "4th"],
    hasBeenAnswered: false
    },
    {
    question: "What occurs once in a minute, twice in a moment and never in one thousand years? Only type the letter.",           
    answerChoices: "<br>a (31 Seconds)<br><br>b (1000th of a decade)<br><br>c ('M')<br><br>d (one-tenth of a century)",
    correctAnswer: "c",
    wrongAnswers: ["a", "b", "d"],
    hasBeenAnswered: false
    },
    {
    question: "I am a mothers child, a fathers child but I am no ones son. What am I?",   
    answerChoices: "<br>Grandson<br><br>Daughter<br><br>Father<br><br>Uncle",
    correctAnswer: "daughter",
    wrongAnswers: ["grandson", "father", "uncle"],
    hasBeenAnswered: false
    },
    {
    question: "A man says: 'Brothers and Sisters I have none, but that mans father is my fathers son. Who was he pointing at?'",   
    answerChoices: "<br>Son<br><br>Father<br><br>Brother<br><br>Grandson",
    correctAnswer: "son",
    wrongAnswers: ["father", "brother", "grandson"],
    hasBeenAnswered: false
    },
    {
    question: "Which of these statements are INCORRECT? Only type the letter.",   
    answerChoices: "<br>a (B and C are both correct)<br><br>b (D is incorrect)<br><br>c (Either A or D are correct)<br><br>d (C is incorrect)",
    correctAnswer: "d",
    wrongAnswers: ["a", "b", "c"],
    hasBeenAnswered: false
    },
    {
    question: "What word becomes shorter when you add two letters to it?",   
    answerChoices: "<br>narrow<br><br>wide<br><br>short<br><br>long",
    correctAnswer: "short",
    wrongAnswers: ["narrow", "wide", "long"],
    hasBeenAnswered: false
    },
    {
    question: "I speak without a mouth and hear without ears. I have nobody, but I come alive with the wind. What am I?",   
    answerChoices: "<br>shadow<br><br>echo<br><br>silence<br><br>whisper",
    correctAnswer: "echo",
    wrongAnswers: ["shadow", "silence", "whisper"],
    hasBeenAnswered: false
    },
    {
    question: "I am light as a feather, yet the strongest person can not hold me for more than five minutes. What am I?",   
    answerChoices: "<br>Thought<br><br>water<br><br>breath<br><br>flame",
    correctAnswer: "breath",
    wrongAnswers: ["thought", "water", "flame"],
    hasBeenAnswered: false
    },
    {
    question: "The more you take, the more you leave behind. What am I?",   
    answerChoices: "<br>footsteps<br><br>memories<br><br>time<br><br>shadows",
    correctAnswer: "footsteps",
    wrongAnswers: ["shadows", "memories", "time"],
    hasBeenAnswered: false
    },
    {
    question: "What has keys but can not open locks?",   
    answerChoices: "<br>map<br><br>lockbox<br><br>compass<br><br>piano",
    correctAnswer: "piano",
    wrongAnswers: ["map", "lockbox", "compass"],
    hasBeenAnswered: false
    },
];
const otherOptionsObject = {
    hasAreaBeenVisited: false,
    isAreaActivityFinished: false,
    isAreaActivityExtraFinished: false,
};
const rooms = {
    Beginning: {
        image: "url('Images/Beginning.jpg')",
    },

    Instruction: {
        image: "url('Images/Instruction.jpg')",
    },

    Intro: {
        image: "url('Images/Intro.jpg')",
    },

    Village: {
        image: "url('Images/Village.jpg')",

        areaStoryDescription: "You stand in Edune, your village, your home. On the outskirts of your homestead, you take in the peaceful beauty of the land and its people, all trying to live their lives as best they can. But beneath the surface, Melkor's evil has begun poisoning the land, slowly creeping into your beloved village.<br><br> You have trained your entire life for this moment. Now, the time has come. You have readied yourself, said your farewells, and are prepared to embark on the journey of a lifetime. With one final look at your village, unsure if you will ever return, you turn around and set off on your adventure to save the world...",

        areaMainDescription: "You have returned to your Village. The beginning of your adventure.",

        areaLookDescription: "You are currently in your Village of Edune. The familiar sight of the wood and stone cottages greets you, their roofs covered in patches of moss. A light mist clings to the narrow paths winding between the homes, and the faint smell of woodsmoke lingers in the air. You can feel the weight of your journey ahead, yet the villages humble warmth offers a fleeting sense of peace. <br><br>- To the North is a Dirt Path leading to the open world.",

        directions: {
            "north": "Path"
        },

        ...otherOptionsObject
    },

    Path: {
        image: "url('Images/Path.jpg')",

        areaStoryDescription: "Walking along the dirt path leading out of your village, you feel an unexpected calm. Despite the weight of your mission and the enormity of the stakes, the quiet road brings a sense of peace. There is nothing to distract you, allowing your mind to focus on the task ahead.<br><br> You know you need to find the three pieces of the bloodless key, but you have no idea where to start. For now, all you can do is explore the area and hope for a lead. The elders spoke of a great Sphinx who might know the locations of the pieces, though it is likely just a myth...",

        areaMainDescription: "You have returned to the Dirt Path just outside of your Village",

        areaLookDescription: "You are currently walking on a secluded Dirt Path. The only sounds are the soft crunch of your footsteps and the occasional rustling of leaves in the breeze. The path winds gently through the trees, overgrown with grass and wildflowers that have crept into the trail over time. The distant call of a bird echoes from the forest, but otherwise, the path feels entirely your own. <br><br>- To the South is your Village. <br><br>- To the North is the Forest",

        directions: {
            "north": "Forest",
            "south": "Village",
        },

        ...otherOptionsObject
    },

    Forest: {
        image: "url('Images/Forest.jpg')",

        areaStoryDescription: "You step into the forest, the dense canopy above blocking much of the sunlight. Shadows dance between the ancient trees, and the air is thick with the scent of moss and earth. Every sound seems amplified. The rustle of leaves, the distant call of a bird.<br><br> This forest, once a place of serenity, now holds an ominous presence. You can sense the dark magic that has started to seep into its roots. The path ahead is unclear, but you know you must press on, deeper into the jaws of the unknown.",

        areaMainDescription: "You have returned to the Forest near your village, the trees standing still like silent sentinels.",

        areaLookDescription: "You are currently exploring a dense Forest, the thick vines are making it difficult to see far. Towering trees stretch endlessly overhead, their branches intertwined, casting deep shadows across the forest floor. Every step you take is met with resistance as the vines twist and tug at your feet, while strange sounds echo through the underbrush. The forest feels alive, watching, as if something is hiding just beyond your sight. <br><br>- To the North is a Stone House. <br><br>- To the East is an Old Village. <br><br>- To the South is the dirt Path leading back to your village. <br><br>- To the West is a carefully Hidden Hut.",

        directions: {
            "north": "StoneHouse",
            "east": "OldVillage",
            "south": "Path",
            "west": "HiddenHut"
        },

        ...otherOptionsObject
    },

    StoneHouse: {
        image: "url('Images/StoneHouse.jpg')",

        areaStoryDescription: "The small stone house before you looks as though it has stood for centuries, its walls weathered by time. You push open the creaking door and step inside. The interior is dark and cold, and the air is thick with dust. It's clear that this place has been abandoned for many years. As you move through the dimly lit rooms, you cant shake the feeling that someone, or something, may still be here... Watching.",

        areaMainDescription: "You have returned to the StoneHouse just outside of the Forest, its silence as heavy as before.",

        areaLookDescription: "You are currently standing in the deserted Stone House. Nothing initially seems to be out of place.<br><br>- To the East is a River. <br><br>- To the South is the Forest. <br><br>- To the West is an Abandoned Building.<br><br> You begin to hear the faint sound of someone breathing nearby, as if they are trying to muffle the sound. Whether they pose a threat to you is unclear. You should investigate and find out.",

        check1: false,

        check2: false,

        check3: false,
        
        stoneHouseExtraText: true,

        caveTrapDoorTravel: function() {
            if (rooms.CaveEnd.isAreaActivityFinished && rooms.StoneHouse.isAreaActivityFinished && rooms.StoneHouse.stoneHouseExtraText) {
           rooms.StoneHouse.areaMainDescription = 'The trap door leads you through a narrow tunnel, which eventually opens up back in the Stone House, just outside the forest. A young woman is sitting there, waiting.<br><br> "<em>I saw you enter the house before. I am sorry I blinded you and ran away. I thought you were one of Melkors servants, searching for the secret tunnel to the dragon pedestal. I could not let anyone else find the piece of the key, it was my one attempt at atonement. But I did not realize it was you. I know who you are, and I know your mission... I used to be a priestess of Melkor, but I turned away from it. I could not bear the evil demanded in his worship.<br><br> Now, I do what I can to help those fighting against him. You have the piece of the key so my mission here is complete. There is not much I can offer now except for knowledge. I have left a book in the Castle Library that will assist you once you get there. I can also help you cure the poison. There is a Hot Spring nearby with healing properties. Head straight into the forest and then all the way west from there. You do not have much time before the poison seeps into your bones and you die an extremely painful death. I sadly will not be here if you return. There is no time. Go now quickly!!</em>"';
           rooms.StoneHouse.stoneHouseExtraText = false;
            } else if (!rooms.StoneHouse.stoneHouseExtraText) {
           rooms.StoneHouse.areaMainDescription = "You have returned to the StoneHouse just outside of the Forest, its silence as heavy as before.";
            } else if (rooms.CaveEnd.isAreaActivityFinished) {
           rooms.StoneHouse.areaStoryDescription = 'The trap door leads through a narrow tunnel and ends in the Stone House, just outside the forest. A young woman lies dead on the floor in the center of the room. You do not know who she is, but perhaps if you had come here before the cave, you might have learned her story.<br><br> Clutched in her hand is a note that reads: "I am sorry I could not help you more. If you pass the trial in the cave, know that Melkor has corrupted the pedestal. It will poison anyone, whether they succeed or fail. If you are poisoned, go to the Forest and head all the way west to the Hot Springs. Their waters can cure the poison, but you must hurry! The poison acts very quickly. I am sorry."';
            }
        },

        directions: {
            "east": "River",
            "south": "Forest",
            "west": "AbandonedBuilding"
        },

        ...otherOptionsObject
    },

    River: {
        image: "url('Images/River.jpg')",

        areaStoryDescription: "The sound of rushing water reaches your ears as you approach the river. Its waters are swift and cold, cutting through the landscape like a silver blade. The banks are overgrown with reeds and wildflowers, but there is an unnatural stillness to the air here. The river, once a source of life, now seems tainted, as if the dark magic seeping through Eldoria has even poisoned the water itself.",

        areaMainDescription: "You have returned to the River, its waters as cold and relentless as before.",

        areaLookDescription: "You are standing by a fast-flowing river, the water tainted from the evil rot that has seeped into the ground. Decaying fish and animals lay around the water-side, ignorant of the waters danger. A grim reminder of the potential future, should your mission fail. <br><br>- To the North is a Field. <br><br>- To the East is a River House. <br><br>- To the South is an Old Village. <br><br>- To the West is the Stone House.",

        directions: {
            "north": "Field",
            "east": "RiverHouse",
            "south": "OldVillage",
            "west": "StoneHouse"
        },

        ...otherOptionsObject
    },

    RiverHouse: {
        image: "url('Images/RiverHouse.jpg')",

        areaStoryDescription: "The River House is a quaint, solitary structure sitting close to the edge of the river. The house is old, with ivy creeping up its walls and a thatched roof that looks like it could use some repairs. The river nearby reflects the sky, somehow its waters calm and soothing here. There's a sense of peace, a sharp contrast to the stagnant decay coming from the rest of the river.<br><br> However, the solitude of the place gives it an eerie, lonely atmosphere, as if the house itself is hiding something. You decide to enter, on the hope there is something you might find that can help on your quest.",

        areaMainDescription: "You have returned to the River House, where the gentle flow of the river outside brings a fleeting sense of calm.",

        areaLookDescription: "You are standing inside the River House, with the gentle sound of water flowing outside, offering a brief moment of calm. The wooden structure creaks slightly with age and a cool breeze from the river carries the faint scent of moss and wet stone. The sun filters through the small windows, casting shimmering reflections of the river onto the walls, adding an almost tranquil glow to the room. <br><br>- To the West heads along the River.<br><br> At first glance, nothing of value stands out. Just before leaving, you take a moment to search the area for any potential leads.",

        directions: {
            "west": "River"
        },

        ...otherOptionsObject
    },

    Field: {
        image: "url('Images/Field.jpg')",

        areaStoryDescription: "The field spreads out before you, a vast expanse of wild grass swaying in the breeze. The sun, though weak, casts a pale light over the landscape. Despite the open sky, there is an oppressive weight to the air, as if the land itself is holding its breath.",

        areaMainDescription: "You have returned to the open Field, the wild grasses whispering secrets as the wind passes through.",

        areaLookDescription: "You stand in an open field, a rare sense of peace settling around you. Something seldom found in the rest of this land. In the distance, you can see the faint outline of mountains, creating an incredible landscape in the increasingly desolate world.<br><br>- To the North is a Magic Path. <br><br>- To the South is a River.<br><br> You glance back before leaving and notice a small figure in the distance, barely visible against the expanse of the open field.",

        directions: {
            "north": "MagicPath",
            "south": "River",
        },

        ...otherOptionsObject
    },

    OldVillage: {
        image: "url('Images/OldVillage.jpg')",

        areaStoryDescription: "The Old Village shows signs of wear but still clings to life. The buildings, though aged and overgrown in places, remain standing, and the streets, while quieter than they once were, are not entirely empty.<br><br> A few villagers go about their business, their footsteps echoing faintly in the once-crowded marketplace. The distant hum of conversation mixes with the soft rustling of wind through the vines. Though the villages glory days are behind it, a sense of resilience lingers in the air, as if the heart of the village refuses to give up completely.",

        areaMainDescription: "You have returned to the Old Village, its defiant standing is a testament to the determination and strength of its people.",

        areaLookDescription: "You are currently in the main part of the Old Village, people eye you with suspicion but they ultimately get on with their day. The worn cobblestone streets are lined with weathered wooden houses, their windows shuttered and doors creaking as they sway in the breeze. A few villagers mill about, casting you cautious glances before returning to their tasks.<br><br>- To the North is a River. <br><br>- To the East is a Tavern. <br><br>- To the West is the Forest.",

        directions: {
            "north": "River",
            "east": "Tavern",
            "west": "Forest"
        },

        ...otherOptionsObject
    },

    Tavern: {
        image: "url('Images/Tavern.jpg')",

        areaStoryDescription: "The Tavern still holds onto remnants of its former glory. The crowds have thinned and the lively chatter is quieter but there is still a hum of life within.<br><br> The scent of ale, though not as fresh, mixes with the faint aroma of roasting meat. Subtle music is heard in the background. A few patrons sit scattered across worn wooden tables, exchanging stories in raised voices. The beams above groan softly under the weight of years, and yet the place has not given up. The sound of laughter is a welcome reprieve and the fire in the hearth flickers with just enough warmth to remind you that, despite the times, the Tavern lives on.",

        areaMainDescription: "You have returned to the Tavern, the memories of revelry now long faded, but there is still some sense of joy in the air",

        areaLookDescription: "You are inside the old Tavern, there are a few people drinking and telling stories but nothing that catches your ear. The bartender, a burly figure with a graying beard, polishes glasses with little care, barely glancing at the room. Though the fire crackles warmly in the hearth, there is a quiet heaviness in the air as this place struggles to hold on to its fading spirit. <br><br>- To the East is the end of the Old Village. <br><br>- To the West is the main center of the Old Village.",

        directions: {
            "east": "OldVillage2",
            "west": "OldVillage"
        },

        ...otherOptionsObject
    },

    OldVillage2: {
        image: "url('Images/OldVillage.jpg')",

        areaStoryDescription: "This part of the Old Village is even more desolate. The buildings are little more than shells, their windows like empty eyes staring into nothingness. The ground is uneven, with weeds and roots breaking through the cracked cobblestones. It feels as if this place has been forgotten by time itself. Yet, there is a strange energy in the air, a sense that this was once part of a great power.",

        areaMainDescription: "You have returned to the far side of the Old Village, the silence here almost deafening.",

        areaLookDescription: "You are in a more isolated part of the Old Village. The buildings here are older, their stone walls crumbling and overtaken by creeping vines. The windows are dark, and many doors hang ajar, abandoned long ago by families who once called this place home. The cobblestone street beneath your feet is uneven, with weeds poking through the cracks. A distant sound of crows echoes through the stillness, but otherwise it is eerily quiet.<br><br>- To the North is a great Broken Bridge. <br><br>- To the South is the Pier. <br><br>- To the West heads back into the Tavern.",

        directions: {
            "north": "BrokenBridge",
            "south": "Pier",
            "west": "Tavern"
        },

        ...otherOptionsObject
    },

    BrokenBridge: {
        image: "url('Images/BrokenBridge.jpg')",

        areaStoryDescription: "You stand before a once-great stone bridge, now broken and crumbling into the abyss below. The stones have completely deteriorated. The supports, cracked and weathered by time. The chasm beneath is shrouded in mist, making it impossible to see how far the fall would be. The bridge, like so much else in Eldoria, is a casualty of the spreading darkness.<br><br> Across the divide, you can see a once incredible building. A marvel now reduced to a decayed ruin. Although there is something faint that calls to you, if a way around can be found.",

        areaMainDescription: "You have returned to the Broken Bridge, its decaying remains spanning the chasm. The strange ancient ruins still looming over you.",

        areaLookDescription: "You stand before a broken bridge, gazing across a chasm at the massive ruins of an ancient building. Something about the ruins feels peculiar, as if a forgotten energy still lingers. Unfortunately, without a way to cross the gap, your only option is to make the long journey all the way around.<br><br> - The only path is South, back towards the end of the Old Village.",

        areaStoryDescriptionExt: "The mystery in the Ruins has finally been unraveled, and with it, you have claimed another piece of the Bloodless Key. With the Ruins no longer in need of protection, the great stone bridge was restored to its full glory. Now, for the first time in ages, the people can travel freely between the Ruins and the Old Village, the divide between past and present mended like the bridge itself.",

        areaMainDescriptionExt: "You return to the Broken Bridge, though its name no longer fits. Since solving the mystery within the Ruins, the bridge has been restored, its stonework finally whole once more.",

        areaLookDescriptionExt: "You stand before the great stone bridge, now fully restored. Once worn and broken, it has been returned to its former grandeur. The intricate stonework gleams faintly in the light, revealing its ancient craftsmanship. The path between the Old Village and the Ruins is open once more, inviting you to cross where so many have before, linking the past and present in a single, unbroken line.<br><br> - The path South, heads back towards the end of the Old Village.<br><br> - The path North, heads over the bridge to the Ruins.",

        directions: {
            "south": "OldVillage2",
        },

        ...otherOptionsObject
    },

    Pier: {
        image: "url('Images/Pier.jpg')",

        areaStoryDescription: "The Pier stretches out into the water, its old wooden planks creaking underfoot. The air is filled with the salty tang of the sea and the distant cry of seagulls. This pier has seen better days; it's worn and weather-beaten, a reminder of a time when it was a bustling hub of activity. Now, it stands with only a handful of people left, a farcry from its lively past.<br><br> The water below is dark and mysterious, almost as if it were hiding a secret beneath its calm surface.",

        areaMainDescription: "You have returned to the Pier, where the sea stretches out endlessly before you.",

        areaLookDescription: "You are standing on a weathered Pier, listening to the sound of old creaking boats and the slow mundane toil of the fisherman.<br><br> - The Old Village lies to the North.<br><br> Although nearby, a group of old fishermen are talking excitedly, their voices carrying over the wind. It seems they have stumbled upon something of value during their last outing...",

        guessGameScore: 5,

        lives: true,

        directions: {
            "north": "OldVillage2"
        },

        ...otherOptionsObject
    },

    HiddenHut: {
        image: "url('Images/HiddenHut.jpg')",

        areaStoryDescription: "The Hidden Hut is a secluded, almost forgotten dwelling deep within the forest. The hut is small, barely visible among the thick foliage that surrounds it. There is not a breath of wind, as if the forest itself is holding its breath. This place feels ancient, as though it has stood untouched for centuries, hidden from the world. There is an air of mystery here, a feeling that the hut holds secrets known only to the forest and its creatures.",

        areaMainDescription: "You have returned to the Hidden Hut, where the air is thick with the secrets of the forest.",

        areaLookDescription: "You are standing before the Hidden Hut, its roof nearly swallowed by the thick canopy of trees that loom overhead. Moss and ivy cling to its weathered wooden walls, blending the hut into the forest so seamlessly that it would be easy to miss. The door, barely hanging on its hinges, creaks ominously in the breeze, and the faint scent of earth and old wood fills the air. It feels as though the forest itself is trying to reclaim this forgotten place, hiding it from prying eyes. <br><br>- To the North is an Abandoned Building. <br><br>- To the East is the Forest. <br><br>- To the West lies the Hot Springs.",

        directions: {
            "north": "AbandonedBuilding",
            "east": "Forest",
            "west": "HotSpring"
        },

        ...otherOptionsObject
    },

    AbandonedBuilding: {
        image: "url('Images/AbandonedBuilding.jpg')",

        areaStoryDescription: "The Abandoned Building looms like a shadow at the edge of the forest. Its windows are broken, and the doors hang loosely on their hinges. Vines have overtaken much of the structure, crawling up the walls and breaking through the crumbling bricks. The building is a shell of its former self, a relic of a past long forgotten. The air here is heavy with dust and decay, and the silence is thick, broken only by the occasional creak of settling wood and scurrying creatures.",

        areaMainDescription: "You have returned to the Abandoned Building, where time seems to have stood still. The maps in their same position as before.",

        areaLookDescription: "You stand inside the Abandoned Building, its structure barely holding together. On a nearby table, you notice some maps scattered about. They depict a cave system accessible only through a secret path nearby. There is also a warning about an area within the cave, but the writing trails off abruptly, as if someone was violently pulled away mid-sentence. Perhaps there is something else of interest to uncover here. <br><br>- To the East is the Stone House. <br><br>- To the South a path to the Hidden Hut.",

        hasAreaMapBeenFound : false,

        wasSpellUsed: false,

        didSpellSucceed: false,
        
        didSpellFail: false,

        directions: {
            "east": "StoneHouse",
            "south": "HiddenHut",
            "west": "SecretPath"
        },

        ...otherOptionsObject
    },

    HotSpring: {
        image: "url('Images/HotSpring.jpg')",

        areaStoryDescription: "Nestled secretly deep within the forest, the Hot Springs is a hidden oasis of warmth and tranquility. The natural pool steams gently in the cool air, its crystal-clear waters reflecting the soft light of the surrounding woods. This secluded spot is a place of respite, where weary travelers can pause, heal and regain their strength before continuing their journey.",

        areaMainDescription: "You have returned to the Hot Springs, a peaceful haven where the soothing warmth of the water invites you to relax and let go of your worries for a time. The healing waters always a welcome reprieve.",

        areaLookDescription: "You stand by the Hot Springs, the gentle steam rising from the water in delicate wisps. The water here has been said to have magical healing properties.<br><br> - The surrounding area is serene, with only the path to the Hidden Hut to the East.",

        poisonTimeCount: 15,

        checkPoisonCondition: function () {
            if (playerState.isPoisoned) this.poisonTimeCount--;
            if (this.poisonTimeCount === 0) {
                gameMainTextElem.innerHTML = "As you walk, the world is suddenly consumed by a putrid green haze. The poison overwhelms your body, and you succumb to the agonizing despair. The chance for healing has long since passed. Your body melts from the inside out, leaving nothing but a grotesque, bubbling mass of bone and failure.";
                playerDeath();
                return;
            }      
        },

        directions: {
            "east": "HiddenHut"
        },

        ...otherOptionsObject
    },

    SecretPath: {
        image: "url('Images/SecretPath.jpg')",

        areaStoryDescription: "The Secret Path is narrow and winding, cutting through the dense forest. The trees here are tall and ancient, their branches forming a canopy that blocks out most of the light. The path is overgrown in places, making it difficult to see where you're going.",

        areaMainDescription: "You have returned to the Secret Path, where the trees close in around you, blocking out the world. A sprawling cave system lies nearby",

        areaLookDescription: "You find yourself on the Secret Path, surrounded by ancient trees whose gnarled branches twist above you. The only sound is the soft rustle of leaves in the faint breeze. This path feels forgotten, untouched by time, as if it has quietly witnessed countless secrets over the ages. <br><br>- To the North is the secret entrance to the Cave. <br><br>- To the East is an Abandoned Building.",

        directions: {
            "north": "CaveEntrance",
            "east": "AbandonedBuilding"
        },

        ...otherOptionsObject
    },

    CaveEntrance: {
        image: "url('Images/CaveEntrance.jpg')",

        areaStoryDescription: "The Caves Entrance marks the start to a dark and foreboding system. It is well lit at the entrance, almost as if to lure people in but as soon as you enter, it rapidly fades into darkness.<br><br> The air down here is cool and damp, with the scent of earth and stone filling your lungs. The entrance is wide but quickly narrows as it descends into the darkness. The ground is uneven, and with the light fading quickly, you are left with only your instincts to guide you. This cave feels ancient, untouched by time, a place where the earth keeps its deepest secrets.",

        areaMainDescription: "You have returned to the entrance of the Cave, where the light beckons you inside.",

        areaLookDescription: "You are standing at the mouth of the Cave, the bright light of the entrance attracting you like a moth to a flame. <br><br>- To the North, the cave descends further inside. <br><br>- To the South, back down through the Secret Path.",

        directions: {
            "north": "CaveFirstArea",
            "south": "SecretPath"
        },

        ...otherOptionsObject
    },

    CaveFirstArea: {
        image: "url('Images/CaveFirstArea.jpg')",

        areaStoryDescription: "The Caves first chamber is vast, its rough walls illuminated by the menacing glow of molten lava pools scattered across the floor. The intense heat warps the air, and the steady bubbling of the lava breaks the oppressive silence. Shadows dance across the walls, cast by the flickering light. This place feels ancient and volatile, as if the earth itself could erupt at any moment, untouched by the outside world yet pulsing with a primal energy.",

        areaMainDescription: "You have returned to the first chamber of the Cave, where the silence is all-encompassing. The heat from the lava as suffocating as the first time you entered",

        areaLookDescription: "You stand in the first chamber of the cave, surrounded by pools of molten lava and even small cascades of it flowing down jagged rocks. The air is thick with the heat, and there is something raw and ancient about this place. <br><br>- To the east, the cave stretches further into the darkness, beckoning you deeper. <br><br>- To the South leads back out to the caves entrance.",

        directions: {
            "east": "CaveSecondArea",
            "south": "CaveEntrance"
        },

        ...otherOptionsObject
    },

    CaveSecondArea: {
        image: "url('Images/CaveSecondArea.jpg')",

        areaStoryDescription: "The Caves second chamber is deeper and more perilous than the first. The uneven ground is riddled with jagged rocks that jut out unpredictably, making each step a careful one. The walls seem to press in, narrowing the space, while the thick, suffocating air weighs heavily on you.<br><br> The only light comes from faintly glowing patches of phosphorescent fungi, casting eerie, pale light. The rivers of lava are gone, replaced by a lingering sense of foreboding, almost as if something is waiting for you deeper within.",

        areaMainDescription: "You have returned to the second chamber of the cave, where the air hangs thick with danger. The faint glow of phosphorescent fungi barely illuminates the space, casting unsettling shadows along the jagged walls.",

        areaLookDescription: "You enter the second chamber of the cave, and the air grows heavier, thick with an unseen menace. There is no mistaking it, something evil is nearby, watching from the shadows, waiting...<br><br> - The path to the North leads to an unknown chamber.<br><br> - while to the South lies the Cave's Center. <br><br>- The West, returns back to the first chamber of the Cave.",

        directions: {
            "north": "CaveTrick",
            "south": "CaveCenter",
            "west": "CaveFirstArea"
        },

        ...otherOptionsObject
    },

    CaveTrick: {
        image: "url('Images/CaveTrick.jpg')",

        areaStoryDescription: "This part of the cave feels unnervingly unstable. The ground beneath your feet shifts with each step, loose rocks threatening to collapse at any moment. Shadows flicker and twist, making it difficult to tell what is real and what is a trick of the mind. The air hums with an eerie energy, as if the cave itself is watching you, testing you.<br><br> As your eyes adjust to the dim light, you notice a small statue at the center of the chamber. Its twisted, impish features resemble a demon, silently grinning as if it knows something you do not.",

        areaMainDescription: "You have returned to the strange part of the Cave system, where every shadow hides a potential danger. The demonic statue still staring as if peering into your soul.",

        areaLookDescription: "You find yourself in a strange part of the cave system. The small statues gaze is fixed on you with an unnerving sense of judgment. Its hollow eyes seem to follow your every move. On either side of the statue, two paths stretch out. One towards darkness and the other towards light. Just as you step forward, the statue speaks, its voice cold and eerie, echoing through the cavern.<br><br> - The only way back out is to the South, leading you to the Cave's Second Chamber. <br><br>- To the left of you, a dark tunnel that leads to the unknown. <br><br>- To the right of you, a light tunnel that leads to the unknown.",

        directions: {
            "south": "CaveSecondArea",
        },

        ...otherOptionsObject
    },

    CaveCenter: {
        image: "url('Images/CaveCenter.jpg')",

        areaStoryDescription: "The Caves Center is a vast, open chamber that feels like the heart of the cave. Strange, glowing crystals line the walls, emitting a soft, pulsating light, giving the illusion of being outdoors. Moss grows on the stones, and the crystals mimic the warmth of sunlight. A deep, melodic hum reverberates through the air, emanating from a massive obelisk at the center of the chamber. This place feels sacred, as if once central to the rituals of an ancient civilization.",

        areaMainDescription: "You have returned to the Cave Center, where the air hums with ancient energy. The obelisk as imposing as the first time you laid eyes upon it.",

        areaLookDescription: "You stand in the center of the cave, surrounded by glowing crystals and the towering obelisk at its heart. Its presence feels alien, unlike anything you've encountered in this land, leaving you to wonder where it came from and how it ended up here. <br><br>- To the North goes back up to the Cave's second chamber. <br><br>- To the East lies the caves deepest point.",

        directions: {
            "north": "CaveSecondArea",
            "east": "CaveEnd"
        },

        ...otherOptionsObject
    },

    CaveEnd: {
        image: "url('Images/CaveEnd.jpg')",

        areaStoryDescription: "The Caves End point is the deepest and most enigmatic part of the cave. Ancient markings cover the walls, telling a forgotten story. Lava from the chambers above cascades down, filling the chamber with an oppressive heat. The ground is almost entirely consumed, leaving only small, molten pools of lava that glow in contrast to the faint light from the crystals in the previous chamber.<br><br> There is a very real sense of finality here, as if your journey through the cave has led to this moment. To reach the center, you must leap from stone to stone, avoiding the lava below. In the center stands a pedestal, adorned with what appears to be a dragon's crest.",

        areaMainDescription: "You have returned to the End of the Cave, where ancient secrets are etched into the stone. The heat as suffocating as before.",

        areaLookDescription: "You stand at the very end of the cave, surrounded by ancient markings and flowing rivers of lava. <br><br>- To the West of you lies the Caves Center point.<br><br> In the middle of the lava, a grand pedestal rises with the golden image of a dragon proudly displayed upon it. There is an undeniable sense of power and majesty radiating from it. The Elders once showed you an ancient scroll, one that spoke of a great golden dragon guarding a piece of the Bloodless Key.<br><br> According to the scroll, you must speak the ancient Eldorian word for 'truth' - 'sith.' Once spoken, the dragon will test your resolve. But be warned: the dragon is merciless. Once the trial begins, there is no turning back. Failure will mean your execution...",

        hasDiceGameStarted: false,

        rollGameLives: true,

        directions: {
            "west": "CaveCenter",
        },

        ...otherOptionsObject
    },

    MagicPath: {
        image: "url('Images/MagicPath.jpg')",

        areaStoryDescription: "This Magic Path is a surreal trail that winds through an enchanted landscape. The trees here are taller, their leaves shimmering with a magical purple light. The path is lined with strange, glowing plants that seem to pulse with life. The air is filled with the scent of blooming flowers and the sound of distant, melodic chimes. This place feels alive, as if the very path is guiding you towards something extraordinary.",

        areaMainDescription: "You have returned to the Magic Path, where every step while beautiful, feels like a journey into the unknown.",

        areaLookDescription: "You walk along the Magic Path, surrounded by shimmering trees and glowing plants, their purple sheen mesmerizing in the dim light. <br><br>- To the North are the Mountains. <br><br>- To the East is the House of Magic. <br><br>- To the South is the open Field.<br><br> The air hums with enchantment, but a faint sound - a womans voice, catches your ear. Instinctively, your guard rises. In this world, anything or anyone could signal imminent danger.",

        directions: {
            "north": "Mountains",
            "east": "MagicHouse",
            "south": "Field"
        },

        ...otherOptionsObject
    },

    MagicHouse: {
        image: "url('Images/MagicHouse.jpg')",

        areaStoryDescription: "The House of Magic is a mysterious dwelling hiding at the edge of the magical path. The house is small but radiates a strange, comforting energy. The walls are covered in jars and strange looking experiments and the windows glow with a soft, warm light. Inside, the house is filled with odd trinkets and magical artifacts, each with a story of its own. This place feels like a refuge, a safe haven in a world filled with dangers.",

        areaMainDescription: "You found that you have returned to the House of Magic, where the air has its thick scent of ancient magic and houses scores of incredible discoveries.",

        areaLookDescription: "You are standing inside the House of Magic, the strange jars and items around the room are astounding, they show years of meticulous research into all things magical. There is one jar in particular that seems to glow when you pass near it.<br><br>- To the North are the Cherry Blossoms valley. <br><br>- To the West is the Magic Path.",

        directions: {
            "north": "Cherry",
            "west": "MagicPath"
        },

        ...otherOptionsObject
    },

    Mountains: {
        image: "url('Images/Mountains.jpg')",

        areaStoryDescription: "The Mountains are a towering, majestic range that stretches towards the sky. The air is crisp and thin, filled with the scent of pine and snow. As you ascend, the world below seems to fall away, leaving you alone with the rugged beauty of the peaks. The path here is steep and treacherous, with loose rocks and narrow ledges. The higher you climb, the more the landscape changes, becoming a harsh, unforgiving wilderness.",

        areaMainDescription: "You have returned to the Mountains, where the world is reduced to rock, sky, and empty silence.",

        areaLookDescription: "You are high up in the Mountains, surrounded by towering peaks and dangerous paths. Every step feels precarious as loose stones shift beneath your feet. The cold, biting wind whistles through the jagged rocks, and the sky above is a mix of dark clouds and fleeting patches of sunlight. You can sense something strange nearby... Something ancient.<br><br>- To the East lies a valley of Cherry Blossoms. <br><br>- To the South is the Magic Path <br><br>- To the West is «»«»«»",

        directions: {
            "east": "Cherry",
            "south": "MagicPath",
            "west": "Sphinx"
        },

        ...otherOptionsObject
    },

    Sphinx: {
        image: "url('Images/Sphinx.jpg')",

        areaStoryDescription: "The Sphinx. It is an ancient, stone guardian that looms over the desert at the edge of the mountains. Its face is weathered but still stern, its eyes seemingly watching your every move. The ground here is dry and cracked, impossible to tell how many centuries or millenia this place has been here for. It feels almost timeless, as if it has watched over the secrets of the world.<br><br> There is a riddle in its gaze, a challenge that only the worthy can pass and learn the truths.",

        areaMainDescription: "You have returned to the Sphinx, where the depth of its ancient knowledge is a power to behold.",

        areaLookDescription: "You stand before the Sphinx, its massive figure towering over the landscape. White wings spread wide from its sides and it is adorned with the most magnificent golden jewelry. Its powerful sapphire gaze bears down on you with such intensity that you have to look away. But you must hold your ground. If there is any hope it can lead you to the pieces of the Bloodless Key, you must face whatever challenge it brings.<br><br> - East is the only way to go. Back into the treacherous mountain range.",

        firstRiddleComplete: false,

        secondRiddleComplete: false,
        
        allRiddlesComplete: false,

        totalSphinxQuestions: 3,

        correctSphinxAnswers: 0,

        directions: {
            "east": "Mountains"
        },

        ...otherOptionsObject
    },

    Cherry: {
        image: "url('Images/Cherry.jpg')",

        areaStoryDescription: "The Cherry Blossoms stand around the center of a peaceful clearing, its blossoms a vibrant splash of color against the green of the forest. The air is filled with the sweet scent of the flowers, the rush of the cascading waterfalls and the soft sound of petals falling to the ground.<br><br> This place feels like a sanctuary, a spot untouched by the chaos of the outside world. The trees seems ancient, their twisted branches holding a wisdom earned over centuries. Theres a calm here that soothes your soul, making you reluctant to leave.",

        areaMainDescription: "You have returned to the Cherry Blossoms, where your words are lost amidst the beauty of the falling petals.",

        areaLookDescription: "You are in a peaceful clearing, with Cherry Blossoms lining the entire valley. The beauty and majesty of this place are breath-taking. Despite the safety of this area, you can feel the building anxiety, as if you are nearing a place of great evil. <br><br>- To the North is the Bone Chapel. <br><br>- To the South is the House of Magic. <br><br>- To the West, travels up the imposing Mountains.",

        directions: {
            "north": "BoneChurch",
            "south": "MagicHouse",
            "west": "Mountains"
        },

        ...otherOptionsObject
    },

    BoneChurch: {
        image: "url('Images/BoneChurch.jpg')",

        areaStoryDescription: "The Bone Church is a macabre structure, its walls built from the bones of countless creatures. The air is thick with the smell of decay, and the ground is littered with broken skulls and scattered bones. This place feels cursed, as if the very ground is tainted by the death that permeates it. The silence here is absolute, broken only by the occasional creak of the bones as they settle. Theres a feeling of dread that hangs over this place, making your skin crawl.",

        areaMainDescription: "You have returned to the Bone Church, where death is woven into the very fabric of the walls. The faintest echoes of screams constantly reverbrating off the walls.",

        areaLookDescription: "You stand before the Bone Church, its grim structure sending a chill through your bones. This place has claimed the souls of thousands, a nightmare stretching back beyond reckoning. The horror here is palpable. You are close to Melkors castle now. His presence hangs heavy in the air, almost as if looming over you. There is a strange calling here.<br><br>- To the East is the dreaded Castle. <br><br>- To the South is the valley that heads back to the Cherry Blossoms.",

        hasJar: false,

        directions: {
            "east": "Castle",
            "south": "Cherry"
        },

        ...otherOptionsObject
    },

    Valley: {
        image: "url('Images/Valley.jpg')",

        areaStoryDescription: "The Valley is a wide, open space nestled between two looming mountain ranges. The grass lies dead and grey, unmoving like blades of death. The sky hangs in a deep almost red gloom, the sun struggling to pierce through thick, oppressive clouds.<br><br> The valley feels heavy, a silent and forgotten graveyard lost in the wilderness. No birds sing here, no leaves stir. This place is still, drained of life, as if the earth itself has turned its back. Minas Ithils proximity has rendered it impossible to sustain any kind of life.",

        areaMainDescription: "You have unfortunately returned to the Valley, where the world stretches into a desolate expanse of lifeless, grey grass. Silent and Forgotten. You should not stay here.",

        areaLookDescription: "You are in the Valley outside of Minas Ithil, with the mountains towering ominously around you, the area decaying before your very eyes. There is nothing of interest here. No reason to linger any longer. <br><br>- To the North lies Melkors Castle, shrouded in shadow. <br><br>- To the south, the strange and Mysterious Town.",

        directions: {
            "north": "Castle",
            "south": "MysteryTown"
        },

        ...otherOptionsObject
    },

    MysteryTown: {
        image: "url('Images/MysteryTown.jpg')",

        areaStoryDescription: "The Mysterious Town is an eerie, deserted village at the end of the Valley. The grand, abandoned houses resemble old Norse structures, hinting at a once-great civilization. The town feels frozen in time, as if the inhabitants fled in haste and never returned. Heavy silence hangs in the air, broken only by the occasional creak of a door or rustling leaves. There is something unsettling about this place. Its name, feels very fitting.",

        areaMainDescription: "You have returned to the Mystery Town, where the grand, Norse-like houses still stand firm and proud.",

        areaLookDescription: "You stand in the Mysterious Town, its abandoned streets stretching out before you. <br><br>- To the north lies the dead Valley. <br><br>A few grand buildings loom ahead of you and different colored lanterns flicker, lighting the paths towards them in four different directions. one flame of green, one of blue, one of red and one of purple. There is some meaning to them but you cannot tell at a glance what that is.",

        directions: {
            "north": "Valley",
        },

        ...otherOptionsObject
    },

    Ruins: {
        image: "url('Images/Ruins.jpg')",

        areaStoryDescription: "You walk down the tunnel for what feels like hours. Eventually, the tunnel opens into the most magnificent Ruins you have ever seen. They are the remnants of a civilization far older than those in the Mysterious Town. Vines and moss have claimed the crumbling stone structures and only a few walls remain standing with any true strength. Broken statues and shattered pottery litter the ground, relics of a time long forgotten. You can smell the scent of earth and decay, and a quiet, sacred reverence hangs over this place, as if it still holds the final echoes of a lost era.<br><br> The Town outside was likely built to protect and conceal these ruins from outsiders. The puzzle you solved was designed to ensure that only those with the proper knowledge, those who belonged here, could gain access. You can only speculate about the true story behind these ruins, but the truth has long been swallowed by time. All that remains now is the certainty that something of great power still lingers here, waiting to be found.",

        areaMainDescription: "You have returned to the Ruins, where history lies in broken stones and shattered dreams. Even in decay, the structures remain awe-inspiring, their ancient grandeur seems to increase with each visit.",

        areaLookDescription: "You stand amidst the ancient Ruins, surrounded by the crumbling remnants of a civilization long forgotten.<br><br>- To the North, the path leads back through to the Mysterious Town.<br><br> The structures around you are among the most incredible you have ever seen. Impossibly intricate in their design, almost otherworldly in their beauty. This was clearly a civilization of remarkable achievement. Yet, the air here is heavy with a sense of loss, and you suspect Melkor is responsible for their sudden disappearance, as well as the destruction of the village outside that once guarded them.<br><br> In the distance, you can see the remains of a great stone bridge, shattered and useless, spanning a vast expanse. On the far side lies an Old Village, now unreachable. This bridge once connected these Ruins to the outside world but no longer. There is no way to cross the great chasm now.<br><br> At the heart of the ruins, however, a large stone temple stands tall, its walls still mostly intact compared to the rest of the decayed city. A massive waterfall with the most incredible blue water pours from its side. It looms like a beacon of forgotten power, wanting to reveal its secret.",

        memoryLevel: 0,

        memoryGameChances: 3,

        memoryGamePattern: [],

        memoryUserClickedPattern: [],

        directions: {
            "north": "MysteryTown"
        },

        ...otherOptionsObject
    },

    Castle: {
        image: "url('Images/Castle.jpg')",

        areaStoryDescription: "The Castle is a towering citadel that dominates the landscape - Minas Ithil. Its high, thick walls are made of dark stone that absorbs the light, casting the area in shadow. The air is bitterly cold, and the wind howls through the ancient stones cracks.<br><br> This place feels oppressive, a stronghold of long-dead rulers who once ruled with bloody oppression. There is a haunting sense of history here, of battles long past and horrors buried deep within its walls. It is a place of great evil. The heroes of ancient times once stood here and defeated Melkor. It is your turn now. The fate of the entire country, indeed the whole world, rests on your success.",

        areaMainDescription: "You have returned to the Castle, where the weight of your mission presses down on you.",

        areaLookDescription: "You stand before the daunting Castle, its dark towers clawing at the sky. <br><br>- To the North is the Castle Entrance. <br><br>- To the South lies a desolate Valley. <br><br>- To the West, the Bone Chapel waits in silence.<br><br> You cannot venture north to the Entrance without all three pieces of the Bloodless Key in your possession. Only with the key complete will you be ready for the final battle. This is where Melkor awaits. This is where your journey will end...",

        directions: {
            "south": "Valley",
            "west": "BoneChurch"
        },

        ...otherOptionsObject
    },

    CastleEntrance: {
        image: "url('Images/CastleEntrance.jpg')",

        areaStoryDescription: "The Castle Entrance is a towering, mystical gateway that glows before you, leading you into the very heart of the fortress of evil. The doors are immense, formed from swirling, green ethereal light that pulses with energy. The stone floor beneath your feet is slick and worn smooth by the passage of countless souls. The air is thick with magic, while cold and damp, clinging to you like a veil.<br><br> This feels like the threshold to something far darker than you had imagined. A barrier between the world you know and the world that will be if your mission fails. A sense of dread lingers, as if the castle itself is watching, waiting for you to step inside.",

        areaMainDescription: "You have returned to the Entrance of the Castle. The massive gateway of green fel magic looms before you, guarding the evil within it.",

        areaLookDescription: "You stand before the entrance of the castle, its massive, looming gateway beckoning you forward. Tendrils of green fel magic seep from within, pulling you toward the darkness, as though the evil inside is calling you. Much of the castle has crumbled over the years, leaving only a few areas safe enough to explore.<br><br> Yet, even in those places, the walls themselves are steeped in ancient malice. Between the crumbling structure and the malevolent forces lurking within, you must remain ever vigilant. This is where you will make your final stand.<br><br>- To the North lies a Corridor. <br><br>- To the South is back outside to the Castles exterior. <br><br>- To the West heads into the Castle Library.",

        directions: {
            "north": "CastleCorridor",
            "south": "Castle",
            "west": "CastleLibrary"
        },

        ...otherOptionsObject
    },

    CastleCorridor: {
        image: "url('Images/CastleCorridor.jpg')",

        areaStoryDescription: "The Castles Corridor stretches deep into the heart of the fortress, a long, dimly lit hallway that feels endless. The cold stone floor amplifies the sound of your footsteps, each echo reverberating in the heavy silence. The air is thick with dust and the musty scent of ancient stone.<br><br> You move cautiously, fully aware that danger could emerge at any moment. The oppressive weight of evil memories lingers here, like a storm cloud overhead, ready to burst. You need to find Melkor and end this once and for all.",

        areaMainDescription: "You have returned to the Corridor of the Castle, where the air is thick with the memories of horrific times and tragic acts.",

        areaLookDescription: "You walk through the Castles Corridor, the walls lined with hundreds of grand, faded photographs. Each image captures a disturbing moment in history, a twisted gallery of the worlds greatest horrors, displayed as if in some great pride.<br><br> Human-like shadows flicker along the corridor, moving as though alive, yet there is no one there to cast them. These photographs seem to hold more than mere memories.<br><br>- To the North is the Chapel. <br><br>- To the South, the Castles Entrance. <br><br>- To the West is the Central Room.",

        directions: {
            "north": "CastleChapel",
            "south": "CastleEntrance",
            "west": "CastleRoom"
        },

        ...otherOptionsObject
    },

    CastleChapel: {
        image: "url('Images/CastleChapel.jpg')",

        areaStoryDescription: "The Castle Chapel is a shadowed, solemn space, its stone walls lined with faded murals depicting forgotten deities and cryptic symbols. The air is heavy with the harsh scent of burnt incense and ancient candle wax, lingering like a memory that refuses to fade. A suffocating reverence fills the room, as if the very walls are soaked in centuries of demonic prayers and blood sacrifices. The silence here is dense and oppressive, almost as if the chapel itself is waiting for something dreadful to return.",

        areaMainDescription: "You have returned to the Castle Chapel, where the weight of ancient blood rituals and human sacrifices hangs in the air.",

        areaLookDescription: "You are in the Castle's Chapel, surrounded by stone walls adorned with faded religious symbols. In the center of the room stands an ominous altar, its surface worn and cracked, exuding an unsettling aura. A palpable negative magic radiates from it, a symbol of pure evil.<br><br> Your instincts scream at you to turn away, to flee from the dark energy that pulses like a heartbeat from the altar, but you know you cannot. To find Melkor, you must summon the courage to confront whatever lies ahead, no matter how foreboding and terrifying the atmosphere may be.<br><br>- To the South, return to the unnerving Corridor.",

        hasBookBeenFound: false,

        directions: {
            "south": "CastleCorridor"
        },

        ...otherOptionsObject
    },

    CastleDeath: {
        image: "url('Images/CastleDeath.jpg')",

        areaStoryDescription: "You descend the staircase into a place of darkness and despair, where the shadows seem to have a life of their own. The fabled weapon, the only reason you are taking this dangerous step.<br><br> The air down here is cold and the atmosphere is thick with the sense of tragedy and loss. This is a place where many have met their end, and the very walls seem to echo with their final cries. A palpable sense of danger hangs over this room, as if death itself lingers here, waiting for its next victim.",

        areaLookDescription: "You are now in the room beneath the altar, a place swallowed by darkness and an overwhelming sense of dread. The space is entirely barren, save for a peculiar pile of burning ash at the center, still smoldering as if it has been burning for countless years. Strange, bat-like creatures made of smoke circle the ash pile, their forms twisting and fading into the gloom.<br><br> The weapon is nowhere to be seen, nor is there anything that offers a clear path forward. The air is heavy with uncertainty and the eerie glow of the ash does little to guide you.",

        hasTimerStarted: false,

        directions: {
            "stairs": "CastleChapel"
        },

        ...otherOptionsObject
    },

    CastleRoom: {
        image: "url('Images/CastleRoom.jpg')",

        areaStoryDescription: "The Castles Central Room is a grand chamber filled with old furniture, dusty tapestries, and the remnants of a time long past. The air is stale, and a layer of dust and web cover everything. This room once served as the central hub of the Castle, a place where decisions were made and lives were changed. Now, its just a relic of what once was, a ghost of its former self, except for a large orb of swirling color dominating the room.",

        areaMainDescription: "You have returned to the Castles Central Room, where the echoes of the past still linger in the dusty air.",

        areaLookDescription: "You stand in the Central Room, a vast chamber draped in memories, its dusty furniture remnants of a time long past. In the center, a large orb shimmers brightly, drawing your attention.<br><br>- To the East is a Corridor. <br><br>- To the South is the Library. <br><br>- To the West is the main Bedroom.",

        directions: {
            "east": "CastleCorridor",
            "south": "CastleLibrary",
            "west": "CastleBedroom"
        },

        ...otherOptionsObject
    },

    CastleLibrary: {
        image: "url('Images/CastleLibrary.jpg')",

        areaStoryDescription: "The Castle Library is a vast room filled with towering bookshelves, each one crammed with ancient tomes and scrolls. The smell of old paper and leather fills the air, and the only sound is the soft rustle of pages as the wind slips through the cracked windows. This is a place of knowledge, where secrets and stories from ages past are stored. The library feels almost alive, as if the books themselves are watching you. There might be something of value here, something that can be learned to assist in your battle against Melkor.",

        areaMainDescription: "You have returned to the Castle Library, where the weight of centuries of knowledge presses down on you.",

        areaLookDescription: "You are in the grand Library of the Castle, surrounded by its towering shelves of books and knwoledge. <br><br>- To the North is the Central Room. <br><br>- To the East is back to the Castles Entrance.<br><br> You glance around, your eyes widening at the sheer volume of books lining the room. Stacks upon stacks, shelves stretching far beyond what you can fathom. An eternitys worth of knowledge, far more than you could ever sift through in a single lifetime. The daunting thought settles in. It would take years to make sense of even a fraction of it. Finding anything useful in the short time you have feels hopeless.<br><br> Just as you are about to turn and leave, you feel an inexplicable tug. A pull that draws you toward one of the towering bookshelves. Among the countless tomes, one in particular catches your eye. It stands out, its surface shimmering with a faint, almost imperceptible ethereal glow. There is an ancient magic about it, subtle yet undeniable, as though someone placed an enchantment on it long ago, waiting for this very moment. Hoping someone would arrive at this castle with your very intentions.",

        directions: {
            "north": "CastleRoom",
            "east": "CastleEntrance"
        },

        ...otherOptionsObject
    },

    CastleBedroom: {
        image: "url('Images/CastleBedroom.jpg')",

        areaStoryDescription: "The Castle Bedroom is a large, opulent room that once belonged to someone of great importance. The bed is massive, draped with heavy curtains, and the furniture is ornate, though covered in dust. The air is stale, and the room has an air of abandonment. This was once a place of rest and comfort but now it feels empty, haunted by the memories of those who lived here before it was taken by evil.",

        areaMainDescription: "You have returned to the Castles Bedroom, where the echoes of dreams long forgotten still linger. The end of your quest in sight",

        areaLookDescription: "You stand in the Castle Bedroom, a grand and opulent space, now left to the grip of time and neglect. The room, though unused for countless years, retains an eerie sense of preservation, as if someone had tried to maintain it despite the decay. The heavy air, a reminder of the weight of old memories, a melancholic lull of what once was.<br><br> The castle around you has largely crumbled into ruin, but this room alone remains intact, almost stubbornly. Yet, there is an unsettling feeling to it, as if something vital is missing. There must be another path forward from here. Something here is not quite right.<br><br>- To the East is the Central Room.",

        hasWeaponBeenFound: false,

        directions: {
            "east": "CastleRoom"
        },

        ...otherOptionsObject
    },

    CastleDoorCorridor: {
        image: "url('Images/CastleDoorCorridor.jpg')",

        areaStoryDescription: "The Hidden Passage is a long, narrow corridor leading to a massive door that seems to pulse with an ominous energy. The walls are cold and bare, with only the faintest echo of your footsteps to break the silence. The air is thick with anticipation, as if this corridor has not seen a living person for eons.",

        areaMainDescription: "You have returned to the Castles hidden passage, where the path ahead leads to something unknown yet dangerous.",

        areaLookDescription: "You find yourself in the Hidden Passage, a suffocatingly narrow hallway with walls that seem to press in closer with every step. The dim light barely penetrates the thick shadows and the air feels stagnant, as though it has not been disturbed in centuries. In front of you, looms a massive imposing Door of magic. Its surface marred by deep, claw-like scratches and an incredible, indescribable power eminates from it. This can only be the Magic Door... <br><br> Every sound is amplified in this unnerving silence, such as the rhythmic thud of your heartbeat. The air is thick with foreboding, and a sense of dread coils in your chest, reminding you that whatever lies beyond that door, is the culmination of all the darkness and all the evil the world has endrued so far.<br><br>- To the East, back into the safety of the Bedroom.<br><br>- To the North. The Magic Door.",

        directions: {
            "north": "CastleDoor",
            "east": "CastleBedroom"
        },

        ...otherOptionsObject
    },

    CastleDoor: {
        image: "url('Images/CastleDoor.jpg')",

        areaStoryDescription: "The Magic Door looms before you, an immense, terrifying barrier forged from a haunting blend of ancient wood and dark, twisted iron. Pulsing with arcane energy, the door hums faintly, as though alive with a sinister will of its own.<br><br> Its surface is etched with eerie, shifting carvings, battles long forgotten, monstrous figures writhing in agony, and symbols too ancient to comprehend, their meaning lost to time but filled with dread. Flickers of magic ripple across the doors surface, a warning that whatever lies beyond is bound by forces far beyond the human understanding.<br><br> This is no ordinary door. It is a malevolent creation, built to contain something unspeakably evil. The weight of its sheer presence presses heavily upon you, suffocating you with a dread that gnaws at your resolve.<br><br> There is no mistaking what this cursed door conceals. Beyond this final threshold lies the most dangerous and vile of all... Melkor. His shadow has lingered over every step of your journey, and now, only this barrier stands between you and the end. To pass through is to confront the ultimate darkness. To face the evil that has twisted this world. This is it. The culmination of everything you have fought for. This is the final battle. This is the moment of reckoning where all will be decided.",

        areaMainDescription: "You stand before the great Magic Door, knowing that whatever lies beyond is going to be the ultimate challenge. The end to everything.",

        areaLookDescription: "You stand before the towering Magic Door, an ancient and terrifying structure, pulsing with the weight of ages. The Bloodless Key in your hand begins to glow, its rhythm quickening as it senses its counterpart.<br><br> There is nothing left now but to use the key, to unlock what has been sealed away for so long. This is the moment. The threshold beyond which your destiny awaits, and the fate of Eldoria hangs in the balance. This is the point of no return. Melkor is waiting. Good luck!<br><br>- use the key to open the door. <br><br>- South back to the hidden Corridor.",

        directions: {
            "use key": "CastleBoss",
            "south": "CastleDoorCorridor"
        },

        ...otherOptionsObject
    },

    CastleBoss: {
        image: "url('Images/CastleBoss.jpg')",

        areaStoryDescription: "The room beyond the door is a vision of pure horror. A grotesque fusion of mechanical monstrosities and dark, ancient magic fills you with dread. The walls seem to ooze malice, the atmosphere thick with centuries of festering evil. This place has been corrupted for ages, left to rot and fester into something vile, something beyond human comprehension. Every corner feels alive with malevolence, watching you, waiting...",

        areaLookDescription: "",

        playerHP: 150,

        bossHP: 200,

        currentFighter: "player",

        hasPlayerChosen: false,

        numberOfLives: 2,

        finalBossDisplayLogic: function() {
            if (displayPlayersRoom === "CastleBoss" && !rooms["CastleBoss"].isAreaActivityFinished) {
                playSound("Door").play();
                hideMainGameElems();
                removeHiddenClassFrom(gameTextSecondaryOptionsElem);
                gameTextSecondaryOptionsElem.innerHTML = "<br>look<br>";
            }

            if (rooms["CastleBoss"].isAreaActivityFinished) {
                playSound("GameWin").play();
                addHiddenClassTo(gameTextLookElem);
                removeHiddenClassFrom(gameTextSecondaryOptionsElem);
                gameTextSecondaryOptionsElem.innerHTML = "<br>CONGRATULATIONS!!<br><br>THANKS FOR PLAYING!!";
            }
        },

        directions: {
            "finish": "Ending",
        },

        ...otherOptionsObject
    },

    Ending: {
        image: "url('Images/Ending.jpg')",

        areaStoryDescription: "Eldoria has been saved! You have endured unspeakable hardships, unraveled countless mysteries and braved unimaginable dangers. After facing the most fearsome adversary the world has ever known, you have emerged victorious. Eldoria is finally safe, its people free from the shadow that has plagued them for centuries.<br><br> The great task that consumed your life has been completed. As you begin the long walk back to your beloved village of Edune, the weight of destiny that once pressed down on your shoulders lifts. You have fulfilled your purpose. No longer bound to the fate of Eldoria, but free to live your life as you choose. Peace has been restored and the future of Eldoria is bright once more...",

        directions: {

        },
    }
}