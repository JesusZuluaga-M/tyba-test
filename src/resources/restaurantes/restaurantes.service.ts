/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RestaurantesService {
  async getRestaurantsNearCoords(lat: number, lon: number, radius = 5000) {
    const query = `
      [out:json];
      node
        ["amenity"="restaurant"]
        (around:${radius},${lat},${lon});
      out;
    `;
    const url = 'https://overpass-api.de/api/interpreter';

    const response = await axios.post(url, query, {
      headers: { 'Content-Type': 'text/plain' },
    });

    return response.data.elements.map((el: any) => ({
      id: el.id,
      name: el.tags?.name || 'Unnamed',
      lat: el.lat,
      lon: el.lon,
      tags: el.tags,
    }));
  }

  async getCoordsByCity(city: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;

    const response = await axios.get(url);

    if (response.data.length === 0) {
      throw new Error('City not found');
    }

    const place = response.data[0];

    return {
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    };
  }

  async getRestaurantsNearCity(city: string, radius = 5000) {
    const { lat, lon } = await this.getCoordsByCity(city);
    return this.getRestaurantsNearCoords(lat, lon, radius);
  }
}
