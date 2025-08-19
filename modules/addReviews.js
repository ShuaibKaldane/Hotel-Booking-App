const mongoose = require('mongoose');
const Listening = require('./Listening.js');
const Review = require('./review.js');

// Sample review data
const sampleReviews = [
    {
        rating: 5,
        comment: "Absolutely amazing experience! The location was perfect and the amenities exceeded our expectations. Highly recommend for anyone looking for a luxury stay."
    },
    {
        rating: 4,
        comment: "Great place to stay! Clean, comfortable, and the staff was very friendly. The only minor issue was the WiFi speed, but overall excellent value."
    },
    {
        rating: 5,
        comment: "Perfect getaway destination! Beautiful views, spacious rooms, and excellent service. We'll definitely be coming back next year."
    },
    {
        rating: 3,
        comment: "Decent accommodation with good location. The room was clean but could use some updates. Staff was helpful though."
    },
    {
        rating: 4,
        comment: "Very nice property with good facilities. The pool area was fantastic and the breakfast was delicious. Would stay again!"
    },
    {
        rating: 5,
        comment: "Exceptional service and beautiful property! The attention to detail was impressive and the location was ideal for exploring the area."
    },
    {
        rating: 4,
        comment: "Comfortable stay with all the essentials. Good value for money and convenient location. Recommended for business travelers."
    },
    {
        rating: 5,
        comment: "Outstanding experience from start to finish! The room was immaculate, the service was top-notch, and the location was perfect."
    },
    {
        rating: 3,
        comment: "Average accommodation. The room was clean but basic. Good for a short stay if you're on a budget."
    },
    {
        rating: 4,
        comment: "Nice hotel with friendly staff. The rooms were comfortable and the location was convenient. Good overall experience."
    }
];

async function addReviewsToAllListings() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
        console.log('Connected to MongoDB');

        // Get all listings
        const listings = await Listening.find({});
        console.log(`Found ${listings.length} listings`);

        if (listings.length === 0) {
            console.log('No listings found. Please create some listings first.');
            return;
        }

        // Add reviews to each listing
        for (let i = 0; i < listings.length; i++) {
            const listing = listings[i];
            console.log(`\nProcessing listing: ${listing.title}`);

            // Add 2-4 random reviews to each listing
            const numReviews = Math.floor(Math.random() * 3) + 2; // 2-4 reviews
            
            for (let j = 0; j < numReviews; j++) {
                // Get a random review from sample data
                const randomReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
                
                // Create new review
                const newReview = new Review({
                    rating: randomReview.rating,
                    comment: randomReview.comment,
                    author: '68a41b416550f3cb28ec7f17', // Added author ID
                    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
                });

                // Save the review
                await newReview.save();
                console.log(`  Added review ${j + 1}: ${randomReview.rating} stars`);

                // Add review ID to listing
                listing.review.push(newReview._id);
            }

            // Save the updated listing
            await listing.save();
            console.log(`  Total reviews for ${listing.title}: ${listing.review.length}`);
        }

        console.log('\n✅ Successfully added reviews to all listings!');
        
        // Display summary
        const updatedListings = await Listening.find({}).populate('review');
        console.log('\n📊 Summary:');
        updatedListings.forEach(listing => {
            console.log(`  ${listing.title}: ${listing.review.length} reviews`);
        });

    } catch (error) {
        console.error('Error adding reviews:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the function
addReviewsToAllListings();