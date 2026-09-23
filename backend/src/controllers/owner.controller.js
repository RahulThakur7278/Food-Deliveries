import Shop from '../models/shop.model.js';
import Item from '../models/item.model.js';
import Order from '../models/order.model.js';

// Helper to seed dummy orders if none exist
const seedDummyOrders = async (shopIds, userId) => {
    if (shopIds.length === 0) return;
    
    const count = await Order.countDocuments({ shop: { $in: shopIds } });
    if (count > 0) return; // Already seeded

    console.log("Seeding dummy orders for dashboard charts...");
    const dummyOrders = [];
    const statuses = ['pending', 'preparing', 'completed', 'completed', 'completed']; // heavily weight towards completed
    
    // Generate orders for the past 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Random number of orders for this day (5 to 15)
        const numOrders = Math.floor(Math.random() * 10) + 5;
        
        for (let j = 0; j < numOrders; j++) {
            dummyOrders.push({
                user: userId, // Just using owner as user for dummy purposes
                shop: shopIds[Math.floor(Math.random() * shopIds.length)],
                items: [], // Mock items
                totalAmount: Math.floor(Math.random() * 500) + 100,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                createdAt: date,
                updatedAt: date
            });
        }
    }
    
    await Order.insertMany(dummyOrders);
};

export const getDashboardStats = async (req, res) => {
    try {
        const ownerId = req.user._id;

        // 1. Get total shops
        const shops = await Shop.find({ owner: ownerId }, '_id');
        const shopIds = shops.map(shop => shop._id);
        const totalShops = shopIds.length;

        // 2. Get total items
        const totalItems = await Item.countDocuments({ shopId: { $in: shopIds } });

        // Auto-seed dummy orders for demonstration if none exist
        await seedDummyOrders(shopIds, ownerId);

        // 3. Get pending and completed orders
        const pendingOrders = await Order.countDocuments({ 
            shop: { $in: shopIds }, 
            status: { $in: ['pending', 'preparing'] } 
        });

        const completedOrders = await Order.countDocuments({ 
            shop: { $in: shopIds }, 
            status: 'completed' 
        });

        // 4. Generate Chart Data (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const ordersAgg = await Order.aggregate([
            {
                $match: {
                    shop: { $in: shopIds },
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" },
                    orders: { $sum: 1 }
                }
            }
        ]);

        // Map day numbers (1-7, where 1=Sunday) to names
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Build the last 7 days array in order
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayOfWeek = d.getDay(); // 0-6 (Sun-Sat)
            
            // Find aggregate data for this dayOfWeek. 
            // MongoDB $dayOfWeek returns 1 for Sunday, 7 for Saturday.
            const mongoDay = dayOfWeek + 1;
            const dayData = ordersAgg.find(agg => agg._id === mongoDay);
            
            chartData.push({
                name: dayNames[dayOfWeek],
                orders: dayData ? dayData.orders : 0
            });
        }

        res.status(200).json({
            success: true,
            data: {
                totalShops,
                totalItems,
                pendingOrders,
                completedOrders,
                chartData
            }
        });

    } catch (error) {
        console.error("Error in getDashboardStats:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
