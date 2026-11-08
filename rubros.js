/* ══ RUBROS · lo que cada rubro tiene, en qué variante viene y en qué estado ══
   Lo usa la sección «Por rubro» de la home (y el menú «¿Qué tenés?» del cierre).
   Se edita acá; el HTML se arma solo.

   Reglas que no se rompen (las mismas del resto del sitio):
   · cada feature dice su ESTADO real:
       ok       → «Andando»: existe y hay una web o demo que lo muestra
       cuentas  → «Se enciende con tus cuentas»: falta la cuenta del comercio
                  (Mercado Pago, GoCuotas, transferencia)
       montaje  → «Se arma en el montaje»: se construye para ese comercio
       content  → «Con 0800 Content»: es producción, no sistema
   · `v` es la variante MÍNIMA de Commerce que lo trae (1 Landing, 2 Catálogo
     WhatsApp, 3 Tienda + Mercado Pago, 4 Plataforma). Si algo vive en
     Plataforma, se dice «en Plataforma», aunque el rubro arranque más abajo.
   · el `feed`, el `msj` y la `resp` (lo que contesta el comercio) son
     SIMULACIONES con datos de ejemplo, y la página lo dice. Nada de nombres de clientes reales ahí.
   · `obras` son los ids del portfolio (data-id de cada <li class="obra">).
   · gift cards: NO se nombran acá mientras el módulo 07 de Commerce diga que
     se cotizan aparte.
   ═════════════════════════════════════════════════════════════════════════ */
window.VARIANTES = {
  1: { nombre: 'Landing',               setup: 460000,  abono: 78000  },
  2: { nombre: 'Catálogo WhatsApp',     setup: 790000,  abono: 234000 },
  3: { nombre: 'Tienda + Mercado Pago', setup: 1490000, abono: 359000 },
  4: { nombre: 'Plataforma',            setup: 2450000, abono: 468000 }
};
window.PLANES = {
  'Señal':     195000,
  'Vidriera':  355000,
  'Temporada': 590000
};

window.RUBROS = [
  {
    slug: 'gastronomia', nombre: 'Gastronomía', rota: 'una hamburguesería',
    quien: 'Hamburgueserías · sushi · pizzerías · cocinas de autor · bares',
    titular: 'La carta se cambia sola y la cocina mide en minutos.',
    bajada: 'El pedido entra escrito, con el total bien hecho. Lo que se terminó se tacha solo, y la cola marca atrasado contra el reloj de una cocina, no de una tienda.',
    arranque: 2, completo: 4,
    porque: { 2: 'Carta con fotos y el pedido armado por WhatsApp.', 4: 'Suma la carta que editás vos, la pantalla de cocina y la caja por servicio.' },
    content: { plan: 'Vidriera', piezas: ['El plato del día en reel', 'La promo del finde en placa', 'La historia de «se terminó» sale de tus datos'] },
    features: [
      { t: 'La carta sale del panel', d: 'Nombre, foto, porciones y precio se cambian desde el teléfono y la página los toma sola. El plato que se terminó se tacha: no desaparece.', e: 'ok', v: 4 },
      { t: 'El pedido llega escrito', d: 'El cliente arma su pedido con la carta y te llega por WhatsApp con el detalle y el total. Nadie pregunta precios.', e: 'ok', v: 2 },
      { t: 'Escalas por cantidad', d: 'Cuatro a un precio, ocho a otro: a más cantidad, menor precio por unidad, calculado solo en el carrito.', e: 'ok', v: 2 },
      { t: 'La cocina mide en minutos', d: 'Pantalla de cocina sin un solo número de plata, y la cola marca atrasado contra el reloj de tu cocina.', e: 'ok', v: 4 },
      { t: 'Una caja por servicio', d: 'Mediodía y noche, cada uno con su turno, su arqueo y el motivo de la diferencia escrito.', e: 'ok', v: 4 },
      { t: 'Cobro desde la carta', d: 'Mercado Pago o transferencia para pedir y pagar sin salir de la página.', e: 'cuentas', v: 3 }
    ],
    feed: [
      'Pedido #318 · 2 Doble Cheddar + papas · entró por WhatsApp',
      'Cocina · el #315 lleva 14 min: marcado atrasado',
      'Se terminó el salmón · los platos que lo llevan se tachan solos',
      'Escala aplicada · 16 rolls, más barato cada uno',
      'Caja del mediodía cerrada · diferencia $0',
      'Pedido #319 · retira 21:40 · pagado con Mercado Pago',
      'Precio de la Doble Cheddar cambiado desde el teléfono'
    ],
    msj: 'Hola! Quiero 2 Doble Cheddar con papas y una gaseosa de 1,5 L. Total $38.400. Retiro 21:40 · Juli',
    resp: '¡Gracias, Juli! A las 21:40 lo tenés listo.',
    obras: ['hugosushi', 'cocinadejavi', 'naos', 'byehenry', 'cortez'],
    wa: 'Hola 0800, tengo un local de gastronomía y quiero ver la carta andando con mis platos.'
  },
  {
    slug: 'tiendas', nombre: 'Tiendas', rota: 'una tienda de ropa',
    quien: 'Indumentaria · deco · hecho a mano · marcas que venden a todo el país',
    titular: 'Cada talle con su stock y la plata que cuadra.',
    bajada: 'Vendiste la última M en el local y la web deja de ofrecerla. El cobro va directo a tu cuenta y la curva de talles te dice qué reponer.',
    arranque: 3, completo: 4,
    porque: { 3: 'Tienda con cobro total o seña por Mercado Pago, galería y reels.', 4: 'Suma el panel con stock por talle, mostrador, etiquetas y mayoristas.' },
    content: { plan: 'Temporada', piezas: ['Lookbook y packshot con tu producto', '«Volvió tu talle» sale de tus datos', 'La pieza insignia del lanzamiento'] },
    features: [
      { t: 'Color y talle, cada uno con su stock', d: 'Cada combinación tiene su existencia y baja sola al vender, en la web o en el mostrador. La que está en cero se tacha, y la curva de talles marca qué reponer.', e: 'ok', v: 4 },
      { t: 'Cobro total o seña', d: 'Mercado Pago para el total, transferencia para la seña. La seña es su propio pedido: la caja y la conciliación no se enredan.', e: 'cuentas', v: 3 },
      { t: 'Etiquetas con código de barras', d: 'Cada prenda con su código para escanear en el mostrador y en el depósito. Las etiquetas salen impresas desde el panel.', e: 'ok', v: 4 },
      { t: 'Mayorista por invitación', d: 'Un código para tus revendedores: la misma tienda les muestra su precio y les pide el mínimo de prendas.', e: 'ok', v: 4 },
      { t: 'Cuotas con débito', d: 'Cuotas con tarjeta de débito por GoCuotas, cobradas a tu cuenta.', e: 'cuentas', v: 3 },
      { t: 'Tus clientes, importados', d: 'La agenda de tu sistema anterior entra al panel: se busca por nombre o teléfono.', e: 'ok', v: 4 }
    ],
    feed: [
      'Venta en el local · Buzo negro M · quedan 0: la web lo tacha',
      'Pedido #1043 · seña por transferencia · entrega con fecha',
      'Curva de talles · reponer S y M del jean recto',
      'Revendedor con código · 8 prendas · precio mayorista',
      'Etiquetas impresas · 24 códigos de la tanda nueva',
      'Cobro en cuotas con débito · aprobado',
      'Conciliación · el lunes cuadró contra Mercado Pago'
    ],
    msj: 'Hola! Quiero reservar el buzo negro en talle M ($48.000). Hago la seña por transferencia · Cami',
    resp: '¡Hola, Cami! Te lo reservo. Te paso el alias.',
    obras: ['dstroy', '10mil11', 'surgenetics'],
    wa: 'Hola 0800, tengo una tienda y quiero ver el stock por talle y el cobro andando con mis productos.'
  },
  {
    slug: 'oficios', nombre: 'Oficios', rota: 'una cerrajería',
    quien: 'Cerrajería · electricidad · gas · plomería · destapaciones · vidriería',
    titular: 'Te encuentra el que tiene el problema ahora.',
    bajada: 'El cliente toca qué le pasa y el WhatsApp te llega escrito, con la zona. Tu matrícula y tus trabajos, arriba y a la vista.',
    arranque: 1, completo: 2,
    porque: { 1: 'Una página con tu dominio y el botón que ya escribe. Online en una semana.', 2: 'Si además vendés productos: catálogo con precios y fotos.' },
    content: { plan: 'Señal', piezas: ['El antes y el después del trabajo', 'Tu reseña buena en placa', 'Reel de una urgencia resuelta'] },
    features: [
      { t: 'La consulta llega armada', d: 'El cliente toca qué le pasa —un tablero que salta, una llave trabada, una pérdida— y el WhatsApp te llega escrito con el problema y la zona.', e: 'ok', v: 1 },
      { t: 'Primero en tu zona', d: 'Tu barrio, tu horario, tus reseñas y tu ficha de Google trabajando juntos para que te encuentre el que te necesita.', e: 'montaje', v: 1 },
      { t: 'El botón que ya escribe', d: 'Un toque y se abre WhatsApp con el mensaje hecho. Nadie piensa qué poner a las tres de la mañana.', e: 'ok', v: 1 },
      { t: 'Tus trabajos a la vista', d: 'Fotos de lo que hiciste, con el antes y el después: convencen más que cualquier texto.', e: 'ok', v: 1 },
      { t: 'Matrícula y garantía arriba', d: 'Lo que te diferencia del que no está matriculado, dicho en la portada y no escondido al pie.', e: 'ok', v: 1 },
      { t: 'Presupuesto con foto', d: 'La consulta pide la foto del problema: llegás sabiendo qué llevar.', e: 'ok', v: 1 }
    ],
    feed: [
      'Consulta · «salta la térmica del baño» · Tolosa · 02:14',
      'WhatsApp abierto con el mensaje armado',
      'Foto del tablero adjunta a la consulta',
      'Visita desde Google · «electricista urgente»',
      'Consulta · «presupuesto para cambiar el tablero» · City Bell',
      'Consulta · «enchufe que hace chispa» · Gonnet · 19:40'
    ],
    msj: 'Hola! Me salta la térmica del baño y se corta media casa. Estoy en Tolosa, ¿podés venir hoy? (te mando foto del tablero)',
    resp: 'Sí, en 40 minutos estoy por Tolosa.',
    obras: ['fixit'],
    wa: 'Hola 0800, tengo un oficio y quiero ver mi página con la consulta armada a WhatsApp.'
  },
  {
    slug: 'ferreterias', nombre: 'Ferreterías', rota: 'una ferretería',
    quien: 'Ferreterías · corralones · pinturerías · casas de electricidad',
    titular: 'La nota de pedido, como en el mostrador.',
    bajada: 'El catálogo ordenado como los cajones del local y la lista que llega por WhatsApp para prepararla antes de que vengan. Con Catálogo arrancás con tus 60 más pedidos; el resto entra con Plataforma.',
    arranque: 2, completo: 4,
    porque: { 2: 'Tus 60 artículos más pedidos con precio y la nota de pedido a WhatsApp.', 4: 'Suma todo el catálogo, el stock por unidad o por caja y el mostrador que vende sin internet.' },
    content: { plan: 'Señal', piezas: ['El producto en contexto, no en fondo blanco', 'Carrusel de ofertas por rubro', 'El «cómo se usa» en reel'] },
    features: [
      { t: 'La cajonera de rubros', d: 'El catálogo ordenado como los cajones del local: bulonería, eléctrico, sanitarios, pinturería. Se encuentra en dos toques.', e: 'ok', v: 2 },
      { t: 'La nota de pedido', d: 'El cliente arma su lista con cantidades, como en el mostrador, y te llega por WhatsApp para prepararla antes de que venga.', e: 'ok', v: 2 },
      { t: 'Calibre de bulonería', d: 'Una regla en pantalla para medir el bulón que tiene en la mano y pedir la medida justa.', e: 'ok', v: 3 },
      { t: 'Vende sin internet', d: 'Si se corta la conexión en el local, el mostrador sigue vendiendo y sube las ventas cuando vuelve.', e: 'ok', v: 4 },
      { t: 'Por unidad o por caja', d: 'El mismo stock, y cada presentación descuenta lo suyo: la caja de cien baja cien.', e: 'ok', v: 4 },
      { t: 'Precios desde tu planilla', d: 'La lista del proveedor entra al catálogo sin tocar producto por producto.', e: 'montaje', v: 4 }
    ],
    feed: [
      'Nota de pedido · 40 tornillos 6x40 + tarugos 8 · retira 10:30',
      'Se cortó internet · el mostrador siguió vendiendo (3 en cola)',
      'Volvió la conexión · 3 ventas subidas',
      'Caja de 100 tornillos vendida · el stock baja 100',
      'Calibre · 8 mm elegido y sumado a la nota',
      'Nota de pedido · 2 L de látex + rodillo · reparto'
    ],
    msj: 'Hola! Nota de pedido: 40 tornillos autoperforantes 6x40, 2 cajas de tarugos de 8 mm y un teflón. Paso 10:30 · Ruben',
    resp: 'Hola, Ruben. A las 10:30 te lo dejamos preparado.',
    obras: ['depiero'],
    wa: 'Hola 0800, tengo una ferretería y quiero ver la nota de pedido andando con mis artículos.'
  },
  {
    slug: 'hospedaje', nombre: 'Hospedaje', rota: 'una hostería',
    quien: 'Hosterías · cabañas · departamentos temporarios · turismo',
    titular: 'Reservan sin preguntarte si tenés lugar.',
    bajada: 'El huésped ve qué hay libre, confirma con la seña y la página le sigue sirviendo después: en dos idiomas y con el plan del día.',
    arranque: 3, completo: 4,
    porque: { 3: 'Reserva con seña por Mercado Pago, galería y el planificador a medida.', 4: 'Suma el panel, la app instalable y el asistente.' },
    content: { plan: 'Vidriera', piezas: ['El video de la habitación', 'El telón de la temporada', 'Cada pieza en dos idiomas'] },
    features: [
      { t: 'Disponibilidad por fecha', d: 'El huésped elige fechas y ve qué hay libre antes de escribir. Vos no contestás «¿tenés para el finde?» veinte veces.', e: 'montaje', v: 3 },
      { t: 'Seña para confirmar', d: 'La reserva queda firme cuando entra la seña, por Mercado Pago o transferencia, directo a tu cuenta.', e: 'cuentas', v: 3 },
      { t: 'En dos idiomas', d: 'Español e inglés con un toque, para el que llega de afuera.', e: 'ok', v: 1 },
      { t: 'El plan del día', d: 'Qué hacer en la zona, armado como un día: la página sigue siendo útil después de reservar.', e: 'ok', v: 3 },
      { t: 'De noche, cambia', d: 'Después de hora la página se viste de noche. El detalle que la gente filma.', e: 'ok', v: 1 },
      { t: 'Se instala como app', d: 'Queda en el teléfono como una app y abre sin señal, sin pasar por ninguna tienda.', e: 'ok', v: 4 }
    ],
    feed: [
      'Consulta · del 12 al 15 · 2 adultos · habitación con vista',
      'Seña recibida · reserva confirmada',
      'Huésped en inglés · eligió el otro idioma',
      'Son las 21:00 · la página pasó a modo noche',
      'Plan del día guardado · navegación al faro'
    ],
    msj: 'Hola! Quiero reservar del 12 al 15 de diciembre, 2 adultos, habitación con vista. ¿Cómo hago la seña? · Lu',
    resp: '¡Hola, Lu! Tenemos libre. Te paso el link de la seña.',
    obras: ['ultimofaro', 'ushber'],
    wa: 'Hola 0800, tengo un hospedaje y quiero ver la reserva con seña andando con mis habitaciones.'
  },
  {
    slug: 'estudios', nombre: 'Estudios', rota: 'un estudio de tatuaje',
    quien: 'Tatuadores · escuelas de baile · consultorios · asesorías',
    titular: 'La consulta llega con la foto y el turno con la seña.',
    bajada: 'El cliente cuenta qué quiere antes de escribir, la consulta queda guardada y el alumno nuevo llega sabiendo a qué clase ir.',
    arranque: 2, completo: 3,
    porque: { 2: 'Consultas con foto guardadas en tu panel y la reserva armada por WhatsApp.', 3: 'Suma la seña por Mercado Pago para confirmar el turno.' },
    content: { plan: 'Señal', piezas: ['El proceso del trabajo en reel', 'La galería que se renueva', 'Los cuidados en placas'] },
    features: [
      { t: 'Consulta con foto', d: 'El cliente sube la foto de su idea, la zona y el tamaño. La consulta queda guardada en tu panel y te llega a WhatsApp.', e: 'ok', v: 2 },
      { t: 'Clases y horarios a la vista', d: 'Qué se da, cuándo y con quién, con tus propios videos de portada.', e: 'ok', v: 1 },
      { t: 'La reserva, armada', d: 'El carrito arma la reserva con el día y el servicio y la manda por WhatsApp para que confirmes.', e: 'ok', v: 2 },
      { t: 'Cuidados y preguntas', d: 'Lo que preguntan siempre, contestado en la página: cuidados, preparación, qué traer.', e: 'ok', v: 1 },
      { t: 'Tus consultas en planilla', d: 'Todas en un archivo para facturar o hacer seguimiento.', e: 'ok', v: 2 },
      { t: 'Seña para reservar', d: 'El turno se confirma con la seña, directo a tu cuenta.', e: 'cuentas', v: 3 }
    ],
    feed: [
      'Consulta con foto · antebrazo · 15 cm · negro y gris',
      'Consulta guardada en el panel · planilla del mes lista',
      'Reserva · clase de heels · jueves 19 h',
      'Seña recibida · turno del sábado confirmado',
      'Consulta · «¿cuánto tarda en cicatrizar?» · contestada en cuidados'
    ],
    msj: 'Hola! Te paso la idea (foto adjunta): antebrazo, 15 cm, negro y gris. ¿Qué día tenés? · Nico',
    resp: '¡Buenísimo, Nico! Tengo el jueves a las 17.',
    obras: ['dobleaa', 'schoolofheels', 'laadvisory'],
    wa: 'Hola 0800, tengo un estudio y quiero ver la consulta con foto y las reservas andando.'
  },
  {
    slug: 'artistas', nombre: 'Artistas', rota: 'un proyecto de artista',
    quien: 'Música · fotografía · deporte · marcas personales',
    titular: 'Tu obra como la pensaste, no en una grilla cuadrada.',
    bajada: 'Lanzamientos y fechas arriba, la obra a pantalla completa y un fondo que se mueve con la estética de tu show.',
    arranque: 1, completo: 3,
    porque: { 1: 'Una página con tu dominio, tus lanzamientos y tus fechas.', 3: 'Si vendés entradas, ediciones o merch: cobro con Mercado Pago.' },
    content: { plan: 'Temporada', piezas: ['La pieza insignia del lanzamiento', 'Gráfica en tiempo real', 'Caras propias de la marca'] },
    features: [
      { t: 'Tu obra, sin recortar', d: 'Fotos y videos a pantalla completa, como los pensaste, no metidos en una grilla cuadrada.', e: 'ok', v: 1 },
      { t: 'Un fondo que se mueve', d: 'Gráfica en tiempo real con la estética de tu show o tu obra: pesa poco, no se pixela y cambia por temporada.', e: 'content', v: 1 },
      { t: 'Lanzamientos y fechas', d: 'El tema nuevo, la próxima fecha y dónde sacar la entrada, siempre arriba.', e: 'ok', v: 1 },
      { t: 'Cartas que se dan vuelta', d: 'El plantel, el equipo o la obra en cartas animadas, con los datos de cada uno.', e: 'ok', v: 1 },
      { t: 'Todo en tu dominio', d: 'Tus links en tu propia dirección, no en una página prestada.', e: 'ok', v: 1 },
      { t: 'Contenido todos los meses', d: 'Piezas, videos y la pieza insignia de cada lanzamiento.', e: 'content', v: 1 }
    ],
    feed: [
      'Lanzamiento nuevo · arriba de todo',
      'Fecha agregada · sábado 14 · entradas a la venta',
      'El fondo cambió de paleta por la temporada',
      'Carta del plantel actualizada · 12 goles',
      'Obra nueva · edición de 20 copias'
    ],
    msj: 'Hola! Quiero 2 entradas para el sábado 14. ¿Cómo las pago? · Sofi',
    resp: '¡Hola, Sofi! Te paso el link para pagarlas.',
    obras: ['malena', 'yarcho', 'mb17'],
    wa: 'Hola 0800, tengo un proyecto artístico y quiero ver mi página andando con mi obra.'
  }
];
