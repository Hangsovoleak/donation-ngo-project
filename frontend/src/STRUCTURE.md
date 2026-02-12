# Frontend Structure (Option A)

This project is split into small folders so each file has one clear purpose.

## `pages/`
Full page screens (Home, Browse, Details, Admin, AdminLogin).  
Pages use services + components to build the UI.

## `components/`
Reusable UI parts (Card, Layout, Footer, Modal, Form).

## `services/`
All API calls live here.
Keeps network logic separate from UI.

## `utils/`
Small helpers used across the app.
Example: token storage helpers.

## `hooks/`
Reusable React logic (custom hooks).
Example: `useRequireAdmin` redirects to login if no token.
