DrinkUp! 🌊
AI-Verified Hydration Tracking for iOS
Hi, I'm Patrick! 👋

I built DrinkUp! because I realized I had a problem: I have "notification blindness." Every time my old water app buzzed, I’d just tap "Confirm" to make it shut up, but I wouldn't actually drink. I was cheating my own data.

I wanted to engineer a solution that forces accountability through computer vision, or what I like to call "Proof of Consumption."

🚀 What makes this different?
Most habit trackers are just glorified spreadsheets. DrinkUp! is an interactive verification engine.

No Honor System: You can't just tap a button. You have to snap a "Before" (full bottle) and "After" (empty bottle) photo.

Powered by Gemini: I'm using Google Gemini 1.5 Flash to analyze the volume difference between the two images in real-time.

The "Chrono-Fluid" UI: I got bored of standard dashboards, so I built a custom fluid interface using the new iOS 18 MeshGradient API. The background water level rises and breathes based on your actual hydration status.

🛠️ The Tech Stack
I used this project to dive deep into Swift 6 Strict Concurrency and modern architectural patterns:

Framework: SwiftUI (iOS 17+)

AI Backend: Google Generative AI SDK (Gemini 1.5 Flash)

Persistence: SwiftData

Camera: Custom AVFoundation implementation (with a "Ghost" overlay for alignment)

Architecture: MVVM + Service Locator Pattern
