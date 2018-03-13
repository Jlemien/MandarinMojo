export type Globals = {
    context: CanvasRenderingContext2D
    world: World
}

export type World = {
    debug: boolean,

    keyState: any[],
    state: StateManager,
    images: any, // ImageManager
    sounds: any, // SoundManager

    playerinfo: any, // PlayerInfoManager,

    tileDisplayWidth: number,
    mapWidth: number,
    mapHeight: number,
    arenaWidth: number,
    arenaHeight: number,

    problems: any[], // Randomly ordered array of problem instances grouped by level.
    mapplayer: any, // save the player obj

    loopCount: number,

    message: string | null,
    textcolor: string,
    textsize: string,

    then: number,
    now: number,
    dt: number,

    localTTS: boolean,
    hp: any, //HanyuPinyin,
    tts: any, //ChineseTextToSpeech,
    toggleSpeaker: () => void
}