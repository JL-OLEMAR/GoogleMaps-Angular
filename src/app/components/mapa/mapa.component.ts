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
  infoWindows: google.maps.InfoWindow[] = []

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

    const content = `<b>${marcador.nombre}</b>`
    const infoWindow = new google.maps.InfoWindow({ content })

    this.marcadores.push(marker) // Agregamos el marcador a la lista de marcadores
    this.infoWindows.push(infoWindow) // Agregamos el infoWindow a la lista de infoWindows

    // Click para mostrar el contenido del marcador
    google.maps.event.addDomListener(marker, 'click', () => {
      // Primero se cierra el infoWindow anterior si existe, para luego mostrar el nuevo
      this.infoWindows.forEach((infoW) => (infoW.close()))
      infoWindow.open(this.map, marker)
    })

    // Doble click para borrar el marcador
    google.maps.event.addDomListener(marker, 'dblclick', () => {
      marker.setMap(null)
      // TODO: Disparar un evento de socket, para borrar el marcador
    })

    // Arrastrar el marcador
    google.maps.event.addDomListener(marker, 'drag', (coordenadas: any) => {
      const nuevoMarcador: Lugar = {
        lat: coordenadas.latLng.lat(),
        lng: coordenadas.latLng.lng(),
        nombre: marcador.nombre
      }

      console.log(nuevoMarcador)
      // TODO: Disparar un evento de socket, para mover el marcador
    })
  }
}
