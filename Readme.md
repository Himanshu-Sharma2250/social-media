# 🚀 MERN Community Feed Application

A modern, full-stack social media application that allows users to share posts with text and images, interact via likes and comments, and view community trends through dynamic sorting.

### 🌐 [Live Demo Link](https://your-render-app-link.com) | 💻 [GitHub Repository](https://github.com/your-username/your-repo-name)

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Zustand (State Management), Lucide-React (Icons).
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (Atlas).
* **Media Storage**: Cloudinary (via Multer middleware).
* **Styling**: Standard CSS (No external frameworks like Tailwind/Bootstrap used).

---

## ✨ Key Features

### 1. **Instant UI Updates (No Refresh)**
* **Real-time Feed**: New posts appear at the top of the feed immediately upon submission without a page reload.
* **Engagement Sync**: Likes and comments are managed through a centralized Zustand store, ensuring numbers update instantly across the UI.
* **Optimistic Handling**: State changes are triggered by API responses to keep the frontend in sync with the MongoDB database.

### 2. **Smart Feed Filtering (Tabs)**
The feed includes a dynamic tab system for better content discovery:
* **All Posts**: Shows all community content chronologically.
* **Most Liked**: Sorts the current feed by the highest number of likes.
* **Most Commented**: Sorts posts based on the total comment count.

### 3. **Modern Media Handling**
* **Flexible Posting**: Users can post text-only, image-only, or combined content.
* **Image Previews**: Includes a local preview and removal system before the final upload to Cloudinary.
* **Secure Uploads**: Uses Multer disk storage for temporary file handling before secure cloud storage.

---

## 📋 Project Structure

```text
├── backend/
│   ├── middleware/       # Multer (image handling)
│   ├── routes/           # Post and Auth API endpoints
│   └── controllers/      # Post logic (create, like, comment, delete)
├── frontend/
│   ├── src/
│   │   ├── components/   # CreatePost, PostCard
│   │   ├── store/        # Zustand usePostStore.js
│   │   └── pages/        # FeedPage sorting logic