import { ID } from "react-native-appwrite";
import { databases, config } from './appwrite';
import {agentImages, galleryImages, propertiesImages, reviewImages} from "@/lib/data";


const COLLECTIONS = {
    AGENT: config.agentsCollectionId,
    REVIEWS: config.reviewsCollectionId,
    GALLERY: config.galleriesCollectionId,
    PROPERTY: config.propertiesCollectionId,
};

const propertyTypes = [
    "House",
    "Townhouse",
    "Condos",
    "Duplexes",
    "Studios",
    "Villa",
    "Apartments",
    "Others"
];

const facilities = [
    "Laundry",
    "CarParking",
    "SportsCenter",
    "Cutlery",
    "Gym",
    "SwimmingPool",
    "Wifi",
    "PetCenter"
];


function getRandomSubset<T>(array: T[], minItems: number, maxItems: number): T[] {
    if (minItems > maxItems) {
        throw new Error("minItems cannot be greater than maxItems");
    }
    if (minItems < 0 || maxItems > array.length) {
        throw new Error("minItems or maxItems are out of valid range for the array");
    }

    // Generate a random size for the subset within the range [minItems, maxItems]
    const subsetSize = Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

    const arrayCopy = [...array];

    // Shuffle the array copy using Fisher-Yates algorithm
    for (let i = arrayCopy.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [arrayCopy[i], arrayCopy[randomIndex]] = [arrayCopy[randomIndex], arrayCopy[i]];
    }

    return arrayCopy.slice(0, subsetSize);
}

async function seed() {
    try {
        // Clear existing data from all collections
        for (const key in COLLECTIONS) {
            const collectionId = COLLECTIONS[key as keyof typeof COLLECTIONS];
            const documents = await databases.listDocuments(
                config.databaseId!,
                collectionId!,
            );
            for (const doc of documents.documents) {
                await databases.deleteDocument(
                    config.databaseId!,
                    collectionId!,
                    doc.$id
                );
            }
        }

        console.log("Clear all existing data.");

        // Seed Agents
        const agents = [];
        for (let i = 1; i <= 5; i++) {
            const agent = await databases.createDocument(
                config.databaseId!,
                COLLECTIONS.AGENT!,
                ID.unique(),
                {
                    name: `Agent ${i}`,
                    email: `agent${i}@example.com`,
                    avatar: agentImages[Math.floor(Math.random() * agentImages.length)],
                }
            );
            agents.push(agent);
        }
        console.log(`Seeded ${agents.length} agents.`);

        // Seed Reviews
        const reviews = [];
        for (let i = 1; i <= 20; i++) {
            const review = await databases.createDocument(
                config.databaseId!,
                COLLECTIONS.REVIEWS!,
                ID.unique(),
                {
                    name: `Reviewer ${i}`,
                    avatar: reviewImages[Math.floor(Math.random() * reviewImages.length)],
                    review: `This is a review by Reviewer ${i}.`,
                    rating: Math.floor(Math.random() * 5) + 1,
                }
            );
            reviews.push(review);
        }
        console.log(`Seeded ${reviews.length} reviews.`);

        // Seed Galleries
        const galleries = [];
        for (const image of galleryImages) {
            const gallery = await databases.createDocument(
                config.databaseId!,
                COLLECTIONS.GALLERY!,
                ID.unique(),
                { image }
            );
            galleries.push(gallery);
        }

        console.log(`Seeded ${galleries.length} galleries.`);

        // Seed Properties
        for (let i = 1; i <= 20; i++) {
            const assignedAgent = agents[Math.floor(Math.random() * agents.length)];

            const assignedReviews = getRandomSubset(reviews, 5, 7);
            const assignedGalleries = getRandomSubset(galleries, 3, 8);

            const selectedFacilities = facilities.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * facilities.length) + 1);

            const image = propertiesImages.length - 1 >= i ? propertiesImages[i] : propertiesImages[Math.floor(Math.random() * propertiesImages.length)];

            const property = await databases.createDocument(
                config.databaseId!,
                COLLECTIONS.PROPERTY!,
                ID.unique(),
                {
                    name: `Property ${i}`,
                    type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
                    description: `This is the description for Property ${i}.`,
                    address: `123 Property Street, City ${i}`,
                    geolocation: `192.168.1.${i}, 192.168.1.${i}`,
                    price: Math.floor(Math.random() * 9000) + 1000,
                    area: Math.floor(Math.random() * 3000) + 500,
                    bedrooms: Math.floor(Math.random() * 5) + 1,
                    bathrooms: Math.floor(Math.random() * 5) + 1,
                    rating: Math.floor(Math.random() * 5) + 1,
                    facilities: selectedFacilities,
                    image: image,
                    agent: assignedAgent.$id,
                    reviews: assignedReviews.map((review) => review.$id),
                    gallery: assignedGalleries.map((gallery) => gallery.$id),
                }
            );

            console.log(`Seeded property: ${property.name}`);
        }

        console.log(`Data seeding completed.`);

    } catch (e) {
        console.error("Error seeding data:", e);
    }
}

export default seed;