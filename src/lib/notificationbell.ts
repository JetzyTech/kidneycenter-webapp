import { Howl } from "howler"

export const playNotificationBell = () => {
	const sound = new Howl({
		src: ["/sound/livechat-129007.mp3"], // Path to your sound file in the public directory
		volume: 1.0, // Ensure volume is set
		onloaderror: (id, err) => {
			console.error("Failed to load sound", err)
		},
		onplayerror: (id, err) => {
			console.error("Failed to play sound", err)
			sound.once("unlock", () => {
				sound.play()
			})
		},
	})

	sound.play()
}
