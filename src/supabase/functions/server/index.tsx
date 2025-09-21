import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cors } from "npm:hono/cors";
import { Hono } from "npm:hono";
import { logger } from "npm:hono/logger";
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));
app.use('*', logger(console.log));

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Routes
app.get('/make-server-1aa6be21/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// User registration
app.post('/make-server-1aa6be21/signup', async (c) => {
  try {
    const { email, password, name, farmSize, location } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, farmSize, location },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.log(`Registration error for ${email}:`, error);
      return c.json({ error: error.message }, 400);
    }
    
    // Store additional farmer profile data
    await kv.set(`farmer_profile:${data.user.id}`, {
      name,
      farmSize,
      location,
      registeredAt: new Date().toISOString()
    });
    
    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get farmer profile
app.get('/make-server-1aa6be21/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const profile = await kv.get(`farmer_profile:${user.id}`);
    return c.json({ 
      profile: profile || user.user_metadata,
      email: user.email 
    });
  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Internal server error while fetching profile' }, 500);
  }
});

// Add crop to farmer's collection
app.post('/make-server-1aa6be21/crops', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { 
      name, 
      variety, 
      plantedDate, 
      expectedHarvest, 
      area, 
      location, 
      status, 
      healthStatus, 
      progress, 
      lastWatered, 
      notes 
    } = await c.req.json();
    
    const cropId = crypto.randomUUID();
    
    const cropData = {
      id: cropId,
      name,
      variety,
      plantedDate,
      expectedHarvest,
      area,
      location,
      status: status || 'planted',
      healthStatus: healthStatus || 'good',
      progress: progress || 0,
      lastWatered: lastWatered || new Date().toISOString().split('T')[0],
      notes: notes || '',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`crop:${user.id}:${cropId}`, cropData);
    
    // Update farmer's crop list
    const existingCrops = await kv.get(`farmer_crops:${user.id}`) || [];
    await kv.set(`farmer_crops:${user.id}`, [...existingCrops, cropId]);
    
    return c.json({ crop: cropData });
  } catch (error) {
    console.log('Add crop error:', error);
    return c.json({ error: 'Internal server error while adding crop' }, 500);
  }
});

// Get farmer's crops
app.get('/make-server-1aa6be21/crops', async (c) => {
  try {
    // Allow both authenticated and public access for loading crops
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    let userId = null;
    
    if (accessToken) {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (user && !error) {
        userId = user.id;
      }
    }
    
    if (!userId) {
      // Return empty array for unauthenticated users
      return c.json({ crops: [] });
    }
    
    const cropIds = await kv.get(`farmer_crops:${userId}`) || [];
    const crops = [];
    
    for (const cropId of cropIds) {
      const crop = await kv.get(`crop:${userId}:${cropId}`);
      if (crop) {
        crops.push(crop);
      }
    }
    
    return c.json({ crops });
  } catch (error) {
    console.log('Get crops error:', error);
    return c.json({ error: 'Internal server error while fetching crops' }, 500);
  }
});

// Update a specific crop
app.put('/make-server-1aa6be21/crops/:cropId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const cropId = c.req.param('cropId');
    const updateData = await c.req.json();
    
    // Get existing crop data
    const existingCrop = await kv.get(`crop:${user.id}:${cropId}`);
    if (!existingCrop) {
      return c.json({ error: 'Crop not found' }, 404);
    }
    
    // Update crop data
    const updatedCrop = {
      ...existingCrop,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`crop:${user.id}:${cropId}`, updatedCrop);
    
    return c.json({ crop: updatedCrop });
  } catch (error) {
    console.log('Update crop error:', error);
    return c.json({ error: 'Internal server error while updating crop' }, 500);
  }
});

// Delete a specific crop
app.delete('/make-server-1aa6be21/crops/:cropId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const cropId = c.req.param('cropId');
    
    // Remove crop data
    await kv.del(`crop:${user.id}:${cropId}`);
    
    // Update farmer's crop list
    const existingCrops = await kv.get(`farmer_crops:${user.id}`) || [];
    const updatedCrops = existingCrops.filter(id => id !== cropId);
    await kv.set(`farmer_crops:${user.id}`, updatedCrops);
    
    return c.json({ success: true, message: 'Crop deleted successfully' });
  } catch (error) {
    console.log('Delete crop error:', error);
    return c.json({ error: 'Internal server error while deleting crop' }, 500);
  }
});

// Get crop recommendations based on location and season
app.post('/make-server-1aa6be21/recommendations', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { location, season, soilType } = await c.req.json();
    
    // Mock AI recommendations based on inputs
    const recommendations = [
      {
        crop: 'Wheat',
        suitability: 90,
        reason: 'Excellent for winter season in your region',
        expectedYield: '40-45 quintals per hectare',
        plantingTime: 'November - December',
        harvestTime: 'April - May'
      },
      {
        crop: 'Mustard',
        suitability: 85,
        reason: 'Good oil seed crop for winter',
        expectedYield: '15-20 quintals per hectare',
        plantingTime: 'October - November',
        harvestTime: 'February - March'
      },
      {
        crop: 'Gram (Chickpea)',
        suitability: 80,
        reason: 'Suitable for clay loam soil',
        expectedYield: '20-25 quintals per hectare',
        plantingTime: 'October - November',
        harvestTime: 'March - April'
      }
    ];
    
    // Store recommendation request for analytics
    await kv.set(`recommendation_request:${user.id}:${Date.now()}`, {
      location,
      season,
      soilType,
      timestamp: new Date().toISOString(),
      recommendations
    });
    
    return c.json({ recommendations });
  } catch (error) {
    console.log('Recommendations error:', error);
    return c.json({ error: 'Internal server error while generating recommendations' }, 500);
  }
});

// Submit expert consultation request
app.post('/make-server-1aa6be21/consultation', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { question, category, urgency } = await c.req.json();
    const consultationId = crypto.randomUUID();
    
    const consultation = {
      id: consultationId,
      userId: user.id,
      question,
      category,
      urgency,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`consultation:${consultationId}`, consultation);
    
    return c.json({ consultation });
  } catch (error) {
    console.log('Consultation request error:', error);
    return c.json({ error: 'Internal server error while submitting consultation' }, 500);
  }
});

serve(app.fetch);