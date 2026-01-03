// frontend/src/pages/company/CompanyConfig.jsx
import { useState, useEffect } from 'react';
import { Building2, Save, User, Mail, Eye, Palette, Sparkles, Upload, X } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import companyService from '../../services/companyService';
import uploadService from '../../services/uploadService';
import toast from 'react-hot-toast';

const CompanyConfig = () => {
  const { primaryColor, secondaryColor, setColors } = useThemeStore();
  
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    domain: '',
    primary_color: primaryColor,
    secondary_color: secondaryColor,
    logo_url: '',
    active: true
  });

  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const colorPalettes = [
    { name: 'Rojo Corporativo', primary: '#dc2626', secondary: '#fee2e2' },
    { name: 'Azul Profesional', primary: '#2563eb', secondary: '#dbeafe' },
    { name: 'Verde Natural', primary: '#16a34a', secondary: '#dcfce7' },
    { name: 'Púrpura Moderno', primary: '#9333ea', secondary: '#f3e8ff' },
    { name: 'Naranja Energético', primary: '#ea580c', secondary: '#ffedd5' },
    { name: 'Índigo Elegante', primary: '#4f46e5', secondary: '#e0e7ff' },
  ];

  // Cargar datos de la empresa
  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      setInitialLoading(true);
      const response = await companyService.getMyCompany();
      const company = response.data;

      console.log('✅ Company data loaded:', company);

      setCompanyId(company.id);
      setFormData({
        name: company.name || '',
        owner: company.owner || '',
        domain: company.domain || '',
        primary_color: company.primary_color || '#dc2626',
        secondary_color: company.secondary_color || '#fee2e2',
        logo_url: company.logo_url || '',
        active: company.active !== false
      });

      // Aplicar colores guardados al tema global
      setColors(
        company.primary_color || '#dc2626',
        company.secondary_color || '#fee2e2'
      );
      
      toast.success('Configuración cargada');
    } catch (error) {
      console.error('Error loading company:', error);
      toast.error('Error al cargar la configuración de la empresa');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if ((name === 'primary_color' || name === 'secondary_color') && previewMode) {
      if (name === 'primary_color') {
        setColors(value, formData.secondary_color);
      } else {
        setColors(formData.primary_color, value);
      }
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar 5MB');
      return;
    }

    try {
      setUploadingLogo(true);
      const imageUrl = await uploadService.uploadImage(file);
      
      // Subir logo al backend
      await companyService.uploadLogo(companyId, imageUrl);
      
      setFormData(prev => ({ ...prev, logo_url: imageUrl }));
      toast.success('Logo actualizado correctamente');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Error al subir el logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!window.confirm('¿Estás seguro de eliminar el logo?')) return;

    try {
      await companyService.deleteLogo(companyId);
      setFormData(prev => ({ ...prev, logo_url: '' }));
      toast.success('Logo eliminado correctamente');
    } catch (error) {
      console.error('Error deleting logo:', error);
      toast.error('Error al eliminar el logo');
    }
  };

  const applyPalette = (palette) => {
    setFormData(prev => ({
      ...prev,
      primary_color: palette.primary,
      secondary_color: palette.secondary
    }));
    
    if (previewMode) {
      setColors(palette.primary, palette.secondary);
    }
    
    toast.success(`Paleta "${palette.name}" aplicada`);
  };

  const togglePreview = () => {
    const newPreviewMode = !previewMode;
    setPreviewMode(newPreviewMode);
    
    if (newPreviewMode) {
      setColors(formData.primary_color, formData.secondary_color);
      toast.success('Vista previa activada');
    } else {
      setColors(primaryColor, secondaryColor);
      toast.info('Vista previa desactivada');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!companyId) {
      toast.error('No se pudo identificar la empresa');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        owner: formData.owner,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        active: formData.active
      };

      console.log('📤 Updating company:', updateData);

      await companyService.updateCompany(companyId, updateData);
      
      // Aplicar colores permanentemente
      setColors(formData.primary_color, formData.secondary_color);
      setPreviewMode(false);
      
      toast.success('¡Configuración guardada exitosamente!');
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error(error.response?.data?.error || 'Error al guardar la configuración');
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
    
    toast.info('Colores restablecidos');
  };

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

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6 bg-gray-50 min-h-screen">
      <div className="w-full max-w-7xl px-4">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-l-4 border-red-600 px-6 py-5 mb-6 shadow-md rounded-tr-lg rounded-br-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Configuración de Empresa
                </h1>
                <p className="text-sm text-gray-300 mt-1">
                  Personaliza la identidad de tu sistema
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={togglePreview}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg ${
                previewMode 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Vista Activa' : 'Vista Previa'}
            </button>
          </div>
        </div>

        {/* Banner Preview */}
        {previewMode && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-green-600" />
              <div>
                <span className="text-sm font-semibold text-green-800 block">
                  Vista previa activa
                </span>
                <span className="text-xs text-green-700">
                  Los cambios se aplican en tiempo real al sidebar
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
          
          {/* Grid: Info Básica + Logo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Información Básica */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-700" />
                Información Básica
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                    placeholder="Ingresa el nombre de la empresa"
                    required
                    maxLength={200}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                    placeholder="Nombre del contacto principal"
                    maxLength={255}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Dominio de Correo Corporativo
                  </label>
                  <input
                    type="text"
                    name="domain"
                    value={formData.domain}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all font-mono"
                    placeholder="@empresa.com"
                    maxLength={100}
                    readOnly
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Este dominio se usará como sufijo para las cuentas de usuario
                  </p>
                </div>
              </div>
            </div>

            {/* Logo de la Empresa */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-700" />
                Logo
              </h2>

              {formData.logo_url ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={formData.logo_url} 
                      alt="Company Logo" 
                      className="w-full h-40 object-contain bg-gray-50 rounded-lg border-2 border-gray-300 p-4"
                    />
                    <button
                      type="button"
                      onClick={handleDeleteLogo}
                      className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                      title="Eliminar logo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 text-center">Logo actual</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {uploadingLogo ? (
                      <>
                        <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full mb-3"></div>
                        <p className="text-sm text-gray-600 font-semibold">Subiendo logo...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Subir logo
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG hasta 5MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Personalización de Colores */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                Colores del Sistema
              </h2>
              <button
                type="button"
                onClick={resetColors}
                className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-white rounded-lg hover:bg-purple-50 transition-colors border border-purple-200"
              >
                Restablecer
              </button>
            </div>

            {/* Paletas Predefinidas */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Paletas Predefinidas
              </label>
              <div className="grid grid-cols-3 gap-3">
                {colorPalettes.map((palette, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applyPalette(palette)}
                    className="group relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-indigo-400 transition-all hover:shadow-md"
                    title={palette.name}
                  >
                    <div className="flex h-14">
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

            {/* Selectores de Color */}
            <div className="grid grid-cols-2 gap-4">
              {/* Color Primario */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Color Primario
                  </label>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    contrastLevel === 'Excelente' ? 'bg-green-100 text-green-700' :
                    contrastLevel === 'Bueno' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {contrastLevel}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="color"
                    name="primary_color"
                    value={formData.primary_color}
                    onChange={handleChange}
                    className="w-16 h-16 cursor-pointer rounded-lg border-2 border-gray-300 hover:border-indigo-400 transition-all shadow-sm"
                  />
                  <input
                    type="text"
                    name="primary_color"
                    value={formData.primary_color}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono uppercase font-semibold"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    maxLength="7"
                  />
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-lg text-white font-semibold text-sm shadow-sm"
                  style={{ backgroundColor: formData.primary_color }}
                >
                  Vista Previa
                </button>
              </div>

              {/* Color Secundario */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Color Secundario (Sidebar)
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="color"
                    name="secondary_color"
                    value={formData.secondary_color}
                    onChange={handleChange}
                    className="w-16 h-16 cursor-pointer rounded-lg border-2 border-gray-300 hover:border-purple-400 transition-all shadow-sm"
                  />
                  <input
                    type="text"
                    name="secondary_color"
                    value={formData.secondary_color}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono uppercase font-semibold"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    maxLength="7"
                  />
                </div>
                <div
                  className="w-full py-2.5 rounded-lg text-gray-700 font-semibold text-sm text-center shadow-sm"
                  style={{ backgroundColor: formData.secondary_color }}
                >
                  Sidebar
                </div>
              </div>
            </div>

            {/* Vista Combinada */}
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <span className="text-sm font-semibold text-gray-700 block mb-3">Vista Combinada:</span>
              <div className="flex gap-3 h-12">
                <div 
                  className="flex-1 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ backgroundColor: formData.primary_color }}
                >
                  Primario
                </div>
                <div 
                  className="flex-1 rounded-lg flex items-center justify-center text-gray-700 font-bold text-sm shadow-sm"
                  style={{ backgroundColor: formData.secondary_color }}
                >
                  Sidebar
                </div>
              </div>
            </div>

            {/* Nota */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 leading-relaxed">
                <span className="font-semibold">💡 Tip:</span> El color primario se usa en botones y acciones principales. El secundario define el aspecto del sidebar.
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                loadCompanyData();
                if (previewMode) {
                  setColors(primaryColor, secondaryColor);
                  setPreviewMode(false);
                }
                toast.info('Cambios descartados');
              }}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-all shadow-sm"
            >
              Descartar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-8 py-2.5 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
              style={{ backgroundColor: previewMode ? formData.primary_color : primaryColor }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
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

export default CompanyConfig;