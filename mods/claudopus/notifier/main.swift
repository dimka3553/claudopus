// Claudopus.app: the mod's notifications, under its own name and icon, opening the chat they are about when clicked.
//
//   Claudopus --title T --text X [--open URL] [--activate BUNDLE-ID] [--key K] [--sound FILE]
//   Claudopus --status        prints on, off, quiet or not-asked
//
// --sound names a sound file in the app's Resources, played with the notification as macOS allows: not when the person turned
// sound off for this app or a Focus silences it.
//
// Flags are read in pairs from the left, so a title or text that looks like a flag is still only a title or text.
// Exit codes: 0 shown, 2 notifications for Claudopus are turned off, 3 not allowed when asked, 4 failed.
// Launched with no arguments, as macOS does on a click, it opens what the clicked notification names and quits.
import AppKit
import UserNotifications

let center = UNUserNotificationCenter.current()
let args = Array(CommandLine.arguments.dropFirst()).filter { !$0.hasPrefix("-psn") }
// Started by macOS for a click, not to post or answer
let isClick = args.isEmpty

func say(_ text: String) { FileHandle.standardError.write("\(text)\n".data(using: .utf8)!) }

// Whether macOS lets Claudopus show a banner: allowed, and its alert style not None
func standing(_ settings: UNNotificationSettings) -> String {
  switch settings.authorizationStatus {
  case .notDetermined: return "not-asked"
  case .denied: return "off"
  case .provisional: return "quiet"
  default: return settings.alertSetting == .disabled ? "off" : "on"
  }
}

final class Delegate: NSObject, NSApplicationDelegate, UNUserNotificationCenterDelegate {
  func applicationWillFinishLaunching(_ notification: Notification) {
    center.delegate = self
  }

  func applicationDidFinishLaunching(_ notification: Notification) {
    if isClick {
      // The click arrives through the delegate; nothing else to do, so quit soon
      DispatchQueue.main.asyncAfter(deadline: .now() + 10) { exit(0) }
      return
    }
    if args == ["--status"] {
      center.getNotificationSettings { settings in
        print(standing(settings))
        exit(0)
      }
      // No answer from macOS, as with no one logged in at the screen: said as off, so the plain notification is tried
      DispatchQueue.main.asyncAfter(deadline: .now() + 5) { print("off"); exit(0) }
      return
    }
    post()
  }

  // A click on one of ours: open the chat it names, or bring its app forward
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler done: @escaping () -> Void) {
    let info = response.notification.request.content.userInfo
    if let url = (info["open"] as? String).flatMap(URL.init(string:)) {
      NSWorkspace.shared.open(url)
    } else if let id = info["activate"] as? String, let app = NSWorkspace.shared.urlForApplication(withBundleIdentifier: id) {
      NSWorkspace.shared.openApplication(at: app, configuration: NSWorkspace.OpenConfiguration())
    }
    done()
    // One still waiting to post keeps waiting
    if isClick { DispatchQueue.main.asyncAfter(deadline: .now() + 1) { exit(0) } }
  }

  // Shown even while this app is the frontmost one
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler done: @escaping (UNNotificationPresentationOptions) -> Void) {
    done([.banner, .list])
  }
}

func post() {
  var given: [String: String] = [:]
  var at = 0
  while at + 1 < args.count {
    given[args[at]] = args[at + 1]
    at += 2
  }
  let content = UNMutableNotificationContent()
  content.title = given["--title"] ?? "Claudopus"
  content.body = given["--text"] ?? ""
  var info: [String: String] = [:]
  if let url = given["--open"] { info["open"] = url }
  if let id = given["--activate"] { info["activate"] = id }
  content.userInfo = info
  if let sound = given["--sound"] { content.sound = UNNotificationSound(named: UNNotificationSoundName(sound)) }
  let request = UNNotificationRequest(identifier: given["--key"] ?? UUID().uuidString, content: content, trigger: nil)
  let send = {
    center.add(request) { error in
      if let error { say(error.localizedDescription) }
      exit(error == nil ? 0 : 4)
    }
  }
  center.getNotificationSettings { settings in
    switch standing(settings) {
    case "off":
      exit(2)
    case "not-asked":
      // The first time macOS asks the person. Its question goes away if this app quits, so the app waits for the answer and
      // shows this notification once allowed; bin/notify starts it apart from the mod for this
      DispatchQueue.main.async { asking = true }
      center.requestAuthorization(options: [.alert, .sound]) { isAllowed, _ in
        if isAllowed { send() } else { exit(3) }
      }
      DispatchQueue.main.asyncAfter(deadline: .now() + 1800) { exit(3) }
    default:
      send()
    }
  }
  // No answer from macOS: failed, so the plain notification is tried
  DispatchQueue.main.asyncAfter(deadline: .now() + 15) {
    if !asking { exit(4) }
  }
}

// Whether this one is waiting on macOS's question; read and set on the main queue
var asking = false

let app = NSApplication.shared
let delegate = Delegate()
app.delegate = delegate
app.setActivationPolicy(.prohibited)
app.run()
