# 🚀 Demo Mode Setup - No Backend Required!

This guide will help you run the Travel Bucket List app in demo mode without configuring any backend services.

## Quick Start (Demo Mode)

### 1. Install Dependencies

```bash
cd travel
npm run install-all
```

### 2. Start the Frontend (Demo Mode)

```bash
cd frontend
npm start
```

That's it! The app will run at `http://localhost:3000`

## What Works in Demo Mode

✅ **User Authentication** - Mock login/signup (any email/password works)  
✅ **Destination Management** - Add, edit, delete destinations  
✅ **Search & Filter** - Search by name, filter by region/category  
✅ **Image Upload** - Mock image upload (shows placeholder images)  
✅ **Responsive Design** - Full mobile-friendly interface  
✅ **All UI Features** - Complete user experience  

## Demo Features

### Pre-loaded Sample Data
- **Paris, France** - Not visited, City category
- **Tokyo, Japan** - Visited, City category  
- **Santorini, Greece** - Not visited, Beach category

### Mock Authentication
- Use any email and password to sign in
- Data persists in browser localStorage
- No real authentication required

### Mock Image Upload
- Upload shows placeholder images
- Unsplash search returns sample images
- All image functionality works visually

## How to Use the Demo

1. **Start the app**: `cd frontend && npm start`
2. **Sign up/Login**: Use any email (e.g., `demo@example.com`) and password
3. **Explore destinations**: View the pre-loaded sample destinations
4. **Add new destinations**: Click "Add Destination" to create new ones
5. **Search & filter**: Use the search bar and filters to find destinations
6. **Mark as visited**: Click the circle icon to toggle visited status
7. **Edit destinations**: Click the edit icon to modify destinations
8. **Upload images**: Try uploading images (will show placeholders)

## Demo Limitations

- Data is stored in browser localStorage (clears when you clear browser data)
- Images are placeholder images, not real uploads
- No real external API calls
- No persistent database

## Switching to Full Mode

To use the full application with real backend services:

1. Set up Supabase project
2. Configure AWS S3 bucket
3. Get Unsplash API key
4. Update environment variables
5. Switch back to using `../services/api` instead of `../services/mockApiService`

## Troubleshooting

**App won't start?**
- Make sure you're in the `frontend` directory
- Run `npm install` first
- Check that Node.js is installed

**Data not persisting?**
- This is normal in demo mode
- Data is stored in browser localStorage
- Clear browser data will reset everything

**Images not showing?**
- Demo mode uses placeholder images
- This is expected behavior
- Real images require backend setup

Enjoy exploring the Travel Bucket List app! 🎉
