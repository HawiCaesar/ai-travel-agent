# Travel Agent AI - Implementation Plan

## Project Overview
Build a mobile-first travel planning application using React and Vite with three main screens. The app will collect travel information from users and display trip recommendations (using mock data initially, with OpenAI integration potential for later).

## Technology Stack
- **Framework**: React 18+ with Vite + TypeScript
- **Styling**: TailwindCSS (for utility-first styling)
- **Routing**: React Router DOM (for page navigation)
- **State Management**: React Context API or simple prop drilling (lightweight approach)
- **API**: OpenAI (already in dependencies, integration planned for later phase)

## Dependencies to Install
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "tailwindcss": "^3.3.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.31",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "typescript": "^5.0.0"
}
```

## Project Structure
```
/src
  /components
    - Button.tsx (reusable button component)
  /pages
    - LandingPage.tsx (screen-1)
    - TravelFormPage.tsx (screen-2)
    - ResultsPage.tsx (screen-3)
  /context
    - TravelContext.tsx (for managing form data across pages)
  /types
    - index.ts (TypeScript type definitions)
  /utils
    - dateFormatters.ts (date formatting utility functions)
  - App.tsx (main app with routing)
  - main.tsx (entry point)
  - vite-env.d.ts (Vite type declarations)
/public
  - ai-travel-agent-logo.png (logo - 380x380px, move to public folder)
- index.html (update with root div)
- index.css (configure for Tailwind)
- tailwind.config.js (new)
- postcss.config.js (new)
- tsconfig.json (new - TypeScript configuration)
- tsconfig.node.json (new - TypeScript config for Vite)
```

## Page Breakdown

### Page 1: Landing Page (screen-1.png)
**Components:**
- Logo display (ai-travel-agent-logo.png - 380x380px from /public folder)
- "Let's Begin" button
- Simple, clean mobile layout

**Functionality:**
- Display logo centered with proper sizing (380x380px)
- Button navigates to Travel Form page (/plan route)
- Mobile-optimized spacing and sizing
- Estimate color scheme from mockup (will be provided later)

---

### Page 2: TravelFormPage.tsx (screen-2.png)
**Form Inputs:**
1. **Number of Travelers**
   - Type: number input
   - Validation: positive integers only (inline validation)
   - Custom styling to match design

2. **Flying From**
   - Type: text input
   - Placeholder: departure city
   - Required field (inline validation)

3. **Flying To**
   - Type: text input
   - Placeholder: destination city
   - Required field (inline validation)

4. **From Date**
   - Type: HTML5 date input
   - Format: dd/MM/YYYY
   - No external library needed
   - Required field (inline validation)

5. **To Date**
   - Type: HTML5 date input
   - Format: dd/MM/YYYY
   - Validation: must be after "From Date" (inline validation)
   - Required field

6. **Budget**
   - Type: number input
   - Prefix: "$" symbol
   - Validation: positive numbers only (inline validation)
   - Required field

**Functionality:**
- **Inline form validation** - show errors as user fills out form
- Store form data in context/state
- "Plan my Trip!" button navigates to Results page (/results route)
- All inputs should be accessible (aria-labels, proper focus states)
- Forward navigation only (no back button for now)

---

### Page 3: ResultsPage.tsx (screen-3.png)
**Display Sections:**
1. **Trip Summary**
   - Dates: "25th Nov 23 - 5th Dec 25" (mock data, format: "25th Nov 23")
   - Route: "Nairobi to Accra" (mock data)

2. **Weather Information**
   - Text: "You can expect the weather to be quite mild. Low will be 19° and high will be 25°"
   - Icon/visual element (optional)

3. **Flight Recommendations**
   - Text: "The best option for you is with Kenya Airways with no layover"
   - Styled card/section

4. **Hotel Recommendations**
   - Text: "We recommend you stay at the The Pelican Hotel Cantonments Accra"
   - Styled card/section

**Functionality:**
- Display all mock data in organized sections (NO OpenAI integration yet)
- Mobile-optimized cards/sections
- Estimate color schemes from mockup
- Optional: "Plan another trip" button to return to landing page

---

## Implementation Phases

### Phase 1: Project Setup & Configuration
1. Install React, React DOM, and TypeScript dependencies
2. Install TypeScript types (@types/react, @types/react-dom)
3. Create tsconfig.json and tsconfig.node.json
4. Install and configure TailwindCSS with PostCSS
5. Set up Vite configuration for React + TypeScript
6. Create folder structure (components, pages, context, types)
7. Move ai-travel-agent-logo.png to /public folder
8. Update index.html with root div
9. Configure Tailwind in index.css
10. Create vite-env.d.ts for Vite types

### Phase 2: TypeScript Type Definitions & Utilities
1. Create /src/types/index.ts
2. Define TravelFormData interface
3. Define validation error types
4. Define any shared prop types
5. Create /src/utils/dateFormatters.ts
6. Implement date conversion utilities:
   - Convert YYYY-MM-DD to dd/MM/YYYY
   - Convert to "25th Nov 23" format for ResultsPage
   - Date validation helper functions

### Phase 3: Routing Setup
1. Install React Router DOM
2. Create App.tsx with routing structure
3. Define routes for three pages:
   - `/` → LandingPage.tsx
   - `/plan` → TravelFormPage.tsx
   - `/results` → ResultsPage.tsx
4. Create main.tsx entry point

### Phase 4: State Management
1. Create TravelContext.tsx for sharing form data
2. Set up context provider in App.tsx
3. Define state structure with TypeScript types:
   ```typescript
   {
     travelers: number;
     flyingFrom: string;
     flyingTo: string;
     fromDate: string; // dd/MM/YYYY format
     toDate: string; // dd/MM/YYYY format
     budget: number;
   }
   ```

### Phase 5: Page 1 - Landing Page
1. Create LandingPage.tsx component
2. Add logo image from /public folder (380x380px)
3. Create "Let's Begin" button with navigation to /plan
4. Style for mobile (centered, good spacing)
5. Estimate colors from mockup
6. Ensure accessibility (button focus states, aria-labels)

### Phase 6: Page 2 - TravelFormPage.tsx
1. Create TravelFormPage.tsx component
2. Build form with all 6 input fields (TypeScript typed)
3. Implement **inline validation** for:
   - Numbers only for travelers and budget
   - Date validation (to date > from date)
   - Required field checks
   - Show validation errors as user types/blurs
4. Style inputs to match design mockup
5. Add "$" prefix styling for budget field
6. Connect form to context/state
7. Implement date formatting (dd/MM/YYYY display)
8. Implement "Plan my Trip!" button with validation
9. Add proper accessibility attributes
10. Forward navigation only (no back button)

### Phase 7: Page 3 - ResultsPage.tsx
1. Create ResultsPage.tsx component
2. Structure sections for:
   - Trip summary (dates in "25th Nov 23" format and route)
   - Weather information
   - Flight recommendations
   - Hotel recommendations
3. Use mock data as specified in INIT.md (NO OpenAI yet)
4. Style cards/sections for mobile
5. Estimate colors from mockup
6. Ensure proper spacing and readability

### Phase 8: Styling & Polish
1. Apply TailwindCSS classes throughout all components
2. Ensure mobile responsiveness (max-width constraints)
3. Add hover/focus states for interactive elements
4. Test navigation flow between all pages
5. Verify all mockup designs are matched
6. Refine color schemes (await specific colors from client)

### Phase 9: Testing & Refinement
1. Test all inline form validations
2. Test navigation between pages (forward only)
3. Verify data persistence across pages via context
4. Check accessibility (tab navigation, screen readers)
5. Test on different mobile screen sizes
6. Verify TypeScript compilation with no errors
7. Fix any UI/UX issues

---

## Design Considerations

### Mobile-First Approach
- Max width container (e.g., 480px)
- Centered layout
- Touch-friendly button sizes (min 44x44px)
- Adequate spacing between elements
- Large, readable fonts

### Accessibility
- Semantic HTML elements
- Proper aria-labels on all inputs
- Keyboard navigation support (tabindex)
- Focus visible styles
- Form validation messages

### Code Quality
- Use early returns for cleaner code
- Descriptive variable/function names
- Event handlers prefixed with "handle" (handleClick, handleSubmit)
- Use const for function definitions
- DRY principle (reusable components)
- Proper TypeScript types and interfaces for all components
- Type safety for props, state, and context

---

## Future Enhancements (Not in Current Scope)
- OpenAI integration for dynamic recommendations (deferred to later phase)
- Real flight/hotel API integration
- Back button navigation functionality
- Save trip functionality
- Multiple trip comparisons
- User authentication
- Trip history

---

## Client Requirements & Decisions

### Confirmed Requirements:
1. **Language**: TypeScript (not plain JavaScript)
2. **File Naming**: TravelFormPage.tsx for screen-2
3. **Logo**: 380x380px, stored in /public folder
4. **Components**: No Header component needed
5. **Validation**: Inline validation (show errors as user interacts)
6. **Navigation**: Forward navigation only (back button deferred)
7. **Date Formats**: 
   - TravelFormPage.tsx: dd/MM/YYYY format
   - ResultsPage.tsx: "25th Nov 23" format
8. **API Integration**: OpenAI integration deferred to later phase
9. **Data**: Use mock data for initial implementation

### Pending/To Be Provided:
1. **Color Schemes**: Specific colors to be provided later (estimate from mockups for now)
2. **Fonts**: To be confirmed (use web-safe fonts or estimate from mockups)
3. **Exact Spacing**: Estimate from mockups, will refine when provided

---

## Estimated Timeline
- Phase 1 (Setup & Config): 45 minutes (includes TypeScript setup)
- Phase 2 (Types & Utilities): 20 minutes (includes date formatters)
- Phase 3 (Routing): 20 minutes
- Phase 4 (State Management): 25 minutes
- Phase 5 (Landing Page): 30 minutes
- Phase 6 (TravelFormPage): 120 minutes (includes inline validation)
- Phase 7 (ResultsPage): 60 minutes
- Phase 8 (Styling & Polish): 60 minutes
- Phase 9 (Testing & Refinement): 45 minutes

**Total**: ~6.5-7 hours of development time

---

## Notes
- Keep components simple and focused
- Follow React best practices
- Maintain consistent code style
- Comment complex logic
- Ensure all code is production-ready (no TODOs or placeholders)

## Important Implementation Notes

### Date Handling
- HTML5 date inputs use `YYYY-MM-DD` format internally
- Need to convert between formats:
  - Display format on TravelFormPage: dd/MM/YYYY
  - Display format on ResultsPage: "25th Nov 23"
  - Storage format: Can use ISO format or store as entered
- Create utility functions for date formatting/conversion

### Logo
- Currently located in root directory
- Move to `/public` folder during setup
- Size: 380x380px
- Display using relative path: `/ai-travel-agent-logo.png`

### Color Estimation
- Analyze mockup images (screen-1.png, screen-2.png, screen-3.png)
- Extract approximate color values for:
  - Background colors
  - Text colors
  - Button colors
  - Input field borders
  - Accent colors
- Document estimated colors for easy replacement when actual colors provided

