import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  simpleAlert() {
    Swal.fire({
      heightAuto: false,
      title: 'Hello',
      text: 'This is an alert',
    });
  }

  alertWithSuccess(titulo: string) {
    Swal.fire({
      heightAuto: false,
      icon: 'success',
      title: titulo,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  alertWithError(titulo: string) {
    Swal.fire({
      heightAuto: false,
      icon: 'error',
      title: titulo,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Aceptar',
      timer: 5000,
    });
  }

  confirmDeleteBox(textoRegistro: string) {
    return Swal.fire({
      title: 'Eliminar fotografía',
      text: '¿Realmente desea eliminar la fotografía "' + textoRegistro + '"?',
      icon: 'warning',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: '¡No!, no quiero eliminarlo',
      confirmButtonColor: ' #eb445a',
    });
  }

  confirmBox(titulo: string, texto:string) {
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      heightAuto: false,
      showCancelButton: true,
      confirmButtonText: 'Sí, por supuesto',
      cancelButtonText: '¡Espera!, no',
      confirmButtonColor: ' #6bcd54',
    });
  }
}
