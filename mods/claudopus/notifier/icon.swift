// Draws the app icon set from the mod's icon: the square picture inside the macOS icon grid, its corners rounded.
//   swift icon.swift <icon.png> <out.iconset> [RRGGBB]
// With a colour, the octopus is drawn in it instead of its purple: every coloured pixel takes it, the dark ground stays.
import AppKit

let args = CommandLine.arguments
guard args.count == 3 || args.count == 4, let given = NSImage(contentsOfFile: args[1]) else {
  FileHandle.standardError.write("usage: swift icon.swift <icon.png> <out.iconset> [RRGGBB]\n".data(using: .utf8)!)
  exit(1)
}
var source = given
if args.count == 4, let hex = UInt32(args[3], radix: 16), let tiff = given.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff) {
  let tint = NSColor(deviceRed: CGFloat(hex >> 16 & 0xFF) / 255, green: CGFloat(hex >> 8 & 0xFF) / 255, blue: CGFloat(hex & 0xFF) / 255, alpha: 1)
  for y in 0..<rep.pixelsHigh {
    for x in 0..<rep.pixelsWide {
      guard let c = rep.colorAt(x: x, y: y)?.usingColorSpace(.deviceRGB) else { continue }
      if max(c.redComponent, c.greenComponent, c.blueComponent) - min(c.redComponent, c.greenComponent, c.blueComponent) > 0.2 { rep.setColor(tint, atX: x, y: y) }
    }
  }
  source = NSImage(size: given.size)
  source.addRepresentation(rep)
}
let out = URL(fileURLWithPath: args[2])
try? FileManager.default.createDirectory(at: out, withIntermediateDirectories: true)

for size in [16, 32, 128, 256, 512] {
  for scale in [1, 2] {
    let px = size * scale
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: px, pixelsHigh: px, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    // Apple's grid: an 824 of 1024 body, centred, corners about 185 of 1024
    let side = CGFloat(px) * 824 / 1024
    let inset = (CGFloat(px) - side) / 2
    let body = NSRect(x: inset, y: inset, width: side, height: side)
    NSBezierPath(roundedRect: body, xRadius: side * 0.2237, yRadius: side * 0.2237).addClip()
    NSGraphicsContext.current?.imageInterpolation = px < 256 ? .high : .none
    source.draw(in: body, from: .zero, operation: .copy, fraction: 1)
    NSGraphicsContext.restoreGraphicsState()
    let name = scale == 1 ? "icon_\(size)x\(size).png" : "icon_\(size)x\(size)@2x.png"
    try! rep.representation(using: .png, properties: [:])!.write(to: out.appendingPathComponent(name))
  }
}
