const mongoose = require('mongoose');
const connectDatabase = require('./config/database');
const Place = require('./models/Place');
const User = require('./models/User');
require('dotenv').config();

const realCanadianPlaces = [
    {
        title: "Fairmont Château Laurier",
        address: "1 Rideau St, Ottawa, ON K1N 8S7",
        description: "Experience the grandeur of Ottawa's castle in the city. Located next to the Parliament Buildings and the Rideau Canal, this historic hotel offers elegant rooms and world-class dining.",
        price: 450,
        photos: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/182560371.jpg?k=a263229871583097103756776106263529369324734617478333903126049282&o=&hp=1"],
        perks: ["wifi", "parking", "pool", "tv", "entrance"],
        extraInfo: "Historic site using French Renaissance architecture.",
        checkIn: "15:00",
        checkOut: "12:00",
        maxGuests: 4
    },
    {
        title: "Banff Springs Hotel",
        address: "405 Spray Ave, Banff, AB T1L 1J4",
        description: "The 'Castle in the Rockies', a Scottish Baronial style hotel located in Banff National Park. Enjoy skiing, hot springs, and breathtaking mountain views.",
        price: 600,
        photos: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/48900018.jpg?k=e1866440e6760086381467471908253f50058223654495576185816773560706&o=&hp=1"],
        perks: ["wifi", "pool", "spa", "entrance"],
        extraInfo: "Located within a UNESCO World Heritage Site.",
        checkIn: "16:00",
        checkOut: "11:00",
        maxGuests: 5
    },
    {
        title: "Spectacular CN Tower View Condo",
        address: "300 Front St W, Toronto, ON M5V 0E9",
        description: "Modern high-rise apartment right in the heart of downtown Toronto. Floor-to-ceiling windows offering a direct view of the CN Tower and Rogers Centre.",
        price: 280,
        photos: ["https://a0.muscache.com/im/pictures/miso/Hosting-53293652/original/11051515-3816-4192-9572-88126350e976.jpeg?im_w=720"],
        perks: ["wifi", "kitchen", "tv", "entrance"],
        extraInfo: "Walking distance to Union Station and Aquarium.",
        checkIn: "14:00",
        checkOut: "10:00",
        maxGuests: 3
    },
    {
        title: "Old Quebec City Loft",
        address: "24 Rue Sainte-Anne, Québec, QC G1R 3X3",
        description: "Charming loft with exposed brick walls in the heart of Old Quebec. Steps away from Château Frontenac and Petit Champlain.",
        price: 220,
        photos: ["https://a0.muscache.com/im/pictures/miso/Hosting-46695796/original/9bd67173-2073-450d-8538-40d998166a4a.jpeg?im_w=720"],
        perks: ["wifi", "pets", "kitchen"],
        extraInfo: "Valid permit number for short-term rental.",
        checkIn: "15:00",
        checkOut: "11:00",
        maxGuests: 4
    },
    {
        title: "Whistler Ski-in Ski-out Chalet",
        address: "4545 Blackcomb Way, Whistler, BC V8E 0X9",
        description: "Luxurious timber-framed chalet located on Blackcomb Mountain. Direct access to slopes, private hot tub, and stone fireplace.",
        price: 850,
        photos: ["https://a0.muscache.com/im/pictures/prohost-api/Hosting-53434693/original/6c426685-6454-44b4-8468-0e3198063590.jpeg?im_w=720"],
        perks: ["wifi", "parking", "pool", "kitchen", "entrance"],
        extraInfo: "Minimum 3-night stay during winter season.",
        checkIn: "16:00",
        checkOut: "10:00",
        maxGuests: 8
    },
    {
        title: "Vancouver Waterfront Studio",
        address: "1000 Beach Ave, Vancouver, BC V6E 4M9",
        description: "Sleek studio apartment overlooking English Bay. Enjoy sunsets from your balcony and cycle along the Seawall right outside your door.",
        price: 310,
        photos: ["https://a0.muscache.com/im/pictures/miso/Hosting-694461366579848520/original/0383794e-289b-4402-9a3e-486121541c8f.jpeg?im_w=720"],
        perks: ["wifi", "parking", "kitchen"],
        extraInfo: "Quiet building, no parties allowed.",
        checkIn: "15:00",
        checkOut: "11:00",
        maxGuests: 2
    },
    {
        title: "Niagara Falls Skyline Suite",
        address: "6700 Fallsview Blvd, Niagara Falls, ON L2G 3W6",
        description: "High-floor suite with a panoramic view of the Horseshoe Falls. Perfect for a romantic getaway with Jacuzzi and fireplace.",
        price: 350,
        photos: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/49842521.jpg?k=b8387071983050b171638361716386120173617368&o=&hp=1"],
        perks: ["wifi", "parking", "pool", "tv"],
        extraInfo: "Walking distance to the casino and Clifton Hill.",
        checkIn: "15:00",
        checkOut: "11:00",
        maxGuests: 2
    },
    {
        title: "Halifax Harbourfront Apartment",
        address: "1325 Lower Water St, Halifax, NS B3J 3R3",
        description: "Enjoy the maritime sights and sounds from this modern apartment on the Halifax boardwalk. Close to Maritime Museum and local breweries.",
        price: 190,
        photos: ["https://a0.muscache.com/im/pictures/miso/Hosting-52467364/original/1231f67f-9f79-4279-b873-67727187162z.jpeg?im_w=720"],
        perks: ["wifi", "kitchen", "entrance", "tv"],
        extraInfo: "Fantastic seafood restaurants nearby.",
        checkIn: "14:00",
        checkOut: "11:00",
        maxGuests: 4
    },
    {
        title: "Prince Edward Island Beach House",
        address: "123 Cavendish Rd, Cavendish, PE C0A 1N0",
        description: "Classic red sand beach house near Green Gables Heritage Place. Spacious deck, ocean breeze, and peaceful surroundings.",
        price: 250,
        photos: ["https://a0.muscache.com/im/pictures/4737d674-c3c2-4c28-986c-033104646546.jpg?im_w=720"],
        perks: ["wifi", "parking", "kitchen", "entrance"],
        extraInfo: "Weekly rentals only during July and August.",
        checkIn: "16:00",
        checkOut: "10:00",
        maxGuests: 6
    },
    {
        title: "Jasper National Park Cabin",
        address: "1 Pyramid Lake Rd, Jasper, AB T0E 1E0",
        description: "Cozy rustic cabin surrounded by pine trees and mountains. Ideal base for hiking, wildlife viewing, and stargazing in the Dark Sky Preserve.",
        price: 320,
        photos: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/402377884.jpg?k=ca3187186632422538183884877227488344&o=&hp=1"],
        perks: ["parking", "pets", "total_quiet"],
        extraInfo: "Firewood provided.",
        checkIn: "15:00",
        checkOut: "11:00",
        maxGuests: 5
    },
    {
        title: "Montreal Plateau Artistic Flat",
        address: "4200 Blvd Saint-Laurent, Montréal, QC H2W 2R2",
        description: "Vibrant and colorful flat in the trendy Plateau-Mont-Royal district. Surrounded by murals, cafes, and vintage shops.",
        price: 140,
        photos: ["https://a0.muscache.com/im/pictures/miso/Hosting-39036738/original/6c906666-4122-4217-916c-039126388675.jpeg?im_w=720"],
        perks: ["wifi", "kitchen", "tv"],
        extraInfo: "Third floor walk-up.",
        checkIn: "15:00",
        checkOut: "12:00",
        maxGuests: 2
    },
    {
        title: "Tofino Oceanfront Resort",
        address: "500 Osprey Ln, Tofino, BC V0R 2Z0",
        description: "Experience the wild west coast at this surfing paradise. Direct beach access, storm watching views, and luxury amenities.",
        price: 550,
        photos: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/172354728.jpg?k=12747d258162817282828482811822838381273727&o=&hp=1"],
        perks: ["wifi", "parking", "pool", "pets"],
        extraInfo: "Wetsuit rentals available on site.",
        checkIn: "16:00",
        checkOut: "11:00",
        maxGuests: 4
    },
    {
        title: "Downtown Calgary Executive Suite",
        address: "220 12 Ave SW, Calgary, AB T2R 0E9",
        description: "Upscale suite in the Beltline district. Walking distance to the Calgary Tower, Saddleledome, and 17th Avenue nightlife.",
        price: 200,
        photos: ["https://a0.muscache.com/im/pictures/miso/Hosting-53846660/original/36186214-4112-4222-9226-112673281736.jpeg?im_w=720"],
        perks: ["wifi", "parking", "kitchen", "pool"],
        extraInfo: "Gym access included.",
        checkIn: "15:00",
        checkOut: "11:00",
        maxGuests: 2
    },
    {
        title: "St. John's Jellybean Row House",
        address: "10 Gower St, St. John's, NL A1C 1N1",
        description: "Stay in a famous vibrant colored heritage home. Full of character, close to Signal Hill and George Street.",
        price: 160,
        photos: ["https://a0.muscache.com/im/pictures/5b826628-8686-4866-9812-321263812638.jpg?im_w=720"],
        perks: ["wifi", "kitchen", "tv", "entrance"],
        extraInfo: "On-street parking permit provided.",
        checkIn: "14:00",
        checkOut: "11:00",
        maxGuests: 5
    },
    {
        title: "Lake Louise Lakeside Lodge",
        address: "111 Lake Louise Dr, Lake Louise, AB T0L 1E0",
        description: "Iconic lodge facing the turquoise waters of Lake Louise and Victoria Glacier. World-class hiking and canoeing at your doorstep.",
        price: 700,
        photos: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/37397669.jpg?k=8883737299298382191929388337371818299293&o=&hp=1"],
        perks: ["wifi", "parking", "pool", "spa"],
        extraInfo: "Shuttle required to Moraine Lake.",
        checkIn: "16:00",
        checkOut: "11:00",
        maxGuests: 4
    }
];

const seed = async () => {
    try {
        await connectDatabase();

        const user = await User.findOne({ email: 'admin@admin.com' });
        if (!user) {
            console.log("User admin@admin.com not found. Please ensure this user exists.");
            process.exit(1);
        }

        // Clean up old auto-generated records
        const deleteResult = await Place.deleteMany({ title: { $regex: 'Auto-Generated', $options: 'i' }, owner: user._id });
        console.log(`Deleted ${deleteResult.deletedCount} old auto-generated places.`);

        const places = realCanadianPlaces.map(place => ({
            ...place,
            owner: user._id
        }));

        await Place.insertMany(places);
        console.log(`Successfully added ${places.length} new realistic Canadian places!`);
    } catch (error) {
        console.error("Error seeding places:", error);
    } finally {
        try {
            await mongoose.connection.close();
            console.log("Database connection closed.");
        } catch (err) {
            console.error("Error closing connection:", err);
        }
    }
};

seed();
