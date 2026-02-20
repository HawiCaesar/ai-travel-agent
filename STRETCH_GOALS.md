# Travel Agent with Open AI

The app is up and running as per core requirements.
Look through the files within the folder to familiarise to yourself the the available files and folders.

I want to add some nice to add features.
- Let's have a disabled state when the "Plan my trip" button is clicked. The button in the disabled state can be gray.
- Let's have a "Go Back" button to the ResultsPage.tsx to allow the user to redo some planning.
  - This button will reset all the details in the TravelFormPage.tsx
- Let's add a vacation type radio button. Add this before the number of travelers input. The options are "solo traveler", "couples adventure", "family time"
  - When the user selects "solo vacation" -  The number of travelers input changes to 1 and cant be updated unless another vacation type is selected
  - When the user selects "couple" - The number of travelers input can be 2 or more. It cant be less than 2.

- After the Hotel section card, have another card that will list 3 activities to do at the destination. The card colour scheme should be the same as the Hotel and Flight card sections
  - use this dummy text for now
  "
    "🖼️ Visit the W.E.B Du Bois Center for cultural enrichment",
    "🌴 Explore Labadi Beach for a peaceful solo retreat",
    "🍽️ Enjoy gourmet dining experiences at the hotel restaurant"
  "
- Let's add a 2 share buttons. One for X and Instagram that will share the ResultsPage.tsx User Interface with the social media platforms mentioned.