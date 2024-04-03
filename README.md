# MealWheel 🥗

**(Frontend Web Dev Bootcamp - Capstone Project)**

## Description

MealWheel streamlines food and grocery planning for your week. With a database of recipes and the option to add your own, it offers an automatic weekly planner and a shopping list that can be easily filled with ingredients for your weekly meals with just one click. You can organize recipes into collections, share your planning and shopping list with friends, and explore many more features designed for convenience.

## Features

- **Personalized Meal Plans:** Generate meal plans for the whole week with one click. Disable the days you don't need and set the servings size individually for each day.
- **Diverse Recipes:** Access a vast library of recipes from various cuisines to explore and try out.
- **Efficient Grocery Shopping:** Automatically generate shopping lists based on your weekly meal plan to save time and reduce waste.
- **Meal Preparation Guides:** Step-by-step guides to assist you in preparing your meals with ease.
- **Community Sharing:** Share your favorite recipes with the MealWheel community and discover new favorites from other users.
- **Household based planning:** Add Friedns to your household to let them see or even participate in planning your meals

**Tech Stack:**

- NextJS | MongoDB | NextAuth | Cloudinary | Github | Vercel | OpenAI
- Dnd-Kit | SWR | Toastify | Mongoose | Styled components

## The Team

Meet the team behind MealWheel!

- [Anna von Oesen](https://github.com/avoesen)
- [Björn Jentschke](https://github.com/Bjoern-Jentschke)
- [Samuel Gesang](https://github.com/gcode-de)

Together we've been working on the app for the course of four weeks during the "capstone phase" of our web dev bootcamp at [NeueFische](https://github.com/neuefische).
We really had an awesome time together, motivated and challenged each other and grew together in a great way!

## Challenges

During the time working on the app we faced some really tricky challenges:

- **Working under realistic conditions:**
  - Formulating user stories for the desired features and having them approved by a third party
  - Drawing wireframes in excalidraw and a design mockup in Figma
  - Keeping an overview with a user story map on figma as well as a kanban board on github
  - Sharing the work using git with many of it's possibilities
  - Having the code for each user story approved in code-reviews (teachers and fellow students)
  - Undergoing quality-assurance in preview deployments
  - Getting new ideas and critical features by interviewing our peers and some test users of the app
- **Getting some critical features to work:**
  - Implementing login and auth with NextAuth
  - Providing image upload and deletion with Cloudinary
  - Orchestrating all the data fetching, filter logic and API routes accessing MongoDB
  - Drag and Drop functionality to assign recipes to a different day in the planner
  - using the OpenAI API to categorize ingredients on the fly
  - separating household data from a user data at a rather late stage of the app development in order to provide some helpful community features 
- **Creating an app people actually want to use:**
  Some of our excitement for this project came from us actually wanting to use it once it would be finished.
  We actively asked friends and family for their input on how to streamline the UX and on what features to include (or maybe delete again).

## Considerations

The emphasis of this app, as well as the web development bootcamp where the three of us met, was on enhancing and showcasing our frontend development skills. Therefore, we prioritized design and functionality over backend architecture and security concerns. While we did invest effort in developing a thoughtfully designed and secure backend, there likely remains significant potential for enhancement in those areas.

## Acknowledgments

A big thank you to all the great coaches teaching us, as well as our fellow students from the "canoe" cohort of frontend web dev.
And of course kudos to the users of MealWheel!
Your support and feedback have been invaluable in making this project a success.

## Feedback

Your feedback is valuable to us! If you have any suggestions for improvement or encounter any issues, please contact us on our profiles.

## Running this app

- clone this repo
- install dependencies
- set up your instances and accounts of MongoDB, Cloudinary, Google OAuth and NextJS and provide the keys, IDs and secrets as seen in the .env.example
