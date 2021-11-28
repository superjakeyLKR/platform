kaboom({ background: [0, 0, 255] });

loadSprite("grass", "/sprites/grass.png")
loadSprite("spike", "/sprites/spike.png")
loadSprite("coin", "/sprites/coin.png")
loadSprite("portal", "/sprites/portal.png")
loadSprite("player", "/sprites/player.png")
const JUMP_FORCE = 1000
const MOVE_SPEED = 400
const LEVELS = [
	[
		"                   ",
		"                   ",
		"                   ",
		"       o           ",
		"                   ",
		"      ===          ",
		"                   ",
		"   ^^             #",
		"===================",
	]
]
const LevelInterpreter = {
	width: 64,
	height: 64,
	"=": () => [
		sprite("grass"),
		area(),
		solid(),
		origin("bot")
	],
	"^": () => [
		sprite("spike"),
		area(),
		solid(),
		origin("bot"),
		"spike"
	],
	"o": () => [
		sprite("coin"),
		area(),
		origin("bot"),
		"coin"
	],
	"#": () => [
		sprite("portal"),
		area({ scale: 0.5 }),
		origin("bot"),
		"portal"
	]
}

scene("StartMenu", () => {
	add([
		pos(center()),
		circle(195)
	])
	const startBtn = add([
		text("Start", {
			font: "sinko",
			size: 50
		}),
		pos(center().x, center().y - 50),
		area({ cursor: "pointer" }),
		origin("center"),
		"startBtn"
	]);
	const optBtn = add([
		text("Options", {
			font: "sinko",
			size: 50
		}),
		pos(center().x, center().y + 50),
		area({ cursor: "pointer" }),
		origin("center"),
		"optBtn"
	]);

	startBtn.onUpdate(() => {
		if (startBtn.isHovering()) {
			const t = time() * 10
			startBtn.color = rgb(
				wave(0, 255, t),
				wave(0, 255, t + 2),
				wave(0, 255, t + 4),
			)
			startBtn.scale = vec2(1.2)
		} else {
			startBtn.scale = vec2(1)
			startBtn.color = rgb()
		}
	})

	optBtn.onUpdate(() => {
		if (optBtn.isHovering()) {
			const t = time() * 10
			optBtn.color = rgb(
				wave(0, 255, t),
				wave(0, 255, t + 2),
				wave(0, 255, t + 4),
			)
			optBtn.scale = vec2(1.2)
		} else {
			optBtn.scale = vec2(1)
			optBtn.color = rgb()
		}
	})
	onClick("startBtn", () => go("Game"))
	onClick("optBtn", () => go("Options"))
})

scene("Options", () => {
	add([
		text("Not much to see here...", {
			font: "sinko",
			size: 30,
		}),
		pos(center().x, height() / 2),
		area({ cursor: "pointer" }),
		origin("center"),
	]);
	onClick(() => go("StartMenu"))
})

scene("Game", ({ levelID, score } = { levelId: 0, score: 0 }) => {
	gravity(3200)

	const level = addLevel(LEVELS[levelID ?? 0], LevelInterpreter)

	const player = add([
		sprite("player"),
		pos(0, 0),
		area(),
		body(),
		origin("bot")
	])

	player.onUpdate(() => {
		camPos(player.pos)
	})

		onKeyPress("space", () => {
		if (player.isGrounded()) {
			player.jump(JUMP_FORCE)
		}
	})

	onKeyDown("left", () => {
		player.move(-MOVE_SPEED, 0)
	})

	onKeyDown("right", () => {
		player.move(MOVE_SPEED, 0)
	})

	onKeyPress("down", () => {
		player.weight = 3
	})

	onKeyRelease("down", () => {
		player.weight = 1
	})

	onKeyPress("f", () => {
		fullscreen(!fullscreen())
	})
})
onUpdate(() => cursor("default"))
go("StartMenu")
