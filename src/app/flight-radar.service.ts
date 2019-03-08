import { Injectable } from '@angular/core';
import { LatLngBounds } from 'leaflet';
import { Observable, Observer } from 'rxjs';
import { stringify } from 'querystring';

import { HttpClient } from '@angular/common/http';

/**
 * Origin of this state’s position: 0 = ADS-B, 1 = ASTERIX, 2 = MLAT
 */
const enum PositionSource {
  'ADS-B' = 0,
  ASTERIX = 1,
  MLAT = 2,
}

type IIncomingAirplane = [
    /**
     * icao24
     * Unique ICAO 24-bit address of the transponder in hex string representation.
     */
    string,
    /**
     * callsign
     * Callsign of the vehicle (8 chars). Can be null if no callsign has been received.
     */
    string | null,
    /**
     * origin_country
     * Country name inferred from the ICAO 24-bit address.
     */
    string,
    /**
     * time_position
     * Unix timestamp (seconds) for the last position update. Can be null if no position report was received by OpenSky within the past 15s.
     */
    number | null,
    /**
     * last_contact
     * Unix timestamp (seconds) for the last update in general. This field is updated for any new, valid message received from the
     * transponder.
     */
    number,
    /**
     * longitude
     * WGS-84 longitude in decimal degrees. Can be null.
     */
    number | null,
    /**
     * latitude
     * WGS-84 latitude in decimal degrees. Can be null.
     */
    number | null,
    /**
     * baro_altitude
     * Barometric altitude in meters. Can be null.
     */
    number | null,
    /**
     * on_ground
     * Boolean value which indicates if the position was retrieved from a surface position report.
     */
    boolean,
    /**
     * velocity
     * Velocity over ground in m/s. Can be null.
     */
    number | null,
    /**
     * true_track
     * True track in decimal degrees clockwise from north (north=0°). Can be null.
     */
    number | null,
    /**
     * vertical_rate
     * Vertical rate in m/s. A positive value indicates that the airplane is climbing, a negative value indicates that it descends.
     * Can be null.
     */
    number | null,
    /**
     * sensors
     * IDs of the receivers which contributed to this state vector. Is null if no filtering for sensor was used in the request.
     */
    number[] | null,
    /**
     * geo_altitude
     * Geometric altitude in meters. Can be null.
     */
    number | null,
    /**
     * squawk
     * The transponder code aka Squawk. Can be null.
     */
    string | null,
    /**
     * spi
     * Whether flight status indicates special purpose indicator.
     */
    boolean,
    /**
     * position_source
     * Origin of this state’s position: 0 = ADS-B, 1 = ASTERIX, 2 = MLAT
     */
    PositionSource
    ];

interface IIncomingData {
  time: number; // in second since 1970
  states: IIncomingAirplane[];
}

export interface IFlightData {
  icao24: string;
  callsign: string | null;
  origin_country: string;
  time_position: number | null;
  last_contact: number;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  sensors: number[] | null;
  geo_altitude: number | null;
  squawk: string | null;
  spi: boolean;
  position_source: PositionSource;
}
const endpoint = 'https://opensky-network.org/api/states/all';

@Injectable({
  providedIn: 'root'
})
export class FlightRadarService {

  public readonly observable: Observable<IFlightData[]>;
  private observer: Observer<IFlightData[]>;
  private duration = 10000;
  private intv: number;

  private north: number;
  private south: number;
  private west: number;
  private east: number;

  constructor(private httpClient: HttpClient) {
    this.observable = new Observable((observer) => {
      this.observer = observer;
    });
  }

  setBoundingBox(bounds: LatLngBounds) {
    this.north = Math.ceil(bounds.getNorth());
    this.west = Math.floor(bounds.getWest());
    this.south = Math.floor(bounds.getSouth());
    this.east = Math.ceil(bounds.getEast());
  }

  setInterval(duration: number) {
    this.duration = duration;
    this.restart();
  }

  start() {
    this.intv = setInterval(() => this.run(), this.duration);
    this.run();
  }

  stop() {
    clearInterval(this.intv);
  }

  restart() {
    this.stop();
    this.start();
  }

  protected run() {
    // inspired by: https://github.com/derhuerst/flightradar24-client/blob/master/lib/radar.js
    const query = {
      // bounds: [this.north, this.south, this.west, this.east].join(','),
      lamin: this.south,
      lomin: this.west,
      lamax: this.north,
      lomax: this.east,
    };

    const url = endpoint + '?' + stringify(query);
    this.httpClient.get(url).subscribe((data: IIncomingData) => {
      if (!data.states) {
        return this.observer.next([]);
      }
      return this.observer.next(data.states.map((airplane: IIncomingAirplane) => {
        const [
          icao24,
          callsign,
          origin_country,
          time_position,
          last_contact,
          longitude,
          latitude,
          baro_altitude,
          on_ground,
          velocity,
          true_track,
          vertical_rate,
          sensors,
          geo_altitude,
          squawk,
          spi,
          position_source,
        ] = airplane;
        return {
          icao24,
          callsign,
          origin_country,
          time_position,
          last_contact,
          longitude,
          latitude,
          baro_altitude,
          on_ground,
          velocity,
          true_track,
          vertical_rate,
          sensors,
          geo_altitude,
          squawk,
          spi,
          position_source,
        } as IFlightData;
      }));
    });
  }
}
