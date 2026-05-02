import { describe, it, expect, beforeEach } from "vitest"
import { TestBed } from "@angular/core/testing"
import { provideAnimations } from "@angular/platform-browser/animations"
import { AppComponent } from "./app.component"

describe("AppComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideAnimations()],
    }).compileComponents()
  })

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it("should render the art canvas", () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const el: HTMLElement = fixture.nativeElement
    expect(el.querySelector('[data-testid="art"]')).toBeTruthy()
  })

  it("should show the UI by default", () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const el: HTMLElement = fixture.nativeElement
    expect(el.querySelector(".menu")).toBeTruthy()
    expect(el.querySelector(".footer")).toBeTruthy()
  })

  it("should not show the story popup by default", () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const el: HTMLElement = fixture.nativeElement
    expect(el.querySelector(".story-backdrop")).toBeNull()
  })

  it("should show the story popup when the story button is clicked", () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const el: HTMLElement = fixture.nativeElement
    const storyButton: HTMLButtonElement = el.querySelector('[data-testid="story-button"]')!
    storyButton.click()
    fixture.detectChanges()
    expect(el.querySelector(".story-backdrop")).toBeTruthy()
    expect(el.querySelector(".story-card")).toBeTruthy()
  })

  it("should hide the story popup when the close button is clicked", () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const el: HTMLElement = fixture.nativeElement
    el.querySelector<HTMLButtonElement>('[data-testid="story-button"]')!.click()
    fixture.detectChanges()
    el.querySelector<HTMLButtonElement>(".story-close")!.click()
    fixture.detectChanges()
    expect(el.querySelector(".story-backdrop")).toBeNull()
  })
})
