import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('GOOGLE_MAPS_API_KEY is not set');
    }

    const { action, input, origins, destinations } = await req.json();
    console.log(`Google Maps API called with action: ${action}`);

    if (action === 'autocomplete') {
      // Places Autocomplete API
      if (!input || input.length < 2) {
        return new Response(JSON.stringify({ predictions: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
      url.searchParams.set('input', input);
      url.searchParams.set('key', GOOGLE_MAPS_API_KEY);
      url.searchParams.set('components', 'country:se'); // Limit to Sweden
      url.searchParams.set('types', 'address');
      url.searchParams.set('language', 'sv');

      console.log(`Fetching autocomplete for: ${input}`);
      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('Autocomplete API error:', data);
        throw new Error(`Google API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
      }

      const predictions = (data.predictions || []).map((p: any) => ({
        place_id: p.place_id,
        description: p.description,
        structured_formatting: p.structured_formatting,
      }));

      console.log(`Found ${predictions.length} predictions`);
      return new Response(JSON.stringify({ predictions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'place-details') {
      // Get place details including postal code
      const { place_id } = await req.json();
      
      const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
      url.searchParams.set('place_id', place_id);
      url.searchParams.set('key', GOOGLE_MAPS_API_KEY);
      url.searchParams.set('fields', 'address_components,formatted_address,geometry');
      url.searchParams.set('language', 'sv');

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.status !== 'OK') {
        console.error('Place details API error:', data);
        throw new Error(`Google API error: ${data.status}`);
      }

      const result = data.result;
      let postalCode = '';
      
      for (const component of result.address_components || []) {
        if (component.types.includes('postal_code')) {
          postalCode = component.long_name.replace(/\s/g, '');
          break;
        }
      }

      return new Response(JSON.stringify({
        formatted_address: result.formatted_address,
        postal_code: postalCode,
        location: result.geometry?.location,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'distance') {
      // Distance Matrix API
      if (!origins || !destinations) {
        throw new Error('Origins and destinations are required for distance calculation');
      }

      const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
      url.searchParams.set('origins', origins);
      url.searchParams.set('destinations', destinations);
      url.searchParams.set('key', GOOGLE_MAPS_API_KEY);
      url.searchParams.set('units', 'metric');
      url.searchParams.set('language', 'sv');

      console.log(`Calculating distance from ${origins} to ${destinations}`);
      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.status !== 'OK') {
        console.error('Distance Matrix API error:', data);
        throw new Error(`Google API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
      }

      const element = data.rows?.[0]?.elements?.[0];
      if (!element || element.status !== 'OK') {
        console.error('No route found:', element);
        return new Response(JSON.stringify({ 
          distance_km: null, 
          duration_minutes: null,
          error: 'No route found'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const distanceKm = Math.round(element.distance.value / 1000 * 10) / 10;
      const durationMinutes = Math.round(element.duration.value / 60);

      console.log(`Distance: ${distanceKm} km, Duration: ${durationMinutes} min`);
      return new Response(JSON.stringify({
        distance_km: distanceKm,
        duration_minutes: durationMinutes,
        distance_text: element.distance.text,
        duration_text: element.duration.text,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      throw new Error(`Unknown action: ${action}`);
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in google-maps function:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
