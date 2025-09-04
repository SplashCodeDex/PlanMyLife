import { UiService } from './../ui/ui.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeoJson } from '../../models/map';
import { Geolocation } from '@capacitor/geolocation';
import mapboxgl from 'mapbox-gl';

export interface MapboxOutput {
  attribution: string;
  features: Feature[];
  query: [];
}

export interface Feature {
  place_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public userCoords

  constructor(private http: HttpClient,
              private uiService: UiService) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  async initCurrentPosition() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.userCoords = coordinates;
    } catch (error) {
      this.uiService.presentToast('Failed to get current position', 'danger', 3000);
      console.error(error);
    }
  }

  public search_word(query: string) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http.get(url + query + '.json?&access_token='+ environment.mapbox.accessToken)
        .pipe(
            map((res: MapboxOutput) => {
                return res.features;
            })
        );
  }


  public search_directions(startLong, startLat, endLong, endLat) {
    const url = 'https://api.mapbox.com/directions/v5/mapbox/driving/';
    const params = startLong + ',' + startLat + ';' + endLong + ',' + endLat
    return this.http.get(url + params + '?steps=true&geometries=geojson&access_token='+ environment.mapbox.accessToken)
        .pipe(
            map((res) => {
                //console.log(res)
                return res;
            })
        );
  }
}





