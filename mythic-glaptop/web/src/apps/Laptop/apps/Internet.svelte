<script>
    import { AddNotification } from "../../../utils/Utils";
    import AppContainer from "./components/AppContainer.svelte";

    let RandomVideos = [
        "dIR3XFuY4Qs", // Trololo Cat
        "dQw4w9WgXcQ", // Rick Astley - Never Gonna Give You Up (Official Music Video)
        "w7x_lWJNnNg", // Cat has a crazy deep meow
        "dmOddwmhFc4", // Stick Roll but with a different link
        "f2qNwYUCSH4", // [ASMR] Cute panda eating carrot ~ Powerful Relaxation
        "6aocrnaeBhA", // Cat in a bunny costume #shorts
        "pwMwvuGOsX8", // *Real Video* Woman yelling At a cat meme
        "DpKWE8dSVW4", // cat reacts to cringe
        "ERwHvwsGFoE", // Red Pandas Play in the Snow
        "f8mL0_4GeV0", // Metal pipe falling sound effect but it’s more violent
        "3lUP0nd3soc", // interstellar hamster
    ];

    let VideoId = Math.floor(Math.random() * RandomVideos.length);

    setTimeout(() => {
        if (RandomVideos[VideoId] == "dQw4w9WgXcQ") {
            AddNotification("internetexplorer.svg", [], "Internet Explorer", "GET RICKROLLED NOOB!")
        } else if (RandomVideos[VideoId] == "dmOddwmhFc4") {
            AddNotification("internetexplorer.svg", [], "Internet Explorer", "GET STICKROLLED NOOB!")
        } else if (RandomVideos[VideoId] == "f2qNwYUCSH4") {
            AddNotification("internetexplorer.svg", [], "Internet Explorer", "Cute.. right.. right!?")
        } else if (RandomVideos[VideoId] == "pwMwvuGOsX8") {
            AddNotification("internetexplorer.svg", [], "Internet Explorer", 'Legends say the cat meowed "suit yourself".')
        } else if (RandomVideos[VideoId] == "ERwHvwsGFoE") {
            AddNotification("internetexplorer.svg", [], "Internet Explorer", "AHHWWW!")
        } else if (RandomVideos[VideoId] == "w7x_lWJNnNg") {
            AddNotification("internetexplorer.svg", [], "Internet Explorer", "Meow..")
        };
    }, 500);
</script>

<AppContainer class="app-internet-container" AppId="Internet" App="Internet Explorer">
    <div class="app-container">
        <iframe title="sheesh" style="pointer-events: none; width: 100%; height: 100%;" src="https://www.youtube.com/embed/{RandomVideos[VideoId]}?controls=0&autoplay=1" frameborder="0" allowfullscreen></iframe>
        <!-- <i style="width: 100%; text-align: center; font-size: 3.6vh; color: rgba(255, 255, 255, 0.5); margin-top: 20vh;" class="fas fa-frown"></i>
        <p style="width: 100%; text-align: center; font-size: 1.8vh; color: rgba(255, 255, 255, 0.5); font-family: Roboto; margin-top: 2vh;">The site you are trying to reach is currently unavailable..</p> -->
    </div>
</AppContainer>

<style>
    :global(.app-internet-container) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #101010 !important;
    }

    .app-container {
        margin: 0 auto;
        width: 100%;
        height: calc(100% - 3vh);
    }
</style>