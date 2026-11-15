import { ChangeDetectionStrategy, Component, computed, signal } from "@angular/core"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"

import colorLuminance from "color-luminance"

import palettes from "../palettes"
import maps from "../maps"
import { ArtComponent } from "./art/art.component"

// Material hue families in color-wheel order, so offsets give color harmony.
const HUE_WHEEL = [
  "red",
  "pink",
  "purple",
  "deeppurple",
  "indigo",
  "blue",
  "lightblue",
  "cyan",
  "teal",
  "green",
  "lightgreen",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deeporange",
]

// Wheel offsets for color harmony.
const SCHEMES = [
  [0], // monochrome
  [0, 1, 2], // analogous
  [0, 2, 4], // wide analogous
  [0, 8], // complementary
  [0, 7, 9], // split-complementary
  [0, 5, 11], // triadic
  [0, 4, 8, 12], // tetradic
]

// Each shuffle uses one mood. Very dark shades read as mud.
const SHADE_SETS = [
  ["A200", "A400", "A700"], // neon
  ["400", "500", "600", "700"], // classic
  ["100", "200", "300", "A100"], // pastel
  ["300", "500", "700", "A200", "A400"], // mixed
]

// Deep, never near-black or white, so white and black strokes both show.
const BACKGROUND_SHADES = ["700", "800", "900"]
const NEUTRAL_BACKGROUNDS = ["#455a64", "#546e7a", "#616161", "#5d4037", "#6d4c41"]

const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)]

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArtComponent, MatIconModule, MatButtonModule],
})
export class AppComponent {
  protected readonly map = maps[0]
  protected readonly palette = signal<string[]>(this.buildRandomPalette())
  protected readonly showUi = signal(true)
  protected readonly showStory = signal(false)
  // Black or white, whichever reads best on the background.
  protected readonly uiColor = computed(() => {
    const hex = this.palette()[0]
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
    return colorLuminance(r, g, b) > 140 ? "#000000" : "#ffffff"
  })
  protected readonly uiBackgroundColor = computed(() => this.palette()[0])

  protected shuffle(): void {
    this.palette.set(this.buildRandomPalette())
  }

  protected toggleStory(): void {
    this.showStory.update((v) => !v)
  }

  protected toggleUi(): void {
    this.showUi.update((v) => !v)
  }

  // palette[0] is the canvas background. The rest are stroke colors.
  private buildRandomPalette(): string[] {
    const base = Math.floor(Math.random() * HUE_WHEEL.length)
    const scheme = pick(SCHEMES)
    const hues = scheme.map((offset) => HUE_WHEEL[(base + offset) % HUE_WHEEL.length])
    const shades = pick(SHADE_SETS)
    const numberOfStrokes = 3 + Math.floor(Math.random() * 15)

    const strokes: string[] = []
    for (let i = 0; i < numberOfStrokes; i++) {
      strokes.push(palettes[pick(hues)][pick(shades)])
    }

    // Background hue: from the scheme, any hue on the wheel, or a neutral.
    const roll = Math.random()
    const background =
      roll < 0.45
        ? palettes[pick(hues)][pick(BACKGROUND_SHADES)]
        : roll < 0.85
          ? palettes[pick(HUE_WHEEL)][pick(BACKGROUND_SHADES)]
          : pick(NEUTRAL_BACKGROUNDS)

    return [background, ...strokes, "#ffffff", "#000000"]
  }
}
