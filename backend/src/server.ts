import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT ?? 5000);

const events = [
  {
    id: 1,
    title: "Sunset Sounds Festival",
    category: "Music",
    date: "2026-10-18T18:00:00",
    location: "Riverside Park, Seattle",
    price: 72,
    seatsLeft: 140,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    description: "An outdoor evening featuring indie artists, laser visuals, and food trucks.",
  },
  {
    id: 2,
    title: "AI Product Launch Week",
    category: "Tech",
    date: "2026-11-04T09:30:00",
    location: "Pioneer Hall, San Francisco",
    price: 139,
    seatsLeft: 64,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    description: "Meet founders, hear live demos, and network with builders across the AI economy.",
  },
  {
    id: 3,
    title: "Chef's Table: Fire & Flavor",
    category: "Food & Drink",
    date: "2026-11-21T19:30:00",
    location: "The Harbor Loft, Chicago",
    price: 89,
    seatsLeft: 28,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
    description: "A multi-course tasting event with local chefs, wine pairings, and live jazz.",
  },
  {
    id: 4,
    title: "Designing for Human Connection",
    category: "Workshop",
    date: "2026-12-03T13:00:00",
    location: "North Studio, New York",
    price: 54,
    seatsLeft: 42,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    description: "A practical workshop on product storytelling, collaboration, and inclusive design.",
  },
];

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "EventHub backend is running!",
  });
});

app.get("/api/events", (_req, res) => {
  res.json({
    success: true,
    count: events.length,
    events,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});