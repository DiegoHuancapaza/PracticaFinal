
import { useState } from "react";
import useAmbientes from "../hooks/useAmbientes";
import "../styles/ambientes.css";

export default function AmbientesModulo() {
  const {
    ambientes,
    tipos,
    busqueda,
    setBusqueda,
    tipoSeleccionado,
    setTipoSeleccionado,
    actualizarAforo,
    resumen,
  } = useAmbientes();

  const [ambienteEditando, setAmbienteEditando] = useState(null);
  const [nuevoAforo, setNuevoAforo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("exito");

  function abrirEdicion(ambiente) {
    setAmbienteEditando(ambiente);
    setNuevoAforo(String(ambiente.aforo_maximo));
    setMensaje("");
  }

  function cerrarEdicion() {
    setAmbienteEditando(null);
    setNuevoAforo("");
  }

  function guardarAforo(evento) {
    evento.preventDefault();

    if (!ambienteEditando) return;

    const resultado = actualizarAforo(
      ambienteEditando.id_ambiente,
      nuevoAforo
    );

    setMensaje(resultado.mensaje);
    setTipoMensaje(resultado.correcto ? "exito" : "error");

    if (resultado.correcto) {
      cerrarEdicion();
    }
  }

  return (
    <main className="ambientes-page">
      <header className="ambientes-header">
        <div>
          <p className="ambientes-eyebrow">GESTIÓN ACADÉMICA</p>
          <h1>Gestión de ambientes</h1>
          <p className="ambientes-subtitulo">
            Consulta los ambientes y administra su capacidad máxima.
          </p>
        </div>

        <div className="ambientes-header-icon" aria-hidden="true">
          <span>▦</span>
        </div>
      </header>

      <section className="ambientes-resumen">
        <article className="ambiente-stat">
          <span className="stat-icon azul">▦</span>
          <div>
            <p>Total de ambientes</p>
            <strong>{resumen.total}</strong>
          </div>
        </article>

        <article className="ambiente-stat">
          <span className="stat-icon verde">✓</span>
          <div>
            <p>Disponibles</p>
            <strong>{resumen.disponibles}</strong>
          </div>
        </article>

        <article className="ambiente-stat">
          <span className="stat-icon morado">♙</span>
          <div>
            <p>Capacidad total</p>
            <strong>{resumen.capacidadTotal} <small>personas</small></strong>
          </div>
        </article>

        <article className="ambiente-stat">
          <span className="stat-icon naranja">!</span>
          <div>
            <p>En mantenimiento</p>
            <strong>{resumen.mantenimiento}</strong>
          </div>
        </article>
      </section>

      <section className="ambientes-panel">
        <div className="ambientes-panel-heading">
          <div>
            <h2>Listado de ambientes</h2>
            <p>Busca, filtra y modifica el aforo máximo.</p>
          </div>

          <span className="ambientes-total">
            {ambientes.length} resultados
          </span>
        </div>

        <div className="ambientes-toolbar">
          <label className="ambientes-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar por código, nombre o pabellón..."
              aria-label="Buscar ambientes"
            />
          </label>

          <label className="ambientes-select-label">
            <span>Tipo de ambiente</span>
            <select
              value={tipoSeleccionado}
              onChange={(evento) =>
                setTipoSeleccionado(evento.target.value)
              }
            >
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="ambientes-table-wrapper">
          <table className="ambientes-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Ambiente</th>
                <th>Tipo</th>
                <th>Aforo máximo</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {ambientes.map((ambiente) => (
                <tr key={ambiente.id_ambiente}>
                  <td>
                    <span className="ambiente-codigo">
                      {ambiente.codigo_ambiente}
                    </span>
                  </td>

                  <td>
                    <span className="ambiente-nombre">
                      {ambiente.descripcion}
                    </span>
                  </td>

                  <td>
                    <span className="ambiente-tipo">
                      {ambiente.tipo}
                    </span>
                  </td>

                  <td>
                    <span className="ambiente-aforo">
                      {ambiente.aforo_maximo}
                      <small> personas</small>
                    </span>
                  </td>

                  <td>
                    <span>{ambiente.piso_ubicacion}</span>
                    <small className="ambiente-pabellon">
                      Pabellón {ambiente.pabellon}
                    </small>
                  </td>

                  <td>
                    <span
                      className={`estado-badge ${
                        ambiente.estado === "Disponible"
                          ? "estado-disponible"
                          : "estado-mantenimiento"
                      }`}
                    >
                      <span className="estado-punto" />
                      {ambiente.estado}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn-editar-aforo"
                      onClick={() => abrirEdicion(ambiente)}
                    >
                      <span aria-hidden="true">✎</span>
                      Editar aforo
                    </button>
                  </td>
                </tr>
              ))}

              {ambientes.length === 0 && (
                <tr>
                  <td colSpan="7" className="ambientes-vacio">
                    No se encontraron ambientes con esos criterios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="ambientes-table-footer">
          <span>
            Mostrando {ambientes.length} de los ambientes registrados en
            los datos de prueba.
          </span>
        </footer>
      </section>

      {mensaje && (
        <p
          className={`ambientes-mensaje mensaje-${tipoMensaje}`}
          role="status"
        >
          {mensaje}
        </p>
      )}

      {ambienteEditando && (
        <div
          className="ambientes-modal-overlay"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              cerrarEdicion();
            }
          }}
        >
          <section
            className="ambientes-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-editar-aforo"
          >
            <div className="modal-heading">
              <div>
                <span className="modal-etiqueta">EDITAR CAPACIDAD</span>
                <h2 id="titulo-editar-aforo">Modificar aforo</h2>
                <p>
                  {ambienteEditando.codigo_ambiente} ·{" "}
                  {ambienteEditando.descripcion}
                </p>
              </div>

              <button
                type="button"
                className="modal-cerrar"
                onClick={cerrarEdicion}
                aria-label="Cerrar ventana"
              >
                ×
              </button>
            </div>

            <form onSubmit={guardarAforo}>
              <label className="modal-label" htmlFor="nuevo-aforo">
                Aforo máximo permitido
              </label>

              <div className="aforo-input-wrapper">
                <input
                  id="nuevo-aforo"
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={nuevoAforo}
                  onChange={(evento) => setNuevoAforo(evento.target.value)}
                  autoFocus
                />
                <span>personas</span>
              </div>

              <p className="modal-ayuda">
                Ingresa la cantidad máxima de personas que puede recibir
                este ambiente.
              </p>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrarEdicion}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-guardar-aforo">
                  Guardar cambios
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
