import { ChangeDetectionStrategy, Component, computed, signal } from "@angular/core"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"

import palettes from "../palettes"
import maps from "../maps"
import { ArtComponent } from "./art/art.component"

const NUMBER_OF_COLOR_OPTIONS = [5, 10, 30]

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
  protected readonly uiColor = computed(() => this.palette()[0])
  protected readonly uiBackgroundColor = "#000000"

  protected shuffle(): void {
    this.palette.set(this.buildRandomPalette())
  }

  protected toggleStory(): void {
    this.showStory.update((v) => !v)
  }

  protected toggleUi(): void {
    this.showUi.update((v) => !v)
  }

  private buildRandomPalette(): string[] {
    const paletteKeys = Object.keys(palettes)
    const randomNumberOfColorsIndex = Math.floor(Math.random() * NUMBER_OF_COLOR_OPTIONS.length)
    const maxColors = NUMBER_OF_COLOR_OPTIONS[randomNumberOfColorsIndex]
    const numberOfColors = Math.floor(Math.random() * maxColors + maxColors)
    const newPalette: string[] = []

    for (let i = 0; i < numberOfColors; i++) {
      const colorKey = paletteKeys[Math.floor(Math.random() * paletteKeys.length)]
      const shades = Object.values(palettes[colorKey])
      const shade = shades[Math.floor(Math.random() * shades.length)]
      newPalette.push(shade)
    }

    return newPalette
  }
}
