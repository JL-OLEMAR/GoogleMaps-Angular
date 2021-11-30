import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core'
import { Lugar } from '../../interfaces/interface'

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styles: []
})
export class MapaComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) mapaElement!: ElementRef
  map!: google.maps.Map
  marcadores: google.maps.Marker[] = []

  lugares: Lugar[] = [
    {
      nombre: 'Udemy',
      lat: 37.784679,
      lng: -122.395936
    },
    {
      nombre: 'Bahía de San Francisco',
      lat: 37.798933,
      lng: -122.377732
    },
    {
      nombre: 'The Palace Hotel',
      lat: 37.788578,
      lng: -122.401745
    }
  ]

  // constructor () { }

  ngAfterViewInit (): void {
    this.cargarMapa()
  }

  cargarMapa (): any {
    const latlng = new google.maps.LatLng(37.784679, -122.395936)
    const mapOpciones: google.maps.MapOptions = {
      center: latlng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapaElement.nativeElement, mapOpciones)

    for (const lugar of this.lugares) {
      this.agregarMarcador(lugar)
    }
  }

  agregarMarcador (marcador: Lugar): void {
    const latlng = new google.maps.LatLng(marcador.lat, marcador.lng)

    const marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latlng,
      draggable: true
    })

    this.marcadores.push(marker)
  }
}
