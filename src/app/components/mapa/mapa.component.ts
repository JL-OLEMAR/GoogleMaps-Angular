import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core'

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styles: []
})
export class MapaComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) mapaElement!: ElementRef
  map!: google.maps.Map

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
  }
}
