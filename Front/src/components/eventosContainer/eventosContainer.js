import { FieldForm } from '../Forms/FieldForm';

export const eventosContainer = () => {
  //sección de eventos:
  const eventosSection = document.createElement('section');
  eventosSection.id = 'eventos';
  document.querySelector('main').appendChild(eventosSection);

  const eventosTitle = document.createElement('h2');
  eventosTitle.textContent = 'Próximos eventos';
  eventosTitle.classList = 'eventos-title';
  eventosSection.appendChild(eventosTitle);

  const CrearEventoBtn = document.createElement('button');
  CrearEventoBtn.id = 'crear-evento-btn';
  CrearEventoBtn.textContent = 'Crear nuevo evento ➕';
  eventosSection.appendChild(CrearEventoBtn);

  const eventosContainer = document.createElement('ul');
  eventosContainer.id = 'eventos-container';
  eventosSection.appendChild(eventosContainer);

  const asistentesSection = document.createElement('div');
  asistentesSection.id = 'asistentes-section';
  asistentesSection.style.display = 'none';
  eventosSection.appendChild(asistentesSection);

  const asistentesTitle = document.createElement('h2');
  asistentesTitle.textContent = 'Asistentes';
  asistentesTitle.classList = 'asistentes';
  asistentesSection.appendChild(asistentesTitle);

  const asistentesContainer = document.createElement('ul');
  asistentesContainer.id = 'asistentes-container';
  asistentesSection.appendChild(asistentesContainer);

  const volverBtn = document.createElement('button');
  volverBtn.id = 'volver';
  volverBtn.textContent = 'Volver a eventos';
  asistentesSection.appendChild(volverBtn);

  const crearEventoModal = document.createElement('div');
  crearEventoModal.id = 'crear-evento-modal';
  crearEventoModal.classList = 'modal';
  crearEventoModal.style.display = 'none';
  eventosSection.appendChild(crearEventoModal);

  const crearEventoTitle = document.createElement('h2');
  crearEventoTitle.textContent = 'Crear nuevo evento';
  crearEventoTitle.classList = 'modal-title eventos';
  crearEventoModal.appendChild(crearEventoTitle);

  const nuevoEventoForm = document.createElement('form');
  nuevoEventoForm.id = 'nuevo-evento-form';
  nuevoEventoForm.enctype = 'multipart/form-data';
  crearEventoModal.appendChild(nuevoEventoForm);

  const tituloField = FieldForm({
    labelText: 'Título: ',
    type: 'text',
    for: 'titulo',
    id: 'titulo',
    name: 'titulo'
  });
  nuevoEventoForm.appendChild(tituloField);

  const fechaField = FieldForm({
    labelText: 'Fecha: ',
    type: 'date',
    for: 'fecha',
    id: 'fecha',
    name: 'fecha'
  });
  nuevoEventoForm.appendChild(fechaField);

  const ubicacionField = FieldForm({
    labelText: 'Ubicación: ',
    type: 'text',
    for: 'ubicacion',
    id: 'ubicacion',
    name: 'ubicacion'
  });
  nuevoEventoForm.appendChild(ubicacionField);

  const descripcionField = FieldForm({
    labelText: 'Descripción: ',
    type: 'text',
    for: 'descripcion',
    id: 'descripcion',
    name: 'descripcion'
  });
  nuevoEventoForm.appendChild(descripcionField);

  const imagenField = FieldForm({
    labelText: 'Imagen: ',
    type: 'file',
    for: 'img',
    id: 'img',
    name: 'img',
    accept: 'image/*'
  });
  nuevoEventoForm.appendChild(imagenField);

  const crearEventoForm = document.createElement('button');
  crearEventoForm.id = 'crear-evento';
  crearEventoForm.textContent = 'Crear evento';
  nuevoEventoForm.appendChild(crearEventoForm);

  const cancelarBtn = document.createElement('button');
  cancelarBtn.id = 'cancelar-crear-evento';
  cancelarBtn.textContent = 'Cancelar';
  cancelarBtn.type = 'button';
  nuevoEventoForm.appendChild(cancelarBtn);

  const asistenciaModal = document.createElement('div');
  asistenciaModal.id = 'asistencia-modal';
  asistenciaModal.classList = 'modal';
  asistenciaModal.style.display = 'none';
  eventosSection.appendChild(asistenciaModal);

  const asistenciaTitle = document.createElement('h2');
  asistenciaTitle.textContent = 'Asistencia al evento';
  asistenciaModal.appendChild(asistenciaTitle);

  const asistenciaForm = document.createElement('form');
  asistenciaForm.id = 'asistencia-form';
  asistenciaModal.appendChild(asistenciaForm);

  const nombreField = FieldForm({
    labelText: 'Nombre: ',
    type: 'text',
    for: 'nombre',
    id: 'nombre'
  });
  asistenciaForm.appendChild(nombreField);

  const emailField = FieldForm({
    labelText: 'Email: ',
    type: 'email',
    for: 'email',
    id: 'email'
  });
  asistenciaForm.appendChild(emailField);

  const asistenciaButton = document.createElement('button');
  asistenciaButton.type = 'submit';
  asistenciaButton.textContent = 'Confirmar Asistencia';
  asistenciaForm.appendChild(asistenciaButton);

  const cancelarAsistenciaBtn = document.createElement('button');
  cancelarAsistenciaBtn.id = 'cancelar-asistencia';
  cancelarAsistenciaBtn.textContent = 'Cancelar';
  cancelarAsistenciaBtn.type = 'button';
  asistenciaForm.appendChild(cancelarAsistenciaBtn);

  return eventosSection;
};
