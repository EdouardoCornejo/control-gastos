export const generarId = () => {
  const random = Math.random().toString(36).substr(2);
  const fecha = Date.now().toString(36);

  return random + fecha;
};


export const formatearFecha = fecha => {
  const fechaNueva = new Date(fecha);
  const opciones = {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }
  return fechaNueva.toLocaleDateString('es-ES',opciones)
}

const CATEGORIAS = ['ahorro', 'comida', 'casa', 'gastos', 'ocio', 'salud', 'suscripciones'];

export const esCantidadValida = cantidad => Number.isFinite(cantidad) && cantidad > 0;

/* Lee los gastos de localStorage descartando datos corruptos o manipulados. */
export const leerGastosLS = () => {
  try {
    const gastos = JSON.parse(localStorage.getItem('gastos') ?? '[]');
    if (!Array.isArray(gastos)) return [];
    return gastos.filter(gasto =>
      gasto &&
      typeof gasto.id === 'string' &&
      typeof gasto.nombre === 'string' &&
      CATEGORIAS.includes(gasto.categoria) &&
      esCantidadValida(gasto.cantidad)
    );
  } catch {
    return [];
  }
};

export const leerPresupuestoLS = () => {
  const presupuesto = Number(localStorage.getItem('presupuesto'));
  return esCantidadValida(presupuesto) ? presupuesto : 0;
};
