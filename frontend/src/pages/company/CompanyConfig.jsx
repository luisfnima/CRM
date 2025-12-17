import { useState, useEffect } from 'react';
import { Building2, Save, User, Mail, Clock, Eye } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';

const CompanyConfig = () => {
  const { primaryColor, secondaryColor, setColors } = useThemeStore();
  
  const [formData, setFormData] = useState({
    empresa: 'DREAM TEAM',
    contacto: 'Ángel Ávalos',
    sufijoUsuario: '@dreamteam.pe',
    tipoAsistencia: 'Login/Logout al Sistema',
    primary_color: primaryColor,
    secondary_color: secondaryColor,
    logo_url: '',
    active: true
  });

  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Sincronizar colores del store con el formulario
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      primary_color: primaryColor,
      secondary_color: secondaryColor
    }));
  }, [primaryColor, secondaryColor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si cambian los colores, actualizar preview en tiempo real
    if (name === 'primary_color' || name === 'secondary_color') {
      if (previewMode) {
        if (name === 'primary_color') {
          setColors(value, formData.secondary_color);
        } else {
          setColors(formData.primary_color, value);
        }
      }
    }
  };

  const togglePreview = () => {
    const newPreviewMode = !previewMode;
    setPreviewMode(newPreviewMode);
    
    if (newPreviewMode) {
      // Activar preview - aplicar colores temporales
      setColors(formData.primary_color, formData.secondary_color);
      toast.success('Vista previa activada');
    } else {
      // Desactivar preview - volver a colores guardados
      setColors(primaryColor, secondaryColor);
      toast.info('Vista previa desactivada');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Aquí iría tu llamada a la API para guardar en PostgreSQL
      // const response = await fetch('/api/company/config', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: formData.empresa,
      //     owner: formData.contacto,
      //     domain: formData.sufijoUsuario,
      //     primary_color: formData.primary_color,
      //     secondary_color: formData.secondary_color,
      //   })
      // });
      
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar el tema globalmente de forma permanente
      setColors(formData.primary_color, formData.secondary_color);
      setPreviewMode(false);
      
      toast.success('¡Configuración guardada exitosamente!');
    } catch (error) {
      toast.error('Error al guardar la configuración');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetColors = () => {
    const defaultPrimary = '#dc2626';
    const defaultSecondary = '#e5e7eb';
    
    setFormData(prev => ({
      ...prev,
      primary_color: defaultPrimary,
      secondary_color: defaultSecondary
    }));
    
    if (previewMode) {
      setColors(defaultPrimary, defaultSecondary);
    }
    
    toast.info('Colores restablecidos a valores por defecto');
  };

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-4xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm transition-all duration-300"
              style={{ backgroundColor: previewMode ? formData.primary_color : primaryColor }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Configuración de Empresa
              </h1>
              <p className="text-xs text-gray-600">
                Administra la información corporativa del sistema
              </p>
            </div>
          </div>

          {/* Botón de Preview */}
          <button
            type="button"
            onClick={togglePreview}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              previewMode 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Vista Previa Activa' : 'Vista Previa'}
          </button>
        </div>

        {/* Banner de Preview Activo */}
        {previewMode && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Modo vista previa activo - Los cambios se aplicarán en tiempo real
              </span>
            </div>
            <button
              onClick={togglePreview}
              className="text-sm font-semibold text-yellow-700 hover:text-yellow-900"
            >
              Desactivar
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos de empresa y contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Carta: Empresa */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300"
                  style={{ backgroundColor: previewMode ? formData.primary_color : primaryColor }}
                >
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                Nombre de la Empresa
              </label>
              <input
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all font-medium"
                style={{ 
                  '--tw-ring-color': previewMode ? formData.primary_color : primaryColor 
                }}
                placeholder="Ingresa el nombre de la empresa"
                required
              />
            </div>

            {/* Carta: Contacto */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300"
                  style={{ backgroundColor: previewMode ? formData.primary_color : primaryColor }}
                >
                  <User className="w-4 h-4 text-white" />
                </div>
                Persona de Contacto
              </label>
              <input
                type="text"
                name="contacto"
                value={formData.contacto}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all font-medium"
                placeholder="Nombre del contacto principal"
                required
              />
            </div>
          </div>

          {/* Asistencia y Dominio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Carta: Tipo de Asistencia */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300"
                  style={{ backgroundColor: previewMode ? formData.primary_color : primaryColor }}
                >
                  <Clock className="w-4 h-4 text-white" />
                </div>
                Modo de Asistencia
              </label>
              <input
                type="text"
                name="tipoAsistencia"
                value={formData.tipoAsistencia}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all font-medium"
                placeholder="Tipo de asistencia"
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                Método de registro de entrada y salida
              </p>
            </div>

            {/* Carta: Dominio */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300"
                  style={{ backgroundColor: previewMode ? formData.primary_color : primaryColor }}
                >
                  <Mail className="w-4 h-4 text-white" />
                </div>
                Dominio de Correo
              </label>
              <input
                type="text"
                name="sufijoUsuario"
                value={formData.sufijoUsuario}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all font-medium font-mono"
                placeholder="@empresa.com"
                required
              />
            </div>
          </div>

          {/* Sección de Colores */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                🎨 Personalización de Colores
              </h3>
              <button
                type="button"
                onClick={resetColors}
                className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
              >
                Restablecer Colores
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Carta: Color Primario */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center border-2 border-gray-300 transition-all duration-300"
                    style={{ backgroundColor: formData.primary_color }}
                  >
                    <div className="w-6 h-6 rounded border-2 border-white/70"></div>
                  </div>
                  Color Primario
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    name="primary_color"
                    value={formData.primary_color}
                    onChange={handleChange}
                    className="w-20 h-20 cursor-pointer rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all"
                    title="Selecciona el color primario"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      name="primary_color"
                      value={formData.primary_color}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm uppercase"
                      placeholder="#DC2626"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      maxLength="7"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Usado en botones, iconos y elementos principales
                    </p>
                  </div>
                </div>
                
                {/* Previsualización mejorada */}
                <div className="mt-4">
                  <span className="text-xs font-medium text-gray-600 block mb-2">Previsualización:</span>
                  <div className="flex space-x-2">
                    <div
                      className="h-10 flex-1 rounded-lg shadow-sm transition-all duration-300"
                      style={{ backgroundColor: formData.primary_color }}
                    ></div>
                    <div
                      className="h-10 w-16 rounded-lg shadow-sm transition-all duration-300"
                      style={{ backgroundColor: formData.primary_color, opacity: 0.7 }}
                    ></div>
                    <div
                      className="h-10 w-12 rounded-lg shadow-sm transition-all duration-300"
                      style={{ backgroundColor: formData.primary_color, opacity: 0.4 }}
                    ></div>
                  </div>
                </div>

                {/* Ejemplos de uso */}
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    className="w-full py-2 px-4 rounded-lg text-white font-semibold text-sm transition-all duration-300"
                    style={{ backgroundColor: formData.primary_color }}
                  >
                    Botón de ejemplo
                  </button>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                      style={{ backgroundColor: formData.primary_color }}
                    >
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs text-gray-600">Icono de ejemplo</span>
                  </div>
                </div>
              </div>

              {/* Carta: Color Secundario */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center border-2 border-gray-300 transition-all duration-300"
                    style={{ backgroundColor: formData.secondary_color }}
                  >
                    <div className="w-6 h-6 rounded border-2 border-gray-400/30"></div>
                  </div>
                  Color Secundario
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    name="secondary_color"
                    value={formData.secondary_color}
                    onChange={handleChange}
                    className="w-20 h-20 cursor-pointer rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all"
                    title="Selecciona el color secundario"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      name="secondary_color"
                      value={formData.secondary_color}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm uppercase"
                      placeholder="#E5E7EB"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      maxLength="7"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Usado en fondos y elementos secundarios
                    </p>
                  </div>
                </div>
                
                {/* Previsualización */}
                <div className="mt-4">
                  <span className="text-xs font-medium text-gray-600 block mb-2">Previsualización:</span>
                  <div className="flex space-x-2">
                    <div
                      className="h-10 flex-1 rounded-lg shadow-sm transition-all duration-300"
                      style={{ backgroundColor: formData.secondary_color }}
                    ></div>
                  </div>
                </div>

                {/* Ejemplos de uso */}
                <div className="mt-4 space-y-2">
                  <div
                    className="w-full py-2 px-4 rounded-lg text-gray-700 font-medium text-sm transition-all duration-300"
                    style={{ backgroundColor: formData.secondary_color }}
                  >
                    Fondo de ejemplo
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                      style={{ backgroundColor: formData.secondary_color }}
                    >
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-xs text-gray-600">Elemento neutral</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contraste y accesibilidad */}
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">i</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Tip de Accesibilidad</p>
                  <p className="text-xs text-gray-600">
                    Asegúrate de que los colores tengan suficiente contraste para una mejor legibilidad. 
                    Los colores muy claros pueden dificultar la lectura del texto.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-center gap-4 pt-6">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  empresa: 'DREAM TEAM',
                  contacto: 'Ángel Ávalos',
                  sufijoUsuario: '@dreamteam.pe',
                  tipoAsistencia: 'Login/Logout al Sistema',
                  primary_color: primaryColor,
                  secondary_color: secondaryColor,
                  logo_url: '',
                  active: true
                });
                if (previewMode) {
                  setColors(primaryColor, secondaryColor);
                }
                toast.info('Cambios descartados');
              }}
              className="px-8 py-3 bg-gray-200 text-gray-700 text-base font-semibold rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all shadow-md"
            >
              Descartar Cambios
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-10 py-3 text-white text-base font-bold rounded-xl focus:outline-none focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              style={{ 
                backgroundColor: previewMode ? formData.primary_color : primaryColor,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  const color = previewMode ? formData.primary_color : primaryColor;
                  e.currentTarget.style.backgroundColor = adjustColor(color, -20);
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  const color = previewMode ? formData.primary_color : primaryColor;
                  e.currentTarget.style.backgroundColor = color;
                }
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando Cambios...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-3" />
                  Guardar Configuración
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Función helper para ajustar brillo del color (hover effect)
function adjustColor(color, amount) {
  const clamp = (val) => Math.min(Math.max(val, 0), 255);
  const num = parseInt(color.replace('#', ''), 16);
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0x00FF) + amount);
  const b = clamp((num & 0x0000FF) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export default CompanyConfig;