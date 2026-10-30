
import { useCallback, useMemo, useState } from "react";

const ambientesIniciales = [
  {
    id_ambiente: 1,
    codigo_ambiente: "T-101",
    descripcion: "Taller de Mecánica",
    tipo: "Taller",
    aforo_maximo: 20,
    piso_ubicacion: "1er Piso",
    pabellon: "A",
    estado: "Disponible",
  },
  {
    id_ambiente: 2,
    codigo_ambiente: "LAB-201",
    descripcion: "Laboratorio de Electrónica",
    tipo: "Laboratorio",
    aforo_maximo: 16,
    piso_ubicacion: "2do Piso",
    pabellon: "B",
    estado: "Disponible",
  },
  {
    id_ambiente: 3,
    codigo_ambiente: "T-102",
    descripcion: "Taller de Soldadura",
    tipo: "Taller",
    aforo_maximo: 12,
    piso_ubicacion: "1er Piso",
    pabellon: "A",
    estado: "Disponible",
  },
  {
    id_ambiente: 4,
    codigo_ambiente: "AULA-301",
    descripcion: "Aula de Teoría - General",
    tipo: "Teoría",
    aforo_maximo: 40,
    piso_ubicacion: "3er Piso",
    pabellon: "C",
    estado: "Disponible",
  },
  {
    id_ambiente: 5,
    codigo_ambiente: "LAB-202",
    descripcion: "Laboratorio de Redes",
    tipo: "Laboratorio",
    aforo_maximo: 15,
    piso_ubicacion: "2do Piso",
    pabellon: "B",
    estado: "Mantenimiento",
  },
  {
    id_ambiente: 6,
    codigo_ambiente: "T-103",
    descripcion: "Taller de Carpintería",
    tipo: "Taller",
    aforo_maximo: 18,
    piso_ubicacion: "1er Piso",
    pabellon: "A",
    estado: "Disponible",
  },
  {
    id_ambiente: 7,
    codigo_ambiente: "AULA-302",
    descripcion: "Aula Multimedia",
    tipo: "Teoría",
    aforo_maximo: 35,
    piso_ubicacion: "3er Piso",
    pabellon: "C",
    estado: "Disponible",
  },
  {
    id_ambiente: 8,
    codigo_ambiente: "AUD-001",
    descripcion: "Auditorio Principal",
    tipo: "Auditorio",
    aforo_maximo: 150,
    piso_ubicacion: "Planta Baja",
    pabellon: "Central",
    estado: "Disponible",
  },
  {
    id_ambiente: 9,
    codigo_ambiente: "LAB-203",
    descripcion: "Laboratorio de Computación",
    tipo: "Laboratorio",
    aforo_maximo: 14,
    piso_ubicacion: "2do Piso",
    pabellon: "B",
    estado: "Disponible",
  },
];

export default function useAmbientes() {
  const [ambientes, setAmbientes] = useState(ambientesIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("Todos");

  const tipos = useMemo(
    () => [
      "Todos",
      ...new Set(ambientes.map((ambiente) => ambiente.tipo)),
    ],
    [ambientes]
  );

  const ambientesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return ambientes.filter((ambiente) => {
      const coincideTexto =
        ambiente.codigo_ambiente.toLowerCase().includes(texto) ||
        ambiente.descripcion.toLowerCase().includes(texto) ||
        ambiente.pabellon.toLowerCase().includes(texto);

      const coincideTipo =
        tipoSeleccionado === "Todos" ||
        ambiente.tipo === tipoSeleccionado;

      return coincideTexto && coincideTipo;
    });
  }, [ambientes, busqueda, tipoSeleccionado]);

  const actualizarAforo = useCallback((id, nuevoAforo) => {
    const aforo = Number(nuevoAforo);

    if (!Number.isInteger(aforo) || aforo < 1) {
      return {
        correcto: false,
        mensaje: "El aforo debe ser un número entero mayor que cero.",
      };
    }

    setAmbientes((actuales) =>
      actuales.map((ambiente) =>
        ambiente.id_ambiente === id
          ? { ...ambiente, aforo_maximo: aforo }
          : ambiente
      )
    );

    return {
      correcto: true,
      mensaje: "El aforo se actualizó correctamente.",
    };
  }, []);

  const resumen = useMemo(
    () => ({
      total: ambientes.length,
      disponibles: ambientes.filter(
        (ambiente) => ambiente.estado === "Disponible"
      ).length,
      capacidadTotal: ambientes.reduce(
        (total, ambiente) => total + ambiente.aforo_maximo,
        0
      ),
      mantenimiento: ambientes.filter(
        (ambiente) => ambiente.estado === "Mantenimiento"
      ).length,
    }),
    [ambientes]
  );

  return {
    ambientes: ambientesFiltrados,
    todosLosAmbientes: ambientes,
    tipos,
    busqueda,
    setBusqueda,
    tipoSeleccionado,
    setTipoSeleccionado,
    actualizarAforo,
    resumen,
  };
}
