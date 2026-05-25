export interface Bike {
  id: string
  name: string
  brand: string
  year: number
  registrationNumber: string
  price: number
  kmDriven: number
  fuelType: "Petrol" | "Electric" | "Hybrid"
  location: string
  status: "Available" | "Sold Out"
  category: "Sports" | "Scooter" | "Commuter" | "EV"
  images: string[]
  description: string
}

export const bikes: Bike[] = [
  {
    id: "1",
    name: "Pulsar NS200",
    brand: "Bajaj",
    year: 2022,
    registrationNumber: "MH-12-AB-1234",
    price: 95000,
    kmDriven: 12000,
    fuelType: "Petrol",
    location: "Hyderabad",
    status: "Available",
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&h=400&fit=crop"
    ],
    description: "Well maintained bike with all service records"
  },
  {
    id: "2",
    name: "Activa 6G",
    brand: "Honda",
    year: 2023,
    registrationNumber: "TS-09-CD-5678",
    price: 72000,
    kmDriven: 5000,
    fuelType: "Petrol",
    location: "Hyderabad",
    status: "Available",
    category: "Scooter",
    images: [
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&h=400&fit=crop"
    ],
    description: "Like new condition, single owner"
  },
  {
    id: "3",
    name: "Classic 350",
    brand: "Royal Enfield",
    year: 2021,
    registrationNumber: "TS-07-EF-9012",
    price: 145000,
    kmDriven: 18000,
    fuelType: "Petrol",
    location: "Hyderabad",
    status: "Available",
    category: "Commuter",
    images: [
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&h=400&fit=crop"
    ],
    description: "Iconic bike in excellent condition"
  },
  {
    id: "4",
    name: "Ather 450X",
    brand: "Ather",
    year: 2023,
    registrationNumber: "TS-10-GH-3456",
    price: 125000,
    kmDriven: 3000,
    fuelType: "Electric",
    location: "Hyderabad",
    status: "Sold Out",
    category: "EV",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&h=400&fit=crop"
    ],
    description: "Smart electric scooter with fast charging"
  },
  {
    id: "5",
    name: "Apache RTR 200",
    brand: "TVS",
    year: 2022,
    registrationNumber: "TS-08-IJ-7890",
    price: 105000,
    kmDriven: 15000,
    fuelType: "Petrol",
    location: "Hyderabad",
    status: "Available",
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&h=400&fit=crop"
    ],
    description: "Racing inspired design, well maintained"
  },
  {
    id: "6",
    name: "Jupiter 125",
    brand: "TVS",
    year: 2023,
    registrationNumber: "TS-11-KL-2345",
    price: 65000,
    kmDriven: 4000,
    fuelType: "Petrol",
    location: "Hyderabad",
    status: "Available",
    category: "Scooter",
    images: [
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&h=400&fit=crop"
    ],
    description: "Fuel efficient family scooter"
  },
  {
    id: "7",
    name: "FZ-S FI V3",
    brand: "Yamaha",
    year: 2021,
    registrationNumber: "TS-05-MN-6789",
    price: 85000,
    kmDriven: 20000,
    fuelType: "Petrol",
    location: "Hyderabad",
    status: "Available",
    category: "Commuter",
    images: [
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&h=400&fit=crop"
    ],
    description: "Stylish commuter with great mileage"
  },
  {
    id: "8",
    name: "Ola S1 Pro",
    brand: "Ola",
    year: 2023,
    registrationNumber: "TS-12-OP-1234",
    price: 110000,
    kmDriven: 2000,
    fuelType: "Electric",
    location: "Hyderabad",
    status: "Available",
    category: "EV",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&h=400&fit=crop"
    ],
    description: "Premium electric scooter with long range"
  }
]

export const brands = ["Bajaj", "Honda", "Royal Enfield", "TVS", "Yamaha", "Ather", "Ola", "Hero", "Suzuki"]

export const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune", "Ahmedabad", "Lucknow", "Gurgaon", "Kolkata", "Hyderabad"]

export const categories = [
  { name: "Sports Bikes", icon: "Zap", count: 24 },
  { name: "Scooters", icon: "Bike", count: 36 },
  { name: "Commuter Bikes", icon: "Car", count: 48 },
  { name: "EV Bikes", icon: "Battery", count: 12 }
]

export const reviews = [
  {
    id: "1",
    name: "Rahul Sharma",
    location: "Mumbai",
    rating: 5,
    comment: "Excellent service! Bought my dream bike at a great price. Very transparent and professional.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "2",
    name: "Priya Patel",
    location: "Delhi",
    rating: 5,
    comment: "Sold my old scooter hassle-free. They offered the best exchange value in the market.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: "3",
    name: "Amit Kumar",
    location: "Bangalore",
    rating: 4,
    comment: "Wide range of bikes to choose from. Staff was very helpful in finding the right bike for me.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  }
]

export const faqs = [
  {
    question: "How do I buy a bike from BIKES4u?",
    answer: "Simply browse our collection, select a bike you like, and click on WhatsApp Inquiry or View Details. Our team will assist you with the purchase process including documentation and payment."
  },
  {
    question: "Can I exchange my old bike?",
    answer: "Yes! We offer the best exchange value for your old bike. Bring your bike to our showroom for a free evaluation, and you can use the exchange value towards your new purchase."
  },
  {
    question: "What documents are required?",
    answer: "For buying: Aadhar Card, PAN Card, Address Proof. For selling: RC Book, Insurance, Pollution Certificate, and Owner&apos;s Aadhar Card."
  },
  {
    question: "Do you provide warranty?",
    answer: "Yes, we provide a 6-month engine warranty on all bikes. Extended warranty options are also available."
  },
  {
    question: "Can I test ride before buying?",
    answer: "Absolutely! Test rides are available for all bikes at our showroom. Just carry a valid driving license."
  }
]
