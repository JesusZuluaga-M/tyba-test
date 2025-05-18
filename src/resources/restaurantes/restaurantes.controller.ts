import {
  Controller,
  Get,
  Query,
  Request,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { RestaurantesService } from './restaurantes.service';
import { RequestWithSession } from 'src/types/request-with-session';

@Controller('restaurantes')
export class RestaurantesController {
  constructor(private readonly restauranteService: RestaurantesService) {}

  @Get('nearby')
  async getRestaurantsNearby(
    @Request() req: RequestWithSession,
    @Query('city') city?: string,
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
    @Query('radius') radius?: string,
  ) {
    if (!req.session?.userId) {
      throw new UnauthorizedException('Invalid session');
    }

    const searchRadius = radius ? parseInt(radius, 10) : 1000;

    if (city) {
      const { lat, lon } = await this.restauranteService.getCoordsByCity(city);
      return this.restauranteService.getRestaurantsNearCoords(
        lat,
        lon,
        searchRadius,
      );
    }

    if (lat && lon) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      if (isNaN(latitude) || isNaN(longitude)) {
        throw new BadRequestException('Invalid latitude or longitude');
      }
      return this.restauranteService.getRestaurantsNearCoords(
        latitude,
        longitude,
        searchRadius,
      );
    }

    throw new BadRequestException(
      'Either city or lat and lon query parameters are required',
    );
  }
}
