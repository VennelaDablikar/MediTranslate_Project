# Modern UI/UX Design Prompt for MediTranslate

Here is a comprehensive prompt you can use with AI image generators (like Midjourney, DALL-E 3, or Stable Diffusion) to visualize this design, along with specific style guidelines for implementation.

## 🎨 The One-Shot Prompt
> **"High-fidelity modern medical web app interface design for 'MediTranslate'. Classy and professional aesthetic. Style: Soft Glassmorphism combined with clean Swiss design/Bento Grid layout. Color Palette: Sophisticated Emerald Green (#10B981) or Deep Teal accents on a crisp white and light grey background with deep navy text. Main visual: A central, elegant 'scan & translate' dashboard. Input area: A sleek, frosted-glass file upload zone with a subtle animated scanning laser effect. Output area: Clean, card-based results displaying 'Medicines' and 'Dosages' with beautiful iconography. Typography: Premium Sans-Serif (e.g., Inter or SF Pro). detailed, 8k resolution, Dribbble trending, UI/UX masterpiece, soft diffuse lighting."**

---

## 💎 Design Guidelines & Specification

### 1. Visual Style: "Medical Glass & Air"
*   **Concept**: Trustworthy, sterile but warm, high-tech.
*   **Background**: Subtle, abstract mesh gradients using very faint teals and whites. Avoid flat white; use `bg-slate-50` or similar.
*   **Cards**: White cards with high border-radius (`rounded-2xl` or `rounded-3xl`), soft drop shadows (`shadow-lg`), and a subtle white inner border to create depth.
*   **Glassmorphism**: Use strictly for overlay elements (like the upload modal or sticky headers). `backdrop-filter: blur(12px)` with `bg-white/70`.

### 2. Color Palette (Classy & Professional)
*   **Primary (Action)**: `#0F766E` (Teal-700) to `#14B8A6` (Teal-500) gradients. Avoid standard "hospital green".
*   **Secondary (Information)**: `#3B82F6` (Royal Blue) for "Scanning" or "Processing" states.
*   **Surface**: `#FFFFFF` (White) and `#F8FAFC` (Slate-50).
*   **Text**: `#1E293B` (Slate-800) for headings, `#64748B` (Slate-500) for secondary text. **Never pure black.**

### 3. Typography
*   **Font Family**: `Plus Jakarta Sans` or `Inter`. These are geometric, modern, and highly legible.
*   **Weights**: Use heavy weights (Bold/800) for big numbers (e.g., "3 Medicines Found") and light weights for labels.

### 4. Animations (The "Wow" Factor)
*   **Hero Section**: Text that fades in and slides up (`animate-in fade-in slide-in-from-bottom-4`).
*   **Upload Zone**:
    *   *Idle*: Gentle breathing pulse on the border.
    *   *Active Drag*: Border turns solid primary color and scales up slightly (`scale-105`).
*   **Scanning State**: A "laser line" scanning down the uploaded image (CSS `top-0` to `bottom-full` infinite loop).
*   **Results Cards**: Staggered entrance animation. Card 1 slides in, then Card 2 (100ms delay), then Card 3 (200ms delay).

### 5. Layout Suggestion (Bento Grid)
instead of a long scrolling page, use a **Bento Grid** dashboard:
*   [ **Upload Area (Large)** ] [ History (Small) ]
*   [ **Recent Scan Summary** ] [ Quick Stats ]
