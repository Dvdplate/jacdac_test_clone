namespace jacdac {
    export enum LedPixelLayout {
        RgbGrb = 1,
        Rgbw = 2,
        RgbRgb = 3,
    }
    export class LedServer extends jacdac.Server {
        pixels: Buffer
        pixelLayout: LedPixelLayout
        rendered: Buffer
        numPixels: number
        brightness: number
        actualBrightness: number
        maxPower: number
        sendPixels: (pixels: Buffer) => void

        constructor(
            variant: jacdac.LedVariant,
            numPixels: number,
            pixelLayout: LedPixelLayout,
            sendPixels: (pixels: Buffer) => void
        ) {
            super(jacdac.SRV_LED, { variant: variant })

            this.numPixels = numPixels
            this.pixelLayout = pixelLayout
            this.sendPixels = sendPixels
            this.brightness = 0.2
            this.actualBrightness = this.brightness
            this.maxPower = 50

            this.pixels = control.createBuffer(this.numPixels * 3)
            this.rendered = control.createBuffer(this.numPixels * this.stride)
        }

        get stride() {
            return this.pixelLayout == LedPixelLayout.Rgbw ? 4 : 3
        }

        handlePacket(pkt: jacdac.JDPacket) {
            this.handleRegFormat(
                pkt,
                jacdac.LedReg.NumPixels,
                jacdac.LedRegPack.NumPixels,
                [this.numPixels]
            )
            this.maxPower = this.handleRegUInt32(
                pkt,
                jacdac.LedReg.MaxPower,
                this.maxPower
            )
            this.brightness = this.handleRegFormat(
                pkt,
                jacdac.LedReg.Brightness,
                jacdac.LedRegPack.Brightness,
                [this.brightness]
            )[0]
            this.actualBrightness = this.brightness
            this.actualBrightness = this.handleRegFormat(
                pkt,
                jacdac.LedReg.ActualBrightness,
                jacdac.LedRegPack.ActualBrightness,
                [this.actualBrightness]
            )[0]
            this.handleRegBuffer(pkt, jacdac.LedReg.Pixels, this.pixels)
            this.show()
        }

        show() {
            if (!this.stateUpdated) return

            // render with brightness
            const b = Math.round(this.actualBrightness * 0xff) | 0
            const n = this.rendered.length

            // compute final color and reorder channels
            switch (this.pixelLayout) {
                case LedPixelLayout.RgbRgb: {
                    for (let i = 0; i < n; ++i) {
                        this.rendered[i] = Math.idiv(
                            Math.imul(this.pixels[i], b),
                            0xff
                        )
                    }
                    break
                }
                case LedPixelLayout.RgbGrb: {
                    for (let k = 0; k < this.numPixels; k++) {
                        const i = k * 3
                        // red <- green
                        this.rendered[i] = Math.idiv(
                            Math.imul(this.pixels[i + 1], b),
                            0xff
                        )
                        // green <- red
                        this.rendered[i + 1] = Math.idiv(
                            Math.imul(this.pixels[i], b),
                            0xff
                        )
                        // blue <- blue
                        this.rendered[i + 2] = Math.idiv(
                            Math.imul(this.pixels[i + 2], b),
                            0xff
                        )
                    }
                    break
                }
                case LedPixelLayout.Rgbw: {
                    for (let k = 0; k < this.numPixels; k++) {
                        const pi = k * 3
                        const ri = k * 4
                        for (let j = 0; j < 3; j++) {
                            this.rendered[ri + j] = this.pixels[pi + j]
                        }
                        this.rendered[ri + 3] = b
                    }
                    break
                }
            }

            this.sendPixels(this.rendered)
            this.stateUpdated = false
        }
    }
}