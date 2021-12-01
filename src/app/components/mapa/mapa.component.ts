/* eslint-disable @typescript-eslint/no-for-in-array */
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { WebsocketService } from '../../services/websocket.service'
import { Lugar } from '../../interfaces/interface'

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styles: []
})
export class MapaComponent implements OnInit {
  @ViewChild('map', { static: true }) mapaElement!: ElementRef
  map!: google.maps.Map

  marcadores: google.maps.Marker[] = []
  infoWindows: google.maps.InfoWindow[] = []

  lugares: Lugar[] = []

  constructor (
    private readonly http: HttpClient,
    public wsService: WebsocketService
  ) { }

  ngOnInit (): void {
    this.http.get<Lugar[]>('http://localhost:5000/googleMaps')
      .subscribe((lugares: Lugar[]) => {
        this.lugares = lugares
        this.cargarMapa()
      })

    this.escucharSocket()
  }

  escucharSocket (): void {
    // marcador-nuevo
    this.wsService.listen('marcador-nuevo').subscribe((marcador: Lugar) => {
      this.agregarMarcador(marcador)
    })

    // marcador-borrar
    this.wsService.listen('marcador-borrar').subscribe((id: string) => {
      for (const i in this.marcadores) {
        if (this.marcadores[i].getTitle() === id) {
          this.marcadores[i].setMap(null)
        }
      }
    })

    // marcador-mover
  }

  cargarMapa (): any {
    const latlng = new google.maps.LatLng(37.784679, -122.395936)
    const mapOpciones: google.maps.MapOptions = {
      center: latlng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapaElement.nativeElement, mapOpciones)

    this.map.addListener('click', (coordenadas: any) => {
      const nuevoMarcador: Lugar = {
        nombre: 'Nuevo marcador',
        lat: coordenadas.latLng.lat(),
        lng: coordenadas.latLng.lng(),
        id: new Date().toISOString()
      }
      this.agregarMarcador(nuevoMarcador)

      // Emitir un evento de socket, para agregar marcador
      this.wsService.emit('marcador-nuevo', nuevoMarcador)
    })

    for (const lugar of this.lugares) {
      this.agregarMarcador(lugar)
    }
  }

  // Agregar nuevo marcador al mapa
  agregarMarcador (marcador: Lugar): void {
    const latlng = new google.maps.LatLng(marcador.lat, marcador.lng)

    const marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latlng,
      draggable: true,
      title: marcador.id
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
      // Disparar un evento de socket, para borrar el marcador
      this.wsService.emit('marcador-borrar', marcador.id)
    })

    // Arrastrar el marcador
    google.maps.event.addDomListener(marker, 'drag', (coordenadas: any) => {
      const nuevoMarcador: Lugar = {
        lat: coordenadas.latLng.lat(),
        lng: coordenadas.latLng.lng(),
        nombre: marcador.nombre,
        id: marker.getTitle()
      }

      console.log(nuevoMarcador)
      // TODO: Disparar un evento de socket, para mover el marcador
    })
  }
}
