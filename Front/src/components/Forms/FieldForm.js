// Función FieldForm que devuelve un elemento HTML como objeto
export const FieldForm = ({ labelText, type = "text" }) => {
  // Crear elementos DOM
  const div = document.createElement('div');
  div.classList.add('fieldForm');

  const label = document.createElement('label');
  label.textContent = labelText;

  const input = document.createElement('input');
  input.type = type;
  input.required = true;

  // Adjuntar elementos al div principal
  div.appendChild(label);
  div.appendChild(input);

  // Devolver el div completo como resultado
  return div;
};

