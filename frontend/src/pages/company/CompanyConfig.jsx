import { useState, useEffect } from 'react';
import { Building2, Save, User, Mail, Eye, Palette, Sparkles } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';

const CompanyConfig = () => {
  const { primaryColor, secondaryColor, setColors } = useThemeStore();
  
  const [formData, setFormData] = useState({
    empresa: 'DREAM TEAM',
    contacto: 'Ángel Ávalos',
    sufijoUsuario: '@dreamteam.pe',
    primary_color: primaryColor,
    secondary_color: secondaryColor,
    logo_url: '',
    active: true
  });

  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Paletas de colores predefinidas
  const colorPalettes = [
    { name: 'Rojo Corporativo', primary: '#dc2626', secondary: '#fee2e2' },
    { name: 'Azul Profesional', primary: '#2563eb', secondary: '#dbeafe' },
    { name: 'Verde Natural', primary: '#16a34a', secondary: '#dcfce7' },
    { name: 'Púrpura Moderno', primary: '#9333ea', secondary: '#f3e8ff' },
    { name: 'Naranja Energético', primary: '#ea580c', secondary: '#ffedd5' },
    { name: 'Índigo Elegante', primary: '#4f46e5', secondary: '#e0e7ff' },
  ];

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

    // IMPORTANTE: Si cambian los colores, actualizar preview en tiempo real
    if (name === 'primary_color' || name === 'secondary_color') {
      if (previewMode) {
        // Actualizar ambos colores inmediatamente en el store
        if (name === 'primary_color') {
          setColors(value, formData.secondary_color);
        } else if (name === 'secondary_color') {
          setColors(formData.primary_color, value);
        }
      }
    }
  };

  const applyPalette = (palette) => {
    setFormData(prev => ({
      ...prev,
      primary_color: palette.primary,
      secondary_color: palette.secondary
    }));
    
    if (previewMode) {
      // Aplicar inmediatamente al sidebar
      setColors(palette.primary, palette.secondary);
    }
    
    toast.success(`Paleta "${palette.name}" aplicada`);
  };

  const togglePreview = () => {
    const newPreviewMode = !previewMode;
    setPreviewMode(newPreviewMode);
    
    if (newPreviewMode) {
      // Activar preview - aplicar colores temporales (incluyendo sidebar)
      setColors(formData.primary_color, formData.secondary_color);
      toast.success('Vista previa activada - Los cambios se aplicarán al sidebar');
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar el tema globalmente de forma permanente (incluyendo sidebar)
      setColors(formData.primary_color, formData.secondary_color);
      setPreviewMode(false);
      
      toast.success('¡Configuración guardada! El sidebar se ha actualizado.');
    } catch (error) {
      toast.error('Error al guardar la configuración');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetColors = () => {
    const defaultPrimary = '#dc2626';
    const defaultSecondary = '#fee2e2';
    
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

  // Calcular contraste
  const getContrastRatio = (color1, color2) => {
    const getLuminance = (color) => {
      const rgb = parseInt(color.slice(1), 16);
      const r = ((rgb >> 16) & 0xff) / 255;
      const g = ((rgb >> 8) & 0xff) / 255;
      const b = ((rgb >> 0) & 0xff) / 255;
      
      const [rs, gs, bs] = [r, g, b].map(c => 
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  };

  const contrastRatio = getContrastRatio(formData.primary_color, '#ffffff');
  const contrastLevel = contrastRatio >= 7 ? 'Excelente' : contrastRatio >= 4.5 ? 'Bueno' : 'Mejorable';

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-5xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center justify-center w-12 h-12 rounded-xl shadow-md transition-all duration-300"
              style={{ backgroundColor: previewMode ? formData.primary_color : primaryColor }}
            >
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Configuración de Empresa
              </h1>
              <p className="text-sm text-gray-600">
                Administra la información corporativa del sistema
              </p>
            </div>
          </div>

          {/* Botón de Preview */}
          <button
            type="button"
            onClick={togglePreview}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
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
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-green-900 block">
                  Modo vista previa activo
                </span>
                <span className="text-xs text-green-700">
                  Los cambios se aplicarán en tiempo real al sidebar y a toda la interfaz
                </span>
              </div>
            </div>
            <button
              onClick={togglePreview}
              className="px-4 py-2 text-sm font-semibold text-green-700 bg-white rounded-lg hover:bg-green-100 transition-colors"
            >
              Desactivar
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Información Básica
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nombre de Empresa */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 transition-all duration-300"
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
                  className="w-full px-4 py-3 text-gray-800 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all font-medium hover:border-gray-400"
                  style={{ 
                    '--tw-ring-color': previewMode ? formData.primary_color : primaryColor 
                  }}
                  placeholder="Ingresa el nombre de la empresa"
                  required
                />
              </div>

              {/* Contacto */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 transition-all duration-300"
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
                  className="w-full px-4 py-3 text-gray-800 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all font-medium hover:border-gray-400"
                  placeholder="Nombre del contacto principal"
                  required
                />
              </div>

              {/* Dominio de Correo - Full width */}
              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 transition-all duration-300"
                    style={{ backgroundColor: previewMode ? formData.primary_color : primaryColor }}
                  >
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  Dominio de Correo Corporativo
                </label>
                <input
                  type="text"
                  name="sufijoUsuario"
                  value={formData.sufijoUsuario}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-800 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all font-mono font-medium hover:border-gray-400"
                  placeholder="@empresa.com"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Este dominio se utilizará como sufijo para las cuentas de usuario del sistema
                </p>
              </div>
            </div>
          </div>

          {/* Sección de Colores Mejorada */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    Personalización de Colores
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </h2>
                  <p className="text-sm text-gray-600">Define la identidad visual de tu sistema</p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetColors}
                className="px-4 py-2 text-sm font-semibold text-purple-700 bg-white rounded-xl hover:bg-purple-50 transition-colors border-2 border-purple-200"
              >
                Restablecer
              </button>
            </div>

            {/* Paletas Predefinidas */}
            <div className="mb-6 bg-white rounded-xl p-5 border-2 border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Paletas Predefinidas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {colorPalettes.map((palette, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applyPalette(palette)}
                    className="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-indigo-400 transition-all hover:shadow-lg"
                    title={palette.name}
                  >
                    <div className="flex h-16">
                      <div 
                        className="flex-1 transition-all group-hover:scale-110" 
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div 
                        className="flex-1 transition-all group-hover:scale-110" 
                        style={{ backgroundColor: palette.secondary }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                      <span className="text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 px-2 py-1 rounded">
                        {palette.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Configuración de Colores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Color Primario */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center text-base font-bold text-gray-800">
                    <div
                      className="w-10 h-10 rounded-lg mr-3 flex items-center justify-center border-2 border-white shadow-md transition-all duration-300"
                      style={{ backgroundColor: formData.primary_color }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    Color Primario
                  </label>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    contrastLevel === 'Excelente' ? 'bg-green-100 text-green-700' :
                    contrastLevel === 'Bueno' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {contrastLevel}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Selector Visual */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="color"
                        name="primary_color"
                        value={formData.primary_color}
                        onChange={handleChange}
                        className="w-24 h-24 cursor-pointer rounded-xl border-4 border-gray-300 hover:border-indigo-400 transition-all shadow-md hover:shadow-xl"
                        title="Selecciona el color primario"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                        <Palette className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <input
                        type="text"
                        name="primary_color"
                        value={formData.primary_color}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-gray-800 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-base font-bold uppercase hover:border-gray-400"
                        placeholder="#DC2626"
                        pattern="^#[0-9A-Fa-f]{6}$"
                        maxLength="7"
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="flex items-start gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="text-xs text-indigo-700 leading-relaxed">
                      <span className="font-semibold">Uso:</span> Botones principales, iconos destacados, encabezados y elementos de acción importantes.
                    </p>
                  </div>

                  {/* Ejemplos en vivo */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-600 block">Ejemplos en vivo:</span>
                    <button
                      type="button"
                      className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      style={{ backgroundColor: formData.primary_color }}
                    >
                      Botón Principal
                    </button>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300"
                        style={{ backgroundColor: formData.primary_color }}
                      >
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-gray-800 block">Icono de Acción</span>
                        <span className="text-xs text-gray-500">Con fondo primario</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Secundario - SIDEBAR */}
              <div className="bg-white rounded-xl p-6 border-2 border-indigo-300 shadow-md">
                <label className="flex items-center text-base font-bold text-gray-800 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg mr-3 flex items-center justify-center border-2 border-gray-300 shadow-md transition-all duration-300"
                    style={{ backgroundColor: formData.secondary_color }}
                  >
                    <div className="w-6 h-6 rounded border-2 border-gray-400/40" />
                  </div>
                  Color Secundario (Sidebar)
                </label>

                <div className="space-y-4">
                  {/* Selector Visual */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="color"
                        name="secondary_color"
                        value={formData.secondary_color}
                        onChange={handleChange}
                        className="w-24 h-24 cursor-pointer rounded-xl border-4 border-gray-300 hover:border-indigo-400 transition-all shadow-md hover:shadow-xl"
                        title="Selecciona el color secundario (aplica al sidebar)"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <Palette className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <input
                        type="text"
                        name="secondary_color"
                        value={formData.secondary_color}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-gray-800 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-base font-bold uppercase hover:border-gray-400"
                        placeholder="#E5E7EB"
                        pattern="^#[0-9A-Fa-f]{6}$"
                        maxLength="7"
                      />
                    </div>
                  </div>

                  {/* Descripción enfocada en Sidebar */}
                  <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">⭐</span>
                    </div>
                    <div>
                      <p className="text-xs text-purple-700 leading-relaxed font-semibold mb-1">
                        Este color se aplica al Sidebar
                      </p>
                      <p className="text-xs text-purple-600 leading-relaxed">
                        Úsalo también en fondos suaves, tarjetas y áreas secundarias
                      </p>
                    </div>
                  </div>

                  {/* Ejemplo de Sidebar */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-600 block">Previsualización del Sidebar:</span>
                    <div 
                      className="w-full h-32 rounded-xl shadow-lg p-4 transition-all duration-300"
                      style={{ backgroundColor: formData.secondary_color }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: formData.primary_color }}
                        >
                          <Building2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-gray-700">DREAM TEAM</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                          <div className="w-6 h-6 rounded bg-gray-300"></div>
                          <div className="h-2 bg-gray-400 rounded flex-1"></div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white/30 rounded-lg">
                          <div className="w-6 h-6 rounded bg-gray-300"></div>
                          <div className="h-2 bg-gray-400 rounded flex-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Combinación de colores */}
                  <div className="p-4 rounded-lg border-2 border-dashed border-purple-300 bg-purple-50/50">
                    <span className="text-xs font-bold text-gray-700 block mb-2">Vista combinada:</span>
                    <div className="flex gap-2 h-12">
                      <div 
                        className="flex-1 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md"
                        style={{ backgroundColor: formData.primary_color }}
                      >
                        Primario
                      </div>
                      <div 
                        className="flex-1 rounded-lg flex items-center justify-center text-gray-700 font-bold text-xs shadow-md"
                        style={{ backgroundColor: formData.secondary_color }}
                      >
                        Sidebar
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nota de Accesibilidad */}
            <div className="mt-5 p-4 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white text-lg font-bold">💡</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 mb-1">Recomendaciones de Diseño</p>
                  <ul className="text-xs text-gray-600 space-y-1 leading-relaxed">
                    <li>• <span className="font-semibold">Color Primario:</span> Usado en acciones principales y elementos destacados</li>
                    <li>• <span className="font-semibold">Color Secundario:</span> Define el aspecto del Sidebar y áreas de soporte</li>
                    <li>• <span className="font-semibold">Preview Mode:</span> Activa la vista previa para ver los cambios en tiempo real antes de guardar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  empresa: 'DREAM TEAM',
                  contacto: 'Ángel Ávalos',
                  sufijoUsuario: '@dreamteam.pe',
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
              className="px-8 py-3.5 bg-gray-200 text-gray-700 text-base font-bold rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all shadow-md hover:shadow-lg"
            >
              Descartar Cambios
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-10 py-3.5 text-white text-base font-bold rounded-xl focus:outline-none focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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