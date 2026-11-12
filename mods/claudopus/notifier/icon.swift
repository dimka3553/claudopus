// Draws the app icon set from the mod's icon: the square picture inside the macOS icon grid, its corners rounded.
//   swift icon.swift <icon.png> <out.iconset>
import AppKit

let args = CommandLine.arguments
guard args.count == 3, let source = NSImage(contentsOfFile: args[1]) else {
  FileHandle.standardError.write("usage: swift icon.swift <icon.png> <out.iconset>\n".data(using: .utf8)!)
  exit(1)
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
