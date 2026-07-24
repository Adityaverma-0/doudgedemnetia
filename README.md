# DodgeDementia (MindCare AI)

DodgeDementia (MindCare AI) is an Early Dementia Detection & Support System built with HTML, CSS, and vanilla JavaScript. It monitors patients' cognitive health and provides tools/assessments to track and support their journey.

## Features

- **Multi-Role Login System**: Customized dashboards for:
  - **Patients**: Play memory games, cognitive puzzles, and chat with AI cognitive aids.
  - **Caregivers**: Track their loved ones' test scores, monitor current risk, and set up reminders.
  - **Doctors**: Secure clinical portal with dual-factor access (MFA), overview of patient lists, cognitive profiles, and printable reports.
- **Interactive Cognitive Activities**:
  - **Memory Match Game** (Memory Recall and Focus accuracy)
  - **Pattern Recognition** (Sequence solving logic)
  - **Story Quiz** (Verbal memory and comprehension)
- **Local Storage Integration**: Direct synchronization between the patient's game scores and the caregiver/doctor dashboards.

## Project Structure

```
├── index.html          # Main login & entry point (formerly login.html)
├── signup.html         # User registration page
├── Patientdash.html    # Patient progress dashboard & AI chat
├── Cargiver.html       # Caregiver monitoring dashboard
├── Doctor.html         # Clinical portal for medical professionals
├── Memorygame.html     # Cognitive activity: Memory match
├── parttern.html       # Cognitive activity: Pattern recognition (missing piece)
├── StoryQuize.html     # Cognitive activity: Verbal storytelling recall
├── login.css           # Styling for login and registration portals
├── Cargiver.css        # Styling for caregiver interface
├── Doctor.css          # Styling for clinical interface
├── login.js            # Authentication logic and role redirection
├── Cargiver.js         # Caregiver activity timelines and chart visualization
└── Doctor.js           # Doctor dashboard chart rendering and PDF export
```

## Running Locally

To run the application locally, you can use any static file web server:

### Option A: Python HTTP Server (Built-in)
Run the following command in your terminal:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Option B: Node http-server
If you have Node.js installed, you can use:
```bash
npx http-server -p 8000
```
Then visit `http://localhost:8000` in your web browser.

## Deployment

This website is configured and ready for deployment to static hosting platforms like **Firebase Hosting**, **GitHub Pages**, or **Netlify**.

### Deploy to Firebase Hosting
1. Install Firebase Tools globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to your Firebase account:
   ```bash
   firebase login
   ```
3. Deploy the project:
   ```bash
   firebase deploy
   ```
